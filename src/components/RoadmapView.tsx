import React from 'react';
import { PRELOADED_TASKS } from '../data/TaskData';

interface RoadmapViewProps {
  userRole: string;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ userRole }) => {
  // Mock active users on steps
  const activeUsers = [
    { id: 'u1', name: 'You', step: 2, avatar: 'https://ui-avatars.com/api/?name=You&background=FFD700&color=000' },
    { id: 'u2', name: 'Maverick', step: 5, avatar: 'https://ui-avatars.com/api/?name=Maverick&background=333&color=FFF' },
    { id: 'u3', name: 'Viper', step: 12, avatar: 'https://ui-avatars.com/api/?name=Viper&background=333&color=FFF' },
    { id: 'u4', name: 'Goose', step: 2, avatar: 'https://ui-avatars.com/api/?name=Goose&background=333&color=FFF' },
    { id: 'u5', name: 'Iceman', step: 8, avatar: 'https://ui-avatars.com/api/?name=Iceman&background=333&color=FFF' },
  ];

  // Calculate task load per user (mock)
  const userTaskLoad = {
    'u1': 2,
    'u2': 4, // Over-tasked
    'u3': 1,
    'u4': 5, // Over-tasked
    'u5': 3
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#FFD700] uppercase tracking-widest mb-2">
              Tactical Roadmap
            </h1>
            <p className="text-gray-400 text-sm">
              Visualizing the 40-step ascent. Monitor pack progress and load.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>OPTIMAL LOAD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span>OVER-TASKED</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFD700] via-gray-800 to-gray-900"></div>

          <div className="space-y-12">
            {PRELOADED_TASKS.map((task, index) => {
              const stepNumber = index + 1;
              const usersOnStep = activeUsers.filter(u => u.step === stepNumber);
              const isEven = index % 2 === 0;

              return (
                <div key={task.id} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Step Marker */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-black border-2 border-[#FFD700] rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                    <span className="text-[#FFD700] text-xs font-bold">{stepNumber}</span>
                  </div>

                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 w-full md:w-[calc(50%-3rem)] ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-[#111] border border-gray-800 p-4 rounded-lg hover:border-gray-600 transition-colors group">
                      <h3 className="text-[#FFD700] font-bold text-lg mb-1 group-hover:text-white transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      {/* Active Users on this Step */}
                      {usersOnStep.length > 0 && (
                        <div className={`flex items-center gap-2 mt-3 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                          {usersOnStep.map(user => (
                            <div key={user.id} className="relative group/avatar">
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className={`
                                  w-8 h-8 rounded-full border-2 
                                  ${userTaskLoad[user.id as keyof typeof userTaskLoad] > 3 ? 'border-red-500' : 'border-green-500'}
                                `}
                              />
                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-gray-700 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-20">
                                {user.name} • {userTaskLoad[user.id as keyof typeof userTaskLoad]} Tasks
                                {userTaskLoad[user.id as keyof typeof userTaskLoad] > 3 && <span className="text-red-500 ml-1">⚠</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block w-[calc(50%-3rem)]"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
