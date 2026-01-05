/**
 * Auto-generate CMS config.yml from category files
 * 
 * This script:
 * - Reads src/content/categories/*.json → generates product collections
 * - Reads src/content/blog-categories/*.json → generates blog collections
 * - Extracts ALL spec fields from product JSON files with NESTED STRUCTURE
 * 
 * Run: node scripts/generate-cms-config.cjs
 */

const fs = require('fs');
const path = require('path');

// Paths
const CATEGORIES_DIR = path.join(__dirname, '../src/content/categories');
const BLOG_CATEGORIES_DIR = path.join(__dirname, '../src/content/blog-categories');
const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');
const OUTPUT_FILE = path.join(__dirname, '../public/loivao/config.yml');
const TEMPLATE_FILE = path.join(__dirname, 'cms-config-base.yml');

// Default backend config
const DEFAULT_BACKEND = `backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO
  branch: main
  site_domain: "your-site.netlify.app"
  base_url: "https://api.netlify.com"

site_url: "https://your-site.netlify.app"
display_url: "https://your-site.netlify.app"

`;

// Icons
const PRODUCT_ICONS = {
  'dau-keo': '🚛', 'xe-tai': '🚚', 'mooc': '🚛', 'xe-cau': '🏗️',
  'can-cau': '🏗️', 'xe-lu': '🚜', 'may-moc-thiet-bi': '⚙️', 'default': '📦'
};

const BLOG_ICONS = {
  'tin-tuc-nganh-van-tai': '📰', 'danh-gia-xe': '⭐', 'kinh-nghiem-lai-xe': '🚗',
  'bao-duong': '🔧', 'tu-van-mua-xe': '💡', 'cong-nghe-va-doi-moi': '🔬',
  'luat-giao-thong': '⚖️', 'default': '📝'
};

const SPEC_ICONS = {
  'craneSpec': '🏗️', 'tankSpec': '🛢️', 'trailerSpec': '📏', 'tractorSpec': '🚛',
  'rollerSpec': '🚜', 'excavatorSpec': '⛏️', 'loaderSpec': '🚜', 'forkliftSpec': '📦',
  'concretePumpSpec': '🚧', 'concreteMixerSpec': '🚧', 'aerialPlatformSpec': '🔝',
  'fireFightingSpec': '🚒', 'bitumenTankSpec': '🛢️', 'fuelTankerSpec': '⛽',
  'dumpTruckSpec': '🚚', 'armRollSpec': '♻️', 'streetSweeperSpec': '🧹',
  'generatorSpec': '⚡', 'compressorSpec': '💨', 'bulldozerSpec': '🚜',
  'closedBox': '📦', 'tailLift': '🛗', 'default': '📋'
};

// Vietnamese labels - loaded from external JSON file
const VN_LABELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'vn-labels.json'), 'utf-8'));

// Get Vietnamese label for a field name
function getLabel(name) {
  if (VN_LABELS[name]) return VN_LABELS[name];
  // Convert camelCase to Title Case
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
}

// Get widget type based on value
function getWidgetType(value) {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'list';
  return 'string';
}

// Read categories from directory
function readCategories(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Ensure folder exists
function ensureCategoryFolder(baseDir, slug) {
  const folderPath = path.join(__dirname, '..', baseDir, slug);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
}

// Generate options YAML
function generateTypeOptions(categories) {
  return categories.map(cat => `          - { label: "${cat.name}", value: "${cat.slug || cat.id}" }`).join('\n');
}

// Extract spec structure from products (with nested objects)
function extractSpecsFromCategory(categorySlug) {
  const dir = path.join(PRODUCTS_DIR, categorySlug);
  if (!fs.existsSync(dir)) return {};

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const specs = {};

  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));

    Object.keys(data).forEach(key => {
      if ((key.endsWith('Spec') || key === 'closedBox' || key === 'tailLift')
        && typeof data[key] === 'object' && !Array.isArray(data[key])) {

        if (!specs[key]) specs[key] = {};

        // Extract structure preserving nesting
        extractStructure(data[key], specs[key]);
      }
    });
  });

  return specs;
}

// Extract structure preserving nested objects
function extractStructure(obj, structure) {
  if (!obj || typeof obj !== 'object') return;

  Object.keys(obj).forEach(fieldName => {
    const value = obj[fieldName];

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      // Nested object - ensure we have nested structure
      if (!structure[fieldName] || !structure[fieldName]._isNested) {
        structure[fieldName] = { _isNested: true, _fields: {} };
      }
      extractStructure(value, structure[fieldName]._fields);
    } else if (value !== null && value !== undefined) {
      // Primitive value
      if (!structure[fieldName] || !structure[fieldName]._isNested) {
        structure[fieldName] = { _type: getWidgetType(value) };
      }
    }
  });
}

// Generate YAML for a field (handles nesting)
function generateFieldYAML(fieldName, fieldInfo, indent) {
  const label = getLabel(fieldName);
  const spaces = ' '.repeat(indent);

  if (fieldInfo._isNested) {
    // Nested object widget
    let yaml = `${spaces}- label: "${label}"\n`;
    yaml += `${spaces}  name: "${fieldName}"\n`;
    yaml += `${spaces}  widget: "object"\n`;
    yaml += `${spaces}  collapsed: true\n`;
    yaml += `${spaces}  required: false\n`;
    yaml += `${spaces}  fields:\n`;

    Object.keys(fieldInfo._fields).forEach(subFieldName => {
      yaml += generateFieldYAML(subFieldName, fieldInfo._fields[subFieldName], indent + 4);
    });

    return yaml;
  } else {
    // Simple field
    return `${spaces}- { label: "${label}", name: "${fieldName}", widget: "${fieldInfo._type}", required: false }\n`;
  }
}

// Generate YAML for a spec object
function generateSpecYAML(specName, structure) {
  const label = specName.replace(/Spec$/, '').replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
  const icon = SPEC_ICONS[specName] || SPEC_ICONS.default;

  let yaml = `      - label: "${icon} ${label}"\n`;
  yaml += `        name: "${specName}"\n`;
  yaml += `        widget: "object"\n`;
  yaml += `        collapsed: true\n`;
  yaml += `        required: false\n`;
  yaml += `        fields:\n`;

  Object.keys(structure).forEach(fieldName => {
    yaml += generateFieldYAML(fieldName, structure[fieldName], 10);
  });

  return yaml;
}

// Generate category spec fields YAML
function generateCategorySpecFields(categorySlug) {
  const specs = extractSpecsFromCategory(categorySlug);
  if (Object.keys(specs).length === 0) return '';

  let yaml = `\n      # ========= THÔNG SỐ KỸ THUẬT (tự động từ dữ liệu) =========\n`;
  Object.keys(specs).sort().forEach(specName => {
    yaml += generateSpecYAML(specName, specs[specName]);
  });

  return yaml;
}

// Common product fields
function getCommonProductFields(typeOptions) {
  return `      - { label: "ID", name: "id", widget: "string", required: true }
      - { label: "Tên Sản Phẩm", name: "name", widget: "string", required: true }
      - { label: "Slug", name: "slug", widget: "string", required: true }
      - { label: "Hãng", name: "brand", widget: "string", required: true }
      - label: "Loại Xe"
        name: "type"
        widget: "select"
        options:
${typeOptions}
      - { label: "Giá (VNĐ)", name: "price", widget: "number", required: false }
      - { label: "Giá Hiển Thị", name: "priceText", widget: "string", required: false }
      - { label: "Trọng Tải Hiển Thị", name: "weightText", widget: "string", required: true }
      - { label: "Trọng Tải (kg)", name: "weight", widget: "number", required: true }
      - { label: "Dài (mm)", name: "length", widget: "number", required: true }
      - { label: "Rộng (mm)", name: "width", widget: "number", required: true }
      - { label: "Cao (mm)", name: "height", widget: "number", required: true }
      - { label: "Kích Thước", name: "dimensions", widget: "string", required: true }
      - { label: "Ảnh Đại Diện", name: "thumbnailUrl", widget: "string", required: true }
      - { label: "Ảnh Sản Phẩm", name: "images", widget: "list", required: true }
      - { label: "Video URL (YouTube)", name: "videoUrl", widget: "string", required: false }
      - { label: "Mới", name: "isNew", widget: "boolean", default: false }
      - { label: "Nổi Bật", name: "isHot", widget: "boolean", default: false }
      - { label: "Ẩn", name: "isHidden", widget: "boolean", default: false }
      - label: "Tình Trạng Kho"
        name: "stockStatus"
        widget: "select"
        default: "in-stock"
        options:
          - { label: "Sẵn hàng", value: "in-stock" }
          - { label: "Hết hàng", value: "out-of-stock" }
          - { label: "Đặt trước", value: "pre-order" }
          - { label: "Ngừng kinh doanh", value: "discontinued" }
      - { label: "Xuất Xứ", name: "origin", widget: "string", required: false }
      - { label: "Mô Tả Ngắn", name: "description", widget: "text", required: false }
      - { label: "Mô Tả Chi Tiết", name: "detailedDescription", widget: "markdown", required: false }
      - { label: "Tính Năng", name: "features", widget: "list", required: false }
      - { label: "Model", name: "model", widget: "string", required: false }
      - { label: "Model Động Cơ", name: "engineModel", widget: "string", required: false }
      - { label: "Loại Động Cơ", name: "engineType", widget: "string", required: false }
      - { label: "Dung Tích Động Cơ", name: "engineCapacity", widget: "string", required: false }
      - { label: "Công Suất Động Cơ", name: "enginePower", widget: "string", required: false }
      - { label: "Mô-men Xoắn", name: "engineTorque", widget: "string", required: false }
      - { label: "Tiêu Chuẩn Khí Thải", name: "emissionStandard", widget: "string", required: false }
      - { label: "Nhiên Liệu", name: "fuel", widget: "string", required: false }
      - { label: "Hộp Số", name: "transmission", widget: "string", required: false }
      - { label: "Chiều Dài Cơ Sở", name: "wheelbase", widget: "number", required: false }
      - { label: "Chiều Dài Cơ Sở (Text)", name: "wheelbaseText", widget: "string", required: false }
      - { label: "Khoảng Sáng Gầm", name: "groundClearance", widget: "number", required: false }
      - { label: "Bán Kính Quay Vòng", name: "turningRadius", widget: "number", required: false }
      - { label: "Khối Lượng Bản Thân", name: "kerbWeight", widget: "string", required: false }
      - { label: "Khối Lượng Toàn Bộ", name: "grossWeight", widget: "string", required: false }
      - { label: "Lốp Xe", name: "tires", widget: "string", required: false }
      - { label: "Treo Trước", name: "frontSuspension", widget: "string", required: false }
      - { label: "Treo Sau", name: "rearSuspension", widget: "string", required: false }
      - { label: "Phanh Trước", name: "frontBrake", widget: "string", required: false }
      - { label: "Phanh Sau", name: "rearBrake", widget: "string", required: false }
      - { label: "Hệ Thống Phanh", name: "brakeSystem", widget: "string", required: false }
      - { label: "Hệ Thống Lái", name: "steeringType", widget: "string", required: false }
      - { label: "Loại Cabin", name: "cabinType", widget: "string", required: false }
      - { label: "Số Chỗ Ngồi", name: "seats", widget: "number", required: false }
      - { label: "Dung Tích Bình Nhiên Liệu", name: "fuelTankCapacity", widget: "string", required: false }
      - { label: "Tính Năng Cabin", name: "cabinFeatures", widget: "list", required: false }
      - { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }`;
}

// Generate product collection
function generateProductCollection(category, typeOptions) {
  const slug = category.slug || category.id;
  const icon = PRODUCT_ICONS[slug] || PRODUCT_ICONS.default;
  ensureCategoryFolder('src/content/products', slug);
  const specFields = generateCategorySpecFields(slug);

  return `
  # =========================================================
  # SẢN PHẨM - ${category.name.toUpperCase()}
  # =========================================================
  - name: "products-${slug}"
    label: "${icon} ${category.name}"
    label_singular: "${category.name}"
    folder: "src/content/products/${slug}"
    create: true
    slug: "{{id}}"
    extension: "json"
    format: "json"
    summary: "{{name}} - {{brand}}"
    sortable_fields: ['name', 'brand', 'price', 'weight']
    fields:
${getCommonProductFields(typeOptions)}${specFields}`;
}

// Generate blog collection
function generateBlogCollection(category, categoryOptions) {
  const slug = category.slug || category.id;
  const icon = BLOG_ICONS[slug] || BLOG_ICONS.default;
  ensureCategoryFolder('src/content/blog', slug);

  return `
  # =========================================================
  # BÀI VIẾT - ${category.name.toUpperCase()}
  # =========================================================
  - name: "blog-${slug}"
    label: "${icon} ${category.name}"
    label_singular: "Bài Viết"
    folder: "src/content/blog/${slug}"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    summary: "{{title}}"
    fields:
      - { label: "ID", name: "id", widget: "string", required: true }
      - { label: "Tiêu Đề", name: "title", widget: "string", required: true }
      - { label: "Slug", name: "slug", widget: "string", required: true }
      - { label: "Mô Tả", name: "description", widget: "text", required: true }
      - label: "Danh Mục"
        name: "category"
        widget: "select"
        options:
${categoryOptions}
      - { label: "Ảnh", name: "images", widget: "list", required: true }
      - { label: "Ngày Đăng (timestamp)", name: "publishDate", widget: "number", required: true }
      - { label: "Thời Gian Đọc (phút)", name: "readTime", widget: "number", required: true }
      - { label: "Tác Giả", name: "author", widget: "string", required: true }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Lượt Xem", name: "views", widget: "number", default: 0 }
      - { label: "Bình Luận", name: "comments", widget: "number", default: 0 }
      - { label: "Ẩn", name: "isHidden", widget: "boolean", default: false }
      - { label: "Nội Dung", name: "body", widget: "markdown", required: true }
      - { label: "Thứ Tự Sắp Xếp", name: "order", widget: "number", required: false }`;
}

// Extract backend config from existing config.yml
function extractBackendConfig() {
  if (!fs.existsSync(OUTPUT_FILE)) return DEFAULT_BACKEND;
  const existingConfig = fs.readFileSync(OUTPUT_FILE, 'utf-8');
  const lines = existingConfig.split('\n');
  const backendLines = [];
  for (const line of lines) {
    if (line.trim().startsWith('media_folder:')) break;
    backendLines.push(line);
  }
  const backendConfig = backendLines.join('\n').trim();
  if (!backendConfig.includes('backend:')) return DEFAULT_BACKEND;
  console.log('✓ Preserved backend config from existing config.yml');
  return backendConfig + '\n\n';
}

// Main
function main() {
  console.log('🔄 Generating CMS config.yml with NESTED spec structure...\n');

  const productCategories = readCategories(CATEGORIES_DIR);
  const blogCategories = readCategories(BLOG_CATEGORIES_DIR);

  console.log(`Found ${productCategories.length} product categories`);
  console.log(`Found ${blogCategories.length} blog categories\n`);

  const typeOptions = generateTypeOptions(productCategories);
  const categoryOptions = generateTypeOptions(blogCategories);

  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(`Template file not found: ${TEMPLATE_FILE}`);
    process.exit(1);
  }
  const baseTemplate = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  const productCollections = productCategories
    .filter(cat => !cat.isHidden)
    .map(cat => {
      const slug = cat.slug || cat.id;
      const specs = extractSpecsFromCategory(slug);
      console.log(`  • ${cat.name}: ${Object.keys(specs).length} spec types`);
      return generateProductCollection(cat, typeOptions);
    })
    .join('\n');

  const blogCollections = blogCategories
    .filter(cat => !cat.isHidden)
    .map(cat => generateBlogCollection(cat, categoryOptions))
    .join('\n');

  const backendConfig = extractBackendConfig();
  const collectionsConfig = baseTemplate
    .replace('{{PRODUCT_COLLECTIONS}}', productCollections)
    .replace('{{BLOG_COLLECTIONS}}', blogCollections);

  fs.writeFileSync(OUTPUT_FILE, backendConfig + collectionsConfig, 'utf-8');

  console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
  console.log(`   - Nested structure preserved for spec objects`);
  console.log(`   - Vietnamese labels applied`);
}

main();
