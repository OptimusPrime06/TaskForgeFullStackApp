import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export const DashboardLayout = () => {
  return (
    <div className="bg-background font-body text-on_surface flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopNav />
        {/* The Outlet renders whatever child route is active. 
            For example, ProjectsPage will render right here. */}
        <Outlet />
      </main>
    </div>
  );
};
