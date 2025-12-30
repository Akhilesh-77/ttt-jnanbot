
import React from 'react';

interface SubjectResourcesProps {
  isDarkMode: boolean;
  onBack: () => void;
}

const RESOURCES = [
  { name: 'FEEE', link: 'https://jumpshare.com/s/qGOpx46uQdG5pswO0DY5' },
  { name: 'IT SKILLS', link: 'https://jumpshare.com/share/6J1rRbyUfGN3ZXfis0nQ' },
  { name: 'MATHS', link: 'https://jumpshare.com/share/DZApe66DKJzOWtjwclhN' },
  { name: 'STATISTICS', link: 'https://jumpshare.com/share/Qp7UWMZwfjpjXAvikK02' },
  { name: 'PMS', link: 'https://jumpshare.com/share/GW05ZQGSeo5FxbT6CyCa' },
];

const SubjectResources: React.FC<SubjectResourcesProps> = ({ isDarkMode, onBack }) => {
  const handleOpen = (link: string) => {
    if (!link) {
      alert("This resource is currently unavailable.");
      return;
    }
    window.open(link, '_blank');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold tracking-tight">Subject Resources</h2>
      </div>

      <div className={`flex-1 flex flex-col p-6 rounded-3xl glass border shadow-xl ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-6">Official Study Materials</p>
        
        <div className="space-y-4">
          {RESOURCES.map((resource) => (
            <div 
              key={resource.name}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-400'
              } shadow-sm`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base">{resource.name}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Study Material</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpen(resource.link)}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20"
              >
                Open Resource
              </button>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resources provided by TTT Academy</p>
        </div>
      </div>
    </div>
  );
};

export default SubjectResources;
