import React, { useState } from 'react';
import { toolsConfig } from './toolsConfig';
import { ChevronRight, Settings } from 'lucide-react';

export default function ToolSidebar({ activeTool, setActiveTool }) {
  const [expandedCat, setExpandedCat] = useState(toolsConfig[0].category);

  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2 border-b border-gray-200 pb-3">
          <Settings className="text-gray-400 w-4 h-4" /> Tool Categories
        </h2>
        
        <div className="flex flex-col gap-2 mt-4">
          {toolsConfig.map(cat => (
            <div key={cat.category} className="flex flex-col">
              <button
                onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-all ${
                  expandedCat === cat.category 
                    ? 'bg-blue-600-light text-blue-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={expandedCat === cat.category ? 'text-blue-600' : 'text-gray-400'}>{cat.icon}</span> 
                  {cat.category}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedCat === cat.category ? 'rotate-90 text-blue-600' : 'text-gray-400'}`} />
              </button>
              
              {expandedCat === cat.category && (
                <div className="flex flex-col gap-1 mt-1.5 pl-4 border-l-2 border-gray-200 ml-4 py-1">
                  {cat.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool)}
                      className={`text-left text-xs py-2 px-3 rounded-md transition-colors ${
                        activeTool?.id === tool.id
                          ? 'text-blue-600 bg-blue-600-light font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
