import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { DeafultPrompt } from "@/app/lib/DefaultPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      topic,
      audience,
      mainProblem,
      tone,
      evidence,
      practical,
      analytical,
      speculative,
      contextual,
      engagement,
    } = await request.json();
    console.log("I am invoked...! part 1");
    // Validate required fields
    if (!topic || !mainProblem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("I am invoked...! part 2");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical content writer who specializes in creating exceptional engineering blog posts using Robert Roskam's 6-pillar framework. You create comprehensive, research-backed content that combines evidence, practical guidance, analytical depth, speculative insights, contextual understanding, and engagement techniques. Always write in clean, semantic HTML format with proper headings, formatting, and structure. Return only HTML content without any markdown.",
        },
        {
          role: "user",
          content: DeafultPrompt({
            topic,
            audience,
            mainProblem,
            tone,
            evidence,
            practical,
            analytical,
            speculative,
            contextual,
            engagement,
          }),
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });
    console.log("I am invoked...! part 3");

    const content = completion.choices[0]?.message?.content;
    console.log("Chat GPT content:", content);
    if (!content) {
      throw new Error("No content generated");
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating blog content:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate blog content. Please try again." },
      { status: 500 }
    );
  }
}
