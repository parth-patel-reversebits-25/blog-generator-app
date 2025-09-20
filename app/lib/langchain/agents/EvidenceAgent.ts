import { BlogSectionAgent } from "./BlogSectionAgent";
import { buildEvidenceSection } from "@/app/utils/buildEvidenceSection";

export class EvidenceAgent extends BlogSectionAgent {
  async generateEvidenceContent(evidence: string[], context: any): Promise<string> {
    const sectionPrompt = buildEvidenceSection(evidence);
    
    if (evidence.length === 0) return sectionPrompt;

    return await this.generateSection("Evidence & Research", evidence, {
      ...context,
      sectionPrompt
    });
  }
}