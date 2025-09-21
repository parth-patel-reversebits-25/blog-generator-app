import { type NextRequest } from "next/server";
import { BlogGeneratorOrchestrator } from "@/app/lib/langchain/BlogGeneratorOrchestrator";

export async function POST(request: NextRequest) {
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
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const orchestrator = new BlogGeneratorOrchestrator();
        
        const progressCallback = (step: string, progress: number) => {
          const data = `data: ${JSON.stringify({ step, progress })}\n\n`;
          controller.enqueue(encoder.encode(data));
        };
        
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
        }, progressCallback);
        
        if (!content) {
          throw new Error("No content generated");
        }

        const finalData = `data: ${JSON.stringify({ content, completed: true })}\n\n`;
        controller.enqueue(encoder.encode(finalData));
        controller.close();
      } catch (error) {
        console.error("Error generating blog content:", error);
        
        const errorMessage = error instanceof Error && error.message.includes("API key")
          ? "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables."
          : "Failed to generate blog content. Please try again.";
        
        const errorData = `data: ${JSON.stringify({ error: errorMessage })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
