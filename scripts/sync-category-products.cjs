/**
 * Sync Category Changes to Products
 * 
 * This script ensures products are in sync with category changes:
 * 1. Reads all category files to get current category IDs
 * 2. Maps folder names to category IDs
 * 3. Updates product "type" field to match the category "id"
 * 4. Also updates the product folder names if category id changed
 * 
 * Run during prebuild: node scripts/sync-category-products.cjs
 */

const fs = require('fs');
const path = require('path');

const CATEGORIES_DIR = path.join(__dirname, '../src/content/categories');
const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');

/**
 * Load all categories and build a mapping
 */
function loadCategories() {
    const categories = {};
    const files = fs.readdirSync(CATEGORIES_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        try {
            const filePath = path.join(CATEGORIES_DIR, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Use filename (without .json) as the key
            const fileKey = file.replace('.json', '');

            categories[fileKey] = {
                id: content.id,
                slug: content.slug,
                name: content.name,
                fileName: file
            };
        } catch (error) {
            console.error(`❌ Error loading category ${file}: ${error.message}`);
        }
    }

    return categories;
}

/**
 * Get all product folders
 */
function getProductFolders() {
    return fs.readdirSync(PRODUCTS_DIR)
        .filter(item => {
            const fullPath = path.join(PRODUCTS_DIR, item);
            return fs.statSync(fullPath).isDirectory();
        });
}

/**
 * Get all product files in a folder
 */
function getProductFiles(folderPath) {
    return fs.readdirSync(folderPath)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(folderPath, f));
}

/**
 * Find category that matches this folder
 * Priority:
 * 1. Exact match by filename (category file name = folder name)
 * 2. Match by category id = folder name
 * 3. Match by category slug = folder name
 */
function findCategoryForFolder(folderName, categories) {
    // 1. Check if category filename matches folder
    if (categories[folderName]) {
        return categories[folderName];
    }

    // 2. Check by category id or slug
    for (const [key, cat] of Object.entries(categories)) {
        if (cat.id === folderName || cat.slug === folderName) {
            return cat;
        }
    }

    return null;
}

/**
 * Main sync function
 */
function main() {
    console.log('🔄 Syncing category changes to products...\n');

    const categories = loadCategories();
    const productFolders = getProductFolders();

    let updatedProducts = 0;
    let renamedFolders = 0;
    const foldersToRename = [];

    // First pass: Update product types and collect folders to rename
    for (const folder of productFolders) {
        const folderPath = path.join(PRODUCTS_DIR, folder);
        const category = findCategoryForFolder(folder, categories);

        if (!category) {
            console.log(`⚠️  No matching category for folder: ${folder}/`);
            continue;
        }

        const targetId = category.id;
        const targetSlug = category.slug;

        // Update all products in this folder to have correct type
        const productFiles = getProductFiles(folderPath);

        for (const filePath of productFiles) {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Check if type needs to be updated
                if (content.type !== targetId) {
                    const oldType = content.type;
                    content.type = targetId;

                    // Write back with proper formatting
                    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');

                    console.log(`✅ Updated: ${path.basename(filePath)}`);
                    console.log(`   type: "${oldType}" → "${targetId}"`);
                    updatedProducts++;
                }
            } catch (error) {
                console.error(`❌ Error processing ${filePath}: ${error.message}`);
            }
        }

        // Check if folder needs to be renamed (folder name should match category id)
        if (folder !== targetId) {
            foldersToRename.push({
                from: folder,
                to: targetId,
                categoryName: category.name
            });
        }
    }

    // Second pass: Rename folders (do this after updating products to avoid path issues)
    for (const { from, to, categoryName } of foldersToRename) {
        const oldPath = path.join(PRODUCTS_DIR, from);
        const newPath = path.join(PRODUCTS_DIR, to);

        // Skip if target folder already exists with different name
        if (fs.existsSync(newPath) && from !== to) {
            console.log(`⚠️  Cannot rename ${from}/ → ${to}/ (folder already exists)`);
            continue;
        }

        try {
            fs.renameSync(oldPath, newPath);
            console.log(`📁 Renamed folder: ${from}/ → ${to}/ (${categoryName})`);
            renamedFolders++;
        } catch (error) {
            console.error(`❌ Error renaming folder ${from}: ${error.message}`);
        }
    }

    // Also sync category file names with their IDs
    for (const [fileKey, cat] of Object.entries(categories)) {
        if (fileKey !== cat.id) {
            const oldPath = path.join(CATEGORIES_DIR, `${fileKey}.json`);
            const newPath = path.join(CATEGORIES_DIR, `${cat.id}.json`);

            if (!fs.existsSync(newPath)) {
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`📝 Renamed category file: ${fileKey}.json → ${cat.id}.json`);
                } catch (error) {
                    console.error(`❌ Error renaming category file: ${error.message}`);
                }
            }
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - ${updatedProducts} product(s) updated`);
    console.log(`   - ${renamedFolders} folder(s) renamed`);
}

main();
