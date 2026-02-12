import { callN8n, ACTIONS } from '@/lib/n8n';
import { glossaryTerms, lessons } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

function getMockEducation(type) {
  const response = {};
  if (type === 'all' || type === 'glossary') response.glossary = glossaryTerms;
  if (type === 'all' || type === 'lessons') response.lessons = lessons;
  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      return NextResponse.json(getMockEducation(type));
    }

    const data = await callN8n(ACTIONS.EDUCATION, { type });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Education API error:', error);
    return NextResponse.json(getMockEducation(type));
  }
}
