---
title: "LogiKeep AI: Automating Customs Compliance & Tariff Auditing with Prefix Tries and Bipartite Graphs"
layout: project_post
status: Complete
tags:
  - Streamlit
  - Python
  - Data-Structures
  - Hungarian-Algorithm
  - Logistics
key_focus:
  - Trie-Search
  - Linear-Optimization
  - Bipartite-Graph-Matching
  - Compliance-Auditing
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: The Maritime Compliance Bottleneck**

Cross-border maritime logistics is bottlenecked by vast quantities of paper invoices, bills of lading, and cargo manifests. Customs compliance agents spend hours manually reading these documents to match weights, verify declarations, and query complex Harmonized System (HS) tariff codes. 

Errors lead to severe border delays and heavy customs penalties.

I built **LogiKeep AI** to automate this customs audit pipeline. It is a SaaS-architected compliance engine that replaces human data entry by combining LLM text parsing with deterministic computer science algorithms.

---

## **Algorithmic Core & Architecture**

Rather than relying purely on LLMs (which are prone to hallucinating numbers and tax rates), LogiKeep uses a hybrid design. The LLM handles the unstructured text conversion, while deterministic algorithms enforce absolute mathematical accuracy.

```
[ Messy Unstructured Shipping Documents ] 
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│ 1. Multimodal Structured Ingestion Agent         │
│    Extracts bounding boxes and matches schemas   │
└─────────────────────────┬────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│ 2. O(L) Bounded Prefix Tariff Tree (Trie)        │
│    Validates regional HS tax classification      │
└─────────────────────────┬────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────┐
│ 3. Bipartite Graph Matching Engine               │
│    Hungarian Algorithm detects weight leakages   │
└─────────────────────────┬────────────────────────┘
                          │
                          ▼
        [ Validated Customs Audit Report ]
```

### **1. Spatial & Geometric JSON Normalization**
*   Manifest tables cannot be parsed with simple text chunking without losing column relations. LogiKeep maps shipping documents into clean Pydantic data schemas to isolate line names and numeric mass parameters before processing.

### **2. O(L) Bounded Prefix Search Tree (Trie)**
*   HS codes are hierarchical tax indexes (e.g. `6109.10` for cotton t-shirts).
*   To prevent slow, expensive vector search or SQL queries, LogiKeep parses national tariff sheets into a local **Prefix Trie**. This guarantees database tariff lookups run in $O(L)$ time complexity, where $L$ is the static length of the classification string.

### **3. Weighted Bipartite Graph Optimization (Cross-Doc Audit)**
*   Matching an invoice against a cargo bill is modeled as a **Bipartite Graph Matching problem**. 
*   The engine builds a bipartite graph representing the two documents and computes a cost matrix of discrepancies. It executes the **Hungarian Algorithm** (`scipy.optimize.linear_sum_assignment`) to find the optimal matches and immediately flags weight or quantity variances.

---

## **Workspace Interface**

The system features a reactive local dashboard built with **Streamlit**:
*   **Audit Engine:** Upload multiple PDFs, and the system runs the ingestion, Trie tax lookup, and Hungarian assignment mapping simultaneously.
*   **Leakage Analyzer:** Highlights discrepancies in red, warning operators of custom tax code mismatch or weight leakage.

By anchoring AI document parsing to rigorous mathematical data structures, LogiKeep AI delivers absolute, audit-grade precision for global shipping compliance.
