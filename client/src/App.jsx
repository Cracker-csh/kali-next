import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Terminal, Bot, BookOpen, FileText, Wrench, Map, ShieldAlert } from 'lucide-react';

import ToolExplorer from './pages/ToolExplorer';
import AICyberAssistant from './pages/AICyberAssistant';
import KaliLearn from './pages/KaliLearn';
import WordlistGenerator from './pages/WordlistGenerator';
import ToolsPage from './components/Tools/ToolsPage';
import Roadmap from './pages/Roadmap';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Sidebar Navigation */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col hidden md:flex shadow-sm">
          <div className="px-5 py-5 border-b border-gray-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">CyberLearn</h1>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Security Toolkit</span>
            </div>
          </div>
          
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={<Terminal size={18} />} label="Tool Explorer" />
            <NavItem to="/ai-assistant" icon={<Bot size={18} />} label="AI Assistant" />
            <NavItem to="/learn" icon={<BookOpen size={18} />} label="Kali Learn" />
            <NavItem to="/wordlist" icon={<FileText size={18} />} label="Wordlists" />
            <NavItem to="/tools" icon={<Wrench size={18} />} label="Tools" />
            <NavItem to="/roadmap" icon={<Map size={18} />} label="Roadmap" />
          </nav>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <ShieldAlert className="text-amber-600 w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">For educational purposes only. Do not use tools on unauthorized targets.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Header */}
          <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6 justify-between shadow-sm">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Terminal className="text-white w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-gray-900 text-sm">CyberLearn</span>
            </div>
            <div className="hidden md:flex flex-1"></div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="text-xs font-medium">System Online</span>
              <div className="w-2 h-2 rounded-full bg-success"></div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50">
            <Routes>
              <Route path="/" element={<ToolExplorer />} />
              <Route path="/ai-assistant" element={<AICyberAssistant />} />
              <Route path="/learn" element={<KaliLearn />} />
              <Route path="/wordlist" element={<WordlistGenerator />} />
              <Route path="/tools" element={<ToolsPage />} />
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
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
          isActive 
            ? 'bg-blue-600-light text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default App;
