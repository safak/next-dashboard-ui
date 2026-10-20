import { runAgent } from "@/lib/agent";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await runAgent(message);

  return Response.json(result);
}