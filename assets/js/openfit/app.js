/**
 * OpenFit Protocol — Core Application Engine
 * State Management, Access Gate, Rest Stopwatch, Canvas Chart & Tab Routing
 */

(function() {
    'use strict';

    const AUTHORIZED_LEAD_HASH = 'f5e6ee2dc8ab06440666b705ad3d7a414a21eb60b683c33e818370d9e1b770d8';

    async function sha256(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ── State Variables ─────────────────────────────────────────
    function getTodayDayOfWeek() {
        return (new Date().getDay() + 6) % 7 + 1; // 1=Mon, ..., 7=Sun
    }

    let isLbs = false;
    let baselineStartWeight = 135.0; // kg
    let activeDay = getTodayDayOfWeek();
    let activeExerciseIndex = 0;
    let todayWater = 0;
    let restTimerInterval = null;
    let restTimeRemaining = 90;
    let restTimerRunning = false;
    let completedSets = {};
    let completedSetsData = {};
    let customSplitOverrides = {};
    let activeBlueprintDay = 1;
    let activeBlueprintSegment = 'all';
    let userPrefs = {
        availableEquipment: ["machine", "cable", "dumbbell", "bench", "treadmill", "bike", "barbell", "bodyweight"],
        shieldJoints: true,
        userWeightKg: 135
    };

    function loadAppState() {
        try {
            const raw = localStorage.getItem('mrmahesh_openfit_v6');
            if (raw) {
                const s = JSON.parse(raw);
                if (s.isLbs !== undefined) isLbs = s.isLbs;
                if (s.baselineStartWeight) baselineStartWeight = s.baselineStartWeight;
                if (s.completedSets) completedSets = s.completedSets;
                if (s.completedSetsData) completedSetsData = s.completedSetsData;
                if (s.todayWater !== undefined) todayWater = s.todayWater;
            }
        } catch (e) {}

        try {
            const rawPrefs = localStorage.getItem('mrmahesh_openfit_prefs');
            if (rawPrefs) {
                userPrefs = Object.assign(userPrefs, JSON.parse(rawPrefs));
            }
        } catch (e) {}

        try {
            const rawCustom = localStorage.getItem('mrmahesh_openfit_custom_split');
            if (rawCustom) {
                customSplitOverrides = JSON.parse(rawCustom);
            }
        } catch (e) {}

        if (window.OpenFitData?.generateCustomSplit) {
            userPrefs.userWeightKg = baselineStartWeight;
            const autoSplit = window.OpenFitData.generateCustomSplit(userPrefs);
            // Apply custom overrides if user customized any day
            Object.keys(customSplitOverrides).forEach(d => {
                if (autoSplit[d] && customSplitOverrides[d]?.exercises?.length > 0) {
                    autoSplit[d].exercises = customSplitOverrides[d].exercises;
                    if (customSplitOverrides[d].title) autoSplit[d].title = customSplitOverrides[d].title;
                }
            });
            window.OpenFitData.WORKOUT_SPLIT = autoSplit;
        }
    }

    function saveCustomSplitOverrides() {
        try {
            localStorage.setItem('mrmahesh_openfit_custom_split', JSON.stringify(customSplitOverrides));
        } catch (e) {}
    }

    function saveAppState() {
        try {
            localStorage.setItem('mrmahesh_openfit_v6', JSON.stringify({
                isLbs: isLbs,
                baselineStartWeight: baselineStartWeight,
                completedSets: completedSets,
                completedSetsData: completedSetsData,
                todayWater: todayWater
            }));
        } catch (e) {}
    }

    function getLogs() {
        try { return JSON.parse(localStorage.getItem('mrmahesh_openfit_logs') || '[]'); }
        catch (e) { return []; }
    }

    function saveLogs(logs) {
        try { localStorage.setItem('mrmahesh_openfit_logs', JSON.stringify(logs)); }
        catch (e) {}
    }

    function formatWeight(kg) {
        if (isLbs) {
            return (kg * 2.20462).toFixed(1) + ' lbs';
        }
        return kg.toFixed(1) + ' kg';
    }

    function updateUnitUI() {
        document.querySelectorAll('.unit-label').forEach(el => {
            el.textContent = isLbs ? 'lbs' : 'kg';
        });

        const btnKg = document.getElementById('btn-unit-kg');
        const btnLbs = document.getElementById('btn-unit-lbs');
        if (btnKg && btnLbs) {
            if (isLbs) {
                btnLbs.className = 'px-2.5 py-1 rounded font-bold bg-yellow-500 text-[#1f2937] transition-all';
                btnKg.className = 'px-2.5 py-1 rounded font-bold text-gray-400 hover:text-gray-200 transition-all';
            } else {
                btnKg.className = 'px-2.5 py-1 rounded font-bold bg-yellow-500 text-[#1f2937] transition-all';
                btnLbs.className = 'px-2.5 py-1 rounded font-bold text-gray-400 hover:text-gray-200 transition-all';
            }
        }

        renderBaselineMetrics();
        renderLogsTable();
        renderMultiMetricGraph();
    }

    // ── Access Gate Verification ─────────────────────────────────
    async function checkAccessGate() {
        let user = window.MrMaheshAuth?.getUser();

        // Direct storage fallback if auth.js is still resolving async network session
        if (!user) {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && ((key.startsWith('sb-') && key.endsWith('-auth-token')) || key === 'mrmahesh_user_session')) {
                        const raw = localStorage.getItem(key);
                        if (raw) {
                            const val = JSON.parse(raw);
                            if (val?.user?.email) user = val.user;
                            else if (val?.email) user = val;
                        }
                    }
                }
            } catch (e) {}
        }

        const userEmail = (user?.email || '').trim().toLowerCase();
        let isAuthorized = false;

        if (userEmail) {
            try {
                const hash = await sha256(userEmail);
                if (hash === AUTHORIZED_LEAD_HASH) {
                    isAuthorized = true;
                }
            } catch (e) {}
        }

        const gateLocked = document.getElementById('access-gate-locked');
        const gateUnlocked = document.getElementById('access-gate-unlocked');
        const gateEmailLabel = document.getElementById('gate-user-email');

        if (isAuthorized) {
            gateLocked?.classList.add('hidden');
            gateUnlocked?.classList.remove('hidden');
            renderActiveExercise();
            renderMultiMetricGraph();
        } else {
            gateUnlocked?.classList.add('hidden');
            gateLocked?.classList.remove('hidden');
            if (gateEmailLabel) {
                if (userEmail) {
                    gateEmailLabel.textContent = `Signed In: ${userEmail} (Unauthorized)`;
                    gateEmailLabel.className = 'text-red-400 font-bold';
                } else {
                    gateEmailLabel.textContent = 'Guest (Not Signed In)';
                    gateEmailLabel.className = 'text-gray-400';
                }
            }
        }
    }

    function renderBaselineMetrics() {
        const startEl = document.getElementById('metric-start-weight');
        const targetEl = document.getElementById('metric-target-weight');
        if (startEl) startEl.textContent = formatWeight(baselineStartWeight);
        if (targetEl) {
            targetEl.textContent = isLbs
                ? `${(70 * 2.20462).toFixed(0)} – ${(82 * 2.20462).toFixed(0)} lbs`
                : '70 – 82 kg';
        }
    }

    // ── Tab Routing ──────────────────────────────────────────────
    const TAB_BUTTONS = {
        workout: null,
        plan: null,
        log: null,
        guide: null
    };

    const TAB_PANELS = {
        workout: null,
        plan: null,
        log: null,
        guide: null
    };

    function initTabElements() {
        TAB_BUTTONS.workout = document.getElementById('tab-btn-workout');
        TAB_BUTTONS.plan = document.getElementById('tab-btn-plan');
        TAB_BUTTONS.log = document.getElementById('tab-btn-log');
        TAB_BUTTONS.guide = document.getElementById('tab-btn-guide');

        TAB_PANELS.workout = document.getElementById('tab-panel-workout');
        TAB_PANELS.plan = document.getElementById('tab-panel-plan');
        TAB_PANELS.log = document.getElementById('tab-panel-log');
        TAB_PANELS.guide = document.getElementById('tab-panel-guide');
    }

    function switchTab(tabKey) {
        Object.keys(TAB_PANELS).forEach(k => {
            if (TAB_PANELS[k]) {
                if (k === tabKey) TAB_PANELS[k].classList.remove('hidden');
                else TAB_PANELS[k].classList.add('hidden');
            }
        });

        Object.keys(TAB_BUTTONS).forEach(k => {
            if (TAB_BUTTONS[k]) {
                if (k === tabKey) {
                    TAB_BUTTONS[k].className = 'tab-nav-btn py-2 rounded-lg bg-yellow-500 text-[#1f2937] transition-all flex flex-col items-center justify-center gap-0.5';
                } else {
                    TAB_BUTTONS[k].className = 'tab-nav-btn py-2 rounded-lg text-gray-400 hover:text-gray-200 transition-all flex flex-col items-center justify-center gap-0.5';
                }
            }
        });

        if (tabKey === 'workout') {
            renderActiveExercise();
        } else if (tabKey === 'plan') {
            renderCalendarDayOverview();
            renderDotMatrixGrid();
        } else if (tabKey === 'log') {
            renderLogsTable();
            setTimeout(renderMultiMetricGraph, 60);
        } else if (tabKey === 'guide') {
            renderBaselineMetrics();
            syncBlueprintUI();
            if (typeof renderBlueprintExerciseChecklist === 'function') {
                renderBlueprintExerciseChecklist();
            }
        }
    }

    // ── Active Exercise Renderer ─────────────────────────────────
    function renderActiveExercise() {
        const split = window.OpenFitData?.WORKOUT_SPLIT || {};
        const dayData = split[activeDay] || split[1];
        if (!dayData || !dayData.exercises || dayData.exercises.length === 0) return;

        // Clamp index to prevent out-of-bounds errors when changing days
        if (activeExerciseIndex < 0 || activeExerciseIndex >= dayData.exercises.length) {
            activeExerciseIndex = 0;
        }

        const ex = dayData.exercises[activeExerciseIndex];
        if (!ex) return;

        const dayBadge = document.getElementById('active-day-badge');
        const stepper = document.getElementById('active-ex-stepper');
        const title = document.getElementById('active-ex-title');
        const volume = document.getElementById('active-ex-volume');
        const jisBadge = document.getElementById('active-ex-jis');
        const musclesEl = document.getElementById('active-ex-muscles');
        const board = document.getElementById('led-board-container');
        const ticker1 = document.getElementById('ex-ticker-text-1');
        const ticker2 = document.getElementById('ex-ticker-text-2');

        if (dayBadge) {
            const todayDay = getTodayDayOfWeek();
            if (activeDay === todayDay) {
                dayBadge.textContent = `TODAY • Day ${activeDay}`;
                dayBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 uppercase shadow-sm';
            } else {
                dayBadge.textContent = `Day ${activeDay} (Calendar Target)`;
                dayBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase';
            }
        }
        if (stepper) stepper.textContent = `Exercise ${activeExerciseIndex + 1} of ${dayData.exercises.length}`;
        if (title) title.textContent = ex.name || 'Exercise';
        if (volume) volume.textContent = ex.sets || '3 sets × 10–12 reps';

        if (jisBadge) {
            const jis = ex.jointImpact || 1;
            jisBadge.textContent = `JIS ${jis} • ${jis <= 2 ? 'Joint Safe' : 'Moderate Stress'}`;
            jisBadge.className = jis <= 2
                ? 'px-2 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 text-[10px] font-mono font-bold'
                : 'px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-[10px] font-mono font-bold';
        }

        if (musclesEl) {
            if (ex.primaryMuscles && ex.primaryMuscles.length > 0) {
                const targetText = ex.primaryMuscles.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ');
                musclesEl.textContent = `Targets: ${targetText}`;
            } else {
                musclesEl.textContent = '';
            }
        }

        const cueText = ex.cue ? `• HOW-TO: ${ex.cue.toUpperCase()} •` : '• MAINTAIN STABLE CORE AND CONTROLLED TEMPO •';
        if (ticker1) ticker1.textContent = cueText;
        if (ticker2) ticker2.textContent = cueText;

        if (board) {
            const models = window.OpenFitModels?.LED_MODELS || {};
            const svgTemplate = models[ex.model] || models.squat;
            if (svgTemplate) {
                const safeName = (ex.name || 'EXERCISE').toUpperCase().replace(/&/g, '&amp;');
                const formattedSvg = svgTemplate.replace(
                    /• EXERCISE: [^•]+ •/,
                    `• EXERCISE: ${safeName} •`
                );
                board.innerHTML = formattedSvg;
            }
        }

        renderExerciseSetTracker();
    }

    // ── Historical PR Lookup Engine ────────────────────────────────
    function getExercisePR(exName, setIdx) {
        let bestW = 0;
        let bestR = 10;
        let found = false;

        try {
            const raw = localStorage.getItem('mrmahesh_openfit_v6');
            if (raw) {
                const s = JSON.parse(raw);
                if (s.completedSetsData && s.completedSetsData[exName]) {
                    const exData = s.completedSetsData[exName];
                    if (exData.sets && exData.sets[setIdx]) {
                        const setItem = exData.sets[setIdx];
                        if (setItem.weight && setItem.weight > 0 && setItem.done) {
                            bestW = setItem.weight;
                            bestR = setItem.reps || 10;
                            found = true;
                        }
                    }
                }
            }
        } catch (e) {}

        const logs = getLogs();
        logs.forEach(l => {
            if (l.exerciseData && l.exerciseData[exName] && l.exerciseData[exName].sets) {
                const setItem = l.exerciseData[exName].sets[setIdx];
                if (setItem && setItem.weight > bestW && setItem.done) {
                    bestW = setItem.weight;
                    bestR = setItem.reps || 10;
                    found = true;
                }
            }
        });

        if (found && bestW > 0) {
            return { weight: bestW, reps: bestR };
        }
        return null;
    }

    // ── Interactive Set-by-Set Telemetry Tracker ──────────────────
    function renderExerciseSetTracker() {
        const split = window.OpenFitData?.WORKOUT_SPLIT || {};
        const dayData = split[activeDay] || split[1];
        if (!dayData || !dayData.exercises) return;
        const ex = dayData.exercises[activeExerciseIndex];
        if (!ex) return;

        const exName = ex.name || 'Exercise';
        const defaultTotal = ex.totalSets || 3;
        const defaultW = isLbs ? 35.0 / 2.20462 : 15.0;

        if (!completedSetsData[exName]) {
            completedSetsData[exName] = {
                totalSets: defaultTotal,
                sets: Array.from({ length: defaultTotal }, () => ({
                    reps: 10,
                    weight: defaultW,
                    done: false
                }))
            };
        }

        const exData = completedSetsData[exName];
        while (exData.sets.length < exData.totalSets) {
            const lastW = exData.sets.length > 0 ? exData.sets[exData.sets.length - 1].weight : defaultW;
            const lastR = exData.sets.length > 0 ? exData.sets[exData.sets.length - 1].reps : 10;
            exData.sets.push({ reps: lastR, weight: lastW, done: false });
        }
        if (exData.sets.length > exData.totalSets) {
            exData.sets = exData.sets.slice(0, exData.totalSets);
        }

        const countDisplay = document.getElementById('active-set-count-display');
        if (countDisplay) countDisplay.textContent = exData.totalSets;

        const container = document.getElementById('set-cards-container');
        if (!container) return;

        container.innerHTML = exData.sets.map((setObj, setIdx) => {
            const isDone = !!setObj.done;
            const pr = getExercisePR(exName, setIdx);
            const prText = pr 
                ? `🏆 PR: ${formatWeight(pr.weight)} × ${pr.reps}`
                : `🏆 PR: Baseline Target`;

            const displayW = isLbs ? (setObj.weight * 2.20462) : setObj.weight;

            return `
                <div class="p-3.5 rounded-2xl border transition-all ${
                    isDone 
                        ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_12px_rgba(34,197,94,0.15)]' 
                        : 'bg-[#111827] border-gray-800'
                } space-y-3 font-mono">
                    
                    <!-- Card Header: Set #, Ghost PR readout, Status Badge -->
                    <div class="flex justify-between items-center flex-wrap gap-1 border-b border-gray-800/80 pb-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                isDone 
                                    ? 'bg-green-500 text-gray-900 shadow-sm' 
                                    : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            }">SET ${setIdx + 1}</span>
                            
                            <!-- Greyed-out Historical PR Ghost Readout -->
                            <span class="text-[10px] text-gray-500 font-mono font-bold tracking-tight opacity-75">
                                ${prText}
                            </span>
                        </div>

                        <span class="text-[10px] font-extrabold uppercase tracking-wider ${isDone ? 'text-green-400' : 'text-gray-500'}">
                            ${isDone ? '✓ COMPLETED' : 'PENDING'}
                        </span>
                    </div>

                    <!-- Input Steppers & Quick Chips -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        <!-- Reps Stepper & Preset Chips -->
                        <div class="space-y-1.5">
                            <div class="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                <span>Reps Target:</span>
                                <div class="flex items-center gap-1 text-[9px]">
                                    <button type="button" class="btn-rep-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-val="8">8</button>
                                    <button type="button" class="btn-rep-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-val="10">10</button>
                                    <button type="button" class="btn-rep-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-val="12">12</button>
                                    <button type="button" class="btn-rep-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-val="15">15</button>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-xl border border-gray-800">
                                <button type="button" class="btn-dec-reps w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold flex items-center justify-center text-sm active:scale-95 cursor-pointer" data-set="${setIdx}">−</button>
                                <span class="flex-1 text-center font-bold text-xs sm:text-sm text-yellow-400">${setObj.reps} reps</span>
                                <button type="button" class="btn-inc-reps w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold flex items-center justify-center text-sm active:scale-95 cursor-pointer" data-set="${setIdx}">+</button>
                            </div>
                        </div>

                        <!-- Weight Stepper & Quick Delta Chips -->
                        <div class="space-y-1.5">
                            <div class="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                <span>Weight (${isLbs ? 'lbs' : 'kg'}):</span>
                                <div class="flex items-center gap-1 text-[9px]">
                                    <button type="button" class="btn-w-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-delta="-2.5">-2.5</button>
                                    <button type="button" class="btn-w-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-delta="2.5">+2.5</button>
                                    <button type="button" class="btn-w-chip px-1.5 py-0.5 rounded bg-[#0d1117] text-gray-400 hover:text-yellow-400 border border-gray-800 cursor-pointer" data-set="${setIdx}" data-delta="5.0">+5</button>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-xl border border-gray-800">
                                <button type="button" class="btn-dec-w w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold flex items-center justify-center text-sm active:scale-95 cursor-pointer" data-set="${setIdx}">−</button>
                                <input type="number" step="0.5" class="set-w-input flex-1 text-center font-bold text-xs sm:text-sm bg-transparent text-yellow-400 focus:outline-none" data-set="${setIdx}" value="${displayW.toFixed(1)}">
                                <button type="button" class="btn-inc-w w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold flex items-center justify-center text-sm active:scale-95 cursor-pointer" data-set="${setIdx}">+</button>
                            </div>
                        </div>

                    </div>

                    <!-- Log Action Button -->
                    <button type="button" class="btn-log-set w-full py-2.5 rounded-xl font-bold text-xs font-mono transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isDone 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30' 
                            : 'bg-yellow-500 hover:bg-yellow-400 text-[#1f2937] shadow-md'
                    }" data-set="${setIdx}">
                        ${isDone ? '✓ Set ' + (setIdx + 1) + ' Logged (Tap to Toggle)' : '⚡ Log Set ' + (setIdx + 1) + ' & Start Rest Timer'}
                    </button>
                </div>
            `;
        }).join('');

        // Attach event listeners for steppers, chips, inputs & buttons
        container.querySelectorAll('.btn-dec-reps').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                if (exData.sets[idx] && exData.sets[idx].reps > 1) {
                    exData.sets[idx].reps--;
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-inc-reps').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                if (exData.sets[idx]) {
                    exData.sets[idx].reps++;
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-rep-chip').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                const val = parseInt(e.currentTarget.dataset.val, 10);
                if (exData.sets[idx]) {
                    exData.sets[idx].reps = val;
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-dec-w').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                if (exData.sets[idx]) {
                    const stepKg = isLbs ? (2.5 / 2.20462) : 1.0;
                    exData.sets[idx].weight = Math.max(0, exData.sets[idx].weight - stepKg);
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-inc-w').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                if (exData.sets[idx]) {
                    const stepKg = isLbs ? (2.5 / 2.20462) : 1.0;
                    exData.sets[idx].weight += stepKg;
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-w-chip').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                const delta = parseFloat(e.currentTarget.dataset.delta);
                if (exData.sets[idx]) {
                    const deltaKg = isLbs ? (delta / 2.20462) : delta;
                    exData.sets[idx].weight = Math.max(0, exData.sets[idx].weight + deltaKg);
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.set-w-input').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.target.dataset.set, 10);
                const val = parseFloat(e.target.value);
                if (exData.sets[idx] && !isNaN(val) && val >= 0) {
                    exData.sets[idx].weight = isLbs ? (val / 2.20462) : val;
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });

        container.querySelectorAll('.btn-log-set').forEach(b => {
            b.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.set, 10);
                if (exData.sets[idx]) {
                    const wasDone = exData.sets[idx].done;
                    exData.sets[idx].done = !wasDone;
                    if (!wasDone) {
                        triggerRestTimer(90);
                    }
                    saveAppState();
                    renderExerciseSetTracker();
                }
            });
        });
    }

    function initSetTrackerControls() {
        document.getElementById('btn-dec-sets')?.addEventListener('click', () => {
            const split = window.OpenFitData?.WORKOUT_SPLIT || {};
            const dayData = split[activeDay] || split[1];
            if (!dayData || !dayData.exercises) return;
            const ex = dayData.exercises[activeExerciseIndex];
            if (!ex) return;
            const exName = ex.name;

            if (completedSetsData[exName] && completedSetsData[exName].totalSets > 1) {
                completedSetsData[exName].totalSets--;
                saveAppState();
                renderExerciseSetTracker();
            }
        });

        document.getElementById('btn-inc-sets')?.addEventListener('click', () => {
            const split = window.OpenFitData?.WORKOUT_SPLIT || {};
            const dayData = split[activeDay] || split[1];
            if (!dayData || !dayData.exercises) return;
            const ex = dayData.exercises[activeExerciseIndex];
            if (!ex) return;
            const exName = ex.name;

            if (completedSetsData[exName] && completedSetsData[exName].totalSets < 6) {
                completedSetsData[exName].totalSets++;
                saveAppState();
                renderExerciseSetTracker();
            }
        });
    }

    // ── Rest Stopwatch Timer ─────────────────────────────────────
    function triggerRestTimer(seconds) {
        clearInterval(restTimerInterval);
        restTimeRemaining = seconds;
        restTimerRunning = true;
        updateTimerDisplay();

        const toggleBtn = document.getElementById('btn-timer-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = 'Pause';
            toggleBtn.className = 'ml-1 px-2 py-0.5 bg-yellow-500 text-[#1f2937] text-[10px] font-bold rounded';
        }

        restTimerInterval = setInterval(() => {
            if (restTimeRemaining > 0) {
                restTimeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(restTimerInterval);
                restTimerRunning = false;
                if (toggleBtn) {
                    toggleBtn.textContent = 'Start';
                    toggleBtn.className = 'ml-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-[10px] font-bold rounded';
                }
                const display = document.getElementById('rest-timer-display');
                if (display) display.textContent = "REST DONE!";
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const display = document.getElementById('rest-timer-display');
        if (!display) return;
        const mins = Math.floor(restTimeRemaining / 60);
        const secs = restTimeRemaining % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // ── Hydration Display ────────────────────────────────────────
    function updateWaterDisplay() {
        const el = document.getElementById('water-display');
        if (el) el.textContent = `${todayWater.toFixed(1)} / 3.5 L`;
    }

    // ── Multi-Metric Canvas Graph ────────────────────────────────
    function renderMultiMetricGraph() {
        const canvas = document.getElementById('multi-metric-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        if (rect.width === 0 || rect.height === 0) return;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        let logs = getLogs();
        if (logs.length === 0) {
            logs = [
                { date: '08/01', weight: 135.0, water: 2.5, steps: 6000, workout: true },
                { date: '08/08', weight: 133.8, water: 3.0, steps: 7500, workout: true },
                { date: '08/15', weight: 132.5, water: 3.5, steps: 8200, workout: true },
                { date: '08/22', weight: 131.2, water: 3.5, steps: 9000, workout: true }
            ];
        }

        const padding = { top: 25, right: 25, bottom: 25, left: 42 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;

        // Calculate min & max for weight
        const weights = logs.map(l => isLbs ? (l.weight * 2.20462) : l.weight);
        const minW = Math.floor(Math.min(...weights) - 1.5);
        const maxW = Math.ceil(Math.max(...weights) + 1.5);
        const rangeW = Math.max(1, maxW - minW);

        // Draw horizontal grid lines & Y-axis labels
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.textAlign = 'right';

        const gridSteps = 4;
        for (let i = 0; i <= gridSteps; i++) {
            const y = padding.top + (graphHeight / gridSteps) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            // Y-axis weight label
            const val = maxW - (rangeW / gridSteps) * i;
            ctx.fillText(val.toFixed(0), padding.left - 6, y + 3);
        }

        // Map data points
        const numPoints = Math.max(1, logs.length - 1);
        const points = logs.map((l, i) => {
            const x = padding.left + (graphWidth / numPoints) * i;
            const w = isLbs ? (l.weight * 2.20462) : l.weight;
            const yWeight = padding.top + graphHeight - ((w - minW) / rangeW) * graphHeight;
            
            // Steps normalized to 0-12,000 steps
            const s = l.steps || 0;
            const ySteps = padding.top + graphHeight - (Math.min(12000, s) / 12000) * graphHeight;

            // Water normalized to 0-4.0 L
            const wt = l.water || 0;
            const yWater = padding.top + graphHeight - (Math.min(4.0, wt) / 4.0) * graphHeight;

            return { x, yWeight, ySteps, yWater, log: l };
        });

        // 1. Draw Steps Line (Green Dashed)
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.ySteps);
            else ctx.lineTo(pt.x, pt.ySteps);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Draw Water Line (Blue Dotted)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.yWater);
            else ctx.lineTo(pt.x, pt.yWater);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Draw Weight Line (Amber Solid)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.yWeight);
            else ctx.lineTo(pt.x, pt.yWeight);
        });
        ctx.stroke();

        // 4. Draw Point Markers & Workout Badges
        points.forEach(pt => {
            // Weight marker
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(pt.x, pt.yWeight, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Workout badge at top of column
            if (pt.log.workout) {
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(pt.x, padding.top - 8, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Date label
            ctx.fillStyle = '#64748b';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(pt.log.date, pt.x, height - 8);
        });
    }

    // ── Dot Matrix Calendar Grid ─────────────────────────────────
    function renderDotMatrixGrid() {
        const grid = document.getElementById('dot-matrix-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const todayDate = now.getDate();

        // Update header month title if element exists
        const monthTitle = document.getElementById('calendar-month-title');
        if (monthTitle) {
            monthTitle.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        }

        const logs = getLogs();
        const monthStr = String(month + 1).padStart(2, '0');
        const loggedDates = new Set(logs.map(l => l.date));

        // Calculate days in month and starting day of week (Monday-based: Mon=0, ..., Sun=6)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

        // Render empty offset cells for alignment
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'w-7 h-7';
            grid.appendChild(emptyCell);
        }

        // Render day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${monthStr}/${String(d).padStart(2, '0')}`;
            const isLogged = loggedDates.has(dateStr);
            const isToday = (d === todayDate);

            const dot = document.createElement('div');
            dot.className = `w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                isLogged
                    ? 'bg-green-500 text-gray-900 shadow-[0_0_6px_rgba(34,197,94,0.4)]'
                    : isToday
                    ? 'bg-yellow-500 text-gray-900 border border-yellow-300 font-extrabold shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                    : 'bg-[#111827] text-gray-500 border border-gray-800'
            }`;
            dot.textContent = d;
            dot.title = isLogged ? `${dateStr}: Activity Logged ✓` : isToday ? `${dateStr}: Today` : dateStr;
            grid.appendChild(dot);
        }
    }

    // ── Logs Table ───────────────────────────────────────────────
    function renderLogsTable() {
        const tbody = document.getElementById('logs-table-body');
        if (!tbody) return;
        const logs = getLogs();

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3 text-gray-500">No telemetry recorded yet.</td></tr>';
            return;
        }

        tbody.innerHTML = logs.slice(-8).reverse().map(l => `
            <tr class="border-b border-gray-800/60 hover:bg-gray-800/30">
                <td class="py-2 text-gray-300">${l.date}</td>
                <td class="py-2 text-yellow-400 font-bold">${formatWeight(l.weight)}</td>
                <td class="py-2 text-blue-400">${l.water || '0.0'} L</td>
                <td class="py-2 text-green-400">${l.steps || '0'}</td>
                <td class="py-2 text-center">${l.workout ? '✅' : '—'}</td>
                <td class="py-2 text-center">
                    <button class="btn-del-log text-red-400 hover:text-red-300" data-id="${l.id}">✕</button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-del-log').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id || e.target.dataset.id;
                saveLogs(getLogs().filter(l => l.id !== id));
                renderLogsTable();
                renderMultiMetricGraph();
                renderDotMatrixGrid();
            });
        });
    }

    // ── Blueprint Customization Controls ─────────────────────────
    const PRESET_EQUIPMENT_MAP = {
        zero: ['bodyweight'],
        home: ['dumbbell', 'bench', 'bodyweight'],
        condo: ['dumbbell', 'bench', 'cable', 'treadmill', 'bike', 'bodyweight'],
        commercial: ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight']
    };

    function determineActivePreset() {
        const current = (userPrefs.availableEquipment || []).slice().sort();
        for (const [key, list] of Object.entries(PRESET_EQUIPMENT_MAP)) {
            const sorted = list.slice().sort();
            if (current.length === sorted.length && current.every((v, i) => v === sorted[i])) {
                return key;
            }
        }
        return null;
    }

    function syncBlueprintUI() {
        const equipList = userPrefs.availableEquipment || [];
        const equipIds = ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'];
        equipIds.forEach(id => {
            const el = document.getElementById(`equip-${id}`);
            if (el) el.checked = equipList.includes(id);
        });
        const shieldEl = document.getElementById('pref-shield-joints');
        if (shieldEl) shieldEl.checked = userPrefs.shieldJoints !== false;

        updatePresetButtonsUI(determineActivePreset());
    }

    function updatePresetButtonsUI(activePresetKey) {
        document.querySelectorAll('.equip-preset-btn').forEach(btn => {
            const isMatch = btn.dataset.preset === activePresetKey;
            if (isMatch) {
                btn.className = 'equip-preset-btn p-2.5 rounded-xl bg-yellow-500/15 border-2 border-yellow-500 text-left transition-all ring-1 ring-yellow-500/40';
            } else {
                btn.className = 'equip-preset-btn p-2.5 rounded-xl bg-[#111827] border border-gray-700 hover:border-yellow-500 text-left transition-all';
            }
        });

        const badge = document.getElementById('active-preset-badge');
        if (badge) {
            if (activePresetKey) {
                badge.textContent = `Active: ${activePresetKey.toUpperCase()}`;
                badge.className = 'text-[10px] text-yellow-400 font-bold uppercase tracking-wider';
            } else {
                badge.textContent = 'Active: Custom Setup';
                badge.className = 'text-[10px] text-gray-400 font-bold uppercase tracking-wider';
            }
        }
    }

    function renderCalendarDayOverview() {
        const split = window.OpenFitData?.WORKOUT_SPLIT || {};
        const dData = split[activeDay] || split[1];
        if (!dData) return;

        // Sync day buttons in Calendar Tab
        document.querySelectorAll('.day-select-btn').forEach(b => {
            if (parseInt(b.dataset.day, 10) === activeDay) {
                b.className = 'day-select-btn p-2 rounded-lg border border-yellow-500 bg-yellow-500 text-[#1f2937] shadow-sm';
            } else {
                b.className = 'day-select-btn p-2 rounded-lg border border-gray-700 bg-[#111827] text-gray-400 hover:border-gray-600';
            }
        });

        const tag = document.getElementById('plan-day-tag');
        const count = document.getElementById('plan-day-ex-count');
        const title = document.getElementById('plan-day-title');
        const list = document.getElementById('plan-day-exercise-list');

        if (tag) tag.textContent = dData.shortTag;
        if (count) count.textContent = `${dData.exercises.length} Exercises`;
        if (title) title.textContent = dData.title;

        if (list) {
            list.innerHTML = dData.exercises.map((ex, i) => `
                <div class="flex items-center justify-between p-2 rounded-lg bg-[#0d1117] border border-gray-800/80">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-[10px] flex items-center justify-center">${i + 1}</span>
                        <span class="font-bold text-gray-200 text-xs">${ex.name}</span>
                    </div>
                    <span class="text-[10px] text-yellow-400/90 font-mono">${ex.sets.split('×')[0] || ex.sets}</span>
                </div>
            `).join('');
        }
    }

    function applyBlueprintSettings(presetKey = null) {
        if (presetKey && PRESET_EQUIPMENT_MAP[presetKey]) {
            userPrefs.availableEquipment = [...PRESET_EQUIPMENT_MAP[presetKey]];
            // Sync checkboxes immediately
            const equipIds = ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'];
            equipIds.forEach(id => {
                const el = document.getElementById(`equip-${id}`);
                if (el) el.checked = userPrefs.availableEquipment.includes(id);
            });
        } else {
            const selected = [];
            ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'].forEach(id => {
                const el = document.getElementById(`equip-${id}`);
                if (el && el.checked) selected.push(id);
            });
            if (selected.length === 0) {
                selected.push('bodyweight');
                const bw = document.getElementById('equip-bodyweight');
                if (bw) bw.checked = true;
            }
            userPrefs.availableEquipment = selected;
        }

        const shieldEl = document.getElementById('pref-shield-joints');
        userPrefs.shieldJoints = shieldEl ? shieldEl.checked : true;
        userPrefs.userWeightKg = baselineStartWeight;

        try {
            localStorage.setItem('mrmahesh_openfit_prefs', JSON.stringify(userPrefs));
        } catch (e) {}

        if (window.OpenFitData?.generateCustomSplit) {
            const autoSplit = window.OpenFitData.generateCustomSplit(userPrefs);
            // Re-apply any custom overrides
            Object.keys(customSplitOverrides).forEach(d => {
                if (autoSplit[d] && customSplitOverrides[d]?.exercises?.length > 0) {
                    autoSplit[d].exercises = customSplitOverrides[d].exercises;
                    if (customSplitOverrides[d].title) autoSplit[d].title = customSplitOverrides[d].title;
                }
            });
            window.OpenFitData.WORKOUT_SPLIT = autoSplit;
        }

        updatePresetButtonsUI(presetKey || determineActivePreset());
        renderBlueprintExerciseChecklist();

        // Live update active exercise on Workout Tab
        activeExerciseIndex = 0;
        renderActiveExercise();

        // Live update Calendar Tab
        renderCalendarDayOverview();

        // Show Toast Notification
        const toast = document.getElementById('blueprint-status-toast');
        if (toast) {
            const name = presetKey ? `${presetKey.toUpperCase()} preset` : 'custom selection';
            toast.textContent = `✓ Protocol calibrated! Live applied ${name} (${userPrefs.availableEquipment.length} equipment types).`;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3500);
        }
    }

    // ── Blueprint Day-by-Day Routine Builder & Customizer ────────
    function initDaySplitCustomizer() {
        // 1. Day Selector Pills
        document.querySelectorAll('.bp-day-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                activeBlueprintDay = parseInt(btn.dataset.day, 10);
                updateBlueprintDayPillsUI();
                renderBlueprintExerciseChecklist();
            });
        });

        // 2. Segment Filter Chips
        document.querySelectorAll('.bp-segment-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                activeBlueprintSegment = chip.dataset.segment;
                updateBlueprintSegmentChipsUI();
                renderBlueprintExerciseChecklist();
            });
        });

        // 3. Reset Day to Recommended Button
        document.getElementById('btn-reset-bp-day')?.addEventListener('click', () => {
            delete customSplitOverrides[activeBlueprintDay];
            saveCustomSplitOverrides();

            if (window.OpenFitData?.generateCustomSplit) {
                const fresh = window.OpenFitData.generateCustomSplit(userPrefs);
                if (fresh[activeBlueprintDay]) {
                    window.OpenFitData.WORKOUT_SPLIT[activeBlueprintDay] = fresh[activeBlueprintDay];
                }
            }

            renderBlueprintExerciseChecklist();
            renderActiveExercise();
            renderCalendarDayOverview();

            showBlueprintDayToast(`✓ Day ${activeBlueprintDay} reset to recommended split!`);
        });

        updateBlueprintDayPillsUI();
        updateBlueprintSegmentChipsUI();
        renderBlueprintExerciseChecklist();
    }

    function updateBlueprintDayPillsUI() {
        document.querySelectorAll('.bp-day-pill').forEach(btn => {
            const d = parseInt(btn.dataset.day, 10);
            const isCustom = !!(customSplitOverrides[d]?.exercises?.length);
            if (d === activeBlueprintDay) {
                btn.className = 'bp-day-pill p-2 rounded-xl border-2 border-yellow-500 bg-yellow-500/20 text-yellow-400 font-bold text-center transition-all shadow-sm ring-1 ring-yellow-500/40';
            } else {
                btn.className = `bp-day-pill p-2 rounded-xl border text-center transition-all font-bold ${
                    isCustom 
                        ? 'border-yellow-500/40 bg-[#111827] text-yellow-300 hover:border-yellow-500' 
                        : 'border-gray-800 bg-[#111827] text-gray-400 hover:border-gray-700'
                }`;
            }
        });
    }

    function updateBlueprintSegmentChipsUI() {
        const segLabels = {
            all: 'All Movements',
            upper: 'Upper Body',
            push: 'Push (Chest/Shoulders/Tri)',
            pull: 'Pull (Back/Lats/Bi)',
            lower: 'Lower (Quads/Glutes/Ham)',
            core: 'Core & Stability',
            cardio: 'Cardio & Conditioning'
        };

        const indicator = document.getElementById('bp-segment-indicator');
        if (indicator) {
            indicator.textContent = segLabels[activeBlueprintSegment] || 'All Movements';
        }

        document.querySelectorAll('.bp-segment-chip').forEach(chip => {
            const s = chip.dataset.segment;
            if (s === activeBlueprintSegment) {
                chip.className = 'bp-segment-chip px-2.5 py-1.5 rounded-lg border-2 border-yellow-500 bg-yellow-500 text-[#1f2937] font-bold text-xs shrink-0 shadow-sm';
            } else {
                chip.className = 'bp-segment-chip px-2.5 py-1.5 rounded-lg border border-gray-700 bg-[#111827] text-gray-300 hover:border-yellow-500 text-xs shrink-0 font-bold';
            }
        });
    }

    function renderBlueprintExerciseChecklist() {
        const container = document.getElementById('bp-exercise-checklist-container');
        if (!container) return;

        updateBlueprintDayPillsUI();

        // Get currently scheduled exercises for activeBlueprintDay
        const currentSplit = window.OpenFitData?.WORKOUT_SPLIT || {};
        const dayData = currentSplit[activeBlueprintDay] || currentSplit[1];
        const currentExercises = dayData?.exercises || [];
        const scheduledNames = new Set(currentExercises.map(e => e.name));

        // Get all matching exercises for this segment + active equipment + joint shield
        let eligible = [];
        if (window.OpenFitData?.getExercisesBySegment) {
            eligible = window.OpenFitData.getExercisesBySegment(
                activeBlueprintSegment,
                userPrefs.availableEquipment,
                userPrefs.shieldJoints,
                userPrefs.userWeightKg
            );
        } else {
            eligible = (window.OpenFitData?.EXERCISE_CATALOG || []).filter(e => {
                if (activeBlueprintSegment !== 'all' && e.category !== activeBlueprintSegment) return false;
                return true;
            });
        }

        // Sort: scheduled exercises first, then alphabetical
        const sorted = eligible.slice().sort((a, b) => {
            const aIn = scheduledNames.has(a.name) ? 0 : 1;
            const bIn = scheduledNames.has(b.name) ? 0 : 1;
            if (aIn !== bIn) return aIn - bIn;
            return a.name.localeCompare(b.name);
        });

        // Update scheduled counter
        const countEl = document.getElementById('bp-day-scheduled-count');
        if (countEl) {
            countEl.textContent = `${scheduledNames.size} Scheduled for Day ${activeBlueprintDay}`;
        }

        // Update badge
        const badge = document.getElementById('bp-editor-mode-badge');
        if (badge) {
            const isCustom = !!(customSplitOverrides[activeBlueprintDay]?.exercises?.length);
            if (isCustom) {
                badge.textContent = `Customized (Day ${activeBlueprintDay})`;
                badge.className = 'px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 text-[10px] border border-yellow-500/40 font-bold';
            } else {
                badge.textContent = `Recommended (Day ${activeBlueprintDay})`;
                badge.className = 'px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] border border-green-500/30';
            }
        }

        if (sorted.length === 0) {
            container.innerHTML = `
                <div class="text-center py-6 text-xs text-gray-400 bg-[#111827] rounded-xl border border-gray-800 p-4">
                    <p class="text-yellow-400 font-bold mb-1">No exercises matching filter</p>
                    <p class="text-[10px] text-gray-500">Try selecting "All Movements" or enabling more equipment in the gym customizer above.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sorted.map(ex => {
            const isChecked = scheduledNames.has(ex.name);
            const equipBadges = ex.equipment.map(eq => `<span class="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-[9px] uppercase font-mono">${eq}</span>`).join(' ');
            const muscles = ex.primaryMuscles?.join(', ') || ex.category;
            const jisClass = ex.jointImpact <= 1 
                ? 'bg-green-500/15 text-green-400 border-green-500/30' 
                : ex.jointImpact === 2 
                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' 
                : 'bg-red-500/15 text-red-400 border-red-500/30';

            return `
                <label class="flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked 
                        ? 'bg-yellow-500/10 border-yellow-500/60 shadow-sm' 
                        : 'bg-[#111827] border-gray-800/80 hover:border-gray-700'
                }">
                    <input type="checkbox" class="bp-ex-checkbox mt-1 rounded bg-gray-900 border-gray-700 text-yellow-500 focus:ring-0 w-4 h-4 cursor-pointer" 
                        data-name="${ex.name}" ${isChecked ? 'checked' : ''}>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-1 flex-wrap">
                            <span class="font-bold text-xs ${isChecked ? 'text-yellow-400' : 'text-gray-200'}">${ex.name}</span>
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold border ${jisClass}">JIS ${ex.jointImpact}</span>
                        </div>
                        <div class="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1 flex-wrap">
                            <span>🎯 <strong class="text-gray-300">${muscles}</strong></span>
                            <span>•</span>
                            <div class="inline-flex gap-1">${equipBadges}</div>
                        </div>
                        <div class="text-[10px] text-yellow-500/90 font-mono mt-1">
                            ${ex.sets}
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        // Attach checkbox change event listeners
        container.querySelectorAll('.bp-ex-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const exName = e.target.dataset.name;
                const isNowChecked = e.target.checked;
                toggleExerciseForActiveDay(exName, isNowChecked);
            });
        });
    }

    function toggleExerciseForActiveDay(exName, isChecked) {
        const catalog = window.OpenFitData?.EXERCISE_CATALOG || [];
        const targetEx = catalog.find(e => e.name === exName);
        if (!targetEx) return;

        const currentSplit = window.OpenFitData?.WORKOUT_SPLIT || {};
        if (!currentSplit[activeBlueprintDay]) return;

        let dayExercises = [...(currentSplit[activeBlueprintDay].exercises || [])];

        if (isChecked) {
            // Add if not already present
            if (!dayExercises.some(e => e.name === exName)) {
                dayExercises.push(targetEx);
            }
        } else {
            // Remove
            if (dayExercises.length <= 1) {
                showBlueprintDayToast('⚠️ A day must have at least 1 exercise.', true);
                renderBlueprintExerciseChecklist();
                return;
            }
            dayExercises = dayExercises.filter(e => e.name !== exName);
        }

        // Save override
        currentSplit[activeBlueprintDay].exercises = dayExercises;
        customSplitOverrides[activeBlueprintDay] = {
            exercises: dayExercises,
            title: currentSplit[activeBlueprintDay].title
        };
        saveCustomSplitOverrides();

        // Re-render UI
        renderBlueprintExerciseChecklist();
        if (activeDay === activeBlueprintDay) {
            if (activeExerciseIndex >= dayExercises.length) {
                activeExerciseIndex = Math.max(0, dayExercises.length - 1);
            }
            renderActiveExercise();
        }
        renderCalendarDayOverview();

        showBlueprintDayToast(`✓ Day ${activeBlueprintDay} updated: ${dayExercises.length} exercises scheduled!`);
    }

    function showBlueprintDayToast(msg, isErr = false) {
        const toast = document.getElementById('bp-day-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `text-[10px] font-bold ${isErr ? 'text-red-400' : 'text-green-400'}`;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    function initBlueprintControls() {
        syncBlueprintUI();

        // Preset 1-click buttons: immediately switch and live update!
        ['zero', 'home', 'condo', 'commercial'].forEach(preset => {
            document.getElementById(`preset-${preset}`)?.addEventListener('click', () => {
                applyBlueprintSettings(preset);
            });
        });

        // Individual equipment checkboxes: immediately live update!
        ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'].forEach(id => {
            document.getElementById(`equip-${id}`)?.addEventListener('change', () => {
                applyBlueprintSettings();
            });
        });

        // Shield joints checkbox: immediately live update!
        document.getElementById('pref-shield-joints')?.addEventListener('change', () => {
            applyBlueprintSettings();
        });

        // Manual Generate and Apply Button
        document.getElementById('btn-generate-workout')?.addEventListener('click', () => {
            applyBlueprintSettings();
        });

        // Biomechanical Guardrails Dismiss Handler
        const guardrailsCard = document.getElementById('blueprint-guardrails-card');
        try {
            if (localStorage.getItem('mrmahesh_openfit_hide_guardrails') === 'true') {
                if (guardrailsCard) guardrailsCard.classList.add('hidden');
            }
        } catch (e) {}

        document.getElementById('btn-dismiss-guardrails')?.addEventListener('click', () => {
            if (guardrailsCard) {
                guardrailsCard.classList.add('hidden');
                try {
                    localStorage.setItem('mrmahesh_openfit_hide_guardrails', 'true');
                } catch (e) {}
            }
        });

        // Initialize Day Split Customizer
        initDaySplitCustomizer();
    }

    // ── DOM Initialization Runner ────────────────────────────────
    function startApp() {
        initTabElements();
        loadAppState();
        updateUnitUI();
        updateWaterDisplay();
        initBlueprintControls();
        initSetTrackerControls();
        renderActiveExercise();
        renderCalendarDayOverview();
        renderDotMatrixGrid();
        renderLogsTable();

        // Tab Navigation Listeners
        TAB_BUTTONS.workout?.addEventListener('click', () => switchTab('workout'));
        TAB_BUTTONS.plan?.addEventListener('click', () => switchTab('plan'));
        TAB_BUTTONS.log?.addEventListener('click', () => switchTab('log'));
        TAB_BUTTONS.guide?.addEventListener('click', () => switchTab('guide'));

        // Stepper Navigation
        document.getElementById('btn-prev-ex')?.addEventListener('click', () => {
            const split = window.OpenFitData?.WORKOUT_SPLIT || {};
            const dayData = split[activeDay] || split[1];
            if (activeExerciseIndex > 0) {
                activeExerciseIndex--;
            } else {
                activeExerciseIndex = (dayData?.exercises.length || 1) - 1;
            }
            renderActiveExercise();
        });

        document.getElementById('btn-next-ex')?.addEventListener('click', () => {
            const split = window.OpenFitData?.WORKOUT_SPLIT || {};
            const dayData = split[activeDay] || split[1];
            if (activeExerciseIndex < (dayData?.exercises.length || 1) - 1) {
                activeExerciseIndex++;
            } else {
                activeExerciseIndex = 0;
            }
            renderActiveExercise();
        });

        // Day Selector in Calendar Tab
        document.querySelectorAll('.day-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.day-select-btn').forEach(b => {
                    b.className = 'day-select-btn p-2 rounded-lg border border-gray-700 bg-[#111827] text-gray-400';
                });
                btn.className = 'day-select-btn p-2 rounded-lg border border-yellow-500 bg-yellow-500 text-[#1f2937]';
                
                const d = parseInt(btn.dataset.day, 10);
                activeDay = d;
                renderCalendarDayOverview();
                updateWorkoutDayPills();
            });
        });

        document.getElementById('btn-start-selected-workout')?.addEventListener('click', () => {
            activeExerciseIndex = 0;
            renderActiveExercise();
            switchTab('workout');
        });

        // Rest Timer Buttons
        document.getElementById('btn-timer-toggle')?.addEventListener('click', () => {
            if (restTimerRunning) {
                clearInterval(restTimerInterval);
                restTimerRunning = false;
                const b = document.getElementById('btn-timer-toggle');
                if (b) {
                    b.textContent = 'Start';
                    b.className = 'ml-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-[10px] font-bold rounded';
                }
            } else {
                triggerRestTimer(restTimeRemaining || 90);
            }
        });

        document.getElementById('btn-timer-reset')?.addEventListener('click', () => {
            clearInterval(restTimerInterval);
            restTimerRunning = false;
            restTimeRemaining = 90;
            updateTimerDisplay();
            const b = document.getElementById('btn-timer-toggle');
            if (b) {
                b.textContent = 'Start';
                b.className = 'ml-1 px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-[10px] font-bold rounded';
            }
        });

        // Hydration Buttons
        document.getElementById('btn-add-water')?.addEventListener('click', () => {
            todayWater = Math.min(6.0, todayWater + 0.25);
            saveAppState();
            updateWaterDisplay();
        });

        document.getElementById('btn-reset-water')?.addEventListener('click', () => {
            todayWater = 0;
            saveAppState();
            updateWaterDisplay();
        });

        // Metric Log Submission
        document.getElementById('btn-save-log')?.addEventListener('click', () => {
            const weightInput = document.getElementById('log-weight');
            const stepsInput = document.getElementById('log-steps');
            const workoutDone = document.getElementById('log-workout-done');
            const toast = document.getElementById('log-status-toast');

            const showToast = (msg, isErr = false) => {
                if (toast) {
                    toast.textContent = msg;
                    toast.className = `text-[10px] text-center font-bold font-mono pt-1 ${isErr ? 'text-red-400' : 'text-green-400'}`;
                    toast.classList.remove('hidden');
                    setTimeout(() => toast.classList.add('hidden'), 3500);
                }
            };

            const rawW = parseFloat(weightInput?.value);
            if (isNaN(rawW) || rawW < 30) {
                showToast('⚠️ Please enter a valid weight (minimum 30 kg / 66 lbs).', true);
                return;
            }

            const wKg = isLbs ? rawW / 2.20462 : rawW;
            const sVal = parseInt(stepsInput?.value, 10) || 0;
            const now = new Date();
            const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

            const newEntry = {
                id: Date.now().toString(),
                date: dateStr,
                weight: wKg,
                water: todayWater,
                steps: sVal,
                workout: workoutDone ? workoutDone.checked : false
            };

            const logs = getLogs();
            logs.push(newEntry);
            saveLogs(logs);

            if (weightInput) weightInput.value = '';
            if (stepsInput) stepsInput.value = '';

            renderLogsTable();
            renderMultiMetricGraph();
            renderDotMatrixGrid();
            showToast('✓ Telemetry logged and plotted!');
        });

        // Edit Baseline Button
        document.getElementById('btn-edit-baseline')?.addEventListener('click', () => {
            const currentVal = isLbs ? (baselineStartWeight * 2.20462).toFixed(1) : baselineStartWeight.toFixed(1);
            const input = prompt(`Enter starting baseline weight in ${isLbs ? 'lbs' : 'kg'}:`, currentVal);
            if (input !== null && !isNaN(parseFloat(input)) && parseFloat(input) > 30) {
                baselineStartWeight = isLbs ? parseFloat(input) / 2.20462 : parseFloat(input);
                userPrefs.userWeightKg = baselineStartWeight;

                try {
                    localStorage.setItem('mrmahesh_openfit_prefs', JSON.stringify(userPrefs));
                } catch (e) {}

                if (window.OpenFitData?.generateCustomSplit) {
                    window.OpenFitData.WORKOUT_SPLIT = window.OpenFitData.generateCustomSplit(userPrefs);
                }

                saveAppState();
                renderBaselineMetrics();
                renderActiveExercise();
                renderCalendarDayOverview();
                renderLogsTable();
                renderMultiMetricGraph();
            }
        });

        // Unit Switchers
        document.getElementById('btn-unit-kg')?.addEventListener('click', () => {
            isLbs = false;
            saveAppState();
            updateUnitUI();
        });

        document.getElementById('btn-unit-lbs')?.addEventListener('click', () => {
            isLbs = true;
            saveAppState();
            updateUnitUI();
        });

        window.addEventListener('resize', () => {
            if (!document.getElementById('tab-panel-log')?.classList.contains('hidden')) {
                renderMultiMetricGraph();
            }
        });

        // ── Auth Gate: wait for MrMaheshAuth to finish its async init ──
        function waitForAuth(callback) {
            if (window.MrMaheshAuth && window.MrMaheshAuth.isReady()) {
                callback();
            } else {
                setTimeout(() => waitForAuth(callback), 50);
            }
        }

        // Run immediate check for instant localStorage unlock token
        checkAccessGate();

        // Wait for Supabase / MrMaheshAuth to resolve session
        waitForAuth(() => {
            checkAccessGate();
            if (window.MrMaheshAuth) {
                window.MrMaheshAuth.onAuthStateChange(() => checkAccessGate());
            }
        });

        [50, 150, 300, 600, 1200, 2500].forEach(ms => setTimeout(checkAccessGate, ms));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }

})();
