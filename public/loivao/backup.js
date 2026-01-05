/**
 * Backup System for Soosan Motor CMS
 * Provides functionality to backup website content via GitHub API
 */

// Configuration - will be loaded from site.config.json
let CONFIG = {
    repo: '',
    branch: 'main',
    contentPath: 'src/content',
    paths: {
        settings: ['src/content/settings'],
        products: ['src/content/products', 'src/content/categories'],
        blog: ['src/content/blog', 'src/content/blog-categories'],
        banners: ['src/content/banners'],
        content: ['src/content'], // All CMS content
        full: ['src', 'public', 'scripts', '.github'] // Full source code
    },
    // Root config files to include in full backup
    rootFiles: [
        'astro.config.mjs',
        'package.json',
        'package-lock.json',
        'tailwind.config.ts',
        'tsconfig.json',
        'tsconfig.astro.json',
        'postcss.config.js',
        'eslint.config.js',
        'netlify.toml',
        'components.json'
    ]
};

// Parse simple YAML (basic parser for our config format)
function parseSimpleYAML(yamlText) {
    const result = {
        backend: {},
        site_url: '',
        display_url: ''
    };

    const lines = yamlText.split('\n');
    let currentSection = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Check for section start
        if (trimmed === 'backend:') {
            currentSection = 'backend';
            continue;
        }

        // Check for top-level keys (no indentation)
        if (!line.startsWith(' ') && !line.startsWith('\t')) {
            currentSection = null;
            const match = trimmed.match(/^(\w+):\s*"?([^"]*)"?$/);
            if (match) {
                const key = match[1];
                const value = match[2].replace(/^["']|["']$/g, '');
                if (key === 'site_url') result.site_url = value;
                if (key === 'display_url') result.display_url = value;
            }
        }

        // Parse backend properties
        if (currentSection === 'backend' && (line.startsWith('  ') || line.startsWith('\t'))) {
            const match = trimmed.match(/^(\w+):\s*"?([^"]*)"?$/);
            if (match) {
                const key = match[1];
                const value = match[2].replace(/^["']|["']$/g, '');
                result.backend[key] = value;
            }
        }

        // Stop parsing when we hit media_folder (end of backend config)
        if (trimmed.startsWith('media_folder:')) {
            break;
        }
    }

    return result;
}

// Load config from config.yml (primary source)
async function loadSiteConfig() {
    try {
        // Try config.yml first (new primary source)
        const response = await fetch('/loivao/config.yml');
        if (response.ok) {
            const yamlText = await response.text();
            const config = parseSimpleYAML(yamlText);

            if (config.backend.repo) {
                CONFIG.repo = config.backend.repo;
                CONFIG.branch = config.backend.branch || 'main';
                console.log('✓ Loaded config from config.yml:', CONFIG.repo);
                return true;
            }
        }
    } catch (error) {
        console.warn('Could not load config.yml:', error);
    }

    // Fallback to site.config.json for backward compatibility
    try {
        const response = await fetch('/site.config.json');
        if (response.ok) {
            const siteConfig = await response.json();
            if (siteConfig.github) {
                CONFIG.repo = siteConfig.github.repo || CONFIG.repo;
                CONFIG.branch = siteConfig.github.branch || CONFIG.branch;
            }
            console.log('✓ Loaded config from site.config.json (fallback):', CONFIG.repo);
            return true;
        }
    } catch (error) {
        console.warn('Could not load site.config.json, using defaults:', error);
    }
    return false;
}

// State
let isBackupRunning = false;

// Logging utilities
function log(message, type = 'info') {
    const logContainer = document.getElementById('status-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
    document.getElementById('status-log').innerHTML = '';
}

function showProgress(show = true) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.classList.toggle('active', show);
}

function setProgress(percent) {
    document.getElementById('progress-fill').style.width = `${percent}%`;
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.querySelector('.btn-text').innerHTML = '<span class="spinner"></span> Đang xử lý...';
    } else {
        button.disabled = false;
        const originalText = button.dataset.originalText || button.querySelector('.btn-text').textContent;
        button.querySelector('.btn-text').textContent = originalText;
    }
}

// Get GitHub token from localStorage (set by Sveltia CMS)
function getGitHubToken() {
    // Try Sveltia CMS token storage
    const sveltiaAuth = localStorage.getItem('sveltia-cms.auth');
    if (sveltiaAuth) {
        try {
            const auth = JSON.parse(sveltiaAuth);
            if (auth.token) return auth.token;
        } catch (e) { }
    }

    // Try Netlify CMS token storage
    const netlifyAuth = localStorage.getItem('netlify-cms-user');
    if (netlifyAuth) {
        try {
            const auth = JSON.parse(netlifyAuth);
            if (auth.token) return auth.token;
        } catch (e) { }
    }

    // Try direct token
    const directToken = localStorage.getItem('github-token');
    if (directToken) return directToken;

    // Check for manually saved token
    const manualToken = localStorage.getItem('backup-github-token');
    if (manualToken) return manualToken;

    // Search ALL localStorage keys for anything containing token data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (!value) continue;

        try {
            const parsed = JSON.parse(value);
            if (typeof parsed === 'object' && parsed !== null) {
                // Check common token field names
                const tokenFields = ['token', 'access_token', 'backendToken', 'github_token', 'accessToken'];
                for (const field of tokenFields) {
                    if (parsed[field] && typeof parsed[field] === 'string' && parsed[field].length > 20) {
                        console.log(`Found token in localStorage["${key}"]["${field}"]`);
                        return parsed[field];
                    }
                }
                // Check nested 'user' or 'auth' objects
                for (const subKey of ['user', 'auth', 'data']) {
                    if (parsed[subKey] && typeof parsed[subKey] === 'object') {
                        for (const field of tokenFields) {
                            if (parsed[subKey][field] && typeof parsed[subKey][field] === 'string') {
                                console.log(`Found token in localStorage["${key}"]["${subKey}"]["${field}"]`);
                                return parsed[subKey][field];
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // Check if raw value looks like a GitHub token
            if (value.startsWith('ghp_') || value.startsWith('gho_') || value.startsWith('github_pat_')) {
                return value;
            }
        }
    }

    return null;
}

// Prompt user to enter token manually
function promptForToken() {
    const token = prompt(
        'Không tìm thấy GitHub token tự động.\n\n' +
        'Để backup, bạn cần nhập Personal Access Token (PAT) của GitHub.\n\n' +
        'Cách lấy token:\n' +
        '1. Truy cập: github.com/settings/tokens\n' +
        '2. Chọn "Generate new token (classic)"\n' +
        '3. Đặt tên, chọn quyền "repo" (full control)\n' +
        '4. Copy token và paste vào đây\n\n' +
        'Nhập GitHub Token:'
    );

    if (token && token.trim()) {
        localStorage.setItem('backup-github-token', token.trim());
        return token.trim();
    }
    return null;
}

// Fetch directory contents recursively from GitHub
async function fetchDirectoryContents(path, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/contents/${path}?ref=${CONFIG.branch}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }

    return await response.json();
}

// Fetch file content from GitHub with retry
async function fetchFileContent(filePath, token, retries = 3) {
    // Use GitHub API content endpoint instead of raw download URL
    const url = `https://api.github.com/repos/${CONFIG.repo}/contents/${filePath}?ref=${CONFIG.branch}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 403) {
                // Rate limited, wait and retry
                const waitTime = attempt * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Decode base64 content
            if (data.content) {
                return decodeBase64(data.content);
            }

            throw new Error('No content in response');
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
    }
}

// Decode base64 content (handles UTF-8)
function decodeBase64(base64String) {
    // Remove line breaks that GitHub adds
    const cleanBase64 = base64String.replace(/\n/g, '');

    // Decode base64 to binary
    const binaryString = atob(cleanBase64);

    // Convert binary to UTF-8 text
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new TextDecoder('utf-8').decode(bytes);
}

// Recursively get all files in a directory
async function getAllFiles(path, token, files = []) {
    const contents = await fetchDirectoryContents(path, token);

    for (const item of contents) {
        if (item.type === 'file') {
            files.push({
                path: item.path,
                downloadUrl: item.download_url
            });
        } else if (item.type === 'dir') {
            await getAllFiles(item.path, token, files);
        }
    }

    return files;
}

// Create and download ZIP file
async function createAndDownloadZip(files, token, backupName) {
    const zip = new JSZip();
    const totalFiles = files.length;
    let processed = 0;

    log(`Đang tải ${totalFiles} files...`, 'info');
    showProgress(true);

    for (const file of files) {
        try {
            const content = await fetchFileContent(file.path, token);
            zip.file(file.path, content);
            processed++;
            setProgress((processed / totalFiles) * 100);

            if (processed % 10 === 0 || processed === totalFiles) {
                log(`Đã xử lý ${processed}/${totalFiles} files...`, 'info');
            }
        } catch (error) {
            log(`Lỗi khi tải ${file.path}: ${error.message}`, 'warning');
        }
    }

    log('Đang tạo file ZIP...', 'info');

    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${backupName}-${timestamp}.zip`;

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
}

// Generic backup function
async function performBackup(pathsKey, backupName, buttonElement) {
    if (isBackupRunning) {
        log('Đang có backup đang chạy, vui lòng đợi...', 'warning');
        return;
    }

    const button = buttonElement || event.target.closest('button');
    button.dataset.originalText = button.querySelector('.btn-text').textContent;

    try {
        isBackupRunning = true;
        setButtonLoading(button, true);
        clearLog();

        log(`Bắt đầu backup ${backupName}...`, 'info');

        // Get token
        let token = getGitHubToken();
        if (!token) {
            log('⚠ Không tìm thấy token tự động, đang yêu cầu nhập thủ công...', 'warning');
            token = promptForToken();
            if (!token) {
                throw new Error('Không có GitHub token. Vui lòng nhập token để tiếp tục.');
            }
            log('✓ Đã nhận token thủ công', 'success');
        } else {
            log('✓ Đã xác thực token', 'success');
        }

        // Get paths to backup
        const paths = CONFIG.paths[pathsKey];
        let allFiles = [];

        for (const path of paths) {
            log(`Đang quét ${path}...`, 'info');
            try {
                const files = await getAllFiles(path, token);
                allFiles = allFiles.concat(files);
                log(`✓ Tìm thấy ${files.length} files trong ${path}`, 'success');
            } catch (error) {
                log(`⚠ Không thể đọc ${path}: ${error.message}`, 'warning');
            }
        }

        // For full backup, also include root config files
        if (pathsKey === 'full' && CONFIG.rootFiles) {
            log('Đang quét các file cấu hình gốc...', 'info');
            for (const filename of CONFIG.rootFiles) {
                allFiles.push({
                    path: filename,
                    downloadUrl: null
                });
            }
            log(`✓ Thêm ${CONFIG.rootFiles.length} file cấu hình`, 'success');
        }

        if (allFiles.length === 0) {
            throw new Error('Không tìm thấy file nào để backup');
        }

        log(`Tổng cộng ${allFiles.length} files cần backup`, 'info');

        // Create ZIP and download
        const filename = await createAndDownloadZip(allFiles, token, backupName);

        showProgress(false);
        setProgress(0);
        log(`✓ Backup hoàn tất! File: ${filename}`, 'success');

    } catch (error) {
        log(`✗ Lỗi: ${error.message}`, 'error');
        showProgress(false);
        setProgress(0);
    } finally {
        isBackupRunning = false;
        setButtonLoading(button, false);
    }
}

// Backup functions for each type
async function backupSettings() {
    await performBackup('settings', 'settings');
}

async function backupProducts() {
    await performBackup('products', 'products');
}

async function backupBlog() {
    await performBackup('blog', 'blog');
}

async function backupBanners() {
    await performBackup('banners', 'banners');
}

async function backupContent() {
    await performBackup('content', 'cms-content');
}

async function backupFull() {
    await performBackup('full', 'source-code');
}

// =====================================================
// RESTORE FUNCTIONALITY
// =====================================================

// State for restore
let restoreFiles = [];
let isRestoreRunning = false;

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processZipFile(file);
    }
}

// Setup drag and drop
function setupDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.zip')) {
            processZipFile(file);
        } else {
            log('Vui lòng chọn file ZIP', 'error');
        }
    });
}

// Process uploaded ZIP file
async function processZipFile(file) {
    try {
        clearLog();
        log(`Đang đọc file: ${file.name}...`, 'info');

        const zip = await JSZip.loadAsync(file);
        restoreFiles = [];

        // Extract file list
        zip.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) {
                restoreFiles.push({
                    path: relativePath,
                    zipEntry: zipEntry
                });
            }
        });

        if (restoreFiles.length === 0) {
            log('File ZIP trống hoặc không có nội dung hợp lệ', 'error');
            return;
        }

        // Update UI
        document.getElementById('selected-file-info').textContent = `✓ ${file.name} (${formatFileSize(file.size)})`;

        // Show preview
        showRestorePreview();

        log(`✓ Đã đọc ${restoreFiles.length} files từ backup`, 'success');

    } catch (error) {
        log(`Lỗi đọc file ZIP: ${error.message}`, 'error');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Show restore preview
function showRestorePreview() {
    const previewSection = document.getElementById('restore-preview');
    const statsContainer = document.getElementById('preview-stats');
    const filesContainer = document.getElementById('preview-files');

    // Categorize files
    const categories = {
        settings: [],
        products: [],
        blog: [],
        banners: [],
        other: []
    };

    restoreFiles.forEach(file => {
        if (file.path.includes('content/settings')) {
            categories.settings.push(file);
        } else if (file.path.includes('content/products') || file.path.includes('content/categories')) {
            categories.products.push(file);
        } else if (file.path.includes('content/blog')) {
            categories.blog.push(file);
        } else if (file.path.includes('content/banners')) {
            categories.banners.push(file);
        } else {
            categories.other.push(file);
        }
    });

    // Show stats
    statsContainer.innerHTML = `
        <div class="stat">Tổng: <strong>${restoreFiles.length}</strong> files</div>
        ${categories.settings.length ? `<div class="stat">⚙️ Settings: <strong>${categories.settings.length}</strong></div>` : ''}
        ${categories.products.length ? `<div class="stat">📦 Sản phẩm: <strong>${categories.products.length}</strong></div>` : ''}
        ${categories.blog.length ? `<div class="stat">📝 Bài viết: <strong>${categories.blog.length}</strong></div>` : ''}
        ${categories.banners.length ? `<div class="stat">🎨 Banners: <strong>${categories.banners.length}</strong></div>` : ''}
        ${categories.other.length ? `<div class="stat">📁 Khác: <strong>${categories.other.length}</strong></div>` : ''}
    `;

    // Show file list (limit to 50 for performance)
    const displayFiles = restoreFiles.slice(0, 50);
    filesContainer.innerHTML = displayFiles.map(f =>
        `<div class="file-item">${f.path}</div>`
    ).join('');

    if (restoreFiles.length > 50) {
        filesContainer.innerHTML += `<div class="file-item" style="color: var(--warning)">... và ${restoreFiles.length - 50} files khác</div>`;
    }

    // Detect source config from backup
    detectSourceConfig();

    // Set default values from current website config
    document.getElementById('target-repo').placeholder = `Mặc định: ${CONFIG.repo}`;
    document.getElementById('target-branch').value = CONFIG.branch || 'main';
    document.getElementById('target-domain').placeholder = `Mặc định: ${extractDomain()}`;

    // Update config info display
    updateConfigInfo();

    // Add event listeners for real-time config info update
    document.getElementById('target-repo').addEventListener('input', updateConfigInfo);
    document.getElementById('target-branch').addEventListener('input', updateConfigInfo);
    document.getElementById('target-domain').addEventListener('input', updateConfigInfo);

    previewSection.style.display = 'block';
}

// Source config detected from backup
let sourceConfig = {
    repo: '',
    domain: ''
};

// Detect source config from backup files
async function detectSourceConfig() {
    // Priority 1: Try to find config.yml in backup (primary CMS config)
    const configYmlFile = restoreFiles.find(f => 
        f.path.endsWith('loivao/config.yml') || f.path.endsWith('config.yml')
    );

    if (configYmlFile) {
        try {
            const content = await configYmlFile.zipEntry.async('string');
            const config = parseSimpleYAML(content);
            if (config.backend.repo) {
                sourceConfig.repo = config.backend.repo;
            }
            if (config.backend.site_domain) {
                sourceConfig.domain = config.backend.site_domain;
            }
            console.log('Detected source config from config.yml:', sourceConfig);
            updateConfigInfo();
        } catch (e) {
            console.log('Could not parse config.yml from backup:', e);
        }
    }

    // Priority 2: Try to find site.config.json in backup (fallback)
    if (!sourceConfig.repo || !sourceConfig.domain) {
        const siteConfigFile = restoreFiles.find(f => f.path.endsWith('site.config.json'));

        if (siteConfigFile) {
            try {
                const content = await siteConfigFile.zipEntry.async('string');
                const config = JSON.parse(content);
                if (!sourceConfig.repo && config.github?.repo) {
                    sourceConfig.repo = config.github.repo;
                }
                if (!sourceConfig.domain && config.netlify?.siteDomain) {
                    sourceConfig.domain = config.netlify.siteDomain;
                }
                console.log('Detected source config from site.config.json:', sourceConfig);
                updateConfigInfo();
            } catch (e) {
                console.log('Could not parse site.config.json from backup');
            }
        }
    }
}

// Extract domain from current config
function extractDomain() {
    // Try to get domain from various sources
    if (typeof window !== 'undefined') {
        return window.location.hostname;
    }
    return '';
}

// Update config info display
function updateConfigInfo() {
    const configInfo = document.getElementById('config-info');

    const targetRepo = document.getElementById('target-repo').value.trim() || CONFIG.repo;
    const targetBranch = document.getElementById('target-branch').value.trim() || CONFIG.branch;
    const targetDomain = document.getElementById('target-domain').value.trim() || extractDomain();

    const willReplace = (sourceConfig.repo && sourceConfig.repo !== targetRepo) ||
        (sourceConfig.domain && sourceConfig.domain !== targetDomain);

    let html = '';

    if (sourceConfig.repo || sourceConfig.domain) {
        html += `<div class="source-config">📦 Nguồn (từ backup): ${sourceConfig.repo || '?'} → ${sourceConfig.domain || '?'}</div>`;
    }

    html += `<div class="target-config-display">🎯 Đích: ${targetRepo} (${targetBranch}) → ${targetDomain}</div>`;

    if (willReplace) {
        html += `<div style="color: var(--primary); margin-top: 8px;">⚠️ Sẽ tự động thay thế repo/domain trong các file config</div>`;
    }

    configInfo.innerHTML = html;
}

// Cancel restore
function cancelRestore() {
    restoreFiles = [];
    document.getElementById('restore-preview').style.display = 'none';
    document.getElementById('selected-file-info').textContent = '';
    document.getElementById('restore-file').value = '';
    log('Đã hủy restore', 'info');
}

// =====================================================
// BATCHED RESTORE - Single commit for all files
// Uses GitHub Git Trees API to minimize deploys
// =====================================================

// Get the latest commit SHA of a branch
async function getLatestCommitSha(token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/refs/heads/${CONFIG.branch}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get branch ref: ${response.status}`);
    }

    const data = await response.json();
    return data.object.sha;
}

// Get the tree SHA from a commit
async function getTreeSha(commitSha, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/commits/${commitSha}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get commit: ${response.status}`);
    }

    const data = await response.json();
    return data.tree.sha;
}

// Create a blob for file content
async function createBlob(content, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/blobs`;

    // Encode content to base64
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: base64Content,
            encoding: 'base64'
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create blob: ${response.status}`);
    }

    const data = await response.json();
    return data.sha;
}

// Create a new tree with all files
async function createTree(baseTreeSha, files, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/trees`;

    const tree = files.map(file => ({
        path: file.path,
        mode: '100644', // file mode
        type: 'blob',
        sha: file.blobSha
    }));

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: tree
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create tree: ${response.status}`);
    }

    const data = await response.json();
    return data.sha;
}

// Create a new commit
async function createCommit(treeSha, parentCommitSha, message, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/commits`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            tree: treeSha,
            parents: [parentCommitSha]
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create commit: ${response.status}`);
    }

    const data = await response.json();
    return data.sha;
}

// Update branch ref to point to new commit
async function updateBranchRef(commitSha, token) {
    const url = `https://api.github.com/repos/${CONFIG.repo}/git/refs/heads/${CONFIG.branch}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sha: commitSha,
            force: false
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update branch ref: ${response.status}`);
    }

    return await response.json();
}

// Files that need repo/domain replacement
const CONFIG_FILES = [
    'public/site.config.json',
    'site.config.json',
    'public/loivao/config.yml'
];

// Replace repo and domain in file content
function replaceConfigValues(content, filePath, sourceRepo, sourceDomain, targetRepo, targetDomain) {
    let modified = content;

    // Only process config files
    const isConfigFile = CONFIG_FILES.some(cf => filePath.endsWith(cf));
    if (!isConfigFile) return modified;

    // Replace repo
    if (sourceRepo && targetRepo && sourceRepo !== targetRepo) {
        // Replace full repo path
        modified = modified.split(sourceRepo).join(targetRepo);
    }

    // Replace domain
    if (sourceDomain && targetDomain && sourceDomain !== targetDomain) {
        // Replace full domain
        modified = modified.split(sourceDomain).join(targetDomain);

        // Also replace https:// prefixed versions
        modified = modified.split(`https://${sourceDomain}`).join(`https://${targetDomain}`);
    }

    return modified;
}

// Perform batched restore - ALL files in ONE commit
async function performRestore() {
    if (isRestoreRunning) {
        log('Đang có restore đang chạy, vui lòng đợi...', 'warning');
        return;
    }

    if (restoreFiles.length === 0) {
        log('Không có file nào để restore', 'error');
        return;
    }

    // Get target config from form
    const targetRepo = document.getElementById('target-repo').value.trim() || CONFIG.repo;
    const targetBranch = document.getElementById('target-branch').value.trim() || CONFIG.branch;
    const targetDomain = document.getElementById('target-domain').value.trim() || extractDomain();

    // Check if we need to replace config values
    const needsReplacement = (sourceConfig.repo && sourceConfig.repo !== targetRepo) ||
        (sourceConfig.domain && sourceConfig.domain !== targetDomain);

    // Build confirmation message
    let confirmMsg = `Bạn có chắc muốn khôi phục ${restoreFiles.length} files?\n\n`;
    confirmMsg += `📦 Repo đích: ${targetRepo}\n`;
    confirmMsg += `🌿 Branch: ${targetBranch}\n`;
    confirmMsg += `🌐 Domain: ${targetDomain}\n\n`;

    if (needsReplacement) {
        confirmMsg += `⚠️ Sẽ tự động thay thế:\n`;
        if (sourceConfig.repo !== targetRepo) {
            confirmMsg += `   ${sourceConfig.repo} → ${targetRepo}\n`;
        }
        if (sourceConfig.domain !== targetDomain) {
            confirmMsg += `   ${sourceConfig.domain} → ${targetDomain}\n`;
        }
        confirmMsg += '\n';
    }

    confirmMsg += `✓ Tất cả sẽ được gộp vào MỘT commit duy nhất.`;

    if (!confirm(confirmMsg)) {
        return;
    }

    const button = document.getElementById('btn-restore');
    button.dataset.originalText = button.querySelector('.btn-text').textContent;

    try {
        isRestoreRunning = true;
        setButtonLoading(button, true);

        log('🚀 Bắt đầu restore (batched - single commit)...', 'info');
        log(`   Repo đích: ${targetRepo}`, 'info');
        log(`   Branch: ${targetBranch}`, 'info');
        log(`   Domain: ${targetDomain}`, 'info');

        // Get token
        let token = getGitHubToken();
        if (!token) {
            token = promptForToken();
            if (!token) {
                throw new Error('Không có GitHub token');
            }
        }
        log('✓ Đã xác thực token', 'success');

        // Use target repo for API calls
        const originalRepo = CONFIG.repo;
        const originalBranch = CONFIG.branch;
        CONFIG.repo = targetRepo;
        CONFIG.branch = targetBranch;

        showProgress(true);
        const total = restoreFiles.length;

        // Step 1: Get latest commit and tree
        log('📥 Đang lấy thông tin repository...', 'info');
        const latestCommitSha = await getLatestCommitSha(token);
        const baseTreeSha = await getTreeSha(latestCommitSha, token);
        log(`✓ Base commit: ${latestCommitSha.substring(0, 7)}`, 'success');

        // Step 2: Create blobs for all files
        log(`📦 Đang tạo blobs cho ${total} files...`, 'info');
        if (needsReplacement) {
            log(`🔄 Đang thay thế config values...`, 'info');
        }

        const filesWithBlobs = [];
        let processed = 0;
        let replacedCount = 0;

        for (const file of restoreFiles) {
            try {
                // Read file content from ZIP
                let content = await file.zipEntry.async('string');

                // Replace config values if needed
                if (needsReplacement) {
                    const originalContent = content;
                    content = replaceConfigValues(
                        content,
                        file.path,
                        sourceConfig.repo,
                        sourceConfig.domain,
                        targetRepo,
                        targetDomain
                    );
                    if (content !== originalContent) {
                        replacedCount++;
                    }
                }

                // Create blob
                const blobSha = await createBlob(content, token);

                filesWithBlobs.push({
                    path: file.path,
                    blobSha: blobSha
                });

                processed++;
                setProgress((processed / total) * 50); // First 50% for blobs

                if (processed % 10 === 0 || processed === total) {
                    log(`   Đã xử lý ${processed}/${total} files...`, 'info');
                }

                // Small delay to avoid rate limiting
                if (processed < total) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            } catch (error) {
                log(`⚠ Bỏ qua ${file.path}: ${error.message}`, 'warning');
            }
        }

        if (filesWithBlobs.length === 0) {
            throw new Error('Không có file nào được xử lý thành công');
        }

        if (replacedCount > 0) {
            log(`✓ Đã thay thế config trong ${replacedCount} files`, 'success');
        }

        // Step 3: Create new tree
        log('🌳 Đang tạo Git tree...', 'info');
        setProgress(60);
        const newTreeSha = await createTree(baseTreeSha, filesWithBlobs, token);
        log(`✓ Tree created: ${newTreeSha.substring(0, 7)}`, 'success');

        // Step 4: Create commit
        log('💾 Đang tạo commit...', 'info');
        setProgress(80);
        const timestamp = new Date().toLocaleString('vi-VN');
        const commitMessage = `[Restore] Khôi phục ${filesWithBlobs.length} files - ${timestamp}`;
        const newCommitSha = await createCommit(newTreeSha, latestCommitSha, commitMessage, token);
        log(`✓ Commit created: ${newCommitSha.substring(0, 7)}`, 'success');

        // Step 5: Update branch ref
        log('🔄 Đang cập nhật branch...', 'info');
        setProgress(90);
        await updateBranchRef(newCommitSha, token);

        setProgress(100);
        showProgress(false);

        log(`✅ Restore hoàn tất!`, 'success');
        log(`   📁 ${filesWithBlobs.length}/${total} files đã được khôi phục`, 'success');
        log(`   🔗 Commit: ${newCommitSha.substring(0, 7)}`, 'success');
        log(`   🎯 Repo: ${targetRepo}`, 'success');
        log(`   ⚡ Chỉ trigger 1 lần deploy trên Netlify`, 'success');

        // Restore original config
        CONFIG.repo = originalRepo;
        CONFIG.branch = originalBranch;

        // Reset UI
        cancelRestore();

    } catch (error) {
        log(`✗ Lỗi: ${error.message}`, 'error');
        showProgress(false);
        setProgress(0);
    } finally {
        isRestoreRunning = false;
        setButtonLoading(button, false);
    }
}

// =====================================================
// SYNC CATEGORIES - Rename files/folders based on ID
// =====================================================

let pendingSyncChanges = [];

// Scan for category changes
async function scanCategoryChanges() {
    const button = event.target.closest('button');
    button.dataset.originalText = button.querySelector('.btn-text').textContent;

    try {
        setButtonLoading(button, true);
        clearLog();
        log('🔍 Đang quét danh mục...', 'info');

        // Get token
        let token = getGitHubToken();
        if (!token) {
            token = promptForToken();
            if (!token) {
                throw new Error('Cần GitHub token để tiếp tục');
            }
        }

        pendingSyncChanges = [];

        // Fetch all category files
        const categoriesPath = 'src/content/categories';
        let categoryFiles;
        try {
            categoryFiles = await fetchDirectoryContents(categoriesPath, token);
        } catch (e) {
            throw new Error(`Không thể đọc thư mục categories: ${e.message}`);
        }

        log(`✓ Tìm thấy ${categoryFiles.length} danh mục`, 'success');

        // Analyze each category
        for (const file of categoryFiles) {
            if (!file.name.endsWith('.json')) continue;

            const filename = file.name.replace('.json', '');

            // Fetch category content
            const content = await fetchFileContent(file.path, token);
            const category = JSON.parse(content);
            const categoryId = category.id;

            log(`  📁 ${filename}.json → id: "${categoryId}"`, 'info');

            // Check if filename matches id
            if (filename !== categoryId) {
                // Need to rename category file
                pendingSyncChanges.push({
                    type: 'rename-category',
                    from: `${categoriesPath}/${filename}.json`,
                    to: `${categoriesPath}/${categoryId}.json`,
                    content: content,
                    oldId: filename,
                    newId: categoryId
                });

                log(`  ⚠️ Cần đổi tên: ${filename}.json → ${categoryId}.json`, 'warning');

                // Check if product folder exists with old name
                const oldProductFolder = `src/content/products/${filename}`;
                const newProductFolder = `src/content/products/${categoryId}`;

                try {
                    const folderContents = await fetchDirectoryContents(oldProductFolder, token);

                    // Need to move all files in folder
                    for (const productFile of folderContents) {
                        if (productFile.type === 'file') {
                            const productContent = await fetchFileContent(productFile.path, token);

                            // Update type field in product
                            let updatedContent = productContent;
                            if (productContent.includes(`"type": "${filename}"`)) {
                                updatedContent = productContent.replace(
                                    `"type": "${filename}"`,
                                    `"type": "${categoryId}"`
                                );
                            }

                            pendingSyncChanges.push({
                                type: 'move-product',
                                from: productFile.path,
                                to: `${newProductFolder}/${productFile.name}`,
                                content: updatedContent,
                                needsTypeUpdate: productContent !== updatedContent
                            });
                        }
                    }

                    log(`  ⚠️ Cần di chuyển ${folderContents.filter(f => f.type === 'file').length} sản phẩm từ ${filename}/ → ${categoryId}/`, 'warning');

                    // Mark old folder files for deletion
                    pendingSyncChanges.push({
                        type: 'delete-old-folder',
                        folder: oldProductFolder,
                        files: folderContents.filter(f => f.type === 'file').map(f => f.path)
                    });

                } catch (e) {
                    // Folder doesn't exist with old name, try new name
                    try {
                        await fetchDirectoryContents(newProductFolder, token);
                        log(`  ✓ Folder sản phẩm đã đúng: ${categoryId}/`, 'success');
                    } catch (e2) {
                        log(`  ℹ️ Không tìm thấy folder sản phẩm cho ${filename}`, 'info');
                    }
                }
            } else {
                log(`  ✓ Đã khớp: ${filename}.json`, 'success');
            }
        }

        // Update UI
        const previewDiv = document.getElementById('sync-preview');
        const changesList = document.getElementById('sync-changes-list');
        const applyBtn = document.getElementById('btn-sync-categories');

        if (pendingSyncChanges.length > 0) {
            let html = '';
            const renames = pendingSyncChanges.filter(c => c.type === 'rename-category');
            const moves = pendingSyncChanges.filter(c => c.type === 'move-product');

            if (renames.length > 0) {
                html += `<div style="color: #fbbf24; margin-bottom: 8px;">📝 Đổi tên ${renames.length} file danh mục</div>`;
                renames.forEach(r => {
                    html += `<div style="color: var(--text-muted); margin-left: 15px;">• ${r.from.split('/').pop()} → ${r.to.split('/').pop()}</div>`;
                });
            }

            if (moves.length > 0) {
                html += `<div style="color: #60a5fa; margin-top: 8px; margin-bottom: 8px;">📦 Di chuyển ${moves.length} file sản phẩm</div>`;
            }

            changesList.innerHTML = html;
            previewDiv.style.display = 'block';
            applyBtn.disabled = false;

            log(`\n✅ Tìm thấy ${pendingSyncChanges.length} thay đổi cần thực hiện`, 'success');
        } else {
            previewDiv.style.display = 'none';
            applyBtn.disabled = true;
            log(`\n✅ Tất cả danh mục đã được đồng bộ! Không cần thay đổi.`, 'success');
        }

    } catch (error) {
        log(`✗ Lỗi: ${error.message}`, 'error');
    } finally {
        setButtonLoading(button, false);
    }
}

// Apply category sync changes
async function applyCategorySync() {
    if (pendingSyncChanges.length === 0) {
        log('Không có thay đổi nào để áp dụng', 'warning');
        return;
    }

    const button = document.getElementById('btn-sync-categories');
    button.dataset.originalText = button.querySelector('.btn-text').textContent;

    try {
        setButtonLoading(button, true);
        showProgress(true);

        log('⚡ Đang áp dụng thay đổi...', 'info');

        // Get token
        let token = getGitHubToken();
        if (!token) {
            token = promptForToken();
            if (!token) {
                throw new Error('Cần GitHub token để tiếp tục');
            }
        }

        // Get latest commit
        log('📥 Đang lấy commit mới nhất...', 'info');
        const latestCommitSha = await getLatestCommitSha(token);
        const baseTreeSha = await getTreeSha(latestCommitSha, token);

        // Prepare files for new tree
        const filesForTree = [];
        const filesToDelete = [];
        let processed = 0;
        const total = pendingSyncChanges.filter(c => c.type !== 'delete-old-folder').length;

        for (const change of pendingSyncChanges) {
            if (change.type === 'rename-category' || change.type === 'move-product') {
                // Create blob for new file
                const blobSha = await createBlob(change.content, token);
                filesForTree.push({
                    path: change.to,
                    blobSha: blobSha
                });

                // Mark old file for deletion
                filesToDelete.push(change.from);

                processed++;
                setProgress((processed / total) * 80);
                log(`  ✓ ${change.from.split('/').pop()} → ${change.to.split('/').pop()}`, 'success');
            } else if (change.type === 'delete-old-folder') {
                filesToDelete.push(...change.files);
            }
        }

        // Create tree with files (new files + deletions)
        log('🌳 Đang tạo tree mới...', 'info');

        // For deletions, we need to create tree entries with sha = null
        const treeEntries = filesForTree.map(file => ({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: file.blobSha
        }));

        // Add deletion entries
        for (const deleteFile of filesToDelete) {
            treeEntries.push({
                path: deleteFile,
                mode: '100644',
                type: 'blob',
                sha: null // null sha = delete file
            });
        }

        // Create tree via API
        const treeUrl = `https://api.github.com/repos/${CONFIG.repo}/git/trees`;
        const treeResponse = await fetch(treeUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: treeEntries
            })
        });

        if (!treeResponse.ok) {
            throw new Error(`Failed to create tree: ${treeResponse.status}`);
        }

        const newTree = await treeResponse.json();
        setProgress(90);

        // Create commit
        log('📝 Đang tạo commit...', 'info');
        const commitMessage = `[Auto-Sync] Đổi tên danh mục: ${pendingSyncChanges.filter(c => c.type === 'rename-category').map(c => c.oldId + ' → ' + c.newId).join(', ')}`;
        const newCommitSha = await createCommit(newTree.sha, latestCommitSha, commitMessage, token);

        // Update branch ref
        log('🚀 Đang cập nhật branch...', 'info');
        await updateBranchRef(newCommitSha, token);
        setProgress(100);

        log(`\n✅ Đồng bộ hoàn tất!`, 'success');
        log(`   🔗 Commit: ${newCommitSha.substring(0, 7)}`, 'success');
        log(`   ⚡ Netlify sẽ tự động deploy`, 'success');

        // Reset UI
        pendingSyncChanges = [];
        document.getElementById('sync-preview').style.display = 'none';
        document.getElementById('btn-sync-categories').disabled = true;

    } catch (error) {
        log(`✗ Lỗi: ${error.message}`, 'error');
    } finally {
        showProgress(false);
        setProgress(0);
        setButtonLoading(button, false);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const accessDenied = document.getElementById('access-denied');
    const mainContent = document.getElementById('main-content');

    // Load site config first
    await loadSiteConfig();

    // Check token availability for access control
    const token = getGitHubToken();

    if (token) {
        // User has token - show main content
        if (mainContent) mainContent.classList.add('show');
        if (accessDenied) accessDenied.classList.remove('show');

        // Setup restore drag-drop
        setupDragDrop();

        log('Sẵn sàng thực hiện backup/restore. Chọn chức năng bên trên.', 'info');
        log(`✓ Đã tìm thấy GitHub token`, 'success');
        log(`✓ Repo: ${CONFIG.repo}`, 'success');
    } else {
        // No token - show access denied
        if (accessDenied) accessDenied.classList.add('show');
        if (mainContent) mainContent.classList.remove('show');
    }
});

