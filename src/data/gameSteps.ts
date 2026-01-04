export interface GameStep {
    stepNumber: number;
    title: string;
    sector: 'BUILD' | 'MEASURE' | 'LEARN';
    pmData: {
        objective: string;
        deliverables: string[];
        risks: string;
    };
}

export const GAME_STEPS: GameStep[] = [
    // --- BUILD SECTOR (Steps 1-14) ---
    {
        stepNumber: 1,
        title: "IDEATION",
        sector: "BUILD",
        pmData: {
            objective: "Define the core value proposition.",
            deliverables: ["Problem Statement", "Solution Hypothesis"],
            risks: "Solving a problem that doesn't exist."
        }
    },
    {
        stepNumber: 2,
        title: "MARKET RESEARCH",
        sector: "BUILD",
        pmData: {
            objective: "Validate market need.",
            deliverables: ["Competitor Analysis", "User Personas"],
            risks: "Ignoring market saturation."
        }
    },
    {
        stepNumber: 5,
        title: "MVP SCOPE",
        sector: "BUILD",
        pmData: {
            objective: "Define minimum viable features.",
            deliverables: ["Feature List", "User Flow"],
            risks: "Feature creep."
        }
    },
    {
        stepNumber: 14,
        title: "PROTOTYPE LAUNCH",
        sector: "BUILD",
        pmData: {
            objective: "Release initial version.",
            deliverables: ["Working Prototype", "Alpha Access"],
            risks: "Critical bugs."
        }
    },

    // --- MEASURE SECTOR (Steps 15-28) ---
    {
        stepNumber: 15,
        title: "USER FEEDBACK",
        sector: "MEASURE",
        pmData: {
            objective: "Gather initial user data.",
            deliverables: ["Feedback Report", "Bug List"],
            risks: "Low user engagement."
        }
    },
    {
        stepNumber: 20,
        title: "RETENTION ANALYSIS",
        sector: "MEASURE",
        pmData: {
            objective: "Measure user retention.",
            deliverables: ["Cohort Analysis", "Churn Report"],
            risks: "High churn rate."
        }
    },
    {
        stepNumber: 28,
        title: "UNIT ECONOMICS",
        sector: "MEASURE",
        pmData: {
            objective: "Validate business model.",
            deliverables: ["CAC/LTV Calculation", "Profitability Model"],
            risks: "Unsustainable costs."
        }
    },

    // --- LEARN SECTOR (Steps 29-40) ---
    {
        stepNumber: 29,
        title: "PIVOT OR PERSEVERE",
        sector: "LEARN",
        pmData: {
            objective: "Decide strategic direction.",
            deliverables: ["Pivot Plan", "Growth Strategy"],
            risks: "Sunk cost fallacy."
        }
    },
    {
        stepNumber: 35,
        title: "SCALE STRATEGY",
        sector: "LEARN",
        pmData: {
            objective: "Plan for growth.",
            deliverables: ["Marketing Plan", "Hiring Plan"],
            risks: "Premature scaling."
        }
    },
    {
        stepNumber: 40,
        title: "SUCCESS / EXIT",
        sector: "LEARN",
        pmData: {
            objective: "Achieve market dominance or exit.",
            deliverables: ["Exit Strategy", "IPO Roadmap"],
            risks: "Market shift."
        }
    }
];

export const SECTOR_COLORS = {
    BUILD: 'border-yellow-500 shadow-yellow-500/20 text-yellow-500', // Gold
    MEASURE: 'border-cyan-500 shadow-cyan-500/20 text-cyan-500',   // Cyan
    LEARN: 'border-pink-500 shadow-pink-500/20 text-pink-500',     // Magenta
};
