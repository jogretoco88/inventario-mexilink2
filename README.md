# Inventario MexiLink

App web móvil (PWA) para el conteo semanal de inventario de la ruta DSD de King Soopers.
React + Vite + Tailwind CSS + lucide-react. Instalable y funciona offline.

## Qué hace

- 49 productos cargados desde tu hoja `Hoja de calculo para aplicacion movil.xlsx`, agrupados por las 8 secciones de estante (8…1).
- Conteo por **Cajas**, **Display** y **Unidades** con botones +/− grandes para usar en el pasillo.
- Cálculo en vivo (campos de solo lectura):
  - `Total = (Cajas × factor caja) + (Display × factor display) + Unidades`
  - `Total Dinero = Total × Costo`
- El campo **Display** solo aparece en los productos que marques como “se maneja en display”.
- Persistencia automática en `localStorage` (no se pierde el conteo al cerrar).
- **Exportar CSV** compatible con Excel (con BOM UTF-8, respeta acentos).
- **Importar CSV** con limpieza automática de encabezados repetidos y filas inválidas.

## Configurar el factor (importante)

Tu hoja original no traía la columna de “unidades por caja”, así que el factor es
editable por producto. Tocá el ícono ⚙️ en cualquier producto para fijar:
- Unidades por caja
- Si se maneja en display (y unidades por display)

Se configura una sola vez y queda guardado.

## Correr en local

```bash
npm install
npm run dev        # abre http://localhost:5173
```

## Compilar para producción

```bash
npm run build      # genera /dist con el service worker (offline)
npm run preview    # prueba el build localmente
```

## Publicar en GitHub Pages

1. Si va en un subdirectorio (p. ej. `jogretoco88.github.io/inventario/`), abrí
   `vite.config.js` y poné `base: "/inventario/"`. Si va en la raíz del dominio,
   dejá `base: "./"`.
2. `npm run build`
3. Subí el contenido de `dist/` a la rama `gh-pages` (o usá tu flujo habitual).

## Instalar en el teléfono

Abrí la URL en Safari (iOS) o Chrome (Android) → menú → **Agregar a pantalla de inicio**.
Una vez instalada funciona sin conexión.

## Estructura

```
src/App.jsx     toda la lógica y la interfaz (un solo archivo)
src/main.jsx    punto de entrada
vite.config.js  configuración de Vite + PWA (manifest y service worker)
public/         íconos de la PWA
```
