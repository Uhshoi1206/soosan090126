/**
 * Auto-generate brand entries from product files
 * 
 * This script:
 * 1. Scans all products in src/content/products/
 * 2. Extracts unique brand names
 * 3. Creates JSON files for brands that don't exist in src/content/brands/
 * 
 * Run: node scripts/generate-brands.cjs
 */

const fs = require('fs');
const path = require('path');

// Paths
const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');
const BRANDS_DIR = path.join(__dirname, '../src/content/brands');

// Canonical brand name mapping (lowercase -> proper display name)
const CANONICAL_BRAND_MAP = {
    hyundai: 'Hyundai',
    isuzu: 'Isuzu',
    hino: 'Hino',
    dongfeng: 'Dongfeng',
    thaco: 'Thaco',
    kia: 'Kia',
    suzuki: 'Suzuki',
    veam: 'VEAM',
    soosan: 'Soosan',
    doosung: 'DOOSUNG',
    cimc: 'CIMC',
    koksan: 'KOKSAN',
    howo: 'HOWO',
    jac: 'JAC',
    'mercedes-benz': 'Mercedes-Benz',
    volvo: 'Volvo',
    scania: 'Scania',
    man: 'MAN',
    foton: 'Foton',
    daewoo: 'Daewoo',
    fuso: 'Fuso',
    iveco: 'Iveco',
    chenglong: 'Chenglong',
    asean: 'ASEAN',
    honto: 'HONTO',
    international: 'International',
    jiuyuan: 'JIUYUAN',
    sany: 'Sany',
    sitrak: 'Sitrak',
    srm: 'SRM',
    'tan-thanh': 'TÂN THANH',
    'tanthanh': 'TÂN THANH',
    tera: 'Tera',
    teyun: 'TEYUN',
    tmt: 'TMT',
    xingshi: 'XINGSHI',
    zoomlion: 'Zoomlion',
};

/**
 * Convert brand name to slug (ASCII-safe)
 */
function toSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Get canonical brand name
 */
function getCanonicalName(rawName) {
    const key = rawName.trim().toLowerCase();
    return CANONICAL_BRAND_MAP[key] || rawName.trim();
}

/**
 * Recursively read all JSON files from products directory
 */
function readAllProducts(dir) {
    const products = [];

    if (!fs.existsSync(dir)) {
        return products;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            products.push(...readAllProducts(fullPath));
        } else if (item.name.endsWith('.json')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const product = JSON.parse(content);
                products.push(product);
            } catch (e) {
                console.warn(`Warning: Could not parse ${fullPath}`);
            }
        }
    }

    return products;
}

/**
 * Extract unique brands from products
 */
function extractUniqueBrands(products) {
    const brandsMap = new Map();

    for (const product of products) {
        if (!product.brand) continue;

        const brands = Array.isArray(product.brand) ? product.brand : [product.brand];

        for (const rawBrand of brands) {
            if (!rawBrand) continue;

            const key = rawBrand.toString().trim().toLowerCase();
            if (!key) continue;

            if (!brandsMap.has(key)) {
                brandsMap.set(key, getCanonicalName(rawBrand));
            }
        }
    }

    return Array.from(brandsMap.values()).sort((a, b) => a.localeCompare(b, 'vi'));
}

/**
 * Get existing brand IDs from brands directory
 */
function getExistingBrandIds() {
    if (!fs.existsSync(BRANDS_DIR)) {
        fs.mkdirSync(BRANDS_DIR, { recursive: true });
        return new Set();
    }

    const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.json'));
    return new Set(files.map(f => f.replace('.json', '')));
}

/**
 * Create a brand JSON file
 */
function createBrandFile(brandName, order) {
    const slug = toSlug(brandName);
    const filePath = path.join(BRANDS_DIR, `${slug}.json`);

    const brandData = {
        id: slug,
        name: brandName,
        slug: slug,
        logo: "",
        logoAlt: `Logo thương hiệu ${brandName}`,
        description: "",
        seoTitle: "",
        seoDescription: "",
        country: "",
        website: "",
        order: order,
        isActive: true
    };

    fs.writeFileSync(filePath, JSON.stringify(brandData, null, 2), 'utf-8');
    return slug;
}

/**
 * Main function
 */
function main() {
    console.log('🏷️  Generating brand entries from products...\n');

    // Read all products
    const products = readAllProducts(PRODUCTS_DIR);
    console.log(`Found ${products.length} products`);

    // Extract unique brands
    const allBrands = extractUniqueBrands(products);
    console.log(`Found ${allBrands.length} unique brands\n`);

    // Get existing brand entries
    const existingIds = getExistingBrandIds();
    console.log(`Existing brand entries: ${existingIds.size}`);

    // Create missing brand entries
    let created = 0;
    let order = existingIds.size + 1;

    for (const brandName of allBrands) {
        const slug = toSlug(brandName);

        if (!existingIds.has(slug)) {
            createBrandFile(brandName, order);
            console.log(`  ✅ Created: ${slug}.json (${brandName})`);
            created++;
            order++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Total brands in products: ${allBrands.length}`);
    console.log(`   - Existing entries: ${existingIds.size}`);
    console.log(`   - New entries created: ${created}`);

    if (created > 0) {
        console.log(`\n💡 Tip: New brands have empty logo fields. Upload logos in Sveltia CMS.`);
    }
}

main();
