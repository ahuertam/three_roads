// Level Editor State
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
    document.getElementById('copyCode').addEventListener('click', copyToClipboard);
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
        editorState.currentGrid = JSON.parse(JSON.stringify(segment.grid));
    } else {
        // New segment
        document.getElementById('segmentName').value = '';
        document.getElementById('segmentLength').value = 100;
        editorState.currentGrid = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];
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
}

// Modify grid
function modifyGrid(action) {
    const grid = editorState.currentGrid;
    
    switch(action) {
        case 'addRow':
            const newRow = new Array(grid[0].length).fill(1);
            grid.push(newRow);
            break;
            
        case 'removeRow':
            if (grid.length > 1) {
                grid.pop();
            }
            break;
            
        case 'addColumn':
            grid.forEach(row => row.push(1));
            break;
            
        case 'removeColumn':
            if (grid[0].length > 1) {
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
        grid: JSON.parse(JSON.stringify(editorState.currentGrid))
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
            segmentDetails = `${segment.grid.length}x${segment.grid[0].length} - ${segment.length}m`;
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
        'split_path': 'Camino Dividido'
    };
    return names[pattern] || pattern;
}

// Export level
function exportLevel() {
    const code = generateLevelCode();
    document.getElementById('exportedCode').value = code;
}

// Generate level code
function generateLevelCode() {
    const varName = editorState.levelId.toUpperCase().replace(/-/g, '_');
    
    let code = `export const ${varName} = {\n`;
    code += `  id: '${editorState.levelId}',\n`;
    code += `  name: '${editorState.levelName}',\n`;
    code += `  difficulty: '${editorState.difficulty}',\n`;
    code += `  segments: [\n`;
    
    editorState.segments.forEach((segment, index) => {
        if (segment.type === 'custom_grid') {
            code += `    {\n`;
            code += `      type: 'custom_grid',\n`;
            code += `      name: '${segment.name}',\n`;
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
