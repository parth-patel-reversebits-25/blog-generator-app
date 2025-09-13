import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

    // Validate required fields
    if (!topic || !audience || !mainProblem) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buildPromptSection = (
      title: string,
      items: string[],
      descriptions: Record<string, string>
    ) => {
      if (!items || items.length === 0) return "";

      const selectedItems = items
        .map((item) => `- ${descriptions[item] || item}`)
        .join("\n");
      return `\n\n**${title}:**\n${selectedItems}`;
    };

    const evidenceDescriptions = {
      stats: "Include current statistics and benchmarks",
      research: "Reference recent research and studies",
      examples: "Provide real-world examples",
      "expert-quotes": "Include expert opinions and quotes",
      "case-studies": "Add industry case studies",
    };

    const practicalDescriptions = {
      "step-by-step": "Provide step-by-step instructions",
      frameworks: "Include frameworks and mental models",
      "code-examples": "Add code examples and snippets",
      checklists: "Create actionable checklists",
      tools: "Recommend tools and resources",
    };

    const analyticalDescriptions = {
      comparisons: "Compare different technologies/approaches",
      "trade-offs": "Analyze trade-offs",
      "root-causes": "Perform root cause analysis",
      limitations: "Discuss limitations and constraints",
      counterarguments: "Present counterarguments and alternative views",
    };

    const speculativeDescriptions = {
      trends: "Discuss future trends and predictions",
      scenarios: "Explore best/worst case scenarios",
      "thought-experiments": "Include thought experiments",
    };

    const contextualDescriptions = {
      history: "Provide historical context and evolution",
      industry: "Add industry context and trends",
      culture: "Include cultural and organizational perspectives",
      ethics: "Discuss ethical considerations",
    };

    const engagementDescriptions = {
      metaphors: "Use metaphors and analogies",
      questions: "Include thought-provoking questions",
      stories: "Add personal stories and anecdotes",
      benefits: "Use benefits-forward language",
    };

    const toneMap = {
      professional: "Professional & Authoritative",
      conversational: "Conversational & Approachable",
      provocative: "Provocative & Thought-provoking",
      educational: "Educational & Explanatory",
    };

    const audienceMap = {
      "junior-developers": "Junior Developers",
      "senior-engineers": "Senior Engineers",
      "engineering-managers": "Engineering Managers",
      "technical-leads": "Technical Leads",
      architects: "Solution Architects",
      "mixed-technical": "Mixed Technical Audience",
    };

    // Helper functions to build detailed sections based on selected elements
    const buildEvidenceSection = (evidence: string[]) => {
      if (!evidence || evidence.length === 0)
        return "No evidence elements selected.";

      const sections = evidence.map((item) => {
        switch (item) {
          case "stats":
            return `**[Current Statistics & Benchmarks SELECTED]**
- **What to Include:** Relevant data points, performance metrics, benchmarks, quantitative measurements
- **Content Requirements:** 
  - Include specific numbers with context (e.g., "reduced latency by 34%", "improved throughput to 10,000 requests/second")
  - Source recent industry reports, performance studies, or your own measurements
  - Compare before/after metrics when discussing improvements
- **Example:** "Our migration reduced latency by 34% and improved throughput to 10,000 requests/second, based on 3 months of production data"`;

          case "research":
            return `**[Recent Research & Studies SELECTED]**
- **What to Include:** Academic papers, industry research, recent findings from reputable sources
- **Content Requirements:**
  - Reference specific studies with publication dates and authors
  - Link to original research papers or authoritative sources
  - Explain research methodology and sample sizes when relevant
- **Example:** "According to a 2024 Stack Overflow Developer Survey of 90,000 developers, 67% reported that microservices increased system complexity"`;

          case "examples":
            return `**[Real-world Examples SELECTED]**
- **What to Include:** Specific, concrete instances that transform abstract concepts into relatable scenarios
- **Content Requirements:**
  - Move beyond generic examples to specific, detailed cases
  - Include actual company names, technologies, or situations when possible
  - Show the transformation: abstract concept → concrete example
- **Example:** Instead of "Use proper error handling" → "When our payment processor timeout increased from 5s to 30s, we saw a 23% drop in successful transactions"`;

          case "expert-quotes":
            return `**[Expert Opinions & Quotes SELECTED]**
- **What to Include:** Statements from industry authorities, respected practitioners, or domain experts
- **Content Requirements:**
  - Quote recognized experts in your field (CTOs, principal engineers, authors, speakers)
  - Include their credentials and why their opinion matters
  - Use direct quotes with proper attribution
- **Example:** "As Martin Fowler notes in his microservices article: 'The microservice approach to division is different, splitting up into services organized around business capability'"`;

          case "case-studies":
            return `**[Industry Case Studies SELECTED]**
- **What to Include:** Real implementation experiences from companies, including failures and lessons learned
- **Content Requirements:**
  - Detail the complete journey: problem → approach → obstacles → solution → results
  - Include both successes and failures for credibility
  - Mention specific companies, technologies, and outcomes when possible
- **Example:** "Netflix's migration from monolith to microservices took 7 years, involved 500+ services, and required building an entirely new infrastructure stack including Eureka, Hystrix, and Ribbon"`;

          default:
            return `**[${item} SELECTED]** - Include relevant evidence and research elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const buildPracticalSection = (practical: string[]) => {
      if (!practical || practical.length === 0)
        return "No practical elements selected.";

      const sections = practical.map((item) => {
        switch (item) {
          case "step-by-step":
            return `**[Step-by-step Instructions SELECTED]**
- **What to Include:** Sequential, executable instructions that readers can follow
- **Content Requirements:**
  - Break complex procedures into numbered, digestible steps
  - Include prerequisites, expected outcomes, and troubleshooting steps
  - Provide commands, configurations, or specific actions
- **Example:** "1. Install Docker (requires v20.10+), 2. Create Dockerfile with multi-stage build, 3. Configure docker-compose.yml with health checks, 4. Run \`docker-compose up --build\` and verify endpoints"`;

          case "frameworks":
            return `**[Frameworks & Mental Models SELECTED]**
- **What to Include:** Structured approaches readers can apply to similar problems
- **Content Requirements:**
  - Create memorable, reusable thinking frameworks
  - Provide clear criteria for when to use each approach
  - Make frameworks transferable across different contexts
- **Example:** "The 3-Layer Debugging Framework: Layer 1 - Symptoms (what's broken?), Layer 2 - Systems (which component?), Layer 3 - Sources (root cause in code/config)"`;

          case "code-examples":
            return `**[Code Examples & Snippets SELECTED]**
- **What to Include:** Working code that demonstrates concepts in action
- **Content Requirements:**
  - Provide complete, runnable examples, not pseudo-code
  - Include error handling and edge cases
  - Comment complex sections and explain why, not just what
- **Example:** Complete function implementations with input/output examples, configuration files, or API integration code`;

          case "checklists":
            return `**[Actionable Checklists SELECTED]**
- **What to Include:** Concrete items readers can immediately implement or verify
- **Content Requirements:**
  - Create specific, measurable checklist items
  - Include verification criteria (how to know if it's done correctly)
  - Organize by priority or implementation order
- **Example:** "Pre-deployment checklist: ✓ All tests pass (>95% coverage), ✓ Performance benchmarks within 10% of baseline, ✓ Security scan shows 0 high/critical issues"`;

          case "tools":
            return `**[Tools & Resources SELECTED]**
- **What to Include:** Specific tools, libraries, documentation, or further reading materials
- **Content Requirements:**
  - Provide direct links with brief descriptions
  - Include version numbers and compatibility information
  - Explain when and why to use each tool
- **Example:** "Essential tools: Prometheus (metrics collection), Grafana (visualization), kubectl (Kubernetes management), Helm (package management)"`;

          default:
            return `**[${item} SELECTED]** - Include relevant practical elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const buildAnalyticalSection = (analytical: string[]) => {
      if (!analytical || analytical.length === 0)
        return "No analytical elements selected.";

      const sections = analytical.map((item) => {
        switch (item) {
          case "comparisons":
            return `**[Technology/Approach Comparisons SELECTED]**
- **What to Include:** Side-by-side analysis of different solutions, technologies, or methodologies
- **Content Requirements:**
  - Create comparison matrices with specific criteria
  - Include performance, complexity, cost, and maintenance factors
  - Recommend when to use each approach
- **Example:** "GraphQL vs REST API comparison: GraphQL excels in mobile apps (reduces over-fetching by 40%), REST better for caching and CDN optimization (3x faster cache hits)"`;

          case "trade-offs":
            return `**[Trade-off Analysis SELECTED]**
- **What to Include:** Honest examination of advantages against disadvantages
- **Content Requirements:**
  - Quantify trade-offs with specific metrics when possible
  - Include development time, maintenance costs, team learning curves
  - Address short-term vs long-term implications
- **Example:** "Microservices trade-offs: +40% development velocity after 6 months, but +200% infrastructure complexity and $50k additional monthly hosting costs"`;

          case "root-causes":
            return `**[Root Cause Analysis SELECTED]**
- **What to Include:** Deep exploration of underlying factors, not just surface symptoms
- **Content Requirements:**
  - Use systematic approaches (5 Whys, Fishbone diagrams, etc.)
  - Distinguish between proximate and ultimate causes
  - Address systemic issues, not just technical ones
- **Example:** "Why microservices fail: Not due to technology complexity (symptom), but because teams lack DevOps maturity and service ownership clarity (root causes)"`;

          case "limitations":
            return `**[Limitations & Constraints SELECTED]**
- **What to Include:** Honest discussion of boundaries, edge cases, and when solutions don't apply
- **Content Requirements:**
  - Define specific scenarios where your approach fails
  - Include technical, organizational, and resource constraints
  - Prevent misapplication by being explicit about boundaries
- **Example:** "This caching strategy works for read-heavy workloads (<10% writes), teams with strong Redis expertise, and budgets allowing 2x memory overhead"`;

          case "counterarguments":
            return `**[Counterarguments & Alternative Views SELECTED]**
- **What to Include:** Address opposing viewpoints or alternative approaches respectfully
- **Content Requirements:**
  - Present strongest version of opposing arguments
  - Explain why you disagree with evidence, not dismissal
  - Acknowledge when alternatives might be better
- **Example:** "Some argue event sourcing is overengineering. They're right for simple CRUD applications, but wrong for audit-heavy systems where regulatory compliance requires complete change history"`;

          default:
            return `**[${item} SELECTED]** - Include relevant analytical elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const buildSpeculativeSection = (speculative: string[]) => {
      if (!speculative || speculative.length === 0)
        return "No speculative elements selected.";

      const sections = speculative.map((item) => {
        switch (item) {
          case "trends":
            return `**[Future Trends & Predictions SELECTED]**
- **What to Include:** Thoughtful analysis of how current developments might evolve
- **Content Requirements:**
  - Base predictions on current evidence and logical extrapolation
  - Include timeline estimates and confidence levels
  - Connect trends to practical implications for readers
- **Example:** "WebAssembly will likely reshape frontend architecture within 3 years, enabling C++/Rust in browsers and reducing JavaScript bundle sizes by 60-80%"`;

          case "scenarios":
            return `**[Best/Worst Case Scenarios SELECTED]**
- **What to Include:** Explore potential outcomes to test ideas and prepare for contingencies
- **Content Requirements:**
  - Define specific, measurable scenarios
  - Include probability estimates and early warning signs
  - Provide actionable responses for each scenario
- **Example:** "Best case: AI code generation increases developer productivity 3x. Worst case: It creates massive technical debt as junior developers can't debug generated code"`;

          case "thought-experiments":
            return `**[Thought Experiments SELECTED]**
- **What to Include:** Hypothetical situations that illuminate complex concepts or challenge assumptions
- **Content Requirements:**
  - Create compelling "what if" scenarios that feel realistic
  - Use thought experiments to explore principles, not just possibilities
  - Connect back to practical insights for current work
- **Example:** "What if we designed databases like version control systems? Every record would have commit history, branches for concurrent edits, and merge conflicts for data consistency"`;

          default:
            return `**[${item} SELECTED]** - Include relevant speculative elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const buildContextualSection = (contextual: string[]) => {
      if (!contextual || contextual.length === 0)
        return "No contextual elements selected.";

      const sections = contextual.map((item) => {
        switch (item) {
          case "history":
            return `**[Historical Context & Evolution SELECTED]**
- **What to Include:** How technologies, practices, or problems have evolved over time
- **Content Requirements:**
  - Trace the progression of ideas and solutions
  - Explain why changes happened and what drove adoption
  - Connect historical lessons to current decisions
- **Example:** "We moved from monoliths (1990s) to SOA (2000s) to microservices (2010s) to serverless (2020s), each solving the previous approach's scaling limitations while introducing new complexity"`;

          case "industry":
            return `**[Industry Context & Trends SELECTED]**
- **What to Include:** Position your topic within broader business or technical ecosystems
- **Content Requirements:**
  - Show how your topic relates to current industry challenges
  - Include market forces, competitive pressures, and business drivers
  - Connect technical decisions to business outcomes
- **Example:** "The shift to event-driven architecture isn't just technical—it's driven by business needs for real-time personalization, which increases conversion rates by 20-30%"`;

          case "culture":
            return `**[Cultural & Organizational Perspectives SELECTED]**
- **What to Include:** How different teams, companies, or regions approach similar problems
- **Content Requirements:**
  - Acknowledge that solutions vary based on organizational context
  - Include startup vs enterprise, geographic, and team culture factors
  - Avoid one-size-fits-all recommendations
- **Example:** "Silicon Valley startups favor 'move fast and break things', while financial institutions prioritize 'secure and compliant first'—both approaches are correct for their contexts"`;

          case "ethics":
            return `**[Ethical Considerations SELECTED]**
- **What to Include:** Potential moral implications, especially for AI, data privacy, or user impact
- **Content Requirements:**
  - Address potential negative consequences of technical decisions
  - Consider impact on users, society, and marginalized groups
  - Suggest ethical frameworks for decision-making
- **Example:** "A/B testing can optimize conversion rates, but also manipulate user behavior. Consider implementing ethical guidelines: transparent disclosure, user control, and avoiding exploitation of cognitive biases"`;

          default:
            return `**[${item} SELECTED]** - Include relevant contextual elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const buildEngagementSection = (engagement: string[]) => {
      if (!engagement || engagement.length === 0)
        return "No engagement elements selected.";

      const sections = engagement.map((item) => {
        switch (item) {
          case "metaphors":
            return `**[Metaphors & Analogies SELECTED]**
- **What to Include:** Connect complex technical concepts to familiar experiences
- **Content Requirements:**
  - Choose metaphors that accurately represent the technical concept
  - Use experiences common to your target audience
  - Extend metaphors consistently throughout explanations
- **Example:** "Database indexing works like a library card catalog—instead of searching every book (table scan), you look up the topic in the catalog (index) to find the exact shelf location (row pointer)"`;

          case "questions":
            return `**[Thought-provoking Questions SELECTED]**
- **What to Include:** Questions that prompt reflection and deeper consideration
- **Content Requirements:**
  - Ask questions that don't have obvious answers
  - Connect to readers' real-world challenges and decisions
  - Use questions to transition between sections or introduce new concepts
- **Example:** "Before optimizing for scale, ask yourself: What does 'success' actually look like? Is it handling 10x traffic, or serving users 10x better?"`;

          case "stories":
            return `**[Personal Stories & Anecdotes SELECTED]**
- **What to Include:** Brief, relevant experiences that illustrate points or create connection
- **Content Requirements:**
  - Keep stories concise and directly relevant to the technical point
  - Include lessons learned or insights gained
  - Balance vulnerability with professionalism
- **Example:** "I once spent 3 days debugging a 'network issue' that turned out to be a single-character typo in a configuration file. That's when I learned the value of infrastructure as code—no more manual config changes"`;

          case "benefits":
            return `**[Benefits-forward Language SELECTED]**
- **What to Include:** Lead with outcomes and value, not just technical features
- **Content Requirements:**
  - Start sections with the value proposition
  - Focus on what readers will gain, not just how things work
  - Use active voice and outcome-focused language
- **Example:** Instead of "Implement blue-green deployments" → "Eliminate deployment anxiety and enable fearless releases with blue-green deployments"`;

          default:
            return `**[${item} SELECTED]** - Include relevant engagement elements.`;
        }
      });

      return sections.join("\n\n");
    };

    const getToneDescription = (tone: string) => {
      switch (tone) {
        case "professional":
          return `**Professional & Authoritative:** Use precise technical language, cite authoritative sources, maintain formal structure. Focus on expertise and credibility.`;
        case "conversational":
          return `**Conversational & Approachable:** Write as if explaining to a colleague, use "you" and "we", include casual observations. Make complex topics accessible.`;
        case "provocative":
          return `**Provocative & Thought-provoking:** Challenge conventional wisdom, ask hard questions, present controversial viewpoints respectfully. Stimulate debate and reflection.`;
        case "educational":
          return `**Educational & Explanatory:** Structure as a teaching experience, build concepts progressively, check for understanding. Focus on learning outcomes.`;
        default:
          return `**${
            toneMap[tone as keyof typeof toneMap] || tone
          }:** Use appropriate tone and style for the target audience.`;
      }
    };

    // Construct the comprehensive prompt using Robert Roskam's Engineering Writing Framework
    const prompt = `
   

    # Technical Blog Generation Prompt Template

Based on Robert Roskam's Engineering Writing Framework - Six Pillars of Exceptional Technical Writing

## Framework Overview
This framework transforms technical expertise into compelling, insightful content through six pillars that build credibility, provide value, and engage readers. Each pillar serves a specific purpose in creating exceptional technical writing that resonates with engineering audiences.

---

## Core Blog Configuration

**Topic:** ${topic}
**Target Audience:** ${
      audienceMap[audience as keyof typeof audienceMap] || audience
    }
**Primary Problem/Challenge:** ${mainProblem}

---

## PILLAR 1: 🔍 EVIDENCE - Build Credibility Through Proof

**Purpose:** Establish authority and trust through concrete, verifiable information that supports your arguments.

### Selected Elements to Include:

${buildEvidenceSection(evidence)}

---

## PILLAR 2: ⚙️ PRACTICAL - Make It Actionable

**Purpose:** Provide concrete steps and frameworks that readers can immediately apply to their own work.

### Selected Elements to Include:

${buildPracticalSection(practical)}

---

## PILLAR 3: 🧠 ANALYTICAL - Demonstrate Deep Thinking

**Purpose:** Show intellectual rigor by examining problems from multiple angles and exploring underlying complexities.

### Selected Elements to Include:

${buildAnalyticalSection(analytical)}

---

## PILLAR 4: 🔮 SPECULATIVE - Explore Possibilities

**Purpose:** Engage readers' imagination while demonstrating strategic thinking about future possibilities.

### Selected Elements to Include:

${buildSpeculativeSection(speculative)}

---

## PILLAR 5: 🌍 CONTEXTUAL UNDERSTANDING - Provide Background

**Purpose:** Help readers understand how your topic fits into broader technical, business, and societal contexts.

### Selected Elements to Include:

${buildContextualSection(contextual)}

---

## PILLAR 6: ✨ ENGAGEMENT - Make It Memorable

**Purpose:** Create content that captures attention, maintains interest, and sticks in readers' minds.

### Selected Tone: ${toneMap[tone as keyof typeof toneMap] || tone}

${getToneDescription(tone)}

### Selected Engagement Elements:

${buildEngagementSection(engagement)}

---

## Content Structure & Flow

1. **Hook:** Start with compelling problem, statistic, or provocative statement related to ${mainProblem}
2. **Context:** Provide necessary background without overwhelming the ${
      audienceMap[audience as keyof typeof audienceMap] || audience
    }
3. **Core Content:** Present main ideas using selected pillars and evidence
4. **Practical Application:** Show how readers can apply insights to their work
5. **Conclusion:** Summarize key takeaways and suggest next steps

## Quality Requirements

- All claims must be supported by evidence from selected pillars
- Include specific, measurable examples rather than vague generalizations  
- Address limitations and edge cases honestly
- Provide actionable takeaways appropriate for ${
      audienceMap[audience as keyof typeof audienceMap] || audience
    }
- Maintain consistency with selected tone throughout
- Use benefits-forward language to emphasize reader value
- Aim for 1500-2500 words for comprehensive coverage
- **CRITICAL**: Use ONLY semantic HTML formatting with proper structure (headings, paragraphs, lists, code blocks, etc.)
- **REQUIRED HTML TAGS**: Use <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <code>, <pre>, <strong>, <em>
- **CODE FORMATTING**: Use <code> tags for inline code and <pre><code> blocks for code snippets
- **NO MARKDOWN**: Do not use any markdown syntax (no #, *, -, etc.). Use only HTML tags.
- **STRUCTURE**: Start with <h1> for main title, <h2> for major sections, <h3> for subsections
- **PARAGRAPHS**: Wrap all text content in <p> tags
- **LISTS**: Use <ul><li> for bullet points and <ol><li> for numbered lists
- **EMPHASIS**: Use <strong> for bold and <em> for italics

**EXAMPLE FORMAT:**
<h1>Blog Title Here</h1>
<p>Introduction paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
<h2>Major Section</h2>
<p>Section content here...</p>
<ul>
<li>First bullet point</li>
<li>Second bullet point</li>
</ul>
<h3>Subsection</h3>
<p>More detailed content...</p>

Write a complete, well-researched blog post IN PURE HTML FORMAT that incorporates the selected elements from the 6-pillar framework. Make it engaging, informative, and valuable for the target audience. Return ONLY clean HTML content - NO markdown syntax whatsoever.`;

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
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;

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
