import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Plus, Search } from 'lucide-react';
import { ProjectCard } from '../../components/ProjectCard';
import { Button } from '../../components/ui/Button';
import { DesignItem } from '../../types';
import { getAllProjects, deleteProject } from '../../lib/puter.action';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchQuery || (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.notes?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'All' || p.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e3e8ee]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d253d] tracking-tight">
            Your Architectural Projects
          </h1>
          <p className="text-sm text-[#64748d] mt-1 font-light">
            Access past 2D floor plans, photorealistic 3D renders, and interactive spatial models.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => navigate('/')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Floor Plan
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#e3e8ee] p-2.5 rounded-2xl shadow-stripe-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748d] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or tag..."
            className="w-full bg-[#f6f9fc] border border-[#e3e8ee] rounded-full pl-9 pr-4 py-2 text-xs text-[#0d253d] placeholder:text-[#64748d] focus:outline-none focus:border-[#533afd] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Penthouse', 'Nordic Modern', 'Industrial Loft', 'Japandi'].map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#533afd] text-white shadow-sm'
                  : 'text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-white rounded-3xl border border-[#e3e8ee] shadow-stripe-1">
          <div className="w-14 h-14 rounded-2xl bg-[#f6f9fc] border border-[#e3e8ee] flex items-center justify-center text-[#533afd]">
            <Box className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-base font-semibold text-[#0d253d]">No projects found</h3>
            <p className="text-xs text-[#64748d] font-light">
              {searchQuery ? 'Try modifying your search criteria' : 'Upload your first 2D floor plan to generate photorealistic 3D views'}
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create First Render
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

