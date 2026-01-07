/**
 * Convert HTML to Markdown in blog post .md files
 * 
 * This script converts the body content from HTML to Markdown
 */

const fs = require('fs');
const path = require('path');

// Simple HTML to Markdown converter
function htmlToMarkdown(html) {
    if (!html || typeof html !== 'string') return html;

    let md = html;

    // Remove wrapping div
    md = md.replace(/<div class="prose-content">\s*/gi, '');
    md = md.replace(/\s*<\/div>\s*$/gi, '');

    // Remove leading whitespace from all lines
    md = md.replace(/^\s+/gm, '');

    // Convert headings
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, content) => `## ${stripTags(content).trim()}\n`);
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, content) => `### ${stripTags(content).trim()}\n`);
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, (_, content) => `#### ${stripTags(content).trim()}\n`);

    // Convert paragraphs
    md = md.replace(/<p>([\s\S]*?)<\/p>/gi, (_, content) => {
        return `${convertInlineElements(content).trim()}\n\n`;
    });

    // Convert unordered lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, listContent) => {
        const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
        const mdItems = items.map(item => {
            const content = item.replace(/<\/?li[^>]*>/gi, '');
            return `- ${convertInlineElements(content).trim()}`;
        }).join('\n');
        return `${mdItems}\n\n`;
    });

    // Convert ordered lists
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, listContent) => {
        const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
        const mdItems = items.map((item, index) => {
            const content = item.replace(/<\/?li[^>]*>/gi, '');
            return `${index + 1}. ${convertInlineElements(content).trim()}`;
        }).join('\n');
        return `${mdItems}\n\n`;
    });

    // Clean up whitespace
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();

    return md;
}

// Convert inline elements
function convertInlineElements(html) {
    let result = html;
    result = result.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    result = result.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    result = result.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    result = result.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    result = result.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    result = result.replace(/<br\s*\/?>/gi, '\n');
    return result;
}

// Strip all HTML tags
function stripTags(html) {
    return html.replace(/<[^>]+>/g, '');
}

// Process a single MD file
function processMdFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Split frontmatter and body
        const match = content.match(/^(---[\s\S]*?---)\s*([\s\S]*)$/);
        if (!match) {
            console.log(`  ⚠ No frontmatter found: ${path.basename(filePath)}`);
            return false;
        }

        const [, frontmatter, body] = match;

        // Check if body contains HTML
        if (!/<[a-z][^>]*>/i.test(body)) {
            return false; // Already markdown, skip
        }

        // Convert body to markdown
        const newBody = htmlToMarkdown(body);

        // Write back
        const newContent = `${frontmatter}\n\n${newBody}\n`;
        fs.writeFileSync(filePath, newContent, 'utf-8');

        return true;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Find all MD files in blog directory
function findBlogFiles(dir) {
    const files = [];

    function walk(currentDir) {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (item.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }

    walk(dir);
    return files;
}

// Main execution
function main() {
    const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');

    if (!fs.existsSync(blogDir)) {
        console.error('Blog directory not found:', blogDir);
        process.exit(1);
    }

    console.log('Finding blog MD files...');
    const files = findBlogFiles(blogDir);
    console.log(`Found ${files.length} MD files`);

    let converted = 0;
    let skipped = 0;

    for (const file of files) {
        const result = processMdFile(file);
        if (result) {
            converted++;
            console.log(`✓ Converted: ${path.basename(file)}`);
        } else {
            skipped++;
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Converted: ${converted} files`);
    console.log(`Skipped: ${skipped} files`);
}

main();
