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

  private cleanMarkdownArtifacts(content: string): string {
    // Remove markdown code block markers
    let cleaned = content.replace(/```html\s*/gi, '');
    cleaned = cleaned.replace(/```\s*$/g, '');
    cleaned = cleaned.replace(/^\s*```\s*/gm, '');
    
    // Remove any remaining markdown artifacts
    cleaned = cleaned.replace(/^\s*```[a-zA-Z]*\s*/gm, '');
    
    // Remove underline tags
    cleaned = cleaned.replace(/<u>/gi, '');
    cleaned = cleaned.replace(/<\/u>/gi, '');
    
    return cleaned.trim();
  }

  async generateBlog(params: BlogGenerationParams, progressCallback?: (step: string, progress: number) => void): Promise<string> {
    const context = {
      topic: params.topic,
      audience: params.audience,
      mainProblem: params.mainProblem,
      tone: params.tone,
    };

    const toneDescription = getToneDescription(params.tone);
    
    progressCallback?.("🔍 Analyzing your requirements and setting up agents...", 10);
    await new Promise(resolve => setTimeout(resolve, 500));

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
- Return ONLY HTML content without any markdown formatting, code blocks, or wrapper text
- Do not include code block markers anywhere in the response
- Do not use underline tags or underline formatting
- Create a compelling title and introduction
- Organize content logically with clear sections
- Include practical examples, code snippets, and actionable insights
- Maintain the specified tone throughout
- Address the primary problem comprehensively
- Target the specified audience level

Generate the complete blog post now.
`);

    // Generate content for each section using specialized agents with progress updates
    progressCallback?.("📊 Evidence Agent: Gathering research and statistics...", 20);
    const evidenceContent = await this.evidenceAgent.generateEvidenceContent(params.evidence, context);
    
    progressCallback?.("⚙️ Practical Agent: Creating actionable guidance...", 35);
    const practicalContent = await this.practicalAgent.generatePracticalContent(params.practical, context);
    
    progressCallback?.("🧠 Analytical Agent: Developing deep insights...", 50);
    const analyticalContent = await this.analyticalAgent.generateAnalyticalContent(params.analytical, context);
    
    progressCallback?.("🔮 Speculative Agent: Exploring future trends...", 65);
    const speculativeContent = await this.speculativeAgent.generateSpeculativeContent(params.speculative, context);
    
    progressCallback?.("🌍 Contextual Agent: Adding industry perspective...", 75);
    const contextualContent = await this.contextualAgent.generateContextualContent(params.contextual, context);
    
    progressCallback?.("✨ Engagement Agent: Crafting compelling narrative...", 85);
    const engagementContent = await this.engagementAgent.generateEngagementContent(params.engagement, context);

    progressCallback?.("📝 Master Writer: Assembling your exceptional blog...", 95);
    const chain = finalPrompt.pipe(this.llm).pipe(this.outputParser);

    const result = await chain.invoke({
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

    progressCallback?.("🎉 Finalizing and polishing your content...", 100);
    
    // Clean up any markdown artifacts
    return this.cleanMarkdownArtifacts(result);
  }
}