import { verifyEpic } from "@/lib/eci-apis";
import { epicSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = epicSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const result = await verifyEpic(parsed.data.epic);
  return Response.json(result);
}
