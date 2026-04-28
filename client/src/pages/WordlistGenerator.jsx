import React, { useState } from 'react';
import { Download, RefreshCw, Settings, FileText } from 'lucide-react';

export default function WordlistGenerator() {
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: false,
    numbers: true,
    symbols: false,
    length: 8,
    count: 20,
    prefix: '',
    suffix: ''
  });
  
  const [wordlist, setWordlist] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const generateWordlist = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let chars = '';
      if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.numbers) chars += '0123456789';
      if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'; // Fallback

      const newWordlist = [];
      for (let i = 0; i < options.count; i++) {
        let word = '';
        for (let j = 0; j < options.length; j++) {
          word += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newWordlist.push(`${options.prefix}${word}${options.suffix}`);
      }

      setWordlist(newWordlist);
      setIsGenerating(false);
    }, 500); // Simulate processing time
  };

  const downloadWordlist = () => {
    const element = document.createElement("a");
    const file = new Blob([wordlist.join('\\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "wordlist.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Controls Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2 mb-6">
            <Settings className="text-cyber-green" /> Parameters
          </h2>
          
          <div className="space-y-6">
            {/* Character Sets */}
            <div>
              <h3 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">Character Sets</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="form-checkbox text-cyber-green bg-cyber-dark border-gray-600 focus:ring-cyber-green rounded" checked={options.lowercase} onChange={(e) => handleOptionChange('lowercase', e.target.checked)} />
                  <span className="text-gray-300 font-mono text-sm group-hover:text-white transition-colors">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="form-checkbox text-cyber-green bg-cyber-dark border-gray-600 focus:ring-cyber-green rounded" checked={options.uppercase} onChange={(e) => handleOptionChange('uppercase', e.target.checked)} />
                  <span className="text-gray-300 font-mono text-sm group-hover:text-white transition-colors">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="form-checkbox text-cyber-green bg-cyber-dark border-gray-600 focus:ring-cyber-green rounded" checked={options.numbers} onChange={(e) => handleOptionChange('numbers', e.target.checked)} />
                  <span className="text-gray-300 font-mono text-sm group-hover:text-white transition-colors">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="form-checkbox text-cyber-green bg-cyber-dark border-gray-600 focus:ring-cyber-green rounded" checked={options.symbols} onChange={(e) => handleOptionChange('symbols', e.target.checked)} />
                  <span className="text-gray-300 font-mono text-sm group-hover:text-white transition-colors">Symbols (@#$)</span>
                </label>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Length & Count */}
            <div>
              <h3 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">Dimensions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-mono text-gray-300 mb-1">
                    <span>Base Length</span>
                    <span className="text-cyber-green">{options.length} chars</span>
                  </div>
                  <input type="range" min="4" max="32" value={options.length} onChange={(e) => handleOptionChange('length', parseInt(e.target.value))} className="w-full accent-cyber-green" />
                </div>
                <div>
                  <div className="flex justify-between text-sm font-mono text-gray-300 mb-1">
                    <span>List Size</span>
                    <span className="text-cyber-green">{options.count} items</span>
                  </div>
                  <input type="range" min="10" max="1000" step="10" value={options.count} onChange={(e) => handleOptionChange('count', parseInt(e.target.value))} className="w-full accent-cyber-green" />
                </div>
              </div>
            </div>

            <hr className="border-gray-800" />

            {/* Prefix / Suffix */}
            <div>
              <h3 className="text-sm font-mono text-gray-400 mb-3 uppercase tracking-wider">Modifiers</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-mono mb-1 block">Prefix</label>
                  <input type="text" value={options.prefix} onChange={(e) => handleOptionChange('prefix', e.target.value)} placeholder="e.g. admin_" className="w-full bg-cyber-darker border border-gray-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-cyber-green font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-mono mb-1 block">Suffix</label>
                  <input type="text" value={options.suffix} onChange={(e) => handleOptionChange('suffix', e.target.value)} placeholder="e.g. _2024" className="w-full bg-cyber-darker border border-gray-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-cyber-green font-mono text-sm" />
                </div>
              </div>
            </div>

            <button 
              onClick={generateWordlist}
              disabled={isGenerating}
              className="w-full py-3 bg-cyber-green text-black font-bold font-mono rounded hover:bg-[#00cc33] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,65,0.3)] disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'GENERATING...' : 'GENERATE LIST'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Area */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-lg border border-gray-800 flex justify-between items-center bg-cyber-darker">
          <div className="flex items-center gap-3">
            <FileText className="text-cyber-green" />
            <h2 className="font-bold text-white font-mono">Output.txt</h2>
          </div>
          <button 
            onClick={downloadWordlist}
            disabled={wordlist.length === 0}
            className="px-4 py-2 bg-cyber-dark border border-cyber-green text-cyber-green font-mono text-sm rounded hover:bg-cyber-green hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Download size={16} /> DOWNLOAD
          </button>
        </div>

        <div className="glass-panel rounded-lg border border-gray-800 flex-1 relative overflow-hidden bg-black">
          {wordlist.length > 0 ? (
             <div className="absolute inset-0 p-6 overflow-y-auto font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
               {wordlist.join('\\n')}
             </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 font-mono">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p>Configure parameters and generate to view output.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
