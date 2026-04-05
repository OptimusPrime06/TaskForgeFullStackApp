import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password !== confirmPassword) {
      setErrorLocal('Passwords do not match');
      return;
    }
    setErrorLocal('');
    
    const success = await register(email, password);
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
            <h1 className="text-4xl font-bold text-on_surface tracking-tighter mb-2">Create an account</h1>
            <p className="text-on_surface_variant">Join TaskForge to streamline your workflow.</p>
          </div>

          <div className="bg-surface_container_lowest rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(11,28,48,0.04)] backdrop-blur-3xl bg-opacity-95">
            <form className="space-y-6" onSubmit={handleRegister}>
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
                <label className="text-xs font-semibold text-on_surface ml-1 hover:cursor-pointer" htmlFor="password">Password</label>
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

              <div className="space-y-2">
                <label className="text-xs font-semibold text-on_surface ml-1 hover:cursor-pointer" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface_container_low border-none focus:ring-2 focus:ring-primary/40 rounded-lg py-3 px-4 transition-all text-on_surface placeholder:text-on_surface_variant/60" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="••••••••" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {errorLocal && (
                <div className="text-error text-xs font-semibold ml-1">
                  {errorLocal}
                </div>
              )}

              <div className="pt-2">
                <button 
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-primary_container text-white font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed" 
                  type="submit"
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-on_surface_variant text-sm font-medium">
            Already have an account? 
            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
