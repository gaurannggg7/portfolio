import type { MinorProject, Project, ProjectSlug } from "./types";

const SIGNLINK_REPO = "https://github.com/gaurannggg7/signlink";
const VH_REPO = "https://github.com/gaurannggg7/vs-spring25";

export const signlink: Project = {
  slug: "signlink",
  name: "SignLink",
  summary: "Spoken or typed English in, a sequence of American Sign Language clips out.",
  period: "2025 – 2026",
  role: "Designed and built the pipeline",
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
      input: "A WAV/MP3 upload or typed English in the Streamlit app. The command-line version can also record from a microphone.",
      process: "Audio goes to the speech-recognition stage. Typed text skips it.",
      output: "Raw audio, or an English sentence.",
      tech: ["Streamlit", "sounddevice (CLI)"],
      source: { label: "app.py", href: `${SIGNLINK_REPO}/blob/main/app.py` },
    },
    {
      id: "asr",
      label: "Whisper ASR",
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
  stack: ["Python", "Whisper", "Gemma", "Hugging Face", "FFmpeg", "Streamlit", "PyTorch"],
};

export const guardian: Project = {
  slug: "guardian",
  name: "GuardianAI",
  summary: "Finding structured money-laundering patterns in transaction networks.",
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
  stack: ["Python", "XGBoost", "PageRank", "Graph features"],
};

export const visionary: Project = {
  slug: "visionary",
  name: "Visionary Hands",
  summary: "A glove that reads fingerspelled ASL letters and turns them into text.",
  period: "Jan 2024 – Dec 2025",
  role: "Team lead · EPICS at ASU · team of 7",
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
  stack: ["C++", "Arduino framework", "Java", "MPU6050", "Flex sensors", "Python (data extraction)"],
};

export const featured: Record<ProjectSlug, Project> = { signlink, guardian, visionary };

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
