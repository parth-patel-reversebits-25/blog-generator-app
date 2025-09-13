// Simple test for markdown formatting
const testText = `1.**Identify Your Niche:**Focus on areas where you have expertise or curiosity. 2.**Set a Schedule:**Consistency is key. Commit to a regular posting schedule. 3.**Engage with the Community:**Share your posts on platforms like Twitter, LinkedIn, or relevant forums. Engage with comments and feedback. 4.**Iterate and Improve:**Analyze reader engagement and adapt your writing style accordingly.`;

// Simulate the formatting functions
function removeHashtags(content) {
    return content.replace(/#+ /g, "").replace(/#{1,6} /g, "");
}

function fixMarkdownFormatting(content) {
    return content
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
        // Also handle cases where there might be spaces
        .replace(/(\d+)\.\s*\*\*([^*]+?)\*\*:/g, "\n$1. **$2:**")
        // Fix list formatting - ensure proper bullet points
        .replace(/^\s*[-*+]\s+/gm, "- ")
        .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + " ")
        // Clean up trailing whitespace
        .replace(/[ \t]+$/gm, "")
        // Remove empty lines at start and end
        .trim();
}

function formatForMedium(content) {
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

console.log('Original text:');
console.log(testText);
console.log('\nFormatted text:');
console.log(formatForMedium(testText));
