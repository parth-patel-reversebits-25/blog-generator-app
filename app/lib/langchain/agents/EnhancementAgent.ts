import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

interface EnhancementContext {
  selectedText: string;
  userRequest: string;
  fullContent: string;
  topic: string;
  audience: string;
}

export class EnhancementAgent {
  private llm: ChatOpenAI;
  private outputParser: StringOutputParser;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 4000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.outputParser = new StringOutputParser();
  }

  private cleanMarkdownArtifacts(content: string): string {
    // Remove markdown code block markers
    let cleaned = content.replace(/```html\s*/gi, '');
    cleaned = cleaned.replace(/```\s*$/g, '');
    cleaned = cleaned.replace(/^\s*```\s*/gm, '');
    
    // Remove any remaining markdown artifacts
    cleaned = cleaned.replace(/^\s*```[a-zA-Z]*\s*/gm, '');
    
    return cleaned.trim();
  }

  async enhanceContent(context: EnhancementContext): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
You are an expert HTML content editor. You will receive the full HTML content of a blog post and a user's request to modify a specific selected text within it.

**TASK:**
Modify the HTML content according to the user's request for the selected text. Return the COMPLETE modified HTML content.

**CONTEXT:**
- Blog Topic: {topic}
- Target Audience: {audience}
- User Selected Text: "{selectedText}"
- User Request: "{userRequest}"

**INSTRUCTIONS:**
1. Find the selected text within the full HTML content
2. Apply the user's requested modification (remove, enhance, rewrite, add details, etc.)
3. Return the COMPLETE HTML content with the modification applied
4. Maintain all HTML structure, formatting, and styling
5. Ensure the modification fits naturally with the surrounding content
6. Return ONLY clean HTML content without any markdown formatting, code blocks, or wrapper text
7. Do not include \`\`\`html or \`\`\` markers anywhere in the response

**FULL HTML CONTENT:**
{fullContent}

**USER REQUEST:** {userRequest}
**SELECTED TEXT:** {selectedText}

Return the complete modified HTML content:
`);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);

    const result = await chain.invoke({
      topic: context.topic,
      audience: context.audience,
      selectedText: context.selectedText,
      userRequest: context.userRequest,
      fullContent: context.fullContent,
    });

    return this.cleanMarkdownArtifacts(result);
  }
}