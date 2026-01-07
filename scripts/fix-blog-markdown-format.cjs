/**
 * Fix markdown formatting in blog files
 * - Add blank line after headings if missing
 * - Add blank line before headings if missing  
 */

const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = [];
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            files.push(...walk(p));
        } else if (p.endsWith('.md')) {
            files.push(p);
        }
    });
    return files;
}

function fixMarkdownFormatting(content) {
    const lines = content.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const prevLine = i > 0 ? lines[i - 1] : '';
        const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

        // Check if current line is a heading
        const isHeading = /^#{1,6}\s/.test(line);
        const isPrevHeading = /^#{1,6}\s/.test(prevLine);

        // Add blank line before heading if previous line is not empty and not a heading
        if (isHeading && prevLine.trim() !== '' && !isPrevHeading && !prevLine.startsWith('---')) {
            result.push('');
        }

        result.push(line);

        // Add blank line after heading if next line is not empty (content follows directly)
        if (isHeading && nextLine.trim() !== '' && !/^#{1,6}\s/.test(nextLine) && !nextLine.startsWith('-')) {
            result.push('');
        }
    }

    return result.join('\n');
}

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = walk(dir);

console.log(`Found ${files.length} MD files`);

let fixed = 0;
files.forEach(f => {
    const c = fs.readFileSync(f, 'utf-8');
    const m = c.match(/^(---[\s\S]*?---)\s*([\s\S]*)$/);
    if (m) {
        const [, fm, body] = m;
        const fixedBody = fixMarkdownFormatting(body.trim());
        const newContent = fm + '\n\n' + fixedBody + '\n';
        if (newContent !== c) {
            fs.writeFileSync(f, newContent);
            console.log('✓ Fixed:', path.basename(f));
            fixed++;
        }
    }
});

console.log(`\nFixed: ${fixed} files`);
