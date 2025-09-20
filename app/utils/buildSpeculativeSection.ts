export const buildSpeculativeSection = (speculative: string[]) => {
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
