/**
 * Clean up whitespace in blog MD files
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

const dir = path.join(__dirname, '..', 'src', 'content', 'blog');
const files = walk(dir);

console.log(`Found ${files.length} MD files`);

let cleaned = 0;
files.forEach(f => {
    const c = fs.readFileSync(f, 'utf-8');
    const m = c.match(/^(---[\s\S]*?---)\s*([\s\S]*)$/);
    if (m) {
        const [, fm, body] = m;
        // Remove leading whitespace from each line
        const cleanBody = body.split('\n').map(line => line.replace(/^\s+/, '')).join('\n').trim();
        const newContent = fm + '\n\n' + cleanBody + '\n';
        if (newContent !== c) {
            fs.writeFileSync(f, newContent);
            console.log('✓ Cleaned:', path.basename(f));
            cleaned++;
        }
    }
});

console.log(`\nCleaned: ${cleaned} files`);
