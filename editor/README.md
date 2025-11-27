# 🎮 Three Roads - Editor de Niveles

Editor visual para diseñar niveles del juego Three Roads.

## 🚀 Cómo Usar

### 1. Abrir el Editor

Simplemente abre `index.html` en tu navegador:
- Doble click en el archivo
- O arrastra el archivo a tu navegador
- O abre desde el navegador: `File > Open`

**No necesitas servidor web**, funciona directamente desde el archivo.

### 2. Diseñar tu Nivel

#### Configurar Propiedades
1. **ID del Nivel**: Identificador único (ej: `level_23`)
2. **Nombre**: Nombre descriptivo (ej: "El Laberinto")
3. **Dificultad**: easy, medium, o hard

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
   - Arrastra el mouse mientras haces click para pintar múltiples celdas
5. Usa los botones para añadir/quitar filas y columnas
6. Click en "Guardar Segmento"

#### Gestionar Segmentos
- **Reordenar**: Usa las flechas ↑↓ para mover segmentos
- **Editar**: Click en ✏️ para editar grids personalizados
- **Duplicar**: Click en 📋 para copiar un segmento
- **Eliminar**: Click en 🗑️ para borrar un segmento

### 3. Exportar el Nivel

1. Click en "Exportar Código"
2. El código JavaScript aparecerá en el panel derecho
3. Click en "Copiar al Portapapeles"
4. Crea un archivo nuevo en `src/levels/` (ej: `level23.js`)
5. Pega el código
6. Importa en `src/levels/index.js`:

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
| 1 | Normal | Plataforma estándar (gris) |
| 2 | Muro | Obstáculo sólido |
| 3 | Fuego | Plataforma ardiente (roja) - daña |
| 4 | Suministros | Plataforma azul - recarga combustible |
| 5 | Impulso | Plataforma verde - da velocidad |
| 6 | Pegajosa | Plataforma verde claro - reduce control |
| 7 | Resbaladiza | Plataforma naranja - muy poco control |

## 📐 Patrones Predefinidos

- **Camino Recto** (`straight_road`): Camino simple y seguro
- **Hueco Pequeño** (`small_gap`): Salto corto
- **Subida Suave** (`gentle_climb`): Rampa ascendente
- **Camino Dividido** (`split_path`): Dos caminos paralelos

## 💡 Consejos de Diseño

### Balance de Dificultad
- **Fácil**: Muchas plataformas normales, pocos huecos
- **Media**: Mezcla de plataformas especiales, algunos huecos
- **Difícil**: Muchos huecos, plataformas especiales complejas

### Estructura Recomendada
1. **Inicio**: Camino recto para acostumbrarse
2. **Desarrollo**: Mezcla de patrones y grids personalizados
3. **Clímax**: Sección más difícil
4. **Final**: Camino recto para relajarse

### Grids Personalizados
- **Tamaño típico**: 3-5 columnas, 3-10 filas
- **Longitud**: 60-150 metros
- Alterna entre secciones fáciles y difíciles
- Usa plataformas de suministros antes de secciones difíciles

## 🔧 Solución de Problemas

**El editor no se abre**
- Asegúrate de que los archivos `editor.css` y `editor.js` están en la misma carpeta
- Prueba con otro navegador (Chrome, Firefox, Edge)

**No puedo copiar el código**
- Selecciona el texto manualmente y usa Ctrl+C (Cmd+C en Mac)
- O guarda el código en un archivo de texto

**El nivel no aparece en el juego**
- Verifica que importaste el nivel en `src/levels/index.js`
- Asegúrate de que el ID del nivel es único
- Revisa la consola del navegador por errores

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
1. Pruébalo en el juego
2. Ajusta la dificultad según sea necesario
3. Comparte tu nivel con otros (opcional)

¡Diviértete creando niveles! 🚀
