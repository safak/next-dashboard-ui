import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getDashboardData } from "@/services/dashboard.service";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const dashboard = await getDashboardData();

    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard.",
      },
      { status: 500 }
    );
  }
}