import React, { useState } from 'react';
import { CheckCircle2, Circle, Target, Lock, Server } from 'lucide-react';

const ROADMAP_DATA = [
  {
    id: 'phase1',
    title: 'Phase 1: IT Fundamentals',
    icon: <Server size={24} />,
    color: 'border-blue-500 text-blue-500',
    bg: 'bg-blue-500/10',
    tasks: [
      { id: '1a', title: 'Basic Networking (TCP/IP, DNS, HTTP)' },
      { id: '1b', title: 'Linux Command Line Basics' },
      { id: '1c', title: 'Windows OS Internals' }
    ]
  },
  {
    id: 'phase2',
    title: 'Phase 2: Security Basics',
    icon: <Lock size={24} />,
    color: 'border-yellow-500 text-yellow-500',
    bg: 'bg-yellow-500/10',
    tasks: [
      { id: '2a', title: 'Cryptography Concepts (Hashing, Encryption)' },
      { id: '2b', title: 'Access Control (IAM)' },
      { id: '2c', title: 'Intro to Web Vulnerabilities (OWASP Top 10)' }
    ]
  },
  {
    id: 'phase3',
    title: 'Phase 3: Offensive Security',
    icon: <Target size={24} />,
    color: 'border-red-500 text-red-500',
    bg: 'bg-red-500/10',
    tasks: [
      { id: '3a', title: 'Information Gathering (Reconnaissance)' },
      { id: '3b', title: 'Network Scanning & Enumeration (Nmap)' },
      { id: '3c', title: 'Web Application Pentesting (Burp Suite)' },
      { id: '3d', title: 'Exploitation Basics (Metasploit)' }
    ]
  }
];

export default function Roadmap() {
  const [completed, setCompleted] = useState(['1a', '1b']);

  const toggleTask = (taskId) => {
    setCompleted(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const calculateProgress = () => {
    const total = ROADMAP_DATA.reduce((acc, phase) => acc + phase.tasks.length, 0);
    return Math.round((completed.length / total) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono mb-2">Security Learning Path</h1>
          <p className="text-gray-400 font-mono text-sm">Follow the phases to become a proficient cybersecurity professional.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono text-cyber-green">{calculateProgress()}%</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest">Progress</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full mb-12 overflow-hidden border border-gray-700">
        <div 
          className="h-full bg-cyber-green transition-all duration-500 shadow-[0_0_10px_rgba(0,255,65,0.8)]"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
        {ROADMAP_DATA.map((phase, index) => (
          <div key={phase.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline Icon */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${phase.color} ${phase.bg} shadow-[0_0_15px_currentColor] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
              {phase.icon}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-panel p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
              <h3 className={`text-lg font-bold font-mono mb-4 ${phase.color.split(' ')[1]}`}>{phase.title}</h3>
              <div className="space-y-3">
                {phase.tasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 cursor-pointer group/task"
                  >
                    <div className="mt-0.5">
                      {completed.includes(task.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-cyber-green drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 group-hover/task:text-gray-400" />
                      )}
                    </div>
                    <span className={`text-sm font-mono transition-colors ${completed.includes(task.id) ? 'text-gray-500 line-through' : 'text-gray-300 group-hover/task:text-white'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
