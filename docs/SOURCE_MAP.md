# Source map

Internal. Every significant claim or displayed result on the site, where it
comes from, and what kind of evidence it is. Reviewed 2026-10-01.

Kinds: **Implemented** (visible in code), **Measured** (a number from a
committed result), **Demonstration** (illustrative or replayed data shown in an
exhibit), **Missing** (claimed somewhere, not backed by evidence found).

## Bellwether — github.com/gaurannggg7/AI-Evaluation-Observability-Framework-for-Clinical-AI-Companions

| Claim on the site | Kind | Source |
| --- | --- | --- |
| Reference labels excluded from generator and evaluator context | Implemented | `evaluation/context.py`; `tests/test_safety_and_context.py` (`test_generator_context_excludes_reference_label_and_expected_action`, `test_evaluator_context_excludes_reference_label`) |
| Rules layer + model classifier, fused, disagreement recorded | Implemented | `evaluation/safety.py` (`fuse`, `analyze_signals`) |
| Seven dimensions, weights, three hard gates (safety, escalation_correctness, policy_adherence) | Implemented | `evaluation/scoring.py` (`DIMENSIONS`, `aggregate`) |
| Router rules only raise; applied rules recorded; outputs are simulation labels | Implemented | `models/router.py` |
| Regression gate with per-metric direction, tolerance, blocking flag | Implemented | `pipeline/regression.py` (`METRIC_GATES`) |
| CLI exits non-zero when the gate blocks | Implemented | `tests/regression_tests.py:182-187` |
| prompt_v2 asks for warmer/shorter replies, coping first, care team only on explicit intent | Implemented | `pipeline/prompts.py` (`PROMPT_V2`) |
| Dashboard reads a committed snapshot | Implemented | `eval-dashboard/README.md` |
| Gate blocked; safety 0.977→0.825, escalation 0.867→0.800, hard-gate rate 0.133→0.267; urgent recall 1.0→1.0; routing accuracy 0.917 both | Measured (mock runs, 60 synthetic scenarios) | `eval-dashboard/data/snapshot.json` → `comparison` (copied to `content/bellwether-snapshot.ts`) |
| Routing identical in all 60 scenarios; hard-gate failures 8 → 16 | Measured (computed from snapshot results, runs 3b9ad998ea5a vs 197b4ef19eb8) | same |
| Scenario texts, replies, readings, scores for synthetic_001/002/004/008 | Demonstration (verbatim snapshot records) | same |
| Live-model behaviour, clinical validity | Missing (not claimed; stated as not measured) | — |

## Agentic OSINT Analyst — github.com/gaurannggg7/osint-synthesis-engine

| Claim | Kind | Source |
| --- | --- | --- |
| Two-node LangGraph workflow: retrieve → synthesize | Implemented | `agent/graph.py` (`build_graph`) |
| Keyword guardrail before retrieval or model call | Implemented | `agent/graph.py` (`check_guardrail`); `tests/test_graph.py::test_guardrail_runs_before_retrieval` |
| top_k = 5; only cited excerpts become `citations`; all retrieved returned as `sources` with `cited` flag | Implemented | `config.py` (`TOP_K`, default 5); `agent/graph.py` (`extract_cited_indices`, `build_sources`); `tests/test_graph.py::test_graph_returns_only_actually_cited_documents` |
| 503/502 errors; prerecorded mode only serves example queries and labels them | Implemented | `api/main.py` (`_replay`, `investigate`) |
| Chroma + all-MiniLM-L6-v2; 500-char chunks, 50 overlap | Implemented | `vectorstore/build_index.py`, README |
| Recall@10 0.471 / 0.412 / 0.529 (n=17); 0 wins / 17 ties / 0 losses; per-group numbers | Measured | `eval/STAGE_5_RESULTS.md`, `eval/eval_results.json` |
| Corpus 2,339 docs / 8,036 vectors; numbers pre-date a cleaning fix | Measured / caveat | `eval/STAGE_5_RESULTS.md` |
| Four reports, citations, excerpts in the explorer | Demonstration (verbatim, recorded 2026-09-18) | `demo/prerecorded_responses.json` (copied to `content/osint-prerecorded.ts`) |
| Groundedness, report quality, end-to-end latency | Missing (stated as not measured) | — |
| "90% faster synthesis" (old site) | Missing — removed | — |

## Baseline — github.com/gaurannggg7/cpg-cfo-agent

| Claim | Kind | Source |
| --- | --- | --- |
| Four-node LangGraph graph (3 LLM nodes + Python runway), parallel fan-out | Implemented | `backend/agent.py`, `ARCHITECTURE.md` |
| Three FastMCP tools over stdio | Implemented | `services/mcp/server.py`, `services/mcp/README.md` |
| gRPC gateway, Kafka, Prometheus, Grafana in local Docker Compose only | Implemented (local) | `docker-compose.yml`; k8s manifests never applied (README) |
| 62% → 100% structured errors (27 of 29 run); totals deterministic; 70% recall on one planted outlier; median ~14 s | Measured (Llama 3.3 70B, retired) | `eval/RESULTS.md` |
| "Brief in under 3 seconds" (repo README, GitHub profile) | Missing / contradicted by measurement — not used | — |
| Current model `openai/gpt-oss-120b`; all evaluation numbers on `llama-3.3-70b-versatile` | Implemented / Measured | `backend/agent.py` (`MODEL`), `eval/RESULTS.md` §0 |

## SignLink — github.com/gaurannggg7/signlink

| Claim | Kind | Source |
| --- | --- | --- |
| Whisper → Gemma gloss (rule fallback) → resolver → FFmpeg | Implemented | `whisper_transcribe.py`, `gloss_builder.py`, `mapping.py`, `renderer.py` |
| ~1,540-sign index; fingerspelling fallback | Implemented (count of index rows, not accuracy) | clip index CSV, `mapping.py` |
| Prepared examples on the case study | Demonstration (traced with the fallback code) | `content/signlink-examples.ts` |
| Translation quality with ASL users | Missing | — |

## Visionary Hands — github.com/gaurannggg7/vs-spring25

| Claim | Kind | Source |
| --- | --- | --- |
| Five flex sensors + MPU6050, nearest-template matching, 5-reading stability | Implemented | `combined_code/*.cpp`, `Strain.java` |
| ESP32 board | Implemented (pin usage) + résumé | `combined_code.ino` pins; résumé |
| EPICS Elite Pitch third place, $1,000 | Résumé / GitHub profile (no repo evidence) | résumé DOCX |
| "Tested with 10 users", "+30% accuracy", "95% accuracy" | Missing — not shown on the site | — |

## Employment (career data, no public code)

| Claim | Kind | Source |
| --- | --- | --- |
| CueAway retrieval relevance +35%, irrelevant outputs −28%, latency < 200 ms, API time −40%, redundant calls −30%, throughput 2.5× | Measured internally (method not public) | master career data, résumé |
| APMAC FastAPI/AutoML/OLS endpoints, AWS via Terraform, OAuth2 CRM (feature branch) | Self-reported | master career data, résumé |

## Catalog

| Item | Kind | Source |
| --- | --- | --- |
| Vehicle loan default: ROC-AUC 0.600 / 0.624, stratified 20% split (46,631 rows) | Measured | `vehicle-loan-default-prediction/data/model_performance_log.json`, `model.py` |
| GuardianAI | Demonstration only (synthetic graph); no public code | `content/guardian-graph.ts` |
| SpaceHACK | Repository + slides | repo README |
| APMAC workforce prediction | Résumé (client work, no repo) | résumé DOCX |

## Résumé conflicts (reported, not resolved by invention)

See `CONTENT_TODO.md` → "Résumé (Oct 2026) vs. site".
