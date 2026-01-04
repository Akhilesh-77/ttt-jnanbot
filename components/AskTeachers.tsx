
import React, { useState } from 'react';

interface Teacher {
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

const TEACHERS: Teacher[] = [
  { name: "Dr. Savina JP", email: "savinajp@tttacademy.in", phone: "9986869966", specialization: "Mathematics" },
  { name: "Prof. Akhilesh U", email: "akhilesh27u@gmail.com", phone: "6363027032", specialization: "IT Skills" },
  { name: "Prof. Ravi Kumar", email: "ravi.kumar@tttacademy.in", phone: "6363027032", specialization: "FEEE" },
  { name: "Prof. Shwetha S", email: "shwetha.s@tttacademy.in", phone: "6363027032", specialization: "Statistics" },
  { name: "Prof. Manjunath B", email: "manjunath.b@tttacademy.in", phone: "6363027032", specialization: "PMS" }
];

interface AskTeachersProps {
  isDarkMode: boolean;
  onBack: () => void;
}

const AskTeachers: React.FC<AskTeachersProps> = ({ isDarkMode, onBack }) => {
  const [doubt, setDoubt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState(1); // Default to Prof. Akhilesh U
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedTeacher = TEACHERS[selectedTeacherIndex];

  const handleGmail = async () => {
    if (!doubt.trim()) return;
    const subject = "Ask TTT JnanBot Doubt";
    
    // If image exists and sharing is supported (Mobile/Modern Browsers), use Web Share for true attachment
    if (image && navigator.canShare && navigator.canShare({ files: [image] })) {
      try {
        await navigator.share({
          files: [image],
          title: subject,
          text: `Teacher: ${selectedTeacher.name}\nEmail: ${selectedTeacher.email}\n\nDoubt: ${doubt}`,
        });
        return;
      } catch (err) {
        console.warn("Share failed, falling back to mailto");
      }
    }

    // Fallback: Mailto with instruction if image exists
    const bodyNote = image ? `\n\n[PLEASE ATTACH THE IMAGE: ${image.name} MANUALLY]` : "";
    const body = encodeURIComponent(doubt + bodyNote);
    window.open(`mailto:${selectedTeacher.email}?subject=${encodeURIComponent(subject)}&body=${body}`);
  };

  const handleWhatsApp = () => {
    if (!doubt.trim()) return;
    
    let text = `*Doubt from TTT JNAN App*\n\n${doubt}`;
    if (image) {
      text += `\n\n_Please attach the image here again. For security reasons, WhatsApp does not allow images to be attached automatically._`;
    }
    
    window.open(`https://wa.me/${selectedTeacher.phone}?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Ask Teachers</h2>
      </div>

      <div className={`flex flex-col p-6 rounded-3xl glass border shadow-xl mb-6 transition-all ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">Select Teacher</label>
          <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-sm">{selectedTeacher.name}</span>
                <span className="text-[10px] opacity-60 uppercase tracking-wider">{selectedTeacher.specialization}</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t dark:border-white/10 border-black/10 divide-y dark:divide-white/5 divide-black/5 max-h-60 overflow-y-auto scrollbar-hide">
                {TEACHERS.map((teacher, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTeacherIndex(index);
                      setIsExpanded(false);
                    }}
                    className={`w-full flex flex-col items-start p-4 hover:bg-indigo-600 hover:text-white transition-all ${
                      selectedTeacherIndex === index ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  >
                    <span className="font-bold text-sm">{teacher.name}</span>
                    <span className="text-[10px] opacity-60 uppercase tracking-wider">{teacher.specialization}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 ml-1">Messages will be sent to the selected teacher.</p>
        </div>

        <label className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Your Doubt</label>
        <textarea
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          placeholder={`Type your question for ${selectedTeacher.name} here...`}
          className="flex-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 text-sm md:text-base resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-6 min-h-[150px]"
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
              <span className="text-sm font-medium text-center truncate w-full px-2">
                {image ? image.name : 'Tap to select an image'}
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleGmail}
            className="flex items-center justify-center space-x-2 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <span>Send to {selectedTeacher.name.split(' ')[1]} via Gmail</span>
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
