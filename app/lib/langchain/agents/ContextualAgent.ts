import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildContextualSection } from "@/app/utils/buildContextualSection";

export class ContextualAgent extends BlogSectionAgent {
  async generateContextualContent(contextual: string[], context: any): Promise<string> {
    const sectionPrompt = buildContextualSection(contextual);
    
    if (contextual.length === 0) return sectionPrompt;

    return await this.generateSection("Contextual Understanding", contextual, {
      ...context,
      sectionPrompt
    });
  }
}