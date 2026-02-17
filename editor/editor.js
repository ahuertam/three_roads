// Level Editor State
const GRID_MIN_COLUMNS = 1;
const GRID_MAX_COLUMNS = 3;
const GRID_DEFAULT_COLUMNS = 3;
const DEFAULT_GRID = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
];
const PREVIEW_BASE_STORAGE_KEY = 'three_roads_preview_base_url';
const PREVIEW_DATA_STORAGE_PREFIX = 'three_roads_preview_level_';
let lastPreviewPayload = null;
let lastPreviewWindow = null;
let lastPreviewOrigin = '*';

const editorState = {
    levelId: 'level_custom',
    levelName: 'Custom Level',
    difficulty: 'medium',
    segments: [],
    currentGrid: null,
    selectedCellType: 1,
    editingSegmentIndex: null
};

// Initialize editor
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateSegmentsList();
    updateGridControls();
    if (!editorState.currentGrid) {
        openGridEditor();
    }
    setupPreviewHandshake();
});

// Event Listeners
function initializeEventListeners() {
    // Level properties
    document.getElementById('levelId').addEventListener('input', (e) => {
        editorState.levelId = e.target.value;
    });
    
    document.getElementById('levelName').addEventListener('input', (e) => {
        editorState.levelName = e.target.value;
    });
    
    document.getElementById('difficulty').addEventListener('change', (e) => {
        editorState.difficulty = e.target.value;
    });
    
    // Pattern buttons
    document.querySelectorAll('.btn-pattern').forEach(btn => {
        btn.addEventListener('click', () => {
            const pattern = btn.dataset.pattern;
            addPatternSegment(pattern);
        });
    });
    
    // Custom segment
    document.getElementById('addCustomSegment').addEventListener('click', () => {
        openGridEditor();
    });
    
    // Cell type selection
    document.querySelectorAll('.cell-type').forEach(cell => {
        cell.addEventListener('click', () => {
            document.querySelectorAll('.cell-type').forEach(c => c.classList.remove('active'));
            cell.classList.add('active');
            editorState.selectedCellType = parseInt(cell.dataset.type);
        });
    });
    
    // Grid editor controls
    document.getElementById('closeGridEditor').addEventListener('click', closeGridEditor);
    document.getElementById('addRow').addEventListener('click', () => modifyGrid('addRow'));
    document.getElementById('removeRow').addEventListener('click', () => modifyGrid('removeRow'));
    document.getElementById('addColumn').addEventListener('click', () => modifyGrid('addColumn'));
    document.getElementById('removeColumn').addEventListener('click', () => modifyGrid('removeColumn'));
    document.getElementById('clearGrid').addEventListener('click', clearGrid);
    document.getElementById('saveGrid').addEventListener('click', saveGrid);
    
    // Export
    document.getElementById('exportLevel').addEventListener('click', exportLevel);
    document.getElementById('previewLevel').addEventListener('click', previewLevel);
    document.getElementById('copyCode').addEventListener('click', copyToClipboard);

    const previewBaseInput = document.getElementById('previewBaseUrl');
    if (previewBaseInput) {
        previewBaseInput.value = getStoredPreviewBaseUrl();
        previewBaseInput.addEventListener('input', () => {
            savePreviewBaseUrl(previewBaseInput.value);
        });
    }
}

// Add pattern segment
function addPatternSegment(pattern) {
    editorState.segments.push({ type: pattern });
    updateSegmentsList();
}

// Open grid editor
function openGridEditor(segmentIndex = null) {
    editorState.editingSegmentIndex = segmentIndex;
    
    if (segmentIndex !== null) {
        // Editing existing segment
        const segment = editorState.segments[segmentIndex];
        document.getElementById('segmentName').value = segment.name || '';
        document.getElementById('segmentLength').value = segment.length || 100;
        editorState.currentGrid = normalizeGrid(JSON.parse(JSON.stringify(segment.grid)));
    } else {
        // New segment
        document.getElementById('segmentName').value = '';
        document.getElementById('segmentLength').value = 100;
        editorState.currentGrid = JSON.parse(JSON.stringify(DEFAULT_GRID));
    }
    
    document.getElementById('gridEditorPanel').style.display = 'block';
    renderGrid();
}

// Close grid editor
function closeGridEditor() {
    document.getElementById('gridEditorPanel').style.display = 'none';
    editorState.currentGrid = null;
    editorState.editingSegmentIndex = null;
}

// Render grid
function renderGrid() {
    const canvas = document.getElementById('gridCanvas');
    canvas.innerHTML = '';
    
    editorState.currentGrid.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'grid-cell';
            cellDiv.dataset.value = cell;
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            
            cellDiv.addEventListener('click', () => {
                editorState.currentGrid[rowIndex][colIndex] = editorState.selectedCellType;
                renderGrid();
            });
            
            // Allow painting by dragging
            cellDiv.addEventListener('mouseenter', (e) => {
                if (e.buttons === 1) { // Left mouse button is pressed
                    editorState.currentGrid[rowIndex][colIndex] = editorState.selectedCellType;
                    renderGrid();
                }
            });
            
            rowDiv.appendChild(cellDiv);
        });
        
        canvas.appendChild(rowDiv);
    });
    
    updateGridControls();
}

function normalizeGrid(grid) {
    if (!Array.isArray(grid) || grid.length === 0) {
        return JSON.parse(JSON.stringify(DEFAULT_GRID));
    }
    
    const firstRowLength = Array.isArray(grid[0]) ? grid[0].length : GRID_DEFAULT_COLUMNS;
    const targetColumns = Math.min(GRID_MAX_COLUMNS, Math.max(GRID_MIN_COLUMNS, firstRowLength || GRID_DEFAULT_COLUMNS));
    
    return grid.map(row => {
        const normalizedRow = Array.isArray(row) ? row.slice(0, targetColumns) : [];
        while (normalizedRow.length < targetColumns) {
            normalizedRow.push(1);
        }
        return normalizedRow;
    });
}

function getCurrentColumnCount() {
    const firstRowLength = editorState.currentGrid?.[0]?.length;
    if (!firstRowLength) return GRID_DEFAULT_COLUMNS;
    return Math.min(GRID_MAX_COLUMNS, Math.max(GRID_MIN_COLUMNS, firstRowLength));
}

function updateGridControls() {
    const addColumnButton = document.getElementById('addColumn');
    const removeColumnButton = document.getElementById('removeColumn');
    if (!addColumnButton || !removeColumnButton) return;
    const currentColumns = getCurrentColumnCount();
    addColumnButton.disabled = currentColumns >= GRID_MAX_COLUMNS;
    removeColumnButton.disabled = currentColumns <= GRID_MIN_COLUMNS;
}

// Modify grid
function modifyGrid(action) {
    const grid = editorState.currentGrid;
    const currentColumns = getCurrentColumnCount();
    
    switch(action) {
        case 'addRow':
            const newRow = new Array(currentColumns).fill(1);
            grid.push(newRow);
            break;
            
        case 'removeRow':
            if (grid.length > 1) {
                grid.pop();
            }
            break;
            
        case 'addColumn':
            if (currentColumns < GRID_MAX_COLUMNS) {
                grid.forEach(row => row.push(1));
            }
            break;
            
        case 'removeColumn':
            if (currentColumns > GRID_MIN_COLUMNS) {
                grid.forEach(row => row.pop());
            }
            break;
    }
    
    renderGrid();
}

// Clear grid
function clearGrid() {
    editorState.currentGrid.forEach(row => {
        for (let i = 0; i < row.length; i++) {
            row[i] = 0;
        }
    });
    renderGrid();
}

// Save grid
function saveGrid() {
    const name = document.getElementById('segmentName').value || 'Custom Grid';
    const length = parseInt(document.getElementById('segmentLength').value) || 100;
    
    const segment = {
        type: 'custom_grid',
        name: name,
        length: length,
        grid: normalizeGrid(JSON.parse(JSON.stringify(editorState.currentGrid)))
    };
    
    if (editorState.editingSegmentIndex !== null) {
        // Update existing segment
        editorState.segments[editorState.editingSegmentIndex] = segment;
    } else {
        // Add new segment
        editorState.segments.push(segment);
    }
    
    updateSegmentsList();
    closeGridEditor();
}

// Update segments list
function updateSegmentsList() {
    const list = document.getElementById('segmentsList');
    const count = document.getElementById('segmentCount');
    
    count.textContent = `${editorState.segments.length} segmento${editorState.segments.length !== 1 ? 's' : ''}`;
    
    if (editorState.segments.length === 0) {
        list.innerHTML = '<p class="empty-state">No hay segmentos. Añade patrones o grids personalizados.</p>';
        return;
    }
    
    list.innerHTML = '';
    
    editorState.segments.forEach((segment, index) => {
        const item = document.createElement('div');
        item.className = 'segment-item';
        
        const info = document.createElement('div');
        info.className = 'segment-info';
        
        let segmentName = '';
        let segmentDetails = '';
        
        if (segment.type === 'custom_grid') {
            segmentName = segment.name || 'Grid Personalizado';
            const rowCount = segment.grid.length;
            const colCount = segment.grid[0]?.length || GRID_DEFAULT_COLUMNS;
            segmentDetails = `${rowCount}x${colCount} - ${segment.length}m`;
        } else {
            segmentName = formatPatternName(segment.type);
            segmentDetails = 'Patrón predefinido';
        }
        
        info.innerHTML = `
            <strong>${index + 1}. ${segmentName}</strong>
            <small>${segmentDetails}</small>
        `;
        
        const actions = document.createElement('div');
        actions.className = 'segment-actions';
        
        // Move up button
        if (index > 0) {
            const upBtn = document.createElement('button');
            upBtn.className = 'btn-icon';
            upBtn.textContent = '↑';
            upBtn.title = 'Mover arriba';
            upBtn.addEventListener('click', () => moveSegment(index, -1));
            actions.appendChild(upBtn);
        }
        
        // Move down button
        if (index < editorState.segments.length - 1) {
            const downBtn = document.createElement('button');
            downBtn.className = 'btn-icon';
            downBtn.textContent = '↓';
            downBtn.title = 'Mover abajo';
            downBtn.addEventListener('click', () => moveSegment(index, 1));
            actions.appendChild(downBtn);
        }
        
        // Edit button (only for custom grids)
        if (segment.type === 'custom_grid') {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon';
            editBtn.textContent = '✏️';
            editBtn.title = 'Editar';
            editBtn.addEventListener('click', () => openGridEditor(index));
            actions.appendChild(editBtn);
        }
        
        // Duplicate button
        const dupBtn = document.createElement('button');
        dupBtn.className = 'btn-icon';
        dupBtn.textContent = '📋';
        dupBtn.title = 'Duplicar';
        dupBtn.addEventListener('click', () => duplicateSegment(index));
        actions.appendChild(dupBtn);
        
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon delete';
        delBtn.textContent = '🗑️';
        delBtn.title = 'Eliminar';
        delBtn.addEventListener('click', () => deleteSegment(index));
        actions.appendChild(delBtn);
        
        item.appendChild(info);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

// Move segment
function moveSegment(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editorState.segments.length) return;
    
    const temp = editorState.segments[index];
    editorState.segments[index] = editorState.segments[newIndex];
    editorState.segments[newIndex] = temp;
    
    updateSegmentsList();
}

// Duplicate segment
function duplicateSegment(index) {
    const segment = JSON.parse(JSON.stringify(editorState.segments[index]));
    editorState.segments.splice(index + 1, 0, segment);
    updateSegmentsList();
}

// Delete segment
function deleteSegment(index) {
    if (confirm('¿Eliminar este segmento?')) {
        editorState.segments.splice(index, 1);
        updateSegmentsList();
    }
}

// Format pattern name
function formatPatternName(pattern) {
    const names = {
        'straight_road': 'Camino Recto',
        'small_gap': 'Hueco Pequeño',
        'gentle_climb': 'Subida Suave',
        'split_path': 'Camino Dividido',
        'step_sequence': 'Escaleras',
        'hazard_road': 'Camino Peligroso',
        'island_hops': 'Islas Flotantes',
        'narrow_bridge': 'Puente Estrecho',
        'block_field': 'Campo de Bloques'
    };
    return names[pattern] || pattern;
}

// Export level
function exportLevel() {
    const code = generateLevelCode();
    document.getElementById('exportedCode').value = code;
}

function previewLevel() {
    const segments = buildPreviewSegments();
    const levelData = buildLevelData(segments);
    const payload = JSON.stringify(levelData);
    const baseUrl = getPreviewBaseUrlFromInput();
    let targetUrl = getPreviewUrl(payload, baseUrl);
    const previewWindow = window.open(targetUrl, '_blank');
    lastPreviewPayload = payload;
    lastPreviewWindow = previewWindow;
    lastPreviewOrigin = getOriginFromBaseUrl(baseUrl);
    sendPreviewPayload(previewWindow, payload, baseUrl);
}

// Generate level code
function generateLevelCode() {
    const safeId = (editorState.levelId || '').trim() || 'level_custom';
    let varName = safeId.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (!/^[A-Z_]/.test(varName)) {
        varName = `LEVEL_${varName}`;
    }
    
    let code = `export const ${varName} = {\n`;
    code += `  id: '${escapeString(safeId)}',\n`;
    code += `  name: '${escapeString(editorState.levelName)}',\n`;
    code += `  difficulty: '${escapeString(editorState.difficulty)}',\n`;
    code += `  segments: [\n`;
    
    editorState.segments.forEach((segment, index) => {
        if (segment.type === 'custom_grid') {
            code += `    {\n`;
            code += `      type: 'custom_grid',\n`;
            code += `      name: '${escapeString(segment.name)}',\n`;
            code += `      length: ${segment.length},\n`;
            code += `      grid: [\n`;
            segment.grid.forEach(row => {
                code += `        [${row.join(', ')}],\n`;
            });
            code += `      ]\n`;
            code += `    }`;
        } else {
            code += `    { type: '${segment.type}' }`;
        }
        
        if (index < editorState.segments.length - 1) {
            code += ',\n';
        } else {
            code += '\n';
        }
    });
    
    code += `  ]\n`;
    code += `};\n`;
    
    return code;
}

function escapeString(value) {
    return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildLevelData(segmentsOverride) {
    const safeId = (editorState.levelId || '').trim() || 'level_custom';
    const name = editorState.levelName || 'Custom Level';
    const difficulty = editorState.difficulty || 'medium';
    const segments = segmentsOverride ?? editorState.segments.map(segment => {
        if (segment.type === 'custom_grid') {
            return {
                type: 'custom_grid',
                name: segment.name || 'Custom Grid',
                length: Number.parseInt(segment.length, 10) || 100,
                grid: normalizeGrid(JSON.parse(JSON.stringify(segment.grid)))
            };
        }
        return { type: segment.type };
    });
    
    return {
        id: safeId,
        name,
        difficulty,
        segments
    };
}

function getPreviewUrl(payload, baseUrl) {
    const params = new URLSearchParams();
    if (isSameOriginPreview(baseUrl)) {
        const previewKey = storePreviewPayload(payload);
        if (previewKey) {
            params.set('previewKey', previewKey);
        } else {
            params.set('previewLevelData', payload);
        }
    } else {
        params.set('preview', '1');
    }
    return `${baseUrl}/?${params.toString()}`;
}

function buildPreviewSegments() {
    const baseSegments = editorState.segments.map(segment => {
        if (segment.type === 'custom_grid') {
            return {
                type: 'custom_grid',
                name: segment.name || 'Custom Grid',
                length: Number.parseInt(segment.length, 10) || 100,
                grid: normalizeGrid(JSON.parse(JSON.stringify(segment.grid)))
            };
        }
        return { type: segment.type };
    });
    
    const pending = getPendingGridSegment();
    if (!pending) return baseSegments;
    
    if (editorState.editingSegmentIndex !== null && baseSegments[editorState.editingSegmentIndex]) {
        baseSegments[editorState.editingSegmentIndex] = pending;
        return baseSegments;
    }
    
    return [...baseSegments, pending];
}

function getPendingGridSegment() {
    if (!editorState.currentGrid) return null;
    const nameInput = document.getElementById('segmentName');
    const lengthInput = document.getElementById('segmentLength');
    const name = nameInput?.value || 'Custom Grid';
    const length = Number.parseInt(lengthInput?.value, 10) || 100;
    return {
        type: 'custom_grid',
        name,
        length,
        grid: normalizeGrid(JSON.parse(JSON.stringify(editorState.currentGrid)))
    };
}

function getPreviewBaseUrlFromInput() {
    const input = document.getElementById('previewBaseUrl');
    if (!input) return getDefaultPreviewBaseUrl();
    return normalizeBaseUrl(input.value);
}

function getStoredPreviewBaseUrl() {
    const stored = localStorage.getItem(PREVIEW_BASE_STORAGE_KEY);
    return stored || getDefaultPreviewBaseUrl();
}

function savePreviewBaseUrl(value) {
    const normalized = normalizeBaseUrl(value);
    localStorage.setItem(PREVIEW_BASE_STORAGE_KEY, normalized);
    return normalized;
}

function normalizeBaseUrl(value) {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return getDefaultPreviewBaseUrl();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed.replace(/\/$/, '');
    }
    if (trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1')) {
        return `http://${trimmed}`.replace(/\/$/, '');
    }
    return trimmed.replace(/\/$/, '');
}

function getDefaultPreviewBaseUrl() {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        return window.location.origin;
    }
    return 'http://localhost:3000';
}

function isSameOriginPreview(baseUrl) {
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
        return false;
    }
    try {
        return new URL(baseUrl).origin === window.location.origin;
    } catch {
        return false;
    }
}

function storePreviewPayload(payload) {
    try {
        const key = `${PREVIEW_DATA_STORAGE_PREFIX}${Date.now()}`;
        localStorage.setItem(key, payload);
        localStorage.setItem(`${PREVIEW_DATA_STORAGE_PREFIX}latest`, key);
        return key;
    } catch {
        return null;
    }
}

function sendPreviewPayload(previewWindow, payload, baseUrl) {
    if (!previewWindow) return;
    const targetOrigin = getOriginFromBaseUrl(baseUrl);
    let attempts = 0;
    const send = () => {
        if (previewWindow.closed) return;
        attempts += 1;
        previewWindow.postMessage({ type: 'preview-level', payload }, targetOrigin);
        if (attempts < 20) {
            setTimeout(send, 400);
        }
    };
    setTimeout(send, 400);
}

function setupPreviewHandshake() {
    window.addEventListener('message', (event) => {
        const data = event?.data;
        if (!data || data.type !== 'preview-ready') return;
        if (!lastPreviewPayload) return;
        const target = event.source || lastPreviewWindow;
        if (!target || target.closed) return;
        const origin = event.origin && event.origin !== 'null' ? event.origin : lastPreviewOrigin;
        target.postMessage({ type: 'preview-level', payload: lastPreviewPayload }, origin || '*');
    });
}

function getOriginFromBaseUrl(baseUrl) {
    try {
        return new URL(baseUrl).origin;
    } catch {
        return '*';
    }
}

// Copy to clipboard
function copyToClipboard() {
    const code = document.getElementById('exportedCode').value;
    
    if (!code) {
        alert('Primero exporta el nivel usando el botón "Exportar Código"');
        return;
    }
    
    navigator.clipboard.writeText(code).then(() => {
        alert('¡Código copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar. Selecciona el texto manualmente y copia con Ctrl+C');
    });
}
