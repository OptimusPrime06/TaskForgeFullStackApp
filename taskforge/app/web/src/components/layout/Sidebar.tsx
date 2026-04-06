import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const { logout } = useAuth();

  // Helper utility for NavLink active styling
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
      isActive
        ? 'translate-x-1 text-primary font-bold border-r-4 border-primary bg-surface_variant'
        : 'hover:bg-surface_variant text-on_surface_variant hover:text-on_surface'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-6 px-4 z-50 w-64 bg-surface_container_low font-['Inter'] text-sm font-medium">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary_container flex items-center justify-center text-white">
          {/* Fallback to simple icon or text if material symbols have loading race conditions */}
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fort</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-on_surface tracking-tight leading-none">TaskForge</h1>
          <p className="text-[10px] uppercase tracking-widest text-on_surface_variant/70">Editorial Engineering</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        <NavLink to="/dashboard" className={navClass}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={navClass}>
          <span className="material-symbols-outlined">folder_copy</span>
          <span>All Projects</span>
        </NavLink>
        <NavLink to="/timeline" className={navClass}>
          <span className="material-symbols-outlined">calendar_today</span>
          <span>Timeline</span>
        </NavLink>
        <NavLink to="/team" className={navClass}>
          <span className="material-symbols-outlined">group</span>
          <span>Team</span>
        </NavLink>
        <NavLink to="/reports" className={navClass}>
          <span className="material-symbols-outlined">analytics</span>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="mt-auto space-y-1 pt-6 border-t border-outline_variant/20">
        <NavLink to="/settings" className={navClass}>
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-error_container text-on_surface_variant hover:text-error text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
