export const buildPracticalSection = (practical: string[]) => {
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
