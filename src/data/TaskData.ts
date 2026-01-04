import { Task } from '../types';

export const PRELOADED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Ideation",
    description: "Generate ideas for new products or services",
    objective: "To brainstorm and generate innovative ideas for new products or services that align with market demands and organizational goals.",
    deliverables: [
      "Comprehensive list of potential product/service ideas",
      "Evaluation criteria for idea selection",
      "Final shortlist of top potential ideas"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 100
  },
  {
    id: "t2",
    title: "Market Research",
    description: "Conduct market research to determine viability of ideas",
    objective: "To conduct comprehensive market research to determine the viability and potential success of the product within the target market.",
    deliverables: [
      "Detailed market analysis report",
      "Identification of target demographics and segments",
      "Competitor analysis report",
      "Recommendations for market entry strategy"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 150
  },
  {
    id: "t3",
    title: "Competitive Analysis",
    description: "Analyze competitors in the market",
    objective: "To perform an in-depth analysis of competitors to identify strengths, weaknesses, strategies, and market positioning.",
    deliverables: [
      "Comprehensive report on competitors' products/services",
      "SWOT analysis for each key competitor",
      "Recommendations for differentiation"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 150
  },
  {
    id: "t4",
    title: "Target Market",
    description: "Determine the target market for the product or service",
    objective: "Identify and define the specific audience segments most likely to purchase the product or service.",
    deliverables: [
      "Customer Personas",
      "Demographic and Psychographic profiles",
      "Total Addressable Market (TAM) calculation"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 120
  },
  {
    id: "t5",
    title: "Unique Selling Proposition",
    description: "Develop a unique selling proposition for the product or service",
    objective: "To define and articulate a compelling Unique Selling Proposition (USP) that differentiates the product from competitors.",
    deliverables: [
      "Clear articulation of the USP",
      "Market analysis supporting the USP uniqueness",
      "Strategy for integrating USP into marketing materials"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 200
  },
  {
    id: "t6",
    title: "Minimum Viable Product",
    description: "Develop a minimum viable product to test in the market",
    objective: "To create a functional MVP that demonstrates key features and provides value to early adopters for validation.",
    deliverables: [
      "Defined features and functionalities for the MVP",
      "Development and testing of the MVP",
      "Feedback reports from initial users"
    ],
    pace: "run",
    status: "backlog",
    ivp: 500
  },
  {
    id: "t7",
    title: "Prototype",
    description: "Develop a prototype for the product or service",
    objective: "To create a functional prototype that demonstrates key features for testing and validation purposes.",
    deliverables: [
      "Defined specifications and features",
      "Development and testing of the prototype",
      "Feedback and improvement recommendations"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 300
  },
  {
    id: "t8",
    title: "Customer Feedback",
    description: "Gather feedback from potential customers",
    objective: "To systematically collect, analyze, and implement customer feedback to improve the product.",
    deliverables: [
      "Established feedback collection mechanisms",
      "Comprehensive analysis reports",
      "Implementation plan for feedback-driven improvements"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 150
  },
  {
    id: "t9",
    title: "Product/Service Refinement",
    description: "Refine the product or service based on customer feedback",
    objective: "To identify areas for improvement and implement refinements to enhance quality, functionality, or user experience.",
    deliverables: [
      "Analysis report outlining areas for refinement",
      "Action plan detailing refinement strategies",
      "Refined version of the product or service"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 200
  },
  {
    id: "t10",
    title: "Branding",
    description: "Develop branding for the product or service",
    objective: "To create and implement a comprehensive branding strategy that effectively communicates values and identity.",
    deliverables: [
      "Brand identity guidelines (logo, colors, typography)",
      "Brand messaging framework",
      "Implementation plan for brand rollout"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 250
  },
  {
    id: "t11",
    title: "Marketing Plan",
    description: "Develop a marketing plan for the product or service",
    objective: "To create a comprehensive marketing plan that promotes and positions the product to achieve business goals.",
    deliverables: [
      "Detailed marketing strategy and tactics outline",
      "Marketing budget allocation",
      "Campaign schedules and implementation timeline"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 300
  },
  {
    id: "t12",
    title: "Pricing Strategy",
    description: "Develop a pricing strategy for the product or service",
    objective: "To create an effective pricing strategy that maximizes profitability and aligns with market demand.",
    deliverables: [
      "Analysis of market conditions and competitive pricing",
      "Defined pricing models and strategies",
      "Implementation plan for pricing"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 150
  },
  {
    id: "t13",
    title: "Launch Preparation",
    description: "Prepare for the launch of the product or service",
    objective: "To plan and organize all necessary activities for a successful launch, ensuring readiness across all aspects.",
    deliverables: [
      "Launch timeline and schedule",
      "Marketing and promotional materials",
      "Logistics and operational readiness checklist"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 400
  },
  {
    id: "t14",
    title: "Launch",
    description: "Launch the product or service",
    objective: "To execute a successful launch meeting predefined goals and ensuring a strong market entry.",
    deliverables: [
      "Launch event plan and execution",
      "Marketing and promotional campaign rollouts",
      "Post-launch assessment"
    ],
    pace: "run",
    status: "backlog",
    ivp: 1000
  },
  {
    id: "t15",
    title: "Early Sales",
    description: "Generate early sales for the product or service",
    objective: "To generate initial sales and create a customer base through targeted early sales campaigns.",
    deliverables: [
      "Early sales campaign strategy",
      "Customer acquisition metrics",
      "Feedback and insights for future strategies"
    ],
    pace: "run",
    status: "backlog",
    ivp: 500
  },
  {
    id: "t16",
    title: "Customer Retention",
    description: "Develop strategies to retain customers",
    objective: "To implement strategies aimed at improving retention rates and fostering long-term relationships.",
    deliverables: [
      "Customer retention strategy and action plan",
      "Implementation of retention initiatives",
      "Evaluation reports on effectiveness"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 300
  },
  {
    id: "t17",
    title: "Referral Program",
    description: "Develop a referral program to encourage word-of-mouth marketing",
    objective: "To create a program that encourages existing customers to refer new customers.",
    deliverables: [
      "Referral program strategy and design",
      "Implementation of the referral program",
      "Tracking and evaluation of program effectiveness"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 200
  },
  {
    id: "t18",
    title: "Expansion",
    description: "Expand the product or service into new markets or offerings",
    objective: "To plan and execute a strategic expansion into new markets to grow reach and revenue.",
    deliverables: [
      "Market analysis and selection of target areas",
      "Development and execution of expansion strategies",
      "Evaluation reports on success"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 400
  },
  {
    id: "t19",
    title: "Strategic Partnerships",
    description: "Develop strategic partnerships to enhance the product or service",
    objective: "To identify, develop, and establish strategic partnerships that align with business objectives.",
    deliverables: [
      "Partner identification and evaluation criteria",
      "Signed partnership agreements",
      "Implementation of joint initiatives"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 350
  },
  {
    id: "t20",
    title: "Scaling",
    description: "Develop a plan to scale the product or service",
    objective: "To strategically expand operations and infrastructure to accommodate increased demand.",
    deliverables: [
      "Scaling strategy and implementation plan",
      "Upgraded infrastructure and expanded operations",
      "Evaluation reports on scalability"
    ],
    pace: "walk",
    status: "backlog",
    ivp: 500
  },
  {
    id: "t21",
    title: "Operations",
    description: "Develop operational processes to support the product or service",
    objective: "To streamline and enhance operational processes to improve efficiency and reduce costs.",
    deliverables: [
      "Analysis of current operational processes",
      "Implementation of optimized processes",
      "Evaluation reports on operational enhancements"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 250
  },
  {
    id: "t22",
    title: "Financial Planning",
    description: "Develop financial support plans",
    objective: "To ensure financial stability and growth through robust planning and management.",
    deliverables: [
      "Financial forecasts and budgets",
      "Cash flow analysis",
      "Funding strategy"
    ],
    pace: "crawl",
    status: "backlog",
    ivp: 300
  },
  // Placeholders for the rest of the 40 tasks
  { id: "t23", title: "Funding", description: "Secure funding", status: "backlog", pace: "crawl", ivp: 1000 },
  { id: "t24", title: "Investor Relations", description: "Develop relationships with investors", status: "backlog", pace: "walk", ivp: 400 },
  { id: "t25", title: "Growth", description: "Continue to grow the product/service", status: "backlog", pace: "run", ivp: 500 },
  { id: "t26", title: "Industry Analysis", description: "Analyze market trends", status: "backlog", pace: "crawl", ivp: 150 },
  { id: "t27", title: "Pivot", description: "Determine if a pivot is necessary", status: "backlog", pace: "run", ivp: 1000 },
  { id: "t28", title: "Innovation", description: "Explore new innovations", status: "backlog", pace: "walk", ivp: 300 },
  { id: "t29", title: "Intellectual Property", description: "Develop IP strategies", status: "backlog", pace: "crawl", ivp: 500 },
  { id: "t30", title: "Talent Acquisition", description: "Develop strategies for hiring", status: "backlog", pace: "walk", ivp: 250 },
  { id: "t31", title: "Organizational Structure", description: "Develop the team structure", status: "backlog", pace: "crawl", ivp: 200 },
  { id: "t32", title: "Performance Metrics", description: "Develop metrics to measure success", status: "backlog", pace: "crawl", ivp: 150 },
  { id: "t33", title: "Data Analysis", description: "Analyze data for decisions", status: "backlog", pace: "walk", ivp: 200 },
  { id: "t34", title: "Risk Management", description: "Develop risk strategies", status: "backlog", pace: "crawl", ivp: 300 },
  { id: "t35", title: "Legal Compliance", description: "Ensure legal compliance", status: "backlog", pace: "crawl", ivp: 400 },
  { id: "t36", title: "Social Responsibility", description: "Develop CSR strategies", status: "backlog", pace: "crawl", ivp: 200 },
  { id: "t37", title: "Crisis Management", description: "Develop crisis strategies", status: "backlog", pace: "run", ivp: 500 },
  { id: "t38", title: "Reputation Management", description: "Manage brand reputation", status: "backlog", pace: "walk", ivp: 300 },
  { id: "t39", title: "Exit Strategy", description: "Develop an exit strategy", status: "backlog", pace: "crawl", ivp: 1000 },
  { id: "t40", title: "Success", description: "Celebrate the success", status: "backlog", pace: "run", ivp: 10000 }
];
