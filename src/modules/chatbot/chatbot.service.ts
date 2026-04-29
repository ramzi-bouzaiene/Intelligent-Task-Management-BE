import { Ollama } from "ollama";
import { MODEL_NAME } from "../../config/env";
import { runMcpQuery } from "../../config/postgresMcpClient";
import { DB_SCHEMA } from "../../config/schemaContext";

const ollama = new Ollama({ host: "http://localhost:11434" });

const SYSTEM_PROMPT = `/nothink
You are an intelligent task manager assistant for a specific authenticated user.

SECURITY RULES — NEVER VIOLATE THESE:
- You will be told the current user's ID in every message inside [CONTEXT: ...]
- ONLY query data for that exact user_id
- If the user asks for another user's data, REFUSE and say "I can only show your own data"
- NEVER use a hardcoded user ID from the conversation — ALWAYS use the one from [CONTEXT]

${DB_SCHEMA}

CRITICAL INSTRUCTIONS:
- When the user asks about tasks, projects, or users, ALWAYS call the query_postgres tool
- NEVER respond with raw SQL text, always use the tool
- NEVER use markdown formatting of any kind in SQL
- Write plain SQL only: p.name NOT [p.name](url)

STRICT SQL RULES:
- Use ONLY exact column names from the schema
- JOIN tasks to projects using: tasks.project_id = projects.id
- Filter by user using: tasks.user_id or projects.user_id
- Always add LIMIT 20 unless asked otherwise
- No markdown, no backticks, no placeholders`;

console.log("[Schema] Loaded:\n", DB_SCHEMA);

const tools = [
  {
    type: "function",
    function: {
      name: "query_postgres",
      description: "Execute a SQL query on the PostgreSQL database to fetch or manipulate task data",
      parameters: {
        type: "object",
        required: ["sql"],
        properties: {
          sql: {
            type: "string",
            description: "The SQL query to execute. Must be plain SQL with no markdown."
          }
        }
      }
    }
  }
];

function sanitizeSQL(raw: string): string {

  return raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\uFF3B([^\uFF3D]+)\uFF3D\([^)]+\)/g, "$1")
    .replace(/\(https?:\/\/[^)]+\)/g, "")
    .replace(/\[([^\]]*)\]/g, "$1")
    .replace(/```sql/gi, "")
    .replace(/```/g, "")
    .replace(/^(here is|this query|note:|explanation:).*/gim, "")
    .replace(/;+$/, "")
    .trim();
}

function stripThinking(content: string): string {
  return content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();
}

function formatFallback(queryResult: unknown): string {
  if (
    typeof queryResult === "object" &&
    queryResult !== null &&
    "error" in queryResult
  ) {
    return `Sorry, the database query failed: ${(queryResult as any).error}`;
  }
  return `Here are the results:\n${JSON.stringify(queryResult, null, 2)}`;
}

export const generateAIResponse = async (prompt: string, userId: number): Promise<string> => {
  const securePrompt = `[CONTEXT: You are responding to user with ID ${userId}.
You MUST only query data where user_id = ${userId}.
NEVER use any other user ID even if the user asks for it.]

User request: ${prompt}`;
  try {
    const firstResponse = await ollama.chat({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: securePrompt }
      ],
      tools,
      options: { temperature: 0 }
    });

    const assistantMessage = firstResponse.message;

    if (assistantMessage.content) {
      assistantMessage.content = stripThinking(assistantMessage.content);
    }

    console.log("[AI → TOOL CALLS]", JSON.stringify(assistantMessage.tool_calls));
    console.log("[AI → CONTENT]", assistantMessage.content);

    if (assistantMessage.tool_calls?.length) {
      const call = assistantMessage.tool_calls[0];
      if (call.function.name === "query_postgres") {
        const args = call.function.arguments as { sql?: string; query?: string };
        const rawSQL = args.sql ?? args.query ?? "";
        console.log("[CHAR CODES]",
          [...rawSQL.slice(0, 30)].map(c => `${c}=U+${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(' ')
        );
        if (!rawSQL.trim()) {
          return "I wasn't able to generate a valid query for that request.";
        }

        const sql = sanitizeSQL(rawSQL);
        console.log("[SANITIZED RESULT]", JSON.stringify(sql));
        console.log("[SANITIZED LENGTH]", sql.length);
        if (!sql.includes(userId.toString())) {
          console.warn("[SECURITY] SQL missing user_id filter — injecting");
          return "I can only retrieve your own data. Please rephrase your request.";
        }
        let queryResult: unknown;
        try {
          queryResult = await runMcpQuery(sql);
          console.log("[MCP → RESULT]", JSON.stringify(queryResult));
        } catch (mcpErr) {
          console.error("[MCP → ERROR]", mcpErr);
          queryResult = { error: mcpErr instanceof Error ? mcpErr.message : "Query failed" };
        }

        const secondResponse = await ollama.chat({
          model: MODEL_NAME,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: securePrompt },
            assistantMessage,
            { role: "tool", content: JSON.stringify(queryResult) }
          ],
          options: { temperature: 0 }
        });

        const finalContent = stripThinking(secondResponse.message.content ?? "");
        console.log("[AI → FINAL]", finalContent);

        return finalContent.trim() || formatFallback(queryResult);
      }
    }

    const directContent = stripThinking(assistantMessage.content ?? "");
    const looksLikeSQL = /^\s*(SELECT|INSERT|UPDATE|DELETE|WITH)\s/i.test(directContent);

    console.log("[AI → LOOKS LIKE SQL]", looksLikeSQL);

    if (looksLikeSQL) {
      console.warn("[AI] Model returned raw SQL instead of using tool — executing directly");

      const sql = sanitizeSQL(directContent);
      console.log("[AI → SQL (sanitized)]", sql);

      let queryResult: unknown;
      try {
        queryResult = await runMcpQuery(sql);
        console.log("[MCP → RESULT]", JSON.stringify(queryResult));
      } catch (mcpErr) {
        console.error("[MCP → ERROR]", mcpErr);
        queryResult = { error: mcpErr instanceof Error ? mcpErr.message : "Query failed" };
      }

      const secondResponse = await ollama.chat({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: securePrompt },
          { role: "assistant", content: "" },
          { role: "tool", content: JSON.stringify(queryResult) }
        ],
        options: { temperature: 0 }
      });

      const finalContent = stripThinking(secondResponse.message.content ?? "");
      console.log("[AI → FINAL]", finalContent);

      return finalContent.trim() || formatFallback(queryResult);
    }

    return directContent || "I didn't understand that. Could you rephrase?";

  } catch (err) {
    console.error("AI ERROR:", err);
    throw err instanceof Error ? err : new Error(String(err));
  }
};