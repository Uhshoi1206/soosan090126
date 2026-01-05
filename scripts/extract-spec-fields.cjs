/**
 * Auto-generate CMS config with ALL spec fields from existing product data
 * This script scans all product JSON files and extracts the actual field structure
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../src/content/products');
const CATEGORIES = ['mooc', 'can-cau', 'dau-keo', 'xe-tai', 'may-moc-thiet-bi'];

// Vietnamese labels for common field names
const FIELD_LABELS = {
    // General
    'capacity': 'Dung Tích',
    'capacityText': 'Dung Tích (Text)',
    'material': 'Vật Liệu',
    'thickness': 'Độ Dày',
    'tankShape': 'Hình Dạng Bồn',
    'tankDimension': 'Kích Thước Bồn',
    'compartments': 'Số Khoang',
    'model': 'Model',
    'type': 'Loại',

    // Pump
    'pumpType': 'Loại Bơm',
    'pumpFlowRate': 'Lưu Lượng Bơm',
    'pumpPressure': 'Áp Suất Bơm',
    'pumpDrive': 'Dẫn Động Bơm',
    'pumpCapacity': 'Công Suất Bơm',

    // Hydraulic
    'hydraulicSystem': 'Hệ Thống Thủy Lực',
    'hydraulicPump': 'Bơm Thủy Lực',
    'hydraulicMotor': 'Motor Thủy Lực',
    'hydraulicPressure': 'Áp Suất Thủy Lực',

    // Crane
    'maxLiftingCapacity': 'Sức Nâng Tối Đa',
    'liftingCapacityText': 'Sức Nâng (Text)',
    'maxLiftingMoment': 'Mô-men Nâng Tối Đa',
    'maxLiftingHeight': 'Chiều Cao Nâng Tối Đa',
    'maxWorkingRadius': 'Bán Kính Làm Việc Tối Đa',
    'boomType': 'Loại Cần',
    'boomSections': 'Số Đốt Cần',
    'boomLength': 'Chiều Dài Cần',
    'boomLuffingAngle': 'Góc Nâng Cần',
    'swingAngle': 'Góc Xoay',
    'swingSpeed': 'Tốc Độ Xoay',
    'outriggersType': 'Loại Chân Chống',

    // Tank
    'tankVolume': 'Dung Tích Bồn',
    'tankMaterial': 'Vật Liệu Bồn',
    'innerMaterial': 'Vật Liệu Bên Trong',
    'outerShell': 'Vỏ Ngoài',
    'insulationMaterial': 'Vật Liệu Bảo Ôn',

    // Safety
    'safetySystem': 'Hệ Thống An Toàn',
    'safetyFeatures': 'Tính Năng An Toàn',

    // Dimensions
    'workingHeight': 'Chiều Cao Làm Việc',
    'horizontalReach': 'Tầm Vươn Ngang',
    'platformCapacity': 'Tải Trọng Sàn',
    'platformSize': 'Kích Thước Sàn',

    // Vehicle specific
    'waterTankCapacity': 'Dung Tích Bình Nước',
    'controlSystem': 'Hệ Thống Điều Khiển',
    'certifications': 'Chứng Nhận',

    // Excavator/Loader
    'bucketCapacity': 'Dung Tích Gầu',
    'maxDiggingDepth': 'Chiều Sâu Đào Tối Đa',
    'maxReach': 'Tầm Với Tối Đa',
    'breakoutForce': 'Lực Bứt',

    // Roller
    'drumWidth': 'Chiều Rộng Trống',
    'drumDiameter': 'Đường Kính Trống',
    'centrifugalForce': 'Lực Li Tâm',
    'frequency': 'Tần Số',
    'amplitude': 'Biên Độ',

    // Forklift
    'loadCapacity': 'Tải Trọng',
    'liftHeight': 'Chiều Cao Nâng',
    'forkDimensions': 'Kích Thước Càng Nâng',
};

// Convert camelCase to Title Case Vietnamese
function getFieldLabel(fieldName) {
    if (FIELD_LABELS[fieldName]) {
        return FIELD_LABELS[fieldName];
    }
    // Convert camelCase to Title Case
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

// Get widget type based on value
function getWidgetType(value) {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'list';
    return 'string';
}

// Collect all spec fields from products
function collectSpecFields() {
    const specFields = {};

    CATEGORIES.forEach(category => {
        const dir = path.join(PRODUCTS_DIR, category);
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

        files.forEach(file => {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));

            Object.keys(data).forEach(key => {
                // Check if it's a spec object
                if ((key.endsWith('Spec') || key === 'closedBox' || key === 'tailLift')
                    && typeof data[key] === 'object' && !Array.isArray(data[key])) {

                    if (!specFields[key]) {
                        specFields[key] = {
                            fields: new Map(),
                            categories: new Set()
                        };
                    }

                    specFields[key].categories.add(category);

                    // Collect field names and their types
                    Object.keys(data[key]).forEach(fieldName => {
                        if (!specFields[key].fields.has(fieldName)) {
                            specFields[key].fields.set(fieldName, getWidgetType(data[key][fieldName]));
                        }
                    });
                }
            });
        });
    });

    return specFields;
}

// Generate YAML for a spec object
function generateSpecYAML(specName, specData) {
    const label = specName
        .replace(/Spec$/, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();

    let yaml = `      - label: "📋 ${label}"
        name: "${specName}"
        widget: "object"
        collapsed: true
        required: false
        fields:\n`;

    specData.fields.forEach((widgetType, fieldName) => {
        const fieldLabel = getFieldLabel(fieldName);
        yaml += `          - { label: "${fieldLabel}", name: "${fieldName}", widget: "${widgetType}", required: false }\n`;
    });

    return yaml;
}

// Main
function main() {
    console.log('🔍 Collecting spec fields from all products...\n');

    const specFields = collectSpecFields();

    console.log('Found spec types:\n');
    Object.keys(specFields).sort().forEach(specName => {
        const data = specFields[specName];
        console.log(`  ${specName}: ${data.fields.size} fields (in ${Array.from(data.categories).join(', ')})`);
    });

    // Generate YAML for each spec
    console.log('\n\n--- Generated YAML ---\n');
    Object.keys(specFields).sort().forEach(specName => {
        console.log(generateSpecYAML(specName, specFields[specName]));
    });
}

main();
