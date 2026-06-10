/* ==============================================
   Three Roads - Level Editor
   v2: autosave, undo/redo, métricas, importador, 3D
   ============================================== */

/* ==============================================
   1. CONSTANTES
   ============================================== */

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
const STORAGE_KEY = 'three_roads_editor_draft';
const STORAGE_VERSION = 1;

const UNDO_STACK_MAX = 50;
const SAVE_THROTTLE_MS = 500;
const SAVE_INDICATOR_UPDATE_MS = 1000;

const PREVIEW_3D_INITIAL_HEIGHT = 200;
const PREVIEW_3D_NEAR = 0.1;
const PREVIEW_3D_FAR = 2000;
const PREVIEW_3D_FOV = 50;

let lastPreviewPayload = null;
let lastPreviewWindow = null;
let lastPreviewOrigin = '*';

// Cell type colors (MUST match src/ecs/patterns/ObstaclePatterns.js PLATFORM_TYPES)
const TYPE_COLORS_HEX = {
    0: '#111111',  // vacío
    1: '#6B5B95',  // normal
    2: '#444444',  // muro
    3: '#FF6347',  // fuego
    4: '#87CEEB',  // suministros
    5: '#32CD32',  // boost
    6: '#90EE90',  // sticky
    7: '#FFA500'   // slippery
};
const TYPE_COLORS_INT = {
    0: 0x111111,
    1: 0x6B5B95,
    2: 0x444444,
    3: 0xFF6347,
    4: 0x87CEEB,
    5: 0x32CD32,
    6: 0x90EE90,
    7: 0xFFA500
};
const TYPE_NAMES = {
    0: 'Vacío', 1: 'Normal', 2: 'Muro', 3: 'Fuego',
    4: 'Suministros', 5: 'Boost', 6: 'Pegajosa', 7: 'Resbaladiza'
};

// Patrones predefinidos (MUST match src/ecs/patterns/ObstaclePatterns.js PATTERN_LIBRARY)
const PATTERN_LIBRARY = {
    straight_road: {
        name: 'Camino Recto',
        difficulty: 'easy',
        description: 'Camino recto básico',
        exitPoint: { x: 0, y: 0, z: -120 },
        obstacles: [
            { x: 0, y: -1, z: -60, size: [20, 2, 220], type: 'NORMAL' }
        ]
    },
    gentle_climb: {
        name: 'Subida Suave',
        difficulty: 'easy',
        description: 'Pequeña elevación',
        exitPoint: { x: 0, y: 2, z: -120 },
        obstacles: [
            { x: 0, y: -1, z: -30, size: [20, 2, 60], type: 'NORMAL' },
            { x: 0, y: 0, z: -90, size: [20, 2, 60], type: 'NORMAL' }
        ]
    },
    small_gap: {
        name: 'Pequeño Salto',
        difficulty: 'easy',
        description: 'Brecha fácil de saltar',
        exitPoint: { x: 0, y: 0, z: -140 },
        obstacles: [
            { x: 0, y: -1, z: -25, size: [20, 2, 50], type: 'NORMAL' },
            { x: 0, y: -1, z: -105, size: [20, 2, 70], type: 'NORMAL' }
        ]
    },
    split_path: {
        name: 'Camino Dividido',
        difficulty: 'medium',
        description: 'Dos caminos paralelos',
        exitPoint: { x: 0, y: 0, z: -120 },
        obstacles: [
            { x: -15, y: -1, z: -60, size: [15, 2, 120], type: 'NORMAL' },
            { x: 15, y: -1, z: -60, size: [15, 2, 120], type: 'NORMAL' }
        ]
    },
    step_sequence: {
        name: 'Escaleras',
        difficulty: 'medium',
        description: 'Serie de escalones',
        exitPoint: { x: 0, y: 4, z: -120 },
        obstacles: [
            { x: 0, y: -1, z: -20, size: [20, 2, 40], type: 'NORMAL' },
            { x: 0, y: 1, z: -60, size: [20, 2, 40], type: 'NORMAL' },
            { x: 0, y: 3, z: -100, size: [20, 2, 40], type: 'NORMAL' }
        ]
    },
    hazard_road: {
        name: 'Camino Peligroso',
        difficulty: 'medium',
        description: 'Plataformas con zonas peligrosas',
        exitPoint: { x: 0, y: 0, z: -120 },
        obstacles: [
            { x: 0, y: -1, z: -20, size: [20, 2, 40], type: 'NORMAL' },
            { x: 0, y: 0.1, z: -60, size: [20, 1, 40], type: 'BURNING' },
            { x: 0, y: -1, z: -60, size: [20, 2, 40], type: 'NORMAL' },
            { x: 0, y: -1, z: -100, size: [20, 2, 40], type: 'NORMAL' }
        ]
    },
    island_hops: {
        name: 'Islas Flotantes',
        difficulty: 'hard',
        description: 'Saltos precisos entre islas',
        exitPoint: { x: 0, y: 0, z: -160 },
        obstacles: [
            { x: 0, y: -1, z: -15, size: [12, 2, 30], type: 'NORMAL' },
            { x: -15, y: 1, z: -65, size: [12, 2, 30], type: 'NORMAL' },
            { x: 15, y: 3, z: -115, size: [12, 2, 30], type: 'NORMAL' },
            { x: 0, y: 1, z: -145, size: [12, 2, 10], type: 'NORMAL' }
        ]
    },
    narrow_bridge: {
        name: 'Puente Estrecho',
        difficulty: 'hard',
        description: 'Camino muy delgado',
        exitPoint: { x: 0, y: 0, z: -120 },
        obstacles: [
            { x: 0, y: -1, z: -10, size: [20, 2, 20], type: 'NORMAL' },
            { x: 0, y: -1, z: -60, size: [4, 2, 80], type: 'NORMAL' },
            { x: 0, y: -1, z: -110, size: [20, 2, 20], type: 'NORMAL' }
        ]
    },
    block_field: {
        name: 'Campo de Bloques',
        difficulty: 'hard',
        description: 'Obstáculos altos para esquivar',
        exitPoint: { x: 0, y: 0, z: -100 },
        obstacles: [
            { x: 0, y: -1, z: -50, size: [20, 2, 100], type: 'NORMAL' },
            { x: -5, y: 4, z: -30, size: [10, 8, 10], type: 'BLOCK' },
            { x: 5, y: 4, z: -60, size: [10, 8, 10], type: 'BLOCK' },
            { x: 0, y: 4, z: -90, size: [10, 8, 10], type: 'BLOCK' }
        ]
    }
};

const PATTERN_LIST = [
    'straight_road', 'small_gap', 'gentle_climb',
    'split_path', 'step_sequence', 'hazard_road',
    'island_hops', 'narrow_bridge', 'block_field'
];

/* ==============================================
   2. ESTADO DEL EDITOR
   ============================================== */

const editorState = {
    levelId: 'level_custom',
    levelName: 'Custom Level',
    difficulty: 'medium',
    segments: [],
    currentGrid: null,
    selectedCellType: 1,
    editingSegmentIndex: null
};

// Stacks de undo/redo (referencias a snapshots profundos del estado)
const undoStack = [];
const redoStack = [];

/* ==============================================
   3. PERSISTENCIA (autosave)
   ============================================== */

let saveTimer = null;
let lastSavedAt = null;

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function saveDraft(force = false) {
    if (saveTimer && !force) {
        clearTimeout(saveTimer);
    }
    setSaveIndicator('saving');
    saveTimer = setTimeout(() => {
        try {
            const payload = {
                version: STORAGE_VERSION,
                state: editorState,
                savedAt: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            lastSavedAt = Date.now();
            setSaveIndicator('saved');
        } catch (err) {
            console.error('Error guardando borrador:', err);
            setSaveIndicator('error');
        }
    }, SAVE_THROTTLE_MS);
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const payload = JSON.parse(raw);
        if (!payload || payload.version !== STORAGE_VERSION) {
            console.warn('Versión de borrador incompatible, ignorando');
            return false;
        }
        if (!payload.state) return false;

        // Restaurar estado
        Object.assign(editorState, payload.state);
        // Asegurar que currentGrid no es null al cargar
        if (!editorState.currentGrid && editorState.segments.length === 0) {
            editorState.currentGrid = JSON.parse(JSON.stringify(DEFAULT_GRID));
        }
        lastSavedAt = payload.savedAt;
        setSaveIndicator('saved');
        return true;
    } catch (err) {
        console.error('Error cargando borrador:', err);
        return false;
    }
}

function clearDraft() {
    if (!confirm('¿Descartar el borrador guardado? El trabajo no guardado se perderá.')) return;
    try {
        localStorage.removeItem(STORAGE_KEY);
        lastSavedAt = null;
        setSaveIndicator('idle', 'Borrador eliminado');
        // Resetear el estado
        Object.assign(editorState, {
            levelId: 'level_custom',
            levelName: 'Custom Level',
            difficulty: 'medium',
            segments: [],
            currentGrid: null,
            selectedCellType: 1,
            editingSegmentIndex: null
        });
        undoStack.length = 0;
        redoStack.length = 0;
        // Sincronizar UI
        document.getElementById('levelId').value = editorState.levelId;
        document.getElementById('levelName').value = editorState.levelName;
        document.getElementById('difficulty').value = editorState.difficulty;
        updateSegmentsList();
        updateMetricsPanel();
        updateUndoRedoButtons();
        scheduleRender3D();
    } catch (err) {
        console.error('Error eliminando borrador:', err);
    }
}

function setSaveIndicator(state, customText) {
    const el = document.getElementById('saveIndicator');
    if (!el) return;
    el.classList.remove('saving', 'saved', 'error');
    if (state === 'saving') {
        el.classList.add('saving');
        el.textContent = '💾 Guardando...';
    } else if (state === 'saved') {
        el.classList.add('saved');
        el.textContent = customText || '💾 Guardado';
    } else if (state === 'error') {
        el.classList.add('error');
        el.textContent = '⚠ Error al guardar';
    } else if (state === 'idle') {
        el.textContent = customText || '⚪ Sin cambios';
    }
}

// Actualizar el texto "Guardado hace Xs" cada segundo
setInterval(() => {
    if (!lastSavedAt) return;
    const el = document.getElementById('saveIndicator');
    if (!el || el.classList.contains('saving')) return;
    const seconds = Math.floor((Date.now() - lastSavedAt) / 1000);
    el.textContent = seconds < 5 ? '💾 Guardado' : `💾 Guardado hace ${seconds}s`;
}, SAVE_INDICATOR_UPDATE_MS);

/* ==============================================
   4. MUTATE / UNDO / REDO
   ============================================== */

function mutate(partial) {
    // Guardar snapshot del estado actual
    const prev = deepClone(editorState);
    undoStack.push(prev);
    if (undoStack.length > UNDO_STACK_MAX) {
        undoStack.shift();
    }
    // Limpiar redo stack en cualquier nueva mutación
    redoStack.length = 0;
    // Aplicar el cambio
    Object.assign(editorState, partial);
    // Persistir y notificar UI
    saveDraft();
    updateUndoRedoButtons();
    // CRÍTICO: repintar la lista de segmentos y métricas, porque la UI
    // no se suscribe al estado — sólo se repinta cuando se lo pedimos.
    updateSegmentsList();
    updateMetricsPanel();
    scheduleRender3D();
}

function undo() {
    if (undoStack.length === 0) return;
    const current = deepClone(editorState);
    const prev = undoStack.pop();
    redoStack.push(current);
    if (redoStack.length > UNDO_STACK_MAX) {
        redoStack.shift();
    }
    Object.assign(editorState, prev);
    // Re-sincronizar UI (inputs, segmentos, etc.)
    syncUIFromState();
    saveDraft();
    updateUndoRedoButtons();
    scheduleRender3D();
}

function redo() {
    if (redoStack.length === 0) return;
    const current = deepClone(editorState);
    const next = redoStack.pop();
    undoStack.push(current);
    if (undoStack.length > UNDO_STACK_MAX) {
        undoStack.shift();
    }
    Object.assign(editorState, next);
    syncUIFromState();
    saveDraft();
    updateUndoRedoButtons();
    scheduleRender3D();
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

function syncUIFromState() {
    // Sincronizar inputs
    document.getElementById('levelId').value = editorState.levelId;
    document.getElementById('levelName').value = editorState.levelName;
    document.getElementById('difficulty').value = editorState.difficulty;
    // Sincronizar lista de segmentos
    updateSegmentsList();
    // Sincronizar métricas
    updateMetricsPanel();
    // Si el editor de grid está abierto, mantenerlo
    const editorVisible = document.getElementById('gridEditorPanel').style.display !== 'none';
    if (editorVisible && editorState.currentGrid) {
        renderGrid();
    } else if (editorVisible) {
        closeGridEditor();
    }
}

/* ==============================================
   5. MÉTRICAS EN VIVO
   ============================================== */

function computeMetrics(segments) {
    const metrics = {
        segmentCount: segments.length,
        totalLength: 0,
        typeCount: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
        gridCount: 0,
        patternCount: 0,
        inlineCount: 0,
        hazardousPercent: 0
    };

    segments.forEach(seg => {
        if (seg.type === 'custom_grid') {
            metrics.gridCount++;
            const length = Number.parseInt(seg.length, 10) || 100;
            metrics.totalLength += length;
            if (Array.isArray(seg.grid)) {
                seg.grid.forEach(row => {
                    if (Array.isArray(row)) {
                        row.forEach(cell => {
                            const v = Number.parseInt(cell, 10);
                            if (v >= 0 && v <= 7) metrics.typeCount[v]++;
                        });
                    }
                });
            }
        } else if (seg.type) {
            metrics.patternCount++;
            const pattern = PATTERN_LIBRARY[seg.type];
            if (pattern) {
                const exitZ = Math.abs(pattern.exitPoint?.z || 120);
                metrics.totalLength += exitZ;
                // Los patterns también tienen hazards en su composición
                (pattern.obstacles || []).forEach(o => {
                    if (o.type === 'BURNING') metrics.typeCount[3]++;
                    if (o.type === 'STICKY') metrics.typeCount[6]++;
                    if (o.type === 'SLIPPERY') metrics.typeCount[7]++;
                    if (o.type === 'SUPPLIES') metrics.typeCount[4]++;
                    if (o.type === 'BOOST') metrics.typeCount[5]++;
                });
            }
        } else if (seg.obstacles) {
            metrics.inlineCount++;
            const exitZ = Math.abs(seg.exitPoint?.z || 150);
            metrics.totalLength += exitZ;
            (seg.obstacles || []).forEach(o => {
                if (o.type === 'BURNING') metrics.typeCount[3]++;
                if (o.type === 'STICKY') metrics.typeCount[6]++;
                if (o.type === 'SLIPPERY') metrics.typeCount[7]++;
                if (o.type === 'SUPPLIES') metrics.typeCount[4]++;
                if (o.type === 'BOOST') metrics.typeCount[5]++;
            });
        }
    });

    // % de plataformas peligrosas (tipos 3, 6, 7 sobre total no-vacío)
    const nonEmpty = metrics.typeCount[1] + metrics.typeCount[2] + metrics.typeCount[3] +
                     metrics.typeCount[4] + metrics.typeCount[5] + metrics.typeCount[6] + metrics.typeCount[7];
    const hazardous = metrics.typeCount[3] + metrics.typeCount[6] + metrics.typeCount[7];
    metrics.hazardousPercent = nonEmpty > 0 ? Math.round((hazardous / nonEmpty) * 100) : 0;

    return metrics;
}

function computeDifficulty(metrics) {
    const pct = metrics.hazardousPercent;
    if (pct < 15) return 'easy';
    if (pct < 35) return 'medium';
    if (pct < 55) return 'hard';
    return 'extreme';
}

function updateMetricsPanel() {
    const panel = document.getElementById('metricsPanel');
    if (!panel) return;

    const m = computeMetrics(editorState.segments);
    const diff = computeDifficulty(m);
    const diffLabels = { easy: 'Fácil', medium: 'Media', hard: 'Difícil', extreme: 'Extrema' };

    let html = '';

    // Métricas top-level
    html += `
        <div class="metric-block">
            <span class="metric-label">Segmentos</span>
            <span class="metric-value">${m.segmentCount}</span>
        </div>
        <div class="metric-block">
            <span class="metric-label">Longitud total</span>
            <span class="metric-value">${m.totalLength}m</span>
        </div>
        <div class="metric-block">
            <span class="metric-label">Dificultad</span>
            <span class="metric-value ${diff}">${diffLabels[diff]}</span>
        </div>
        <div class="metric-block">
            <span class="metric-label">% Peligrosas</span>
            <span class="metric-value">${m.hazardousPercent}%</span>
        </div>
    `;

    // Distribución por tipo (sólo los no-vacíos)
    const typeTotal = m.typeCount[1] + m.typeCount[2] + m.typeCount[3] + m.typeCount[4] +
                      m.typeCount[5] + m.typeCount[6] + m.typeCount[7];
    if (typeTotal > 0) {
        html += '<div class="metric-block" style="grid-column: 1 / -1;"><span class="metric-label">Distribución por tipo</span></div>';
        for (let t = 1; t <= 7; t++) {
            const count = m.typeCount[t];
            const pct = Math.round((count / typeTotal) * 100);
            if (count === 0 && t > 3) continue;  // Ocultar tipos sin uso (excepto los comunes)
            html += `
                <div class="metric-block" style="grid-column: 1 / -1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                        <span style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 12px; height: 12px; background: ${TYPE_COLORS_HEX[t]}; border-radius: 2px; border: 1px solid #555;"></span>
                            <span style="font-size: 0.85em;">${TYPE_NAMES[t]}</span>
                        </span>
                        <span style="font-size: 0.85em; color: #888;">${count} (${pct}%)</span>
                    </div>
                    <div class="metric-bar">
                        <div class="metric-bar-fill" style="width: ${pct}%; background: ${TYPE_COLORS_HEX[t]};"></div>
                    </div>
                </div>
            `;
        }
    }

    // Resumen de tipos de segmento
    html += '<div class="metric-block" style="grid-column: 1 / -1;"><span class="metric-label">Composición</span></div>';
    html += `
        <div class="metric-block" style="grid-column: 1 / -1;">
            <span style="font-size: 0.85em; color: #aaa;">
                ${m.gridCount} grids · ${m.patternCount} patrones · ${m.inlineCount} inline
            </span>
        </div>
    `;

    panel.innerHTML = html;
}

/* ==============================================
   6. IMPORTADOR DE NIVELES
   ============================================== */

function parseLevelCode(code) {
    if (!code || typeof code !== 'string') {
        return { error: 'Código vacío' };
    }
    try {
        // Buscar el primer '=' (después del nombre de la variable)
        const eqIdx = code.indexOf('=');
        if (eqIdx === -1) {
            return { error: 'No se encontró "=" en el código' };
        }
        // Buscar la primera '{' después del '='
        const braceStart = code.indexOf('{', eqIdx);
        if (braceStart === -1) {
            return { error: 'No se encontró "{" de inicio del objeto' };
        }
        // Buscar la '}' balanceada final
        let depth = 0;
        let inString = false;
        let stringChar = null;
        let escape = false;
        let braceEnd = -1;
        for (let i = braceStart; i < code.length; i++) {
            const ch = code[i];
            if (escape) { escape = false; continue; }
            if (ch === '\\') { escape = true; continue; }
            if (inString) {
                if (ch === stringChar) inString = false;
                continue;
            }
            if (ch === '"' || ch === "'" || ch === '`') {
                inString = true;
                stringChar = ch;
                continue;
            }
            if (ch === '{') depth++;
            else if (ch === '}') {
                depth--;
                if (depth === 0) {
                    braceEnd = i;
                    break;
                }
            }
        }
        if (braceEnd === -1) {
            return { error: 'No se encontró "}" de cierre del objeto' };
        }
        const objStr = code.substring(braceStart, braceEnd + 1);
        // Usar new Function en lugar de eval (más seguro)
        const parsed = new Function('return (' + objStr + ')')();
        // Validar shape
        if (!parsed || typeof parsed !== 'object') {
            return { error: 'El código no produce un objeto' };
        }
        if (!Array.isArray(parsed.segments)) {
            return { error: 'Falta el array "segments"' };
        }
        // Devolver objeto normalizado
        return {
            data: {
                id: String(parsed.id || 'imported_level'),
                name: String(parsed.name || 'Imported Level'),
                difficulty: String(parsed.difficulty || 'medium'),
                segments: parsed.segments
            }
        };
    } catch (err) {
        return { error: 'Error al parsear: ' + err.message };
    }
}

function showImportModal() {
    document.getElementById('importTextarea').value = '';
    document.getElementById('importError').style.display = 'none';
    document.getElementById('importModal').style.display = 'flex';
}

function hideImportModal() {
    document.getElementById('importModal').style.display = 'none';
}

function confirmImport() {
    const text = document.getElementById('importTextarea').value.trim();
    const errEl = document.getElementById('importError');
    if (!text) {
        errEl.textContent = 'Pega el código o selecciona un archivo';
        errEl.style.display = 'block';
        return;
    }
    const result = parseLevelCode(text);
    if (result.error) {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
        return;
    }
    if (editorState.segments.length > 0) {
        if (!confirm(`Reemplazar el nivel actual (${editorState.segments.length} segmentos) con el importado (${result.data.segments.length} segmentos)?`)) {
            return;
        }
    }
    mutate({
        levelId: result.data.id,
        levelName: result.data.name,
        difficulty: result.data.difficulty,
        segments: result.data.segments,
        currentGrid: null,
        editingSegmentIndex: null
    });
    closeGridEditor();
    hideImportModal();
}

function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('importTextarea').value = e.target.result;
    };
    reader.onerror = () => {
        const errEl = document.getElementById('importError');
        errEl.textContent = 'Error leyendo el archivo';
        errEl.style.display = 'block';
    };
    reader.readAsText(file);
}

/* ==============================================
   7. GESTIÓN DE GRID (helpers)
   ============================================== */

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
                const newGrid = deepClone(editorState.currentGrid);
                newGrid[rowIndex][colIndex] = editorState.selectedCellType;
                // No usamos mutate() aquí porque es interacción continua con drag;
                // sólo guardamos al final con saveGrid. Pero sí actualizamos currentGrid.
                editorState.currentGrid = newGrid;
                renderGrid();
                scheduleRender3D();
            });

            cellDiv.addEventListener('mouseenter', (e) => {
                if (e.buttons === 1) {
                    const newGrid = deepClone(editorState.currentGrid);
                    newGrid[rowIndex][colIndex] = editorState.selectedCellType;
                    editorState.currentGrid = newGrid;
                    renderGrid();
                    scheduleRender3D();
                }
            });

            rowDiv.appendChild(cellDiv);
        });

        canvas.appendChild(rowDiv);
    });

    updateGridControls();
}

function modifyGrid(action) {
    if (!editorState.currentGrid) return;
    const grid = deepClone(editorState.currentGrid);
    const currentColumns = getCurrentColumnCount();

    switch (action) {
        case 'addRow':
            grid.push(new Array(currentColumns).fill(1));
            break;
        case 'removeRow':
            if (grid.length > 1) grid.pop();
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

    editorState.currentGrid = grid;
    renderGrid();
    scheduleRender3D();
}

function clearGrid() {
    if (!editorState.currentGrid) return;
    const grid = deepClone(editorState.currentGrid);
    grid.forEach(row => {
        for (let i = 0; i < row.length; i++) row[i] = 0;
    });
    editorState.currentGrid = grid;
    renderGrid();
    scheduleRender3D();
}

function saveGrid() {
    const name = document.getElementById('segmentName').value || 'Custom Grid';
    const length = parseInt(document.getElementById('segmentLength').value) || 100;
    const segment = {
        type: 'custom_grid',
        name: name,
        length: length,
        grid: normalizeGrid(deepClone(editorState.currentGrid))
    };
    const newSegments = deepClone(editorState.segments);
    if (editorState.editingSegmentIndex !== null) {
        newSegments[editorState.editingSegmentIndex] = segment;
    } else {
        newSegments.push(segment);
    }
    mutate({ segments: newSegments, currentGrid: null, editingSegmentIndex: null });
    closeGridEditor();
}

function openGridEditor(segmentIndex = null) {
    if (segmentIndex !== null) {
        const segment = editorState.segments[segmentIndex];
        document.getElementById('segmentName').value = segment.name || '';
        document.getElementById('segmentLength').value = segment.length || 100;
        editorState.currentGrid = normalizeGrid(deepClone(segment.grid));
        editorState.editingSegmentIndex = segmentIndex;
    } else {
        document.getElementById('segmentName').value = '';
        document.getElementById('segmentLength').value = 100;
        editorState.currentGrid = JSON.parse(JSON.stringify(DEFAULT_GRID));
        editorState.editingSegmentIndex = null;
    }
    document.getElementById('gridEditorPanel').style.display = 'block';
    renderGrid();
    scheduleRender3D();
}

function closeGridEditor() {
    document.getElementById('gridEditorPanel').style.display = 'none';
    editorState.currentGrid = null;
    editorState.editingSegmentIndex = null;
}

function toggleCompactGrid() {
    document.getElementById('gridCanvas').classList.toggle('compact');
}

/* ==============================================
   8. GESTIÓN DE SEGMENTOS
   ============================================== */

function addPatternSegment(patternKey) {
    if (!PATTERN_LIBRARY[patternKey]) {
        console.error('Patrón desconocido:', patternKey);
        return;
    }
    const newSegments = deepClone(editorState.segments);
    newSegments.push({ type: patternKey });
    mutate({ segments: newSegments });
}

function moveSegment(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= editorState.segments.length) return;
    const newSegments = deepClone(editorState.segments);
    const temp = newSegments[index];
    newSegments[index] = newSegments[newIndex];
    newSegments[newIndex] = temp;
    mutate({ segments: newSegments });
}

function moveSegmentTo(index, targetIndex) {
    if (index === targetIndex) return;
    if (index < 0 || index >= editorState.segments.length) return;
    const newSegments = deepClone(editorState.segments);
    const [item] = newSegments.splice(index, 1);
    newSegments.splice(targetIndex, 0, item);
    mutate({ segments: newSegments });
}

function duplicateSegment(index) {
    const newSegments = deepClone(editorState.segments);
    const dup = deepClone(newSegments[index]);
    newSegments.splice(index + 1, 0, dup);
    mutate({ segments: newSegments });
}

function deleteSegment(index) {
    if (!confirm('¿Eliminar este segmento?')) return;
    const newSegments = deepClone(editorState.segments);
    newSegments.splice(index, 1);
    mutate({ segments: newSegments });
}

function formatPatternName(pattern) {
    return PATTERN_LIBRARY[pattern]?.name || pattern;
}

function getSegmentDescription(segment) {
    if (segment.type === 'custom_grid') {
        const rowCount = segment.grid?.length || 0;
        const colCount = segment.grid?.[0]?.length || GRID_DEFAULT_COLUMNS;
        return `Grid ${rowCount}×${colCount} · ${segment.length}m`;
    } else if (segment.type) {
        return `Patrón · ${formatPatternName(segment.type)}`;
    } else if (segment.obstacles) {
        return `Inline · ${segment.obstacles.length} obstáculos`;
    }
    return '—';
}

function getSegmentClass(segment) {
    if (segment.type === 'custom_grid') return 'grid-segment';
    if (segment.type) return 'pattern-segment';
    if (segment.obstacles) return 'inline-segment';
    return '';
}

function buildSegmentPreview(segment) {
    // Devuelve un HTMLElement con un mini-preview del segmento
    const preview = document.createElement('div');
    preview.className = 'segment-preview';

    if (segment.type === 'custom_grid' && Array.isArray(segment.grid)) {
        // Mini-grid con colores
        segment.grid.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'preview-row';
            (row || []).forEach(cell => {
                const v = Number.parseInt(cell, 10);
                const cellDiv = document.createElement('div');
                cellDiv.className = 'preview-cell';
                cellDiv.style.background = TYPE_COLORS_HEX[v] || '#222';
                rowDiv.appendChild(cellDiv);
            });
            preview.appendChild(rowDiv);
        });
    } else if (segment.type) {
        // Patrón predefinido: dot pattern según número de obstáculos
        const pattern = PATTERN_LIBRARY[segment.type];
        const obstacleCount = pattern?.obstacles?.length || 0;
        for (let i = 0; i < Math.min(obstacleCount, 12); i++) {
            const dot = document.createElement('div');
            dot.className = 'preview-cell';
            const obs = pattern.obstacles[i];
            const v = typeToInt(obs.type);
            dot.style.background = TYPE_COLORS_HEX[v] || '#666';
            preview.appendChild(dot);
        }
        // Huecos visuales para indicar "más obstáculos"
        if (obstacleCount > 12) {
            const more = document.createElement('div');
            more.className = 'preview-cell';
            more.style.background = 'transparent';
            more.style.color = '#666';
            more.style.fontSize = '8px';
            more.style.display = 'flex';
            more.style.alignItems = 'center';
            more.style.justifyContent = 'center';
            more.textContent = '+' + (obstacleCount - 12);
            preview.appendChild(more);
        }
    } else if (segment.obstacles) {
        // Inline: dots por obstáculo
        segment.obstacles.slice(0, 12).forEach(obs => {
            const dot = document.createElement('div');
            dot.className = 'preview-cell';
            const v = typeToInt(obs.type);
            dot.style.background = TYPE_COLORS_HEX[v] || '#666';
            preview.appendChild(dot);
        });
    } else {
        preview.style.color = '#666';
        preview.style.fontStyle = 'italic';
        preview.textContent = '— sin preview —';
    }
    return preview;
}

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
        item.className = `segment-item ${getSegmentClass(segment)}`;

        // Header: info + acciones
        const header = document.createElement('div');
        header.className = 'segment-header';

        const info = document.createElement('div');
        info.className = 'segment-info';

        const segmentName = (segment.type === 'custom_grid')
            ? (segment.name || 'Grid Personalizado')
            : (segment.type ? formatPatternName(segment.type) : (segment.name || 'Segmento inline'));
        const segmentDetails = getSegmentDescription(segment);

        info.innerHTML = `<strong>${index + 1}. ${escapeHtml(segmentName)}</strong><small>${escapeHtml(segmentDetails)}</small>`;

        const actions = document.createElement('div');
        actions.className = 'segment-actions';

        if (index > 0) {
            const upBtn = document.createElement('button');
            upBtn.className = 'btn-icon';
            upBtn.textContent = '↑';
            upBtn.title = 'Mover arriba';
            upBtn.addEventListener('click', () => moveSegment(index, -1));
            actions.appendChild(upBtn);
            // Doble-click: al inicio
            upBtn.addEventListener('dblclick', () => moveSegmentTo(index, 0));
        }
        if (index < editorState.segments.length - 1) {
            const downBtn = document.createElement('button');
            downBtn.className = 'btn-icon';
            downBtn.textContent = '↓';
            downBtn.title = 'Mover abajo (doble-click: al final)';
            downBtn.addEventListener('click', () => moveSegment(index, 1));
            actions.appendChild(downBtn);
            downBtn.addEventListener('dblclick', () => moveSegmentTo(index, editorState.segments.length - 1));
        }
        if (segment.type === 'custom_grid') {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon';
            editBtn.textContent = '✏️';
            editBtn.title = 'Editar';
            editBtn.addEventListener('click', () => openGridEditor(index));
            actions.appendChild(editBtn);
        }
        const dupBtn = document.createElement('button');
        dupBtn.className = 'btn-icon';
        dupBtn.textContent = '📋';
        dupBtn.title = 'Duplicar';
        dupBtn.addEventListener('click', () => duplicateSegment(index));
        actions.appendChild(dupBtn);
        const delBtn = document.createElement('button');
        delBtn.className = 'btn-icon delete';
        delBtn.textContent = '🗑️';
        delBtn.title = 'Eliminar';
        delBtn.addEventListener('click', () => deleteSegment(index));
        actions.appendChild(delBtn);

        header.appendChild(info);
        header.appendChild(actions);
        item.appendChild(header);

        // Mini-preview visual
        const preview = buildSegmentPreview(segment);
        item.appendChild(preview);

        list.appendChild(item);
    });
}

function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

/* ==============================================
   9. EXPORTACIÓN DE CÓDIGO
   ============================================== */

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
            (segment.grid || []).forEach(row => {
                code += `        [${row.join(', ')}],\n`;
            });
            code += `      ]\n`;
            code += `    }`;
        } else {
            code += `    { type: '${segment.type}' }`;
        }
        if (index < editorState.segments.length - 1) code += ',\n';
        else code += '\n';
    });

    code += `  ]\n`;
    code += `};\n`;
    return code;
}

function escapeString(value) {
    return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function exportLevel() {
    const code = generateLevelCode();
    document.getElementById('exportedCode').value = code;
    // Cambiar a la tab de código para que se vea
    switchTab('code');
}

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

/* ==============================================
   10. PREVIEW EN EL JUEGO (postMessage)
   ============================================== */

function buildLevelData(segmentsOverride) {
    const safeId = (editorState.levelId || '').trim() || 'level_custom';
    const name = editorState.levelName || 'Custom Level';
    const difficulty = editorState.difficulty || 'medium';
    const segments = segmentsOverride ?? editorState.segments.map(seg => {
        if (seg.type === 'custom_grid') {
            return {
                type: 'custom_grid',
                name: seg.name || 'Custom Grid',
                length: Number.parseInt(seg.length, 10) || 100,
                grid: normalizeGrid(deepClone(seg.grid))
            };
        }
        return { type: seg.type };
    });
    return { id: safeId, name, difficulty, segments };
}

function buildPreviewSegments() {
    const baseSegments = editorState.segments.map(seg => {
        if (seg.type === 'custom_grid') {
            return {
                type: 'custom_grid',
                name: seg.name || 'Custom Grid',
                length: Number.parseInt(seg.length, 10) || 100,
                grid: normalizeGrid(deepClone(seg.grid))
            };
        }
        return { type: seg.type };
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
        grid: normalizeGrid(deepClone(editorState.currentGrid))
    };
}

function previewLevel() {
    const segments = buildPreviewSegments();
    const levelData = buildLevelData(segments);
    const payload = JSON.stringify(levelData);
    const baseUrl = getPreviewBaseUrlFromInput();
    const targetUrl = getPreviewUrl(payload, baseUrl);
    const previewWindow = window.open(targetUrl, '_blank');
    lastPreviewPayload = payload;
    lastPreviewWindow = previewWindow;
    lastPreviewOrigin = getOriginFromBaseUrl(baseUrl);
    sendPreviewPayload(previewWindow, payload, baseUrl);
}

function getPreviewBaseUrlFromInput() {
    const input = document.getElementById('previewBaseUrl');
    if (!input) return getDefaultPreviewBaseUrl();
    return normalizeBaseUrl(input.value);
}

function getStoredPreviewBaseUrl() {
    try {
        return localStorage.getItem(PREVIEW_BASE_STORAGE_KEY) || getDefaultPreviewBaseUrl();
    } catch {
        return getDefaultPreviewBaseUrl();
    }
}

function savePreviewBaseUrl(value) {
    const normalized = normalizeBaseUrl(value);
    try { localStorage.setItem(PREVIEW_BASE_STORAGE_KEY, normalized); } catch {}
    return normalized;
}

function normalizeBaseUrl(value) {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return getDefaultPreviewBaseUrl();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed.replace(/\/$/, '');
    if (trimmed.startsWith('localhost') || trimmed.startsWith('127.0.0.1')) return `http://${trimmed}`.replace(/\/$/, '');
    return trimmed.replace(/\/$/, '');
}

function getDefaultPreviewBaseUrl() {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        return window.location.origin;
    }
    return 'http://localhost:3000';
}

function isSameOriginPreview(baseUrl) {
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return false;
    try { return new URL(baseUrl).origin === window.location.origin; } catch { return false; }
}

function storePreviewPayload(payload) {
    try {
        const key = `${PREVIEW_DATA_STORAGE_PREFIX}${Date.now()}`;
        localStorage.setItem(key, payload);
        localStorage.setItem(`${PREVIEW_DATA_STORAGE_PREFIX}latest`, key);
        return key;
    } catch { return null; }
}

function getPreviewUrl(payload, baseUrl) {
    const params = new URLSearchParams();
    if (isSameOriginPreview(baseUrl)) {
        const previewKey = storePreviewPayload(payload);
        if (previewKey) params.set('previewKey', previewKey);
        else params.set('previewLevelData', payload);
    } else {
        params.set('preview', '1');
    }
    return `${baseUrl}/?${params.toString()}`;
}

function sendPreviewPayload(previewWindow, payload, baseUrl) {
    if (!previewWindow) return;
    const targetOrigin = getOriginFromBaseUrl(baseUrl);
    let attempts = 0;
    const send = () => {
        if (previewWindow.closed) return;
        attempts += 1;
        previewWindow.postMessage({ type: 'preview-level', payload }, targetOrigin);
        if (attempts < 20) setTimeout(send, 400);
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
    try { return new URL(baseUrl).origin; } catch { return '*'; }
}

/* ==============================================
   11. TABS DEL PANEL DERECHO
   ============================================== */

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.dataset.tabContent === tabName);
    });
    // Si volvemos a la tab 3D, forzar un re-render (el canvas puede haber cambiado de tamaño)
    if (tabName === 'preview' && renderer3D) {
        onPreviewResize();
        requestRender();
    }
}

/* ==============================================
   12. VISTA 3D (Three.js)
   ============================================== */

let renderer3D = null;
let scene3D = null;
let camera3D = null;
let obstaclesGroup3D = null;
let cameraMode3D = 'top';  // 'top' | 'perspective'

// Spherical coords para orbit camera custom
let orbit = {
    radius: 200,
    theta: 0,            // rotación Y (azimuth)
    phi: 0.001,          // inclinación desde Y (polar) — casi 0 = top-down
    target: { x: 0, y: 0, z: -50 }
};

// Estado de drag
let orbitDrag = {
    active: false,
    startX: 0,
    startY: 0,
    startTheta: 0,
    startPhi: 0,
    isShift: false
};

let obstaclesDirty = true;   // geometría cambió → rebuild + recenter
let lastRenderTime = 0;
let lastFrameTime = 0;
const RENDER_THROTTLE_MS = 33;  // ~30 FPS

function initPreview3D() {
    const container = document.getElementById('preview3d');
    const statusEl = document.getElementById('preview3dStatus');

    if (typeof THREE === 'undefined') {
        statusEl.textContent = '⚠ Three.js no se cargó (¿sin internet?). Vista 3D no disponible.';
        statusEl.style.color = '#ff6666';
        return;
    }

    try {
        // Renderer
        const rect = container.getBoundingClientRect();
        renderer3D = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer3D.setSize(rect.width, rect.height);
        renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer3D.setClearColor(0x0a0a15);
        container.appendChild(renderer3D.domElement);

        // Scene
        scene3D = new THREE.Scene();
        scene3D.background = new THREE.Color(0x0a0a15);

        // Camera
        camera3D = new THREE.PerspectiveCamera(
            PREVIEW_3D_FOV,
            rect.width / rect.height,
            PREVIEW_3D_NEAR,
            PREVIEW_3D_FAR
        );
        updateCameraFromOrbit();

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.55);
        scene3D.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
        dirLight.position.set(50, 100, 50);
        scene3D.add(dirLight);
        const dirLight2 = new THREE.DirectionalLight(0x8888ff, 0.25);
        dirLight2.position.set(-50, 30, -50);
        scene3D.add(dirLight2);

        // Suelo (semi-transparente)
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(600, 600),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a2e,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -3;
        scene3D.add(floor);

        // Grid helper
        const grid = new THREE.GridHelper(400, 40, 0x444444, 0x222222);
        grid.position.y = -2.9;
        scene3D.add(grid);

        // Group para obstáculos
        obstaclesGroup3D = new THREE.Group();
        scene3D.add(obstaclesGroup3D);

        // Event listeners para orbit camera
        setupOrbitControls(container);

        // Resize observer
        const ro = new ResizeObserver(() => onPreviewResize());
        ro.observe(container);

        // Click en el contenedor 3D (área vacía) hace blur del input activo
        // para que WASD/flechas funcionen sin tener que hacer click en un input antes
        container.addEventListener('mousedown', (e) => {
            if (e.target === container) {
                const active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
                    active.blur();
                }
            }
        });

        statusEl.textContent = '✅ Vista 3D activa · WASD/flechas para mover · Arrastra para rotar · Scroll para zoom';
        statusEl.style.color = '#32CD32';

        // Primer render
        requestRender();
        animate3D();
    } catch (err) {
        console.error('Error inicializando Three.js:', err);
        statusEl.textContent = '⚠ Error al inicializar Three.js: ' + err.message;
        statusEl.style.color = '#ff6666';
    }
}

function setupOrbitControls(container) {
    const dom = renderer3D.domElement;

    // Al hacer click en el canvas 3D, quitar foco de cualquier input
    // para que WASD/flechas funcionen inmediatamente
    dom.addEventListener('mousedown', (e) => {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
            active.blur();
        }
        orbitDrag.active = true;
        orbitDrag.startX = e.clientX;
        orbitDrag.startY = e.clientY;
        orbitDrag.startTheta = orbit.theta;
        orbitDrag.startPhi = orbit.phi;
        orbitDrag.isShift = e.shiftKey;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!orbitDrag.active) return;
        const dx = e.clientX - orbitDrag.startX;
        const dy = e.clientY - orbitDrag.startY;
        if (orbitDrag.isShift) {
            // Pan
            const panSpeed = orbit.radius * 0.002;
            const right = { x: -Math.sin(orbit.theta), z: -Math.cos(orbit.theta) };
            const up = { x: 0, y: 1, z: 0 };
            orbit.target.x -= right.x * dx * panSpeed;
            orbit.target.z -= right.z * dx * panSpeed;
            orbit.target.y += up.y * dy * panSpeed;
        } else {
            // Rotate
            orbit.theta = orbitDrag.startTheta - dx * 0.01;
            orbit.phi = Math.max(0.001, Math.min(Math.PI - 0.001, orbitDrag.startPhi + dy * 0.01));
        }
        updateCameraFromOrbit();
        requestRender();
    });

    window.addEventListener('mouseup', () => {
        orbitDrag.active = false;
    });

    dom.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 1.1 : 0.9;
        orbit.radius = Math.max(20, Math.min(800, orbit.radius * factor));
        updateCameraFromOrbit();
        requestRender();
    }, { passive: false });

    // Touch support (básico)
    let lastTouchDist = 0;
    let lastTouchMid = null;

    dom.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            orbitDrag.active = true;
            orbitDrag.startX = e.touches[0].clientX;
            orbitDrag.startY = e.touches[0].clientY;
            orbitDrag.startTheta = orbit.theta;
            orbitDrag.startPhi = orbit.phi;
        } else if (e.touches.length === 2) {
            const t1 = e.touches[0], t2 = e.touches[1];
            lastTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            lastTouchMid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
        }
        e.preventDefault();
    }, { passive: false });

    dom.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && orbitDrag.active) {
            const dx = e.touches[0].clientX - orbitDrag.startX;
            const dy = e.touches[0].clientY - orbitDrag.startY;
            orbit.theta = orbitDrag.startTheta - dx * 0.01;
            orbit.phi = Math.max(0.001, Math.min(Math.PI - 0.001, orbitDrag.startPhi + dy * 0.01));
            updateCameraFromOrbit();
            requestRender();
        } else if (e.touches.length === 2) {
            const t1 = e.touches[0], t2 = e.touches[1];
            const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            if (lastTouchDist > 0) {
                const factor = lastTouchDist / dist;
                orbit.radius = Math.max(20, Math.min(800, orbit.radius * factor));
                updateCameraFromOrbit();
                requestRender();
            }
            lastTouchDist = dist;
        }
        e.preventDefault();
    }, { passive: false });

    dom.addEventListener('touchend', () => {
        orbitDrag.active = false;
        lastTouchDist = 0;
    });
}

function updateCameraFromOrbit() {
    if (!camera3D) return;
    const x = orbit.target.x + orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta);
    const y = orbit.target.y + orbit.radius * Math.cos(orbit.phi);
    const z = orbit.target.z + orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta);
    camera3D.position.set(x, y, z);
    camera3D.lookAt(orbit.target.x, orbit.target.y, orbit.target.z);
}

function setCameraMode(mode) {
    cameraMode3D = mode;
    document.querySelectorAll('.camera-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.camera === mode);
    });
    if (mode === 'top') {
        orbit.phi = 0.001;
        orbit.radius = 200;
    } else {
        orbit.phi = Math.PI / 4;
        orbit.radius = 150;
    }
    updateCameraFromOrbit();
    requestRender();
}

function resetCamera() {
    // Recentra el target al nivel y vuelve al modo top-down
    cameraMode3D = 'top';
    document.querySelectorAll('.camera-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.camera === 'top');
    });
    orbit.theta = 0;
    orbit.phi = 0.001;
    orbit.radius = 200;
    orbit.target = { x: 0, y: 0, z: -50 };
    // Reconstruir obstáculos para que renderPreview3D centre la cámara en el nivel
    scheduleRender3D();
    requestRender();
    setSaveIndicator('idle', '⌖ Cámara centrada');
}

function toggleFullscreen3D() {
    if (!renderer3D) return;
    const container = document.getElementById('preview3d');
    const isFullscreen = container.classList.contains('fullscreen');
    if (isFullscreen) {
        container.classList.remove('fullscreen');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleFullscreenEscape);
    } else {
        container.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleFullscreenEscape);
    }
    // El ResizeObserver disparará automáticamente al cambiar el tamaño
    // pero forzamos un re-cálculo inmediato
    setTimeout(onPreviewResize, 50);
    requestRender();
}

function handleFullscreenEscape(e) {
    if (e.key === 'Escape') {
        const container = document.getElementById('preview3d');
        if (container.classList.contains('fullscreen')) {
            toggleFullscreen3D();
        }
    }
}

function toggleSegmentsPanel() {
    const list = document.getElementById('segmentsList');
    const btn = document.getElementById('toggleSegmentsPanel');
    list.classList.toggle('collapsed');
    btn.textContent = list.classList.contains('collapsed') ? '▶' : '▼';
    btn.title = list.classList.contains('collapsed') ? 'Expandir panel' : 'Colapsar panel';
}

function onPreviewResize() {
    if (!renderer3D || !camera3D) return;
    // Usar el parent actual del canvas (puede haber cambiado si está en fullscreen)
    const canvas = renderer3D.domElement;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    renderer3D.setSize(rect.width, rect.height);
    camera3D.aspect = rect.width / rect.height;
    camera3D.updateProjectionMatrix();
    requestRender();
}

/* ==============================================
   12.5 NAVEGACIÓN POR TECLADO + MINI-MAPA
   ============================================== */

// Estado de teclas de cámara
const cameraKeys = { w: false, a: false, s: false, d: false, q: false, e: false };
let cameraKeyHandlersBound = false;
const CAMERA_PAN_SPEED = 60;  // unidades/segundo

function setupCameraKeyHandlers() {
    if (cameraKeyHandlersBound) return;
    cameraKeyHandlersBound = true;
    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;  // no interferir con atajos
        const k = e.key.toLowerCase();
        if (k in cameraKeys) {
            cameraKeys[k] = true;
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k in cameraKeys) cameraKeys[k] = false;
    });
    // También flechas
    document.addEventListener('keydown', (e) => {
        const tag = e.target.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'ArrowUp') { cameraKeys.w = true; e.preventDefault(); }
        else if (e.key === 'ArrowDown') { cameraKeys.s = true; e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { cameraKeys.a = true; e.preventDefault(); }
        else if (e.key === 'ArrowRight') { cameraKeys.d = true; e.preventDefault(); }
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') cameraKeys.w = false;
        else if (e.key === 'ArrowDown') cameraKeys.s = false;
        else if (e.key === 'ArrowLeft') cameraKeys.a = false;
        else if (e.key === 'ArrowRight') cameraKeys.d = false;
    });
}

function applyCameraKeys(delta) {
    let dx = 0, dy = 0, dz = 0;
    if (cameraKeys.w) dz += 1;
    if (cameraKeys.s) dz -= 1;
    if (cameraKeys.d) dx += 1;
    if (cameraKeys.a) dx -= 1;
    if (cameraKeys.q) dy += 1;
    if (cameraKeys.e) dy -= 1;
    if (dx === 0 && dy === 0 && dz === 0) return false;

    const speed = CAMERA_PAN_SPEED * delta;
    // Movimiento en ejes del mundo (intuitivo en top-down)
    orbit.target.x += dx * speed;
    orbit.target.y += dy * speed;
    orbit.target.z += dz * speed;
    return true;
}

let keysIndicatorDirty = true;
function updateKeysIndicator() {
    // Optimización: sólo actualizar si el estado cambió
    const ind = document.getElementById('keysIndicator');
    if (!ind) return;
    ind.querySelectorAll('span').forEach(span => {
        const k = span.dataset.key;
        const isActive = cameraKeys[k] === true;
        if (span.classList.contains('active') !== isActive) {
            span.classList.toggle('active', isActive);
            keysIndicatorDirty = true;
        }
    });
}

/* --- Mini-mapa --- */

let minimapCtx = null;
let minimapBounds = null;  // { minX, maxX, minZ, maxZ, padding }
let minimapObstacles = [];
let minimapListenersBound = false;

function initMinimap() {
    if (minimapListenersBound) return;
    const canvas = document.getElementById('minimap');
    if (!canvas) return;
    minimapCtx = canvas.getContext('2d');

    // Click handler — salta el target a esa posición
    canvas.addEventListener('click', (e) => {
        if (!minimapBounds) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;   // 0-1
        const y = (e.clientY - rect.top) / rect.height;   // 0-1
        // El mini-mapa está invertido en Z (Y invertido en canvas, Z invertido en mundo)
        const worldX = minimapBounds.minX + x * (minimapBounds.maxX - minimapBounds.minX);
        const worldZ = minimapBounds.maxZ - y * (minimapBounds.maxZ - minimapBounds.minZ);
        orbit.target.x = worldX;
        orbit.target.z = worldZ;
        updateCameraFromOrbit();
        requestRender();
    });

    // Drag para mover continuo
    let dragging = false;
    canvas.addEventListener('mousedown', () => { dragging = true; });
    canvas.addEventListener('mouseup', () => { dragging = false; });
    canvas.addEventListener('mouseleave', () => { dragging = false; });
    canvas.addEventListener('mousemove', (e) => {
        if (!dragging || !minimapBounds) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const worldX = minimapBounds.minX + x * (minimapBounds.maxX - minimapBounds.minX);
        const worldZ = minimapBounds.maxZ - y * (minimapBounds.maxZ - minimapBounds.minZ);
        orbit.target.x = worldX;
        orbit.target.z = worldZ;
        updateCameraFromOrbit();
        requestRender();
    });

    minimapListenersBound = true;
}

function drawMinimap() {
    if (!minimapCtx) return;
    const canvas = document.getElementById('minimap');
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    // Limpiar
    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    minimapCtx.fillRect(0, 0, W, H);

    if (!minimapBounds || minimapObstacles.length === 0) {
        minimapCtx.fillStyle = '#666';
        minimapCtx.font = '11px Arial';
        minimapCtx.textAlign = 'center';
        minimapCtx.fillText('Nivel vacío', W / 2, H / 2);
        return;
    }

    const { minX, maxX, minZ, maxZ, padding } = minimapBounds;
    const worldW = maxX - minX;
    const worldH = maxZ - minZ;
    const scale = Math.min((W - padding * 2) / worldW, (H - padding * 2) / worldH);
    const offsetX = (W - worldW * scale) / 2;
    const offsetY = (H - worldH * scale) / 2;

    // Función: mundo → canvas
    const toCanvasX = (wx) => offsetX + (wx - minX) * scale;
    const toCanvasY = (wz) => offsetY + (maxZ - wz) * scale;  // Z invertido

    // Dibujar obstáculos
    minimapObstacles.forEach(o => {
        const cx = toCanvasX(o.x);
        const cy = toCanvasY(o.z);
        const cellW = Math.max(1, o.size[0] * scale);
        const cellH = Math.max(1, o.size[2] * scale);
        const cellV = typeToInt(o.type);
        minimapCtx.fillStyle = TYPE_COLORS_HEX[cellV] || '#666';
        minimapCtx.fillRect(cx - cellW / 2, cy - cellH / 2, cellW, cellH);
    });

    // Dibujar viewport de cámara (rectángulo que muestra lo que se ve en 3D)
    // Para una cámara orbit, calculamos la huella aproximada en el suelo
    const cameraHeight = orbit.radius * Math.cos(orbit.phi);
    const halfFov = THREE.MathUtils.degToRad(PREVIEW_3D_FOV / 2);
    const viewHalfW = Math.tan(halfFov) * cameraHeight;
    const aspect = renderer3D.domElement.clientWidth / Math.max(1, renderer3D.domElement.clientHeight);
    const viewHalfH = viewHalfW / aspect;

    minimapCtx.strokeStyle = '#00ff00';
    minimapCtx.lineWidth = 2;
    minimapCtx.strokeRect(
        toCanvasX(orbit.target.x - viewHalfW),
        toCanvasY(orbit.target.z + viewHalfH),
        viewHalfW * 2 * scale,
        viewHalfH * 2 * scale
    );

    // Cruz en el target
    minimapCtx.strokeStyle = '#FFD700';
    minimapCtx.lineWidth = 1;
    minimapCtx.beginPath();
    const tx = toCanvasX(orbit.target.x);
    const ty = toCanvasY(orbit.target.z);
    minimapCtx.moveTo(tx - 5, ty); minimapCtx.lineTo(tx + 5, ty);
    minimapCtx.moveTo(tx, ty - 5); minimapCtx.lineTo(tx, ty + 5);
    minimapCtx.stroke();

    // Indicador de orientación (flecha que apunta al norte del mundo = +Z)
    minimapCtx.fillStyle = '#FFD700';
    minimapCtx.font = 'bold 9px Arial';
    minimapCtx.textAlign = 'right';
    minimapCtx.fillText('N', W - 4, 12);
}

/* ==============================================
   13. RENDER DE OBSTÁCULOS EN 3D
   ============================================== */

function buildObstaclesForPreview(segments) {
    // Construir lista plana de obstáculos con posición absoluta
    const result = [];
    let cursorZ = 0;

    segments.forEach(seg => {
        let obstacles = [];
        if (seg.type === 'custom_grid') {
            // MUST MATCH LevelLoader.parseGridSegment in src/utils/LevelLoader.js
            const grid = Array.isArray(seg.grid) ? seg.grid : [];
            const length = Number.parseInt(seg.length, 10) || 100;
            const rows = grid.length;
            if (rows === 0) return;
            const blockLength = length / rows;
            const laneWidth = 15;
            const defaultLanes = [-laneWidth, 0, laneWidth];

            grid.forEach((row, rowIndex) => {
                const zPos = cursorZ + -(rowIndex * blockLength) - (blockLength / 2);
                const columnsCount = Math.min(3, Math.max(1, (row || []).length || defaultLanes.length));
                const lanePositions = columnsCount === 1
                    ? [0]
                    : columnsCount === 2
                        ? [-laneWidth, laneWidth]
                        : defaultLanes;

                (row || []).forEach((cellValue, colIndex) => {
                    const xPos = lanePositions[colIndex];
                    if (xPos === undefined) return;
                    const v = Number.parseInt(cellValue, 10);
                    pushObstacleFromCell(result, v, xPos, zPos, blockLength);
                });
            });
            cursorZ -= length;
        } else if (seg.type) {
            const pattern = PATTERN_LIBRARY[seg.type];
            if (pattern) {
                (pattern.obstacles || []).forEach(o => {
                    result.push({
                        x: o.x,
                        y: o.y,
                        z: cursorZ + o.z,
                        size: o.size,
                        type: o.type
                    });
                });
                cursorZ += (pattern.exitPoint?.z || -120);
            }
        } else if (seg.obstacles) {
            (seg.obstacles || []).forEach(o => {
                result.push({
                    x: o.x,
                    y: o.y,
                    z: cursorZ + o.z,
                    size: o.size,
                    type: o.type
                });
            });
            cursorZ += (seg.exitPoint?.z || -150);
        }
    });

    return result;
}

function pushObstacleFromCell(result, cellValue, xPos, zPos, blockLength) {
    // Replica simplificada de LevelLoader.parseGridSegment
    const cellTypeMap = {
        1: { y: -1, type: 'NORMAL', size: [15, 2, blockLength] },
        2: { y: 1, type: 'NORMAL', size: [15, 2, blockLength] },
        3: { y: 0.1, type: 'BURNING', size: [15, 1, blockLength], withBase: true },
        4: { y: 0.1, type: 'SUPPLIES', size: [15, 2, blockLength], withBase: true },
        5: { y: 0.1, type: 'BOOST', size: [15, 1, blockLength], withBase: true },
        6: { y: -1, type: 'STICKY', size: [15, 2, blockLength] },
        7: { y: -1, type: 'SLIPPERY', size: [15, 2, blockLength] }
    };
    const cfg = cellTypeMap[cellValue];
    if (!cfg) return;
    result.push({
        x: xPos,
        y: cfg.y,
        z: zPos,
        size: cfg.size,
        type: cfg.type
    });
    if (cfg.withBase) {
        result.push({
            x: xPos,
            y: -1,
            z: zPos,
            size: [15, 2, blockLength],
            type: 'NORMAL'
        });
    }
}

function typeToInt(type) {
    // Mapea de string type a cell value para usar TYPE_COLORS_INT
    const map = {
        'NORMAL': 1, 'BURNING': 3, 'SUPPLIES': 4, 'BOOST': 5,
        'STICKY': 6, 'SLIPPERY': 7, 'GOAL': 0, 'BLOCK': 0
    };
    return map[type] || 1;
}

function renderPreview3D() {
    if (!obstaclesGroup3D) return;

    // Limpiar grupo
    while (obstaclesGroup3D.children.length > 0) {
        const child = obstaclesGroup3D.children[0];
        obstaclesGroup3D.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
        }
    }

    // Obtener segmentos (incluyendo grid en edición si está abierto)
    const segments = buildPreviewSegments();
    const obstacles = buildObstaclesForPreview(segments);

    if (obstacles.length === 0) {
        minimapObstacles = [];
        minimapBounds = null;
        // El grupo ya quedó vacío arriba; el renderer.render de la misma
        // tanda (en requestRender / animate3D) pintará la escena limpia.
        return;
    }

    // Calcular bounds y centrar
    let minZ = Infinity, maxZ = -Infinity, minX = Infinity, maxX = -Infinity;
    obstacles.forEach(o => {
        if (o.z < minZ) minZ = o.z;
        if (o.z > maxZ) maxZ = o.z;
        if (o.x < minX) minX = o.x;
        if (o.x > maxX) maxX = o.x;
    });
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;

    // Centrar el target de la cámara
    orbit.target.x = centerX;
    orbit.target.z = centerZ + 20;  // un poco adelante de la línea de salida
    orbit.target.y = 0;

    // Reposicionar el grupo
    obstaclesGroup3D.position.set(-centerX, 0, 0);

    // Guardar bounds y obstáculos para el mini-mapa
    // Añadir padding para que no se peguen a los bordes
    const padX = Math.max(10, (maxX - minX) * 0.1);
    const padZ = Math.max(10, (maxZ - minZ) * 0.1);
    minimapBounds = {
        minX: minX - padX,
        maxX: maxX + padX,
        minZ: minZ - padZ,
        maxZ: maxZ + padZ,
        padding: 8
    };
    minimapObstacles = obstacles;

    // Crear meshes
    obstacles.forEach(o => {
        const geo = new THREE.BoxGeometry(o.size[0], o.size[1], o.size[2]);
        const mat = new THREE.MeshStandardMaterial({
            color: TYPE_COLORS_INT[typeToInt(o.type)],
            roughness: 0.7,
            metalness: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        // Posición absoluta menos el offset del grupo
        mesh.position.set(o.x, o.y + o.size[1] / 2, o.z - centerZ);
        // Borde naranja para visualizar mejor (como en el juego)
        const edges = new THREE.EdgesGeometry(geo);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xFF4500, transparent: true, opacity: 0.4 });
        const wireframe = new THREE.LineSegments(edges, lineMat);
        mesh.add(wireframe);
        obstaclesGroup3D.add(mesh);
    });

    updateCameraFromOrbit();
}

function scheduleRender3D() {
    // La geometría de obstáculos cambió: marcar para reconstruir y recentrar.
    obstaclesDirty = true;
}

function requestRender() {
    // Pide un render inmediato (drag, wheel, click, resize, tab switch…).
    // Si los obstáculos cambiaron, los reconstruye aquí mismo; si no, sólo repinta.
    // Respeta el throttle para no saturar.
    if (!renderer3D || !scene3D || !camera3D) return;
    const now = performance.now();
    if (now - lastRenderTime < RENDER_THROTTLE_MS) return;
    if (obstaclesDirty) {
        renderPreview3D();
        obstaclesDirty = false;
    }
    renderer3D.render(scene3D, camera3D);
    drawMinimap();
    lastRenderTime = now;
}

function animate3D() {
    requestAnimationFrame(animate3D);
    if (!renderer3D || !scene3D || !camera3D) return;
    const now = performance.now();

    // Delta para movimiento suave de cámara (cada frame, no throttled)
    const delta = lastFrameTime > 0
        ? Math.min(0.1, (now - lastFrameTime) / 1000)
        : 1 / 60;
    lastFrameTime = now;

    // El pan por teclado actualiza orbit.target (NO reconstruye obstáculos)
    const moved = applyCameraKeys(delta);
    if (moved) {
        updateCameraFromOrbit();
    }

    // Indicador de teclas (DOM, ligero)
    updateKeysIndicator();

    // Render throttled a ~30 FPS
    if (now - lastRenderTime < RENDER_THROTTLE_MS) return;
    if (obstaclesDirty) {
        renderPreview3D();
        obstaclesDirty = false;
    }
    renderer3D.render(scene3D, camera3D);
    drawMinimap();
    lastRenderTime = now;
}

/* ==============================================
   14. INICIALIZACIÓN
   ============================================== */

function initializeEventListeners() {
    // Level properties (input changes NO pasan por mutate, sólo se aplican al cambiar/blur)
    document.getElementById('levelId').addEventListener('input', (e) => {
        editorState.levelId = e.target.value;
        saveDraft();
    });
    document.getElementById('levelName').addEventListener('input', (e) => {
        editorState.levelName = e.target.value;
        saveDraft();
    });
    document.getElementById('difficulty').addEventListener('change', (e) => {
        mutate({ difficulty: e.target.value });
        updateMetricsPanel();
    });

    // Pattern buttons
    document.querySelectorAll('.btn-pattern').forEach(btn => {
        btn.addEventListener('click', () => {
            addPatternSegment(btn.dataset.pattern);
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
    document.getElementById('closeGridEditor').addEventListener('click', () => {
        editorState.currentGrid = null;
        editorState.editingSegmentIndex = null;
        closeGridEditor();
    });
    document.getElementById('addRow').addEventListener('click', () => modifyGrid('addRow'));
    document.getElementById('removeRow').addEventListener('click', () => modifyGrid('removeRow'));
    document.getElementById('addColumn').addEventListener('click', () => modifyGrid('addColumn'));
    document.getElementById('removeColumn').addEventListener('click', () => modifyGrid('removeColumn'));
    document.getElementById('clearGrid').addEventListener('click', clearGrid);
    document.getElementById('saveGrid').addEventListener('click', saveGrid);
    document.getElementById('toggleCompact').addEventListener('click', toggleCompactGrid);

    // Undo/Redo
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);

    // Import / Clear draft
    document.getElementById('importBtn').addEventListener('click', showImportModal);
    document.getElementById('closeImportModal').addEventListener('click', hideImportModal);
    document.getElementById('cancelImport').addEventListener('click', hideImportModal);
    document.getElementById('confirmImport').addEventListener('click', confirmImport);
    document.getElementById('importFile').addEventListener('change', handleImportFile);
    document.getElementById('clearDraftBtn').addEventListener('click', clearDraft);

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Camera toggles
    document.querySelectorAll('.camera-btn').forEach(btn => {
        btn.addEventListener('click', () => setCameraMode(btn.dataset.camera));
    });
    document.getElementById('resetCameraBtn').addEventListener('click', resetCamera);
    document.getElementById('expand3dBtn').addEventListener('click', toggleFullscreen3D);
    document.getElementById('collapse3dBtn').addEventListener('click', toggleFullscreen3D);

    // Segments panel toggle
    document.getElementById('toggleSegmentsPanel').addEventListener('click', toggleSegmentsPanel);

    // Export
    document.getElementById('exportLevel').addEventListener('click', exportLevel);
    document.getElementById('previewLevel').addEventListener('click', previewLevel);
    document.getElementById('copyCode').addEventListener('click', copyToClipboard);

    // Preview base URL
    const previewBaseInput = document.getElementById('previewBaseUrl');
    if (previewBaseInput) {
        previewBaseInput.value = getStoredPreviewBaseUrl();
        previewBaseInput.addEventListener('input', () => {
            savePreviewBaseUrl(previewBaseInput.value);
        });
    }

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Ignorar si está en un input
        const tag = e.target.tagName?.toLowerCase();
        const inEditable = tag === 'input' || tag === 'textarea' || tag === 'select';

        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        } else if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
                   ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
            e.preventDefault();
            redo();
        } else if (e.key === 'Escape') {
            // Cerrar modal de import si está abierto
            if (document.getElementById('importModal').style.display !== 'none') {
                hideImportModal();
            } else if (document.getElementById('gridEditorPanel').style.display !== 'none') {
                document.getElementById('closeGridEditor').click();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();

    // Intentar cargar borrador
    const loaded = loadDraft();
    if (loaded) {
        console.log('Borrador restaurado');
    }

    // Sincronizar UI con estado
    document.getElementById('levelId').value = editorState.levelId;
    document.getElementById('levelName').value = editorState.levelName;
    document.getElementById('difficulty').value = editorState.difficulty;

    updateSegmentsList();
    updateMetricsPanel();
    updateUndoRedoButtons();
    setupPreviewHandshake();
    setupCameraKeyHandlers();
    initMinimap();

    // Si no hay grid ni segmentos, abrir editor
    if (!editorState.currentGrid && editorState.segments.length === 0) {
        editorState.currentGrid = JSON.parse(JSON.stringify(DEFAULT_GRID));
    }

    // Inicializar vista 3D
    initPreview3D();
    // Dibujar el mini-mapa inicial (puede estar vacío)
    setTimeout(() => drawMinimap(), 100);
    setSaveIndicator('idle', loaded ? '📂 Borrador restaurado' : '⚪ Listo para empezar');
});
