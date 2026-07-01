# LU5CTW RF Lab

Laboratorio técnico de radiofrecuencia para radioaficionados y experimentadores RF.

**Distintiva:** LU5CTW

Sitio estático (HTML + CSS + JavaScript) diseñado para publicarse en **GitHub Pages**.

## Filosofía

> Las fórmulas utilizadas muestran siempre el valor físico exacto. Los valores del Modo Construcción son recomendaciones prácticas para facilitar el ajuste con instrumental como NanoVNA.

Primero la física, después la experiencia de taller.

## Herramientas

| Herramienta | Estado |
|---|---|
| RF Transmission Line Calculator | Disponible |
| NanoVNA Toolkit | Próximamente |
| Smith Chart Explorer | Próximamente |
| Antenna Designer | Próximamente |
| Balun Calculator | Próximamente |
| Coax Loss Calculator | Próximamente |
| Link Budget | Próximamente |
| ADS-B Tools | Próximamente |
| Meshtastic Tools | Próximamente |
| SDR Tools | Próximamente |
| RF Cheat Sheets | Próximamente |

## Desarrollo local

No requiere build ni dependencias. Abrir con cualquier servidor HTTP estático:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Luego visitar `http://localhost:8080`.

## Publicación en GitHub Pages

1. Crear un repositorio en GitHub (ej. `lu5ctw-rf-lab`).
2. Subir el contenido de esta carpeta.
3. En **Settings → Pages**, seleccionar la rama `main` y carpeta `/ (root)`.
4. El sitio estará disponible en `https://<usuario>.github.io/<repo>/`.

## Arquitectura

```
PMT_LU5CTW/
├── index.html                  # Home
├── tools/
│   └── transmission-line/      # Módulo 1
├── css/                        # Estilos compartidos
├── js/
│   ├── core/                   # Constantes, cables, presets, formato
│   ├── components/             # Modal "¿Qué significa?"
│   └── modules/                # Un directorio por herramienta
├── sw.js                       # Service Worker (offline)
└── manifest.json               # PWA manifest
```

Cada nueva herramienta se agrega como un módulo independiente en `tools/` y `js/modules/`, registrándola en `js/core/tools-registry.js`.

## Licencia

MIT
