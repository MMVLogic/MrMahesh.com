/**
 * OpenFit Protocol — Procedural Retro-Fit LED Dot Matrix Display Models
 * Front & Side View Biomechanical Dual-Perspective Animations
 */

(function() {
    'use strict';

    // Helper to build background LED matrix grid
    function generateLedBgGrid(cols, rows, startX, startY, spacing, radius) {
        let dots = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                dots += `<circle cx="${startX + c * spacing}" cy="${startY + r * spacing}" r="${radius}" class="led-off"/>`;
            }
        }
        return dots;
    }

    const LED_MODELS = {
        squat: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW ANIMATION -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <!-- PHASE 1: FRONT STANDING SETUP -->
                    <g class="led-anim-frame-1">
                        <!-- Head -->
                        <circle cx="260" cy="35" r="2.8" class="led-on"/>
                        <circle cx="270" cy="40" r="2.8" class="led-on"/>
                        <circle cx="274" cy="51" r="2.8" class="led-on"/>
                        <circle cx="270" cy="62" r="2.8" class="led-on"/>
                        <circle cx="260" cy="67" r="2.8" class="led-on"/>
                        <circle cx="250" cy="62" r="2.8" class="led-on"/>
                        <circle cx="246" cy="51" r="2.8" class="led-on"/>
                        <circle cx="250" cy="40" r="2.8" class="led-on"/>
                        <circle cx="260" cy="74" r="2.8" class="led-on"/>

                        <!-- Torso -->
                        ${[84, 94, 104, 114, 124, 134].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        <!-- Arms with Dumbbell -->
                        ${[84, 94, 104].map(y => `
                            <circle cx="240" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="280" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}
                        <circle cx="250" cy="104" r="2.8" class="led-on-gold"/>
                        <circle cx="260" cy="104" r="4.2" class="led-on-gold"/>
                        <circle cx="270" cy="104" r="2.8" class="led-on-gold"/>

                        <!-- Legs -->
                        ${[146, 158, 170, 182, 194, 206].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}
                        <circle cx="246" cy="206" r="2.8" class="led-on"/>
                        <circle cx="274" cy="206" r="2.8" class="led-on"/>
                    </g>

                    <!-- PHASE 2: FRONT SQUAT TO BENCH -->
                    <g class="led-anim-frame-2">
                        <!-- Lowered Head -->
                        <circle cx="260" cy="65" r="2.8" class="led-on"/>
                        <circle cx="270" cy="70" r="2.8" class="led-on"/>
                        <circle cx="274" cy="81" r="2.8" class="led-on"/>
                        <circle cx="270" cy="92" r="2.8" class="led-on"/>
                        <circle cx="260" cy="97" r="2.8" class="led-on"/>
                        <circle cx="250" cy="92" r="2.8" class="led-on"/>
                        <circle cx="246" cy="81" r="2.8" class="led-on"/>
                        <circle cx="250" cy="70" r="2.8" class="led-on"/>
                        <circle cx="260" cy="104" r="2.8" class="led-on"/>

                        <!-- Torso -->
                        ${[114, 124, 134, 144].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        <circle cx="250" cy="124" r="2.8" class="led-on-gold"/>
                        <circle cx="260" cy="124" r="4.2" class="led-on-gold"/>
                        <circle cx="270" cy="124" r="2.8" class="led-on-gold"/>

                        <!-- Bent Knees / Depth -->
                        <circle cx="238" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="282" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="232" cy="172" r="3.2" class="led-on-green"/>
                        <circle cx="288" cy="172" r="3.2" class="led-on-green"/>
                        <circle cx="238" cy="190" r="2.8" class="led-on"/>
                        <circle cx="282" cy="190" r="2.8" class="led-on"/>
                        <circle cx="244" cy="206" r="2.8" class="led-on"/>
                        <circle cx="276" cy="206" r="2.8" class="led-on"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE PROFILE ANIMATION (BOX SQUAT MECHANICS) -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <!-- Box Bench Outline -->
                    <rect x="215" y="160" width="30" height="46" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="2,3" rx="3"/>

                    <!-- PHASE 1: SIDE STANDING TALL -->
                    <g class="led-anim-frame-1">
                        <!-- Head -->
                        <circle cx="260" cy="35" r="2.8" class="led-on"/>
                        <circle cx="268" cy="42" r="2.8" class="led-on"/>
                        <circle cx="270" cy="51" r="2.8" class="led-on"/>
                        <circle cx="268" cy="60" r="2.8" class="led-on"/>
                        <circle cx="260" cy="67" r="2.8" class="led-on"/>
                        <circle cx="252" cy="51" r="2.8" class="led-on"/>
                        <circle cx="260" cy="74" r="2.8" class="led-on"/>

                        <!-- Vertical Torso Profile -->
                        ${[84, 94, 104, 114, 124, 134].map(y => `
                            <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        <!-- Dumbbell at Chest Profile -->
                        <circle cx="274" cy="98" r="2.8" class="led-on-gold"/>
                        <circle cx="274" cy="106" r="4.2" class="led-on-gold"/>

                        <!-- Standing Thigh & Shin -->
                        ${[146, 158, 170, 182, 194, 206].map(y => `
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}
                        <circle cx="268" cy="206" r="2.8" class="led-on"/>
                    </g>

                    <!-- PHASE 2: SIDE HIPS BACK ON BENCH -->
                    <g class="led-anim-frame-2">
                        <!-- Angled Head -->
                        <circle cx="268" cy="68" r="2.8" class="led-on"/>
                        <circle cx="276" cy="74" r="2.8" class="led-on"/>
                        <circle cx="276" cy="85" r="2.8" class="led-on"/>
                        <circle cx="268" cy="92" r="2.8" class="led-on"/>
                        <circle cx="260" cy="80" r="2.8" class="led-on"/>

                        <!-- 45° Torso Angle (Spine Safe) -->
                        <circle cx="264" cy="98" r="2.8" class="led-on"/>
                        <circle cx="256" cy="112" r="2.8" class="led-on"/>
                        <circle cx="248" cy="126" r="2.8" class="led-on"/>
                        <circle cx="240" cy="140" r="2.8" class="led-on"/>

                        <!-- Dumbbell Held at Incline Chest -->
                        <circle cx="272" cy="112" r="4.2" class="led-on-gold"/>

                        <!-- Hips Sitting on Bench -->
                        <circle cx="232" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="246" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="260" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="274" cy="155" r="3.2" class="led-on-green"/>

                        <!-- Vertical Shin (Zero Knee Strain) -->
                        <circle cx="274" cy="170" r="2.8" class="led-on"/>
                        <circle cx="274" cy="188" r="2.8" class="led-on"/>
                        <circle cx="274" cy="206" r="2.8" class="led-on"/>
                        <circle cx="282" cy="206" r="2.8" class="led-on"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: DUMBBELL BOX SQUAT •
                </text>
            </svg>
        `,
        press: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <circle cx="260" cy="55" r="2.8" class="led-on"/>
                    <circle cx="270" cy="60" r="2.8" class="led-on"/>
                    <circle cx="274" cy="71" r="2.8" class="led-on"/>
                    <circle cx="270" cy="82" r="2.8" class="led-on"/>
                    <circle cx="260" cy="87" r="2.8" class="led-on"/>
                    <circle cx="250" cy="82" r="2.8" class="led-on"/>
                    <circle cx="246" cy="71" r="2.8" class="led-on"/>
                    <circle cx="250" cy="60" r="2.8" class="led-on"/>
                    <circle cx="260" cy="94" r="2.8" class="led-on"/>

                    ${[104, 114, 124, 134, 144].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[156, 168, 180, 192, 204].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: ARMS AT SHOULDERS -->
                    <g class="led-anim-frame-1">
                        <circle cx="238" cy="104" r="2.8" class="led-on"/>
                        <circle cx="282" cy="104" r="2.8" class="led-on"/>
                        <circle cx="232" cy="115" r="2.8" class="led-on"/>
                        <circle cx="288" cy="115" r="2.8" class="led-on"/>
                        <circle cx="232" cy="100" r="4.2" class="led-on-gold"/>
                        <circle cx="288" cy="100" r="4.2" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: PRESSED OVERHEAD -->
                    <g class="led-anim-frame-2">
                        <circle cx="238" cy="84" r="2.8" class="led-on-green"/>
                        <circle cx="282" cy="84" r="2.8" class="led-on-green"/>
                        <circle cx="244" cy="65" r="2.8" class="led-on-green"/>
                        <circle cx="276" cy="65" r="2.8" class="led-on-green"/>
                        <circle cx="250" cy="46" r="2.8" class="led-on-green"/>
                        <circle cx="270" cy="46" r="2.8" class="led-on-green"/>
                        <circle cx="250" cy="32" r="4.2" class="led-on-gold"/>
                        <circle cx="270" cy="32" r="4.2" class="led-on-gold"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE VIEW -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <circle cx="260" cy="55" r="2.8" class="led-on"/>
                    <circle cx="268" cy="62" r="2.8" class="led-on"/>
                    <circle cx="270" cy="71" r="2.8" class="led-on"/>
                    <circle cx="268" cy="80" r="2.8" class="led-on"/>
                    <circle cx="260" cy="87" r="2.8" class="led-on"/>
                    <circle cx="252" cy="71" r="2.8" class="led-on"/>
                    <circle cx="260" cy="94" r="2.8" class="led-on"/>

                    ${[104, 114, 124, 134, 144].map(y => `
                        <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[156, 168, 180, 192, 204].map(y => `
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}
                    <circle cx="268" cy="204" r="2.8" class="led-on"/>

                    <!-- PHASE 1: SIDE ARMS AT SHOULDER -->
                    <g class="led-anim-frame-1">
                        <circle cx="262" cy="115" r="2.8" class="led-on"/>
                        <circle cx="272" cy="105" r="2.8" class="led-on"/>
                        <circle cx="274" cy="96" r="4.5" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: SIDE ARMS OVERHEAD -->
                    <g class="led-anim-frame-2">
                        <circle cx="260" cy="75" r="2.8" class="led-on-green"/>
                        <circle cx="260" cy="55" r="2.8" class="led-on-green"/>
                        <circle cx="260" cy="42" r="2.8" class="led-on-green"/>
                        <circle cx="260" cy="30" r="4.5" class="led-on-gold"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: DB OVERHEAD PRESS •
                </text>
            </svg>
        `,
        pull: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <circle cx="260" cy="55" r="2.8" class="led-on"/>
                    <circle cx="270" cy="60" r="2.8" class="led-on"/>
                    <circle cx="274" cy="71" r="2.8" class="led-on"/>
                    <circle cx="270" cy="82" r="2.8" class="led-on"/>
                    <circle cx="260" cy="87" r="2.8" class="led-on"/>
                    <circle cx="250" cy="82" r="2.8" class="led-on"/>
                    <circle cx="246" cy="71" r="2.8" class="led-on"/>
                    <circle cx="250" cy="60" r="2.8" class="led-on"/>
                    <circle cx="260" cy="94" r="2.8" class="led-on"/>

                    ${[104, 114, 124, 134, 144].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[156, 168, 180, 192, 204].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: REACHING TO OVERHEAD LAT BAR -->
                    <g class="led-anim-frame-1">
                        <line x1="215" y1="35" x2="305" y2="35" stroke="#f59e0b" stroke-width="3.5"/>
                        <circle cx="230" cy="45" r="2.8" class="led-on"/>
                        <circle cx="290" cy="45" r="2.8" class="led-on"/>
                        <circle cx="240" cy="65" r="2.8" class="led-on"/>
                        <circle cx="280" cy="65" r="2.8" class="led-on"/>
                        <circle cx="248" cy="85" r="2.8" class="led-on"/>
                        <circle cx="272" cy="85" r="2.8" class="led-on"/>
                    </g>

                    <!-- PHASE 2: BAR PULLED TO CLAVICLE -->
                    <g class="led-anim-frame-2">
                        <line x1="215" y1="95" x2="305" y2="95" stroke="#fbbf24" stroke-width="3.5"/>
                        <circle cx="226" cy="115" r="3.2" class="led-on-green"/>
                        <circle cx="294" cy="115" r="3.2" class="led-on-green"/>
                        <circle cx="238" cy="100" r="2.8" class="led-on-green"/>
                        <circle cx="282" cy="100" r="2.8" class="led-on-green"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE VIEW -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <circle cx="260" cy="55" r="2.8" class="led-on"/>
                    <circle cx="268" cy="62" r="2.8" class="led-on"/>
                    <circle cx="270" cy="71" r="2.8" class="led-on"/>
                    <circle cx="268" cy="80" r="2.8" class="led-on"/>
                    <circle cx="260" cy="87" r="2.8" class="led-on"/>
                    <circle cx="252" cy="71" r="2.8" class="led-on"/>
                    <circle cx="260" cy="94" r="2.8" class="led-on"/>

                    ${[104, 114, 124, 134, 144].map(y => `
                        <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[156, 168, 180, 192, 204].map(y => `
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: REACHING UP/FORWARD TO CABLE -->
                    <g class="led-anim-frame-1">
                        <circle cx="268" cy="75" r="2.8" class="led-on"/>
                        <circle cx="278" cy="55" r="2.8" class="led-on"/>
                        <circle cx="286" cy="38" r="2.8" class="led-on"/>
                        <circle cx="290" cy="35" r="4.2" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: ELBOWS DRIVEN BACK & DOWN -->
                    <g class="led-anim-frame-2">
                        <circle cx="242" cy="118" r="3.2" class="led-on-green"/>
                        <circle cx="252" cy="108" r="3.2" class="led-on-green"/>
                        <circle cx="270" cy="96" r="4.2" class="led-on-gold"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: LAT PULLDOWN / ROW •
                </text>
            </svg>
        `,
        walk: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <circle cx="260" cy="45" r="2.8" class="led-on"/>
                    <circle cx="270" cy="50" r="2.8" class="led-on"/>
                    <circle cx="274" cy="61" r="2.8" class="led-on"/>
                    <circle cx="270" cy="72" r="2.8" class="led-on"/>
                    <circle cx="260" cy="77" r="2.8" class="led-on"/>
                    <circle cx="250" cy="72" r="2.8" class="led-on"/>
                    <circle cx="246" cy="61" r="2.8" class="led-on"/>
                    <circle cx="250" cy="50" r="2.8" class="led-on"/>
                    <circle cx="260" cy="84" r="2.8" class="led-on"/>

                    ${[94, 104, 114, 124, 134].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: LEFT STRIDE -->
                    <g class="led-anim-frame-1">
                        <circle cx="238" cy="110" r="2.8" class="led-on"/>
                        <circle cx="232" cy="95" r="2.8" class="led-on"/>
                        <circle cx="282" cy="120" r="2.8" class="led-on"/>
                        <circle cx="288" cy="135" r="2.8" class="led-on"/>
                        <circle cx="246" cy="150" r="3.2" class="led-on-green"/>
                        <circle cx="241" cy="168" r="2.8" class="led-on-green"/>
                        <circle cx="238" cy="188" r="2.8" class="led-on"/>
                        <circle cx="236" cy="205" r="2.8" class="led-on"/>
                        <circle cx="272" cy="150" r="2.8" class="led-on"/>
                        <circle cx="276" cy="172" r="2.8" class="led-on"/>
                        <circle cx="280" cy="195" r="2.8" class="led-on"/>
                    </g>

                    <!-- PHASE 2: RIGHT STRIDE -->
                    <g class="led-anim-frame-2">
                        <circle cx="282" cy="110" r="2.8" class="led-on"/>
                        <circle cx="288" cy="95" r="2.8" class="led-on"/>
                        <circle cx="238" cy="120" r="2.8" class="led-on"/>
                        <circle cx="232" cy="135" r="2.8" class="led-on"/>
                        <circle cx="274" cy="150" r="3.2" class="led-on-green"/>
                        <circle cx="279" cy="168" r="2.8" class="led-on-green"/>
                        <circle cx="282" cy="188" r="2.8" class="led-on"/>
                        <circle cx="284" cy="205" r="2.8" class="led-on"/>
                        <circle cx="248" cy="150" r="2.8" class="led-on"/>
                        <circle cx="244" cy="172" r="2.8" class="led-on"/>
                        <circle cx="240" cy="195" r="2.8" class="led-on"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE VIEW (INCLINE TREADMILL WALK) -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <!-- Incline Ramp Base (5% slope) -->
                    <line x1="210" y1="212" x2="310" y2="198" stroke="#334155" stroke-width="2" stroke-dasharray="3,3"/>

                    <!-- Head & Torso -->
                    <circle cx="260" cy="45" r="2.8" class="led-on"/>
                    <circle cx="268" cy="52" r="2.8" class="led-on"/>
                    <circle cx="270" cy="61" r="2.8" class="led-on"/>
                    <circle cx="268" cy="70" r="2.8" class="led-on"/>
                    <circle cx="260" cy="77" r="2.8" class="led-on"/>
                    <circle cx="252" cy="61" r="2.8" class="led-on"/>
                    <circle cx="260" cy="84" r="2.8" class="led-on"/>

                    ${[94, 104, 114, 124, 134].map(y => `
                        <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: RIGHT FOOT STEPPING UP INCLINE -->
                    <g class="led-anim-frame-1">
                        <circle cx="274" cy="108" r="2.8" class="led-on"/>
                        <circle cx="282" cy="98" r="2.8" class="led-on"/>
                        <circle cx="246" cy="120" r="2.8" class="led-on"/>
                        <!-- Stepping Forward Leg -->
                        <circle cx="272" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="280" cy="175" r="3.2" class="led-on-green"/>
                        <circle cx="286" cy="198" r="2.8" class="led-on"/>
                        <!-- Trailing Leg -->
                        <circle cx="248" cy="160" r="2.8" class="led-on"/>
                        <circle cx="238" cy="185" r="2.8" class="led-on"/>
                        <circle cx="230" cy="208" r="2.8" class="led-on"/>
                    </g>

                    <!-- PHASE 2: LEFT FOOT STEPPING UP INCLINE -->
                    <g class="led-anim-frame-2">
                        <circle cx="246" cy="108" r="2.8" class="led-on"/>
                        <circle cx="238" cy="98" r="2.8" class="led-on"/>
                        <circle cx="274" cy="120" r="2.8" class="led-on"/>
                        <!-- Stepping Forward Leg -->
                        <circle cx="272" cy="155" r="3.2" class="led-on-green"/>
                        <circle cx="280" cy="175" r="3.2" class="led-on-green"/>
                        <circle cx="286" cy="198" r="2.8" class="led-on"/>
                        <!-- Trailing Leg -->
                        <circle cx="248" cy="160" r="2.8" class="led-on"/>
                        <circle cx="238" cy="185" r="2.8" class="led-on"/>
                        <circle cx="230" cy="208" r="2.8" class="led-on"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: INCLINE TREADMILL •
                </text>
            </svg>
        `,
        curl: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <circle cx="260" cy="45" r="2.8" class="led-on"/>
                    <circle cx="270" cy="50" r="2.8" class="led-on"/>
                    <circle cx="274" cy="61" r="2.8" class="led-on"/>
                    <circle cx="270" cy="72" r="2.8" class="led-on"/>
                    <circle cx="260" cy="77" r="2.8" class="led-on"/>
                    <circle cx="250" cy="72" r="2.8" class="led-on"/>
                    <circle cx="246" cy="61" r="2.8" class="led-on"/>
                    <circle cx="250" cy="50" r="2.8" class="led-on"/>
                    <circle cx="260" cy="84" r="2.8" class="led-on"/>

                    ${[94, 104, 114, 124, 134].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[146, 158, 170, 182, 194, 206].map(y => `
                        <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    <!-- PHASE 1: ARMS STRAIGHT DOWN AT SIDES -->
                    <g class="led-anim-frame-1">
                        <circle cx="238" cy="98" r="2.8" class="led-on"/>
                        <circle cx="282" cy="98" r="2.8" class="led-on"/>
                        <circle cx="235" cy="118" r="2.8" class="led-on"/>
                        <circle cx="285" cy="118" r="2.8" class="led-on"/>
                        <circle cx="233" cy="138" r="2.8" class="led-on"/>
                        <circle cx="287" cy="138" r="2.8" class="led-on"/>
                        <circle cx="233" cy="148" r="4.2" class="led-on-gold"/>
                        <circle cx="287" cy="148" r="4.2" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: FOREARMS CURLED UP TO SHOULDERS -->
                    <g class="led-anim-frame-2">
                        <circle cx="238" cy="98" r="2.8" class="led-on"/>
                        <circle cx="282" cy="98" r="2.8" class="led-on"/>
                        <circle cx="231" cy="118" r="3.2" class="led-on-green"/>
                        <circle cx="289" cy="118" r="3.2" class="led-on-green"/>
                        <circle cx="240" cy="90" r="4.2" class="led-on-gold"/>
                        <circle cx="280" cy="90" r="4.2" class="led-on-gold"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE VIEW -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <circle cx="260" cy="45" r="2.8" class="led-on"/>
                    <circle cx="268" cy="52" r="2.8" class="led-on"/>
                    <circle cx="270" cy="61" r="2.8" class="led-on"/>
                    <circle cx="268" cy="70" r="2.8" class="led-on"/>
                    <circle cx="260" cy="77" r="2.8" class="led-on"/>
                    <circle cx="252" cy="61" r="2.8" class="led-on"/>
                    <circle cx="260" cy="84" r="2.8" class="led-on"/>

                    ${[94, 104, 114, 124, 134].map(y => `
                        <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                        <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}

                    ${[146, 158, 170, 182, 194, 206].map(y => `
                        <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                    `).join('')}
                    <circle cx="268" cy="206" r="2.8" class="led-on"/>

                    <!-- PHASE 1: SIDE FOREARM HANGING DOWN -->
                    <g class="led-anim-frame-1">
                        <circle cx="258" cy="115" r="2.8" class="led-on"/>
                        <circle cx="260" cy="135" r="2.8" class="led-on"/>
                        <circle cx="262" cy="150" r="4.5" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: SIDE ELBOW PINNED / FOREARM CURLED UP -->
                    <g class="led-anim-frame-2">
                        <circle cx="258" cy="115" r="3.2" class="led-on-green"/>
                        <circle cx="272" cy="102" r="3.2" class="led-on-green"/>
                        <circle cx="276" cy="88" r="4.5" class="led-on-gold"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: DUMBBELL BICEP CURL •
                </text>
            </svg>
        `,
        rdl: `
            <svg viewBox="0 0 520 280" class="w-full h-auto">
                <rect width="520" height="280" class="led-board-bg"/>
                ${generateLedBgGrid(50, 26, 15, 15, 10, 1.8)}

                <!-- CENTER DIVIDER -->
                <line x1="260" y1="20" x2="260" y2="235" stroke="#242830" stroke-width="1.5" stroke-dasharray="3,4"/>

                <!-- LEFT: FRONT VIEW -->
                <g id="front-view-group" transform="translate(-110, 0)">
                    <!-- PHASE 1: STANDING TALL -->
                    <g class="led-anim-frame-1">
                        <circle cx="260" cy="45" r="2.8" class="led-on"/>
                        <circle cx="270" cy="50" r="2.8" class="led-on"/>
                        <circle cx="274" cy="61" r="2.8" class="led-on"/>
                        <circle cx="270" cy="72" r="2.8" class="led-on"/>
                        <circle cx="260" cy="77" r="2.8" class="led-on"/>
                        <circle cx="250" cy="72" r="2.8" class="led-on"/>
                        <circle cx="246" cy="61" r="2.8" class="led-on"/>
                        <circle cx="250" cy="50" r="2.8" class="led-on"/>
                        <circle cx="260" cy="84" r="2.8" class="led-on"/>

                        ${[94, 104, 114, 124, 134].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        ${[146, 158, 170, 182, 194, 206].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="269" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}
                        <circle cx="242" cy="135" r="4" class="led-on-gold"/>
                        <circle cx="278" cy="135" r="4" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: LOWERING SHINS -->
                    <g class="led-anim-frame-2">
                        <circle cx="260" cy="75" r="2.8" class="led-on"/>
                        <circle cx="270" cy="80" r="2.8" class="led-on"/>
                        <circle cx="274" cy="91" r="2.8" class="led-on"/>
                        <circle cx="270" cy="102" r="2.8" class="led-on"/>
                        <circle cx="260" cy="107" r="2.8" class="led-on"/>
                        <circle cx="249" cy="102" r="2.8" class="led-on"/>
                        <circle cx="245" cy="91" r="2.8" class="led-on"/>
                        <circle cx="250" cy="80" r="2.8" class="led-on"/>

                        ${[118, 128, 138].map(y => `
                            <circle cx="251" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="270" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        <circle cx="246" cy="150" r="3.2" class="led-on-green"/>
                        <circle cx="274" cy="150" r="3.2" class="led-on-green"/>
                        <circle cx="251" cy="170" r="2.8" class="led-on"/>
                        <circle cx="269" cy="170" r="2.8" class="led-on"/>
                        <circle cx="251" cy="190" r="2.8" class="led-on"/>
                        <circle cx="269" cy="190" r="2.8" class="led-on"/>
                        <circle cx="251" cy="206" r="2.8" class="led-on"/>
                        <circle cx="269" cy="206" r="2.8" class="led-on"/>
                        <circle cx="242" cy="175" r="4.2" class="led-on-gold"/>
                        <circle cx="278" cy="175" r="4.2" class="led-on-gold"/>
                    </g>
                </g>

                <!-- RIGHT: SIDE VIEW (HIP HINGE PROFILE) -->
                <g id="side-view-group" transform="translate(110, 0)">
                    <!-- PHASE 1: SIDE STANDING TALL -->
                    <g class="led-anim-frame-1">
                        <circle cx="260" cy="45" r="2.8" class="led-on"/>
                        <circle cx="268" cy="52" r="2.8" class="led-on"/>
                        <circle cx="270" cy="61" r="2.8" class="led-on"/>
                        <circle cx="268" cy="70" r="2.8" class="led-on"/>
                        <circle cx="260" cy="77" r="2.8" class="led-on"/>
                        <circle cx="252" cy="61" r="2.8" class="led-on"/>
                        <circle cx="260" cy="84" r="2.8" class="led-on"/>

                        ${[94, 104, 114, 124, 134].map(y => `
                            <circle cx="257" cy="${y}" r="2.8" class="led-on"/>
                            <circle cx="263" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}

                        ${[146, 158, 170, 182, 194, 206].map(y => `
                            <circle cx="260" cy="${y}" r="2.8" class="led-on"/>
                        `).join('')}
                        <circle cx="268" cy="206" r="2.8" class="led-on"/>
                        <circle cx="270" cy="135" r="4.2" class="led-on-gold"/>
                    </g>

                    <!-- PHASE 2: SIDE HINGE - HIPS BACK & NEUTRAL SPINE -->
                    <g class="led-anim-frame-2">
                        <circle cx="282" cy="72" r="2.8" class="led-on"/>
                        <circle cx="288" cy="80" r="2.8" class="led-on"/>
                        <circle cx="282" cy="88" r="2.8" class="led-on"/>

                        <circle cx="274" cy="98" r="2.8" class="led-on"/>
                        <circle cx="264" cy="112" r="2.8" class="led-on"/>
                        <circle cx="252" cy="126" r="2.8" class="led-on"/>
                        <circle cx="240" cy="138" r="2.8" class="led-on"/>

                        <circle cx="228" cy="148" r="3.2" class="led-on-green"/>
                        <circle cx="242" cy="158" r="3.2" class="led-on-green"/>
                        <circle cx="258" cy="170" r="3.2" class="led-on-green"/>

                        <circle cx="260" cy="188" r="2.8" class="led-on"/>
                        <circle cx="260" cy="206" r="2.8" class="led-on"/>
                        <circle cx="268" cy="206" r="2.8" class="led-on"/>
                        <circle cx="270" cy="175" r="4.2" class="led-on-gold"/>
                    </g>
                </g>

                <!-- SINGLE-LINE METADATA UNDER ANIMATION -->
                <text x="260" y="258" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#f59e0b" text-anchor="middle" letter-spacing="1.5">
                    • EXERCISE: DUMBBELL RDL •
                </text>
            </svg>
        `
    };

    // Expose to window scope for OpenFit app engine
    window.OpenFitModels = {
        generateLedBgGrid: generateLedBgGrid,
        LED_MODELS: LED_MODELS
    };

})();
