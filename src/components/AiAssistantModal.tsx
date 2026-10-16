import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, RotateCcw, Sparkles, Terminal, ChevronRight } from 'lucide-react';
import AnsahLogo from './AnsahLogo';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const PRESET_QUERIES = [
  'What are your primary software engineering stacks?',
  'What scale of CCTV infrastructure do you deploy?',
  'Can you detail your commercial solar PV installations?',
  'How do I hire ANSAH Technology for a project?',
];

export default function AiAssistantModal({ isOpen, onClose, theme = 'light' }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Greetings. I am the ANSAH Technology AI Technical Assistant. Ask me anything about our software engineering systems (C/C++, C#, WebGL), CCTV surveillance infrastructure, or solar photovoltaic deployments.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Send chat history for context
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        role: 'model',
        text: data.reply || 'No response returned from the agent.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('AI Assistant Error:', err);
      const fallbackMessage: Message = {
        id: 'err-' + Date.now(),
        role: 'model',
        text: 'ANSAH Technology specializes in low-level systems (C/C++, C#, WebGL/Three.js) and physical hardware infrastructure (Commercial 4K IP CCTV, rooftop Solar PV arrays, and embedded STM32 firmware). For immediate inquiries, contact ansahmbanginu@gmail.com.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        text: 'Session reset. What engineering questions can I assist you with?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full sm:max-w-xl h-[85vh] sm:h-[620px] bg-white dark:bg-[#121212] border border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#171717] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnsahLogo variant="mark" size={26} color={theme === 'dark' ? '#ffffff' : '#0a0a0a'} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">ANSAH AI Agent</span>
                <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-neutral-200/70 dark:bg-neutral-800 px-1.5 py-0.2">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                Technical inquiry &amp; architecture advisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/30 dark:bg-[#0c0c0c]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 mb-1 px-1">
                {msg.role === 'user' ? 'Client' : 'ANSAH Agent'} &middot; {msg.timestamp}
              </div>

              <div
                className={`max-w-[85%] text-xs sm:text-sm p-3.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border border-neutral-900 dark:border-white'
                    : 'bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                <span>Formulating technical answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Questions Drawer */}
        {messages.length <= 3 && !isLoading && (
          <div className="px-4 py-2 bg-neutral-100/60 dark:bg-[#171717] border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
              Suggested Technical Queries
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSendMessage(preset)}
                  className="text-left text-[11px] px-2.5 py-1 bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-[#121212] border-t border-neutral-200 dark:border-neutral-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about software, CCTV topologies, solar PV..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-600" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono mt-1.5 px-1">
            <span>Powered by Gemini 3.8 Flash via server proxy</span>
            <span>Press Enter to dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
