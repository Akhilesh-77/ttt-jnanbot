
import React, { useRef } from 'react';
import { Message } from '../types';
import html2canvas from 'html2canvas';

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode }) => {
  const isBot = message.role === 'bot';
  const messageRef = useRef<HTMLDivElement>(null);

  const takeScreenshot = async () => {
    if (!messageRef.current) return;
    try {
      const canvas = await html2canvas(messageRef.current, {
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `JNAN-${message.id}.png`;
      link.click();
    } catch (err) {
      console.error('Snapshot failed');
    }
  };

  return (
    <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} mb-6 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        ref={messageRef}
        className={`relative max-w-[90%] md:max-w-[80%] p-5 rounded-3xl shadow-lg transition-all border ${
          isBot
            ? isDarkMode 
              ? 'bg-slate-900 text-white border-slate-800 rounded-tl-none' 
              : 'bg-white text-slate-900 border-slate-100 rounded-tl-none'
            : 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-indigo-500/10'
        }`}
      >
        <div className="flex justify-between items-center mb-2.5 gap-6">
          <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${isBot ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : 'text-indigo-200'}`}>
            {isBot ? 'TTT JNAN ChatBot' : 'Student'}
          </span>
          <span className="text-[9px] opacity-40 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={`text-sm md:text-base leading-relaxed ${isBot ? 'font-black' : 'font-medium'}`}>
          {message.content.replace(/\*\*/g, '')}
        </div>
      </div>

      {isBot && (
        <button
          onClick={takeScreenshot}
          className={`mt-2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
            isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600'
          }`}
          title="Capture Snippet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatMessage;
