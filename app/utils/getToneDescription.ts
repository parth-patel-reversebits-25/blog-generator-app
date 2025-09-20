export const getToneDescription = (tone: string) => {
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
      return `**${tone}:** Use appropriate tone and style for the target audience.`;
  }
};
