export const buildEvidenceSection = (evidence: string[]) => {
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
