import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface WolfSignalProps {
    value: string; // The URL or Data to encode
    size?: number;
    fgColor?: string; // Foreground color (default yellow-500)
    bgColor?: string; // Background color (default transparent/black)
}

export const WolfSignal: React.FC<WolfSignalProps> = ({
    value,
    size = 128,
    fgColor = "#EAB308", // Yellow-500
    bgColor = "transparent"
}) => {
    return (
        <div className="p-4 bg-black border-2 border-yellow-600 rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] relative inline-block group">
            {/* Corner Markers for Tactical Look */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-500"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-500"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-500"></div>

            <QRCodeSVG
                value={value}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H" // High error correction
                includeMargin={false}
                className="group-hover:opacity-80 transition-opacity cursor-pointer"
            />

            <div className="mt-2 text-center">
                <p className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest animate-pulse">Scanning...</p>
            </div>
        </div>
    );
};
