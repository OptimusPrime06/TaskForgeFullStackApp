import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useUsers } from '../hooks/useUsers';
import { ProjectCard } from '../components/projects/ProjectCard';
import { MemberSelector } from '../components/projects/MemberSelector';
import { useAuthStore } from '../stores/auth.store';
import { Role } from '@taskforge/shared';
import type { User } from '../api/users.api';

export default function ProjectsPage() {
  const { projects, isLoading, createProject, deleteProject, addMembersToProject } = useProjects();
  const { users } = useUsers();
  const { user } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const handleCreate = async () => {
    if (!newProjectName) return;
    const success = await createProject(newProjectName, newProjectDescription);
    if (success && selectedMembers.length > 0) {
      // Get the newly created project (it should be at the beginning of the list)
      const newProject = projects[0];
      if (newProject) {
        const memberEmails = selectedMembers.map((m) => m.email);
        await addMembersToProject(newProject.id, memberEmails);
      }
    }
    if (success) {
      setIsCreating(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setSelectedMembers([]);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const canDeleteProject = (projectId: string) => {
    if (!user) return false;
    // Admins can delete any project
    if (user.role === Role.ADMIN) return true;
    // Project managers can delete their own projects
    if (user.role === Role.PROJECT_MANAGER) {
      const project = projects.find((p) => p.id === projectId);
      return project?.ownerId === user.id;
    }
    return false;
  };

  const canCreateProject = user?.role === Role.ADMIN || user?.role === Role.PROJECT_MANAGER;
  const isNonMemberWithoutProjects = !canCreateProject && projects.length === 0;

  return (
    <div className="p-8 max-w-7xl w-full mx-auto">
      {/* Page Header Area */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-[2.75rem] font-black text-on_surface tracking-tighter leading-tight">Projects</h2>
          <p className="text-on_surface_variant mt-1 text-lg">Manage your architectural engineering tasks and team workflow.</p>
        </div>
        {canCreateProject && (
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="bg-gradient-to-br from-primary to-primary_container text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            New Project
          </button>
        )}
      </div>

      {isCreating && canCreateProject && (
        <div className="mb-10 bg-surface_container_low p-6 rounded-2xl space-y-4 border border-outline_variant/30">
          <input 
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60" 
            placeholder="Enter project name..."
            autoFocus
          />
          <textarea
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            className="w-full bg-surface_container_lowest border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60 resize-none"
            placeholder="Enter project description (optional)..."
            rows={3}
          />
          {(user?.role === Role.ADMIN || user?.role === Role.PROJECT_MANAGER) && (
            <>
              <label className="block text-sm font-semibold text-on_surface">Assign Members (optional)</label>
              <MemberSelector
                availableUsers={users}
                selectedMembers={selectedMembers}
                onMembersChange={setSelectedMembers}
                isLoading={isLoading}
              />
            </>
          )}
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={handleCreate}
              disabled={isLoading}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary_container disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Save'}
            </button>
            <button onClick={() => {
              setIsCreating(false);
              setNewProjectDescription('');
              setSelectedMembers([]);
            }} className="px-6 py-3 bg-transparent text-primary font-bold rounded-lg hover:bg-surface_container_highest">
              Cancel
            </button>
          </div>
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
            <div key={proj.id} className="relative group">
              <ProjectCard project={proj} />
              {canDeleteProject(proj.id) && (
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-error text-white p-2 rounded-lg hover:bg-error/90"
                  title="Delete project"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : isNonMemberWithoutProjects ? (
        <div className="bg-surface_container_low rounded-[2.5rem] p-16 border-2 border-dashed border-outline_variant/30 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
            <span className="material-symbols-outlined text-primary_container text-5xl">lock</span>
          </div>
          <h5 className="text-3xl font-black text-on_surface mb-3">You are not a member of any project</h5>
          <p className="text-on_surface_variant max-w-md mx-auto text-lg">Contact an admin or project manager to be added to a project so you can start collaborating on tasks.</p>
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
