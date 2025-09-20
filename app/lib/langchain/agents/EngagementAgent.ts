import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildEngagementSection } from "@/app/utils/buildEngagementSection";

export class EngagementAgent extends BlogSectionAgent {
  async generateEngagementContent(engagement: string[], context: any): Promise<string> {
    const sectionPrompt = buildEngagementSection(engagement);
    
    if (engagement.length === 0) return sectionPrompt;

    return await this.generateSection("Engagement & Style", engagement, {
      ...context,
      sectionPrompt
    });
  }
}