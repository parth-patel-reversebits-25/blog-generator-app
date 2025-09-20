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
