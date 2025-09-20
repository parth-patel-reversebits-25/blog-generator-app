import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildPracticalSection } from "@/app/utils/buildPracticalSection";

export class PracticalAgent extends BlogSectionAgent {
  async generatePracticalContent(practical: string[], context: any): Promise<string> {
    const sectionPrompt = buildPracticalSection(practical);
    
    if (practical.length === 0) return sectionPrompt;

    return await this.generateSection("Practical Elements", practical, {
      ...context,
      sectionPrompt
    });
  }
}