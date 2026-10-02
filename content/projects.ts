import type { MinorProject, Project, ProjectSlug } from "./types";

const SIGNLINK_REPO = "https://github.com/gaurannggg7/signlink";
const VH_REPO = "https://github.com/gaurannggg7/vs-spring25";

export const signlink: Project = {
  slug: "signlink",
  name: "SignLink",
  summary: "Spoken or typed English in, a sequence of American Sign Language clips out.",
  period: "May 2025 – Jun 2026",
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
    { label: "Open app", href: "https://huggingface.co/spaces/gaurannggg7/Signlink", kind: "live", note: "Hugging Face Space, may take a minute to wake" },
    { label: "Repository", href: SIGNLINK_REPO, kind: "repo" },
    { label: "Watch demo", href: "https://youtu.be/33DwsluZMfA", kind: "video", note: "earlier offline build, YouTube" },
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
  role: "Project team lead · EPICS at ASU",
  outcome:
    "A sensor glove that matches finger bend and hand motion to fingerspelled letters and assembles them into words.",
  problem:
    "Most people who don't sign can't read fingerspelling. Visionary Hands measures how each finger bends, plus hand motion, matches that to a letter, and builds words out of the letters.",
  contribution: [
    "Led the interdisciplinary team through design and testing, including a usability test with 10 people.",
    "Integrated the flex sensors, the MPU6050 accelerometer/gyroscope, and the ESP32 microcontroller.",
    "Wrote the letter-matching logic in Java (Strain.java) and C++ (firmware), and documented how sensor readings become letters.",
    "Pitched at the EPICS Elite Pitch competition, where the team placed third ($1,000).",
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
      tech: ["C++ (Arduino framework on ESP32)"],
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
  stack: ["C++", "ESP32", "Arduino framework", "Java", "MPU6050", "Flex sensors"],
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
    "Exposed the pipeline as three FastMCP tools (full brief, categorization, runway) over stdio for Claude Desktop.",
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
      tech: ["LangGraph node", "Groq · openai/gpt-oss-120b (configured now)", "llama-3.3-70b-versatile (when evaluated)"],
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
    "Every measurement in the evaluation was taken on llama-3.3-70b-versatile, which Groq has since shut down. The code now runs openai/gpt-oss-120b, and the model-specific numbers haven't been re-measured on it.",
    "Two Grafana panels (per-agent time, token usage) are defined but never populated, and the Kubernetes manifests have never been applied to a live cluster.",
  ],
  results: [
    {
      value: "62% → 100%",
      context:
        "Structured-error pass rate on a 29-file adversarial CSV corpus (27 evaluated; 2 not run because of API quota). Unhandled crashes went from 10 to 0. Model-independent: validation runs before any LLM call, and it was re-verified after the switch to gpt-oss-120b.",
    },
    {
      value: "Deterministic figures",
      context:
        "Category totals and runway gave 1 distinct value across 7 identical runs, down from 22 in 22 before. Measured on llama-3.3-70b-versatile. The figures are now computed in code, so they don't come from the model, but the report hasn't re-run this check on gpt-oss-120b. The summary text still varies.",
    },
    {
      value: "70% recall",
      context:
        "On one planted −$85,000 outlier over 10 runs, measured on llama-3.3-70b-versatile. Precision was 88% or 70% depending on the scoring rule. Not re-measured on gpt-oss-120b.",
    },
  ],
  links: [
    { label: "Open app", href: "https://cpg-cfo-agent.vercel.app", kind: "live", note: "Try Demo → Try Sample Data; backend may take 30–60s to wake" },
    { label: "Repository", href: BL_REPO, kind: "repo", note: "named cpg-cfo-agent, the original working title" },
    { label: "Evaluation report", href: `${BL_REPO}/blob/main/eval/RESULTS.md`, kind: "doc" },
    { label: "Architecture notes", href: `${BL_REPO}/blob/main/ARCHITECTURE.md`, kind: "doc" },
  ],
  provenance: {
    summary: "Where these numbers come from",
    points: [
      "Per-node times and evaluation results are from the repository's eval/RESULTS.md. They were measured against Llama 3.3 70B at temperature 0, seed 42.",
      "The pipeline has since moved to gpt-oss-120b. One post-migration smoke test returned in 9.7s, but the full evaluation hasn't been re-run.",
      "Nothing on this page calls the live API.",
    ],
  },
  model: {
    current: "openai/gpt-oss-120b on Groq",
    evaluated: "llama-3.3-70b-versatile on Groq (temperature 0, seed 42)",
    note: "Groq shut the Llama model down on 2026-08-16. The parse-layer and pipeline fixes hold on either model; latency, anomaly recall, and text-variation numbers are Llama-only.",
  },
  evidence: [
    { kind: "measured", claim: "Structured-error pass rate 62% → 100% on a 29-file adversarial CSV corpus (27 run).", source: { label: "eval/RESULTS.md", href: `${BL_REPO}/blob/main/eval/RESULTS.md` } },
    { kind: "measured", claim: "Median latency about 14 s; 70% anomaly recall on one planted outlier. Both measured on llama-3.3-70b-versatile, before the switch to gpt-oss-120b.", source: { label: "eval/RESULTS.md", href: `${BL_REPO}/blob/main/eval/RESULTS.md` } },
    { kind: "implemented", claim: "Totals in pandas and runway in plain Python, outside the model.", source: { label: "backend/agent.py", href: `${BL_REPO}/blob/main/backend/agent.py` } },
    { kind: "implemented", claim: "Three FastMCP tools over stdio.", source: { label: "services/mcp/server.py", href: `${BL_REPO}/blob/main/services/mcp/server.py` } },
    { kind: "implemented", claim: "gRPC gateway, Kafka, Prometheus, and Grafana run in local Docker Compose only; the Kubernetes manifests have never been applied.", source: { label: "docker-compose.yml", href: `${BL_REPO}/blob/main/docker-compose.yml` } },
    { kind: "not-measured", claim: "Model-specific numbers on the current gpt-oss-120b model." },
  ],
  stack: ["Python", "LangGraph", "FastAPI", "Groq", "FastMCP", "pandas", "Next.js", "Firebase", "Docker"],
};

const BW_REPO = "https://github.com/gaurannggg7/AI-Evaluation-Observability-Framework-for-Clinical-AI-Companions";
const BW_APP = "https://bellwether-eval.vercel.app";

export const bellwether: Project = {
  slug: "bellwether",
  name: "Bellwether",
  summary: "An independent evaluation and regression-testing prototype for AI companions, built on synthetic scenarios.",
  outcome:
    "An independent evaluation and regression-testing prototype for AI companions, run on 60 synthetic scenarios. In its prompt comparison, urgent routing recall held at 1.0 while response quality fell, and the deployment gate blocked the change.",
  period: "Aug 2026",
  role: "Sole developer",
  problem:
    "When an AI companion's prompt or model changes, a single headline metric can stay flat while the replies themselves get worse. Bellwether scores every response on seven dimensions, compares prompt versions scenario by scenario, and fails a deployment gate when a blocking metric regresses. Every scenario is synthetic and every published run is a deterministic mock run: the results test the harness, not the clinical safety of any system.",
  contribution: [
    "Wrote 60 synthetic scenarios with reference labels and expected actions, and kept those labels out of both the generator's and the evaluator's context.",
    "Built two independent risk readings (a deterministic rules layer and a model classifier) and a rubric evaluator that scores seven dimensions, three of them hard gates.",
    "Wrote a deterministic router whose rules can only raise an action, and records every rule it applied.",
    "Built prompt-version comparison and a regression gate that exits non-zero, plus a Next.js dashboard that reads a committed snapshot of the results.",
  ],
  howItWorks:
    "Each synthetic scenario goes through a context builder that decides what the generator and the evaluator may see. A rules layer and a classifier read the conversation independently and are fused. The generator writes a reply; a separate evaluator scores it on seven dimensions; a deterministic router decides the simulated action. Two runs with different prompt versions are then compared metric by metric, and any regression in a blocking metric fails the gate.",
  stages: [
    {
      id: "scenarios",
      label: "Synthetic scenarios",
      short: "Scenarios",
      brief: "60 synthetic conversations, each with a reference label and expected action.",
      input: "Hand-written scenario files: patient context, treatment goal, approved coping strategy, conversation, user message.",
      process: "Each scenario carries a reference label (ideation severity, behaviour, risk context) and an expected simulated action, used only for scoring afterwards.",
      output: "Dataset version 1.1.0, 60 scenarios.",
      tech: ["Python", "JSON"],
      limitation: "All scenarios and labels were written by one author for engineering evaluation. None are clinical data, and none are clinically validated.",
      source: { label: "data/schema.md", href: `${BW_REPO}/blob/main/data/schema.md` },
    },
    {
      id: "context",
      label: "Context builder",
      short: "Context",
      brief: "Decides what the generator and evaluator may see. Neither sees the reference label.",
      input: "One scenario.",
      process: "Builds two different views deterministically. The generator gets the context it would plausibly have at inference time. The evaluator gets the same context plus the rubric and the candidate reply. Neither gets the reference label or the expected action.",
      output: "A generator context and an evaluator context.",
      tech: ["Python"],
      rationale: "If the evaluator saw the label, evaluator-vs-reference agreement would be a tautology rather than a measurement (from the module docstring).",
      source: { label: "evaluation/context.py", href: `${BW_REPO}/blob/main/evaluation/context.py` },
    },
    {
      id: "signals",
      label: "Signal readings",
      short: "Signals",
      brief: "A rules layer and a classifier read the conversation separately, then are fused.",
      input: "Generator context.",
      process: "Deterministic phrase rules and an independent classifier each produce a concern level. Fusion keeps both readings, records whether they agree, and lowers confidence when they don't.",
      output: "A concern level, confidence, detected signals, and reason codes.",
      tech: ["Python", "Groq (live mode)", "mock classifier (offline)"],
      rationale: "The rules layer exists to be predictable, especially on benign language a model may over-read (from the module docstring).",
      source: { label: "evaluation/safety.py", href: `${BW_REPO}/blob/main/evaluation/safety.py` },
    },
    {
      id: "generate",
      label: "Generation",
      short: "Generate",
      brief: "A versioned prompt produces the reply. Offline, a mock generator follows the prompt's switches.",
      input: "Generator context and a prompt version.",
      process: "In live mode a model is called with the versioned system prompt. In mock mode a deterministic generator applies the prompt's behavioural switches (lead with coping, when to mention the care team, whether to acknowledge a disclosure).",
      output: "One candidate reply.",
      tech: ["Python", "Groq (live mode)"],
      limitation: "Every run in the published snapshot is a mock run. The comparison shows the harness catching a behavioural change; it is not a measurement of a live model.",
      source: { label: "pipeline/prompts.py", href: `${BW_REPO}/blob/main/pipeline/prompts.py` },
    },
    {
      id: "evaluate",
      label: "Rubric evaluation",
      short: "Evaluate",
      brief: "Seven scored dimensions. Safety, escalation correctness, and policy adherence are hard gates.",
      input: "Evaluator context and the candidate reply.",
      process: "Scores seven dimensions from 0 to 1 with reason codes. A weighted aggregate is reported for trends only; a failed hard-gate dimension fails the reply whatever the aggregate says.",
      output: "Dimension scores, reason codes, assessed concern, hard-gate result.",
      tech: ["Python"],
      rationale: "An average lets several good dimensions hide one unsafe one, so hard-gate failures cannot be averaged away (from evaluation/scoring.py).",
      source: { label: "evaluation/scoring.py", href: `${BW_REPO}/blob/main/evaluation/scoring.py` },
    },
    {
      id: "route",
      label: "Deterministic router",
      short: "Route",
      brief: "Rules raise the simulated action and never lower it. Every rule applied is recorded.",
      input: "Fused concern level and the evaluator's findings.",
      process: "Maps the concern signal to a simulated action, then lets named rules raise it, for example when the reply itself failed a hard gate.",
      output: "A simulation label such as ESCALATE_SIMULATION, with the rules that produced it.",
      tech: ["Python"],
      rationale: "Same inputs give the same decision, and an averaged decision could let many benign signals outvote one serious one (from the module docstring).",
      limitation: "Outputs are labels only. The system cannot and does not contact anyone.",
      source: { label: "models/router.py", href: `${BW_REPO}/blob/main/models/router.py` },
    },
    {
      id: "gate",
      label: "Regression gate",
      short: "Gate",
      brief: "Compares two runs metric by metric and exits non-zero when a blocking metric regresses.",
      input: "Metrics from a baseline run and a candidate run.",
      process: "Each metric has a direction, a tolerance, and a blocking flag. The comparison never knows which version is supposed to win. The CLI exits non-zero when the gate blocks, so a deployment pipeline stops.",
      output: "Deltas, per-scenario regressions, and a pass/block decision.",
      tech: ["Python", "SQLite"],
      source: { label: "pipeline/regression.py", href: `${BW_REPO}/blob/main/pipeline/regression.py` },
    },
    {
      id: "dashboard",
      label: "Snapshot dashboard",
      short: "Dashboard",
      brief: "A static Next.js dashboard built from a committed JSON snapshot of the runs.",
      input: "SQLite results exported to eval-dashboard/data/snapshot.json.",
      process: "A sync script serialises the pipeline's output; the dashboard validates the snapshot at build time and is prerendered.",
      output: "The public dashboard.",
      tech: ["Next.js", "TypeScript", "Vercel"],
      rationale: "Vercel can't read the pipeline's SQLite database at request time, so the deployed app reads a committed snapshot (from eval-dashboard/README.md).",
      source: { label: "eval-dashboard/README.md", href: `${BW_REPO}/blob/main/eval-dashboard/README.md` },
    },
  ],
  tradeoffs: [
    {
      title: "Hard gates over a single score",
      body: "The aggregate is still computed, but only for trend-watching. Three dimensions are hard gates, so a reply that skips a disclosure fails even when warmth and relevance are perfect.",
    },
    {
      title: "Mock runs first",
      body: "Deterministic mock runs make every delta real rather than noise, which is what a gate needs to be tested. The price is that the published comparison says nothing about how a live model behaves.",
    },
  ],
  limitations: [
    "All 60 scenarios are synthetic and author-labelled. Nothing is clinically validated.",
    "The published runs are deterministic mock runs. No live-model safety has been measured.",
    "The evaluator's agreement with the reference labels (0.8) is measured on this synthetic set only.",
  ],
  results: [
    {
      value: "Gate blocked",
      context: "prompt_v1 → prompt_v2 on 60 synthetic scenarios, mock runs. Safety, escalation correctness, and hard-gate failure rate regressed; all three are blocking.",
    },
    {
      value: "1.0 → 1.0",
      context: "Urgent recall was unchanged, and every one of the 60 routing decisions was identical in both runs. Hard-gate failures still went from 8 to 16.",
    },
  ],
  evidence: [
    { kind: "implemented", claim: "Reference labels are excluded from generator and evaluator context, with tests for both.", source: { label: "tests/test_safety_and_context.py", href: `${BW_REPO}/blob/main/tests/test_safety_and_context.py` } },
    { kind: "implemented", claim: "Hard-gate dimensions fail a reply regardless of the aggregate score.", source: { label: "evaluation/scoring.py", href: `${BW_REPO}/blob/main/evaluation/scoring.py` } },
    { kind: "implemented", claim: "Router rules only raise the action and record their names.", source: { label: "models/router.py", href: `${BW_REPO}/blob/main/models/router.py` } },
    { kind: "implemented", claim: "The regression CLI exits non-zero when the gate blocks.", source: { label: "tests/regression_tests.py", href: `${BW_REPO}/blob/main/tests/regression_tests.py` } },
    { kind: "measured", claim: "prompt_v2 regressed three blocking metrics while urgent recall stayed at 1.0 (mock runs, 60 synthetic scenarios).", source: { label: "eval-dashboard/data/snapshot.json", href: `${BW_REPO}/blob/main/eval-dashboard/data/snapshot.json` } },
    { kind: "not-measured", claim: "Behaviour of a live model, clinical validity, or real-world safety." },
  ],
  links: [
    { label: "Open app", href: BW_APP, kind: "live", note: "static dashboard built from the committed snapshot" },
    { label: "Repository", href: BW_REPO, kind: "repo" },
    { label: "Methodology", href: `${BW_REPO}/blob/main/docs/methodology.md`, kind: "doc" },
  ],
  provenance: {
    summary: "Where the exhibit's data comes from",
    points: [
      "Copied from the repository's committed eval-dashboard/data/snapshot.json (generated 2026-08-26). Nothing on this page reruns the Python pipeline.",
      "Both runs are deterministic mock runs (mock-generator-v1, mock-rubric-evaluator-v1) over 60 synthetic scenarios.",
      "Scores are engineering measurements of a test harness, not clinical judgements.",
    ],
  },
  stack: ["Python", "SQLite", "pytest", "Groq", "Next.js", "TypeScript"],
};

const OS_REPO = "https://github.com/gaurannggg7/osint-synthesis-engine";

export const osint: Project = {
  slug: "osint",
  name: "Agentic OSINT Analyst",
  short: "OSINT Analyst",
  summary: "Retrieval and cited synthesis over public sanctions, securities, and court records.",
  outcome:
    "A two-step LangGraph workflow that retrieves public-record excerpts and writes a report citing them, with every excerpt shown so the reader can check the work.",
  period: "2026",
  role: "Sole developer",
  problem:
    "Compliance research means reading many public filings to describe a kind of entity, such as an exchange with past AML actions. The analyst retrieves relevant excerpts from OFAC, SEC EDGAR, and CourtListener records and drafts a report that cites them, so a reader can check each claim against its source.",
  contribution: [
    "Built ingestion for OFAC SDN, SEC EDGAR, and CourtListener records and a local Chroma index with MiniLM embeddings.",
    "Built the two-node LangGraph workflow (retrieve, then synthesize) with a guardrail that runs before any retrieval or model call.",
    "Built the FastAPI service with structured errors, rate limiting, and a clearly labelled prerecorded mode for the public demo.",
    "Wrote a 17-query retrieval evaluation comparing vector, BM25, and hybrid retrieval, and documented where its labels are incomplete.",
  ],
  howItWorks:
    "The query is checked by a keyword guardrail, then the retrieve node pulls the top five excerpts from the Chroma index. The synthesize node sends those excerpts to a hosted model and asks for a report in which each claim cites an excerpt number. The report is parsed afterwards: only excerpts the report actually cites are returned as citations, and every retrieved excerpt is returned as a source, flagged cited or not.",
  stages: [
    {
      id: "ingest",
      label: "Ingestion",
      short: "Ingest",
      brief: "OFAC SDN, SEC EDGAR, and CourtListener records, cleaned and de-duplicated.",
      input: "Public records from three sources.",
      process: "Fetches and normalises records, strips boilerplate, and splits documents into 500-character chunks with 50 characters of overlap.",
      output: "A corpus snapshot: 2,339 documents in the 2026-09 evaluation snapshot.",
      tech: ["Python", "SEC EDGAR API", "CourtListener API"],
      limitation: "A cleaning bug removed type lines from many OFAC records. It is fixed in code, but the evaluation numbers were measured before the fix.",
      source: { label: "ingestion/sec_edgar.py", href: `${OS_REPO}/blob/main/ingestion/sec_edgar.py` },
    },
    {
      id: "index",
      label: "Vector index",
      short: "Index",
      brief: "MiniLM embeddings in a local Chroma store.",
      input: "Chunks.",
      process: "Embeds chunks with all-MiniLM-L6-v2 and persists them in Chroma. A missing or empty index raises an error instead of silently returning nothing.",
      output: "8,036 vectors in the evaluation snapshot.",
      tech: ["ChromaDB", "sentence-transformers"],
      source: { label: "vectorstore/build_index.py", href: `${OS_REPO}/blob/main/vectorstore/build_index.py` },
    },
    {
      id: "retrieve",
      label: "Retrieve node",
      short: "Retrieve",
      brief: "Guardrail first, then the top five excerpts from the index.",
      input: "An entity-category description (not a person).",
      process: "Runs a keyword guardrail that rejects attempts to identify a specific person, checks credentials, then retrieves the top five chunks.",
      output: "Five excerpts with source, title, and URL.",
      tech: ["LangGraph", "Chroma"],
      limitation: "The guardrail is a keyword filter, a first line of defence rather than a classifier.",
      source: { label: "agent/graph.py", href: `${OS_REPO}/blob/main/agent/graph.py` },
    },
    {
      id: "synthesize",
      label: "Synthesize node",
      short: "Synthesize",
      brief: "A hosted model writes a report citing excerpt numbers; citations are parsed back out.",
      input: "The excerpts and the query.",
      process: "Sends a prompt that numbers each excerpt and asks for a cited report. Afterwards it parses the [n] markers, keeps only excerpts actually cited as citations, and flags every source cited or not.",
      output: "Report, citations, sources, token usage.",
      tech: ["Groq (openai/gpt-oss-120b)", "LangGraph"],
      limitation: "Citation checking is structural: it confirms that a report points at an excerpt, not that the excerpt supports the claim.",
      source: { label: "agent/graph.py", href: `${OS_REPO}/blob/main/agent/graph.py` },
    },
    {
      id: "serve",
      label: "API and demo mode",
      short: "Serve",
      brief: "FastAPI service; the public deployment replays saved responses and says so.",
      input: "POST /investigate.",
      process: "Validates input, rate-limits per client, and maps failures to explicit errors (503 when the index or model isn't configured, 502 when the model call fails). In prerecorded mode only the example queries work, and each response is labelled.",
      output: "JSON with a mode field: live or prerecorded.",
      tech: ["FastAPI", "Pydantic", "Next.js", "Render", "Vercel"],
      rationale: "A failed live request returns an error rather than a saved answer, so a replay is never passed off as a live result.",
      source: { label: "api/main.py", href: `${OS_REPO}/blob/main/api/main.py` },
    },
  ],
  tradeoffs: [
    {
      title: "Two nodes, not an agent swarm",
      body: "Retrieval and synthesis are the only steps, so each can be tested with an injected retriever and model, without a vector store or an API key.",
    },
    {
      title: "Prerecorded public demo",
      body: "The public deployment replays four saved runs instead of calling the model, which keeps it free to host. The cost is that only those four queries work, and the app labels them as replays.",
    },
  ],
  limitations: [
    "Retrieval was evaluated on 17 queries written by one author; differences of one or two queries are noise.",
    "Answer groundedness, report quality, and end-to-end latency have not been measured.",
    "Citations are structural: a cited excerpt is not proof that it supports the sentence citing it.",
    "The corpus is small and partial, has no reranking, and can incidentally contain names of individuals.",
  ],
  results: [
    {
      value: "0.471 / 0.412 / 0.529",
      context: "Mean recall@10 for vector, BM25, and hybrid (RRF) retrieval on 17 queries over a 2,339-document snapshot. Hybrid never beat the better single method on any query: 0 wins, 17 ties, 0 losses.",
    },
    {
      value: "Labels incomplete",
      context: "OFAC recall is near zero mostly because each query has one labelled answer among many valid ones. The numbers were measured before a cleaning fix and haven't been re-run.",
    },
  ],
  evidence: [
    { kind: "implemented", claim: "Two-node LangGraph workflow: retrieve, then synthesize.", source: { label: "agent/graph.py", href: `${OS_REPO}/blob/main/agent/graph.py` } },
    { kind: "implemented", claim: "Only excerpts the report cites are returned as citations; all retrieved excerpts are returned as sources.", source: { label: "tests/test_graph.py", href: `${OS_REPO}/blob/main/tests/test_graph.py` } },
    { kind: "measured", claim: "Recall@10 of 0.471 (vector), 0.412 (BM25), 0.529 (hybrid) on 17 queries.", source: { label: "eval/STAGE_5_RESULTS.md", href: `${OS_REPO}/blob/main/eval/STAGE_5_RESULTS.md` } },
    { kind: "demonstration", claim: "The four reports in the explorer are saved outputs of real runs recorded 2026-09-18.", source: { label: "demo/prerecorded_responses.json", href: `${OS_REPO}/blob/main/demo/prerecorded_responses.json` } },
    { kind: "not-measured", claim: "Whether report claims are supported by the excerpts they cite, report quality, and end-to-end latency." },
  ],
  links: [
    { label: "Open app", href: "https://osint-synthesis-engine.vercel.app", kind: "live", note: "replays four prerecorded runs; backend may take a minute to wake" },
    { label: "Repository", href: OS_REPO, kind: "repo" },
    { label: "Retrieval evaluation", href: `${OS_REPO}/blob/main/eval/STAGE_5_RESULTS.md`, kind: "doc" },
  ],
  provenance: {
    summary: "Where the explorer's data comes from",
    points: [
      "Copied from the repository's committed demo/prerecorded_responses.json: four real agent runs (retrieval plus openai/gpt-oss-120b) recorded on 2026-09-18.",
      "They are replayed unchanged. Nothing on this page calls the backend, so the explorer works whether or not the live service is up.",
      "Excerpts are the truncated text the agent saw. Open the original filing to read it in context.",
    ],
  },
  stack: ["Python", "LangGraph", "ChromaDB", "FastAPI", "Groq", "Next.js"],
};

export const featured: Record<ProjectSlug, Project> = { baseline, bellwether, osint, signlink, visionary, guardian };

/** The five projects on the desk, campus, and field notes, in display order. */
export const FEATURED: ProjectSlug[] = ["bellwether", "osint", "baseline", "signlink", "visionary"];

/** Every project with a case study, for routes and previous/next links. */
export const PROJECT_ORDER: ProjectSlug[] = [...FEATURED, "guardian"];

/** The "All projects" catalog: everything beyond the five featured projects. */
export const moreProjects: MinorProject[] = [
  {
    name: "GuardianAI",
    context: "Transaction-network fraud detection",
    summary:
      "PageRank centrality over an account graph feeding an XGBoost classifier, to surface structuring patterns that per-transaction checks miss. The code and data aren't public; the case study uses a synthetic example.",
    stack: ["Python", "XGBoost", "PageRank"],
    links: [],
    href: "/work/guardian",
  },
  {
    name: "Vehicle loan default scorecard",
    context: "Credit-risk modelling · personal project",
    summary:
      "Logistic regression and XGBoost on 233,154 public loan records, scaled into a 300–850 scorecard with underwriting tiers. Validation ROC-AUC was 0.600 (logistic) and 0.624 (XGBoost) on a stratified 20% split, so the models separate defaults only modestly.",
    stack: ["Python", "scikit-learn", "XGBoost", "pandas"],
    links: [{ label: "Repository", href: "https://github.com/gaurannggg7/vehicle-loan-default-prediction", kind: "repo" }],
    period: "May – Jun 2026",
  },
  {
    name: "Urban food insecurity in Phoenix",
    context: "SpaceHACK 2025 · team of 5 · Honorable Mention",
    summary:
      "Layered satellite and public datasets in Google Earth Engine — Sentinel-2 NDVI, USGS land cover, the USDA Food Access Atlas, Census tracts, and NASA SMAP soil moisture — to find unused land near food-insecure neighbourhoods that could host urban agriculture.",
    stack: ["Google Earth Engine", "Colab", "NDVI", "Census data"],
    links: [
      { label: "Repository", href: "https://github.com/gaurannggg7/Urban-Food-Insecurity-in-Phoenix-SpaceHACK-25", kind: "repo" },
      { label: "Slides", href: "https://docs.google.com/presentation/d/1pZ4uj7TJLrP7FQke3R3ZJxvANbYYbjn2/edit?usp=sharing", kind: "slides" },
    ],
  },
  {
    name: "Workforce productivity prediction",
    context: "APMAC Consulting · client work",
    summary:
      "Async FastAPI endpoints serving AutoML and OLS regression models behind role-based access, with 95% confidence intervals on each prediction. Client code, so there is no public repository.",
    stack: ["Python", "FastAPI", "Pydantic", "AutoML", "OLS"],
    links: [],
    anchor: "#experience",
  },
];
