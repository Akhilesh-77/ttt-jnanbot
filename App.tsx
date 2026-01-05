
import React, { useState, useRef, useEffect } from 'react';
import { Message, Theme, BotState, ActiveView } from './types';
import { geminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import AskTeachers from './components/AskTeachers';
import AboutTTT from './components/AboutTTT';
import LoginPage from './components/LoginPage';
import PWAInstallBanner from './components/PWAInstallBanner';

const ACADEMY_LOGO = "https://tttacademy.in/NOMS/files/images/static/Main-logo.png";
const BOT_ICON = "https://i.postimg.cc/YC2MXrVy/Whats-App-Image-2026-01-05-at-2.jpg";

const SUBJECTS = ["Mathematics", "Statistics", "PMS", "IT Skills", "FEEE"];

const App: React.FC = () => {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('jnan_is_logged_in') === 'true');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    return window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('pwa_installed') === 'true';
  });

  // App UI States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [botState, setBotState] = useState<BotState>(BotState.IDLE);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  
  // Visual Viewport Height for Mobile Keyboard Fix
  const [visualHeight, setVisualHeight] = useState<string | number>('100dvh');

  // Image Understanding States
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Name Personalization State
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('jnan_user_name'));
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle Visual Viewport Resizing (Mobile Keyboard)
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      // Use the actual height of the visual viewport to prevent keyboard overlay
      setVisualHeight(window.visualViewport ? window.visualViewport.height : '100dvh');
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    handleResize(); // Initial check

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser from showing automatic bar
      e.preventDefault();
      // Save event to trigger manually later
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      // Set permanent install state
      localStorage.setItem('pwa_installed', 'true');
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa_installed', 'true');
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    } else {
      setShowInstallBanner(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
  };

  const triggerInstallUI = () => {
    if (deferredPrompt) {
      setShowInstallBanner(true);
    } else if (isInstalled) {
      alert("TTT JNAN is already installed!");
    } else {
      alert("App installation is not available in your current browser.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const promptSeen = localStorage.getItem('jnan_prompt_seen');
    if (!userName && !promptSeen) {
      setIsNameModalOpen(true);
    }

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

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || botState === BotState.LOADING) {
      scrollToBottom();
    }
  }, [messages.length, botState]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.removeItem('jnan_is_logged_in');
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      setActiveView('chat');
    }
  };

  const handleSaveName = () => {
    const val = tempName.trim();
    if (val) {
      setUserName(val);
      localStorage.setItem('jnan_user_name', val);
    } else {
      setUserName(null);
      localStorage.removeItem('jnan_user_name');
    }
    localStorage.setItem('jnan_prompt_seen', 'true');
    setIsNameModalOpen(false);
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
    setLoadingStatus('');

    try {
      const botResponse = await geminiService.sendMessage(newContent, updatedHistory, undefined, setLoadingStatus);
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
      setLoadingStatus('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        data: base64String,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || botState === BotState.LOADING) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (selectedImage ? "[Attached Image Analysis]" : ""),
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setBotState(BotState.LOADING);
    setLoadingStatus('');

    const botResponse = await geminiService.sendMessage(
      currentInput || "Analyze this image for DCET content.", 
      messages, 
      currentImage || undefined,
      setLoadingStatus
    );
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: botResponse,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMsg]);
    setBotState(BotState.IDLE);
    setLoadingStatus('');
  };

  const handleSubjectTab = (subject: string) => {
    const prefix = `In ${subject}: `;
    let currentInput = input;
    SUBJECTS.forEach(s => {
      const oldPrefix = `In ${s}: `;
      if (currentInput.startsWith(oldPrefix)) {
        currentInput = currentInput.slice(oldPrefix.length);
      }
    });
    
    setInput(prefix + currentInput);
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    setSelectedImage(null);
    setActiveView('chat');
  };

  // Focus trigger for mobile keyboard visibility
  const handleInputFocus = () => {
    if (window.innerWidth < 768) {
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 300); // Wait for keyboard expansion animation
    }
  };

  // Only show manual button if app isn't installed and the browser supports it
  const canShowInstallButton = !isInstalled && deferredPrompt !== null;

  const containerStyle = {
    height: typeof visualHeight === 'number' ? `${visualHeight}px` : visualHeight,
  };

  if (!isAuthenticated) {
    return (
      <div 
        style={containerStyle}
        className={`transition-colors duration-300 min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}
      >
        {/* Banner only appears if manual button was clicked */}
        {showInstallBanner && (
          <PWAInstallBanner 
            isDarkMode={theme === 'dark'} 
            onInstall={handleInstallApp} 
            onDismiss={handleDismissInstall} 
          />
        )}
        <LoginPage 
          theme={theme} 
          onLoginSuccess={() => setIsAuthenticated(true)} 
          showInstallButton={canShowInstallButton}
          onInstallClick={triggerInstallUI}
        />
      </div>
    );
  }

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      style={containerStyle}
      className={`flex flex-col overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      
      {isNameModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsNameModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-[320px] p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-1">Enter your name</h3>
            <p className="text-xs text-slate-500 mb-4">How should the JNAN Bot greet you?</p>
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <div className="flex space-x-3">
              <button 
                onClick={() => { setIsNameModalOpen(false); localStorage.setItem('jnan_prompt_seen', 'true'); }}
                className="flex-1 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
              >
                Skip
              </button>
              <button 
                onClick={handleSaveName}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-500 ease-out menu-solid shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-indigo-500">JNAN Menu</h2>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => { setIsNameModalOpen(true); setTempName(userName || ''); }}
                className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                title="Edit Name"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
              className="w-full flex items-center space-x-3 p-4 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all font-bold text-base shadow-sm"
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

          <div className="mt-auto space-y-2">
            <button 
              onClick={() => { setActiveView('about'); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-base hover:bg-indigo-600 hover:text-white transition-all border border-indigo-600/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About TTT</span>
            </button>

            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-600/10 text-red-600 rounded-xl font-bold text-base hover:bg-red-600 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
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

        <div className="flex items-center space-x-2">
          {/* Manual Install Button in Header - disappears permanently after install */}
          {canShowInstallButton && (
            <button 
              onClick={triggerInstallUI}
              className="hidden xs:flex items-center space-x-2 px-4 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Install App</span>
            </button>
          )}

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
        </div>
      </header>

      {/* Global Install Banner - Shows when manual button is triggered */}
      {!isInstalled && showInstallBanner && (
        <div className="z-50 max-w-4xl w-full mx-auto">
          <PWAInstallBanner 
            isDarkMode={theme === 'dark'} 
            onInstall={handleInstallApp} 
            onDismiss={handleDismissInstall} 
          />
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto relative px-4 md:px-0 overflow-hidden">
        {activeView === 'chat' ? (
          <>
            <main className="flex-1 overflow-y-auto scroll-stable pt-4 md:pt-8 pb-4 space-y-4 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 p-4">
                  <img src={BOT_ICON} alt="Bot Icon" className="w-24 h-24 md:w-36 md:h-36 mb-6 drop-shadow-2xl animate-bounce rounded-3xl object-cover" />
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-2">Ask to TTT JnanBot 👋</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                    {userName 
                      ? `Hey ${userName}! How can I help you with DCET?` 
                      : "Hey DCET ASPIRANT! How can I help you?"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    isDarkMode={theme === 'dark'} 
                    onDelete={deleteMessage}
                    onEdit={msg.role === 'user' ? editUserMessage : undefined}
                    userName={userName || undefined}
                  />
                ))
              )}
              
              {botState === BotState.LOADING && (
                <div className="flex flex-col items-start mb-8 animate-pulse px-4">
                  <div className={`p-4 rounded-2xl rounded-tl-none ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-slate-100'}`}>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                      </div>
                      {loadingStatus && (
                        <p className="text-[11px] font-bold text-indigo-500 animate-in fade-in duration-300">
                          {loadingStatus}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4 w-full" />
            </main>

            <footer className="flex-none py-3 md:py-6 mt-auto">
              {/* Image Preview Container */}
              {selectedImage && (
                <div className="px-4 mb-4 animate-in slide-in-from-bottom-4">
                  <div className="relative inline-block group">
                    <img 
                      src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                      className="h-20 w-20 object-cover rounded-xl border-2 border-indigo-500 shadow-lg" 
                      alt="Selected preview"
                    />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3 px-1 overflow-x-auto scrollbar-hide whitespace-nowrap pb-1">
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubjectTab(sub)}
                    className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold border transition-all ${
                      input.startsWith(`In ${sub}: `)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-indigo-600/10 text-indigo-600 border-indigo-600/20 hover:bg-indigo-600/20'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="p-[2px] rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#9b5cff] to-[#c77dff] shadow-xl focus-within:shadow-[0_0_15px_rgba(155,92,255,0.4)] transition-shadow">
                <div className={`relative group rounded-[20px] md:rounded-[22px] glass flex items-center transition-all ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                  {/* Image Upload Icon - Left Side */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={botState === BotState.LOADING}
                    className="p-3.5 ml-1.5 text-indigo-500 hover:scale-110 active:scale-95 transition-all"
                    title="Upload Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <textarea
                    value={input}
                    onFocus={handleInputFocus}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                    placeholder="Ask any DCET related doubt..."
                    className="w-full bg-transparent border-none focus:ring-0 text-[14px] md:text-[17px] py-3.5 md:py-4 px-2 md:px-3 resize-none max-h-32 md:max-h-40 min-h-[56px] md:min-h-[64px] leading-relaxed scrollbar-hide"
                    rows={1}
                    disabled={botState === BotState.LOADING}
                  />
                  
                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || botState === BotState.LOADING}
                    className={`mr-2.5 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl transition-all shadow-lg ${
                      (!input.trim() && !selectedImage) || botState === BotState.LOADING
                        ? 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                        : 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/30'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] text-center text-slate-400 uppercase font-bold tracking-[0.2em] mt-3 pb-1 md:pb-0">Verified TTTJNAN CHATBOT • DR. SAVINA JP</p>
            </footer>
          </>
        ) : activeView === 'ask-teachers' ? (
          <div className="py-4 md:py-8 h-full overflow-y-auto scroll-stable scrollbar-hide">
            <AskTeachers isDarkMode={theme === 'dark'} onBack={() => setActiveView('chat')} />
          </div>
        ) : (
          <div className="py-4 md:py-8 h-full overflow-y-auto scroll-stable scrollbar-hide">
            <AboutTTT isDarkMode={theme === 'dark'} onBack={() => setActiveView('chat')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
