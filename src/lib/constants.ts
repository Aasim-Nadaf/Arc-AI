export const ROOMIFY_RENDER_PROMPT = `TASK: Convert the input 2D floor plan into a **photorealistic, top-down 3D architectural render**.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) **TOP-DOWN ONLY**: Orthographic top-down view. No perspective tilt.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand-drawn look.
5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
- **Doors**: Convert door swing arcs into open doors, aligned to the plan.
- **Windows**: Convert thin perimeter lines into realistic glass windows.

FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
- Bed icon → realistic bed with duvet and pillows.
- Sofa icon → modern sectional or sofa.
- Dining table icon → table with chairs.
- Kitchen icon → counters with sink and stove.
- Bathroom icon → toilet, sink, and tub/shower.
- Office/study icon → desk, chair, and minimal shelving.

STYLE & LIGHTING:
- Lighting: bright, neutral daylight. High clarity and balanced contrast.
- Materials: realistic wood/tile floors, clean walls, subtle shadows.
- Finish: professional architectural visualization; no text, no watermarks, no logos.`;

export const STYLE_PRESETS = [
  {
    id: 'scandinavian',
    name: 'Nordic Modern',
    description: 'Light oak herringbone floors, crisp matte white walls, minimalist warmth',
    previewColor: '#e0d6c3',
    floorMaterial: 'light oak wood',
    wallTone: 'warm white'
  },
  {
    id: 'contemporary-luxury',
    name: 'Contemporary Luxury',
    description: 'Calacatta marble tiles, walnut accents, ambient warm recessed lighting',
    previewColor: '#d1c7bd',
    floorMaterial: 'marble porcelain',
    wallTone: 'soft taupe'
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    description: 'Polished microcement, blackened steel framing, exposed natural textures',
    previewColor: '#9ba0a8',
    floorMaterial: 'polished concrete',
    wallTone: 'charcoal & raw plaster'
  },
  {
    id: 'japanese-zen',
    name: 'Japandi Minimal',
    description: 'Tatami-inspired muted tones, ash timber, tranquil diffused sunlight',
    previewColor: '#c9bfa7',
    floorMaterial: 'natural blonde ash',
    wallTone: 'sand wash'
  }
];

export const APP_CONFIG = {
  appName: 'Perspective.ai',
  tagline: 'AI Architectural Visualization & 3D Spatial Engine',
  version: '2.4.0',
  defaultResolution: 1024,
  maxUploadSizeBytes: 15 * 1024 * 1024, // 15MB
};
