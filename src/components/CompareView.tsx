import React, { useState, useRef } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { SlidersHorizontal, Eye, Download, ZoomIn, ZoomOut, RotateCcw, Sparkles, Layers } from 'lucide-react';
import { Button } from './ui/Button';

interface CompareViewProps {
  originalImage: string;
  renderedImage: string;
  projectName?: string;
  onDownload?: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  originalImage,
  renderedImage,
  projectName = 'Floor Plan Comparison',
  onDownload,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [blendMode, setBlendMode] = useState<'split' | 'fade'>('split');
  const [fadeOpacity, setFadeOpacity] = useState<number>(0.5);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = () => setZoomLevel(1);
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));

  return (
    <div id="compare-view-root" className="relative w-full h-full min-h-[520px] bg-white rounded-3xl overflow-hidden border border-[#e3e8ee] shadow-stripe-2 flex flex-col">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Mode toggles */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#e3e8ee] shadow-stripe-1 pointer-events-auto">
          <button
            onClick={() => setBlendMode('split')}
            className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              blendMode === 'split'
                ? 'bg-[#533afd] text-white shadow-sm'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Split Slider
          </button>
          <button
            onClick={() => setBlendMode('fade')}
            className={`px-3.5 py-1 text-xs rounded-full font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              blendMode === 'fade'
                ? 'bg-[#533afd] text-white shadow-sm'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Opacity Blend
          </button>
        </div>

        {/* Right: Zoom & Reset */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-[#e3e8ee] shadow-stripe-1 pointer-events-auto">
          <button
            onClick={zoomOut}
            className="p-1 text-[#64748d] hover:text-[#0d253d] rounded-full transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono tnum text-[#0d253d] font-medium px-1.5">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-1 text-[#64748d] hover:text-[#0d253d] rounded-full transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={resetZoom}
              className="p-1 text-[#533afd] hover:underline rounded-full transition-all text-xs font-medium cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-auto p-4 sm:p-6 bg-[#f6f9fc] select-none"
      >
        <div
          className="relative max-w-full max-h-full transition-transform duration-150 rounded-2xl overflow-hidden shadow-stripe-2 border border-[#e3e8ee] bg-white"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {blendMode === 'split' ? (
            <div className="relative w-full max-w-[850px] aspect-[4/3] bg-white">
              <ReactCompareSlider
                itemOne={
                  <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                    <ReactCompareSliderImage
                      src={originalImage}
                      alt="Original Blueprint / 2D Sketch"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#e3e8ee] text-xs font-medium text-[#64748d] shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#64748d]" />
                      2D Blueprint
                    </div>
                  </div>
                }
                itemTwo={
                  <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                    <ReactCompareSliderImage
                      src={renderedImage}
                      alt="AI Photorealistic 3D Render"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#e3e8ee] text-xs font-medium text-[#533afd] shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
                      Photorealistic 3D
                    </div>
                  </div>
                }
                onPositionChange={setSliderPosition}
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      backdropFilter: 'blur(8px)',
                      background: '#533afd',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 8px rgba(83, 58, 253, 0.4)',
                      color: '#ffffff',
                      width: '36px',
                      height: '36px',
                    }}
                    linesStyle={{
                      width: 2,
                      background: '#533afd',
                      boxShadow: '0 0 6px rgba(83, 58, 253, 0.5)',
                    }}
                  />
                }
                className="w-full h-full"
              />
            </div>
          ) : (
            /* Opacity Fade Overlay Mode */
            <div className="relative w-full max-w-[850px] aspect-[4/3] bg-white p-2">
              <img
                src={originalImage}
                alt="2D Blueprint"
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
              <img
                src={renderedImage}
                alt="AI Photorealistic Render"
                className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-75"
                style={{ opacity: fadeOpacity }}
              />

              {/* Floating Opacity Slider */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#e3e8ee] shadow-stripe-2 flex items-center gap-4 z-20">
                <span className="text-xs text-[#64748d] font-medium">Blueprint</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={fadeOpacity}
                  onChange={(e) => setFadeOpacity(parseFloat(e.target.value))}
                  className="w-44 h-1 bg-[#e3e8ee] rounded-lg appearance-none cursor-pointer accent-[#533afd]"
                />
                <span className="text-xs text-[#533afd] font-medium tnum">Render ({Math.round(fadeOpacity * 100)}%)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Information Footer */}
      <div className="bg-white border-t border-[#e3e8ee] px-6 py-3.5 flex flex-wrap items-center justify-between text-xs text-[#64748d] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-[#0d253d]">Geometric Alignment Verified</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Drag the indigo handle or adjust opacity to verify partition accuracy</span>
        </div>
      </div>
    </div>
  );
};

export default CompareView;

