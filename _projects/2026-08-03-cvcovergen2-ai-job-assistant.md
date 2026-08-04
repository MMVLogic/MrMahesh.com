---
title: "CVCoverGen2: Orchestrating an AI Agent to Automate Tailored CV & Cover Letter Generation"
layout: project_post
status: Complete
tags:
  - Python
  - Gemini-API
  - Automation
  - AI-Agents
  - Job-Search
key_focus:
  - API-Integration
  - System-Orchestration
  - Prompt-Engineering
  - ATS-Optimization
---

* auto-gen TOC:
{:toc}

<br>

## **Introduction: The Job Application Grind**

Applying for jobs in tech and engineering is famously a numbers game. However, submitting a generic resume to hundreds of postings almost guarantees rejection by modern Applicant Tracking Systems (ATS). To stand a chance, you have to tailor your CV to highlight relevant keywords, align your experience with the job description, and draft a custom cover letter for every single application. 

Doing this manually for several jobs a day is exhausting. I needed a way to automate this process while keeping the results highly personalized, professional, and aligned with my master career profile. 

I built **CVCoverGen2**—a locally hosted orchestration script that transforms the Google Gemini API into my personal talent agent, writing custom-tailored CVs and cover letters in seconds.

---

## **System Architecture & Key Components**

Instead of using a bulky, third-party job application platform, I wanted a minimalist, file-based pipeline that I could control entirely from the terminal. 

The system relies on four main assets:

1.  **`Mahesh.txt` (Master Profile):** My complete, un-edited professional history, including technical skills, projects, employment records, and education.
2.  **`inst.txt` (Formatting Directives):** The prompt guide for the AI. It sets the tone, defines how to extract key requirements from the job description, regulates keyword density for ATS optimization, and enforces a clean, professional writing style.
3.  **`JL.csv` (Job Log Database):** A simple spreadsheet file that tracks each application’s filename, status, company name, and position title.
4.  **`run_cv_gen.sh` (The Shell Orchestrator):** A lightweight bash script that runs the Python processing loop, checks for unprocessed logs, and executes the Gemini pipeline.

---

## **The Automation Workflow**

The pipeline runs sequentially to ensure zero manual copying or data entry:

```
[ Job Description .txt ] + [ Master Profile ] + [ Directives ]
                           │
                           ▼
                 [ Gemini API Engine ]
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      [ Tailored CV ]            [ Cover Letter ]
             │                           │
             └─────────────┬─────────────┘
                           ▼
          [ Extract Company & Position ]
                           │
                           ▼
            [ Update Job Log (JL.csv) ]
```

1.  **Add Postings:** I copy and paste a job description into a text file (e.g., `machinist_lead.txt`) inside the folder.
2.  **Log the File:** I append the filename to the `JL.csv` ledger and leave its status empty.
3.  **Execute the Script:** Running `bash run_cv_gen.sh` reads the ledger and picks the next unprocessed entry.
4.  **AI Orchestration:** The Python script sends the job description, my master profile, and the prompt instructions to the Gemini API. 
5.  **Output Generation:** The API returns two files: a tailored CV (`machinist_leadCV.txt`) and a matching Cover Letter (`machinist_leadCover.txt`).
6.  **Metadata Extraction & Logging:** The script automatically extracts the company name and job title from the text, writes them back to the row in `JL.csv`, and marks the status as `complete`.

---

## **Results & Takeaways**

By automating the tailoring process, CVCoverGen2 saves hours of repetitive copywriting while ensuring that my applications directly address the specific requirements of every job. 

Crucially, because the instructions are stored separately in `inst.txt`, I can constantly refine the writing style, prompt formats, and ATS target keywords without changing a single line of Python code. It is a highly efficient, lightweight DevOps approach to the job search.
