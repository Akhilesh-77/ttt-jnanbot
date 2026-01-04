
import React, { useState, useEffect } from 'react';

interface AboutTTTProps {
  isDarkMode: boolean;
  onBack: () => void;
}

// Initial defaults (can be edited here or via the UI configuration panel)
const DEFAULT_ICONS = {
  website: "",
  desktop: "",
  android: "",
  ios: "",
  youtube: "",
  telegram: "",
  whatsapp: "",
  instagram: ""
};

const TTT_LINKS = {
  website: "https://tttacademy.in/",
  desktop: "https://tttacademy.in/downloads/desktop",
  android: "https://tttacademy.in/downloads/android",
  ios: "https://tttacademy.in/downloads/ios",
  youtube: "https://youtube.com/@tttacademy",
  telegram: "https://t.me/tttacademy",
  whatsapp: "https://chat.whatsapp.com/example",
  instagram: "https://instagram.com/tttacademy"
};

const AboutTTT: React.FC<AboutTTTProps> = ({ isDarkMode, onBack }) => {
  const [icons, setIcons] = useState(() => {
    const saved = localStorage.getItem('ttt_custom_icons');
    return saved ? JSON.parse(saved) : DEFAULT_ICONS;
  });
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempIcons, setTempIcons] = useState(icons);

  const openLink = (url: string) => window.open(url, '_blank');

  const handleSaveConfig = () => {
    setIcons(tempIcons);
    localStorage.setItem('ttt_custom_icons', JSON.stringify(tempIcons));
    setIsConfigOpen(false);
  };

  const RenderIcon = ({ type, fallback }: { type: keyof typeof DEFAULT_ICONS, fallback: React.ReactNode }) => {
    const url = icons[type];
    if (url) {
      return <img src={url} alt={type} className="h-6 w-6 object-contain" />;
    }
    return <>{fallback}</>;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 pb-10 relative">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold tracking-tight">About TTT</h2>
      </div>

      <div className="flex flex-col items-center text-center mb-10">
        <div className={`w-24 h-24 mb-6 rounded-3xl overflow-hidden border-2 flex items-center justify-center ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
          <img src="https://tttacademy.in/NOMS/files/images/static/Main-logo.png" alt="TTT Logo" className="w-16 h-16 object-contain" />
        </div>
        <h3 className="text-2xl font-black text-indigo-500 mb-2">TTT Academy – DCET Coaching</h3>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Learn more about TTT Academy and our DCET resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button onClick={() => openLink(TTT_LINKS.website)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <RenderIcon type="website" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            } />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Official Website</span>
            <span className="text-[10px] text-slate-400">tttacademy.in</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.desktop)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <RenderIcon type="desktop" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            } />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Desktop Application</span>
            <span className="text-[10px] text-slate-400">Available for Windows/macOS</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.android)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <RenderIcon type="android" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            } />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Android App</span>
            <span className="text-[10px] text-slate-400">Get it on Google Play Store</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.ios)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <RenderIcon type="ios" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            } />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">iOS App</span>
            <span className="text-[10px] text-slate-400">Available on Apple App Store</span>
          </div>
        </button>
      </div>

      <div className="space-y-4 mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 ml-1">Community & Socials</p>
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
          <button onClick={() => openLink(TTT_LINKS.youtube)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-600/10 text-red-600 transition-all hover:bg-red-600 hover:text-white group">
             <RenderIcon type="youtube" fallback={
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l-4 3v-6l4 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             } />
            <span className="text-[10px] font-bold uppercase">YouTube</span>
          </button>
          
          <button onClick={() => openLink(TTT_LINKS.telegram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-sky-500/10 text-sky-500 transition-all hover:bg-sky-500 hover:text-white">
            <RenderIcon type="telegram" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            } />
            <span className="text-[10px] font-bold uppercase">Telegram</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.whatsapp)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-500/10 text-green-500 transition-all hover:bg-green-500 hover:text-white">
            <RenderIcon type="whatsapp" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            } />
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.instagram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-pink-500/10 text-pink-500 transition-all hover:bg-pink-500 hover:text-white">
            <RenderIcon type="instagram" fallback={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a1 1 0 110-2 1 1 0 010 2zM12 3c-2.44 0-2.75.01-3.71.05-3.04.14-4.2 1.3-4.34 4.34-.04.96-.05 1.27-.05 3.71s.01 2.75.05 3.71c.14 3.04 1.3 4.2 4.34 4.34.96.04 1.27.05 3.71.05s2.75-.01 3.71-.05c3.04-.14 4.2-1.3 4.34-4.34.04-.96.05-1.27.05-3.71s-.01-2.75-.05-3.71c-.14-3.04-1.3-4.2-4.34-4.34-.96-.04-1.27-.05-3.71-.05z" />
              </svg>
            } />
            <span className="text-[10px] font-bold uppercase">Instagram</span>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/5 flex justify-center">
        <button 
          onClick={() => setIsConfigOpen(true)}
          className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configure Icons</span>
        </button>
      </div>

      {isConfigOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsConfigOpen(false)}></div>
          <div className={`relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl p-8 border shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-hide ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-black/5 text-slate-900'}`}>
            <h3 className="text-xl font-bold mb-2">Configure Icon URLs</h3>
            <p className="text-xs text-slate-400 mb-6 uppercase tracking-widest font-bold">Paste image links to update icons</p>
            
            <div className="space-y-4 mb-8">
              {(Object.keys(DEFAULT_ICONS) as Array<keyof typeof DEFAULT_ICONS>).map((key) => (
                <div key={key}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1 block">{key}</label>
                  <input 
                    type="text" 
                    value={tempIcons[key]} 
                    onChange={(e) => setTempIcons({...tempIcons, [key]: e.target.value})}
                    placeholder="https://example.com/icon.png"
                    className={`w-full p-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex space-x-3 sticky bottom-0 pt-4 bg-inherit border-t dark:border-white/5 border-black/5">
              <button 
                onClick={() => setIsConfigOpen(false)}
                className="flex-1 py-3 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveConfig}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTTT;
