export const generateSystemPrompt = (context: string): string => {
  return `You are an assistant for a task management application. Use the following context to answer the user's question:\n\n${context}`;
}