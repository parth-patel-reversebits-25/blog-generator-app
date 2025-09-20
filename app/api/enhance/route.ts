import { type NextRequest, NextResponse } from "next/server";
import { EnhancementAgent } from "@/app/lib/langchain/agents/EnhancementAgent";

export async function POST(request: NextRequest) {
  try {
    const {
      selectedText,
      userRequest,
      fullContent,
      topic,
      audience,
    } = await request.json();

    // Validate required fields
    if (!selectedText || !userRequest) {
      return NextResponse.json(
        { error: "Missing selected text or enhancement request" },
        { status: 400 }
      );
    }

    const enhancementAgent = new EnhancementAgent();
    
    const enhancedContent = await enhancementAgent.enhanceContent({
      selectedText,
      userRequest,
      fullContent,
      topic,
      audience,
    });
    
    if (!enhancedContent) {
      throw new Error("No enhanced content generated");
    }

    return NextResponse.json({ enhancedContent });
  } catch (error) {
    console.error("Error enhancing content:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to enhance content. Please try again." },
      { status: 500 }
    );
  }
}