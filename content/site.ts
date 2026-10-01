import type { Role } from "./types";

export const site = {
  name: "Gaurang Mohan",
  title: "Gaurang Mohan — AI / ML Engineer",
  role: "AI / ML Engineer",
  description:
    "Portfolio of Gaurang Mohan: AI and ML systems for speech, sign language, sensors, and transaction networks, with interactive walkthroughs of how each one works.",
  intro:
    "I build machine-learning systems end to end, from models to the pipelines and interfaces around them, with a focus on speech, sign language, sensors, and transaction data.",
  resume: "/GAURANG-MOHAN_RESUME.pdf",
  email: "gaurangmohan25@gmail.com",
  github: "https://github.com/gaurannggg7",
  linkedin: "https://www.linkedin.com/in/gaurangmmohan/",
  huggingface: "https://huggingface.co/gaurannggg7",
};

// Absolute so the links also work from project pages; contact lives in every page's footer.
export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "#contact" },
];

export const about = [
  "I studied Computer Science at Arizona State University, with a minor in Data Science. I care about ML systems that hold up outside a notebook: pipelines with data-privacy safeguards, services that can actually be deployed, and interfaces people can use.",
  "A lot of my work has been about accessibility. Two of the projects above translate between English and American Sign Language from opposite directions — one from speech to signing video, one from a signing hand to text.",
  "Outside engineering I sketch and paint, read, and follow neuroscience and human behavior.",
];

/** Time-sensitive: review before publishing (see CONTENT_TODO.md). */
export const availability =
  "I'm looking for full-time AI/ML engineering roles. As an international student, I'd need OPT and later H-1B support.";

export const education = {
  school: "Arizona State University, Ira A. Fulton Schools of Engineering",
  degree: "B.S. Computer Science, minor in Data Science",
  note: "New American University Scholar (merit scholarship)",
};

export const roles: Role[] = [
  {
    org: "APMAC Consulting",
    role: "AI & Machine Learning Intern",
    period: "Aug 2025 – Present",
    points: [
      "Developed and integrated OLS regression and AutoML pipelines in a SaaS platform that estimates workforce productivity in dollar value, with 95% confidence intervals on each prediction to support SMB hiring decisions.",
      "Built and stabilized backend ML workflows for dataset ingestion, feature and target selection, model training, and prediction serving.",
      "Worked in an Agile team turning SMB requirements into production features, and contributed to model validation, documentation, and bias and data-privacy safeguards.",
    ],
  },
  {
    org: "Visionary Hands · EPICS at ASU",
    role: "Team Lead",
    period: "Jan 2024 – Dec 2025",
    location: "Tempe, AZ",
    points: [
      "Led a team of seven through design and testing of a wearable glove that translates fingerspelled ASL into text.",
      "Integrated flex sensors, an accelerometer, and a microcontroller; wrote the letter-matching logic in Java and C++.",
      "Pitched the project at the EPICS Elite Pitch competition, which awarded the team $1,000.",
    ],
    project: { label: "How the glove works", href: "/work/visionary" },
  },
  {
    org: "Arizona State University",
    role: "Undergraduate Teaching Assistant",
    period: "Aug 2024 – Dec 2024",
    location: "Tempe, AZ",
    points: [
      "Ran weekly labs for 40+ students on geodesic domes, 3D printing, and polymer synthesis, using MATLAB for data analysis.",
      "Mentored students through their design projects so they finished on schedule.",
    ],
  },
];

export const earlierRoles: Role[] = [
  {
    org: "Programming and Activities Board, ASU",
    role: "Intern",
    period: "Sep 2024 – Dec 2025",
    points: ["Planned and ran campus events with 400+ attendees and led volunteer teams."],
  },
  {
    org: "Arizona State University",
    role: "E2 Camp Counselor",
    period: "Jul 2024 – Aug 2024",
    points: ["Led team-building and STEM activities for 60+ incoming first-year students."],
  },
  {
    org: "EPICS at ASU",
    role: "Coral Reef Restoration Research Lead",
    period: "Jan 2023 – Dec 2023",
    points: [
      "Prototyped 3D-printed coral structures for a reef-restoration project in Barcelona with materials scientists and marine biologists.",
    ],
  },
];
