# Content to verify or supply

Everything on the site comes from `content/` and was checked against the
SignLink and vs-spring25 repositories, the SignLink Hugging Face dataset, the
resume PDF, the GitHub profile README, and the previous version of this site.
The items below couldn't be verified, conflict between sources, or are missing.

## Metrics left out of prominent copy (no dataset / baseline / method found)

| Claim (previous site or resume) | What's missing |
| --- | --- |
| GuardianAI "0.99 recall" | Dataset, class balance, split, baseline, threshold, precision at that recall |
| GuardianAI "98% less manual work" | What was measured, before/after process, who measured it |
| GuardianAI "6M+ records" | Dataset name and source (PaySim? internal?) |
| OSINT analyst "90% faster synthesis" | Task, baseline time, sample size |
| Visionary Hands "improved accuracy by 30%" | Baseline accuracy, test protocol, number of signers/trials |
| GitHub profile: "95% gesture-classification accuracy on-device" | Which project, test set, and whether it's the same as the +30% figure |
| SpaceHACK "revealed 43% underserved zones" | Definition of "underserved" and of the zone set. The README's 43% refers to food-insecure households above the SNAP threshold, a different statistic |
| SignLink "ASL video rendered locally in 1.2s" (old SystemLog) | Hardware, sentence length, cold vs. warm. The fake log was removed |

## Conflicts between sources

- **SignLink: offline vs. hosted.** The resume and the old site say "offline", "Gemma-3n (quantized)", "300-sign dictionary". The current repo deploys to Hugging Face Spaces, calls `google/gemma-2b-it` through the HF Inference API, and indexes ~1,540 signs. The site presents both as version history. Please confirm the timeline and when the hosted rebuild happened (the site says "2025 – 2026", inferred from repo activity).
- **SignLink authorship.** The YouTube demo (youtu.be/33DwsluZMfA) is posted by the account "Prakher Sharma". Was SignLink a team project? If so, the "What I did" list and "Designed and built the pipeline" need to say which parts were yours.
- **EPICS Elite Pitch.** The resume says "winner"; the GitHub profile says "3rd place — $1,000". The site says "awarded the team $1,000" to stay accurate under both.
- **LinkedIn URL.** The site uses `linkedin.com/in/gaurangmmohan/` (from the previous site). The GitHub profile links `linkedin.com/in/gaurang-mohan`. Confirm which is correct.
- **Visionary Hands "26 letters" and "text and audio".** The committed firmware has a placeholder template for V, Q/T/U share one template, it is committed in `learning_mode = true`, and there is no audio code. If a later build exists, push it or tell me what changed.
- **Visionary Hands microcontroller.** The pin numbers (GPIO 21/22/23) and `Serial.printf` suggest an ESP32 rather than an Arduino Uno. The site says "microcontroller running the Arduino framework". Confirm the board.

## Role wording on the site (kept conservative)

- SignLink is labelled "Developer · speech-to-sign pipeline" until authorship is confirmed (see above).
- GuardianAI is labelled "Developer", the minimum the previous site implied. Replace it with your real scope.

## Baseline (added from github.com/gaurannggg7/cpg-cfo-agent)

Identified from the repository README ("Baseline … the repository and package
names still say cpg-cfo-agent"). It has one contributor (you, 46 commits), a
live demo, ARCHITECTURE.md, and eval/RESULTS.md. Please confirm or supply:

- **Period**: the site says "Jun – Aug 2026", taken from the repo's first and last commit dates.
- **Role**: shown as "Sole developer", based on the single-contributor history and the README footer.
- **README headline vs. measurements**: the README says Baseline produces a brief "in under 3 seconds". Your own eval/RESULTS.md measured a median of about 14s, with 1 of 18 runs under 3s. The site uses the measured numbers. Consider updating the README; the GitHub profile's "<3s" line has the same problem.
- **Model-specific numbers**: the 70% anomaly recall and the per-node latency means were measured on Llama 3.3 70B, which has been retired. They're labelled that way. Re-running the evaluation on gpt-oss-120b would let them be stated without the caveat.
- **Problem framing**: the "who it's for" sentence is deliberately generic. If Baseline was built for a specific team or user, say who.

## GuardianAI details needed

There's no public repository, so the site shows only the architecture and an
explicitly synthetic example. To give it the same depth as the other two
projects, I need: your role (solo or team, what you built), the dataset, the
evaluation setup and results, why PageRank plus XGBoost, known limitations, and
a repository or write-up link if one can be public.

## Undocumented engineering rationale (stage inspector shows function only)

- GuardianAI: all four stages (why graph features, why XGBoost, how reports are produced).
- Visionary Hands: why nearest-template matching instead of a trained classifier, why five stable readings, the hand-size calibration plan.
- SignLink: why Whisper `base`, the speech-recognition accuracy you observed, and why the 300-token vocabulary cut-off (and whether it was addressed).

## Time-sensitive wording to review before publishing

- `content/site.ts → roles[0].period`: "Aug 2025 – Present" at APMAC Consulting.
- `content/site.ts → availability`: looking for full-time roles; needs OPT / H-1B support.
- `content/site.ts → about`: education is written without a graduation date. The resume says May 2026; add "Class of 2026" or a completion date if you want it shown.
- Earlier-role dates ending "Dec 2025" (PAB, Visionary Hands): confirm these are final.

## Assets that would improve the site

- **Visionary Hands photos**: the glove, the wiring, and the team demo. The schematic would then become a supplement rather than the only visual.
- **A SignLink rendered output**: one MP4 produced by the real renderer for one of the three prepared sentences, plus the exact gloss the Gemma stage returned. The site currently plays the source clips in sequence and labels them that way.
- **Field notes / sketchbook**: the old bio mentions sketching and painting, but there are no scans or notes in the repo, so this section was omitted rather than filled with placeholders. Scans of sketches, hardware notebook pages, or short build notes you've written would make a good small section between About and Contact.
- **Open Graph image** for link previews (for example, a 1200×630 crop of the hero exhibit).

## Other public repositories you could add to "More work"

These have READMEs with real detail but weren't on the previous site, so I left
them off: `AI-Evaluation-Observability-Framework-for-Clinical-AI-Companions`,
`vehicle-loan-default-prediction` (reports ROC-AUC 0.624 on the Kaggle LT
dataset), and `cpg-cfo-agent`.
