---
title: "CNC Coordinate Geometry and Vector Arc Blending"
layout: default
category: "CNC & Math"
date: 2026-07-06
tags:
  - cnc
  - vector-math
  - javascript
status: "Published"
challenge: "What standard G-codes are used to define the active interpolation plane in a CNC machining center, and which plane is the default for standard milling machines?"
answer: "The codes are:\n* **G17**: XY Plane (default for standard milling machines)\n* **G18**: XZ Plane (default for lathes/turning)\n* **G19**: YZ Plane"
---

### 💡 WHY (The Concept)
Modern CNC programming guides a physical cutting tool along precise coordinate paths (G17/G18/G19 planes). When rounding off corners or creating turning curves, sharp joints must be blended with tangential arcs. In mechanical blueprint drawing, coordinates for these tangent start/end points are often left unspecified, forcing programmers to calculate them using geometric properties.

### ⚖️ THE LOGICAL DECISION
To build a toolpath solver, the AI avoided brute-force trigonometry. Instead, it used **vector bisection** to find the circle's center and **cross product math** to determine the direction of rotation (clockwise G2 vs. counter-clockwise G3) dynamically.

### ⚙️ HOW (Implementation Code)
#### 1. Finding the Arc Center (Vector Bisection):
Given two normalized direction vectors $\vec{u}_1$ and $\vec{u}_2$ of the corner lines, we calculate the bisector vector $\vec{b}$ and normalize it to $\vec{n}$. The center of the tangent circle is offset along this normal vector:
$$\vec{b} = \vec{u}_1 + \vec{u}_2 \implies \vec{n} = \frac{\vec{b}}{\|\vec{b}\|}$$

#### 2. Determining CCW (G3) vs. CW (G2) Rotation:
Using the 2D cross product of vector $T_1 \to P_{ip}$ (start-to-intersection) and $P_{ip} \to T_2$ (intersection-to-end):
$$\text{cross} = (x_2 - x_1)(y_3 - y_2) - (y_2 - y_1)(x_3 - x_2)$$
* If $\text{cross} > 0$: Curve is **Counter-Clockwise (G3)**.
* If $\text{cross} < 0$: Curve is **Clockwise (G2)**.
