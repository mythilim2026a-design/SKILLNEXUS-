/**
 * Skill Nexus - Seed Data & Configurations
 * 8 Core Skills: Python, Java, SQL, Communication, Problem Solving, Data Analysis, Excel, Teamwork
 */

const SKILLS_LIST = [
  "Python",
  "Java",
  "SQL",
  "Communication",
  "Problem Solving",
  "Data Analysis",
  "Excel",
  "Teamwork"
];

const TARGET_ROLES = {
  "Data Analyst": {
    title: "Data Analyst",
    description: "Transforms raw data into actionable business intelligence, KPI decks, and dashboards.",
    requirements: {
      "Python": 70,
      "SQL": 80,
      "Communication": 70,
      "Problem Solving": 70,
      "Data Analysis": 80,
      "Excel": 60
    }
  },
  "Python Developer": {
    title: "Python Developer",
    description: "Builds backend architectures, APIs, automation workflows, and software systems.",
    requirements: {
      "Python": 80,
      "SQL": 50,
      "Problem Solving": 80,
      "Communication": 60,
      "Java": 40
    }
  },
  "Business Analyst": {
    title: "Business Analyst",
    description: "Bridges business stakeholders and engineering to drive data-backed strategy.",
    requirements: {
      "SQL": 60,
      "Communication": 80,
      "Problem Solving": 80,
      "Data Analysis": 70,
      "Excel": 70
    }
  },
  "Data Engineer": {
    title: "Data Engineer",
    description: "Architects scalable data pipelines, ETL infrastructure, and streaming databases.",
    requirements: {
      "Python": 80,
      "SQL": 85,
      "Data Analysis": 75,
      "Problem Solving": 75,
      "Excel": 50
    }
  },
  "Full Stack Engineer": {
    title: "Full Stack Engineer",
    description: "Designs cross-platform web platforms, REST APIs, and database schemas.",
    requirements: {
      "Python": 70,
      "Java": 60,
      "SQL": 70,
      "Problem Solving": 80,
      "Teamwork": 75,
      "Communication": 65
    }
  }
};

const ASSESSMENT_QUESTIONS = [
  {
    skill: "Python",
    question: "How confident are you writing Python code, scripting, and manipulating data structures?",
    options: [
      { level: "Beginner", score: 20, desc: "Familiar with basic syntax and print statements." },
      { level: "Basic", score: 40, desc: "Can write loops, functions, and work with basic lists/dicts." },
      { level: "Intermediate", score: 60, desc: "Use OOP, modules, pandas/numpy, and handle errors cleanly." },
      { level: "Advanced", score: 80, desc: "Build modular pipelines, APIs, and complex backend logic." },
      { level: "Expert", score: 100, desc: "Architect full Python systems, optimize performance & packages." }
    ]
  },
  {
    skill: "Java",
    question: "What is your proficiency in Java object-oriented programming and application building?",
    options: [
      { level: "Beginner", score: 20, desc: "Know what JVM and basic syntax is." },
      { level: "Basic", score: 40, desc: "Can create basic classes, methods, and simple arrays." },
      { level: "Intermediate", score: 60, desc: "Understand OOP principles, Collections, and I/O streams." },
      { level: "Advanced", score: 80, desc: "Comfortable with Spring Boot, multithreading, and REST APIs." },
      { level: "Expert", score: 100, desc: "Architect high-throughput enterprise systems with Java." }
    ]
  },
  {
    skill: "SQL",
    question: "How proficient are you in querying relational databases, filtering, and joining data?",
    options: [
      { level: "Beginner", score: 20, desc: "Know simple SELECT and WHERE queries." },
      { level: "Basic", score: 40, desc: "Can write basic JOINs and GROUP BY aggregations." },
      { level: "Intermediate", score: 60, desc: "Comfortable with subqueries, nested joins, and indexing." },
      { level: "Advanced", score: 80, desc: "Write complex window functions, CTEs, and query optimization." },
      { level: "Expert", score: 100, desc: "Database schema architecture, query execution plan tuning." }
    ]
  },
  {
    skill: "Communication",
    question: "How effectively can you convey complex technical ideas and collaborate with teams?",
    options: [
      { level: "Beginner", score: 20, desc: "Struggle to explain technical thoughts to non-peers." },
      { level: "Basic", score: 40, desc: "Can articulate ideas in 1-on-1 team discussions." },
      { level: "Intermediate", score: 60, desc: "Present project progress and document workflows clearly." },
      { level: "Advanced", score: 80, desc: "Lead stakeholder presentations and translate tech to business." },
      { level: "Expert", score: 100, desc: "Keynote speaker, strategic negotiator, executive communicator." }
    ]
  },
  {
    skill: "Problem Solving",
    question: "When faced with an algorithmic problem or ambiguous bug, how do you solve it?",
    options: [
      { level: "Beginner", score: 20, desc: "Rely heavily on external guidance to debug issues." },
      { level: "Basic", score: 40, desc: "Can break down straightforward linear programming problems." },
      { level: "Intermediate", score: 60, desc: "Apply standard data structures, algorithmic decomposition." },
      { level: "Advanced", score: 80, desc: "Tackle non-trivial dynamic programming, optimize complexity." },
      { level: "Expert", score: 100, desc: "Solve complex distributed system edge-cases and novel algorithms." }
    ]
  },
  {
    skill: "Data Analysis",
    question: "How skilled are you in exploring datasets, spotting anomalies, and driving insights?",
    options: [
      { level: "Beginner", score: 20, desc: "Can view tabular data and compute basic averages." },
      { level: "Basic", score: 40, desc: "Can generate basic summary stats and simple charts." },
      { level: "Intermediate", score: 60, desc: "Perform exploratory data analysis (EDA), trend forecasting." },
      { level: "Advanced", score: 80, desc: "Statistical hypothesis testing, cohort analysis, metric modeling." },
      { level: "Expert", score: 100, desc: "End-to-end econometric modeling, automated insight platforms." }
    ]
  },
  {
    skill: "Excel",
    question: "What is your capability with Microsoft Excel / Spreadsheets for data modeling?",
    options: [
      { level: "Beginner", score: 20, desc: "Enter data, basic formatting, simple SUM/AVERAGE." },
      { level: "Basic", score: 40, desc: "Use VLOOKUP, IF conditions, and basic conditional formatting." },
      { level: "Intermediate", score: 60, desc: "Master Pivot Tables, INDEX/MATCH, and XLOOKUP." },
      { level: "Advanced", score: 80, desc: "Build automated dynamic dashboards, Power Query, scenario models." },
      { level: "Expert", score: 100, desc: "Complex financial modeling, VBA/macros, advanced data models." }
    ]
  },
  {
    skill: "Teamwork",
    question: "How seamlessly do you participate in cross-functional projects and peer reviews?",
    options: [
      { level: "Beginner", score: 20, desc: "Prefer strictly solo assignments with minimal sync." },
      { level: "Basic", score: 40, desc: "Deliver individual tasks within an assigned group." },
      { level: "Intermediate", score: 60, desc: "Active in standups, code reviews, and mutual support." },
      { level: "Advanced", score: 80, desc: "Facilitate cross-disciplinary alignment and mentor juniors." },
      { level: "Expert", score: 100, desc: "Cultivate high-performance engineering culture and synergy." }
    ]
  }
];

const INITIAL_COMPANIES = [
  { id: "comp_1", name: "TechNova", industry: "AI & Big Data", location: "Bangalore / Hybrid", logo: "TN" },
  { id: "comp_2", name: "CodeSphere", industry: "Cloud & Developer Tools", location: "Hyderabad / Remote", logo: "CS" },
  { id: "comp_3", name: "InsightWorks", industry: "Business Intelligence & Analytics", location: "Mumbai / Hybrid", logo: "IW" },
  { id: "comp_4", name: "DataForge", industry: "Enterprise Data Platforms", location: "Pune / Onsite", logo: "DF" },
  { id: "comp_5", name: "CloudMatrix", industry: "Enterprise SaaS & Microservices", location: "Chennai / Hybrid", logo: "CM" }
];

const INITIAL_OPPORTUNITIES = [
  {
    id: "opp_1",
    companyId: "comp_1",
    companyName: "TechNova",
    roleTitle: "Data Analyst Intern",
    type: "Internship",
    location: "Bangalore / Hybrid",
    duration: "6 Months",
    stipend: "₹35,000 / month",
    description: "Join TechNova's core Analytics squad to build automated executive dashboards, run SQL data pipelines, and provide statistical forecasting for enterprise customers.",
    requiredSkills: {
      "Python": 70,
      "SQL": 80,
      "Data Analysis": 80,
      "Excel": 60
    },
    skillWeights: {
      "SQL": 1.0,
      "Data Analysis": 1.0,
      "Python": 1.0,
      "Excel": 1.0
    },
    postedDate: "2026-09-28"
  },
  {
    id: "opp_2",
    companyId: "comp_2",
    companyName: "CodeSphere",
    roleTitle: "Python Developer Intern",
    type: "Internship",
    location: "Hyderabad / Remote",
    duration: "3 Months",
    stipend: "₹40,000 / month",
    description: "Design high-performance asynchronous microservices in FastAPI/Django, integrate relational databases, and write algorithmic unit tests.",
    requiredSkills: {
      "Python": 80,
      "SQL": 50,
      "Problem Solving": 80,
      "Communication": 60,
      "Java": 40
    },
    skillWeights: {
      "Python": 1.0,
      "Problem Solving": 1.0,
      "SQL": 1.0,
      "Communication": 1.0,
      "Java": 1.0
    },
    postedDate: "2026-10-01"
  },
  {
    id: "opp_3",
    companyId: "comp_3",
    companyName: "InsightWorks",
    roleTitle: "Business Analyst Intern",
    type: "Internship",
    location: "Mumbai / Hybrid",
    duration: "6 Months",
    stipend: "₹30,000 / month",
    description: "Bridge client product vision with analytical data models. Craft stakeholder briefs, query customer telemetry with SQL, and present financial decks in Excel.",
    requiredSkills: {
      "SQL": 60,
      "Communication": 80,
      "Problem Solving": 80,
      "Data Analysis": 70,
      "Excel": 70
    },
    skillWeights: {
      "Communication": 1.0,
      "Problem Solving": 1.0,
      "Data Analysis": 1.0,
      "Excel": 1.0,
      "SQL": 1.0
    },
    postedDate: "2026-10-02"
  },
  {
    id: "opp_4",
    companyId: "comp_4",
    companyName: "DataForge",
    roleTitle: "Junior Data Engineer",
    type: "Full-time Job",
    location: "Pune / Onsite",
    duration: "Full-Time",
    stipend: "₹9.5 LPA",
    description: "Architect ETL/ELT pipelines, maintain high-throughput PostgreSQL/Snowflake clusters, and collaborate on data modeling with data scientists.",
    requiredSkills: {
      "Python": 75,
      "SQL": 85,
      "Data Analysis": 75,
      "Problem Solving": 70
    },
    skillWeights: {
      "SQL": 1.5,
      "Python": 1.2,
      "Data Analysis": 1.0,
      "Problem Solving": 1.0
    },
    postedDate: "2026-09-25"
  },
  {
    id: "opp_5",
    companyId: "comp_5",
    companyName: "CloudMatrix",
    roleTitle: "Associate Software Engineer",
    type: "Full-time Job",
    location: "Chennai / Hybrid",
    duration: "Full-Time",
    stipend: "₹8.0 LPA",
    description: "Develop enterprise microservices, integrate REST/gRPC interfaces, participate in sprint retrospectives, and optimize code reliability.",
    requiredSkills: {
      "Java": 70,
      "Python": 60,
      "Problem Solving": 80,
      "Teamwork": 75
    },
    skillWeights: {
      "Java": 1.2,
      "Problem Solving": 1.2,
      "Teamwork": 1.0,
      "Python": 1.0
    },
    postedDate: "2026-09-30"
  },
  {
    id: "opp_6",
    companyId: "comp_1",
    companyName: "TechNova",
    roleTitle: "Predictive Modeling Live Project",
    type: "Live Project",
    location: "Remote",
    duration: "8 Weeks",
    stipend: "₹20,000 Grant",
    description: "Hands-on industry research sprint analyzing customer retention patterns with real-world anonymized e-commerce data streams.",
    requiredSkills: {
      "Python": 80,
      "Data Analysis": 85,
      "Problem Solving": 75
    },
    postedDate: "2026-10-04"
  },
  {
    id: "opp_7",
    companyId: "comp_3",
    companyName: "InsightWorks",
    roleTitle: "Operations Analyst Trainee",
    type: "Apprenticeship",
    location: "Mumbai / Onsite",
    duration: "1 Year",
    stipend: "₹25,000 / month",
    description: "Comprehensive industry apprenticeship covering operational workflow optimization, daily KPI reporting, and stakeholder coordination.",
    requiredSkills: {
      "Excel": 75,
      "Communication": 75,
      "Problem Solving": 70,
      "SQL": 50
    },
    postedDate: "2026-10-05"
  },
  {
    id: "opp_8",
    companyId: "comp_2",
    companyName: "CodeSphere",
    roleTitle: "Backend API Developer Apprentice",
    type: "Apprenticeship",
    location: "Hyderabad / Remote",
    duration: "6 Months",
    stipend: "₹28,000 / month",
    description: "Apprenticeship under senior staff engineers focusing on secure API endpoints, database indexing, and automated CI/CD pipeline integration.",
    requiredSkills: {
      "Python": 75,
      "SQL": 60,
      "Problem Solving": 75
    },
    postedDate: "2026-10-06"
  },
  {
    id: "opp_9",
    companyId: "comp_4",
    companyName: "DataForge",
    roleTitle: "BI & Reporting Specialist",
    type: "Full-time Job",
    location: "Pune / Hybrid",
    duration: "Full-Time",
    stipend: "₹7.5 LPA",
    description: "Lead enterprise data visualization using advanced SQL and interactive dashboards for Fortune 500 client accounts.",
    requiredSkills: {
      "SQL": 80,
      "Data Analysis": 80,
      "Excel": 80,
      "Communication": 70
    },
    postedDate: "2026-10-07"
  },
  {
    id: "opp_10",
    companyId: "comp_5",
    companyName: "CloudMatrix",
    roleTitle: "Java Cloud Systems Intern",
    type: "Internship",
    location: "Chennai / Remote",
    duration: "6 Months",
    stipend: "₹32,000 / month",
    description: "Work on cloud microservices containerization, Java Spring Boot services, and distributed cache layers.",
    requiredSkills: {
      "Java": 75,
      "Problem Solving": 75,
      "Teamwork": 70
    },
    postedDate: "2026-10-07"
  }
];

const INITIAL_LEARNING_PROGRAMS = [
  {
    id: "prog_1",
    title: "Python for Data Science & Automation",
    provider: "TechNova Academy",
    targetSkill: "Python",
    scoreBoost: 20,
    duration: "3 Weeks",
    modules: 6,
    level: "Intermediate → Advanced",
    description: "Hands-on projects covering NumPy, Pandas, Data Cleaning, and production scripting."
  },
  {
    id: "prog_2",
    title: "SQL & Relational Database Mastery",
    provider: "DataForge Labs",
    targetSkill: "SQL",
    scoreBoost: 20,
    duration: "2 Weeks",
    modules: 5,
    level: "Basic → Advanced",
    description: "Deep dive into multi-table JOINs, Window Functions, indexing strategies, and CTEs."
  },
  {
    id: "prog_3",
    title: "Applied Business & Data Analysis Bootcamp",
    provider: "InsightWorks Institute",
    targetSkill: "Data Analysis",
    scoreBoost: 20,
    duration: "4 Weeks",
    modules: 8,
    level: "Foundational → Industry-Ready",
    description: "Real-world dataset exploration, hypothesis testing, KPI dashboards, and reporting."
  },
  {
    id: "prog_4",
    title: "Advanced Problem Solving & Algorithmic Thinking",
    provider: "CodeSphere DevLab",
    targetSkill: "Problem Solving",
    scoreBoost: 20,
    duration: "3 Weeks",
    modules: 7,
    level: "Intermediate → Advanced",
    description: "Algorithmic patterns, space-time optimization, graph traversal, and dynamic programming."
  },
  {
    id: "prog_5",
    title: "Executive Communication & Storytelling for Tech",
    provider: "SkillNexus Leadership Studio",
    targetSkill: "Communication",
    scoreBoost: 20,
    duration: "2 Weeks",
    modules: 4,
    level: "Professional",
    description: "Translating data insights into executive summaries, presentation skills, and cross-team alignment."
  },
  {
    id: "prog_6",
    title: "Enterprise Java & Spring Boot Microservices",
    provider: "CloudMatrix Academy",
    targetSkill: "Java",
    scoreBoost: 20,
    duration: "4 Weeks",
    modules: 8,
    level: "Intermediate → Advanced",
    description: "Core Java OOP principles, Collections, Spring Framework, RESTful endpoints, and JDBC integration."
  },
  {
    id: "prog_7",
    title: "Advanced Excel for Financial & Business Modeling",
    provider: "InsightWorks Institute",
    targetSkill: "Excel",
    scoreBoost: 20,
    duration: "2 Weeks",
    modules: 5,
    level: "Intermediate → Advanced",
    description: "Dynamic array formulas (XLOOKUP), Power Query transformations, scenario managers, and interactive dashboards."
  },
  {
    id: "prog_8",
    title: "Agile Team Collaboration & Engineering Leadership",
    provider: "SkillNexus Leadership Studio",
    targetSkill: "Teamwork",
    scoreBoost: 20,
    duration: "2 Weeks",
    modules: 4,
    level: "Professional",
    description: "Scrum ceremonies, constructive peer code reviews, conflict resolution, and cross-disciplinary delivery."
  }
];

const INITIAL_STUDENTS = [
  {
    id: "stud_1",
    name: "Arun Kumar",
    email: "arun.kumar@campus.edu",
    targetRole: "Data Analyst",
    assessed: false, // Starts with NO assessment so evaluator can take the 8-question test!
    skills: {
      "Python": 0,
      "Java": 0,
      "SQL": 0,
      "Communication": 0,
      "Problem Solving": 0,
      "Data Analysis": 0,
      "Excel": 0,
      "Teamwork": 0
    },
    department: "Computer Science & Engineering",
    batch: "2026",
    avatar: "AK"
  },
  {
    id: "stud_2",
    name: "Priya Sharma",
    email: "priya.sharma@campus.edu",
    targetRole: "Data Analyst",
    assessed: true,
    skills: {
      "Python": 80,
      "Java": 30,
      "SQL": 75,
      "Communication": 85,
      "Problem Solving": 75,
      "Data Analysis": 85,
      "Excel": 70,
      "Teamwork": 90
    },
    department: "Information Technology",
    batch: "2026",
    avatar: "PS"
  },
  {
    id: "stud_3",
    name: "Rahul Kumar",
    email: "rahul.k@campus.edu",
    targetRole: "Python Developer",
    assessed: true,
    skills: {
      "Python": 85,
      "Java": 60,
      "SQL": 60,
      "Communication": 65,
      "Problem Solving": 80,
      "Data Analysis": 50,
      "Excel": 45,
      "Teamwork": 80
    },
    department: "Computer Science & Engineering",
    batch: "2025",
    avatar: "RK"
  },
  {
    id: "stud_4",
    name: "Divya S",
    email: "divya.s@campus.edu",
    targetRole: "Business Analyst",
    assessed: true,
    skills: {
      "Python": 50,
      "Java": 20,
      "SQL": 65,
      "Communication": 85,
      "Problem Solving": 75,
      "Data Analysis": 75,
      "Excel": 80,
      "Teamwork": 85
    },
    department: "Management & Tech",
    batch: "2026",
    avatar: "DS"
  },
  {
    id: "stud_5",
    name: "Ananya Roy",
    email: "ananya.roy@campus.edu",
    targetRole: "Data Analyst",
    assessed: true,
    skills: {
      "Python": 65,
      "Java": 40,
      "SQL": 70,
      "Communication": 80,
      "Problem Solving": 65,
      "Data Analysis": 70,
      "Excel": 65,
      "Teamwork": 75
    },
    department: "Data Science & AI",
    batch: "2026",
    avatar: "AR"
  },
  {
    id: "stud_6",
    name: "Karthik Menon",
    email: "karthik.m@campus.edu",
    targetRole: "Python Developer",
    assessed: true,
    skills: {
      "Python": 75,
      "Java": 50,
      "SQL": 55,
      "Communication": 60,
      "Problem Solving": 70,
      "Data Analysis": 40,
      "Excel": 40,
      "Teamwork": 70
    },
    department: "Computer Science",
    batch: "2025",
    avatar: "KM"
  },
  {
    id: "stud_7",
    name: "Sneha Patel",
    email: "sneha.p@campus.edu",
    targetRole: "Business Analyst",
    assessed: true,
    skills: {
      "Python": 45,
      "Java": 30,
      "SQL": 60,
      "Communication": 90,
      "Problem Solving": 70,
      "Data Analysis": 65,
      "Excel": 75,
      "Teamwork": 90
    },
    department: "Business Systems",
    batch: "2026",
    avatar: "SP"
  },
  {
    id: "stud_8",
    name: "Vikramaditya Rao",
    email: "vikram.rao@campus.edu",
    targetRole: "Data Analyst",
    assessed: true,
    skills: {
      "Python": 60,
      "Java": 50,
      "SQL": 60,
      "Communication": 70,
      "Problem Solving": 60,
      "Data Analysis": 60,
      "Excel": 60,
      "Teamwork": 65
    },
    department: "Information Systems",
    batch: "2025",
    avatar: "VR"
  },
  {
    id: "stud_9",
    name: "Pooja Nair",
    email: "pooja.nair@campus.edu",
    targetRole: "Python Developer",
    assessed: true,
    skills: {
      "Python": 70,
      "Java": 45,
      "SQL": 65,
      "Communication": 75,
      "Problem Solving": 65,
      "Data Analysis": 45,
      "Excel": 50,
      "Teamwork": 80
    },
    department: "Computer Science",
    batch: "2026",
    avatar: "PN"
  },
  {
    id: "stud_10",
    name: "Rohan Verma",
    email: "rohan.v@campus.edu",
    targetRole: "Business Analyst",
    assessed: true,
    skills: {
      "Python": 40,
      "Java": 35,
      "SQL": 50,
      "Communication": 70,
      "Problem Solving": 60,
      "Data Analysis": 55,
      "Excel": 60,
      "Teamwork": 65
    },
    department: "Information Technology",
    batch: "2026",
    avatar: "RV"
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: "app_1",
    studentId: "stud_2", // Priya Sharma
    opportunityId: "opp_1", // TechNova Data Analyst Intern
    status: "Shortlisted",
    appliedDate: "2026-10-03",
    matchPercentage: 92,
    feedback: "Exceptional profile, shortlisted for technical interview round."
  },
  {
    id: "app_2",
    studentId: "stud_3", // Rahul Kumar
    opportunityId: "opp_2", // CodeSphere Python Dev Intern
    status: "Under Review",
    appliedDate: "2026-10-04",
    matchPercentage: 95,
    feedback: "Under technical committee review."
  },
  {
    id: "app_3",
    studentId: "stud_4", // Divya S
    opportunityId: "opp_3", // InsightWorks BA Intern
    status: "Applied",
    appliedDate: "2026-10-05",
    matchPercentage: 94,
    feedback: ""
  }
];
