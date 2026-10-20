import { generateQrSvg } from "@/lib/receipt/generateQrSvg";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url) {
    return new Response("URL missing", { status: 400 });
  }

  const svg = await generateQrSvg(url);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
