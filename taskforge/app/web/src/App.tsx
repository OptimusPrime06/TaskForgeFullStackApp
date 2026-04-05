import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      {/* 
        The Toaster acts as our global notification hub.
        We can style it later to match the Editorial aesthetics.
      */}
      <Toaster position="top-right" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        
        {/* Placeholder Routes for Phase 2/3 */}
        <Route path="/login" element={<div className="p-8 text-on_surface">Login Page Placeholder</div>} />
        <Route path="/register" element={<div className="p-8 text-on_surface">Register Page Placeholder</div>} />
        <Route path="/projects" element={<div className="p-8 text-on_surface">Projects List Placeholder</div>} />
        
        {/* Fallback */}
        <Route path="*" element={<div className="p-8">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
