import { NextResponse } from "next/server";

export async function GET() {
  try {
    const PLACE_ID = process.env.GOOGLE_PLACE_ID;
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!PLACE_ID || !API_KEY) {
      return NextResponse.json(
        { error: "Missing Google API credentials" },
        { status: 500 }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`;

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    const reviews =
      data?.result?.reviews
        ?.filter((r: any) => r.text && r.text.trim().length > 0)
        .map((r: any) => ({
          author_name: r.author_name,
          text: r.text,
          rating: r.rating,
        })) ?? [];

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Google Reviews Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Google reviews" },
      { status: 500 }
    );
  }
}
