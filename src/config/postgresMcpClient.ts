/**
 * postgres-mcp SSE client — correct async protocol implementation
 *
 * MCP SSE protocol:
 * 1. GET /sse          → opens SSE stream, receives "endpoint" event with POST URL
 * 2. POST {endpoint}   → send JSON-RPC request (returns 202, NOT the response)
 * 3. SSE stream        → delivers the JSON-RPC response asynchronously
 */

import { EventEmitter } from "events";

const MCP_BASE = process.env.MCP_URL ?? "http://localhost:8001";

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class McpSseClient extends EventEmitter {
  private postUrl: string | null = null;
  private messageId = 0;
  private pending = new Map<number, PendingRequest>();
  private initialized = false;
  private connecting: Promise<void> | null = null;
  private sseReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  async connect(): Promise<void> {
    if (this.initialized) return;
    if (this.connecting) return this.connecting;

    this.connecting = this._connect();
    return this.connecting;
  }

  private async _connect(): Promise<void> {
    console.log("[MCP SSE] Connecting to", MCP_BASE);

    const res = await fetch(`${MCP_BASE}/sse`, {
      headers: { Accept: "text/event-stream" },
    });

    if (!res.ok) throw new Error(`SSE connect failed: ${res.status}`);

    this.sseReader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const readStream = async () => {
      while (true) {
        const { done, value } = await this.sseReader!.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventType = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            this._handleSseMessage(eventType, data);
            eventType = "";
          }
        }
      }
    };

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Timeout waiting for SSE endpoint")), 10_000);

      this.once("endpoint", (url: string) => {
        clearTimeout(timeout);
        this.postUrl = url;
        console.log("[MCP SSE] Post URL:", this.postUrl);
        resolve();
      });

      readStream().catch(reject);
    });

    await this._initialize();
  }

  private _handleSseMessage(event: string, data: string) {
    if (event === "endpoint") {
      const url = data.startsWith("http") ? data : `${MCP_BASE}${data}`;
      this.emit("endpoint", url);
      return;
    }

    try {
      const json = JSON.parse(data);

      if (json.id !== undefined && this.pending.has(json.id)) {
        const { resolve, reject } = this.pending.get(json.id)!;
        this.pending.delete(json.id);

        if (json.error) {
          reject(new Error(`MCP error: ${JSON.stringify(json.error)}`));
        } else {
          resolve(json.result);
        }
      }
    } catch {
      console.warn("[MCP SSE] Failed to parse message:", data);
    }
  }

  private async _sendRequest(method: string, params: object): Promise<any> {
    const id = ++this.messageId;

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`MCP timeout for '${method}' id=${id}`));
      }, 30_000);

      this.pending.set(id, {
        resolve: (v) => { clearTimeout(timeout); resolve(v); },
        reject: (e) => { clearTimeout(timeout); reject(e); },
      });

      const res = await fetch(this.postUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
      }).catch((err) => {
        this.pending.delete(id);
        clearTimeout(timeout);
        reject(err);
        return null;
      });

      if (res && !res.ok) {
        const text = await res.text();
        this.pending.delete(id);
        clearTimeout(timeout);
        reject(new Error(`MCP POST failed ${res.status}: ${text}`));
      }
    });
  }

  private async _initialize(): Promise<void> {
    await this._sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "task-manager", version: "1.0.0" },
    });

    await fetch(this.postUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    });

    this.initialized = true;
    console.log("[MCP SSE] Initialized");
  }

  async toolCall(name: string, args: object): Promise<any> {
    await this.connect();
    return this._sendRequest("tools/call", { name, arguments: args });
  }
}

const client = new McpSseClient();

export async function runMcpQuery(sql: string): Promise<any> {
  console.log("[MCP → SQL]", sql);

  const result = await client.toolCall("execute_sql", { sql });

  console.log("[MCP → RAW RESULT]", JSON.stringify(result));

  const text = result?.content?.[0]?.text;
  if (text) {
    try { return JSON.parse(text); }
    catch { return { raw: text }; }
  }

  return result;
}