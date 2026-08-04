---
title: "SENTINEL: Building a Zero-Trust ML Guardrail for Prompt Injection Detection"
layout: project_post
status: Complete
tags:
  - Machine-Learning
  - Python
  - FastAPI
  - Security
  - Gemini-API
key_focus:
  - Threat-Detection
  - Natural-Language-Processing
  - Logistic-Regression
  - Bounded-Inference
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: The Threat of Prompt Injection**

Prompt injection is one of the most critical vulnerabilities in modern LLM applications. An attacker can craft inputs that trick the model into ignoring its system prompt, leaking data, or running unauthorized commands. 

For the **AlgoFest Hackathon 2026**, I built **SENTINEL** (originally named PromptGuard) to act as a real-time firewall for LLMs. It operates under a zero-trust philosophy, defending local AI systems from malicious prompts at the gate.

---

## **Architectural Engineering: The Dual-Layer Pipeline**

Instead of routing every incoming prompt to a heavy, expensive cloud LLM to ask "is this an injection?", SENTINEL uses a highly efficient, dual-layer hybrid architecture that provides fast and cost-effective detection.

```
                  [ Incoming Prompt ]
                           │
                           ▼
            [ Layer 1: ML Classifier ]
            (TF-IDF + Logistic Regression)
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      [ Low Risk (<0.5) ]      [ High Risk (>=0.5) ]
             │                           │
             ▼                           ▼
    [ Allow to Pass ]      [ Layer 2: Explain Threat ]
                           (Gemini 3.1 Flash-Lite)
                                         │
                                         ▼
                           [ Security Posture Report ]
```

### **Layer 1: The Deterministic ML Classifier (Fast & Local)**
*   **Engine:** TF-IDF feature extraction combined with a locally trained Logistic Regression model (`model.pkl`).
*   **Purpose:** Calculates the mathematical probability of an injection attack. Because it runs locally on a standard CPU, it delivers sub-millisecond response times with zero GPU overhead and no network latency.

### **Layer 2: The Reasoning Engine (Contextual Explanation)**
*   **Engine:** Google Gemini 3.1 Flash-Lite.
*   **Purpose:** If the local ML model flags a prompt as high-risk, SENTINEL passes the text to Gemini to generate a concise, human-readable "Security Posture Explanation" explaining the exact nature and intent of the threat.

---

## **Software Stack & Interface**

The application is implemented as a production-ready API and dashboard:

*   **FastAPI Backend:** Coordinates the ML scoring pipeline, runs Pydantic input/output schemas, and interfaces with the Google GenAI SDK.
*   **Streamlit UI:** Provides field operators and security auditors with a visual dashboard to test inputs in real-time, view the mathematical probability curves, and read the threat analysis logs.

---

## **Key Takeaways**

SENTINEL proves that AI security doesn't require slow or expensive setups. By combining lightweight local machine learning models for the initial gatekeeping with advanced generative LLMs for threat analysis, we achieve immediate, high-fidelity security guardrails with minimal resource overhead.
