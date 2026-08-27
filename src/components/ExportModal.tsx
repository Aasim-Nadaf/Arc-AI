import React, { useState } from 'react';
import { X, Download, FileCode, Sparkles, Check, Share2, Copy, Printer, Image, Box } from 'lucide-react';
import { Button } from './ui/Button';
import { downloadFile } from '../lib/utils';
import { DesignItem } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: DesignItem;
  currentViewMode: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  currentViewMode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadRender = () => {
    if (project.renderedImage) {
      downloadFile(project.renderedImage, `${project.name || 'floorplan'}_3D_render.png`);
    }
  };

  const handleDownloadOriginal = () => {
    if (project.sourceImage) {
      downloadFile(project.sourceImage, `${project.name || 'floorplan'}_blueprint.png`);
    }
  };

  const handleDownloadGLB = () => {
    if (project.modelUrl && project.modelUrl.endsWith('.glb')) {
      downloadFile(project.modelUrl, `${project.name || 'model'}_spatial.glb`);
    } else {
      // Create lightweight architectural schema GLB or JSON package
      const exportJson = JSON.stringify({
        project: project.name,
        type: 'Perspective.ai Architectural 3D Scene',
        version: '2.0',
        timestamp: new Date().toISOString(),
        stats: project.stats,
        render: project.renderedImage ? 'Embedded Top-Down Spatial Map' : null,
      }, null, 2);
      const blob = new Blob([exportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      downloadFile(url, `${project.name || 'spatial'}_scene_spec.json`);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d253d]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-[#e3e8ee] rounded-3xl p-6 sm:p-8 shadow-stripe-2 flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0d253d]">Export & Download Assets</h3>
              <p className="text-xs text-[#64748d] font-light">Download photorealistic renders, 3D assets, or copy sharing link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#64748d] hover:text-[#0d253d] rounded-full hover:bg-[#f6f9fc] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Option 1: AI Photorealistic 2D Render */}
          <div className="p-4 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#0d253d]">Photorealistic 3D Render</span>
                <span className="text-xs text-[#64748d]">High-res PNG (1024 x 1024) top-down</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={handleDownloadRender}
              disabled={!project.renderedImage}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download
            </Button>
          </div>

          {/* Option 2: 3D Model / Spatial GLB */}
          <div className="p-4 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00d4b2]/10 border border-[#00d4b2]/20 flex items-center justify-center text-[#00d4b2] shrink-0">
                <Box className="w-5 h-5 text-[#0d253d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#0d253d]">3D Model (.GLB / Scene)</span>
                <span className="text-xs text-[#64748d]">Interactive 3D geometry & spatial assets</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadGLB}
              leftIcon={<FileCode className="w-3.5 h-3.5" />}
            >
              Export 3D
            </Button>
          </div>

          {/* Option 3: Original Blueprint */}
          <div className="p-4 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#e3e8ee] flex items-center justify-center text-[#64748d] shrink-0">
                <Image className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#0d253d]">Original 2D Blueprint</span>
                <span className="text-xs text-[#64748d]">Source blueprint CAD diagram</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadOriginal}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Source
            </Button>
          </div>
        </div>

        {/* Share Link Row */}
        <div className="pt-3 border-t border-[#e3e8ee] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#64748d]">
            <Share2 className="w-4 h-4 text-[#533afd]" />
            <span>Share Project Link:</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopyShareLink}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Link'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;

