import type { MinorProject, Project, ProjectSlug } from "./types";

const SIGNLINK_REPO = "https://github.com/gaurannggg7/signlink";
const VH_REPO = "https://github.com/gaurannggg7/vs-spring25";

export const signlink: Project = {
  slug: "signlink",
  name: "SignLink",
  summary: "Spoken or typed English in, a sequence of American Sign Language clips out.",
  period: "2025 – 2026",
  role: "Developer · speech-to-sign pipeline",
  outcome:
    "Turns spoken or typed English into a sequence of ASL sign clips, with a fallback chain so no word is silently dropped.",
  problem:
    "Hard-of-hearing people who sign are often handed spoken English with no interpreter — at a clinic desk, an airport counter, or on a family call. SignLink takes what someone says or types and plays it back as ASL signs.",
  contribution: [
    "Designed the end-to-end pipeline: speech recognition, gloss generation, sign lookup, and video rendering.",
    "Built the three-stage resolver (exact or phrase match, then suffix stripping, then fingerspelling) so no word is silently dropped.",
    "Shipped a first offline desktop build with a local Gemma-3n model (PyInstaller), then reworked it into a hosted app after the single-process version ran out of memory on CPU containers.",
  ],
  howItWorks:
    "Whisper transcribes speech. A constrained prompt to a Gemma model rewrites the English as ASL gloss tokens, with a rule-based fallback if the model call fails. Each token is matched to a CC0 motion-capture clip, and FFmpeg normalizes and joins the clips into one video.",
  stages: [
    {
      id: "input",
      label: "Speech or text",
      short: "Input",
      brief: "Audio upload or typed English.",
      input: "A WAV/MP3 upload or typed English in the Streamlit app. The command-line version can also record from a microphone.",
      process: "Audio goes to the speech-recognition stage. Typed text skips it.",
      output: "Raw audio, or an English sentence.",
      tech: ["Streamlit", "sounddevice (CLI)"],
      source: { label: "app.py", href: `${SIGNLINK_REPO}/blob/main/app.py` },
    },
    {
      id: "asr",
      label: "Whisper ASR",
      short: "ASR",
      brief: "Whisper turns speech into an English transcript.",
      input: "Audio file.",
      process:
        "Loads an OpenAI Whisper model once and caches it, choosing CUDA, Apple MPS, or CPU in that order and falling back to CPU if loading fails. Transcribes with fp16 disabled.",
      output: "English transcript.",
      tech: ["openai-whisper (base model by default)", "PyTorch"],
      rationale:
        "In the hosted version Whisper runs CPU-optimized so the app fits in a CPU container (from the project README).",
      source: { label: "whisper_transcribe.py", href: `${SIGNLINK_REPO}/blob/main/whisper_transcribe.py` },
    },
    {
      id: "gloss",
      label: "Gloss generation",
      short: "Gloss",
      brief: "A constrained Gemma prompt rewrites English as ASL gloss, with a rule-based fallback.",
      input: "English transcript.",
      process:
        "Sends a constrained prompt to google/gemma-2b-it through the Hugging Face Inference API: drop articles, linking verbs, and prepositions, use root verb forms, and choose only words from the sign vocabulary. Low temperature, no sampling. If the call fails or returns nothing, a stopword filter produces the gloss instead.",
      output: "Uppercase gloss tokens, e.g. PLEASE COME HERE.",
      tech: ["Gemma 2B-it (hosted)", "Hugging Face Inference API", "Gemma-3n (earlier offline build)"],
      rationale:
        "The vocabulary constraint is there to maximise matches against signs that actually exist in the clip library (from the code's docstring).",
      limitation:
        "To stay within the context limit, the prompt lists only the first 300 single-word vocabulary entries in alphabetical order, so the model never sees most of the ~1,540-sign vocabulary.",
      source: { label: "gloss_builder.py", href: `${SIGNLINK_REPO}/blob/main/gloss_builder.py` },
    },
    {
      id: "resolve",
      label: "Sign resolver",
      short: "Resolve",
      brief: "Each token becomes a clip: phrase, exact, suffix-stripped, or fingerspelled.",
      input: "Gloss tokens.",
      process:
        "Greedy longest-phrase match first, then exact single-token match, then regex suffix stripping (-ING, -ED, -LY, -S…), and finally fingerspelling with A–Z letter clips. A filesystem index maps each entry to its clip.",
      output: "An ordered list of clip files.",
      tech: ["Python", "pandas", "CSV clip index"],
      rationale:
        "The fallback chain means no input fails silently: every alphabetic token ends up as a sign or as fingerspelling (from the project README).",
      limitation:
        "Suffix stripping is approximate — the code itself notes ATTENTION → ATTEND as an approximation. Words outside the vocabulary are fingerspelled letter by letter.",
      source: { label: "mapping.py", href: `${SIGNLINK_REPO}/blob/main/mapping.py` },
    },
    {
      id: "render",
      label: "FFmpeg renderer",
      short: "Render",
      brief: "FFmpeg normalizes the clips and joins them into one video.",
      input: "Ordered clip files.",
      process:
        "Pass one re-encodes each clip to 1280×720 H.264 with padding and no audio. Pass two joins them with the concat demuxer, copying streams without re-encoding. Temp files are namespaced by process ID.",
      output: "One MP4 shown in the app.",
      tech: ["FFmpeg (subprocess)", "libx264"],
      rationale:
        "Replaced an ffmpeg-python filter graph that broke when filter nodes were reused (\"multiple outgoing edges\"). PID-namespaced temp files stop concurrent requests from colliding (from the project README).",
      limitation:
        "Clips are joined end to end. The code does no blending between signs, and every clip is re-encoded on every request.",
      source: { label: "renderer.py", href: `${SIGNLINK_REPO}/blob/main/renderer.py` },
    },
    {
      id: "serve",
      label: "Hosting",
      short: "Host",
      brief: "Streamlit app on Hugging Face Spaces.",
      input: "App code, plus the clip dataset on Hugging Face.",
      process:
        "A Streamlit app on Hugging Face Spaces downloads the clip dataset at startup. Gloss generation is offloaded to a hosted model, and the app container stays small.",
      output: "A public web app.",
      tech: ["Hugging Face Spaces", "Hugging Face Datasets", "Docker"],
      rationale:
        "The original single-process build ran out of memory on CPU containers once 4 GB+ of model weights were loaded, so storage, speech recognition, and LLM inference were split apart (from the project README).",
      limitation:
        "The hosted version needs a network connection and an API token for the LLM stage. Without them it falls back to the simpler stopword gloss.",
      source: { label: "README", href: `${SIGNLINK_REPO}#readme` },
    },
  ],
  tradeoffs: [
    {
      title: "Offline build vs. hosted app",
      body: "The first version bundled Whisper and a local Gemma-3n model into a desktop binary so it could run without a connection. The hosted version gave that up: clips live in a Hugging Face Dataset and gloss generation calls a hosted model, which let the app run in a small CPU container.",
    },
    {
      title: "FFmpeg subprocesses over a filter graph",
      body: "Normalizing clips one at a time and then joining them with the concat demuxer replaced a single ffmpeg-python graph that failed on reused filter nodes.",
    },
  ],
  limitations: [
    "No evaluation of translation quality with ASL users is documented in the repository.",
    "The output is isolated dictionary signs placed one after another, not fluent ASL sentences.",
  ],
  results: [
    {
      value: "1,540",
      context: "signs in the clip index, plus A–Z fingerspelling clips. Counted from the repository's index file; this is vocabulary size, not accuracy.",
    },
    {
      value: "No silent drops",
      context: "By design, every alphabetic token resolves to a sign or to fingerspelling. Numbers and punctuation are removed earlier, by the gloss stage.",
    },
  ],
  links: [
    { label: "Repository", href: SIGNLINK_REPO, kind: "repo" },
    { label: "Live app", href: "https://huggingface.co/spaces/gaurannggg7/Signlink", kind: "live", note: "Hugging Face Space, may take a minute to wake" },
    { label: "Recorded demo", href: "https://youtu.be/33DwsluZMfA", kind: "video", note: "earlier offline build, YouTube" },
    { label: "Sign dataset", href: "https://huggingface.co/datasets/gaurannggg7/asl-dictionary", kind: "dataset" },
  ],
  provenance: {
    summary: "How the prepared examples were made",
    points: [
      "Each sentence was run through the repository's _simple_gloss fallback and ASLDictionary resolver against the published clip index.",
      "The hosted app normally uses a Gemma model for the gloss step, so its gloss can differ from the one shown.",
      "Clips are the original files from the StudioGalt Sign-Language Mocap Archive (CC0), streamed from SignLink's Hugging Face dataset. They are not SignLink's rendered output.",
    ],
  },
  stack: ["Python", "Whisper", "Gemma", "Hugging Face", "FFmpeg", "Streamlit", "PyTorch"],
};

export const guardian: Project = {
  slug: "guardian",
  name: "GuardianAI",
  summary: "Finding structured money-laundering patterns in transaction networks.",
  role: "Developer",
  outcome:
    "Combines graph centrality with a gradient-boosted classifier to surface laundering patterns that one-transaction-at-a-time checks miss.",
  problem:
    "In \"smurfing\", a large sum is split into many small transfers across several accounts, so no single transfer looks unusual. Checking transactions one at a time misses it. The pattern only shows up in how the accounts connect.",
  howItWorks:
    "A hybrid approach: graph-centrality scores (PageRank) computed over the account network feed an XGBoost classifier, and flagged activity is written up as reports for review.",
  stages: [
    {
      id: "ingest",
      label: "Transaction records",
      input: "Historical transaction records: sender, receiver, amount, time.",
      process: "Loads and prepares the records for graph construction and modelling.",
      output: "A clean transaction table.",
      tech: ["Python"],
    },
    {
      id: "graph",
      label: "Graph centrality",
      input: "Transaction table.",
      process:
        "Treats accounts as nodes and transfers as edges, then computes PageRank so accounts that collect money from many sources stand out.",
      output: "Per-account centrality features.",
      tech: ["PageRank"],
    },
    {
      id: "classify",
      label: "Classifier",
      input: "Centrality and transaction features.",
      process: "An XGBoost model scores activity as likely laundering or not.",
      output: "Risk scores and flags.",
      tech: ["XGBoost"],
    },
    {
      id: "report",
      label: "Threat reports",
      input: "Flagged accounts and transactions.",
      process: "Summarizes flagged activity for a human reviewer.",
      output: "Reports for review.",
      tech: [],
    },
  ],
  links: [],
  availability: "The code and data aren't public yet, so the example below uses synthetic data.",
  provenance: {
    summary: "About the synthetic example",
    points: [
      "Accounts, amounts, and times are hand-made to show a fan-out and fan-in structuring pattern.",
      "PageRank is weighted by amount, with damping 0.85, and computed in your browser on these 12 accounts.",
      "It shows why centrality is a useful feature. It does not reproduce GuardianAI's classifier or its results.",
    ],
  },
  stack: ["Python", "XGBoost", "PageRank", "Graph features"],
};

export const visionary: Project = {
  slug: "visionary",
  name: "Visionary Hands",
  summary: "A glove that reads fingerspelled ASL letters and turns them into text.",
  period: "Jan 2024 – Dec 2025",
  role: "Team lead · EPICS at ASU · team of 7",
  outcome:
    "A sensor glove that matches finger bend and hand motion to fingerspelled letters and assembles them into words.",
  problem:
    "Most people who don't sign can't read fingerspelling. Visionary Hands measures how each finger bends, plus hand motion, matches that to a letter, and builds words out of the letters.",
  contribution: [
    "Led a team of seven through design and testing.",
    "Integrated the flex sensors, the MPU6050 accelerometer/gyroscope, and the microcontroller.",
    "Wrote the letter-matching logic in Java (Strain.java) and C++ (firmware), and documented how sensor readings become letters.",
    "Pitched at the EPICS Elite Pitch competition, which awarded the team $1,000.",
  ],
  howItWorks:
    "Five flex sensors give one bend value per finger. After calibration, each value is scaled to 0–100 and the reading is compared with a hand-tuned template for every letter. The closest template wins. Motion from the MPU6050 separates the moving letters J and Z from the still letters I and D. A letter only counts after five matching readings in a row, and letters are buffered into words.",
  stages: [
    {
      id: "sense",
      label: "Sensors",
      input: "Finger bend and hand motion.",
      process:
        "analogRead on five flex-sensor pins (pinky 17, ring 5, middle 18, index 19, thumb 21). An MPU6050 on I²C (SDA 23, SCL 22) raises a motion interrupt.",
      output: "Five raw bend values, plus acceleration and gyro readings.",
      tech: ["Flex sensors", "MPU6050", "Adafruit MPU6050 library"],
      source: { label: "combined_code.ino", href: `${VH_REPO}/blob/main/combined_code/combined_code.ino` },
    },
    {
      id: "calibrate",
      label: "Calibration",
      input: "Raw bend values.",
      process:
        "While calibrating, it records each finger's minimum and maximum. After that, each reading is shifted by the minimum and scaled to 0–100 using that finger's range.",
      output: "Five calibrated values from 0 to 100.",
      tech: ["C++ (Arduino framework)"],
      limitation:
        "In the latest committed sketch, the check that ends calibration is disabled (`&& false`), so the device keeps calibrating.",
      source: { label: "SensorReading.cpp", href: `${VH_REPO}/blob/main/combined_code/SensorReading.cpp` },
    },
    {
      id: "match",
      label: "Template match",
      input: "Calibrated five-value vector.",
      process:
        "Computes the Euclidean distance to all 26 letter templates and a blank-hand \"space\" template, and picks the closest. If motion is detected, I becomes J and D becomes Z.",
      output: "One candidate character.",
      tech: ["C++", "Java prototype (Strain.java)"],
      limitation:
        "The letter V has no template yet (placeholder values). Q, T, and U share one template, so the code always returns Q for that hand shape.",
      source: { label: "infoProcessing.cpp", href: `${VH_REPO}/blob/main/combined_code/infoProcessing.cpp` },
    },
    {
      id: "stabilize",
      label: "Stability check",
      input: "A stream of candidate characters.",
      process: "Accepts a character only after five consecutive readings agree. Any change clears the history.",
      output: "A confirmed letter.",
      tech: ["C++"],
      source: { label: "SensorReading.cpp", href: `${VH_REPO}/blob/main/combined_code/SensorReading.cpp` },
    },
    {
      id: "output",
      label: "Text & audio",
      input: "Confirmed letters.",
      process:
        "Appends letters to a buffer of up to 10 characters. A space, or a full buffer, ends the word, which is printed over serial.",
      output: "A word as text. Audio output is part of the project's description, but there is no audio code in the repository.",
      tech: ["Serial output"],
      source: { label: "infoProcessing.cpp", href: `${VH_REPO}/blob/main/combined_code/infoProcessing.cpp` },
    },
  ],
  limitations: [
    "The latest committed firmware has learning_mode = true. That is a data-collection setup that labels readings with a fixed letter rather than classifying them.",
    "Templates are tuned by hand, so a new user or a different glove needs re-tuning. The firmware has an unfinished hand-size calibration step for this.",
  ],
  results: [
    {
      value: "26 + space",
      context: "templates in the firmware's letter table. V is still a placeholder in the committed version.",
    },
  ],
  links: [{ label: "Repository", href: VH_REPO, kind: "repo" }],
  provenance: {
    summary: "Where the matcher comes from",
    points: [
      "The 26 letter templates and the nearest-template rule are copied from combined_code/infoProcessing.cpp.",
      "A Java prototype of the same approach (Strain.java) is also in the repository.",
      "Values are ones you set with the sliders, not sensor data, and the five-reading stability check is skipped.",
    ],
  },
  stack: ["C++", "Arduino framework", "Java", "MPU6050", "Flex sensors", "Python (data extraction)"],
};

const BL_REPO = "https://github.com/gaurannggg7/cpg-cfo-agent";

export const baseline: Project = {
  slug: "baseline",
  name: "Baseline",
  summary: "A multi-agent LLM pipeline that turns a transaction CSV into an executive financial brief.",
  outcome:
    "Turns a transaction CSV into an executive financial brief, with the financial figures computed in code rather than by the model.",
  period: "Jun – Aug 2026",
  role: "Sole developer",
  problem:
    "A raw transaction ledger doesn't say much on its own. Baseline takes a CSV of transactions and returns what a finance lead would ask for: spend by category, anything unusual, runway, and a short written brief.",
  contribution: [
    "Built the LangGraph pipeline: three LLM nodes (categorize, detect anomalies, summarize) and a runway node in plain Python.",
    "Built the FastAPI backend with Firebase ID-token verification, and per-user data isolation enforced in Firestore Security Rules.",
    "Wrote a 29-case adversarial CSV corpus and used it to take the structured-error pass rate from 62% to 100%, removing all 10 unhandled crashes.",
    "Moved category totals and runway arithmetic out of the model into pandas and Python after measuring that the model's figures varied between identical runs.",
    "Restructured the graph into a parallel fan-out/fan-in and documented why the end-to-end gain is capped.",
  ],
  howItWorks:
    "A CSV is validated in the backend first, then three nodes run in parallel: an LLM buckets spend into categories, an LLM flags anomalies with a risk level, and Python computes runway. A final LLM node writes the brief from all three. Totals come from pandas, not the model.",
  stages: [
    {
      id: "parse",
      label: "Validate CSV",
      input: "A CSV upload (date, amount, description, category), with a Firebase ID token.",
      process:
        "parse_transactions() checks encoding, empty files, duplicate headers, ragged rows, required columns, numeric amounts, and dates. It cleans currency formatting and returns a structured 422 error instead of crashing.",
      output: "A clean pandas frame, or a machine-readable error code.",
      tech: ["FastAPI", "pandas", "Firebase Admin SDK"],
      rationale:
        "Hostile inputs were crashing the API with unhandled 500s. Validating up front turns every rejected file into a structured error (from eval/RESULTS.md).",
      source: { label: "backend/main.py", href: `${BL_REPO}/blob/main/backend/main.py` },
    },
    {
      id: "categorize",
      label: "Categorize spend",
      input: "Validated transactions.",
      process: "An LLM call in JSON mode buckets each transaction into COGS, OpEx, S&M, R&D, or Other, using a pinned item schema.",
      output: "Transactions grouped by category. The category totals are summed in pandas, not by the model.",
      tech: ["LangGraph node", "Groq (gpt-oss-120b; earlier Llama 3.3 70B)"],
      rationale:
        "Model-produced totals disagreed with the real sum by more than 5% in 16 of 19 runs, so totals are now computed in pandas (from eval/RESULTS.md).",
      source: { label: "backend/agent.py", href: `${BL_REPO}/blob/main/backend/agent.py` },
    },
    {
      id: "anomalies",
      label: "Detect anomalies",
      input: "Validated transactions.",
      process: "An LLM call in JSON mode flags outliers and assigns a Low, Medium, or High risk level with suggested actions.",
      output: "An anomaly list, a risk level, and actions.",
      tech: ["LangGraph node", "Groq"],
      limitation:
        "Anomaly lists still vary between identical runs, even at temperature 0 with a fixed seed.",
      source: { label: "backend/agent.py", href: `${BL_REPO}/blob/main/backend/agent.py` },
    },
    {
      id: "runway",
      label: "Runway (Python)",
      input: "Monthly spend, monthly revenue, and cash on hand if supplied.",
      process:
        "Pure Python: cash on hand divided by net monthly burn. It returns null with a stated reason when cash on hand isn't given, instead of producing a number.",
      output: "Runway in months, or null with a reason.",
      tech: ["Python"],
      rationale:
        "When the old code asked the model to echo a computed value of 999.0, it never once returned 999.0 across 19 runs. Arithmetic was removed from the model entirely (from the agent.py docstring).",
      source: { label: "backend/agent.py", href: `${BL_REPO}/blob/main/backend/agent.py` },
    },
    {
      id: "summarize",
      label: "Executive brief",
      input: "Categories, anomalies, and runway from the three parallel nodes.",
      process: "A final LLM call writes the plain-text brief for a finance lead.",
      output: "Summary text plus the structured results.",
      tech: ["LangGraph node", "Groq"],
      rationale:
        "Four narrow nodes instead of one prompt give each stage a checkable output, so a failure can be traced to a specific stage (from ARCHITECTURE.md).",
      limitation:
        "Summary text isn't reproducible: 7 runs of the same input gave 7 different summaries.",
      source: { label: "backend/agent.py", href: `${BL_REPO}/blob/main/backend/agent.py` },
    },
    {
      id: "serve",
      label: "Accounts and hosting",
      input: "Browser requests from guests and signed-in users.",
      process:
        "Next.js on Vercel calls the FastAPI backend on Render. Guests can run analyses but can't save them. Signed-in users get a dashboard of past analyses, isolated per user by Firestore rules.",
      output: "A public demo plus saved per-user history.",
      tech: ["Next.js 16", "Firebase Auth", "Firestore", "Vercel", "Render"],
      rationale:
        "Guest mode exists because a reviewer won't create an account just to try a demo. Isolation lives in the security rules rather than in application code (from ARCHITECTURE.md).",
      limitation: "The backend runs on Render's free tier, so the first request after it has slept can take 30–60 seconds.",
      source: { label: "ARCHITECTURE.md", href: `${BL_REPO}/blob/main/ARCHITECTURE.md` },
    },
  ],
  tradeoffs: [
    {
      title: "Arithmetic out of the model",
      body: "Category totals moved to pandas and runway to Python. Those figures became identical across runs; the narrative text did not. Fixing temperature and seed narrowed the drift but didn't remove it.",
    },
    {
      title: "Parallel graph on a rate-limited tier",
      body: "The three independent nodes now run concurrently, which was verified as a 3× speedup on a synthetic graph. On the free tier, though, the parallel calls hit a shared tokens-per-minute limit together, and the summary step (53% of wall-clock) can't run early, so the end-to-end gain is capped at about 17%.",
    },
  ],
  limitations: [
    "Measured median latency was about 14 seconds. Only 1 of 18 evaluated runs finished in under 3 seconds.",
    "The evaluation was run on Llama 3.3 70B, which has since been retired. The model-specific numbers haven't been re-measured on gpt-oss-120b.",
    "Two Grafana panels (per-agent time, token usage) are defined but never populated, and the Kubernetes manifests have never been applied to a live cluster.",
  ],
  results: [
    {
      value: "62% → 100%",
      context:
        "Structured-error pass rate on a 29-file adversarial CSV corpus (27 evaluated; 2 not run because of API quota). Unhandled crashes went from 10 to 0. This doesn't depend on the model.",
    },
    {
      value: "Deterministic figures",
      context:
        "Category totals and runway gave 1 distinct value across 7 identical runs, down from 22 in 22 before. They're computed in code now; the summary text still varies.",
    },
    {
      value: "70% recall",
      context:
        "On one planted −$85,000 outlier over 10 runs, measured on the retired Llama 3.3 model. Precision was 88% or 70% depending on the scoring rule.",
    },
  ],
  links: [
    { label: "Live demo", href: "https://cpg-cfo-agent.vercel.app", kind: "live", note: "Try Demo → Try Sample Data; backend may take 30–60s to wake" },
    { label: "Repository", href: BL_REPO, kind: "repo", note: "named cpg-cfo-agent, the original working title" },
    { label: "Evaluation report", href: `${BL_REPO}/blob/main/eval/RESULTS.md`, kind: "repo" },
    { label: "Architecture notes", href: `${BL_REPO}/blob/main/ARCHITECTURE.md`, kind: "repo" },
  ],
  provenance: {
    summary: "Where these numbers come from",
    points: [
      "Per-node times and evaluation results are from the repository's eval/RESULTS.md. They were measured against Llama 3.3 70B at temperature 0, seed 42.",
      "The pipeline has since moved to gpt-oss-120b. One post-migration smoke test returned in 9.7s, but the full evaluation hasn't been re-run.",
      "Nothing on this page calls the live API.",
    ],
  },
  stack: ["Python", "LangGraph", "FastAPI", "Groq", "pandas", "Next.js", "Firebase", "Docker"],
};

export const featured: Record<ProjectSlug, Project> = { signlink, baseline, guardian, visionary };

/** Display order used by every view. */
export const PROJECT_ORDER: ProjectSlug[] = ["signlink", "baseline", "guardian", "visionary"];

export const moreProjects: MinorProject[] = [
  {
    name: "Workforce productivity prediction",
    context: "APMAC Consulting · internship",
    summary:
      "OLS regression and AutoML pipelines inside a SaaS product that estimate workforce productivity in dollars, with 95% confidence intervals, covering ingestion, feature/target selection, training, and serving.",
    stack: ["Python", "AutoML", "OLS", "SQL", "Pandas", "scikit-learn"],
    links: [],
    anchor: "#experience",
  },
  {
    name: "Urban food insecurity in Phoenix",
    context: "SpaceHACK 2025 · team of 5",
    summary:
      "Layered satellite and public datasets in Google Earth Engine — Sentinel-2 NDVI, USGS land cover, the USDA Food Access Atlas, Census tracts, and NASA SMAP soil moisture — to find unused land near food-insecure neighbourhoods that could host urban agriculture.",
    stack: ["Google Earth Engine", "Colab", "NDVI", "Census data"],
    links: [
      { label: "Repository", href: "https://github.com/gaurannggg7/Urban-Food-Insecurity-in-Phoenix-SpaceHACK-25", kind: "repo" },
      { label: "Slides", href: "https://docs.google.com/presentation/d/1pZ4uj7TJLrP7FQke3R3ZJxvANbYYbjn2/edit?usp=sharing", kind: "slides" },
    ],
  },
  {
    name: "Agentic OSINT analyst",
    context: "Personal project",
    summary:
      "A retrieval-augmented pipeline over financial filings: document ingestion, LangChain retrieval, step-by-step reasoning, then a written synthesis.",
    stack: ["LangChain", "RAG", "Python"],
    links: [],
  },
];
