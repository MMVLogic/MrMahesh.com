#!/usr/bin/env python3
import os
import sys
import json
import glob
import re
import urllib.request

# Configuration
WEBSITE_ROOT = "/Users/m/mrmr/mrmahesh"
JSON_PATH = os.path.join(WEBSITE_ROOT, "assets/data/learnwithme.json")
LOG_DIR = "/Users/m/.gemini/antigravity/brain"
STATE_FILE = os.path.join(WEBSITE_ROOT, "scripts/.tracker_state.json")

def load_json_db():
    if os.path.exists(JSON_PATH):
        try:
            with open(JSON_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_json_db(db):
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w") as f:
        json.dump(db, f, indent=2)

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def anonymize_text(text):
    if not text:
        return ""
    # Redact absolute user home paths
    text = re.sub(r"/Users/[a-zA-Z0-9_\-]+", "/Users/developer", text)
    # Redact potential sensitive tokens/keys
    text = re.sub(r"AIzaSy[a-zA-Z0-9_\-]{35}", "AIzaSy_REDACTED_API_KEY", text)
    # Redact local IP addresses except standard loopback/CIDR ranges
    text = re.sub(r"192\.168\.\d+\.\d+", "192.168.1.X", text)
    return text

def ask_gemini_via_http(api_key, prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            content = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(content.strip())
    except Exception as e:
        print(f"[-] Gemini API HTTP request failed: {e}")
        return None

def ask_gemini_via_sdk(prompt):
    try:
        import asyncio
        from google.antigravity import Agent, LocalAgentConfig
        
        async def run_agent():
            config = LocalAgentConfig(
                system_instructions="You are a JSON synthesis engine. Output ONLY a valid JSON block mapping to the requested schema. No markdown formatting."
            )
            async with Agent(config) as agent:
                resp = await agent.chat(prompt)
                full_text = ""
                async for token in resp:
                    full_text += token
                return json.loads(full_text.strip())
                
        return asyncio.run(run_agent())
    except Exception as e:
        print(f"[-] Antigravity SDK leased agent failed: {e}")
        return None

def compile_step_to_lesson(user_req, thinking, tool_call, output):
    prompt = f"""You are a DevOps and software engineering teacher. I will give you a raw log of an AI agent performing a step.
Log details:
User Request: {user_req}
AI Rationale (Thinking): {thinking}
Action / Tool Call: {tool_call}
Result / Output: {output}

Please synthesize this into a structured JSON object for our educational dashboard.
Output must be a valid JSON object matching this schema:
{{
  "id": "unique-kebab-case-id",
  "title": "A short, engaging title explaining the core action",
  "category": "One of: DevOps, Homelab, CNC & Math, Cybersecurity",
  "tags": ["3-4 relevant tags in lowercase"],
  "date": "2026-08-07",
  "concept": "Explanation of the underlying technology or system concept in 2-3 sentences. Focus on teaching the theory.",
  "reasoning": "Explanation of why this specific action or command was selected, what trade-offs were made, or why other options were avoided.",
  "how": "A detailed step-by-step breakdown. Include the exact code or command in bash/yaml syntax, and explain what each flag or parameter does. Use standard markdown formatting.",
  "challenge": "An active recall question or diagnostic self-test related to this concept, designed to challenge the reader's understanding.",
  "answer": "The answer key/solution to the challenge, including the exact command or syntax if applicable."
}}
Return ONLY the raw JSON object. Do not include markdown code block formatting (like ```json) in your response, just the raw JSON text."""

    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        print("[+] Processing log using direct Gemini HTTP API...")
        return ask_gemini_via_http(api_key, prompt)
    else:
        print("[+] No GEMINI_API_KEY found. Attempting to lease agent via google-antigravity SDK...")
        return ask_gemini_via_sdk(prompt)

def process_transcripts():
    state = load_state()
    db = load_json_db()
    new_entries_added = 0

    print(f"[*] Scanning Antigravity transcripts in {LOG_DIR}...")
    log_files = glob.glob(os.path.join(LOG_DIR, "*/.system_generated/logs/transcript.jsonl"))
    
    for filepath in log_files:
        convo_id = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(filepath))))
        print(f"[*] Checking conversation: {convo_id}")
        
        last_processed_step = state.get(convo_id, -1)
        
        try:
            with open(filepath, "r") as f:
                lines = f.readlines()
        except Exception as e:
            print(f"[-] Failed to read {filepath}: {e}")
            continue

        for line in lines:
            try:
                step = json.loads(line)
            except Exception:
                continue

            step_index = step.get("step_index", -1)
            if step_index <= last_processed_step:
                continue

            # Check if this step is a command run that returned output
            # In transcript.jsonl, MODEL run_command calls will be listed in tool_calls
            if step.get("type") == "PLANNER_RESPONSE" and step.get("tool_calls"):
                tool_calls = step["tool_calls"]
GUIDES_DIR = os.path.join(WEBSITE_ROOT, "_guides")

def save_lesson_as_markdown(lesson):
    os.makedirs(GUIDES_DIR, exist_ok=True)
    slug = lesson.get('id', 'guide-' + str(int(os.path.getmtime(STATE_FILE) if os.path.exists(STATE_FILE) else 0)))
    filename = f"{lesson.get('date', '2026-08-08')}-{slug}.md"
    filepath = os.path.join(GUIDES_DIR, filename)

    tags = lesson.get("tags", ["General"])
    tags_yaml = "\n".join([f"  - {t}" for t in tags])

    md_content = f"""---
title: {json.dumps(lesson.get('title', 'Untitled Guide'))}
layout: default
category: {json.dumps(lesson.get('category', 'DevOps'))}
date: {lesson.get('date', '2026-08-08')}
tags:
{tags_yaml}
status: "Draft"
challenge: {json.dumps(lesson.get('challenge', ''))}
answer: {json.dumps(lesson.get('answer', ''))}
---

### 💡 WHY (The Concept)
{lesson.get('concept', '')}

### ⚖️ THE LOGICAL DECISION
{lesson.get('reasoning', '')}

### ⚙️ HOW (Implementation Code)
{lesson.get('how', '')}
"""
    with open(filepath, "w") as f:
        f.write(md_content)
    print(f"[+] Saved Draft Guide to CMS: _guides/{filename}")
    return filename

def process_transcripts():
    state = load_state()
    new_entries_added = 0

    print(f"[*] Scanning Antigravity transcripts in {LOG_DIR}...")
    log_files = glob.glob(os.path.join(LOG_DIR, "*/.system_generated/logs/transcript.jsonl"))
    
    for filepath in log_files:
        convo_id = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(filepath))))
        print(f"[*] Checking conversation: {convo_id}")
        
        last_processed_step = state.get(convo_id, -1)
        
        try:
            with open(filepath, "r") as f:
                lines = f.readlines()
        except Exception as e:
            print(f"[-] Failed to read {filepath}: {e}")
            continue

        for line in lines:
            try:
                step = json.loads(line)
            except Exception:
                continue

            step_index = step.get("step_index", -1)
            if step_index <= last_processed_step:
                continue

            if step.get("type") == "PLANNER_RESPONSE" and step.get("tool_calls"):
                tool_calls = step["tool_calls"]
                run_commands = [tc for tc in tool_calls if tc.get("name") == "run_command"]
                
                if run_commands:
                    thinking = step.get("thinking", "")
                    tool_call_str = json.dumps(run_commands[0])
                    
                    cmd_output = "Command completed"
                    for future_line in lines[step_index + 1 : step_index + 5]:
                        try:
                            f_step = json.loads(future_line)
                            if f_step.get("type") == "SYSTEM_MESSAGE" and "finished with result" in f_step.get("content", ""):
                                cmd_output = f_step["content"]
                                break
                        except Exception:
                            continue

                    print(f"[+] Found unprocessed run_command at step {step_index}")
                    
                    lesson = compile_step_to_lesson(
                        user_req="Compile DevOps command execution",
                        thinking=anonymize_text(thinking),
                        tool_call=anonymize_text(tool_call_str),
                        output=anonymize_text(cmd_output)
                    )
                    
                    if lesson:
                        save_lesson_as_markdown(lesson)
                        new_entries_added += 1
                    
            state[convo_id] = step_index
    
    if new_entries_added > 0:
        print(f"[+] Staging updated. Created {new_entries_added} new Draft guides in _guides/.")
    else:
        print("[*] No new lessons compiled.")
    
    save_state(state)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--debug":
        print("[*] Debug mode enabled. Printing environment details:")
        print(f"WEBSITE_ROOT: {WEBSITE_ROOT}")
        print(f"GEMINI_API_KEY: {'set' if os.environ.get('GEMINI_API_KEY') else 'not set'}")
    
    try:
        process_transcripts()
    except KeyboardInterrupt:
        print("\n[!] Compilation aborted by user.")
