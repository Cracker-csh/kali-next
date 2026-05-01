import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Shield, Globe, Terminal, Wifi, AlertTriangle, Eye, Bug, Key, Radio, Network, Crosshair, Skull, HardDrive, FileText, Cpu, Users, Lock, Zap, CircuitBoard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toolsData from '../data/tools.json';

const CATEGORY_ICONS = {
  'Information Gathering': Globe,
  'Vulnerability Analysis': Bug,
  'Web Application Analysis': Eye,
  'Password Attacks': Key,
  'Wireless Attacks': Radio,
  'Sniffing & Spoofing': Network,
  'Exploitation Tools': Crosshair,
  'Post Exploitation': Skull,
  'Forensics': HardDrive,
  'Reporting Tools': FileText,
  'Reverse Engineering': Cpu,
  'Social Engineering': Users,
  'Maintaining Access': Lock,
  'Stress Testing': Zap,
  'Hardware Hacking': CircuitBoard,
};

const ALL_TOOLS = toolsData.categories.flatMap(cat =>
  cat.tools.map((tool, idx) => ({
    ...tool,
    id: tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + idx,
    icon: CATEGORY_ICONS[tool.category] || Terminal,
  }))
);

const CATEGORIES = ['All', ...toolsData.categories.map(c => c.name)];

export default function ToolExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(ALL_TOOLS[0]);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                            tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const ToolIcon = selectedTool.icon;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="card p-4 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-blue-600 w-5 h-5" /> Tool Arsenal
            <span className="text-xs text-gray-400 ml-auto font-normal">{ALL_TOOLS.length} tools</span>
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="card rounded-xl flex-1 overflow-y-auto">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-all ${
                  selectedTool.id === tool.id 
                    ? 'bg-blue-600-light border-l-3 border-l-primary' 
                    : 'hover:bg-gray-50 border-l-3 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedTool.id === tool.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-600'}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
                      <span className="text-xs text-gray-400">{tool.category}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedTool.id === tool.id ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </div>
            );
          })}
          {filteredTools.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              No tools found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="w-full md:w-2/3 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedTool.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="card p-6 rounded-xl flex-1 overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600-light border border-blue-600/20 rounded-xl text-blue-600">
                  <ToolIcon size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedTool.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2.5 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600">
                      {selectedTool.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                      selectedTool.risk_level === 'High' ? 'bg-red-50 border-red-600/20 text-red-600' : 
                      selectedTool.risk_level === 'Medium' ? 'bg-amber-50 border-amber-600/20 text-amber-600' :
                      'bg-green-50 border-green-600/20 text-green-600'
                    }`}>
                      Risk: {selectedTool.risk_level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{selectedTool.description}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Installation</h3>
                  <code className="block w-full p-3 bg-gray-50 rounded-lg text-blue-600 font-mono text-sm overflow-x-auto border border-gray-200">
                    $ {selectedTool.installation}
                  </code>
                </section>
                
                <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Basic Syntax</h3>
                  <code className="block w-full p-3 bg-gray-50 rounded-lg text-amber-600 font-mono text-sm overflow-x-auto border border-gray-200">
                    $ {selectedTool.syntax}
                  </code>
                </section>
              </div>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Common Commands</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-200">Command</th>
                        <th className="px-4 py-3 border-b border-gray-200">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTool.commands.map((cmd, idx) => (
                        <tr key={idx} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-blue-600 whitespace-nowrap text-sm">{cmd.cmd}</td>
                          <td className="px-4 py-3 text-gray-600">{cmd.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Use Cases</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTool.use_cases.map((uc, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"></div>
                      {uc}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
