import type { Project } from '../../api/projects.api';

// Fallback images based on Project ID to simulate the mockup's beautiful variety
const getPlaceholderImage = (id: string) => {
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvSN9OMLqvnODvLM60G8rCTHtt05uBdgKYwZYy-f-7g-MRbRSvDQbwZUc-eKSZcdHUBBug5Q0DnN_OI7TyYJzd4hD4O8SUg8M0O1R7Xixc-cGjPjoanq7tvphCov-dT-iupx-RUGky_NYI7fI1v_bgTRzsiTyMCfDh0PX3FCP40lB5yDVW9g1oezmbJ8-LVRB7XpKfX1ZvICIJ2J04rTKAzOirPFCP8ekpcjJIFFeiMWd96S83gyKdIgx6or-SUwwfykp4PSMq9oQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyw5h2tJvHSexG09SabEr3h656Cgt8bFMuaVxjd4qhcY5jViE85kYTWApV0PCsHIkcVcSd6mZELz_s7xyDwg6q5lQCr4apGRRVAUTPm0f4mPaJFQZ5w-KcjmXadd1PLAanm9MF4_C0dTabqVEEhHJdQtosnrC1jo2NmGNshWfXubl-hZvMfxfE0xSZEz-fM9F0RA5fItT-wVO7IHcc_pKC2O5aQvYrGvGuJyr3yc6AjhWiQqv53baaipJbl_kGgGKEV778sUR3CzQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ7M2u6y-l40zJ1iPSaExwi9oBixFHMAFNFqk6Zq9OqsllBraUL-TJivPuT2VLvAS6htfSPULK1E9Jq7ywAjd7XIfknmhlSxYCrUv-KdS35es7wqdY0XsWaD07P4tDtaug5BIan6vH96UjGKdKmGa7c0hMpROvsL4dlESeAmHteID6CA4MnrK_77H92RiAT3WlhzaDYmALF97hhuD0jd3ycc3Fh_vrRxgjP37bHg8c0lO-aGF5GfynyhhF2L3Y3wBrxbYae83oqs4"
  ];
  return images[id.charCodeAt(0) % images.length];
};

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-surface_container_lowest rounded-[1.5rem] p-6 group transition-all hover:bg-surface_bright relative overflow-hidden shadow-sm hover:shadow-md">
      <div className="mb-6 h-32 rounded-xl overflow-hidden">
        <img 
          alt="Project cover" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={getPlaceholderImage(project.id)} 
        />
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1 truncate">{project.id.split('-')[0]}</p>
          <h4 className="text-xl font-bold text-on_surface tracking-tight truncate">{project.name}</h4>
          <p className="text-on_surface_variant text-sm mt-2 line-clamp-2 min-h-10">
            {project.description || 'No description provided.'}
          </p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-outline_variant/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary_container flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">
              {project.owner?.email?.charAt(0).toUpperCase() || 'O'}
            </div>
            <span className="text-xs font-semibold text-on_surface truncate max-w-[100px]">
              {project.owner?.email || 'Owner'}
            </span>
          </div>
          <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View Board
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
