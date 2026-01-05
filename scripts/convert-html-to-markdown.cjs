/**
 * Convert HTML to Markdown in product JSON files
 * 
 * This script converts detailedDescription HTML content to Markdown
 * while preserving complex HTML elements (tables, styled divs)
 */

const fs = require('fs');
const path = require('path');

// Simple HTML to Markdown converter
function htmlToMarkdown(html) {
  if (!html || typeof html !== 'string') return html;
  
  let md = html;
  
  // Normalize line breaks
  md = md.replace(/\\n/g, '\n');
  md = md.replace(/\r\n/g, '\n');
  
  // Convert headings - extract content between tags
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, content) => `\n## ${stripTags(content).trim()}\n`);
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, content) => `\n### ${stripTags(content).trim()}\n`);
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, (_, content) => `\n#### ${stripTags(content).trim()}\n`);
  
  // Convert paragraphs - but preserve styled ones
  md = md.replace(/<p>([^<]*(?:<(?!\/p>)[^<]*)*)<\/p>/gi, (match, content) => {
    // If it's a simple paragraph without nested complex elements
    if (!/<(div|table|style)/i.test(content)) {
      return `\n${convertInlineElements(content).trim()}\n`;
    }
    return match; // Keep original if complex
  });
  
  // Convert unordered lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    const mdItems = items.map(item => {
      const content = item.replace(/<\/?li[^>]*>/gi, '');
      return `- ${convertInlineElements(content).trim()}`;
    }).join('\n');
    return `\n${mdItems}\n`;
  });
  
  // Convert ordered lists
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    const mdItems = items.map((item, index) => {
      const content = item.replace(/<\/?li[^>]*>/gi, '');
      return `${index + 1}. ${convertInlineElements(content).trim()}`;
    }).join('\n');
    return `\n${mdItems}\n`;
  });
  
  // Clean up multiple newlines
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();
  
  return md;
}

// Convert inline elements (strong, em, a) to markdown
function convertInlineElements(html) {
  let result = html;
  
  // Strong/bold
  result = result.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  result = result.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  
  // Emphasis/italic
  result = result.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  result = result.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // Links
  result = result.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Line breaks
  result = result.replace(/<br\s*\/?>/gi, '  \n');
  
  return result;
}

// Strip all HTML tags
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

// Process a single JSON file
function processJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    if (json.detailedDescription && typeof json.detailedDescription === 'string') {
      const original = json.detailedDescription;
      json.detailedDescription = htmlToMarkdown(original);
      
      // Only write if changed
      if (original !== json.detailedDescription) {
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf-8');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all JSON files in products directory
function findProductJsonFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Main execution
function main() {
  const productsDir = path.join(__dirname, '..', 'src', 'content', 'products');
  
  if (!fs.existsSync(productsDir)) {
    console.error('Products directory not found:', productsDir);
    process.exit(1);
  }
  
  console.log('Finding product JSON files...');
  const files = findProductJsonFiles(productsDir);
  console.log(`Found ${files.length} JSON files`);
  
  let converted = 0;
  let skipped = 0;
  
  for (const file of files) {
    const result = processJsonFile(file);
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
