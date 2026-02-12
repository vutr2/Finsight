import { glossaryTerms, lessons } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  const response = {};
  if (type === "all" || type === "glossary") response.glossary = glossaryTerms;
  if (type === "all" || type === "lessons") response.lessons = lessons;
  return NextResponse.json(response);
}
