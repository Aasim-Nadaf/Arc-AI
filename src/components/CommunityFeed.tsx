import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../lib/sampleData';
import { Button } from './ui/Button';

export const CommunityFeed: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [likes, setLikes] = useState<Record<string, number>>({
    'sample-penthouse': 142,
    'sample-studio-loft': 98,
    'sample-villa': 210,
  });
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const tags = ['All', 'Penthouse', 'Nordic Modern', 'Industrial Loft', 'Japandi', 'Studio', 'Villa'];

  const filteredProjects = selectedTag === 'All'
    ? SAMPLE_PROJECTS
    : SAMPLE_PROJECTS.filter(p => p.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase()));

  const handleToggleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + (isLiked ? -1 : 1) }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e3e8ee]">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#533afd]/10 border border-[#533afd]/20 text-[#533afd] text-xs font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
            <span>Community Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d253d] tracking-tight">
            Explore 2D-to-3D Floor Plan Transformations
          </h1>
          <p className="text-sm text-[#64748d] max-w-2xl font-light leading-relaxed">
            Browse architectural blueprints rendered with generative AI lighting, rich floor textures, and interactive spatial 3D models.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#533afd] text-white shadow-sm'
                  : 'bg-white text-[#64748d] hover:text-[#0d253d] border border-[#e3e8ee] hover:border-[#a8c3de]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Community Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white hover:bg-[#f6f9fc] border border-[#e3e8ee] hover:border-[#a8c3de] rounded-3xl overflow-hidden transition-all duration-200 flex flex-col shadow-stripe-1 hover:shadow-stripe-2"
          >
            {/* Visual Canvas Area */}
            <div className="relative aspect-[4/3] bg-[#f6f9fc] border-b border-[#e3e8ee] overflow-hidden">
              <img
                src={project.renderedImage || project.sourceImage}
                alt={project.name || 'Community Architecture'}
                className="w-full h-full object-contain p-3 group-hover:scale-102 transition-transform duration-300"
              />

              {/* Creator Chip */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#e3e8ee] text-xs text-[#0d253d] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#533afd]" />
                <span className="font-medium">{project.sharedBy || 'Architect'}</span>
              </div>

              {/* Action Floating Overlay */}
              <div className="absolute inset-0 bg-[#0d253d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                <Link to={`/visualizer/${project.id}`}>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open in Visualizer
                  </Button>
                </Link>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4 text-left">
              <div>
                <h3 className="text-base font-semibold text-[#0d253d] group-hover:text-[#533afd] line-clamp-1 transition-colors">
                  {project.name}
                </h3>
                {project.notes && (
                  <p className="text-xs text-[#64748d] mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {project.notes}
                  </p>
                )}
              </div>

              {/* Tags & Engagement */}
              <div className="flex items-center justify-between pt-3 border-t border-[#e3e8ee]">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags?.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f6f9fc] text-[#64748d] border border-[#e3e8ee] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLike(project.id)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                      likedMap[project.id]
                        ? 'text-[#e5484d] bg-red-50 border border-red-200'
                        : 'text-[#64748d] hover:text-[#0d253d] bg-white border border-[#e3e8ee]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[project.id] ? 'fill-[#e5484d] text-[#e5484d]' : ''}`} />
                    <span className="tnum font-medium">{likes[project.id] || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;

