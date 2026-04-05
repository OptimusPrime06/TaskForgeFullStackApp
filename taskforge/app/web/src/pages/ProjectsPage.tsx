import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/projects/ProjectCard';

export default function ProjectsPage() {
  const { projects, isLoading, createProject } = useProjects();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = async () => {
    if (!newProjectName) return;
    const success = await createProject(newProjectName);
    if (success) {
      setIsCreating(false);
      setNewProjectName('');
    }
  };

  return (
    <div className="p-8 max-w-7xl w-full mx-auto">
      {/* Page Header Area */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-[2.75rem] font-black text-on_surface tracking-tighter leading-tight">Projects</h2>
          <p className="text-on_surface_variant mt-1 text-lg">Manage your architectural engineering tasks and team workflow.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-gradient-to-br from-primary to-primary_container text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          New Project
        </button>
      </div>

      {isCreating && (
        <div className="mb-10 bg-surface_container_low p-6 rounded-2xl flex items-center gap-4 border border-outline_variant/30">
          <input 
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="flex-1 bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60" 
            placeholder="Enter project name..."
            autoFocus
          />
          <button 
            onClick={handleCreate}
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary_container disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Save'}
          </button>
          <button onClick={() => setIsCreating(false)} className="px-6 py-3 bg-transparent text-primary font-bold rounded-lg hover:bg-surface_container_highest">
            Cancel
          </button>
        </div>
      )}



      {/* Project Cards Grid */}
      {isLoading && projects.length === 0 ? (
        <div className="flex justify-center p-12">
          <span className="text-on_surface_variant font-bold">Loading Projects...</span>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      ) : (
        <div className="bg-surface_container_low rounded-[2.5rem] p-12 border-2 border-dashed border-outline_variant/30 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <span className="material-symbols-outlined text-primary_container text-4xl">rocket_launch</span>
          </div>
          <h5 className="text-2xl font-bold text-on_surface mb-2">Ready for a new venture?</h5>
          <p className="text-on_surface_variant max-w-md mx-auto mb-8">Initiate a new workspace to begin tracking assets, timelines, and editorial requirements for your next engineering feat.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-8 py-3 bg-on_surface text-white rounded-xl font-bold hover:bg-on_surface/90 transition-colors"
          >
            Launch Project Forge
          </button>
        </div>
      )}

    </div>
  );
}
