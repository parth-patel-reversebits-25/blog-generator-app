import { type NextRequest, NextResponse } from "next/server";
import { BlogGeneratorOrchestrator } from "@/app/lib/langchain/BlogGeneratorOrchestrator";

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

    // Validate required fields
    if (!topic || !mainProblem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orchestrator = new BlogGeneratorOrchestrator();
    
    const content = await orchestrator.generateBlog({
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
    });
    
    console.log("LangChain generated content:", content);
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
