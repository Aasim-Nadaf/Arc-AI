import { DesignItem } from '../types';

// High-resolution architectural blueprint sample 1: Modern 2-Bedroom Urban Penthouse
export const SAMPLE_BLUEPRINT_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="1000" height="800">
  <rect width="1000" height="800" fill="%230f172a" />
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="%231e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1000" height="800" fill="url(%23grid)" />
  
  <!-- Outer Walls -->
  <rect x="80" y="80" width="840" height="640" fill="none" stroke="%2338bdf8" stroke-width="12" stroke-linejoin="miter"/>
  
  <!-- Master Suite Section -->
  <line x1="80" y1="380" x2="520" y2="380" stroke="%2338bdf8" stroke-width="8" />
  <line x1="520" y1="80" x2="520" y2="480" stroke="%2338bdf8" stroke-width="8" />
  
  <!-- Bathroom Partition -->
  <line x1="80" y1="240" x2="280" y2="240" stroke="%2338bdf8" stroke-width="6" />
  <line x1="280" y1="80" x2="280" y2="240" stroke="%2338bdf8" stroke-width="6" />
  
  <!-- Kitchen & Dining Partition -->
  <line x1="520" y1="480" x2="920" y2="480" stroke="%2338bdf8" stroke-width="8" />
  <line x1="680" y1="480" x2="680" y2="720" stroke="%2338bdf8" stroke-width="6" />

  <!-- Master Bedroom Bed -->
  <rect x="140" y="440" width="160" height="180" fill="%231e293b" stroke="%2394a3b8" stroke-width="3" rx="8"/>
  <rect x="160" y="450" width="55" height="40" fill="%23334155" stroke="%23cbd5e1" stroke-width="1" rx="4"/>
  <rect x="225" y="450" width="55" height="40" fill="%23334155" stroke="%23cbd5e1" stroke-width="1" rx="4"/>
  <rect x="100" y="450" width="30" height="30" fill="%231e293b" stroke="%2394a3b8" stroke-width="2"/>
  <rect x="310" y="450" width="30" height="30" fill="%231e293b" stroke="%2394a3b8" stroke-width="2"/>

  <!-- Living Room Sofa -->
  <path d="M 560 140 L 760 140 L 760 260 L 710 260 L 710 190 L 560 190 Z" fill="%231e293b" stroke="%2394a3b8" stroke-width="3"/>
  <rect x="600" y="210" width="80" height="50" fill="%231e293b" stroke="%2394a3b8" stroke-width="2" rx="4"/>
  <line x1="840" y1="140" x2="840" y2="300" stroke="%2394a3b8" stroke-width="4" stroke-dasharray="8,6"/>

  <!-- Dining Table with 6 Chairs -->
  <rect x="740" y="540" width="130" height="70" fill="%231e293b" stroke="%2394a3b8" stroke-width="2" rx="6"/>
  <circle cx="765" cy="520" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>
  <circle cx="805" cy="520" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>
  <circle cx="845" cy="520" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>
  <circle cx="765" cy="630" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>
  <circle cx="805" cy="630" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>
  <circle cx="845" cy="630" r="12" fill="%23334155" stroke="%2394a3b8" stroke-width="1.5"/>

  <!-- Kitchen Island & Counters -->
  <rect x="540" y="520" width="110" height="160" fill="%231e293b" stroke="%2394a3b8" stroke-width="2"/>
  <circle cx="595" cy="560" r="18" fill="none" stroke="%2360a5fa" stroke-width="2"/>
  <rect x="560" y="610" width="70" height="40" fill="none" stroke="%23cbd5e1" stroke-width="2"/>

  <!-- Bathroom Fixtures -->
  <rect x="100" y="100" width="70" height="120" fill="%231e293b" stroke="%2360a5fa" stroke-width="2" rx="10"/>
  <circle cx="230" cy="130" r="22" fill="%23334155" stroke="%2394a3b8" stroke-width="2"/>
  <ellipse cx="230" cy="190" rx="16" ry="24" fill="%231e293b" stroke="%23cbd5e1" stroke-width="2"/>

  <!-- Architectural Door Swings -->
  <path d="M 460 380 A 60 60 0 0 1 520 440" fill="none" stroke="%2338bdf8" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="460" y1="380" x2="520" y2="380" stroke="%2338bdf8" stroke-width="4"/>
  
  <path d="M 280 200 A 40 40 0 0 1 240 240" fill="none" stroke="%2338bdf8" stroke-width="2" stroke-dasharray="4,4"/>
  <line x1="280" y1="200" x2="280" y2="240" stroke="%2338bdf8" stroke-width="4"/>

  <!-- Room Labels & Dimensions (To test AI prompt removal & matching) -->
  <text x="210" y="320" fill="%2364748b" font-family="monospace" font-size="18" text-anchor="middle">PRIMARY BEDROOM</text>
  <text x="210" y="345" fill="%23475569" font-family="monospace" font-size="14" text-anchor="middle">14' 6" x 12' 0"</text>

  <text x="700" y="105" fill="%2364748b" font-family="monospace" font-size="18" text-anchor="middle">GREAT ROOM / LIVING</text>
  <text x="700" y="125" fill="%23475569" font-family="monospace" font-size="14" text-anchor="middle">22' 0" x 18' 4"</text>

  <text x="600" y="470" fill="%2364748b" font-family="monospace" font-size="16" text-anchor="middle">CHEF KITCHEN</text>
  <text x="800" y="505" fill="%2364748b" font-family="monospace" font-size="16" text-anchor="middle">DINING</text>
  <text x="180" y="95" fill="%2364748b" font-family="monospace" font-size="16" text-anchor="middle">BATH</text>
</svg>`;

// High-detail Photorealistic Render Sample (Top-Down 3D) for Penthouse
export const SAMPLE_RENDER_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="1000" height="800">
  <defs>
    <radialGradient id="sunlight" cx="30%" cy="20%" r="90%">
      <stop offset="0%" stop-color="%23fffbeb" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="%230f172a" stop-opacity="0.95"/>
    </radialGradient>
    <pattern id="oakFlooring" width="80" height="24" patternUnits="userSpaceOnUse">
      <rect width="80" height="24" fill="%23c8a27a" />
      <line x1="0" y1="0" x2="80" y2="0" stroke="%23b0885e" stroke-width="1.5"/>
      <line x1="40" y1="0" x2="40" y2="24" stroke="%23b0885e" stroke-width="1.5"/>
      <line x1="0" y1="12" x2="80" y2="12" stroke="%23b0885e" stroke-width="1.5"/>
      <line x1="20" y1="12" x2="20" y2="24" stroke="%23b0885e" stroke-width="1.5"/>
      <line x1="60" y1="12" x2="60" y2="24" stroke="%23b0885e" stroke-width="1.5"/>
    </pattern>
    <pattern id="marbleTile" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="%23e2e8f0" />
      <path d="M 0 30 Q 30 10 60 40 M 10 0 Q 40 30 20 60" fill="none" stroke="%23cbd5e1" stroke-width="1.5"/>
      <rect width="60" height="60" fill="none" stroke="%2394a3b8" stroke-width="0.8"/>
    </pattern>
    <filter id="wallShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="8" dy="12" stdDeviation="10" flood-color="%23020617" flood-opacity="0.85"/>
    </filter>
    <filter id="furnitureShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="6" stdDeviation="5" flood-color="%230f172a" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Base Floor Finish -->
  <rect width="1000" height="800" fill="%230f172a" />
  
  <!-- Living & Master Wood Flooring -->
  <rect x="80" y="80" width="840" height="640" fill="url(%23oakFlooring)" />
  
  <!-- Marble Bath & Kitchen Flooring -->
  <rect x="80" y="80" width="200" height="160" fill="url(%23marbleTile)" />
  <rect x="520" y="480" width="160" height="240" fill="url(%23marbleTile)" />

  <!-- Lighting Ambient Overlay -->
  <rect x="80" y="80" width="840" height="640" fill="url(%23sunlight)" />

  <!-- Bed & Linens with Realistic Shading -->
  <g filter="url(%23furnitureShadow)">
    <rect x="140" y="440" width="160" height="180" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2" rx="10"/>
    <rect x="140" y="490" width="160" height="130" fill="%233b82f6" rx="8" opacity="0.85"/>
    <rect x="160" y="450" width="55" height="35" fill="%23ffffff" rx="6" stroke="%23e2e8f0"/>
    <rect x="225" y="450" width="55" height="35" fill="%23ffffff" rx="6" stroke="%23e2e8f0"/>
    <!-- Nightstands with Lamps -->
    <rect x="95" y="450" width="35" height="35" fill="%2378350f" rx="4"/>
    <circle cx="112" cy="467" r="8" fill="%23fef08a" opacity="0.9"/>
    <rect x="310" y="450" width="35" height="35" fill="%2378350f" rx="4"/>
    <circle cx="327" cy="467" r="8" fill="%23fef08a" opacity="0.9"/>
  </g>

  <!-- Luxury Sectional Sofa & Coffee Table -->
  <g filter="url(%23furnitureShadow)">
    <path d="M 560 140 L 760 140 L 760 270 L 700 270 L 700 195 L 560 195 Z" fill="%23334155" rx="8"/>
    <!-- Cushions -->
    <rect x="565" y="145" width="60" height="45" fill="%23475569" rx="4"/>
    <rect x="630" y="145" width="60" height="45" fill="%23475569" rx="4"/>
    <rect x="695" y="145" width="60" height="45" fill="%23475569" rx="4"/>
    <rect x="705" y="195" width="50" height="65" fill="%23475569" rx="4"/>
    <!-- Glass & Walnut Coffee Table -->
    <rect x="590" y="210" width="95" height="55" fill="%230284c7" fill-opacity="0.35" stroke="%2338bdf8" stroke-width="2" rx="6"/>
  </g>

  <!-- Chef Kitchen Island with Granite Top -->
  <g filter="url(%23furnitureShadow)">
    <rect x="540" y="520" width="115" height="160" fill="%230f172a" stroke="%23334155" stroke-width="2" rx="6"/>
    <rect x="545" y="525" width="105" height="150" fill="%231e293b" rx="4"/>
    <ellipse cx="597" cy="565" rx="20" ry="16" fill="%2394a3b8" stroke="%23e2e8f0" stroke-width="2"/>
    <rect x="560" y="615" width="75" height="45" fill="%23020617" stroke="%23475569" stroke-width="1.5" rx="3"/>
    <circle cx="580" cy="630" r="6" fill="%23ef4444" opacity="0.8"/>
    <circle cx="615" cy="630" r="6" fill="%23ef4444" opacity="0.8"/>
    <circle cx="580" cy="645" r="6" fill="%23ef4444" opacity="0.8"/>
    <circle cx="615" cy="645" r="6" fill="%23ef4444" opacity="0.8"/>
  </g>

  <!-- Dining Table & Designer Chairs -->
  <g filter="url(%23furnitureShadow)">
    <rect x="740" y="535" width="135" height="75" fill="%23451a03" stroke="%2378350f" stroke-width="2" rx="8"/>
    <circle cx="765" cy="515" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
    <circle cx="807" cy="515" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
    <circle cx="850" cy="515" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
    <circle cx="765" cy="630" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
    <circle cx="807" cy="630" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
    <circle cx="850" cy="630" r="14" fill="%2364748b" stroke="%23cbd5e1" stroke-width="1.5"/>
  </g>

  <!-- Luxury Bathroom Details -->
  <g filter="url(%23furnitureShadow)">
    <!-- Freestanding Oval Soaking Tub -->
    <ellipse cx="135" cy="160" rx="35" ry="55" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="3"/>
    <ellipse cx="135" cy="160" rx="26" ry="42" fill="%23bae6fd" opacity="0.6"/>
    <!-- Vanity with Double Basin -->
    <rect x="200" y="95" width="65" height="130" fill="%23334155" rx="4"/>
    <ellipse cx="232" cy="130" rx="16" ry="12" fill="%23ffffff"/>
    <ellipse cx="232" cy="185" rx="16" ry="12" fill="%23ffffff"/>
  </g>

  <!-- 3D Extruded Architectural Walls with Bevel & Shadow (Zero Text / Clean Render) -->
  <g filter="url(%23wallShadow)">
    <!-- Outer Walls (Thick Extruded) -->
    <path d="M 70 70 L 930 70 L 930 730 L 70 730 Z M 90 90 L 90 710 L 910 710 L 910 90 Z" fill="%23e2e8f0" fill-rule="evenodd"/>
    
    <!-- Interior Partitions -->
    <rect x="80" y="375" width="445" height="12" fill="%23cbd5e1"/>
    <rect x="515" y="80" width="12" height="405" fill="%23cbd5e1"/>
    <rect x="80" y="235" width="205" height="10" fill="%23cbd5e1"/>
    <rect x="275" y="80" width="10" height="165" fill="%23cbd5e1"/>
    <rect x="520" y="475" width="400" height="12" fill="%23cbd5e1"/>
    <rect x="675" y="480" width="10" height="240" fill="%23cbd5e1"/>
    
    <!-- Wall Tops (Accent Crisp Line) -->
    <path d="M 70 70 L 930 70 L 930 730 L 70 730 Z M 85 85 L 85 715 L 915 715 L 915 85 Z" fill="%23f8fafc" fill-rule="evenodd"/>
  </g>

  <!-- Door Openings / Clean Arcs -->
  <rect x="460" y="372" width="55" height="18" fill="url(%23oakFlooring)"/>
  <rect x="235" y="232" width="45" height="16" fill="url(%23oakFlooring)"/>
</svg>`;

export const SAMPLE_PROJECTS: DesignItem[] = [
  {
    id: 'sample-penthouse',
    name: 'Metropolitan Penthouse Residence',
    sourceImage: SAMPLE_BLUEPRINT_1,
    renderedImage: SAMPLE_RENDER_1,
    modelUrl: null, // Procedural 3D model engine or GLB
    timestamp: Date.now() - 1000 * 60 * 45,
    ownerId: 'perspective-curator',
    sharedBy: 'Perspective Studio',
    sharedAt: 'Featured',
    isPublic: true,
    notes: '2-Bedroom luxury floor plan transformed with Nordic daylighting and wood floor textures.',
    tags: ['Penthouse', 'Nordic Modern', '2-Bedroom'],
    stats: {
      roomsDetected: 5,
      estimatedAreaSqFt: 1850,
      style: 'Nordic Modern'
    }
  },
  {
    id: 'sample-studio-loft',
    name: 'Tribeca Architectural Studio Loft',
    sourceImage: SAMPLE_BLUEPRINT_1,
    renderedImage: SAMPLE_RENDER_1,
    modelUrl: null,
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    ownerId: 'perspective-curator',
    sharedBy: 'Elena Rostova',
    sharedAt: '2h ago',
    isPublic: true,
    notes: 'Open-concept studio blueprint with polished microcement and minimalist zoning.',
    tags: ['Industrial Loft', 'Studio', 'Open Concept'],
    stats: {
      roomsDetected: 3,
      estimatedAreaSqFt: 1100,
      style: 'Industrial Loft'
    }
  },
  {
    id: 'sample-villa',
    name: 'Kyoto Minimalist Courtyard Villa',
    sourceImage: SAMPLE_BLUEPRINT_1,
    renderedImage: SAMPLE_RENDER_1,
    modelUrl: null,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    ownerId: 'perspective-curator',
    sharedBy: 'Kenzo ArchiLab',
    sharedAt: 'Yesterday',
    isPublic: true,
    notes: 'Japandi aesthetic floor plan with tatami room extrusion and central lightwell.',
    tags: ['Japandi', 'Villa', 'Courtyard'],
    stats: {
      roomsDetected: 6,
      estimatedAreaSqFt: 2400,
      style: 'Japandi Minimal'
    }
  }
];
