import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

interface MissionReportProps {
    cardName: string;
    phase: string;
    onClose: () => void;
}

const MissionReport: React.FC<MissionReportProps> = ({ cardName, phase, onClose }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const captureAndShare = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            backgroundColor: '#000000',
            scale: 2,
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File([blob], 'mission-report.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Mission Report: Phase Complete',
                        text: `PHASE ${phase} COMPLETE. PROCEEDING TO NEXT STAGE.`,
                    });
                } catch (err) {
                    console.error('Share failed', err);
                }
            } else {
                // Fallback: Download the image
                const link = document.createElement('a');
                link.download = 'mission-report.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full">
                {/* The Capture Area */}
                <div
                    ref={reportRef}
                    className="bg-black border-[4px] border-yellow-500 p-8 text-center relative overflow-hidden"
                    style={{ width: '400px', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"></div>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-yellow-500 font-black text-3xl uppercase tracking-[6px]">Mission Report</h2>
                        <div className="h-0.5 bg-yellow-500 w-1/2 mx-auto mt-1"></div>
                    </div>

                    <div className="my-8">
                        <p className="text-gray-500 text-[10px] uppercase tracking-[3px] mb-2 font-bold">Phase {phase} Complete</p>
                        <h3 className="text-white text-xl font-bold uppercase tracking-wide px-4">{cardName}</h3>
                    </div>

                    <div className="mt-4">
                        <p className="text-yellow-500/50 font-mono text-[8px] uppercase tracking-[2px]">Status: Kill Confirmed / Market Secured</p>
                    </div>

                    <div className="absolute bottom-4 right-4 opacity-50">
                        <img
                            src={window.pwaThemeVariables?.gameAssets?.logoGold || ""}
                            alt="Wolfpack"
                            className="w-8 h-8"
                            onError={(e) => {
                                // Fallback if variable is missing, though this will still 404 if not on root
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-700 text-gray-400 py-3 rounded uppercase text-xs font-bold hover:bg-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={captureAndShare}
                        className="flex-1 bg-yellow-500 text-black py-3 rounded uppercase text-xs font-bold hover:bg-yellow-400 transition-colors"
                    >
                        Report Success
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionReport;
