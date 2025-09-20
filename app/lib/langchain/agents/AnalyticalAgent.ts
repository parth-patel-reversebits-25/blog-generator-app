import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildAnalyticalSection } from "@/app/utils/buildAnalyticalSection";

export class AnalyticalAgent extends BlogSectionAgent {
  async generateAnalyticalContent(analytical: string[], context: any): Promise<string> {
    const sectionPrompt = buildAnalyticalSection(analytical);
    
    if (analytical.length === 0) return sectionPrompt;

    return await this.generateSection("Analytical Depth", analytical, {
      ...context,
      sectionPrompt
    });
  }
}