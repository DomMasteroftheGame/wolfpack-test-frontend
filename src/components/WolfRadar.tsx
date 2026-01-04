import React, { useMemo, useState } from 'react';
import * as d3 from 'd3-shape';
import { Task, TaskStatus } from '../types';

interface WolfRadarProps {
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
    onDistressSignal?: () => void;
}

const WolfRadar: React.FC<WolfRadarProps> = ({ tasks, onTaskClick, onDistressSignal }) => {
    const innerRadius = 80;
    const outerRadius = 160;
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);

    // Data Segments (40 Steps)
    const segments = useMemo(() => {
        const arcGen = d3.arc<any, any>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .padAngle(0.02)
            .cornerRadius(2);

        return Array.from({ length: 40 }, (_, i) => {
            const step = i + 1;
            const startAngle = (i / 40) * 2 * Math.PI;
            const endAngle = ((i + 1) / 40) * 2 * Math.PI;

            const task = tasks.find(t => t.step_number === step);
            const isDone = task?.status === TaskStatus.DONE;
            const isDoing = task?.status === TaskStatus.IN_PROGRESS;
            const pace = task?.pace || 'walk';

            // Tactical Color System
            let color = '#0f172a'; // Default (Slate-900/Deep Void)
            let filterId = '';
            let stroke = 'rgba(255,255,255,0.05)';

            if (isDone) {
                color = '#EAB308'; // Gold (The Feast)
                filterId = 'url(#glow-gold)';
                stroke = '#FCD34D';
            } else if (isDoing) {
                if (pace === 'run') {
                    color = '#DC2626'; // Red (High Heat - 24 Hours)
                    filterId = 'url(#glow-red)';
                    stroke = '#EF4444';
                } else if (pace === 'walk') {
                    color = '#F97316'; // Orange (Sustainable - 1 Week)
                    filterId = 'url(#glow-orange)';
                    stroke = '#FB923C';
                } else {
                    color = '#3B82F6'; // Blue (Crawl/Stealth - 2 Weeks) - Protocol: Steady Blue
                    filterId = 'url(#glow-blue)';
                    stroke = '#60A5FA';
                }
            } else if (task) {
                // Task exists but is Todo
                color = '#1e293b'; // Slate-800
                stroke = 'rgba(255,255,255,0.1)';
            }

            const midAngle = (startAngle + endAngle) / 2;

            return {
                path: arcGen({ startAngle, endAngle })!,
                color,
                filterId,
                stroke,
                step,
                task,
                isDoing,
                pace,
                midAngle
            };
        });
    }, [tasks]);

    const hoveredData = useMemo(() => {
        if (hoveredStep === null) return null;
        return segments.find(s => s.step === hoveredStep);
    }, [hoveredStep, segments]);

    // Stamina Calculation (Strain Algorithm)
    const staminaPoints = useMemo(() => {
        const activeTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
        return activeTasks.reduce((acc, t) => {
            const pacePoints = t.pace === 'run' ? 3 : t.pace === 'walk' ? 2 : 1;
            return acc + pacePoints;
        }, 0);
    }, [tasks]);

    const staminaStatus = useMemo(() => {
        // Tailwind classes for borders/text colors can be dynamic
        if (staminaPoints >= 9) return { label: 'OVERLOAD', colorClass: 'text-red-500 border-red-500 shadow-red-500/50', barColor: 'bg-red-500', pulse: true };
        if (staminaPoints >= 6) return { label: 'STRAIN', colorClass: 'text-yellow-500 border-yellow-500 shadow-yellow-500/50', barColor: 'bg-yellow-500', pulse: false }; // Protocol: Static Yellow
        return { label: 'OPTIMAL', colorClass: 'text-blue-500 border-blue-500 shadow-blue-500/50', barColor: 'bg-blue-500', pulse: false }; // Protocol: Steady Blue
    }, [staminaPoints]);

    return (
        <div className="flex flex-col items-center justify-center py-8 w-full max-w-md mx-auto">
            <div className="relative w-full aspect-square">
                {/* Main SVG */}
                <svg viewBox="0 0 450 450" className="w-full h-full rotate-0 overflow-visible">
                    <defs>
                        {/* Glow Filters */}
                        <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="translate(225, 225)">
                        {segments.map((seg, i) => (
                            <g key={i} className="transition-opacity duration-300">
                                <path
                                    d={seg.path}
                                    fill={seg.color}
                                    stroke={seg.stroke}
                                    strokeWidth="1"
                                    filter={seg.isDoing ? seg.filterId : undefined}
                                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 opacity-90 ${seg.isDoing && seg.pace === 'run' ? 'animate-pulse' : ''}`}
                                    onClick={() => seg.task && onTaskClick?.(seg.task)}
                                    onMouseEnter={() => setHoveredStep(seg.step)}
                                    onMouseLeave={() => setHoveredStep(null)}
                                />
                                {/* Step Number */}
                                <text
                                    transform={`translate(${Math.cos(seg.midAngle - Math.PI / 2) * (outerRadius + 15)}, ${Math.sin(seg.midAngle - Math.PI / 2) * (outerRadius + 15)})`}
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    className="fill-gray-600 text-[8px] font-mono pointer-events-none select-none"
                                >
                                    {seg.step}
                                </text>

                                {/* Blips (Active Users/Self) */}
                                {seg.isDoing && (
                                    <circle
                                        cx={Math.cos(seg.midAngle - Math.PI / 2) * ((innerRadius + outerRadius) / 2)}
                                        cy={Math.sin(seg.midAngle - Math.PI / 2) * ((innerRadius + outerRadius) / 2)}
                                        r={3}
                                        fill="#FFF"
                                        className="animate-ping opacity-75"
                                    />
                                )}
                                {seg.isDoing && (
                                    <circle
                                        cx={Math.cos(seg.midAngle - Math.PI / 2) * ((innerRadius + outerRadius) / 2)}
                                        cy={Math.sin(seg.midAngle - Math.PI / 2) * ((innerRadius + outerRadius) / 2)}
                                        r={2}
                                        fill="#FFF"
                                    />
                                )}
                            </g>
                        ))}
                    </g>
                </svg>

                {/* Center Console (Bio-Monitor) */}
                <div
                    onClick={onDistressSignal}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gray-950 border-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform z-10 ${staminaStatus.pulse ? 'animate-pulse' : ''} ${staminaStatus.colorClass.split(' ').filter(c => c.startsWith('border') || c.startsWith('shadow')).join(' ')}`}
                    style={{ boxShadow: staminaStatus.pulse ? `0 0 20px` : `0 0 10px` }}
                >
                    <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">BIO-MONITOR</div>
                    <div className="text-4xl font-black text-white leading-none">{staminaPoints}</div>
                    <div className="text-[9px] text-gray-400 font-mono mb-2">STRAIN</div>

                    {/* Health Bar */}
                    <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${staminaStatus.barColor}`}
                            style={{
                                width: `${Math.min((staminaPoints / 12) * 100, 100)}%`
                            }}
                        ></div>
                    </div>

                    <div className={`text-[10px] font-bold tracking-widest mt-2 ${staminaStatus.colorClass.split(' ').find(c => c.startsWith('text'))}`}>
                        {staminaStatus.label}
                    </div>
                </div>

                {/* Tooltip */}
                {hoveredData && hoveredData.task && (
                    <div className="absolute top-0 right-0 z-50 w-48 bg-gray-950 border border-yellow-600/50 p-3 rounded shadow-2xl pointer-events-none backdrop-blur-md bg-opacity-90">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-xs text-yellow-500 font-mono">STEP {hoveredData.step}</div>
                            <div className={`w-2 h-2 rounded-full ${hoveredData.isDoing ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}></div>
                        </div>

                        <div className="text-sm font-bold text-white mb-2 leading-tight">{hoveredData.task.title}</div>
                        <div className="flex gap-2 text-[10px] font-mono uppercase">
                            <span className="text-gray-400">{hoveredData.task.status.replace('_', ' ')}</span>
                            {hoveredData.pace && (
                                <span className={
                                    hoveredData.pace === 'run' ? 'text-red-500' :
                                        hoveredData.pace === 'walk' ? 'text-orange-500' :
                                            'text-blue-500' // Protocol: Blue
                                }>{hoveredData.pace}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend / HUD Footer */}
            <div className="flex justify-between w-full px-4 mt-4 border-t border-gray-800 pt-4">
                <div className="text-center group cursor-help">
                    <div className="text-[10px] font-bold text-yellow-500 tracking-[0.2em] mb-1 group-hover:text-yellow-400 transition-colors">BUILD</div>
                    <div className="text-[8px] text-gray-600 font-mono">SEC 01-14</div>
                </div>
                <div className="text-center group cursor-help">
                    <div className="text-[10px] font-bold text-blue-500 tracking-[0.2em] mb-1 group-hover:text-blue-400 transition-colors">MEASURE</div>
                    <div className="text-[8px] text-gray-600 font-mono">SEC 15-28</div>
                </div>
                <div className="text-center group cursor-help">
                    <div className="text-[10px] font-bold text-red-500 tracking-[0.2em] mb-1 group-hover:text-red-400 transition-colors">LEARN</div>
                    <div className="text-[8px] text-gray-600 font-mono">SEC 29-40</div>
                </div>
            </div>
        </div>
    );
};

export default WolfRadar;
