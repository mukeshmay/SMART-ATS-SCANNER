import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!jobDescription || jobDescription.trim().length === 0) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText: string;
    try {
      const { PDFParse } = await import("pdf-parse");
      const uint8Array = new Uint8Array(buffer);
      const parser = new PDFParse({ data: uint8Array });
      const pdfData = await parser.getText();
      resumeText = pdfData.text as string;
    } catch {
      return NextResponse.json(
        { error: "Failed to parse PDF. Please ensure it is a valid, text-based PDF file." },
        { status: 400 }
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF. It may be image-based or password-protected." },
        { status: 400 }
      );
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and resume coach.

TASK: First check if this document is a resume/CV. If it is NOT a resume, return ONLY this JSON:
{"isResume": false, "reason": "brief explanation"}

If it IS a resume, perform a full ATS analysis and return this JSON structure:
{
  "isResume": true,
  "atsFriendlinessScore": <number 0-100>,
  "jobMatchScore": <number 0-100>,
  "atsFriendlinessBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "structure": <number 0-100>,
    "readability": <number 0-100>
  },
  "resumeSections": [
    {
      "id": "unique-id",
      "title": "Section name (e.g. Summary, Experience, Skills)",
      "content": "The actual text content of this section from the resume",
      "status": "good|warning|critical",
      "issues": ["specific issue with this section"]
    }
  ],
  "suggestions": [
    {
      "id": "unique-id",
      "sectionId": "matching resumeSections id",
      "type": "replace|add|remove|rewrite",
      "priority": "high|medium|low",
      "title": "Short title of suggestion",
      "currentText": "Exact text to change (empty string if adding new content)",
      "suggestedText": "Replacement or new text",
      "reason": "Why this change improves ATS score or job match",
      "impact": "Expected improvement"
    }
  ],
  "missingKeywords": ["important keywords from job description not in resume"],
  "matchedKeywords": ["keywords found in both resume and job description"],
  "generalFeedback": "2-3 sentence overall assessment"
}

Rules:
- resumeSections must cover ALL major sections found in the resume
- status: "good" = no major issues, "warning" = needs improvement, "critical" = serious problem
- suggestions must be specific, actionable, and reference exact text when possible
- Analyze: formatting, keywords, achievements with metrics, action verbs, skills alignment
- Be specific about gaps between resume and job requirements

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond with ONLY valid JSON, no markdown or extra text.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content ?? "";

    let parsed: {
      isResume: boolean;
      reason?: string;
      [key: string]: unknown;
    };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Analysis failed to parse. Please try again." },
        { status: 500 }
      );
    }

    if (!parsed.isResume) {
      return NextResponse.json(
        {
          error: `This does not appear to be a resume. ${parsed.reason ?? ""}`.trim(),
          isNotResume: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, resumeText, analysis: parsed });
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
