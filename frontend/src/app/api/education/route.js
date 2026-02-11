import { callN8n, WEBHOOKS } from "@/lib/n8n";
import { glossaryTerms, lessons } from "@/lib/mock-data";
import { NextResponse } from "next/server";

/**
 * GET /api/education?type=glossary|lessons
 * Lấy nội dung giáo dục: thuật ngữ hoặc bài học
 *
 * n8n workflow cần trả về JSON:
 * {
 *   glossary: [{ term, definition, example }],
 *   lessons: [{ id, title, category, duration, level, description }]
 * }
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      const response = {};
      if (type === "all" || type === "glossary") response.glossary = glossaryTerms;
      if (type === "all" || type === "lessons") response.lessons = lessons;
      return NextResponse.json(response);
    }

    const data = await callN8n(WEBHOOKS.EDUCATION, {
      params: { type },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Education API error:", error);
    const response = {};
    if (type === "all" || type === "glossary") response.glossary = glossaryTerms;
    if (type === "all" || type === "lessons") response.lessons = lessons;
    return NextResponse.json(response);
  }
}
