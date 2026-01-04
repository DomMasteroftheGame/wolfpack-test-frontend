import React, { useState, useEffect } from 'react';
import { GameboardTile } from '../types';

interface GameboardCircleProps {
  tiles: (GameboardTile | null)[];
  className?: string;
}

interface TileSpace {
  id: number;
  x: number;
  y: number;
}

const GameboardCircle: React.FC<GameboardCircleProps> = ({ tiles, className = '' }) => {
  const [boardTileData, setBoardTileData] = useState<Array<{ number: number; name: string; description: string }>>([]);
  const [tileVisibility, setTileVisibility] = useState<boolean[]>(Array(40).fill(false));
  const [isLoading, setIsLoading] = useState(true);

  const numberOfTiles = 40;
  const radiusPercentage = 45;
  const centerXPercentage = 50;
  const centerYPercentage = 50;

  const spaces: TileSpace[] = [];
  for (let i = 0; i < numberOfTiles; i++) {
    const angleDegrees = (-i * (360 / numberOfTiles)) - 90;
    const angleRadians = angleDegrees * (Math.PI / 180);
    const x = centerXPercentage + radiusPercentage * Math.cos(angleRadians);
    const y = centerYPercentage + radiusPercentage * Math.sin(angleRadians);
    if (typeof x === 'number' && typeof y === 'number') {
      spaces.push({ id: i + 1, x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
  }

  useEffect(() => {
    const loadBoardTileData = async () => {
      setIsLoading(true);
      try {
        const data = [
          { number: 1, name: "Ideation", description: "Generate ideas for new products or services" },
          { number: 2, name: "Market Research", description: "Conduct market research to determine viability of ideas" },
          { number: 3, name: "Competitive Analysis", description: "Analyze competitors in the market" },
          { number: 4, name: "Target Market", description: "Determine the target market for the product or service" },
          { number: 5, name: "Unique Selling Proposition", description: "Develop a unique selling proposition for the product or service" },
          { number: 6, name: "Minimum Viable Product", description: "Develop a minimum viable product to test in the market" },
          { number: 7, name: "Prototype", description: "Develop a prototype for the product or service" },
          { number: 8, name: "Customer Feedback", description: "Gather feedback from potential customers" },
          { number: 9, name: "Product/Service Refinement", description: "Refine the product or service based on customer feedback" },
          { number: 10, name: "Branding", description: "Develop branding for the product or service" },
          { number: 11, name: "Marketing Plan", description: "Develop a marketing plan for the product or service" },
          { number: 12, name: "Pricing Strategy", description: "Develop a pricing strategy for the product or service" },
          { number: 13, name: "Launch Preparation", description: "Prepare for the launch of the product or service" },
          { number: 14, name: "Launch", description: "Launch the product or service" },
          { number: 15, name: "Early Sales", description: "Generate early sales for the product or service" },
          { number: 16, name: "Customer Retention", description: "Develop strategies to retain customers" },
          { number: 17, name: "Referral Program", description: "Develop a referral program to encourage word-of-mouth marketing" },
          { number: 18, name: "Expansion", description: "Expand the product or service into new markets or offerings" },
          { number: 19, name: "Strategic Partnerships", description: "Develop strategic partnerships to enhance the product or service" },
          { number: 20, name: "Scaling", description: "Develop a plan to scale the product or service" },
          { number: 21, name: "Operations", description: "Develop operational processes to support the product or service" },
          { number: 22, name: "Financial Planning", description: "Develop financial plans to support the product or service" },
          { number: 23, name: "Funding", description: "Secure funding to support the product or service" },
          { number: 24, name: "Investor Relations", description: "Develop relationships with investors" },
          { number: 25, name: "Growth", description: "Continue to grow the product or service" },
          { number: 26, name: "Industry Analysis", description: "Analyze the industry and market trends" },
          { number: 27, name: "Pivot", description: "Determine if a pivot is necessary" },
          { number: 28, name: "Innovation", description: "Explore new innovations for the product or service" },
          { number: 29, name: "Intellectual Property", description: "Develop intellectual property strategies" },
          { number: 30, name: "Talent Acquisition", description: "Develop strategies for talent acquisition" },
          { number: 31, name: "Organizational Structure", description: "Develop the organizational structure to support the product or service" },
          { number: 32, name: "Performance Metrics", description: "Develop performance metrics to measure success" },
          { number: 33, name: "Data Analysis", description: "Analyze data to make informed decisions" },
          { number: 34, name: "Risk Management", description: "Develop strategies for risk management" },
          { number: 35, name: "Legal Compliance", description: "Ensure legal compliance for the product or service" },
          { number: 36, name: "Social Responsibility", description: "Develop strategies for social responsibility" },
          { number: 37, name: "Crisis Management", description: "Develop strategies for crisis management" },
          { number: 38, name: "Reputation Management", description: "Develop strategies for reputation management" },
          { number: 39, name: "Exit Strategy", description: "Develop an exit strategy" },
          { number: 40, name: "Success", description: "Celebrate the success of the product or service" }
        ];
        setBoardTileData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading board tile data:', error);
        setIsLoading(false);
      }
    };

    loadBoardTileData();
  }, []);

  const handleTileInteraction = (index: number, isVisible: boolean) => {
    const newArray = [...tileVisibility];
    newArray[index] = isVisible;
    setTileVisibility(newArray);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading gameboard data...</div>;
  }

  return (
    <div
      className={`relative w-full max-w-3xl mx-auto aspect-square [container-type:inline-size] ${className}`}
    >
      <div className="absolute inset-0 rounded-full bg-[#0A0A23] overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1A1A40] via-[#121230] to-[#0A0A23] opacity-80"></div>

        {/* Tiles */}
        {boardTileData.map((tile, i) => {
          return (
            <div
              key={i}
              className={`absolute w-[7%] aspect-[1.1] flex flex-col items-center justify-center transition-opacity duration-300 cursor-pointer ${tileVisibility[i] ? 'opacity-100 bg-opacity-85 border border-[rgba(174,174,174,0.7)]' : 'opacity-0 pointer-events-none'
                } rounded -translate-x-1/2 -translate-y-1/2`}
              style={{
                left: `${spaces[i].x}%`,
                top: `${spaces[i].y}%`,
                backgroundColor: tileVisibility[i] ? 'rgba(46,8,84,0.85)' : 'transparent'
              }}
              onMouseEnter={() => handleTileInteraction(i, true)}
              onMouseLeave={() => handleTileInteraction(i, false)}
              onFocus={() => handleTileInteraction(i, true)}
              onBlur={() => handleTileInteraction(i, false)}
              tabIndex={0}
              title={tile.description}
            >
              <span className="font-bold text-[#E0E0E0] leading-none text-[length:clamp(10px,2.5cqw,14px)]">{tile.number}</span>
              <span className="mt-0.5 text-[#E0E0E0] max-h-[40%] overflow-hidden text-ellipsis leading-tight hidden sm:block text-[length:clamp(6px,1.5cqw,10px)]">{tile.name}</span>
            </div>
          );
        })}

        {/* Center sections with BUILD/MEASURE/LEARN */}
        {/* Center sections with BUILD/MEASURE/LEARN */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-5">
          <div className="font-bold text-[#FFB74D] mb-[1cqw] text-center text-shadow text-[length:clamp(16px,4cqw,24px)]">BUILD</div>
          <div className="font-bold text-[#AED581] mb-[1cqw] text-center text-shadow text-[length:clamp(16px,4cqw,24px)]">MEASURE</div>
          <div className="font-bold text-[#7986CB] text-center text-shadow text-[length:clamp(16px,4cqw,24px)]">LEARN</div>
        </div>

        {/* Overlay showing completed tiles with gradient colors */}
        {tiles && tiles.map((tile, index) => {
          if (!tile) return null;
          const angle = (index / 40) * 2 * Math.PI;
          const radius = 45; // % of container
          const left = 50 + radius * Math.cos(angle - Math.PI / 2);
          const top = 50 + radius * Math.sin(angle - Math.PI / 2);

          let tileColor = '#FFEB3B'; // Default yellow
          if (index < 8) {
            tileColor = '#FFEB3B'; // Yellow (1-8)
          } else if (index < 16) {
            tileColor = '#FF9800'; // Orange (9-16)
          } else if (index < 24) {
            tileColor = '#F44336'; // Red (17-24)
          } else if (index < 32) {
            tileColor = '#9C27B0'; // Purple (25-32)
          } else {
            tileColor = '#3F51B5'; // Blue (33-40)
          }

          return (
            <div
              key={`tile-${index}`}
              className="absolute w-[6%] aspect-square rounded-full flex items-center justify-center font-bold text-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)] -translate-x-1/2 -translate-y-1/2 text-[length:clamp(8px,2cqw,14px)]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: tileColor
              }}
              title={`${tile.task_title} - Completed by ${tile.user_name} (${tile.ivp_value} IVP)`}
            >
              {index + 1}
            </div>
          );
        })}

        {/* Completed count in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[15%] aspect-square flex items-center justify-center font-bold text-white bg-[#1A1A40] rounded-full shadow-lg z-20 border-2 border-[rgba(255,255,255,0.2)] text-[length:clamp(14px,3cqw,20px)]">
          {tiles?.filter(tile => tile).length || 0} / 40
        </div>
      </div>
    </div>
  );
};

export default GameboardCircle;
