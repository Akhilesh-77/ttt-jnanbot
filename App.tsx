import React, { useState, useRef, useEffect } from 'react';
import { Message, Theme, BotState, ActiveView } from './types';
import { geminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import AskTeachers from './components/AskTeachers';

const ACADEMY_LOGO = "https://tttacademy.in/NOMS/files/images/static/Main-logo.png";
const BOT_ICON = "https://tttacademy.in/NOMS/JnanBot/files/images/static/chat_bot.png";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('jnan_auth') === 'true');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [botState, setBotState] = useState<BotState>(BotState.IDLE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const saved = localStorage.getItem('jnan_chat_history');
    const lastClear = localStorage.getItem('jnan_last_clear');
    const now = new Date().getTime();

    if (lastClear && now - parseInt(lastClear) > 86400000) {
      localStorage.removeItem('jnan_chat_history');
      localStorage.setItem('jnan_last_clear', now.toString());
      setMessages([]);
    } else if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error("History sync error");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jnan_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fluid scrolling: User can always scroll manually
  // Using behavior 'auto' to prevent smooth-scroll thread locking during DOM mutations
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || botState === BotState.LOADING) {
      // Auto-scroll on new content, but allow user manual control
      scrollToBottom();
    }
  }, [messages.length, botState]);

  const handleLogin = () => {
    localStorage.setItem('jnan_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.clear();
      setIsAuthenticated(false);
      setMessages([]);
      setInput('');
      setIsMenuOpen(false);
      setActiveView('chat');
      window.location.reload();
    }
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const editUserMessage = async (id: string, newContent: string) => {
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return;

    const updatedHistory = messages.slice(0, index);
    const updatedUserMsg: Message = { ...messages[index], content: newContent, timestamp: new Date() };
    
    const newContext = [...updatedHistory, updatedUserMsg];
    setMessages(newContext);
    setBotState(BotState.LOADING);

    try {
      const botResponse = await geminiService.sendMessage(newContent, updatedHistory);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Regeneration failed", error);
    } finally {
      setBotState(BotState.IDLE);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || botState === BotState.LOADING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBotState(BotState.LOADING);

    const botResponse = await geminiService.sendMessage(input, messages);
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: botResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMsg]);
    setBotState(BotState.IDLE);
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    setActiveView('chat');
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex flex-col h-screen items-center justify-center p-6 text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <img src={BOT_ICON} alt="Bot Icon" className="w-24 h-24 mb-6 animate-bounce" />
        <h1 className="text-4xl font-black mb-2 text-indigo-500">TTT JNAN ChatBot</h1>
        <p className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-8">DCET ASPIRANT PORTAL</p>
        <button 
          onClick={handleLogin}
          className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all text-xl"
        >
          Enter ChatBot
        </button>
      </div>
    );
  }

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* SOLID SIDE MENU - Fixed Bug 2 by ensuring menu-solid class is applied without overrides */}
      <aside className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-500 ease-out menu-solid shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-500">JNAN Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[15px] transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-6">
            <button 
              onClick={() => { setActiveView('ask-teachers'); setIsMenuOpen(false); }}
              className="w-full flex items-center space-x-3 p-4 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all font-bold text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Ask Teachers</span>
            </button>

            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 pt-4">Recent Conversations</p>
            {filteredMessages.slice().reverse().map(m => (
              <div key={m.id} className="group flex items-center justify-between p-3.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 transition-colors">
                <span className="text-[14px] font-semibold truncate w-48">{m.content.replace(/\*\*/g, '').slice(0, 40)}...</span>
                <button onClick={() => deleteMessage(m.id)} className="p-1 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-600/10 text-red-600 rounded-xl font-bold text-base hover:bg-red-600 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="flex-none flex items-center justify-between py-4 px-6 glass border-b transition-all z-30">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-black/5 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className={`p-1.5 rounded-2xl border-2 transition-all hidden sm:flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'border-white/40' : 'border-black'}`}>
            <img src={ACADEMY_LOGO} alt="Academy Logo" className="h-8 md:h-10 object-contain" />
          </div>
        </div>

        <button 
          onClick={startNewChat}
          className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden xs:inline">New Chat</span>
        </button>

        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-600'}`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l-.707.707m12.728 12.728l-.707.707M6.343 17.657l-.707-.707M17.657 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto relative px-4 md:px-0 overflow-hidden">
        {activeView === 'chat' ? (
          <>
            {/* Bug 1 Fix: Stable scroll container without scroll-smooth behavior to prevent UI locks */}
            <main className="flex-1 overflow-y-auto scroll-stable pt-8 pb-4 space-y-4 scrollbar-hide">
              {messages.length === 0 && !input ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-700">
                  <img src={BOT_ICON} alt="Bot Icon" className="w-28 h-28 md:w-36 md:h-36 mb-6 drop-shadow-2xl animate-bounce" />
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Ask to TTT JnanBot 👋</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm">Hey DCET ASPIRANT! How can I help you?</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isDarkMode={theme === 'dark'} 
                    onDelete={deleteMessage}
                    onEdit={msg.role === 'user' ? editUserMessage : undefined}
                  />
                ))
              )}
              
              {botState === BotState.LOADING && (
                <div className="flex flex-col items-start mb-8 animate-pulse">
                  <div className={`p-5 rounded-2xl rounded-tl-none ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-slate-100'}`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-6 w-full" />
            </main>

            <footer className="flex-none py-6 mt-auto">
              <div className="p-[2px] rounded-3xl bg-gradient-to-r from-[#9b5cff] to-[#c77dff] shadow-xl focus-within:shadow-[0_0_15px_rgba(155,92,255,0.5)] transition-shadow">
                <div className={`relative group rounded-[22px] glass flex flex-col transition-all ${theme === 'dark' ? 'bg-slate-900/90' : 'bg-white/90'}`}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                    placeholder="Ask any DCET related doubt..."
                    className="w-full bg-transparent border-none focus:ring-0 text-[15px] md:text-[17px] py-4 px-6 resize-none max-h-40 min-h-[64px] leading-relaxed scrollbar-hide"
                    rows={1}
                    disabled={botState === BotState.LOADING}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || botState === BotState.LOADING}
                    className={`absolute right-3 bottom-3 p-3.5 rounded-2xl transition-all shadow-xl ${
                      !input.trim() || botState === BotState.LOADING
                        ? 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                        : 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/40'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-[0.2em] mt-3">Verified TTTJNAN CHATBOT • DR. SAVINA JP</p>
            </footer>
          </>
        ) : (
          <div className="py-8 h-full overflow-y-auto scroll-stable scrollbar-hide">
            <AskTeachers isDarkMode={theme === 'dark'} onBack={() => setActiveView('chat')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;