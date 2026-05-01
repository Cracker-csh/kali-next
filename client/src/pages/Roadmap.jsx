import React, { useState, useEffect } from 'react';
import roadmapData from '../data/roadmap.json';
import { CheckCircle2, Circle, ChevronDown, RefreshCw, Languages, ExternalLink, PlayCircle, CheckSquare, Map } from 'lucide-react';

const RoadmapVideo = ({ vid }) => {
  const [status, setStatus] = useState('loading'); // loading, loaded, error

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        setStatus('error');
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row h-auto sm:h-28 group hover:border-blue-600 hover:shadow-sm transition-all">
      <div className="w-full sm:w-48 h-32 sm:h-full bg-gray-50 relative shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200">
        
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {status === 'error' ? (
          <div className="absolute inset-0 w-full h-full bg-black/5">
            <img 
              src={`https://img.youtube.com/vi/${vid.video_id}/hqdefault.jpg`} 
              alt={vid.title} 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
              <a 
                href={`https://youtube.com/watch?v=${vid.video_id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white text-red-600 p-2 rounded-full shadow-md transition-transform hover:scale-105"
                title="Watch on YouTube"
              >
                <PlayCircle size={20} />
              </a>
            </div>
          </div>
        ) : (
          <iframe 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
            src={vid.youtube_url}
            title={vid.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          ></iframe>
        )}
      </div>
      
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h5 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{vid.title}</h5>
          <span className="text-xs text-gray-400 mt-1 block">{vid.channel_name}</span>
        </div>
        <a 
          href={`https://youtube.com/watch?v=${vid.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1.5 mt-2 sm:mt-0 w-max bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 hover:border-blue-600 transition-colors font-medium"
        >
          <ExternalLink size={14} /> Open on YouTube
        </a>
      </div>
    </div>
  );
};

export default function Roadmap() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedPhase, setExpandedPhase] = useState('phase0');
  const [lang, setLang] = useState('en');

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kali_roadmap_progress');
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse roadmap progress');
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kali_roadmap_progress', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const markAllComplete = (phase, e) => {
    e.stopPropagation();
    const phaseTaskIds = phase.tasks.map(t => t.id);
    setCompletedTasks(prev => {
      const otherTasks = prev.filter(id => !phaseTaskIds.includes(id));
      return [...otherTasks, ...phaseTaskIds];
    });
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all your progress?')) {
      setCompletedTasks([]);
    }
  };

  // Calculate global progress
  const totalTasks = roadmapData.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const globalProgressPercent = Math.round((completedTasks.length / totalTasks) * 100) || 0;

  return (
    <div className="max-w-5xl mx-auto py-6 font-sans text-gray-900">
      
      {/* Top Bar: Headers & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600-light flex items-center justify-center text-blue-600">
              <Map size={20} />
            </span>
            Kali Linux Zero to Hero
          </h1>
          <p className="text-gray-600 text-sm max-w-xl leading-relaxed mt-3">
            A comprehensive 10-phase roadmap to master offensive security and ethical hacking. Follow the path, complete tasks, and track your journey.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-5 w-full md:w-auto">
          {/* Controls */}
          <div className="flex gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-blue-600 text-gray-600 hover:text-blue-600 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Languages size={14} />
              {lang === 'en' ? 'Switch to Hinglish' : 'Switch to English'}
            </button>
            <button 
              onClick={resetProgress}
              className="flex items-center gap-2 bg-red-50 border border-red-600/20 hover:border-red-600 text-red-600 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          {/* Progress Display */}
          <div className="text-right w-full">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Overall Progress</span>
              <span className="text-xl font-bold text-blue-600">{globalProgressPercent}%</span>
            </div>
            <div className="text-xs text-gray-600 mb-2.5 text-right font-medium">{completedTasks.length} / {totalTasks} Completed</div>
            <div className="w-full md:w-64 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-700 ease-out"
                style={{ width: `${globalProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {roadmapData.map((phase, index) => {
          const phaseTasksIds = phase.tasks.map(t => t.id);
          const completedInPhase = phaseTasksIds.filter(id => completedTasks.includes(id)).length;
          const totalInPhase = phaseTasksIds.length;
          const isExpanded = expandedPhase === phase.id;
          const isFullyCompleted = completedInPhase === totalInPhase;

          return (
            <div 
              key={phase.id} 
              className={`card transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-gray-200 shadow-md' : 'hover:border-gray-300'
              }`}
            >
              {/* Phase Header (Clickable) */}
              <div 
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className={`p-5 cursor-pointer flex items-center justify-between relative overflow-hidden group ${isFullyCompleted ? 'bg-green-50' : 'bg-white'}`}
              >
                {/* Active Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isFullyCompleted ? 'bg-success' : 'bg-blue-600'} ${isExpanded || isFullyCompleted ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 pl-2">
                  <div className="flex-1">
                    <h3 className={`text-base md:text-lg font-bold transition-colors ${isFullyCompleted ? 'text-green-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
                      {phase.phase}
                    </h3>
                    <div className="flex gap-4 mt-1 text-xs text-gray-400 font-medium">
                      <span>Duration: {phase.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-3 md:mt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium text-gray-600">{completedInPhase} / {totalInPhase} Tasks</span>
                      <div className="w-24 h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isFullyCompleted ? 'bg-success' : 'bg-blue-600'}`} 
                          style={{ width: `${(completedInPhase / totalInPhase) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                  
                  {/* Description & Tags */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed bg-white p-4 rounded-xl border border-gray-200">
                      {phase.description[lang]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-medium bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Tasks List */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          <CheckSquare size={18} className="text-blue-600" /> Learning Tasks
                        </h4>
                        {!isFullyCompleted && (
                          <button 
                            onClick={(e) => markAllComplete(phase, e)}
                            className="text-xs text-blue-600 hover:text-blue-600-hover transition-colors font-medium hover:underline"
                          >
                            Mark all complete
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2.5">
                        {phase.tasks.map(task => {
                          const isDone = completedTasks.includes(task.id);
                          return (
                            <div 
                              key={task.id} 
                              onClick={() => toggleTask(task.id)}
                              className={`flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group bg-white shadow-sm hover:shadow-md ${
                                isDone 
                                  ? 'border-green-600/30 bg-green-50/50' 
                                  : 'border-gray-200 hover:border-blue-600/50'
                              }`}
                            >
                              <div className="shrink-0 transition-transform group-active:scale-90 flex items-center justify-center">
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-border group-hover:text-blue-600 transition-colors" />
                                )}
                              </div>
                              <span className={`text-sm transition-colors ${
                                isDone ? 'text-gray-400 line-through' : 'text-gray-900 font-medium group-hover:text-blue-600'
                              }`}>
                                {task.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommended Videos */}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-4">
                        <PlayCircle size={18} className="text-red-600" /> Recommended Videos
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {phase.videos.map((vid, idx) => (
                          <RoadmapVideo key={idx} vid={vid} />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
