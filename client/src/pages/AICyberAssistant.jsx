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
    { role: 'ai', content: 'Hello! I am your CyberLearn AI Assistant. How can I help you with your security learning today?', timestamp: new Date().toLocaleTimeString() }
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
      const res = await axios.post('/api/ai/chat', { prompt: text });
      const aiResponse = res.data.response;
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString() }]);
      setIsLoading(false);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.error || 'Unable to communicate with AI. Make sure the server is running.';
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage, timestamp: new Date().toLocaleTimeString() }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Cpu className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Assistant</h2>
            <p className="text-xs text-green-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-blue-600 shadow-sm'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-sm'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1.5 last:mb-0">
                    {line.split('`').map((part, j) => 
                      j % 2 === 1 ? <code key={j} className="bg-gray-50 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono">{part}</code> : part
                    )}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-blue-600 shadow-sm">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((sug, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(sug)}
              disabled={isLoading}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" /> {sug}
            </button>
          ))}
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10 transition-all overflow-hidden px-3 py-2">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask anything about cybersecurity..."
              className="w-full bg-transparent text-gray-900 focus:outline-none resize-none text-sm max-h-32 min-h-[40px]"
              rows={1}
            />
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-600-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
