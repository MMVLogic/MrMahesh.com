---
title: "Modular Frontend Architecture with Static Partials"
layout: default
category: "DevOps"
date: 2026-09-02
tags:
  - architecture
  - frontend
  - jamstack
  - devops
status: "Published"
challenge: "Why is splitting a 2,000-line monolithic HTML page into static template includes (like Jekyll `{% include %}` or Nginx SSI) superior to bundling everything with heavy Webpack/Vite pipelines for simple Jamstack apps?"
answer: "Static includes compile at build time into pure HTML with zero client-side JavaScript runtime overhead, zero bundler dependencies, and lightning-fast build speeds while keeping source code organized into maintainable components."
---

### 💡 WHY (The Concept)
When building rich web apps (like the OpenFit Protocol workout dashboard), stuffing HTML structure, modals, CSS styles, and JavaScript tabs into a single 2,500-line file makes maintenance painful. Finding bugs or adding features requires scrolling through thousands of lines of mixed code.

Instead of introducing heavy JavaScript frameworks (React/Vue) and complex build steps for lightweight static sites, you can use **Static Template Includes** (e.g. Jekyll `_includes/` or HTML partials) to break the application into modular components:
* `_includes/openfit/nav_tabs.html` (Navigation headers)
* `_includes/openfit/tab_workout.html` (Daily logging interface)
* `_includes/openfit/tab_calendar.html` (Monthly calendar engine)
* `_includes/openfit/styles.html` (Component-scoped styling)

### ⚖️ THE LOGICAL DECISION
When an application's single HTML file exceeds 600 lines, extract distinct functional views into separate partial files under `_includes/`. This keeps individual files under 200 lines, isolates component CSS/JS, and makes pair-programming with teammates or AI assistants vastly faster and less error-prone.

### ⚙️ HOW (Implementation Code)
#### 1. Directory Structure:
```text
mrmahesh/
├── apps/
│   └── openfit-protocol.html    # Main entrypoint
└── _includes/
    └── openfit/
        ├── header.html
        ├── nav_tabs.html
        ├── tab_blueprint.html
        ├── tab_workout.html
        ├── tab_calendar.html
        └── styles.html
```

#### 2. Clean Entrypoint (`apps/openfit-protocol.html`):
```html
---
layout: default
title: "OpenFit Protocol"
---

<div class="openfit-app max-w-5xl mx-auto space-y-6 font-mono text-gray-200">
    <!-- Header Banner -->
    {% include openfit/header.html %}

    <!-- Tab Navigation Bar -->
    {% include openfit/nav_tabs.html %}

    <!-- View Panels -->
    {% include openfit/tab_blueprint.html %}
    {% include openfit/tab_workout.html %}
    {% include openfit/tab_calendar.html %}
</div>

<!-- Scoped Styles -->
{% include openfit/styles.html %}
```
