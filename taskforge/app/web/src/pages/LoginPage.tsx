import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password);
    if (success) {
      navigate('/projects');
    }
  };

  return (
    <div className="bg-surface text-on_surface min-h-screen flex flex-col selection:bg-primary_container selection:text-white">
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Blur Orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]"></div>
        
        <div className="w-full max-w-md z-10">
          
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary_container flex items-center justify-center rounded-xl">
                {/* Simulated icon using string temporarily, replace with Lucide later if needed */}
                <span className="material-symbols-outlined text-white text-2xl" data-icon="task_alt">✔️</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-on_surface">TaskForge</span>
            </div>
            {/* The custom text-display-md is approximately text-4xl from earlier configs */}
            <h1 className="text-4xl font-bold text-on_surface tracking-tighter mb-2">Welcome back</h1>
            <p className="text-on_surface_variant">Editorial Engineering for modern teams.</p>
          </div>

          <div className="bg-surface_container_lowest rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(11,28,48,0.04)] backdrop-blur-3xl bg-opacity-95">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on_surface ml-1 hover:cursor-pointer" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60" 
                    id="email" 
                    name="email" 
                    placeholder="name@company.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-on_surface hover:cursor-pointer" htmlFor="password">Password</label>
                  <a className="text-[0.75rem] font-medium text-primary hover:text-primary_container transition-colors" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input className="w-4 h-4 rounded border-outline_variant text-primary focus:ring-primary/40 bg-surface_container_low hover:cursor-pointer" id="remember" type="checkbox" />
                <label className="text-[0.875rem] text-on_surface_variant font-medium hover:cursor-pointer" htmlFor="remember">Keep me logged in</label>
              </div>

              <div className="pt-2">
                <button 
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-primary_container text-white font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  {isLoading ? 'Authenticating...' : 'Login'}
                </button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline_variant/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-surface_container_lowest px-4 text-on_surface_variant/60">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button disabled type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-surface_container_low hover:bg-surface_container_high rounded-lg transition-colors group opacity-50 cursor-not-allowed">
                <span className="text-xs font-bold text-on_surface">GitHub</span>
              </button>
              <button disabled type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-surface_container_low hover:bg-surface_container_high rounded-lg transition-colors group opacity-50 cursor-not-allowed">
                <span className="text-xs font-bold text-on_surface">Google</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-on_surface_variant text-sm font-medium">
            New to TaskForge? 
            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
      
      <footer className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-on_surface_variant/60 text-[0.75rem] font-medium border-t border-outline_variant/30">
        <div className="flex items-center gap-6">
          <a className="hover:text-on_surface transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-on_surface transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-on_surface transition-colors" href="#">Status</a>
        </div>
        <div>
          © 2024 TaskForge Editorial Engineering.
        </div>
      </footer>
    </div>
  );
}
