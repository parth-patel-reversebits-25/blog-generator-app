import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildSpeculativeSection } from "@/app/utils/buildSpeculativeSection";

export class SpeculativeAgent extends BlogSectionAgent {
  async generateSpeculativeContent(speculative: string[], context: any): Promise<string> {
    const sectionPrompt = buildSpeculativeSection(speculative);
    
    if (speculative.length === 0) return sectionPrompt;

    return await this.generateSection("Speculative & Future-Focused", speculative, {
      ...context,
      sectionPrompt
    });
  }
}