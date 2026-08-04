---
title: "Project Aegis: Offline Edge-AI Logistics & Asset Routing in Crisis Zones"
layout: project_post
status: Complete
tags:
  - Local-LLM
  - Streamlit
  - Python
  - Disaster-Relief
  - Edge-AI
key_focus:
  - Edge-Computing
  - Quantized-Models
  - Offline-Architecture
  - Resource-Optimization
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: When the Grid Goes Dark**

In active disaster zones (e.g. hurricanes, earthquakes, flooding, or grid failures), communication networks are almost always the first infrastructure component to fail. Field operators, search-and-rescue teams, and medical stations need to route critical supplies and coordinate logistics, but they cannot connect to cloud APIs.

I built **Project Aegis** for a Kaggle Hackathon (focused on Global Resilience and Humanitarian Impact) to solve this problem. It is an offline, edge-capable disaster relief supply allocator that runs completely local on low-power field hardware with zero network dependencies.

---

## **Technical Engineering: AI on the Edge**

Most modern AI solutions require powerful servers and constant internet access. Project Aegis is engineered under strict hardware constraints:

*   **Low RAM Threshold:** Capable of running efficiently on consumer-grade field laptops or single-board computers with as little as 4GB of RAM.
*   **Quantized Core Model:** Leverages a local, highly compressed **Gemma 2B** model running via `llama.cpp` or `Ollama`.
*   **Zero-Internet Dependency:** The model execution, data parser, and storage registry are completely local to the machine, ensuring zero cellular data requirements.

---

## **Workflow & Processing Pipeline**

When field operators paste a raw, unstructured transcription or manifest, the local pipeline immediately processes it:

1.  **Raw Input Manifest:** Operators enter loose notes or radio transcripts (e.g., *"Received 50 boxes of masks, blankets, and water at Checkpoint Bravo. Need to route the medical gear to Sector 4 hospital immediately."*).
2.  **Local Gemma Extraction:** The quantized Gemma model runs locally to parse the unstructured text, extracting structured JSON containing assets, quantities, and destinations.
3.  **Triage Allocation:** The system assigns a priority tier based on urgency (e.g. Life-saving medical vs. general supplies).
4.  **Local Database Ledger:** The allocation is committed to a local, in-memory CSV data ledger for logistics tracking.

---

## **The Dashboard Interface**

The application features a clean, high-impact **Streamlit** dashboard designed for chaotic field environments. It displays system telemetry (e.g., local system memory overhead, showing execution limits like `1.8 GB / 4.0 GB`), active routing vectors, and the global supply dispatch ledger.

By proving that generative models can be run successfully at the offline edge, Project Aegis establishes a secure, zero-network blueprint for global humanitarian crisis management.

---

## **GitHub Repository**
* View the source code and configuration details on GitHub: [MMVLogic/project-aegis](https://github.com/MMVLogic/project-aegis)
