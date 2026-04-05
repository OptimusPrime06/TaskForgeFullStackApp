import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-surface_container_lowest text-on_surface border border-outline_variant',
        }}
      />
      
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<TasksPage />} />
            
            {/* Nav placeholders */}
            <Route path="/dashboard" element={<Navigate to="/projects" replace />} />
            <Route path="/timeline" element={<div className="p-8"><h2 className="text-3xl font-bold">Timeline Module</h2></div>} />
            <Route path="/team" element={<div className="p-8"><h2 className="text-3xl font-bold">Team Module</h2></div>} />
            <Route path="/reports" element={<div className="p-8"><h2 className="text-3xl font-bold">Reports Module</h2></div>} />
            <Route path="/settings" element={<div className="p-8"><h2 className="text-3xl font-bold">Settings Module</h2></div>} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-8 text-center mt-20 font-bold">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
