
import React from 'react';

interface AboutTTTProps {
  isDarkMode: boolean;
  onBack: () => void;
}

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
  const openLink = (url: string) => window.open(url, '_blank');

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Official Website</span>
            <span className="text-[10px] text-slate-400">tttacademy.in</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.desktop)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Desktop Application</span>
            <span className="text-[10px] text-slate-400">Available for Windows/macOS</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.android)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Android App</span>
            <span className="text-[10px] text-slate-400">Get it on Google Play Store</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.ios)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">iOS App</span>
            <span className="text-[10px] text-slate-400">Available on Apple App Store</span>
          </div>
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 ml-1">Community & Socials</p>
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
          <button onClick={() => openLink(TTT_LINKS.youtube)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-600/10 text-red-600 transition-all hover:bg-red-600 hover:text-white group">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l-4 3v-6l4 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">YouTube</span>
          </button>
          
          <button onClick={() => openLink(TTT_LINKS.telegram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-sky-500/10 text-sky-500 transition-all hover:bg-sky-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-[10px] font-bold uppercase">Telegram</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.whatsapp)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-500/10 text-green-500 transition-all hover:bg-green-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.instagram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-pink-500/10 text-pink-500 transition-all hover:bg-pink-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a1 1 0 110-2 1 1 0 010 2zM12 3c-2.44 0-2.75.01-3.71.05-3.04.14-4.2 1.3-4.34 4.34-.04.96-.05 1.27-.05 3.71s.01 2.75.05 3.71c.14 3.04 1.3 4.2 4.34 4.34.96.04 1.27.05 3.71.05s2.75-.01 3.71-.05c3.04-.14 4.2-1.3 4.34-4.34.04-.96.05-1.27.05-3.71s-.01-2.75-.05-3.71c-.14-3.04-1.3-4.2-4.34-4.34-.96-.04-1.27-.05-3.71-.05z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutTTT;
