import type { Role } from "./types";

export const site = {
  name: "Gaurang Mohan",
  title: "Gaurang Mohan — AI / ML Engineer",
  role: "AI / ML Engineer",
  description:
    "Portfolio of Gaurang Mohan, AI engineer: LLM agents, evaluation harnesses, retrieval, and accessibility ML, each with source-grounded walkthroughs.",
  /** One-line focus statement used on every opening screen. */
  focus: "AI engineer building LLM agents, evaluation harnesses, and retrieval systems that show their evidence.",
  intro:
    "I build AI systems end to end, from the model calls to the APIs, evaluation, and interfaces around them. My recent work is agent pipelines, regression testing for LLM behaviour, and cited retrieval over public records.",
  email: "gaurangmohan25@gmail.com",
  github: "https://github.com/gaurannggg7",
  linkedin: "https://www.linkedin.com/in/gaurang-mohan/",
  huggingface: "https://huggingface.co/gaurannggg7",
};

// Absolute so the links also work from project pages; contact lives in every page's footer.
/** The single source for every résumé link on the site. */
export const resume = {
  pdf: "/Gaurang_Mohan_AI_Engineer_Portfolio_Resume.pdf",
  docx: "/Gaurang_Mohan_AI_Engineer_Portfolio_Resume.docx",
  updated: "Oct 2026",
};

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "#contact" },
];

export const about = [
  "I graduated from Arizona State University in May 2026 with a B.S. in Computer Science (cum laude) and a minor in Data Science. I care about ML systems that hold up outside a notebook: pipelines with data-privacy safeguards, services that can actually be deployed, and interfaces people can use.",
  "A lot of my work has been about accessibility. Two of the projects above translate between English and American Sign Language from opposite directions — one from speech to signing video, one from a signing hand to text.",
  "Outside engineering I sketch and paint, read, and follow neuroscience and human behavior.",
];

/** Time-sensitive: review before publishing (see CONTENT_TODO.md). */
export const availability =
  "I'm looking for full-time AI/ML engineering roles. As an international student, I'd need OPT and later H-1B support.";

export const education = {
  school: "Arizona State University, Ira A. Fulton Schools of Engineering",
  degree: "B.S. Computer Science, minor in Data Science",
  period: "May 2026",
  note: "Cum Laude · New American University Scholar (merit scholarship)",
};

export const roles: Role[] = [
  {
    org: "APMAC Consulting",
    role: "AI & ML Backend Engineer",
    period: "Sep 2025 – May 2026",
    location: "Remote",
    points: [
      "Built async FastAPI and Pydantic endpoints serving AutoML and OLS regression models behind role-based access, with 95% confidence intervals on each prediction.",
      "Containerized the FastAPI and Next.js services with Docker and deployed them to AWS (VPC, RDS, ECS, ALB) with Terraform.",
      "Built a multi-provider OAuth2 CRM integration with HMAC-signed service requests and CSRF and replay protection, on a feature branch pending merge.",
    ],
  },
  {
    org: "CueAway Technologies",
    role: "AI Engineer",
    period: "Oct 2024 – Oct 2025",
    location: "Remote",
    points: [
      "Designed planner, retriever, vision, and recommender agents that use user measurements, product metadata, and style preferences for a virtual try-on platform; improved retrieval relevance by 35% and cut irrelevant outputs by 28%.",
      "Built the platform's RAG, multimodal-embedding, GAN, and PyTorch recommendation workflows, bringing real-time recommendation latency under 200 ms.",
      "Deployed the microservices on AWS EKS with Docker and Kubernetes, adding model caching and asynchronous inference: API response time improved 40%, redundant model calls fell 30%, and throughput rose 2.5×.",
    ],
    note: "Figures are from internal measurements at CueAway; the evaluation sets and baselines aren't public.",
  },
  {
    org: "Visionary Hands · EPICS at ASU",
    role: "Project Team Lead & Embedded ML Engineer",
    period: "Jan 2024 – Dec 2025",
    location: "Tempe, AZ",
    points: [
      "Led the interdisciplinary team through design and testing of a wearable glove that translates fingerspelled ASL into text, including a usability test with 10 people.",
      "Integrated flex sensors, an MPU6050 motion sensor, and an ESP32; wrote the letter-matching logic in Java and C++.",
      "Pitched the project at the EPICS Elite Pitch competition, where the team placed third ($1,000).",
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
