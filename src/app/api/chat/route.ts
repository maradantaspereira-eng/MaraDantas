import { NextRequest } from "next/server";

const OLLAMA_BASE_URL =
  process.env.OLLAMA_HOST ?? "http://localhost:11434";

const MODEL = "gemma4";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: { role: string; content: string }[] = body.messages ?? [];

  const ollamaRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
  });

  if (!ollamaRes.ok) {
    const text = await ollamaRes.text();
    return new Response(
      JSON.stringify({ error: `Ollama error: ${ollamaRes.status} — ${text}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Forward the streaming NDJSON from Ollama directly to the client.
  return new Response(ollamaRes.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
