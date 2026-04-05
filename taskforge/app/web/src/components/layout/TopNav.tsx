import { useAuthStore } from '../../stores/auth.store';

export const TopNav = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex justify-between items-center px-8 w-full sticky top-0 z-40 h-16 bg-surface font-['Inter'] tracking-tight">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant">search</span>
          <input 
            className="w-full pl-11 pr-4 py-2 bg-surface_container_low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on_surface_variant/50 text-on_surface" 
            placeholder="Search projects or commands..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 ml-8">
        <button className="relative p-2 rounded-full text-on_surface_variant hover:bg-surface_container_low transition-colors scale-95 duration-150">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-outline_variant/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on_surface">{user?.email || 'Authenticated User'}</p>
            <p className="text-[10px] text-on_surface_variant uppercase tracking-wider">{user?.role || 'MEMBER'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary_container text-white flex items-center justify-center font-bold text-lg ring-2 ring-primary_container/20">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
