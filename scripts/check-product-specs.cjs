/**
 * Script to check and report product specification data completeness
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');

// Check each category
const categories = ['mooc', 'can-cau', 'dau-keo', 'xe-tai', 'may-moc-thiet-bi'];

// Define which spec field each category should have
const CATEGORY_SPEC_FIELD = {
    'mooc': 'trailerSpec',
    'can-cau': 'craneSpec',
    'dau-keo': 'tractorSpec',
    'xe-tai': ['closedBox', 'tailLift', 'tankSpec', 'concretePumpSpec', 'craneSpec'], // Multiple optional
    'may-moc-thiet-bi': 'rollerSpec'
};

let report = [];

categories.forEach(category => {
    const categoryDir = path.join(PRODUCTS_DIR, category);
    if (!fs.existsSync(categoryDir)) {
        console.log(`Category not found: ${category}`);
        return;
    }

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
    const specField = CATEGORY_SPEC_FIELD[category];

    console.log(`\n=== ${category.toUpperCase()} (${files.length} products) ===`);

    let hasSpec = 0;
    let noSpec = 0;

    files.forEach(file => {
        const filePath = path.join(categoryDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        let hasSpecData = false;

        if (Array.isArray(specField)) {
            // Multiple possible spec fields (xe-tai)
            hasSpecData = specField.some(field => data[field] && Object.keys(data[field]).length > 0);
        } else {
            hasSpecData = data[specField] && Object.keys(data[specField]).length > 0;
        }

        if (hasSpecData) {
            hasSpec++;
        } else {
            noSpec++;
            console.log(`  ❌ Missing spec: ${file}`);
        }
    });

    console.log(`  ✅ Has spec: ${hasSpec}/${files.length}`);
    console.log(`  ❌ No spec: ${noSpec}/${files.length}`);
});
