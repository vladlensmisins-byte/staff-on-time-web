import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const submissions = request.nextUrl.searchParams.get("submissions");

  if (submissions === "true") {
    return NextResponse.json({ submissions: [] });
  }

  if (date) {
    return NextResponse.json({ slots: [] });
  }

  return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  await request.json();
  return NextResponse.json({ ok: true });
}
