import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Terminal, Bot, BookOpen, FileText, Wrench, Map, ShieldAlert } from 'lucide-react';

import ToolExplorer from './pages/ToolExplorer';
import AICyberAssistant from './pages/AICyberAssistant';
import KaliLearn from './pages/KaliLearn';
import WordlistGenerator from './pages/WordlistGenerator';
import UtilityTools from './pages/UtilityTools';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-cyber-dark overflow-hidden font-sans">
        {/* Sidebar Navigation */}
        <aside className="w-64 glass-panel border-r border-gray-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <Terminal className="text-cyber-green w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold text-white neon-text">Cyber<span className="text-cyber-green">Learn</span></h1>
              <span className="text-xs text-cyber-muted font-mono tracking-widest">OSINT & RECON</span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem to="/" icon={<Terminal size={20} />} label="Tool Explorer" />
            <NavItem to="/ai-assistant" icon={<Bot size={20} />} label="AI Assistant" />
            <NavItem to="/learn" icon={<BookOpen size={20} />} label="Kali Learn" />
            <NavItem to="/wordlist" icon={<FileText size={20} />} label="Wordlists" />
            <NavItem to="/utilities" icon={<Wrench size={20} />} label="Utilities" />
            <NavItem to="/roadmap" icon={<Map size={20} />} label="Roadmap" />
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-start gap-2 text-xs text-cyber-muted bg-cyber-darker p-3 rounded border border-gray-800">
              <ShieldAlert className="text-yellow-500 w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>For educational purposes only. Do not use tools on unauthorized targets.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Header Mobile / Search placeholder */}
          <header className="h-16 border-b border-gray-800 bg-cyber-light/50 backdrop-blur flex items-center px-6 justify-between">
            <div className="md:hidden flex items-center gap-2">
              <Terminal className="text-cyber-green w-6 h-6" />
              <span className="font-bold neon-text">CyberLearn</span>
            </div>
            <div className="hidden md:flex flex-1"></div>
            <div className="flex items-center gap-4 text-sm text-cyber-muted font-mono">
              <span>SYSTEM: ONLINE</span>
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            <Routes>
              <Route path="/" element={<ToolExplorer />} />
              <Route path="/ai-assistant" element={<AICyberAssistant />} />
              <Route path="/learn" element={<KaliLearn />} />
              <Route path="/wordlist" element={<WordlistGenerator />} />
              <Route path="/utilities" element={<UtilityTools />} />
              <Route path="/roadmap" element={<Roadmap />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 ${
          isActive 
            ? 'bg-cyber-darker border-l-4 border-cyber-green text-cyber-green shadow-[inset_0_0_15px_rgba(0,255,65,0.1)]' 
            : 'text-gray-400 hover:bg-cyber-light hover:text-white hover:border-l-4 hover:border-gray-500 border-l-4 border-transparent'
        }`
      }
    >
      {icon}
      <span className="font-medium font-mono text-sm uppercase tracking-wide">{label}</span>
    </NavLink>
  );
}

export default App;
