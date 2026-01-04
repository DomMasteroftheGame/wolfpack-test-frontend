import { Task, TaskStatus } from '../types';

interface WolfDenTaskTemplate {
    step_number: number;
    title: string;
    objective: string;
    deliverables: string[];
    description: string;
    default_approach: 'build' | 'buy' | 'partner' | 'outsource';
    phase: string;
}

export const WOLF_DEN_TASKS: WolfDenTaskTemplate[] = [
    // Phase 1: Ideation & Validation (Steps 1-8)
    {
        step_number: 1,
        title: "Ideation",
        phase: "Ideation & Validation",
        objective: "Generate ideas for new products/services",
        description: "Brainstorming session to identify potential market opportunities.",
        deliverables: ["Idea List", "Selection Matrix"],
        default_approach: "build"
    },
    {
        step_number: 2,
        title: "Market Research",
        phase: "Ideation & Validation",
        objective: "Conduct research to determine viability",
        description: "Analyze market size, trends, and customer needs.",
        deliverables: ["Market Research Report", "SWOT Analysis"],
        default_approach: "build"
    },
    {
        step_number: 3,
        title: "Competitive Analysis",
        phase: "Ideation & Validation",
        objective: "Analyze competitors in the market",
        description: "Identify direct and indirect competitors and their strategies.",
        deliverables: ["Competitor Matrix", "Feature Comparison"],
        default_approach: "build"
    },
    {
        step_number: 4,
        title: "Target Market",
        phase: "Ideation & Validation",
        objective: "Determine the specific audience",
        description: "Define user personas and target demographics.",
        deliverables: ["User Personas", "Target Audience Profile"],
        default_approach: "build"
    },
    {
        step_number: 5,
        title: "Unique Selling Proposition (USP)",
        phase: "Ideation & Validation",
        objective: "Develop a USP",
        description: "Articulate what makes the product unique and valuable.",
        deliverables: ["USP Statement", "Value Proposition Canvas"],
        default_approach: "build"
    },
    {
        step_number: 6,
        title: "Minimum Viable Product (MVP)",
        phase: "Ideation & Validation",
        objective: "Develop an MVP to test",
        description: "Build the core version of the product to test hypotheses.",
        deliverables: ["MVP Specs", "Core Feature List"],
        default_approach: "build"
    },
    {
        step_number: 7,
        title: "Prototype",
        phase: "Ideation & Validation",
        objective: "Develop a prototype",
        description: "Create a functional or visual prototype for user testing.",
        deliverables: ["Wireframes", "Interactive Prototype"],
        default_approach: "build"
    },
    {
        step_number: 8,
        title: "Customer Feedback",
        phase: "Ideation & Validation",
        objective: "Gather feedback from potential customers",
        description: "Conduct interviews or surveys to validate the MVP.",
        deliverables: ["Feedback Report", "Iteration Plan"],
        default_approach: "build"
    },

    // Phase 2: Refinement & Launch (Steps 9-17)
    {
        step_number: 9,
        title: "Product/Service Refinement",
        phase: "Refinement & Launch",
        objective: "Refine based on feedback",
        description: "Improve the product based on initial user feedback.",
        deliverables: ["Refined Product Specs", "Changelog"],
        default_approach: "build"
    },
    {
        step_number: 10,
        title: "Branding",
        phase: "Refinement & Launch",
        objective: "Develop branding (Logo, Identity)",
        description: "Create the visual identity and brand voice.",
        deliverables: ["Brand Guide", "Logo Assets"],
        default_approach: "buy" // Often outsourced or bought
    },
    {
        step_number: 11,
        title: "Marketing Plan",
        phase: "Refinement & Launch",
        objective: "Develop a marketing strategy",
        description: "Plan channels and tactics to reach the target audience.",
        deliverables: ["Marketing Strategy Doc", "Content Calendar"],
        default_approach: "build"
    },
    {
        step_number: 12,
        title: "Pricing Strategy",
        phase: "Refinement & Launch",
        objective: "Develop a pricing model",
        description: "Determine pricing tier (High-end vs Competitive).",
        deliverables: ["Pricing Model", "Competitor Price Analysis"],
        default_approach: "build"
    },
    {
        step_number: 13,
        title: "Launch Preparation",
        phase: "Refinement & Launch",
        objective: "Prepare for the launch",
        description: "Finalize generic assets and logistics for launch day.",
        deliverables: ["Launch Checklist", "Press Kit"],
        default_approach: "build"
    },
    {
        step_number: 14,
        title: "Launch",
        phase: "Refinement & Launch",
        objective: "Execute the product/service launch",
        description: "Go live and announce the product to the market.",
        deliverables: ["Live Product", "Launch Announcement"],
        default_approach: "build"
    },
    {
        step_number: 15,
        title: "Early Sales",
        phase: "Refinement & Launch",
        objective: "Generate initial sales",
        description: "Secure the first paying customers.",
        deliverables: ["Sales Report", "First Customer List"],
        default_approach: "build"
    },
    {
        step_number: 16,
        title: "Customer Retention",
        phase: "Refinement & Launch",
        objective: "Develop strategies to keep customers",
        description: "Create loyalty programs or success plans.",
        deliverables: ["Retention Strategy", "Churn Analysis"],
        default_approach: "build"
    },
    {
        step_number: 17,
        title: "Referral Program",
        phase: "Refinement & Launch",
        objective: "Develop word-of-mouth marketing",
        description: "Incentivize existing users to refer new ones.",
        deliverables: ["Referral Logic", "Incentive Plan"],
        default_approach: "build"
    },

    // Phase 3: Expansion & Scale (Steps 18-24)
    {
        step_number: 18,
        title: "Expansion",
        phase: "Expansion & Scale",
        objective: "Expand into new markets",
        description: "Identify and enter new geographical or vertical markets.",
        deliverables: ["Expansion Plan", "Market Analysis"],
        default_approach: "build"
    },
    {
        step_number: 19,
        title: "Strategic Partnerships",
        phase: "Expansion & Scale",
        objective: "Develop partnerships",
        description: "Form alliances to increase reach or capabilities.",
        deliverables: ["Partnership Agreements", "Partner List"],
        default_approach: "partner"
    },
    {
        step_number: 20,
        title: "Scaling",
        phase: "Expansion & Scale",
        objective: "Plan to scale the product/service",
        description: "Prepare infrastructure and team for high growth.",
        deliverables: ["Scaling Roadmap", "Capacity Plan"],
        default_approach: "build"
    },
    {
        step_number: 21,
        title: "Operations",
        phase: "Expansion & Scale",
        objective: "Develop operational processes",
        description: "Streamline internal workflows and SOPs.",
        deliverables: ["SOPs", "Operational Flowchart"],
        default_approach: "build"
    },
    {
        step_number: 22,
        title: "Financial Planning",
        phase: "Expansion & Scale",
        objective: "Develop financial support plans",
        description: "Budgeting and forecasting for the next stage.",
        deliverables: ["Financial Model", "Budget"],
        default_approach: "build"
    },
    {
        step_number: 23,
        title: "Funding",
        phase: "Expansion & Scale",
        objective: "Secure funding",
        description: "Raise capital from VCs, Angels, or loans.",
        deliverables: ["Pitch Deck", "Term Sheet"],
        default_approach: "partner"
    },
    {
        step_number: 24,
        title: "Investor Relations",
        phase: "Expansion & Scale",
        objective: "Develop relationships with investors",
        description: "Manage communication with stakeholders.",
        deliverables: ["Investor Updates", "Cap Table"],
        default_approach: "partner"
    },

    // Phase 4: Optimization & Exit (Steps 25-40)
    {
        step_number: 25,
        title: "Growth",
        phase: "Optimization & Exit",
        objective: "Continue to grow the product/service",
        description: "Execute growth hacking and optimization strategies.",
        deliverables: ["Growth Metrics", "Experiment Log"],
        default_approach: "build"
    },
    {
        step_number: 26,
        title: "Industry Analysis",
        phase: "Optimization & Exit",
        objective: "Analyze market trends",
        description: "Stay ahead of industry shifts.",
        deliverables: ["Trend Report", "Strategic Adjustments"],
        default_approach: "build"
    },
    {
        step_number: 27,
        title: "Pivot",
        phase: "Optimization & Exit",
        objective: "Determine if a pivot is necessary",
        description: "Evaluate if the business direction needs to change.",
        deliverables: ["Pivot Analysis", "Decision Memo"],
        default_approach: "build"
    },
    {
        step_number: 28,
        title: "Innovation",
        phase: "Optimization & Exit",
        objective: "Explore new innovations",
        description: "R&D for next-gen features or products.",
        deliverables: ["Innovation Pipeline", "R&D Report"],
        default_approach: "build"
    },
    {
        step_number: 29,
        title: "Intellectual Property",
        phase: "Optimization & Exit",
        objective: "Develop IP strategies",
        description: "Protect trademarks, patents, and copyrights.",
        deliverables: ["IP Portfolio", "Legal Filings"],
        default_approach: "outsource"
    },
    {
        step_number: 30,
        title: "Talent Acquisition",
        phase: "Optimization & Exit",
        objective: "Develop strategies for hiring",
        description: "Recruit top talent to sustain growth.",
        deliverables: ["Hiring Plan", "Org Chart"],
        default_approach: "build"
    },
    {
        step_number: 31,
        title: "Organizational Structure",
        phase: "Optimization & Exit",
        objective: "Develop the team structure",
        description: "Optimize management hierarchy and roles.",
        deliverables: ["Organizational Design", "Role Descriptions"],
        default_approach: "build"
    },
    {
        step_number: 32,
        title: "Performance Metrics",
        phase: "Optimization & Exit",
        objective: "Develop metrics to measure success",
        description: "Define KPIs and OKRs.",
        deliverables: ["KPI Dashboard", "Success Metrics"],
        default_approach: "build"
    },
    {
        step_number: 33,
        title: "Data Analysis",
        phase: "Optimization & Exit",
        objective: "Analyze data for decisions",
        description: "Leverage big data for strategic insights.",
        deliverables: ["Data Warehouse", "BI Reports"],
        default_approach: "build"
    },
    {
        step_number: 34,
        title: "Risk Management",
        phase: "Optimization & Exit",
        objective: "Develop risk strategies",
        description: "Identify and mitigate business risks.",
        deliverables: ["Risk Matrix", "Mitigation Plan"],
        default_approach: "build"
    },
    {
        step_number: 35,
        title: "Legal Compliance",
        phase: "Optimization & Exit",
        objective: "Ensure legal compliance",
        description: "Adhere to all regulations and laws.",
        deliverables: ["Compliance Audit", "Legal Docs"],
        default_approach: "outsource"
    },
    {
        step_number: 36,
        title: "Social Responsibility",
        phase: "Optimization & Exit",
        objective: "Develop CSR strategies",
        description: "Give back to the community and ethical practices.",
        deliverables: ["CSR Report", "Impact Assessment"],
        default_approach: "build"
    },
    {
        step_number: 37,
        title: "Crisis Management",
        phase: "Optimization & Exit",
        objective: "Develop crisis strategies",
        description: "Plan for potential PR or operational crises.",
        deliverables: ["Crisis Playbook", "Emergency Contacts"],
        default_approach: "build"
    },
    {
        step_number: 38,
        title: "Reputation Management",
        phase: "Optimization & Exit",
        objective: "Manage brand reputation",
        description: "Monitor and improve public perception.",
        deliverables: ["Sentiment Analysis", "PR Plan"],
        default_approach: "build"
    },
    {
        step_number: 39,
        title: "Exit Strategy",
        phase: "Optimization & Exit",
        objective: "Develop an exit strategy",
        description: "Plan for acquisition, IPO, or succession.",
        deliverables: ["Exit Plan", "Valuation Model"],
        default_approach: "build"
    },
    {
        step_number: 40,
        title: "Success",
        phase: "Optimization & Exit",
        objective: "Celebrate the success",
        description: "Reflect on the journey and plan the next adventure.",
        deliverables: ["The Feast", "Wolfpack Legacy"],
        default_approach: "build"
    }
];

export const createTasksFromTemplate = (projectId: string, ownerId: string): Omit<Task, 'id'>[] => {
    return WOLF_DEN_TASKS.map(template => ({
        title: template.title,
        description: template.description,
        objective: template.objective,
        deliverables: template.deliverables,
        approach: template.default_approach,
        step_number: template.step_number,
        project_id: projectId,
        assigned_to: [], // Start unassigned in Backlog
        ivp_value: 5, // Default IVP
        status: TaskStatus.BACKLOG, // All start in "Backlog"
        pace: 'walk', // Default pace
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));
};
