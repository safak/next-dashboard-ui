import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, status } = body;

    if (!id || !status) {
      return Response.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Update Status Error:", error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}