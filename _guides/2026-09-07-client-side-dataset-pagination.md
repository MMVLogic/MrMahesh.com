---
title: "Client-Side Slicing & Dynamic Dataset Pagination"
layout: default
category: "DevOps"
date: 2026-09-07
tags:
  - javascript
  - pagination
  - performance
status: "Published"
challenge: "Why is client-side array slicing (`array.slice(startIndex, startIndex + pageSize)`) fast and practical for datasets of 100 to 1,000 items in Jamstack sites compared to server-side SQL pagination?"
answer: "Modern browsers parse a 200KB JSON payload in under 5 milliseconds. Client-side pagination eliminates server round-trips, allowing instant page transitions, live search filtering, and zero backend database overhead."
---

### 💡 WHY (The Concept)
When your website has 100+ articles, projects, or study guides, rendering all 100 entries onto a single webpage creates a massive DOM tree. Long pages slow down mobile scrolling, hurt Largest Contentful Paint (LCP), and overwhelm users.

Instead of writing server-side pagination with database queries and page reloads, **Client-Side Slicing** fetches the complete JSON dataset once, keeps it in browser memory, and dynamically renders only 10 items at a time (`PAGE_SIZE = 10`) using JavaScript array methods.

### ⚖️ THE LOGICAL DECISION
Use client-side pagination for collections under 2,000 records. Calculate dynamic sliding page windows (`1 2 3 ... 10`), reset to Page 1 on search or category filter changes, and scroll smoothly back to the top of the feed upon changing pages.

### ⚙️ HOW (Implementation Code)
#### Clean Client-Side Pagination Controller:
```javascript
let currentPage = 1;
const PAGE_SIZE = 10;
let allItems = []; // Populated from fetch('/assets/data/items.json')

function filterAndRender(resetPage = true) {
    if (resetPage) currentPage = 1;

    // 1. Filter items based on active search/category
    const filtered = allItems.filter(item => {
        return matchesSearch(item) && matchesCategory(item);
    });

    // 2. Compute Total Pages and Boundaries
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // 3. Slice the Array for Current Page
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    // 4. Render Items & Pagination Controls
    renderFeed(pageItems);
    renderPagination(filtered.length, totalPages, startIndex);
}

// Global Page Switcher
window.changePage = function(newPage) {
    currentPage = newPage;
    filterAndRender(false); // Do not reset page index
    document.getElementById('learning-feed').scrollIntoView({ behavior: 'smooth', block: 'start' });
};
```
