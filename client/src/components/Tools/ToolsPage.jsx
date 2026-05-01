import React, { useState, useEffect } from 'react';
import ToolSidebar from './ToolSidebar';
import { toolsConfig } from './toolsConfig';
import { Play, Copy, Check, AlertTriangle, ChevronRight } from 'lucide-react';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState(toolsConfig[0].tools[0]);
  const [input, setInput] = useState('');
  const [regexInput, setRegexInput] = useState(''); // Only used for regex tester
  const [selectOpt, setSelectOpt] = useState('');
  const [output, setOutput] = useState('');
  const [toast, setToast] = useState(null);

  // Reset states when changing tool
  useEffect(() => {
    setInput('');
    setRegexInput('');
    setOutput('');
    if (activeTool.type === 'select' && activeTool.options.length > 0) {
      setSelectOpt(activeTool.options[0]);
    }
  }, [activeTool]);

  // Real-time handler
  useEffect(() => {
    if (activeTool.type === 'realtime') {
      handleAction();
    }
  }, [input]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    showToast('Copied to clipboard!');
  };

  const handleAction = async (actionParam = null) => {
    try {
      let res = '';
      if (activeTool.type === 'select') {
        res = await activeTool.handler(input, selectOpt);
      } else if (activeTool.type === 'action_buttons') {
        res = await activeTool.handler(input, actionParam);
      } else if (activeTool.type === 'button_only') {
        res = await activeTool.handler(actionParam);
      } else if (activeTool.type === 'single_action' || activeTool.type === 'realtime') {
        res = await activeTool.handler(input);
      } else if (activeTool.type === 'base_convert') {
        res = await activeTool.handler(input, 10, 16); 
      } else if (activeTool.type === 'regex_tester') {
        res = await activeTool.handler(regexInput, input);
      }
      setOutput(String(res));
    } catch (e) {
      setOutput(`Error: ${e.message}`);
      showToast('Execution error', 'error');
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium flex items-center gap-2.5 transition-all ${
          toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-600/20' : 'bg-green-50 text-green-600 border-green-600/20'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <Check size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <ToolSidebar activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* Workspace */}
      <div className="w-full lg:w-3/4 flex flex-col gap-5">
        
        {/* Header */}
        <div className="card p-5">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600-light flex items-center justify-center text-blue-600">
              <ChevronRight size={20} />
            </span>
            {activeTool.name}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-5 flex-1">
          {/* Input Section */}
          {!activeTool.noInput && (
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              {activeTool.type === 'regex_tester' && (
                <input
                  type="text"
                  placeholder="Enter regex (e.g. /[a-z]+/gi)"
                  value={regexInput}
                  onChange={(e) => setRegexInput(e.target.value)}
                  className="w-full p-3.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all font-mono"
                />
              )}
              <textarea
                className="w-full flex-1 p-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none resize-none transition-all font-mono"
                placeholder={activeTool.placeholder || "Enter input here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              
              {/* Controls */}
              <div className="flex flex-wrap gap-3">
                {activeTool.type === 'select' && (
                  <div className="flex w-full gap-3">
                    <select
                      value={selectOpt}
                      onChange={(e) => setSelectOpt(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer"
                    >
                      {activeTool.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <button onClick={() => handleAction()} className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-600-hover transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
                      <Play size={16} /> Run
                    </button>
                  </div>
                )}

                {activeTool.type === 'action_buttons' && activeTool.options.map(opt => (
                  <button key={opt} onClick={() => handleAction(opt)} className="flex-1 bg-white border border-blue-600 text-blue-600 font-medium px-4 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors capitalize shadow-sm text-sm">
                    {opt}
                  </button>
                ))}

                {(activeTool.type === 'single_action' || activeTool.type === 'regex_tester') && (
                  <button onClick={() => handleAction()} className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-600-hover transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                    <Play size={18} /> {activeTool.actionLabel || 'Run'}
                  </button>
                )}

                {activeTool.type === 'base_convert' && (
                  <div className="w-full grid grid-cols-2 gap-3">
                    <button onClick={() => {setOutput(activeTool.handler(input, 10, 16));}} className="bg-white border border-gray-200 text-gray-900 font-medium px-3 py-2.5 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-xs shadow-sm">Dec → Hex</button>
                    <button onClick={() => {setOutput(activeTool.handler(input, 16, 10));}} className="bg-white border border-gray-200 text-gray-900 font-medium px-3 py-2.5 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-xs shadow-sm">Hex → Dec</button>
                    <button onClick={() => {setOutput(activeTool.handler(input, 10, 2));}} className="bg-white border border-gray-200 text-gray-900 font-medium px-3 py-2.5 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-xs shadow-sm">Dec → Bin</button>
                    <button onClick={() => {setOutput(activeTool.handler(input, 2, 10));}} className="bg-white border border-gray-200 text-gray-900 font-medium px-3 py-2.5 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors text-xs shadow-sm">Bin → Dec</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special case for button_only tools (no input box) */}
          {activeTool.noInput && (
            <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center items-center bg-gray-50 rounded-xl border border-gray-200 p-8">
              <div className="text-gray-400 text-sm font-medium mb-4 text-center">
                This tool does not require text input.
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {activeTool.options.map(opt => (
                  <button key={opt} onClick={() => handleAction(opt)} className="bg-white border border-gray-200 text-gray-900 font-medium px-6 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors shadow-sm">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Output Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-3 relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={handleCopy} className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-600-light rounded-lg transition-colors shadow-sm" title="Copy Output">
                <Copy size={16} />
              </button>
            </div>
            <textarea
              readOnly
              className={`w-full flex-1 p-5 pt-14 rounded-xl border bg-gray-50 font-mono text-sm outline-none resize-none transition-colors ${
                output.includes('❌') || output.includes('⚠️') || output.startsWith('Error')
                  ? 'border-red-600/30 text-red-600 bg-red-50'
                  : 'border-gray-200 text-gray-900 focus:border-gray-200'
              }`}
              placeholder="Output will appear here..."
              value={output}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
