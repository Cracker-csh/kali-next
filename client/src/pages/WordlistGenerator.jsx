import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Settings, FileText, Copy, Check, Type, Hash, GitMerge, List, Box } from 'lucide-react';
import { generateRandom, generatePattern, generateMutate, generateCombine, generatePresets } from '../utils/generator';

export default function WordlistGenerator() {
  const [mode, setMode] = useState('random'); // random, pattern, mutate, combine, presets
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordlist, setWordlist] = useState([]);
  const [copied, setCopied] = useState(false);

  // Global modifiers
  const [minLen, setMinLen] = useState(4);
  const [maxLen, setMaxLen] = useState(32);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');

  // Random Mode State
  const [randomOpts, setRandomOpts] = useState({
    useLower: true, useUpper: false, useNumbers: true, useSymbols: false,
    customChars: '', length: 8, count: 50
  });

  // Pattern Mode State
  const [patternOpts, setPatternOpts] = useState({
    pattern: 'admin@@@', count: 50
  });

  // Mutate Mode State
  const [mutateOpts, setMutateOpts] = useState({
    words: 'admin\npassword',
    transforms: { case: true, leet: true, numbers: true, years: true, symbols: true, reverse: false, duplicate: false }
  });

  // Combine Mode State
  const [combineOpts, setCombineOpts] = useState({
    words: 'admin\n123\nlogin\ntest',
    separators: { none: true, underscore: true, dash: true, plus: false }
  });

  // Presets Mode State
  const [presetOpts, setPresetOpts] = useState({
    seasonal: true, tech: true, email: false, company: false, names: false
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Use setTimeout to allow UI to update to loading state
    setTimeout(() => {
      let results = [];
      const globalOpts = { minLen, maxLen, prefix, suffix };

      try {
        if (mode === 'random') {
          results = generateRandom({ ...randomOpts, ...globalOpts });
        } else if (mode === 'pattern') {
          results = generatePattern({ ...patternOpts, ...globalOpts });
        } else if (mode === 'mutate') {
          results = generateMutate({ 
            words: mutateOpts.words.split('\n').map(w => w.trim()).filter(Boolean), 
            transforms: mutateOpts.transforms,
            ...globalOpts 
          });
        } else if (mode === 'combine') {
          const seps = [];
          if (combineOpts.separators.none) seps.push('');
          if (combineOpts.separators.underscore) seps.push('_');
          if (combineOpts.separators.dash) seps.push('-');
          if (combineOpts.separators.plus) seps.push('+');
          
          results = generateCombine({
            words: combineOpts.words.split('\n').map(w => w.trim()).filter(Boolean),
            separators: seps.length > 0 ? seps : [''],
            ...globalOpts
          });
        } else if (mode === 'presets') {
          const activePresets = Object.keys(presetOpts).filter(k => presetOpts[k]);
          results = generatePresets({ presetKeys: activePresets, ...globalOpts });
        }

        // Apply global length filter if not already applied internally 
        if (mode === 'random' || mode === 'pattern') {
           results = results.filter(w => w.length >= minLen && w.length <= maxLen);
        }

        setWordlist(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const downloadWordlist = () => {
    if (wordlist.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([wordlist.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `wordlist_${mode}_${wordlist.length}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyWordlist = () => {
    if (wordlist.length === 0) return;
    navigator.clipboard.writeText(wordlist.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes = [
    { id: 'random', icon: <Hash size={16} />, label: 'Random' },
    { id: 'pattern', icon: <Type size={16} />, label: 'Pattern' },
    { id: 'mutate', icon: <RefreshCw size={16} />, label: 'Mutate' },
    { id: 'combine', icon: <GitMerge size={16} />, label: 'Combine' },
    { id: 'presets', icon: <Box size={16} />, label: 'Presets' },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      
      {/* ─── Sidebar Controls ─── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5 overflow-y-auto pr-2 pb-4">
        
        {/* Mode Selector */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings className="text-gray-400 w-4 h-4" /> Generator Mode
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                  mode === m.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-surface'
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Specific Settings */}
        <div className="card p-5">
          
          {/* 1. RANDOM MODE */}
          {mode === 'random' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Random Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={randomOpts.useLower} onChange={e => setRandomOpts({...randomOpts, useLower: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Lower (a-z)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={randomOpts.useUpper} onChange={e => setRandomOpts({...randomOpts, useUpper: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Upper (A-Z)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={randomOpts.useNumbers} onChange={e => setRandomOpts({...randomOpts, useNumbers: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={randomOpts.useSymbols} onChange={e => setRandomOpts({...randomOpts, useSymbols: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Symbols (!@#)</span>
                </label>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Custom Characters</label>
                <input type="text" value={randomOpts.customChars} onChange={e => setRandomOpts({...randomOpts, customChars: e.target.value})} placeholder="e.g. ñçáé" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Length ({randomOpts.length})</label>
                  <input type="range" min="1" max="64" value={randomOpts.length} onChange={e => setRandomOpts({...randomOpts, length: parseInt(e.target.value)})} className="w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Count ({randomOpts.count})</label>
                  <input type="range" min="1" max="5000" value={randomOpts.count} onChange={e => setRandomOpts({...randomOpts, count: parseInt(e.target.value)})} className="w-full" />
                </div>
              </div>
            </div>
          )}

          {/* 2. PATTERN MODE */}
          {mode === 'pattern' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Pattern Settings</h3>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Pattern String</label>
                <input type="text" value={patternOpts.pattern} onChange={e => setPatternOpts({...patternOpts, pattern: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm transition-all font-mono" />
                <div className="mt-2 text-[10px] text-gray-400 grid grid-cols-2 gap-1.5 p-2 bg-gray-50 rounded border border-gray-200">
                  <span>@ = lowercase</span>
                  <span>, = uppercase</span>
                  <span>% = numbers</span>
                  <span>^ = special chars</span>
                  <span>* = alphanumeric</span>
                  <span>text = literal</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Count ({patternOpts.count})</label>
                <input type="range" min="1" max="5000" value={patternOpts.count} onChange={e => setPatternOpts({...patternOpts, count: parseInt(e.target.value)})} className="w-full" />
              </div>
            </div>
          )}

          {/* 3. MUTATE MODE */}
          {mode === 'mutate' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Mutate Settings</h3>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Base Words (one per line)</label>
                <textarea rows="4" value={mutateOpts.words} onChange={e => setMutateOpts({...mutateOpts, words: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm resize-none font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(mutateOpts.transforms).map(t => (
                  <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={mutateOpts.transforms[t]} onChange={e => setMutateOpts({...mutateOpts, transforms: {...mutateOpts.transforms, [t]: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-600 text-xs font-medium capitalize group-hover:text-gray-900 transition-colors">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 4. COMBINE MODE */}
          {mode === 'combine' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Combine Settings</h3>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Words to Combine (one per line)</label>
                <textarea rows="4" value={combineOpts.words} onChange={e => setCombineOpts({...combineOpts, words: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm resize-none font-mono" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Separators</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={combineOpts.separators.none} onChange={e => setCombineOpts({...combineOpts, separators: {...combineOpts.separators, none: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">None</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={combineOpts.separators.underscore} onChange={e => setCombineOpts({...combineOpts, separators: {...combineOpts.separators, underscore: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Underscore (_)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={combineOpts.separators.dash} onChange={e => setCombineOpts({...combineOpts, separators: {...combineOpts.separators, dash: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Dash (-)</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={combineOpts.separators.plus} onChange={e => setCombineOpts({...combineOpts, separators: {...combineOpts.separators, plus: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-600 text-xs font-medium group-hover:text-gray-900 transition-colors">Plus (+)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 5. PRESETS MODE */}
          {mode === 'presets' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">Presets Settings</h3>
              <p className="text-xs text-gray-400">Select target dictionaries. Variations will be generated automatically.</p>
              <div className="flex flex-col gap-2">
                {Object.keys(presetOpts).map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-600/50 transition-colors">
                    <input type="checkbox" checked={presetOpts[t]} onChange={e => setPresetOpts({...presetOpts, [t]: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="text-gray-900 font-medium text-sm capitalize">{t} Base Words</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Modifiers */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Global Modifiers</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Prefix</label>
                <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="admin_" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Suffix</label>
                <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="_2024" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Min Length: {minLen}</label>
                <input type="range" min="1" max="64" value={minLen} onChange={e => setMinLen(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Max Length: {maxLen}</label>
                <input type="range" min="1" max="64" value={maxLen} onChange={e => setMaxLen(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Output Area ─── */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        {/* Output Toolbar */}
        <div className="card p-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600-light rounded-lg flex items-center justify-center text-blue-600">
              <List className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-gray-900">Wordlist Output</h2>
            <span className="text-xs font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200">
              {wordlist.length} words
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-600-hover transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate List
              </button>
          </div>
        </div>

        {/* Console / Output List */}
        <div className="card flex-1 relative overflow-hidden bg-gray-50 flex flex-col min-h-[400px]">
          
          <div className="flex justify-end p-2 bg-white border-b border-gray-200 gap-2">
            <button 
              onClick={copyWordlist}
              disabled={wordlist.length === 0}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-600-light rounded-md transition-colors disabled:opacity-30"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
            <button 
              onClick={downloadWordlist}
              disabled={wordlist.length === 0}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-600-light rounded-md transition-colors disabled:opacity-30"
              title="Download .txt"
            >
              <Download size={16} />
            </button>
          </div>

          {wordlist.length > 0 ? (
             <div className="p-5 overflow-y-auto font-mono text-sm text-gray-900 whitespace-pre-wrap leading-relaxed h-full">
               {wordlist.join('\n')}
             </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none mt-10">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Configure parameters and click Generate.</p>
              <p className="text-xs mt-2 opacity-60">Max limit: 5000 words</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
