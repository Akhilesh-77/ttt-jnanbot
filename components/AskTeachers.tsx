
import React, { useState } from 'react';

interface AskTeachersProps {
  isDarkMode: boolean;
  onBack: () => void;
}

const AskTeachers: React.FC<AskTeachersProps> = ({ isDarkMode, onBack }) => {
  const [doubt, setDoubt] = useState('');
  const [image, setImage] = useState<File | null>(null)
  ;

  const handleGmail = () => {
    if (!doubt.trim()) return;
    const email = "akhilesh27u@gmail.com"; // Placeholder backend config
    const subject = encodeURIComponent("DCET Student Doubt - TTT JNAN");
    const body = encodeURIComponent(doubt);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleWhatsApp = () => {
    if (!doubt.trim()) return;
    const phone = "6363027032"; // Placeholder backend config
    const text = encodeURIComponent(doubt);
    
    if (image) {
      alert("Please upload the image again manually in WhatsApp for security reasons.");
    }
    
    window.open(`https://wa.me/${phone}?text=${text}`);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Askk Teachers</h2>
      </div>

      <div className={`flex-1 flex flex-col p-6 rounded-3xl glass border shadow-xl ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <label className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Your Doubt</label>
        <textarea
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          placeholder="Type your question for the teachers here..."
          className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 text-sm md:text-base resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-6"
        />

        <div className="mb-8">
          <label className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">Attach Image (Optional)</label>
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden" 
              id="teacher-image" 
            />
            <label 
              htmlFor="teacher-image"
              className={`flex-1 py-4 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                image 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{image ? image.name : 'Tap to select an image'}</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleGmail}
            className="flex items-center justify-center space-x-2 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <span>Send via Gmail</span>
          </button>
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center space-x-2 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <span>Send via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskTeachers;
