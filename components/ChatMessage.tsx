
import React, { useRef, useState } from 'react';
import { Message } from '../types';
import html2canvas from 'html2canvas';

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
  onDelete: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
  userName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
   message, isDarkMode, onDelete, onEdit, userName }) => {
  const isBot = message.role === 'bot';
  const messageRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

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

  const handleSaveEdit = () => {
    if (onEdit && editValue.trim() !== message.content) {
      onEdit(message.id, editValue);
    }
    setIsEditing(false);
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} mb-6 group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        ref={messageRef}
        className={`relative max-w-[92%] md:max-w-[85%] p-6 rounded-3xl shadow-lg transition-all border ${
          isBot
            ? isDarkMode 
              ? 'bg-slate-900 text-white border-slate-800 rounded-tl-none' 
              : 'bg-white text-slate-900 border-slate-100 rounded-tl-none'
            : 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-indigo-500/10'
        }`}
      >
        <div className="flex justify-between items-center mb-3 gap-6">
          <div className="flex items-center space-x-2">
            {isBot && (
              <img 
                src="https://i.postimg.cc/YC2MXrVy/Whats-App-Image-2026-01-05-at-2.jpg" 
                alt="Bot Avatar" 
                className="h-5 w-5 rounded-full object-cover border border-indigo-500/30"
              />
            )}
            <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isBot ? (isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : 'text-indigo-200'}`}>
              {isBot ? 'TTT JNAN ChatBot' : (userName || '')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] opacity-40 font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        {message.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-md">
            <img 
              src={`data:${message.image.mimeType};base64,${message.image.data}`} 
              alt="Uploaded content" 
              className="max-w-full h-auto object-contain max-h-[300px]"
            />
          </div>
        )}

        <div className="text-[15px] md:text-[17px] leading-relaxed whitespace-pre-wrap">
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <textarea 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-black/10 dark:bg-white/10 p-3 rounded-xl border-none focus:ring-1 focus:ring-white/50 text-[15px]"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsEditing(false)} className="text-[11px] uppercase font-bold opacity-60">Cancel</button>
                <button onClick={handleSaveEdit} className="text-[11px] uppercase font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg">Update</button>
              </div>
            </div>
          ) : (
            renderFormattedText(message.content)
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-all">
        {isBot && (
          <button
            onClick={takeScreenshot}
            className={`p-2.5 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
              isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600'
            }`}
            title="Capture Snippet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
        {!isBot && onEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`p-2.5 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
              isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600'
            }`}
            title="Edit Message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(message.id)}
          className={`p-2.5 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 text-red-400/60 hover:text-red-500`}
          title="Delete Message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
