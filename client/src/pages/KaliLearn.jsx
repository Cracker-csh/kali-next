import React, { useState } from 'react';
import { Play, Clock, BarChart, Search } from 'lucide-react';

const VIDEOS = [
  {
    id: 'vid1',
    title: 'Linux Fundamentals for Hackers',
    channel: 'HackerSploit',
    duration: '45:20',
    level: 'Beginner',
    category: 'Linux',
    url: 'https://www.youtube.com/embed/v_1qlD1z0e8?si=Z6W5rYj2nN6X6bK0'
  },
  {
    id: 'vid2',
    title: 'Nmap Tutorial for Beginners',
    channel: 'NetworkChuck',
    duration: '22:15',
    level: 'Beginner',
    category: 'Networking',
    url: 'https://www.youtube.com/embed/4GexMF8-A1k'
  },
  {
    id: 'vid3',
    title: 'Web Application Penetration Testing',
    channel: 'The Cyber Mentor',
    duration: '1:12:05',
    level: 'Intermediate',
    category: 'Web Hacking',
    url: 'https://www.youtube.com/embed/3Kq1MIfTWCE'
  },
  {
    id: 'vid4',
    title: 'Burp Suite Basics',
    channel: 'PortSwigger',
    duration: '34:50',
    level: 'Intermediate',
    category: 'Web Hacking',
    url: 'https://www.youtube.com/embed/T4X1hZ1J_6U'
  }
];

const CATEGORIES = ['All', 'Linux', 'Networking', 'Web Hacking', 'Cryptography'];

export default function KaliLearn() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const filteredVideos = VIDEOS.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterCat === 'All' || v.category === filterCat)
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Video Player Area */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="glass-panel p-2 rounded-lg border border-gray-800 shadow-xl overflow-hidden aspect-video bg-black flex items-center justify-center relative">
          {activeVideo.url ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={activeVideo.url} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="rounded"
            ></iframe>
          ) : (
            <div className="text-cyber-green font-mono flex flex-col items-center">
              <Play className="w-16 h-16 mb-4 opacity-50" />
              <p>VIDEO MODULE OFFLINE</p>
            </div>
          )}
        </div>
        
        <div className="glass-panel p-6 rounded-lg border border-gray-800">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-cyber-darker text-cyber-green border border-cyber-green rounded text-xs font-mono">
              {activeVideo.category}
            </span>
            <span className={`px-2 py-1 bg-cyber-darker border rounded text-xs font-mono ${
              activeVideo.level === 'Beginner' ? 'text-green-400 border-green-400' :
              activeVideo.level === 'Intermediate' ? 'text-yellow-400 border-yellow-400' :
              'text-red-400 border-red-400'
            }`}>
              {activeVideo.level}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-mono">{activeVideo.title}</h1>
          <div className="flex items-center gap-6 text-gray-400 text-sm font-mono mt-4 border-t border-gray-800 pt-4">
            <span className="flex items-center gap-2">
              <User size={16} className="text-cyber-green" /> {activeVideo.channel}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-cyber-green" /> {activeVideo.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Playlist / Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-lg flex flex-col gap-4 border border-gray-800">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <Play className="text-cyber-green" /> Modules
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search modules..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cyber-darker border border-gray-700 rounded py-1.5 pl-9 pr-4 text-white focus:outline-none focus:border-cyber-green font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-2 py-1 text-[10px] uppercase tracking-wider font-mono rounded border ${
                  filterCat === cat 
                    ? 'bg-cyber-green/20 border-cyber-green text-cyber-green' 
                    : 'bg-cyber-darker border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredVideos.map(video => (
            <div 
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${
                activeVideo.id === video.id
                  ? 'bg-cyber-dark border-cyber-green shadow-[inset_0_0_10px_rgba(0,255,65,0.1)]'
                  : 'bg-cyber-light border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="w-24 h-16 bg-black flex-shrink-0 rounded overflow-hidden relative">
                <img src={`https://img.youtube.com/vi/${video.url.split('/').pop().split('?')[0]}/mqdefault.jpg`} alt="thumbnail" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className={`w-6 h-6 ${activeVideo.id === video.id ? 'text-cyber-green' : 'text-white'}`} fill="currentColor" />
                </div>
              </div>
              <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                <h4 className="text-white text-sm font-bold font-mono truncate">{video.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500 truncate">{video.channel}</span>
                  <span className="text-[10px] text-cyber-green font-mono bg-cyber-darker px-1 rounded">{video.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function User({size, className}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
