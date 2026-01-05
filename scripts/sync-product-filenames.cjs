/**
 * sync-product-filenames.cjs
 * 
 * Script tự động đổi tên file JSON sản phẩm theo trường "id" bên trong file.
 * Khi bạn thay đổi id/slug của sản phẩm qua CMS, script này sẽ:
 * 1. Đọc trường "id" từ nội dung file
 * 2. So sánh với tên file hiện tại
 * 3. Đổi tên file nếu không khớp
 * 
 * Chạy tự động trong: npm run prebuild
 */

const fs = require('fs');
const path = require('path');

// Các thư mục chứa sản phẩm
const PRODUCT_FOLDERS = [
    'src/content/products/xe-tai',
    'src/content/products/mooc',
    'src/content/products/xe-cau',
    'src/content/products/dau-keo',
    'src/content/products/xe-lu'
];

console.log('🔄 Syncing product filenames with IDs...');

let totalRenamed = 0;

PRODUCT_FOLDERS.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);

    if (!fs.existsSync(folderPath)) {
        return;
    }

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(content);

            if (!data.id) {
                console.log(`   ⚠️ No id field in: ${file}`);
                return;
            }

            // Tên file mong đợi dựa trên id
            const expectedFilename = `${data.id}.json`;

            // So sánh với tên file hiện tại
            if (file !== expectedFilename) {
                const newFilePath = path.join(folderPath, expectedFilename);

                // Kiểm tra file đích đã tồn tại chưa
                if (fs.existsSync(newFilePath)) {
                    console.log(`   ❌ Cannot rename: ${file} → ${expectedFilename} (target exists)`);
                    return;
                }

                // Đổi tên file
                fs.renameSync(filePath, newFilePath);
                console.log(`   ✅ Renamed: ${file} → ${expectedFilename}`);
                totalRenamed++;
            }
        } catch (err) {
            console.log(`   ❌ Error processing ${file}: ${err.message}`);
        }
    });
});

console.log(`📊 Summary: ${totalRenamed} file(s) renamed`);
if (totalRenamed === 0) {
    console.log('✨ All product files already match their IDs!');
}
