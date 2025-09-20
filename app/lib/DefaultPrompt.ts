import { buildEvidenceSection } from "@/app/utils/buildEvidenceSection";
import { buildPracticalSection } from "@/app/utils/buildPracticalSection";
import { buildAnalyticalSection } from "@/app/utils/buildAnalyticalSection";
import { buildSpeculativeSection } from "@/app/utils/buildSpeculativeSection";
import { buildContextualSection } from "@/app/utils/buildContextualSection";
import { buildEngagementSection } from "@/app/utils/buildEngagementSection";

import { getToneDescription } from "@/app/utils/getToneDescription";

export interface BlogRequestData {
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

export const DeafultPrompt = ({
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
}: BlogRequestData) => {
  // Construct the comprehensive prompt using Robert Roskam's Engineering Writing Framework
  const prompt = `
   
    # Technical Blog Generation Prompt Template

Based on Robert Roskam's Engineering Writing Framework - Six Pillars of Exceptional Technical Writing

## Framework Overview
This framework transforms technical expertise into compelling, insightful content through six pillars that build credibility, provide value, and engage readers. Each pillar serves a specific purpose in creating exceptional technical writing that resonates with engineering audiences.

---

## Core Blog Configuration

**Topic:** ${topic}
**Target Audience:** ${audience}
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

### Selected Tone: ${tone}

${getToneDescription(tone)}

### Selected Engagement Elements:

${buildEngagementSection(engagement)}

---

## Content Structure & Flow

1. **Hook:** Start with compelling problem, statistic, or provocative statement related to ${mainProblem}
2. **Context:** Provide necessary background without overwhelming the ${audience}
3. **Core Content:** Present main ideas using selected pillars and evidence
4. **Practical Application:** Show how readers can apply insights to their work
5. **Conclusion:** Summarize key takeaways and suggest next steps

## Quality Requirements

- All claims must be supported by evidence from selected pillars
- Include specific, measurable examples rather than vague generalizations  
- Address limitations and edge cases honestly
- Provide actionable takeaways appropriate for ${audience}
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
  return prompt;
};
