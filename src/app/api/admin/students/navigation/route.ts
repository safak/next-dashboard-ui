import { NextResponse } from "next/server";
import { getStudentNavigationCounts } from "@/services/student-navigation.service";

export async function GET() {
  try {
    const counts = await getStudentNavigationCounts();

    return NextResponse.json(counts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load navigation counts.",
      },
      {
        status: 500,
      },
    );
  }
}