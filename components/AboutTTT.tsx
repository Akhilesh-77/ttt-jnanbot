
import React from 'react';

interface AboutTTTProps {
  isDarkMode: boolean;
  onBack: () => void;
}

// Icon URLs defined in code for easy editing
const TTT_ICONS = {
  website: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
  desktop: "https://cdn-icons-png.flaticon.com/512/3039/3039401.png",
  android: "https://cdn-icons-png.flaticon.com/512/226/226770.png",
  ios: "https://cdn-icons-png.flaticon.com/512/888/888841.png",
  studentPortal: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
  telegram: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
  whatsapp: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
};

const TTT_LINKS = {
  website: "https://tttacademics.com/",
  desktop: "https://tttacademy.in/downloads/desktop",
  android: "https://tttacademy.in/downloads/android",
  ios: "https://tttacademy.in/downloads/ios",
  studentPortal: "https://tttacademy.in/student-portal", // Update this link as needed
  youtube: "https://youtube.com/@tttacademy",
  telegram: "https://t.me/tttacademy",
  whatsapp: "https://chat.whatsapp.com/example",
  instagram: "https://instagram.com/tttacademy"
};

const AboutTTT: React.FC<AboutTTTProps> = ({ isDarkMode, onBack }) => {
  const openLink = (url: string) => window.open(url, '_blank');

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
          <img src="https://tttacademics.com/logos/x-icon.png" alt="TTT Logo" className="w-16 h-16 object-contain" />
        </div>
        <h3 className="text-2xl font-black text-indigo-500 mb-2">TTT Academy – DCET Coaching</h3>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Learn more about TTT Academy and our DCET resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button onClick={() => openLink(TTT_LINKS.website)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <img src={TTT_ICONS.website} alt="Website" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Official Website</span>
            <span className="text-[10px] text-slate-400">tttacademics.com</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.desktop)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <img src={TTT_ICONS.desktop} alt="Desktop" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Desktop Application</span>
            <span className="text-[10px] text-slate-400">For Windows / macOS</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.android)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <img src={TTT_ICONS.android} alt="Android" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Android App</span>
            <span className="text-[10px] text-slate-400">Google Play Store</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.ios)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <img src={TTT_ICONS.ios} alt="iOS" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">iOS App</span>
            <span className="text-[10px] text-slate-400">Apple App Store</span>
          </div>
        </button>

        <button onClick={() => openLink(TTT_LINKS.studentPortal)} className={`flex items-center p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 hover:border-indigo-500/50' : 'bg-white border-black/5 hover:border-indigo-500/50 shadow-sm'}`}>
          <div className="p-3 bg-indigo-500/10 rounded-xl mr-4 text-indigo-500">
            <img src={TTT_ICONS.studentPortal} alt="Student Portal" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm">Student Panel</span>
            <span className="text-[10px] text-slate-400">Access your dashboard</span>
          </div>
        </button>
      </div>

      <div className="space-y-4 mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 ml-1">Community & Socials</p>
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
          <button onClick={() => openLink(TTT_LINKS.youtube)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-red-600/10 text-red-600 transition-all hover:bg-red-600 hover:text-white group">
            <img src={TTT_ICONS.youtube} alt="YouTube" className="h-6 w-6 mb-2 object-contain" />
            <span className="text-[10px] font-bold uppercase">YouTube</span>
          </button>
          
          <button onClick={() => openLink(TTT_LINKS.telegram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-sky-500/10 text-sky-500 transition-all hover:bg-sky-500 hover:text-white">
            <img src={TTT_ICONS.telegram} alt="Telegram" className="h-6 w-6 mb-2 object-contain" />
            <span className="text-[10px] font-bold uppercase">Telegram</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.whatsapp)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-green-500/10 text-green-500 transition-all hover:bg-green-500 hover:text-white">
            <img src={TTT_ICONS.whatsapp} alt="WhatsApp" className="h-6 w-6 mb-2 object-contain" />
            <span className="text-[10px] font-bold uppercase">WhatsApp</span>
          </button>

          <button onClick={() => openLink(TTT_LINKS.instagram)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-pink-500/10 text-pink-500 transition-all hover:bg-pink-500 hover:text-white">
            <img src={TTT_ICONS.instagram} alt="Instagram" className="h-6 w-6 mb-2 object-contain" />
            <span className="text-[10px] font-bold uppercase">Instagram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutTTT;
