/**
 * Simple markdown parser for blog content
 * Converts basic markdown syntax to HTML
 * Works in both server-side and client-side rendering
 */
export function parseMarkdown(content: string): string {
    if (!content) return '';

    let html = content;

    // Convert headings (must be at start of line)
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Convert bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Convert italic *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Convert unordered list items (- item)
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Convert links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert paragraphs - wrap text blocks in <p> tags
    const lines = html.split('\n');
    const result: string[] = [];
    let inParagraph = false;
    let paragraphContent: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Check if line is a block element (already has HTML tags at start)
        const isBlockElement = /^<(h[1-6]|ul|ol|li|table|div|p|br|hr)/.test(trimmedLine);
        const isEmpty = trimmedLine === '';

        if (isBlockElement || isEmpty) {
            // Close any open paragraph
            if (inParagraph && paragraphContent.length > 0) {
                result.push('<p>' + paragraphContent.join('<br>') + '</p>');
                paragraphContent = [];
                inParagraph = false;
            }
            if (!isEmpty) {
                result.push(line);
            }
        } else {
            // Regular text line - add to paragraph
            inParagraph = true;
            paragraphContent.push(trimmedLine);
        }
    }

    // Close any remaining open paragraph
    if (inParagraph && paragraphContent.length > 0) {
        result.push('<p>' + paragraphContent.join('<br>') + '</p>');
    }

    return result.join('\n');
}
