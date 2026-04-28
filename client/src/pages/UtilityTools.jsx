import React, { useState } from 'react';
import { Hash, Key, Code, Terminal, Activity } from 'lucide-react';

export default function UtilityTools() {
  const [activeTab, setActiveTab] = useState('hash');
  
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex gap-4 border-b border-gray-800 pb-2 overflow-x-auto">
        <TabButton active={activeTab === 'hash'} onClick={() => setActiveTab('hash')} icon={<Hash size={18} />} label="Hash Generator" />
        <TabButton active={activeTab === 'base64'} onClick={() => setActiveTab('base64')} icon={<Code size={18} />} label="Base64 Encoder/Decoder" />
        <TabButton active={activeTab === 'ip'} onClick={() => setActiveTab('ip')} icon={<Activity size={18} />} label="IP Info (Simulated)" />
      </div>

      <div className="glass-panel p-6 rounded-lg border border-gray-800 flex-1">
        {activeTab === 'hash' && <HashTool />}
        {activeTab === 'base64' && <Base64Tool />}
        {activeTab === 'ip' && <IPTool />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-mono text-sm rounded-t-md transition-all ${
        active 
          ? 'bg-cyber-dark border-b-2 border-cyber-green text-cyber-green' 
          : 'text-gray-400 hover:text-white hover:bg-cyber-light'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function HashTool() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('MD5');

  // Simulated hash function for demo purposes
  const generateFakeHash = (text, type) => {
    if (!text) return '';
    const lengths = { 'MD5': 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-512': 128 };
    const len = lengths[type];
    let hash = '';
    const chars = '0123456789abcdef';
    for (let i = 0; i < len; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Make it deterministic for demo by seeding with text length
    return hash.substring(0, len - 2) + (text.length % 16).toString(16) + 'a'; 
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold font-mono text-white mb-4">Cryptographic Hash Generator</h2>
        <p className="text-sm text-gray-400 font-mono mb-6">Note: Simulated for browser demonstration.</p>
        
        <label className="block text-sm font-mono text-cyber-green mb-2">Input String</label>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded p-4 text-white font-mono focus:border-cyber-green focus:outline-none min-h-[100px]"
          placeholder="Enter text to hash..."
        />
      </div>

      <div>
        <label className="block text-sm font-mono text-cyber-green mb-2">Algorithm</label>
        <div className="flex gap-4">
          {['MD5', 'SHA-1', 'SHA-256', 'SHA-512'].map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="hashType" checked={type === t} onChange={() => setType(t)} className="accent-cyber-green" />
              <span className="font-mono text-sm text-gray-300">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-mono text-cyber-green mb-2">Output Digest</label>
        <div className="w-full bg-cyber-darker border border-gray-800 rounded p-4 text-cyber-green font-mono break-all min-h-[60px] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          {input ? generateFakeHash(input, type) : ''}
        </div>
      </div>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
    } catch (e) {
      setOutput('Error: Invalid Input for Decoding');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold font-mono text-white mb-4">Base64 Encoder / Decoder</h2>
      
      <div className="flex gap-4 mb-4">
        <button onClick={() => {setMode('encode'); setOutput('');}} className={`px-4 py-2 font-mono text-sm rounded border ${mode === 'encode' ? 'bg-cyber-green text-black border-cyber-green' : 'border-gray-700 text-gray-400'}`}>Encode</button>
        <button onClick={() => {setMode('decode'); setOutput('');}} className={`px-4 py-2 font-mono text-sm rounded border ${mode === 'decode' ? 'bg-cyber-green text-black border-cyber-green' : 'border-gray-700 text-gray-400'}`}>Decode</button>
      </div>

      <textarea 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-black border border-gray-700 rounded p-4 text-white font-mono focus:border-cyber-green focus:outline-none min-h-[120px]"
        placeholder={`Enter text to ${mode}...`}
      />

      <button onClick={handleProcess} className="px-6 py-2 bg-cyber-dark border border-cyber-green text-cyber-green font-mono rounded hover:bg-cyber-green hover:text-black transition-colors">
        PROCESS
      </button>

      <div className="w-full bg-cyber-darker border border-gray-800 rounded p-4 text-yellow-400 font-mono break-all min-h-[120px]">
        {output}
      </div>
    </div>
  );
}

function IPTool() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold font-mono text-white mb-4">IP Information Lookup</h2>
      <p className="text-sm text-gray-400 font-mono mb-6">Provides details about a target IP address (Simulated data).</p>
      
      <div className="flex gap-4">
        <input type="text" placeholder="e.g. 8.8.8.8" defaultValue="8.8.8.8" className="flex-1 bg-black border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-cyber-green focus:outline-none" />
        <button className="px-6 py-2 bg-cyber-green text-black font-mono rounded hover:bg-[#00cc33] font-bold shadow-[0_0_10px_rgba(0,255,65,0.2)]">
          LOOKUP
        </button>
      </div>

      <div className="mt-8 border border-gray-800 rounded bg-cyber-darker p-1">
        <table className="w-full text-left font-mono text-sm">
          <tbody>
            <tr className="border-b border-gray-800"><td className="p-3 text-gray-500 w-1/3">IP Address</td><td className="p-3 text-cyber-green">8.8.8.8</td></tr>
            <tr className="border-b border-gray-800"><td className="p-3 text-gray-500">Hostname</td><td className="p-3 text-white">dns.google</td></tr>
            <tr className="border-b border-gray-800"><td className="p-3 text-gray-500">ISP / ASN</td><td className="p-3 text-white">AS15169 Google LLC</td></tr>
            <tr className="border-b border-gray-800"><td className="p-3 text-gray-500">Location</td><td className="p-3 text-white">Mountain View, California, US</td></tr>
            <tr><td className="p-3 text-gray-500">Coordinates</td><td className="p-3 text-white">37.3860, -122.0838</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
