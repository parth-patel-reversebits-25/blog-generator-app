export const buildEngagementSection = (engagement: string[]) => {
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
