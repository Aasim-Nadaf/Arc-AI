import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Box, SlidersHorizontal, ArrowRight, Eye, Layers, Compass, CheckCircle2, Terminal } from 'lucide-react';
import { Upload } from '../../components/Upload';
import { ProjectCard } from '../../components/ProjectCard';
import { Button } from '../../components/ui/Button';
import { DesignItem } from '../../types';
import { getAllProjects, deleteProject } from '../../lib/puter.action';
import { generateId } from '../../lib/utils';
import { SAMPLE_BLUEPRINT_1, SAMPLE_RENDER_1 } from '../../lib/sampleData';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  const handleUploadComplete = (imageDataUrl: string, projectName: string, stylePreset: string) => {
    const newId = generateId();
    const newProject: DesignItem = {
      id: newId,
      name: projectName,
      sourceImage: imageDataUrl,
      renderedImage: null,
      modelUrl: null,
      timestamp: Date.now(),
      isPublic: false,
      notes: `Generated using ${stylePreset} architectural theme.`,
      stats: {
        style: stylePreset,
        roomsDetected: 4,
        estimatedAreaSqFt: 1650,
      }
    };

    navigate(`/visualizer/${newId}`, {
      state: {
        project: newProject,
        autoGenerate: true,
      },
    });
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Stripe Gradient Mesh Hero Section */}
      <section className="relative w-full stripe-mesh-bg pt-12 pb-16 px-4 sm:px-6 flex flex-col items-center">
        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#e3e8ee] text-[#533afd] text-xs font-medium shadow-stripe-1">
            <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
            <span>AI-Powered Architectural Visualization</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-light text-[#0d253d] tracking-[-1.4px] leading-[1.1] max-w-4xl">
            Transform 2D floor plans into <span className="text-[#533afd] font-normal">photorealistic renders</span> & interactive 3D
          </h1>

          <p className="text-base sm:text-lg text-[#64748d] max-w-2xl font-light leading-relaxed">
            Upload blueprints, hand sketches, or CAD layouts. Perspective.ai removes text annotations, accurately matches wall geometry, textures hardwood and marble floors, and synthesizes 3D spatial models in seconds.
          </p>

          {/* Primary Upload Module */}
          <div className="w-full mt-4">
            <Upload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      {/* Stripe Faux Dashboard / Product UI Mockup (Deep Navy Chrome) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-[#0d253d] border border-[#1c1e54] shadow-stripe-dark overflow-hidden text-white flex flex-col">
          {/* Top Bar Window Chrome */}
          <div className="bg-[#1c1e54]/80 border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ea2261]/80" />
              <span className="w-3 h-3 rounded-full bg-[#f99c67]/80" />
              <span className="w-3 h-3 rounded-full bg-[#533afd]/80" />
              <span className="ml-3 text-xs font-mono text-slate-300">
                perspective-neural-engine://spatial-pipeline.mesh
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono tnum">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Pipeline Active
              </span>
              <span>Latency: 1.8s</span>
            </div>
          </div>

          {/* Mockup Body: Split 2D to 3D Neural View */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 p-6 gap-6">
            {/* Left: Input Blueprint Vector Analysis */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono flex items-center gap-1.5 text-cyan-400">
                  <Compass className="w-3.5 h-3.5" /> 1. Vector Blueprint Extraction
                </span>
                <span className="text-[11px] text-slate-400 font-mono">1024 x 1024</span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl bg-[#070714] border border-white/10 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={SAMPLE_BLUEPRINT_1}
                  alt="2D Input Blueprint"
                  className="w-full h-full object-contain filter invert hue-rotate-180 opacity-80"
                />
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  Walls Extruded: 100% | 4 Rooms
                </div>
              </div>
            </div>

            {/* Right: Photorealistic Top-Down 3D Render Output */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono flex items-center gap-1.5 text-[#533afd]">
                  <Sparkles className="w-3.5 h-3.5 text-[#533afd]" /> 2. Neural Daylighting & Materials
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Top-Down Raytraced</span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl bg-[#070714] border border-white/10 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={SAMPLE_RENDER_1}
                  alt="Photorealistic 3D Render"
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute bottom-3 right-3 bg-[#533afd]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white shadow-md">
                  Oak Parquet + Marble Finish
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights Band (Canvas-Soft) */}
      <section className="w-full bg-[#f6f9fc] border-y border-[#e3e8ee] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              Designed for modern architects, developers, and real estate
            </h2>
            <p className="text-sm text-[#64748d] font-light">
              Accelerate your workflow from rough blueprints to interactive 3D spatial presentations in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#e3e8ee] shadow-stripe-1 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd]">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0d253d]">1. Photorealistic 2D Render</h3>
              <p className="text-xs text-[#64748d] leading-relaxed font-light">
                Converts black-and-white blueprint lines into top-down orthographic visuals with realistic lighting, natural sun cast shadows, and clean furniture fixtures.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e3e8ee] shadow-stripe-1 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ea2261]/10 border border-[#ea2261]/20 flex items-center justify-center text-[#ea2261]">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0d253d]">2. Interactive 3D Mesh (.GLB)</h3>
              <p className="text-xs text-[#64748d] leading-relaxed font-light">
                Generates interactive 3D geometry with 360° orbit rotation, adjustable extrusion wall heights, wireframe blueprint overlays, and GLB export.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e3e8ee] shadow-stripe-1 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd]">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0d253d]">3. Geometric Comparison Slider</h3>
              <p className="text-xs text-[#64748d] leading-relaxed font-light">
                Inspect CAD accuracy with interactive split sliders and opacity overlays to verify doorway dimensions, room boundaries, and scale consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Gallery */}
      {projects.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0d253d] tracking-tight">Recent Architectural Projects</h2>
              <p className="text-xs text-[#64748d]">Saved floor plan designs and recent visualizations</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/projects')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All ({projects.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

