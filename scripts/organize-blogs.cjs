/**
 * organize-blogs.cjs
 * 
 * Script tự động sắp xếp các bài viết blog vào thư mục đúng dựa trên trường category.
 * Script này đọc danh sách categories từ src/content/blog-categories/*.json
 * và di chuyển các bài viết vào thư mục tương ứng.
 * 
 * Script chạy mỗi khi Netlify build, đảm bảo các bài viết luôn nằm trong thư mục đúng.
 * 
 * Run: node scripts/organize-blogs.cjs
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const BLOG_CATEGORIES_DIR = path.join(__dirname, '..', 'src', 'content', 'blog-categories');

/**
 * Đọc tất cả category slugs từ blog-categories folder
 * Tự động hóa - không cần hardcode
 */
function getValidCategories() {
    if (!fs.existsSync(BLOG_CATEGORIES_DIR)) {
        console.log('⚠️  Blog categories directory not found');
        return [];
    }

    const files = fs.readdirSync(BLOG_CATEGORIES_DIR).filter(f => f.endsWith('.json'));
    const categories = [];

    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(BLOG_CATEGORIES_DIR, file), 'utf-8');
            const category = JSON.parse(content);
            const slug = category.slug || category.id;
            if (slug) {
                categories.push(slug);
            }
        } catch (error) {
            console.log(`⚠️  Error reading ${file}: ${error.message}`);
        }
    }

    console.log(`📂 Found ${categories.length} blog categories: ${categories.join(', ')}\n`);
    return categories;
}

/**
 * Parse frontmatter từ file markdown
 */
function parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) return null;

    const frontmatter = {};
    const lines = frontmatterMatch[1].split(/\r?\n/);

    for (const line of lines) {
        const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
        if (match) {
            frontmatter[match[1]] = match[2];
        }
    }

    return frontmatter;
}

/**
 * Đảm bảo thư mục tồn tại
 */
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${path.basename(dirPath)}`);
    }
}

/**
 * Lấy tất cả file .md trong một thư mục
 */
function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];

    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getMarkdownFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Main function
 */
function organizeBlogPosts() {
    console.log('\n🔄 Organizing blog posts by category...\n');

    // Đọc categories từ JSON files (TỰ ĐỘNG)
    const validCategories = getValidCategories();

    if (validCategories.length === 0) {
        console.log('⚠️  No valid categories found. Skipping organization.');
        return;
    }

    // Đảm bảo tất cả các thư mục category tồn tại
    for (const category of validCategories) {
        ensureDirectoryExists(path.join(BLOG_DIR, category));
    }

    // Lấy tất cả file markdown
    const allFiles = getMarkdownFiles(BLOG_DIR);
    console.log(`📝 Found ${allFiles.length} blog post(s)\n`);

    let movedCount = 0;
    let skippedCount = 0;

    for (const filePath of allFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (!frontmatter || !frontmatter.category) {
            console.log(`⚠️  No category found in: ${path.basename(filePath)}`);
            skippedCount++;
            continue;
        }

        const category = frontmatter.category;
        const currentDir = path.basename(path.dirname(filePath));
        const fileName = path.basename(filePath);

        // Kiểm tra category có hợp lệ không
        if (!validCategories.includes(category)) {
            console.log(`⚠️  Unknown category "${category}" in: ${fileName}`);
            console.log(`   Valid categories: ${validCategories.join(', ')}`);
            skippedCount++;
            continue;
        }

        // Nếu file đã ở đúng thư mục, bỏ qua
        if (currentDir === category) {
            continue;
        }

        // Di chuyển file vào thư mục đúng
        const newPath = path.join(BLOG_DIR, category, fileName);

        try {
            fs.renameSync(filePath, newPath);
            console.log(`✅ Moved: ${fileName}`);
            console.log(`   ${currentDir}/ → ${category}/`);
            movedCount++;
        } catch (error) {
            console.error(`❌ Error moving ${fileName}: ${error.message}`);
        }
    }

    console.log('\n📊 Summary:');
    if (movedCount === 0) {
        console.log('✨ All blog posts are already in the correct folders!');
    } else {
        console.log(`📦 Moved ${movedCount} file(s) to their correct category folders.`);
    }
    if (skippedCount > 0) {
        console.log(`⚠️  Skipped ${skippedCount} file(s) with issues.`);
    }
    console.log('');
}

// Run
organizeBlogPosts();
