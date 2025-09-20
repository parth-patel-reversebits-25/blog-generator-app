import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export class BlogSectionAgent {
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

  async generateSection(sectionType: string, elements: string[], context: any): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`
You are an expert technical content writer specializing in the {sectionType} pillar of Robert Roskam's 6-pillar framework.

Context:
- Topic: {topic}
- Audience: {audience}
- Main Problem: {mainProblem}
- Tone: {tone}

Selected Elements: {elements}

Generate detailed content for the {sectionType} section based on the selected elements. 
Focus on creating actionable, specific, and valuable content that addresses the main problem for the target audience.

Return only the content without any wrapper text or explanations.
`);

    const chain = prompt.pipe(this.llm).pipe(this.outputParser);

    return await chain.invoke({
      sectionType,
      elements: elements.join(", "),
      topic: context.topic,
      audience: context.audience,
      mainProblem: context.mainProblem,
      tone: context.tone,
    });
  }
}