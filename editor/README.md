# 🎮 Three Roads - Editor de Niveles v2

Editor visual para diseñar niveles del juego Three Roads. v2 añade: **autosave, undo/redo, métricas en vivo, importador de niveles existentes, y vista 3D en tiempo real**.

## 🚀 Cómo Usar

### 1. Abrir el Editor

Simplemente abre `index.html` en tu navegador:
- Doble click en el archivo
- O arrastra el archivo a tu navegador
- O abre desde el navegador: `File > Open`

**No necesitas servidor web**, funciona directamente desde el archivo. **Sí requiere internet** (para cargar Three.js desde CDN).

### 2. Trabaja sin perder datos

- ✏️ Cada cambio se **guarda automáticamente** en tu navegador (cada 500ms).
- ↶↷ **Undo/Redo** con `Ctrl+Z` / `Ctrl+Shift+Z` (o los botones de la barra).
- 🗑 **Descartar borrador** si quieres empezar de cero.
- 📂 Al recargar, tu trabajo se restaura automáticamente.

### 3. Vista 3D en tiempo real

Mientras construyes, la pestaña **🎮 Vista 3D** muestra una previsualización 3D de tu nivel:
- **Arrastra** con el ratón para rotar la cámara
- **Scroll** para hacer zoom
- **WASD / Flechas** para mover el punto de mira (pan)
  - **W** / **↑**: alejar (más al norte del mundo)
  - **S** / **↓**: acercar
  - **A** / **←**: izquierda
  - **D** / **→**: derecha
  - **Q** / **E**: subir / bajar (en Y)
  - En la esquina inferior derecha del canvas hay un **indicador visual** que muestra qué teclas están detectadas (se iluminan en verde al presionarlas)
  - Si las teclas no responden, haz click en el canvas 3D primero (algunos inputs pueden capturar el foco)
- **Shift+arrastra** para pan con ratón
- **Top-down / Perspectiva** alterna entre vista cenital y perspectiva
- **⌖ Centrar** resetea rotación, zoom y posición
- **🔲 Expandir** abre el 3D en pantalla completa (Esc para salir)

#### Mini-mapa

En la esquina superior izquierda del canvas 3D hay un **mini-mapa** del nivel:
- Muestra todas las plataformas en miniatura (con sus colores)
- Un **rectángulo verde** indica qué porción del nivel estás viendo
- Una **cruz dorada** marca el centro de la cámara
- **Click o arrastra** sobre el mini-mapa para saltar la cámara a esa posición
- Útil para niveles largos donde el scroll/orbit no alcanza

La vista 3D se actualiza con cada cambio (throttle 30 FPS para no saturar).

### 4. Métricas en vivo

El panel **📊 Métricas en Vivo** muestra en tiempo real:
- **Segmentos** totales
- **Longitud total** del nivel en metros
- **Dificultad estimada** (basada en % de plataformas peligrosas)
- **Distribución por tipo de celda** con barras de progreso

### 5. Diseñar tu Nivel

#### Configurar Propiedades
1. **ID del Nivel**: Identificador único (ej: `level_23`)
2. **Nombre**: Nombre descriptivo (ej: "El Laberinto")
3. **Dificultad**: easy, medium, hard, extreme

#### Añadir Segmentos

**Opción A: Patrones Predefinidos**
- Click en cualquier patrón del panel de herramientas
- Se añade automáticamente a la lista de segmentos

**Opción B: Grid Personalizado**
1. Click en "+ Añadir Grid Personalizado"
2. Se abre el editor de grid
3. Configura nombre y longitud del segmento
4. Diseña el grid:
   - Selecciona un tipo de celda del panel izquierdo
   - Click en las celdas del grid para pintarlas
   - Arrastra el ratón mientras haces click para pintar múltiples
   - **▲** sobre la celda indica muro elevado (tipo 2)
   - **🔥** indica plataforma de fuego (tipo 3)
   - **⚡** indica plataforma de impulso (tipo 5)
5. Usa los botones para añadir/quitar filas y columnas
6. **Compacto** alterna entre celdas grandes (40×40px) y chicas (24×24px) — útil para grids grandes
7. Click en "Guardar Segmento"

#### Gestionar Segmentos
- **Reordenar**: Usa las flechas ↑↓ para mover segmentos
- **Editar**: Click en ✏️ para editar grids personalizados
- **Duplicar**: Click en 📋 para copiar un segmento
- **Eliminar**: Click en 🗑️ para borrar un segmento

### 6. Importar un nivel existente

Para editar un nivel que ya está en el juego:

1. Click en **📥 Importar** (esquina superior derecha)
2. Pega el contenido de `src/levels/levelN.js` o selecciona el archivo
3. Click en **Importar**
4. Confirma el reemplazo si ya tienes segmentos

El parser maneja el formato `export const LEVEL_X = { id, name, difficulty, segments: [...] }`.

### 7. Exportar el Nivel

1. Click en la pestaña **📄 Código**
2. Click en "Exportar Código"
3. El código JavaScript aparecerá en el textarea
4. Click en "Copiar al Portapapeles"
5. Crea un archivo nuevo en `src/levels/` (ej: `level23.js`)
6. Pega el código
7. Importa en `src/levels/index.js`:

```javascript
import { LEVEL_23 } from './level23.js';

export const LEVELS = [
  // ... otros niveles
  LEVEL_23
];
```

## 🎨 Tipos de Celdas

| Valor | Tipo | Descripción |
|-------|------|-------------|
| 0 | Vacío | Hueco - la nave cae |
| 1 | Normal | Plataforma estándar (gris/morado) |
| 2 | Muro ▲ | Obstáculo sólido elevado (hay que saltar) |
| 3 | Fuego 🔥 | Plataforma ardiente (roja) - daña |
| 4 | Suministros | Plataforma azul - recarga combustible |
| 5 | Impulso ⚡ | Plataforma verde - da velocidad |
| 6 | Pegajosa | Plataforma verde claro - reduce control |
| 7 | Resbaladiza | Plataforma naranja - muy poco control |

## 📐 Patrones Predefinidos

- **Camino Recto** (`straight_road`): Camino simple y seguro
- **Hueco Pequeño** (`small_gap`): Salto corto
- **Subida Suave** (`gentle_climb`): Rampa ascendente
- **Camino Dividido** (`split_path`): Dos caminos paralelos
- **Escaleras** (`step_sequence`): Tres escalones
- **Camino Peligroso** (`hazard_road`): Con zonas de fuego
- **Islas Flotantes** (`island_hops`): Saltos precisos
- **Puente Estrecho** (`narrow_bridge`): Camino delgado
- **Campo de Bloques** (`block_field`): Bloques altos para esquivar

## ⌨️ Atajos de Teclado

| Atajo | Acción |
| --- | --- |
| `Ctrl+Z` / `Cmd+Z` | Deshacer |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Rehacer |
| `Ctrl+Y` | Rehacer (alternativo) |
| `WASD` / `↑↓←→` | Mover la cámara 3D (pan) |
| `Q` / `E` | Subir / bajar la cámara 3D |
| `Esc` | Cerrar modal / editor de grid / 3D fullscreen |

## 💡 Consejos de Diseño

### Balance de Dificultad
- **Fácil** (< 15% peligrosas): Muchas plataformas normales, pocos huecos
- **Media** (15-35%): Mezcla de plataformas especiales, algunos huecos
- **Difícil** (35-55%): Muchos huecos, plataformas especiales complejas
- **Extrema** (> 55%): Casi todo peligroso

### Estructura Recomendada
1. **Inicio**: Camino recto para acostumbrarse
2. **Desarrollo**: Mezcla de patrones y grids personalizados
3. **Clímax**: Sección más difícil
4. **Final**: Camino recto para relajarse

### Grids Personalizados
- **Tamaño típico**: 3-5 columnas (máx 3 carriles), 3-10 filas
- **Longitud**: 60-150 metros
- Alterna entre secciones fáciles y difíciles
- Usa plataformas de suministros antes de secciones difíciles

### Vista 3D
- **Top-down** para ver la estructura general (recomendado para diseñar el flujo)
- **Perspectiva** para validar la altura de los muros elevados y el espaciado
- Rota la cámara para ver el nivel desde diferentes ángulos

## 🔧 Solución de Problemas

**El editor no se abre**
- Asegúrate de que los archivos `editor.css` y `editor.js` están en la misma carpeta
- Prueba con otro navegador (Chrome, Firefox, Edge)
- Revisa la consola del navegador por errores

**La vista 3D no aparece**
- Verifica tu conexión a internet (Three.js se carga desde CDN)
- Revisa la consola por errores de CORS o de carga
- La vista 3D no funciona en `file://` sin internet

**No puedo copiar el código**
- Selecciona el texto manualmente y usa Ctrl+C (Cmd+C en Mac)
- O guarda el código en un archivo de texto

**El nivel no aparece en el juego**
- Verifica que importaste el nivel en `src/levels/index.js`
- Asegúrate de que el ID del nivel es único
- Revisa la consola del navegador por errores

**El undo/redo no captura mis pinturas de celdas**
- Esto es intencional. Las pinturas de celdas individuales se confirman al hacer "Guardar Segmento".
- Si quieres volver atrás después de pintar, cierra el editor de grid sin guardar.

**Mi borrador no se restaura**
- Verifica que tu navegador no esté en modo privado (localStorage no persiste)
- Revisa la consola por errores de parseo

## 📝 Ejemplo de Nivel Exportado

```javascript
export const LEVEL_CUSTOM = {
  id: 'level_custom',
  name: 'Custom Level',
  difficulty: 'medium',
  segments: [
    { type: 'straight_road' },
    {
      type: 'custom_grid',
      name: 'Jump Challenge',
      length: 100,
      grid: [
        [1, 1, 1],
        [1, 0, 1],
        [0, 1, 0],
        [1, 1, 1],
      ]
    },
    { type: 'small_gap' }
  ]
};
```

## 🎯 Próximos Pasos

Después de crear tu nivel:
1. Pruébalo en el juego (botón "🎮 Probar en el juego")
2. Ajusta la dificultad según las métricas
3. Exporta el código y agrégalo al juego
4. Comparte tu nivel con otros (opcional)

## 🔄 Changelog v2

**Añadido:**
- 💾 Autosave con throttle 500ms en localStorage
- ↶↷ Undo/Redo con 50 niveles de historial y atajos de teclado
- 📊 Métricas en vivo: segmentos, longitud, distribución por tipo, dificultad
- 📥 Importador de niveles existentes (pegar o subir archivo)
- 🎮 Vista 3D en tiempo real con Three.js
- ⌖ Botón "Centrar" cámara
- 🔲 Botón "Expandir" a pantalla completa
- 🗺 **Mini-mapa** clickeable en esquina del canvas 3D
- ⌨️ **WASD / flechas** para mover la cámara (pan)
- 📐 Modo compacto del grid (24×24px por celda)
- ▲🔥⚡ Indicadores visuales en celdas del grid
- 📋 Mini-preview visual en cada item de segmento
- ▼ Botón colapsar panel de segmentos
- 🗑 Botón "Descartar borrador"
- 🏷️ Color de borde en items de segmento según tipo (azul=grid, verde=patrón, dorado=inline)
- ⬆️⬇️ Doble-click en ↑/↓ para mover al inicio/final
- Indicador "Guardado hace Xs"
- Soporte touch básico en la vista 3D y mini-mapa

**Cambiado:**
- Panel derecho con tabs (Vista 3D / Código)
- Canvas 3D más grande (500px de alto)
- Header reorganizado con toolbar
- Rediseño responsive (móvil)

¡Diviértete creando niveles! 🚀
