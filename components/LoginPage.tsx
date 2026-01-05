
import React, { useState } from 'react';
import { validateCredentials } from '../config/credentials';

interface LoginPageProps {
  theme: 'light' | 'dark';
  onLoginSuccess: () => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

const ACADEMY_LOGO = "https://tttacademy.in/NOMS/files/images/static/Main-logo.png";
const BOT_ICON = "https://i.postimg.cc/YC2MXrVy/Whats-App-Image-2026-01-05-at-2.jpg";

const LoginPage: React.FC<LoginPageProps> = ({ theme, onLoginSuccess, showInstallButton, onInstallClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (validateCredentials(username, password)) {
      localStorage.setItem('jnan_is_logged_in', 'true');
      onLoginSuccess();
    } else {
      setError("Incorrect ID or password. Please try again.");
    }
  };

  return (
    <div className={`flex flex-col h-[100dvh] items-center justify-center p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="w-full max-w-sm flex flex-col items-center">
        <img src={ACADEMY_LOGO} alt="Academy Logo" className="h-20 mb-6 object-contain drop-shadow-sm" />
        
        <div className="flex flex-col items-center mb-8">
          <img src={BOT_ICON} alt="Bot Icon" className="w-32 h-32 md:w-24 md:h-24 mb-4 rounded-3xl object-cover shadow-2xl animate-in zoom-in duration-500" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] text-center">
            Login to use TTT JNAN ChatBot services.
          </p>
        </div>
        
        <div className={`w-full p-8 rounded-3xl shadow-xl border animate-in slide-in-from-bottom-4 duration-500 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-indigo-500">Welcome Back</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">DCET Student Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter TTT ID or phone number"
                className={`w-full p-4 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your given password by TTT Admin"
                  className={`w-full p-4 pr-12 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.59 4.59m9.532 9.532l5.29 5.29m-4.454-4.454A10.05 10.05 0 0021.543 12c-1.274-4.057-5.064-7-9.543-7a9.96 9.96 0 00-1.557.123L9.88 9.88z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center animate-in fade-in slide-in-from-top-1">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.98] transition-all mt-2"
            >
              Login to JNAN
            </button>
          </form>

          {showInstallButton && (
            <div className="mt-6 border-t dark:border-slate-800 border-slate-100 pt-6">
              <button 
                onClick={onInstallClick}
                className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-indigo-500/30 text-indigo-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500/5 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Install JNAN App</span>
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">Verified TTT Academy Learning Portal</p>
      </div>
    </div>
  );
};

export default LoginPage;
