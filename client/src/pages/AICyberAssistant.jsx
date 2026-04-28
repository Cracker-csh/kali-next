import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Sparkles } from 'lucide-react';
import axios from 'axios';

const SUGGESTIONS = [
  "Explain SQL Injection step by step.",
  "How do I use nmap for a stealth scan?",
  "What is the difference between TCP and UDP?",
  "Give me an example of a simple reverse shell."
];

export default function AICyberAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'SYSTEM ONLINE. I am your CyberLearn AI Assistant. How can I help you with your security learning today?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const userMsg = { role: 'user', content: text, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { prompt: text });
      const aiResponse = res.data.response;
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString() }]);
      setIsLoading(false);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'ERROR: Unable to communicate with AI core.', timestamp: new Date().toLocaleTimeString() }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel rounded-lg overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-cyber-darker flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-dark border border-cyber-green rounded-full shadow-[0_0_10px_rgba(0,255,65,0.2)]">
            <Cpu className="text-cyber-green w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white font-mono flex items-center gap-2">
              Neural<span className="text-cyber-green">Core</span>
            </h2>
            <p className="text-xs text-cyber-green font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></span>
              AI Assistant Active
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${
              msg.role === 'user' ? 'bg-cyber-dark border-gray-600' : 'bg-cyber-darker border-cyber-green shadow-[0_0_10px_rgba(0,255,65,0.2)]'
            }`}>
              {msg.role === 'user' ? <User className="text-gray-400 w-5 h-5" /> : <Bot className="text-cyber-green w-5 h-5" />}
            </div>
            
            <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-mono">{msg.timestamp}</span>
                <span className="text-xs font-bold font-mono text-gray-400 uppercase">{msg.role}</span>
              </div>
              <div className={`p-4 rounded-lg text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyber-light border border-gray-700 text-white rounded-tr-none' 
                  : 'bg-[#0d1511] border border-[#004d0c] text-green-50 rounded-tl-none font-mono shadow-[inset_0_0_20px_rgba(0,255,65,0.02)]'
              }`}>
                {/* Basic rendering of markdown-like syntax for mock */}
                {msg.content.split('\\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line.split('`').map((part, j) => 
                      j % 2 === 1 ? <code key={j} className="bg-black text-cyber-green px-1 py-0.5 rounded text-sm">{part}</code> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border bg-cyber-darker border-cyber-green">
              <Bot className="text-cyber-green w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-[#0d1511] border border-[#004d0c] p-4 rounded-lg rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 bg-cyber-green rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-cyber-darker">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((sug, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isLoading}
              className="text-xs flex items-center gap-1 font-mono px-3 py-1.5 bg-cyber-dark border border-gray-700 text-gray-400 rounded-full hover:border-cyber-green hover:text-cyber-green transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" /> {sug}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 bg-cyber-dark border border-gray-700 rounded-lg focus-within:border-cyber-green focus-within:shadow-[0_0_10px_rgba(0,255,65,0.1)] transition-all overflow-hidden p-2">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Query the Neural Core..."
              className="w-full bg-transparent text-white focus:outline-none resize-none font-mono text-sm max-h-32 min-h-[44px]"
              rows={1}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-cyber-green text-black rounded-lg hover:bg-[#00cc33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_10px_rgba(0,255,65,0.3)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
