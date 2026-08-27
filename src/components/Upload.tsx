import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, Sparkles, AlertCircle, FileText, ArrowRight, Check } from 'lucide-react';
import { fileToBase64 } from '../lib/utils';
import { STYLE_PRESETS } from '../lib/constants';
import { SAMPLE_BLUEPRINT_1 } from '../lib/sampleData';
import { Button } from './ui/Button';

interface UploadProps {
  onUploadComplete: (imageDataUrl: string, projectName: string, stylePreset: string) => void;
  isLoading?: boolean;
}

export const Upload: React.FC<UploadProps> = ({ onUploadComplete, isLoading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('Urban Residence Blueprint');
  const [selectedStyle, setSelectedStyle] = useState<string>('scandinavian');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, WEBP, or SVG).');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    const cleanedName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setProjectName(cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1));

    try {
      const base64 = await fileToBase64(file);
      setPreviewUrl(base64);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error reading file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleStartGeneration = () => {
    if (!previewUrl) return;
    setIsProcessing(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            onUploadComplete(previewUrl, projectName, selectedStyle);
          }, 250);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const loadSampleBlueprint = (sampleName: string) => {
    setErrorMsg(null);
    setPreviewUrl(SAMPLE_BLUEPRINT_1);
    setProjectName(sampleName);
  };

  return (
    <div id="upload-module" className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-left">
      {/* Upload Zone Card */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-3xl border transition-all duration-200 p-8 sm:p-10 bg-white shadow-stripe-2 ${
          dragActive
            ? 'border-[#533afd] bg-[#f6f9fc] ring-2 ring-[#533afd]/20 scale-[1.005]'
            : 'border-[#e3e8ee] hover:border-[#a8c3de]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          onChange={handleFileInput}
          className="hidden"
        />

        {previewUrl ? (
          /* Image Selected / Configuration Form */
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative group w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-[#e3e8ee] bg-[#f6f9fc] shadow-sm">
              <img
                src={previewUrl}
                alt="Selected Floor Plan"
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute inset-0 bg-[#0d253d]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="w-full max-w-md flex flex-col gap-4 text-left">
              <div>
                <label className="block text-xs font-medium text-[#273951] mb-1.5 tracking-tight">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white border border-[#e3e8ee] rounded-xl px-3.5 py-2.5 text-sm text-[#0d253d] placeholder:text-[#64748d] focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] shadow-sm transition-all"
                  placeholder="e.g. Modern Villa Floor Plan"
                />
              </div>

              {/* Style Presets */}
              <div>
                <label className="block text-xs font-medium text-[#273951] mb-1.5 tracking-tight">
                  Architectural Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedStyle === style.id
                          ? 'border-[#533afd] bg-[#533afd]/5 text-[#0d253d] ring-1 ring-[#533afd]'
                          : 'border-[#e3e8ee] bg-[#f6f9fc] text-[#64748d] hover:border-[#a8c3de] hover:text-[#0d253d]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: style.previewColor }}
                        />
                        <span className="text-xs font-medium truncate">{style.name}</span>
                      </div>
                      <p className="text-[10px] text-[#64748d] line-clamp-1">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar if processing */}
              {isProcessing && (
                <div className="w-full flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-xs text-[#64748d]">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#533afd] animate-spin" />
                      Preparing neural visualization pipeline...
                    </span>
                    <span className="tnum font-medium text-[#0d253d]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e3e8ee] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#533afd] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                size="lg"
                variant="primary"
                onClick={handleStartGeneration}
                isLoading={isProcessing || isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full mt-2"
              >
                Generate 3D Visualization
              </Button>
            </div>
          </div>
        ) : (
          /* Empty Drag & Drop State */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#533afd]/10 border border-[#533afd]/20 flex items-center justify-center text-[#533afd] shadow-sm">
              <UploadIcon className="w-7 h-7 text-[#533afd]" />
            </div>

            <div className="flex flex-col gap-1.5 max-w-md">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#0d253d] tracking-tight">
                Upload 2D floor plan or CAD blueprint
              </h3>
              <p className="text-sm text-[#64748d] leading-relaxed">
                Drag and drop your JPG, PNG, WEBP, or hand-drawn sketch to generate a photorealistic top-down render and interactive 3D model.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
              <Button
                size="md"
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<ImageIcon className="w-4 h-4" />}
              >
                Browse Files
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748d]">
              <span>Supports JPG, PNG, WEBP up to 15MB</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quick Test Blueprint Samples */}
      {!previewUrl && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748d] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
              Or test instantly with sample architectural plans:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => loadSampleBlueprint('Metropolitan Penthouse')}
              className="group p-3.5 rounded-2xl bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] shadow-stripe-1 transition-all text-left flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img src={SAMPLE_BLUEPRINT_1} alt="Penthouse" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#0d253d] group-hover:text-[#533afd] truncate transition-colors">
                  Metropolitan Penthouse
                </span>
                <span className="text-[11px] text-[#64748d]">2-Bed Urban Blueprint</span>
              </div>
            </button>

            <button
              onClick={() => loadSampleBlueprint('Tribeca Studio Loft')}
              className="group p-3.5 rounded-2xl bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] shadow-stripe-1 transition-all text-left flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img src={SAMPLE_BLUEPRINT_1} alt="Loft" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#0d253d] group-hover:text-[#533afd] truncate transition-colors">
                  Tribeca Studio Loft
                </span>
                <span className="text-[11px] text-[#64748d]">Open-Concept Layout</span>
              </div>
            </button>

            <button
              onClick={() => loadSampleBlueprint('Kyoto Courtyard Villa')}
              className="group p-3.5 rounded-2xl bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] shadow-stripe-1 transition-all text-left flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img src={SAMPLE_BLUEPRINT_1} alt="Villa" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#0d253d] group-hover:text-[#533afd] truncate transition-colors">
                  Kyoto Courtyard Villa
                </span>
                <span className="text-[11px] text-[#64748d]">Japandi Residence</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;

