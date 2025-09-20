export const buildAnalyticalSection = (analytical: string[]) => {
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
