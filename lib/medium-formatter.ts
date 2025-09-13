/**
 * Utility functions for formatting content for Medium platform
 */

/**
 * Removes hashtags from markdown content
 */
export function removeHashtags(content: string): string {
  return content.replace(/#+ /g, "").replace(/#{1,6} /g, "");
}

/**
 * Fixes common markdown formatting issues
 */
export function fixMarkdownFormatting(content: string): string {
  return (
    content
      // Remove multiple consecutive newlines
      .replace(/\n{3,}/g, "\n\n")
      // Fix spacing around headers
      .replace(/^\s*(#{1,6})\s+/gm, "$1 ")
      // Fix bold formatting - ensure **text** format is preserved
      .replace(/\s*\*\*\s*([^*]+?)\s*\*\*\s*/g, "**$1**")
      // Fix italic formatting - ensure *text* format is preserved
      .replace(/\s*\*\s*([^*]+?)\s*\*\s*/g, "*$1*")
      // Fix numbered list formatting - convert inline numbered items to proper list format
      .replace(/(\d+)\.\*\*([^*]+?)\*\*:/g, "\n$1. **$2:**")
      // Fix list formatting - ensure proper bullet points
      .replace(/^\s*[-*+]\s+/gm, "- ")
      .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + " ")
      // Clean up trailing whitespace
      .replace(/[ \t]+$/gm, "")
      // Remove empty lines at start and end
      .trim()
  );
}

/**
 * Formats content specifically for Medium platform
 * - Removes hashtags
 * - Fixes markdown formatting
 * - Ensures proper structure for Medium's editor
 */
export function formatForMedium(content: string): string {
  let formatted = content;

  // Remove hashtags
  formatted = removeHashtags(formatted);

  // Fix formatting issues
  formatted = fixMarkdownFormatting(formatted);

  // Convert to Medium-friendly format
  formatted = formatted
    // Ensure proper header spacing for Medium
    .replace(/^# (.+)$/gm, "$1\n")
    .replace(/^## (.+)$/gm, "$1\n")
    .replace(/^### (.+)$/gm, "$1\n")
    // Ensure bold formatting is properly preserved
    .replace(/\*\*([^*]+?)\*\*/g, "**$1**")
    // Ensure proper paragraph spacing
    .replace(/\n\n+/g, "\n\n")
    // Add title formatting if not present
    .replace(/^(.+)$/, (match, title) => {
      // If the first line looks like a title and isn't already formatted
      if (
        !title.startsWith("#") &&
        !title.includes("**") &&
        title.length < 100
      ) {
        return `# ${title}`;
      }
      return match;
    });

  return formatted.trim();
}

/**
 * Creates a clean version of the content for copying/downloading
 * Removes all markdown formatting and creates plain text
 */
export function createPlainTextVersion(content: string): string {
  return (
    content
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic formatting
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      // Remove links (keep text)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Convert list items to plain text
      .replace(/^[-*+]\s+/gm, "• ")
      .replace(/^\d+\.\s+/gm, "")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+$/gm, "")
      .trim()
  );
}

/**
 * Creates Medium-formatted version with proper structure
 */
export function createMediumVersion(content: string): string {
  const mediumFormatted = formatForMedium(content);

  // Add Medium-specific formatting
  return (
    mediumFormatted
      // Ensure proper title format
      .replace(/^(.+)$/, (match, title) => {
        const lines = title.split("\n");
        if (lines.length > 0 && !lines[0].startsWith("#")) {
          lines[0] = `# ${lines[0]}`;
        }
        return lines.join("\n");
      })
  );
}
