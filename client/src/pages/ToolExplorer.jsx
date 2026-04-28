import React, { useState } from 'react';
import { Search, ChevronRight, AlertTriangle, Shield, Wifi, Globe, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOOLS_DATA = [
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'Scanning',
    icon: <Globe size={24} />,
    risk: 'Medium',
    description: 'Network exploration tool and security / port scanner. Used to discover hosts and services on a computer network by sending packets and analyzing the responses.',
    installation: 'sudo apt install nmap',
    syntax: 'nmap [Scan Type(s)] [Options] {target specification}',
    commands: [
      { cmd: 'nmap -sS 192.168.1.1', desc: 'TCP SYN scan (stealth)' },
      { cmd: 'nmap -A 10.0.0.1', desc: 'Aggressive scan (OS, versions, scripts)' },
      { cmd: 'nmap -p 1-65535 127.0.0.1', desc: 'Scan all 65535 ports' }
    ],
    useCases: ['Network mapping', 'Port scanning', 'Vulnerability detection', 'Service discovery']
  },
  {
    id: 'amass',
    name: 'Amass',
    category: 'Recon',
    icon: <Search size={24} />,
    risk: 'Low',
    description: 'In-depth Attack Surface Mapping and Asset Discovery tool. Performs network mapping of attack surfaces and external asset discovery using open source information gathering and active reconnaissance techniques.',
    installation: 'sudo apt install amass',
    syntax: 'amass enum [options] -d [domain]',
    commands: [
      { cmd: 'amass enum -d example.com', desc: 'Basic enumeration' },
      { cmd: 'amass enum -passive -d example.com', desc: 'Passive discovery only' },
    ],
    useCases: ['Subdomain enumeration', 'Asset discovery', 'OSINT']
  },
  {
    id: 'metasploit',
    name: 'Metasploit',
    category: 'Exploitation',
    icon: <Terminal size={24} />,
    risk: 'High',
    description: 'A penetration testing framework that makes hacking simple. It provides information about security vulnerabilities and aids in penetration testing and IDS signature development.',
    installation: 'sudo apt install metasploit-framework',
    syntax: 'msfconsole',
    commands: [
      { cmd: 'search [keyword]', desc: 'Search for exploits/modules' },
      { cmd: 'use [module]', desc: 'Select a module to use' },
      { cmd: 'set RHOSTS [ip]', desc: 'Set target IP address' },
      { cmd: 'exploit', desc: 'Execute the payload' }
    ],
    useCases: ['Vulnerability validation', 'Security assessments', 'Exploit development']
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    category: 'Analysis',
    icon: <Wifi size={24} />,
    risk: 'Low',
    description: "The world's foremost and widely-used network protocol analyzer. It lets you see what's happening on your network at a microscopic level.",
    installation: 'sudo apt install wireshark',
    syntax: 'wireshark [options] [infile]',
    commands: [
      { cmd: 'wireshark -i eth0', desc: 'Capture on interface eth0' },
      { cmd: 'wireshark -r file.pcap', desc: 'Read from pcap file' }
    ],
    useCases: ['Traffic analysis', 'Packet sniffing', 'Troubleshooting']
  }
];

const CATEGORIES = ['All', 'Recon', 'Scanning', 'Exploitation', 'Analysis'];

export default function ToolExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(TOOLS_DATA[0]);

  const filteredTools = TOOLS_DATA.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-4">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Shield className="text-cyber-green" /> Tool Arsenal
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cyber-darker border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-cyber-green font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-xs font-mono rounded border ${
                  activeCategory === cat 
                    ? 'bg-cyber-green/20 border-cyber-green text-cyber-green' 
                    : 'bg-cyber-darker border-gray-700 text-gray-400 hover:border-gray-500'
                } transition-colors`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-lg flex-1 overflow-y-auto">
          {filteredTools.map(tool => (
            <div 
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-all ${
                selectedTool.id === tool.id 
                  ? 'bg-cyber-darker border-l-4 border-l-cyber-green' 
                  : 'hover:bg-cyber-light border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyber-dark rounded-md text-cyber-green">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white font-mono">{tool.name}</h3>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{tool.category}</span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${selectedTool.id === tool.id ? 'text-cyber-green' : 'text-gray-600'}`} />
              </div>
            </div>
          ))}
          {filteredTools.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-6 rounded-lg flex-1 overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-darker border border-gray-700 rounded-lg text-cyber-green neon-border">
                  {selectedTool.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white font-mono tracking-tight">{selectedTool.name}</h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-0.5 bg-cyber-dark border border-gray-700 rounded text-xs text-gray-400 font-mono">
                      {selectedTool.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                      selectedTool.risk === 'High' ? 'bg-red-900/30 border-red-500 text-red-500' : 
                      selectedTool.risk === 'Medium' ? 'bg-yellow-900/30 border-yellow-500 text-yellow-500' :
                      'bg-green-900/30 border-green-500 text-green-500'
                    }`}>
                      RISK: {selectedTool.risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 font-mono">
                  <span className="text-cyber-green">#</span> Description
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {selectedTool.description}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-cyber-darker p-4 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider font-mono">Installation</h3>
                  <code className="block w-full p-3 bg-black rounded text-cyber-green font-mono text-sm overflow-x-auto">
                    $ {selectedTool.installation}
                  </code>
                </section>
                
                <section className="bg-cyber-darker p-4 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider font-mono">Basic Syntax</h3>
                  <code className="block w-full p-3 bg-black rounded text-yellow-400 font-mono text-sm overflow-x-auto">
                    $ {selectedTool.syntax}
                  </code>
                </section>
              </div>

              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 font-mono">
                  <span className="text-cyber-green">#</span> Common Commands
                </h3>
                <div className="overflow-x-auto border border-gray-800 rounded-lg">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-cyber-darker text-xs uppercase text-gray-400 font-mono">
                      <tr>
                        <th className="px-4 py-3 border-b border-gray-800">Command</th>
                        <th className="px-4 py-3 border-b border-gray-800">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTool.commands.map((cmd, idx) => (
                        <tr key={idx} className="border-b border-gray-800/50 hover:bg-cyber-light/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-cyber-green whitespace-nowrap">{cmd.cmd}</td>
                          <td className="px-4 py-3">{cmd.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 font-mono">
                  <span className="text-cyber-green">#</span> Use Cases
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTool.useCases.map((uc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-green"></div>
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
