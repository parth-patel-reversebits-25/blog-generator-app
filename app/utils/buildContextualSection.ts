export const buildContextualSection = (contextual: string[]) => {
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
