import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ProtectedRoute } from './guards/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      {/* 
        The Toaster acts as our global notification hub.
      */}
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
        
        {/* Protected Routes placeholder */}
        <Route element={<ProtectedRoute />}>
          {/* We will build ProjectsPage in Phase 3 */}
          <Route path="/projects" element={<div className="p-8 text-on_surface text-center mt-20 text-xl font-bold border rounded-lg bg-surface_container_lowest m-4">You have successfully Authenticated! Proceed to Phase 3.</div>} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-8 text-center mt-20 font-bold">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
