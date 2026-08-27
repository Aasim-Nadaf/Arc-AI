import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Moon,
  Layers,
  Maximize,
  Sparkles,
  Camera,
  Compass,
  Grid3X3,
  Box
} from 'lucide-react';
import { Button } from './ui/Button';

interface ModelViewerProps {
  modelUrl?: string | null;
  renderedImageUrl?: string | null;
  sourceImageUrl?: string | null;
  onSnapshot?: () => void;
}

// GLTF model loader component with error boundary
const GLTFModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

// Procedural Architectural 3D Structure built from Floor Plan cues
const ProceduralFloorPlan3D: React.FC<{
  renderedImageUrl?: string | null;
  wireframe?: boolean;
  wallHeight?: number;
  showFurniture?: boolean;
}> = ({ renderedImageUrl, wireframe = false, wallHeight = 1.2, showFurniture = true }) => {
  const floorTexture = useMemo(() => {
    if (!renderedImageUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(renderedImageUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [renderedImageUrl]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // subtle idle breathing movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Concrete Foundation Slab */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[10.4, 0.2, 8.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Main Floor Surface with Render Texture Mapping */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        {floorTexture ? (
          <meshStandardMaterial map={floorTexture} roughness={0.4} metalness={0.1} />
        ) : (
          <meshStandardMaterial color="#c29b6f" roughness={0.3} metalness={0.05} />
        )}
      </mesh>

      {/* Outer Perimeter Walls */}
      {/* North Wall */}
      <mesh position={[0, wallHeight / 2, -4]} castShadow receiveShadow>
        <boxGeometry args={[10, wallHeight, 0.2]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* South Wall */}
      <mesh position={[0, wallHeight / 2, 4]} castShadow receiveShadow>
        <boxGeometry args={[10, wallHeight, 0.2]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* West Wall */}
      <mesh position={[-5, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, wallHeight, 8]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
      {/* East Wall */}
      <mesh position={[5, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, wallHeight, 8]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Interior Partition Wall 1 (Dividing Bedroom from Great Room) */}
      <mesh position={[-0.2, wallHeight / 2, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.15, wallHeight, 5]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* Interior Partition Wall 2 (Dividing Kitchen/Dining) */}
      <mesh position={[2.5, wallHeight / 2, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[5, wallHeight, 0.15]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* Interior Bathroom Enclosure */}
      <mesh position={[-2.8, wallHeight / 2, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[4.2, wallHeight, 0.15]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} wireframe={wireframe} />
      </mesh>

      {/* 3D Furniture Elements */}
      {showFurniture && (
        <group position={[0, 0, 0]}>
          {/* Master Bed */}
          <group position={[-2.8, 0.3, 1.5]}>
            {/* Bed Frame */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[2.2, 0.35, 2.4]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
            {/* Mattress */}
            <mesh castShadow position={[0, 0.22, 0.1]}>
              <boxGeometry args={[2.0, 0.3, 2.2]} />
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </mesh>
            {/* Duvet / Blanket */}
            <mesh castShadow position={[0, 0.3, 0.4]}>
              <boxGeometry args={[2.02, 0.16, 1.5]} />
              <meshStandardMaterial color="#2563eb" roughness={0.8} />
            </mesh>
            {/* Pillows */}
            <mesh castShadow position={[-0.5, 0.4, -0.7]}>
              <boxGeometry args={[0.7, 0.12, 0.5]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh castShadow position={[0.5, 0.4, -0.7]}>
              <boxGeometry args={[0.7, 0.12, 0.5]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          </group>

          {/* Living Room Sectional Sofa */}
          <group position={[2.4, 0.25, -2]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[2.8, 0.35, 1.2]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[1, 0, 0.8]}>
              <boxGeometry args={[0.8, 0.35, 1.6]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {/* Coffee Table */}
            <mesh castShadow receiveShadow position={[0, 0, 1]}>
              <boxGeometry args={[1.4, 0.22, 0.8]} />
              <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} opacity={0.85} transparent />
            </mesh>
          </group>

          {/* Dining Table & Chairs */}
          <group position={[2.6, 0.4, 2.2]}>
            {/* Table Top */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[2.2, 0.08, 1.2]} />
              <meshStandardMaterial color="#451a03" roughness={0.3} />
            </mesh>
            {/* Table Legs */}
            <mesh castShadow position={[-0.9, -0.2, -0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh castShadow position={[0.9, -0.2, -0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh castShadow position={[-0.9, -0.2, 0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color="#171717" />
            </mesh>
            <mesh castShadow position={[0.9, -0.2, 0.4]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4]} />
              <meshStandardMaterial color="#171717" />
            </mesh>
          </group>

          {/* Kitchen Island Counter */}
          <group position={[0.5, 0.45, 2.2]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 0.9, 2.2]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            {/* Granite Top */}
            <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
              <boxGeometry args={[1.5, 0.05, 2.3]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.1} />
            </mesh>
          </group>

          {/* Bathroom Bathtub */}
          <group position={[-3.8, 0.35, -2.8]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  renderedImageUrl,
  onSnapshot
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'city' | 'sunset' | 'dawn' | 'night'>('city');
  const [wallHeight, setWallHeight] = useState(1.2);
  const [showGrid, setShowGrid] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [cameraView, setCameraView] = useState<'isometric' | 'top' | 'front'>('isometric');

  const controlsRef = useRef<any>(null);

  const setView = (view: 'isometric' | 'top' | 'front') => {
    setCameraView(view);
    if (!controlsRef.current) return;
    if (view === 'isometric') {
      controlsRef.current.object.position.set(7, 8, 9);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'top') {
      controlsRef.current.object.position.set(0, 14, 0.001);
      controlsRef.current.target.set(0, 0, 0);
    } else if (view === 'front') {
      controlsRef.current.object.position.set(0, 2, 10);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  };

  const isRealGLTF = modelUrl && modelUrl.endsWith('.glb');

  return (
    <div id="model-viewer-root" className="relative w-full h-full min-h-[520px] bg-[#070714] rounded-3xl overflow-hidden border border-[#e3e8ee] shadow-stripe-2 flex flex-col">
      {/* 3D Canvas Viewport */}
      <div className="relative flex-1 w-full h-full">
        <Canvas
          shadows
          camera={{ position: [7, 8, 9], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={lightingPreset === 'night' ? 0.2 : 0.6} />
          
          <directionalLight
            position={[10, 15, 8]}
            intensity={lightingPreset === 'night' ? 0.4 : 1.4}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={30}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <directionalLight
            position={[-10, 8, -8]}
            intensity={lightingPreset === 'night' ? 0.1 : 0.4}
            color="#93c5fd"
          />

          {lightingPreset !== 'night' && <Environment preset={lightingPreset} />}

          {/* Model Content */}
          <Suspense
            fallback={
              <Html center>
                <div className="flex flex-col items-center gap-3 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-[#e3e8ee] text-[#0d253d] shadow-stripe-2">
                  <div className="w-7 h-7 border-2 border-[#533afd] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium tracking-tight">Compiling 3D Spatial Geometry...</span>
                </div>
              </Html>
            }
          >
            <Center>
              {isRealGLTF ? (
                <GLTFModel url={modelUrl} />
              ) : (
                <ProceduralFloorPlan3D
                  renderedImageUrl={renderedImageUrl}
                  wireframe={wireframe}
                  wallHeight={wallHeight}
                  showFurniture={showFurniture}
                />
              )}
            </Center>
          </Suspense>

          {/* Ground Grid */}
          {showGrid && (
            <Grid
              position={[0, -0.21, 0]}
              args={[30, 30]}
              cellSize={1}
              cellThickness={1}
              cellColor="#1e293b"
              sectionSize={5}
              sectionThickness={1.5}
              sectionColor="#334155"
              fadeDistance={25}
              fadeStrength={1.5}
            />
          )}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            enableZoom={true}
            minDistance={3}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2 - 0.05} // Prevent clipping under ground
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
          />
        </Canvas>

        {/* Top-Right Spatial Overlay HUD */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <div className="bg-white/90 backdrop-blur-md border border-[#e3e8ee] p-1.5 rounded-2xl shadow-stripe-1 flex flex-col gap-1 text-[#0d253d]">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                autoRotate ? 'bg-[#533afd] text-white shadow-sm' : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
              <span className="hidden sm:inline">Auto-Rotate</span>
            </button>

            <button
              onClick={() => setWireframe(!wireframe)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                wireframe ? 'bg-[#533afd] text-white shadow-sm' : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
              }`}
              title="Toggle Wireframe Blueprint Mode"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                showGrid ? 'bg-[#533afd] text-white shadow-sm' : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
              }`}
              title="Toggle Architectural Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => setShowFurniture(!showFurniture)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                showFurniture ? 'bg-[#533afd] text-white shadow-sm' : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
              }`}
              title="Toggle 3D Furniture Items"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fixtures</span>
            </button>
          </div>
        </div>

        {/* Top-Left Camera View Presets */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-[#e3e8ee] shadow-stripe-1">
          <span className="text-[11px] text-[#64748d] px-2.5 font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#533afd]" /> View:
          </span>
          <button
            onClick={() => setView('isometric')}
            className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
              cameraView === 'isometric' ? 'bg-[#533afd] text-white font-medium shadow-sm' : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setView('top')}
            className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
              cameraView === 'top' ? 'bg-[#533afd] text-white font-medium shadow-sm' : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Top-Down
          </button>
          <button
            onClick={() => setView('front')}
            className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer ${
              cameraView === 'front' ? 'bg-[#533afd] text-white font-medium shadow-sm' : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            Elevation
          </button>
        </div>

        {/* Bottom Interactive Toolbar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-3 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#e3e8ee] shadow-stripe-2 max-w-[95%]">
          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1 border-r border-[#e3e8ee] pr-3 mr-1">
            <span className="text-[11px] text-[#64748d] mr-1 flex items-center gap-1 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Light:
            </span>
            {(['city', 'sunset', 'dawn', 'night'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setLightingPreset(preset)}
                className={`px-2.5 py-0.5 text-[11px] capitalize rounded-full transition-all cursor-pointer ${
                  lightingPreset === preset
                    ? 'bg-[#533afd] text-white font-medium'
                    : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Wall Height Slider (Extrusion Height) */}
          <div className="flex items-center gap-2 border-r border-[#e3e8ee] pr-3 mr-1">
            <span className="text-[11px] text-[#64748d] font-medium">Wall Height:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={wallHeight}
              onChange={(e) => setWallHeight(parseFloat(e.target.value))}
              className="w-20 h-1 bg-[#e3e8ee] rounded-lg appearance-none cursor-pointer accent-[#533afd]"
            />
            <span className="text-[11px] font-mono tnum text-[#0d253d] min-w-[28px] font-medium">{wallHeight}m</span>
          </div>

          {/* Snapshot Trigger */}
          {onSnapshot && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onSnapshot}
              leftIcon={<Camera className="w-3.5 h-3.5 text-[#533afd]" />}
              className="text-xs"
            >
              Snapshot
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;
