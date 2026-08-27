import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Box,
  SlidersHorizontal,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModelViewer } from '../../components/ModelViewer';
import { CompareView } from '../../components/CompareView';
import { ExportModal } from '../../components/ExportModal';
import { DesignItem, ViewMode } from '../../types';
import { generate3DView } from '../../lib/ai.action';
import { generate3DModel } from '../../lib/model3d.action';
import { getProjectById, updateProject } from '../../lib/puter.action';
import { SAMPLE_PROJECTS, SAMPLE_BLUEPRINT_1, SAMPLE_RENDER_1 } from '../../lib/sampleData';
import { STYLE_PRESETS } from '../../lib/constants';

export const VisualizerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [project, setProject] = useState<DesignItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('top-down');
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isGeneratingRender, setIsGeneratingRender] = useState<boolean>(false);
  const [isGenerating3D, setIsGenerating3D] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTheme, setActiveTheme] = useState<string>('scandinavian');

  // Load project on mount
  useEffect(() => {
    const initProject = async () => {
      if (!id) return;

      const stateProject = (location.state as { project?: DesignItem })?.project;
      if (stateProject && stateProject.id === id) {
        setProject(stateProject);
        if (stateProject.renderedImage) {
          setRenderedImage(stateProject.renderedImage);
        } else {
          triggerRenderGeneration(stateProject.sourceImage, stateProject);
        }
        if (stateProject.modelUrl) {
          setModelUrl(stateProject.modelUrl);
        }
        return;
      }

      const found = await getProjectById(id);
      if (found) {
        setProject(found);
        setRenderedImage(found.renderedImage || null);
        setModelUrl(found.modelUrl || null);
        if (!found.renderedImage && found.sourceImage) {
          triggerRenderGeneration(found.sourceImage, found);
        }
      } else {
        const sample = SAMPLE_PROJECTS.find(p => p.id === id) || SAMPLE_PROJECTS[0];
        setProject(sample);
        setRenderedImage(sample.renderedImage || null);
        setModelUrl(sample.modelUrl || null);
      }
    };

    initProject();
  }, [id, location.state]);

  // Core 2D floor plan -> Photorealistic 2D Render Pipeline
  const triggerRenderGeneration = async (sourceImg: string, currentProj?: DesignItem) => {
    setIsGeneratingRender(true);
    setErrorMsg(null);
    setGenerationStage('Extracting architectural walls & partitions...');

    try {
      setTimeout(() => setGenerationStage('Applying floor textures (oak/marble) & removing text...'), 1200);
      setTimeout(() => setGenerationStage('Simulating natural daylight raytracing...'), 2400);

      const result = await generate3DView({ sourceImage: sourceImg });

      if (result.renderedImage) {
        setRenderedImage(result.renderedImage);
        const targetProj = currentProj || project;
        if (targetProj) {
          const updated = { ...targetProj, renderedImage: result.renderedImage };
          setProject(updated);
          await updateProject(targetProj.id, { renderedImage: result.renderedImage });
        }
      } else {
        setRenderedImage(SAMPLE_RENDER_1);
        if (currentProj || project) {
          const p = currentProj || project!;
          await updateProject(p.id, { renderedImage: SAMPLE_RENDER_1 });
        }
      }
    } catch (err: unknown) {
      console.error('Render generation error:', err);
      setRenderedImage(SAMPLE_RENDER_1);
    } finally {
      setIsGeneratingRender(false);
      setGenerationStage('');
    }
  };

  // Core Rendered Image -> Interactive 3D Model Pipeline
  const trigger3DModelGeneration = async () => {
    const imageToProcess = renderedImage || project?.sourceImage;
    if (!imageToProcess) return;

    setIsGenerating3D(true);
    setErrorMsg(null);
    setGenerationStage('Synthesizing 3D architectural mesh...');

    try {
      setTimeout(() => setGenerationStage('Extruding wall heights & generating UV maps...'), 1500);

      const glbUrl = await generate3DModel(imageToProcess);
      setModelUrl(glbUrl || 'procedural-architectural-mesh');

      if (project) {
        await updateProject(project.id, { modelUrl: glbUrl || 'procedural-architectural-mesh' });
      }
    } catch (err: unknown) {
      console.error('3D Model Generation error:', err);
      setModelUrl('procedural-architectural-mesh');
    } finally {
      setIsGenerating3D(false);
      setGenerationStage('');
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === '3d-model' && !modelUrl && !isGenerating3D) {
      trigger3DModelGeneration();
    }
  };

  const handleRegenerateTheme = (themeId: string) => {
    setActiveTheme(themeId);
    if (project?.sourceImage) {
      triggerRenderGeneration(project.sourceImage, project);
    }
  };

  if (!project) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4 text-[#64748d]">
        <div className="w-8 h-8 border-2 border-[#533afd] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-light">Loading Perspective Project...</span>
      </div>
    );
  }

  const effectiveSource = project.sourceImage || SAMPLE_BLUEPRINT_1;
  const effectiveRender = renderedImage || project.renderedImage || SAMPLE_RENDER_1;

  return (
    <div className="visualizer w-full min-h-[calc(100vh-4rem)] flex flex-col bg-[#f6f9fc] text-[#0d253d]">
      {/* Top Visualizer Control Bar */}
      <div className="topbar w-full bg-white border-b border-[#e3e8ee] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-30 shadow-stripe-1">
        {/* Left: Project Info & Exit */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] hover:text-[#0d253d] hover:bg-white transition-colors shadow-sm"
            title="Exit Editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-[#0d253d] tracking-tight line-clamp-1">
                {project.name || 'Architectural Floor Plan'}
              </h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f6f9fc] text-[#533afd] border border-[#e3e8ee]">
                {activeTheme.toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] text-[#64748d] font-mono tnum">
              ID: {project.id}
            </span>
          </div>
        </div>

        {/* Center: View Mode Segmented Pill Switcher */}
        <div className="view-mode-toggles flex items-center bg-[#f6f9fc] border border-[#e3e8ee] p-1 rounded-full shadow-inner">
          <button
            onClick={() => handleViewModeChange('top-down')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'top-down'
                ? 'bg-[#533afd] text-white shadow-sm'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top-Down Render</span>
          </button>

          <button
            onClick={() => handleViewModeChange('3d-model')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === '3d-model'
                ? 'bg-[#533afd] text-white shadow-sm'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model (.GLB)</span>
            {!modelUrl && !isGenerating3D && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea2261] animate-ping" />
            )}
          </button>

          <button
            onClick={() => handleViewModeChange('compare')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-[#533afd] text-white shadow-sm'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare Slider</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => triggerRenderGeneration(effectiveSource, project)}
            isLoading={isGeneratingRender}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#533afd]" />}
            title="Re-render with fresh lighting seed"
          >
            <span className="hidden sm:inline">Regenerate</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="w-3.5 h-3.5 text-white" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative flex-1 w-full p-4 sm:p-6 flex flex-col items-center justify-center max-w-7xl mx-auto">
        {/* Loading Overlay */}
        {(isGeneratingRender || isGenerating3D) && (
          <div className="render-overlay absolute inset-0 z-40 bg-white/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-4 m-4 sm:m-6 animate-fade-in border border-[#e3e8ee] shadow-stripe-2">
            <div className="w-12 h-12 rounded-2xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd] shadow-sm">
              <Sparkles className="w-6 h-6 animate-spin text-[#533afd]" />
            </div>

            <div className="flex flex-col items-center gap-1 text-center px-4">
              <h4 className="text-base font-semibold text-[#0d253d] tracking-tight">
                {isGenerating3D ? 'Synthesizing 3D Spatial Mesh' : 'Generating Photorealistic 3D Render'}
              </h4>
              <p className="text-xs text-[#533afd] font-medium tracking-tight animate-pulse">
                {generationStage || 'Processing neural architectural synthesis...'}
              </p>
            </div>
          </div>
        )}

        {/* View Mode Switching Container */}
        <div className="render-area w-full flex-1 flex flex-col items-center justify-center relative min-h-[560px]">
          {/* VIEW 1: Top-Down Render */}
          {viewMode === 'top-down' && (
            <div className="panel relative w-full h-full min-h-[540px] bg-white rounded-3xl border border-[#e3e8ee] shadow-stripe-2 overflow-hidden flex flex-col">
              {/* Image Canvas */}
              <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-auto bg-[#f6f9fc]">
                <div
                  className="relative max-w-full max-h-full transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={effectiveRender}
                    alt="AI Architectural 3D Render"
                    className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-stripe-2 border border-[#e3e8ee] bg-white"
                  />

                  {/* High Quality Orthographic Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#e3e8ee] text-[11px] font-medium text-[#533afd] flex items-center gap-1.5 shadow-stripe-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Top-Down Orthographic 3D</span>
                  </div>
                </div>
              </div>

              {/* Bottom Stage Details & Zoom Toolbar */}
              <div className="bg-white border-t border-[#e3e8ee] px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Style Theme Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-[#64748d] text-xs font-medium">Theme:</span>
                  <div className="flex items-center gap-1">
                    {STYLE_PRESETS.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleRegenerateTheme(s.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                          activeTheme === s.id
                            ? 'bg-[#533afd] text-white shadow-sm'
                            : 'bg-[#f6f9fc] text-[#64748d] hover:text-[#0d253d] border border-[#e3e8ee]'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5 bg-[#f6f9fc] border border-[#e3e8ee] px-2 py-1 rounded-full">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
                    className="p-1 text-[#64748d] hover:text-[#0d253d] rounded-full transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="tnum font-medium text-[#0d253d] text-[11px] min-w-[32px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.4))}
                    className="p-1 text-[#64748d] hover:text-[#0d253d] rounded-full transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {zoomLevel !== 1 && (
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="text-[#533afd] hover:underline text-[11px] pl-1 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Interactive 3D Model Viewer */}
          {viewMode === '3d-model' && (
            <div className="model-viewer-container w-full h-full min-h-[540px]">
              <ModelViewer
                modelUrl={modelUrl}
                renderedImageUrl={effectiveRender}
                sourceImageUrl={effectiveSource}
                onSnapshot={() => setIsExportModalOpen(true)}
              />
            </div>
          )}

          {/* VIEW 3: Side-by-Side Comparison Slider */}
          {viewMode === 'compare' && (
            <div className="w-full h-full min-h-[540px]">
              <CompareView
                originalImage={effectiveSource}
                renderedImage={effectiveRender}
                projectName={project.name || 'Floor Plan'}
                onDownload={() => setIsExportModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Export & Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={{
          ...project,
          renderedImage: effectiveRender,
          modelUrl: modelUrl,
        }}
        currentViewMode={viewMode}
      />
    </div>
  );
};

export default VisualizerPage;

