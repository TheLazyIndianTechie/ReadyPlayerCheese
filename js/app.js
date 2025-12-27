/**
 * ReadyPlayerMe Avatar Viewer
 * Main application JavaScript
 */

// ============================================================================
// State Management
// ============================================================================

const state = {
    avatarId: '64e3055495439dfcf3f0b665',
    format: 'png',
    quality: 80,
    pose: '',
    expression: '',
    camera: 'portrait',
    size: 512,
    backgroundColor: '#FFFFFF',
    transparentBg: false,
    scene: '',
    blendShapes: {
        mouthSmile: 0,
        browInnerUp: 0,
        eyeBlinkLeft: 0,
        eyeBlinkRight: 0,
        browDownLeft: 0,
        browDownRight: 0,
    },
    isImageLoaded: false,
    isBulkDownloading: false,
    currentUrl: null,
};

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    // Form Inputs
    avatarId: document.getElementById('avatarId'),
    imageFormat: document.getElementById('imageFormat'),
    imageQuality: document.getElementById('imageQuality'),
    pose: document.getElementById('pose'),
    expression: document.getElementById('expression'),
    scene: document.getElementById('scene'),
    camera: document.getElementById('camera'),
    imageSize: document.getElementById('imageSize'),
    backgroundColor: document.getElementById('backgroundColor'),
    transparentBg: document.getElementById('transparentBg'),
    qualityGroup: document.getElementById('qualityGroup'),
    qualityValue: document.getElementById('qualityValue'),
    clearAvatarId: document.getElementById('clearAvatarId'),
    
    // Blend Shapes
    blendShapeSliders: document.querySelectorAll('.blend-shape-slider'),
    resetBlendShapesBtn: document.getElementById('resetBlendShapesBtn'),

    // Buttons
    previewBtn: document.getElementById('previewBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    getallBtn: document.getElementById('getallBtn'),
    retryBtn: document.getElementById('retryBtn'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),

    // Preview Area
    previewArea: document.getElementById('previewArea'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    imageInfo: document.getElementById('imageInfo'),
    imageDimensions: document.getElementById('imageDimensions'),
    imageFormatInfo: document.getElementById('imageFormatInfo'),
    apiUrl: document.getElementById('apiUrl'),

    // Bulk Download
    bulkDownloadProgress: document.getElementById('bulkDownloadProgress'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    cancelBulkBtn: document.getElementById('cancelBulkBtn'),
    bulkConfirmModal: document.getElementById('bulkConfirmModal'),
    confirmProceedBtn: document.getElementById('confirmProceedBtn'),
    confirmCancelBtn: document.getElementById('confirmCancelBtn'),
    estimatedSize: document.getElementById('estimatedSize'),
    estimatedTime: document.getElementById('estimatedTime'),
    bulkTransparentBg: document.getElementById('bulkTransparentBg'),
};

// ============================================================================
// API Configuration
// ============================================================================

const API_BASE = 'https://models.readyplayer.me';
const API_TIMEOUT = 15000; // 15 seconds
const BULK_TIMEOUT = 20000; // 20 seconds for bulk downloads
const MAX_RETRIES = 2; // Retry failed requests up to 2 times

const POSES = ['', 'power-stance', 'relaxed', 'standing', 'thumbs-up'];
const EXPRESSIONS = ['', 'happy', 'lol', 'sad', 'scared', 'rage'];

// ============================================================================
// Initialization
// ============================================================================

function init() {
    setupEventListeners();
    validateAvatarId();
    updateFormatUI();
}

function setupEventListeners() {
    // Avatar ID
    elements.avatarId.addEventListener('input', debounce(validateAvatarId, 300));
    elements.clearAvatarId.addEventListener('click', clearAvatarIdField);

    // Format
    elements.imageFormat.addEventListener('change', handleFormatChange);
    elements.imageQuality.addEventListener('input', handleQualityChange);

    // Controls
    elements.pose.addEventListener('change', updateState);
    elements.expression.addEventListener('change', updateState);
    elements.scene.addEventListener('change', updateState);
    elements.camera.addEventListener('change', updateState);
    elements.imageSize.addEventListener('change', updateState);

    // Color
    elements.backgroundColor.addEventListener('input', handleColorChange);
    elements.transparentBg.addEventListener('change', handleTransparentChange);

    // Blend Shapes
    elements.blendShapeSliders.forEach(slider => {
        slider.addEventListener('input', handleBlendShapeChange);
    });
    elements.resetBlendShapesBtn.addEventListener('click', resetBlendShapes);

    // Buttons
    elements.previewBtn.addEventListener('click', previewAvatar);
    elements.downloadBtn.addEventListener('click', downloadSingleImage);
    elements.getallBtn.addEventListener('click', showBulkConfirmation);
    elements.retryBtn.addEventListener('click', previewAvatar);
    elements.copyUrlBtn.addEventListener('click', copyApiUrl);

    // Bulk Download Modal
    elements.confirmProceedBtn.addEventListener('click', startBulkDownload);
    elements.confirmCancelBtn.addEventListener('click', closeBulkConfirmation);
    elements.cancelBulkBtn.addEventListener('click', cancelBulkDownload);
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateAvatarId() {
    const id = elements.avatarId.value.trim();
    const isValid = /^[a-f0-9]{24}$/i.test(id);
    const errorEl = document.getElementById('avatarIdError');

    if (id === '') {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        state.avatarId = '';
        updateButtonStates();
        return false;
    }

    if (!isValid) {
        errorEl.textContent = 'Avatar ID must be 24 hexadecimal characters';
        errorEl.classList.remove('hidden');
        elements.avatarId.setAttribute('aria-invalid', 'true');
        updateButtonStates();
        return false;
    }

    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    elements.avatarId.setAttribute('aria-invalid', 'false');
    state.avatarId = id;
    updateButtonStates();
    return true;
}

function updateButtonStates() {
    const isValidId = state.avatarId && /^[a-f0-9]{24}$/i.test(state.avatarId);
    elements.previewBtn.disabled = !isValidId;
    elements.getallBtn.disabled = !isValidId;
}

function clearAvatarIdField() {
    elements.avatarId.value = '';
    state.avatarId = '';
    validateAvatarId();
}

// ============================================================================
// State Update Functions
// ============================================================================

function updateState(event) {
    if (event.target === elements.pose) state.pose = event.target.value;
    if (event.target === elements.expression) state.expression = event.target.value;
    if (event.target === elements.scene) state.scene = event.target.value;
    if (event.target === elements.camera) state.camera = event.target.value;
    if (event.target === elements.imageSize) state.size = parseInt(event.target.value);
}

function handleFormatChange() {
    state.format = elements.imageFormat.value;
    updateFormatUI();
    updateDownloadButtonLabel();
    updateBackgroundColorUI();
}

function updateFormatUI() {
    const isJpg = state.format === 'jpg';
    elements.qualityGroup.style.display = isJpg ? 'flex' : 'none';
    if (isJpg) {
        state.quality = parseInt(elements.imageQuality.value);
    }
}

function updateDownloadButtonLabel() {
    const format = state.format.toUpperCase();
    elements.downloadBtn.textContent = `Download ${format}`;
}

function handleQualityChange() {
    state.quality = parseInt(elements.imageQuality.value);
    elements.qualityValue.textContent = state.quality;
}

function handleColorChange() {
    state.backgroundColor = elements.backgroundColor.value;
}

function handleTransparentChange() {
    state.transparentBg = elements.transparentBg.checked;
    updateBackgroundColorUI();
}

function updateBackgroundColorUI() {
    const isPng = state.format === 'png';
    const showTransparentOption = isPng;
    
    if (state.transparentBg && isPng) {
        elements.backgroundColor.disabled = true;
        state.backgroundColor = 'transparent';
    } else {
        elements.backgroundColor.disabled = false;
        if (!state.transparentBg || !isPng) {
            state.backgroundColor = elements.backgroundColor.value;
        }
    }
}

function handleBlendShapeChange(event) {
    const blendShape = event.target.dataset.blendShape;
    const value = parseFloat(event.target.value);
    
    state.blendShapes[blendShape] = value;
    
    // Update the value display
    const valueDisplay = document.getElementById(`${blendShape}Value`);
    if (valueDisplay) {
        valueDisplay.textContent = value.toFixed(1);
    }
}

function resetBlendShapes() {
    Object.keys(state.blendShapes).forEach(shape => {
        state.blendShapes[shape] = 0;
    });
    
    elements.blendShapeSliders.forEach(slider => {
        slider.value = 0;
        const valueDisplay = document.getElementById(`${slider.dataset.blendShape}Value`);
        if (valueDisplay) {
            valueDisplay.textContent = '0.0';
        }
    });
}

// ============================================================================
// API Functions
// ============================================================================

function buildApiUrl(avatarId = state.avatarId, pose = state.pose, expression = state.expression, transparentBg = state.transparentBg) {
     const format = state.format;
     const params = new URLSearchParams();

     if (pose) params.append('pose', pose);
     if (expression) params.append('expression', expression);
     if (state.scene) params.append('scene', state.scene);
     if (state.camera) params.append('camera', state.camera);
     if (state.size) params.append('size', state.size);
     if (state.format === 'jpg' && state.quality) params.append('quality', state.quality);
     if (!transparentBg && state.backgroundColor && state.backgroundColor !== 'transparent') {
         const rgb = hexToRgb(state.backgroundColor);
         params.append('background', `${rgb.r},${rgb.g},${rgb.b}`);
     }
     
     // Add blend shapes
     Object.entries(state.blendShapes).forEach(([shape, value]) => {
         if (value > 0) {
             params.append(`blendShapes[${shape}]`, value.toFixed(1));
         }
     });

     const paramsStr = params.toString();
     let url = `${API_BASE}/${avatarId}.${format}`;
     if (paramsStr) url += `?${paramsStr}`;
     
     return url;
 }

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function fetchImage(url, timeout = API_TIMEOUT, retries = 0) {
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), timeout);

     try {
         const response = await fetch(url, { signal: controller.signal });
         clearTimeout(timeoutId);

         if (!response.ok) {
             if (response.status === 404) {
                 throw new Error('Avatar not found. Please check the Avatar ID.');
             }
             throw new Error(`HTTP ${response.status}`);
         }

         return await response.blob();
     } catch (error) {
         clearTimeout(timeoutId);
         
         // Retry on timeout or network errors
         if ((error.name === 'AbortError' || error.name === 'TypeError') && retries < MAX_RETRIES) {
             console.warn(`Retrying ${url} (attempt ${retries + 1}/${MAX_RETRIES})`);
             await new Promise(resolve => setTimeout(resolve, 300 * (retries + 1))); // Exponential backoff
             return fetchImage(url, timeout, retries + 1);
         }
         
         if (error.name === 'AbortError') {
             throw new Error('Request timeout');
         }
         throw error;
     }
 }

// ============================================================================
// Preview Functions
// ============================================================================

async function previewAvatar() {
    if (!validateAvatarId()) {
        showError('Invalid Avatar ID');
        return;
    }

    showLoading();
    hideError();

    try {
        const url = buildApiUrl();
        state.currentUrl = url;
        
        const blob = await fetchImage(url);
        const objectUrl = URL.createObjectURL(blob);

        // Display image
        const img = document.createElement('img');
        img.src = objectUrl;
        img.onload = () => {
            elements.previewArea.innerHTML = '';
            elements.previewArea.appendChild(img);
            
            // Update image info
            elements.imageDimensions.textContent = `${state.size}×${state.size}px`;
            elements.imageFormatInfo.textContent = state.format.toUpperCase();
            elements.apiUrl.value = url;
            
            state.isImageLoaded = true;
            hideLoading();
            showImageInfo();
            updateButtonStates();
            elements.downloadBtn.disabled = false;
        };
        
        img.onerror = () => {
            showError('Failed to load image. Please try again.');
            hideLoading();
        };
    } catch (error) {
        console.error('Preview error:', error);
        showError(error.message || 'Failed to load avatar. Please try again.');
        hideLoading();
    }
}

// ============================================================================
// Download Functions
// ============================================================================

function downloadSingleImage() {
    if (!state.isImageLoaded || !state.currentUrl) {
        showError('No image loaded');
        return;
    }

    const timestamp = Date.now();
    const filename = `avatar-${state.avatarId}-${timestamp}.${state.format}`;

    // Get image from preview
    const img = elements.previewArea.querySelector('img');
    if (!img) {
        showError('Image not available for download');
        return;
    }

    fetch(img.src)
        .then(response => response.blob())
        .then(blob => {
            if (typeof saveAs === 'function') {
                saveAs(blob, filename);
            } else {
                // Fallback for browsers without FileSaver
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        })
        .catch(error => {
            console.error('Download error:', error);
            showError('Download failed');
        });
}

function copyApiUrl() {
    if (!state.currentUrl) return;

    navigator.clipboard.writeText(state.currentUrl)
        .then(() => {
            const btn = elements.copyUrlBtn;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        })
        .catch(error => {
            console.error('Copy error:', error);
        });
}

// ============================================================================
// Bulk Download Functions
// ============================================================================

function showBulkConfirmation() {
    if (!validateAvatarId()) {
        showError('Invalid Avatar ID');
        return;
    }

    // Calculate estimated size
    const pixelCount = state.size * state.size;
    const bytesPerPixel = state.format === 'png' ? 4 : 1;
    const estimatedBytes = pixelCount * bytesPerPixel * 30;
    const estimatedMB = (estimatedBytes / (1024 * 1024)).toFixed(1);

    elements.estimatedSize.textContent = `Estimated size: ~${estimatedMB}MB`;
    elements.estimatedTime.textContent = '~2 minutes';

    elements.bulkConfirmModal.style.display = 'flex';
}

function closeBulkConfirmation() {
    elements.bulkConfirmModal.style.display = 'none';
}

async function startBulkDownload() {
     closeBulkConfirmation();
     state.isBulkDownloading = true;
     const bulkTransparent = elements.bulkTransparentBg.checked;
     
     showBulkProgress();
     const combinations = generateCombinations();
     const failedCombinations = [];

     try {
         const zip = new JSZip();
         let completed = 0;

         // Process in batches of 5
         for (let i = 0; i < combinations.length; i += 5) {
             const batch = combinations.slice(i, i + 5);

             await Promise.all(batch.map(async (combo) => {
                 if (!state.isBulkDownloading) return;

                 try {
                     const url = buildApiUrl(state.avatarId, combo.pose, combo.expression, bulkTransparent);
                     
                     const blob = await fetchImage(url, BULK_TIMEOUT);
                     const poseName = combo.pose || 'default';
                     const expressionName = combo.expression || 'neutral';
                     const filename = `pose-${poseName}_expression-${expressionName}.${state.format}`;
                     
                     zip.folder(poseName).file(filename, blob);
                     
                     completed++;
                     updateProgressUI(completed, combinations.length);
                 } catch (error) {
                     console.error(`Failed to fetch pose="${combo.pose}" expression="${combo.expression}":`, error.message, url);
                     failedCombinations.push({
                         pose: combo.pose || 'default',
                         expression: combo.expression || 'neutral',
                         error: error.message
                     });
                     completed++;
                     updateProgressUI(completed, combinations.length);
                 }
             }));

             // Delay between batches to avoid rate limiting
             await new Promise(resolve => setTimeout(resolve, 300));
         }

         if (!state.isBulkDownloading) return;

         // Generate and download ZIP
         if (completed - failedCombinations.length > 0) {
             const zipBlob = await zip.generateAsync({ type: 'blob' });
             const timestamp = Date.now();
             const zipFilename = `avatar-${state.avatarId}-all-combinations-${timestamp}.zip`;
             saveAs(zipBlob, zipFilename);

             if (failedCombinations.length > 0) {
                const failedList = failedCombinations.map(f => `${f.pose}/${f.expression}`).join(', ');
                console.warn('Failed combinations:', failedCombinations);
                showError(`${failedCombinations.length} images failed to download (${failedList}), but ZIP was created with successful images.`);
             }
         } else {
             showError('All images failed to download. ZIP not created.');
         }
     } catch (error) {
         console.error('Bulk download error:', error);
         showError('Bulk download failed');
     } finally {
         state.isBulkDownloading = false;
         hideBulkProgress();
     }
 }

function generateCombinations() {
    const combinations = [];
    for (let pose of POSES) {
        for (let expression of EXPRESSIONS) {
            combinations.push({ pose, expression });
        }
    }
    return combinations;
}

function updateProgressUI(completed, total) {
    const percentage = (completed / total) * 100;
    elements.progressBar.style.width = percentage + '%';
    elements.progressText.textContent = `Downloading ${completed}/${total} images...`;
}

function cancelBulkDownload() {
    state.isBulkDownloading = false;
    hideBulkProgress();
}

function showBulkProgress() {
    elements.bulkDownloadProgress.style.display = 'block';
    updateProgressUI(0, 30);
}

function hideBulkProgress() {
    elements.bulkDownloadProgress.style.display = 'none';
}

// ============================================================================
// UI State Functions
// ============================================================================

function showLoading() {
    elements.loadingState.style.display = 'flex';
    elements.previewArea.style.display = 'none';
    elements.imageInfo.style.display = 'none';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
    elements.previewArea.style.display = 'flex';
}

function showError(message) {
    elements.errorState.style.display = 'flex';
    elements.errorMessage.textContent = message;
    elements.retryBtn.style.display = 'block';
}

function hideError() {
    elements.errorState.style.display = 'none';
    elements.errorMessage.textContent = '';
    elements.retryBtn.style.display = 'none';
}

function showImageInfo() {
    elements.imageInfo.style.display = 'flex';
}

// ============================================================================
// Utility Functions
// ============================================================================

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================================================
// Initialization
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
