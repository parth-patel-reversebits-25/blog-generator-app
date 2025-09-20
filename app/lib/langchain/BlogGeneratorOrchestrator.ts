import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { EvidenceAgent } from "./agents/EvidenceAgent";
import { PracticalAgent } from "./agents/PracticalAgent";
import { AnalyticalAgent } from "./agents/AnalyticalAgent";
import { SpeculativeAgent } from "./agents/SpeculativeAgent";
import { ContextualAgent } from "./agents/ContextualAgent";
import { EngagementAgent } from "./agents/EngagementAgent";
import { getToneDescription } from "@/app/utils/getToneDescription";

interface BlogGenerationParams {
  topic: string;
  audience: string;
  mainProblem: string;
  tone: string;
  evidence: string[];
  practical: string[];
  analytical: string[];
  speculative: string[];
  contextual: string[];
  engagement: string[];
}

export class BlogGeneratorOrchestrator {
  private evidenceAgent: EvidenceAgent;
  private practicalAgent: PracticalAgent;
  private analyticalAgent: AnalyticalAgent;
  private speculativeAgent: SpeculativeAgent;
  private contextualAgent: ContextualAgent;
  private engagementAgent: EngagementAgent;
  private llm: ChatOpenAI;
  private outputParser: StringOutputParser;

  constructor() {
    this.evidenceAgent = new EvidenceAgent();
    this.practicalAgent = new PracticalAgent();
    this.analyticalAgent = new AnalyticalAgent();
    this.speculativeAgent = new SpeculativeAgent();
    this.contextualAgent = new ContextualAgent();
    this.engagementAgent = new EngagementAgent();
    
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 4000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.outputParser = new StringOutputParser();
  }

  async generateBlog(params: BlogGenerationParams): Promise<string> {
    const context = {
      topic: params.topic,
      audience: params.audience,
      mainProblem: params.mainProblem,
      tone: params.tone,
    };

    const toneDescription = getToneDescription(params.tone);

    const finalPrompt = PromptTemplate.fromTemplate(`
You are an expert technical content writer who specializes in creating exceptional engineering blog posts using Robert Roskam's 6-pillar framework.

**BLOG REQUIREMENTS:**
- **Topic:** {topic}
- **Target Audience:** {audience}
- **Primary Problem to Solve:** {mainProblem}
- **Writing Tone:** {toneDescription}

**CONTENT STRUCTURE REQUIREMENTS:**
Create a comprehensive blog post that incorporates the following elements based on the 6-pillar framework:

**1. EVIDENCE & RESEARCH SECTION:**
{evidenceContent}

**2. PRACTICAL ELEMENTS SECTION:**
{practicalContent}

**3. ANALYTICAL DEPTH SECTION:**
{analyticalContent}

**4. SPECULATIVE & FUTURE-FOCUSED SECTION:**
{speculativeContent}

**5. CONTEXTUAL UNDERSTANDING SECTION:**
{contextualContent}

**6. ENGAGEMENT & STYLE SECTION:**
{engagementContent}

**OUTPUT REQUIREMENTS:**
- Write in clean, semantic HTML format with proper headings, formatting, and structure
- Return only HTML content without any markdown
- Create a compelling title and introduction
- Organize content logically with clear sections
- Include practical examples, code snippets, and actionable insights
- Maintain the specified tone throughout
- Address the primary problem comprehensively
- Target the specified audience level

Generate the complete blog post now.
`);

    // Generate content for each section using specialized agents
    const [evidenceContent, practicalContent, analyticalContent, speculativeContent, contextualContent, engagementContent] = await Promise.all([
      this.evidenceAgent.generateEvidenceContent(params.evidence, context),
      this.practicalAgent.generatePracticalContent(params.practical, context),
      this.analyticalAgent.generateAnalyticalContent(params.analytical, context),
      this.speculativeAgent.generateSpeculativeContent(params.speculative, context),
      this.contextualAgent.generateContextualContent(params.contextual, context),
      this.engagementAgent.generateEngagementContent(params.engagement, context),
    ]);

    const chain = finalPrompt.pipe(this.llm).pipe(this.outputParser);

    return await chain.invoke({
      topic: params.topic,
      audience: params.audience,
      mainProblem: params.mainProblem,
      toneDescription,
      evidenceContent,
      practicalContent,
      analyticalContent,
      speculativeContent,
      contextualContent,
      engagementContent,
    });
  }
}