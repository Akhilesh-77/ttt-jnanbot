
import React, { useState } from 'react';
import { validateCredentials } from '../config/credentials';

interface LoginPageProps {
  theme: 'light' | 'dark';
  onLoginSuccess: () => void;
}

const ACADEMY_LOGO = "https://tttacademy.in/NOMS/files/images/static/Main-logo.png";
const BOT_ICON = "https://i.postimg.cc/90KxzRQ0/Gemini-Generated-Image-o5mzvco5mzvco5mz.png";

const LoginPage: React.FC<LoginPageProps> = ({ theme, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your given password by TTT Admin"
                className={`w-full p-4 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                required
              />
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
        </div>
        
        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center">Verified TTT Academy Learning Portal</p>
      </div>
    </div>
  );
};

export default LoginPage;
