
import React from 'react';

interface PWAInstallBannerProps {
  isDarkMode: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ isDarkMode, onInstall, onDismiss }) => {
  return (
    <div className="px-4 pt-2 animate-in slide-in-from-top-4 duration-500">
      <div className={`p-4 rounded-2xl border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/10 rounded-xl">
            <img 
              src="https://i.postimg.cc/5NvyPXFC/Gemini-Generated-Image-10lpm010lpm010lp.png" 
              alt="App Icon" 
              className="h-8 w-8 rounded-lg object-cover"
            />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold">Install TTT JNAN ChatBot</h4>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Add to home screen for faster access</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button 
            onClick={onDismiss}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Not now
          </button>
          <button 
            onClick={onInstall}
            className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
