import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Sparkles, Trash2, ExternalLink, Clock, Tag } from 'lucide-react';
import { DesignItem } from '../types';
import { formatRelativeTime } from '../lib/utils';

interface ProjectCardProps {
  project: DesignItem;
  onDelete?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const displayImage = project.renderedImage || project.sourceImage;

  return (
    <div className="group relative bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] rounded-3xl overflow-hidden transition-all duration-200 flex flex-col shadow-stripe-1 hover:shadow-stripe-2 text-left">
      {/* Thumbnail Area */}
      <Link to={`/visualizer/${project.id}`} className="relative aspect-[16/10] bg-[#f6f9fc] border-b border-[#e3e8ee] overflow-hidden block">
        <img
          src={displayImage}
          alt={project.name || 'Floor Plan Visualization'}
          className="w-full h-full object-contain p-3 group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* View Mode Tag */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#e3e8ee] text-[11px] font-medium text-[#0d253d] flex items-center gap-1.5 shadow-sm">
          {project.renderedImage ? (
            <>
              <Sparkles className="w-3 h-3 text-[#533afd]" />
              <span>3D Rendered</span>
            </>
          ) : (
            <>
              <Box className="w-3 h-3 text-[#533afd]" />
              <span>2D Blueprint</span>
            </>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#0d253d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
          <span className="px-4 py-1.5 bg-[#533afd] text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5">
            Open in Visualizer <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Details Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/visualizer/${project.id}`}
              className="text-sm font-semibold text-[#0d253d] group-hover:text-[#533afd] line-clamp-1 transition-colors"
            >
              {project.name || 'Untitled Floor Plan'}
            </Link>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                className="text-[#64748d] hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {project.notes && (
            <p className="text-xs text-[#64748d] mt-1 line-clamp-2 font-light">{project.notes}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748d] pt-3 border-t border-[#e3e8ee]">
          <span className="flex items-center gap-1 tnum">
            <Clock className="w-3 h-3 text-[#64748d]" />
            {formatRelativeTime(project.timestamp)}
          </span>
          {project.stats?.style && (
            <span className="text-[#533afd] font-medium uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-[#f6f9fc] border border-[#e3e8ee]">
              {project.stats.style}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

