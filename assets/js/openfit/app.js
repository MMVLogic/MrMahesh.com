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
    let isLbs = false;
    let baselineStartWeight = 135.0; // kg
    let activeDay = 1;
    let activeExerciseIndex = 0;
    let todayWater = 0;
    let restTimerInterval = null;
    let restTimeRemaining = 90;
    let restTimerRunning = false;
    let completedSets = {};
    let userPrefs = {
        availableEquipment: ["machine", "cable", "dumbbell", "bench", "treadmill", "bike", "bodyweight"],
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
                if (s.todayWater !== undefined) todayWater = s.todayWater;
            }
        } catch (e) {}

        try {
            const rawPrefs = localStorage.getItem('mrmahesh_openfit_prefs');
            if (rawPrefs) {
                userPrefs = Object.assign(userPrefs, JSON.parse(rawPrefs));
            }
        } catch (e) {}

        if (window.OpenFitData?.generateCustomSplit) {
            userPrefs.userWeightKg = baselineStartWeight;
            window.OpenFitData.WORKOUT_SPLIT = window.OpenFitData.generateCustomSplit(userPrefs);
        }
    }

    function saveAppState() {
        try {
            localStorage.setItem('mrmahesh_openfit_v6', JSON.stringify({
                isLbs: isLbs,
                baselineStartWeight: baselineStartWeight,
                completedSets: completedSets,
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

        if (tabKey === 'log') {
            setTimeout(renderMultiMetricGraph, 50);
        }
    }

    // ── Active Exercise Renderer ─────────────────────────────────
    function renderActiveExercise() {
        const split = window.OpenFitData?.WORKOUT_SPLIT || {};
        const dayData = split[activeDay] || split[1];
        if (!dayData) return;

        const ex = dayData.exercises[activeExerciseIndex];
        if (!ex) return;

        const dayBadge = document.getElementById('active-day-badge');
        const stepper = document.getElementById('active-ex-stepper');
        const title = document.getElementById('active-ex-title');
        const volume = document.getElementById('active-ex-volume');
        const board = document.getElementById('led-board-container');
        const ticker1 = document.getElementById('ex-ticker-text-1');
        const ticker2 = document.getElementById('ex-ticker-text-2');

        if (dayBadge) dayBadge.textContent = `Day ${activeDay}`;
        if (stepper) stepper.textContent = `Exercise ${activeExerciseIndex + 1} of ${dayData.exercises.length}`;
        if (title) title.textContent = ex.name;
        if (volume) volume.textContent = ex.sets;

        if (ticker1) ticker1.textContent = `• HOW-TO: ${ex.cue.toUpperCase()} •`;
        if (ticker2) ticker2.textContent = `• HOW-TO: ${ex.cue.toUpperCase()} •`;

        if (board) {
            const models = window.OpenFitModels?.LED_MODELS || {};
            const svgTemplate = models[ex.model] || models.squat;
            if (svgTemplate) {
                // Dynamically sync exercise title inside LED banner
                const formattedSvg = svgTemplate.replace(
                    /• EXERCISE: [^•]+ •/,
                    `• EXERCISE: ${ex.name.toUpperCase()} •`
                );
                board.innerHTML = formattedSvg;
            }
        }

        renderSetPills(ex.totalSets);
    }

    // ── Interactive Set Pills ────────────────────────────────────
    function renderSetPills(total) {
        const container = document.getElementById('set-pills-container');
        if (!container) return;
        container.innerHTML = '';

        const setKey = `d${activeDay}_e${activeExerciseIndex}`;
        const doneCount = completedSets[setKey] || 0;

        for (let s = 1; s <= total; s++) {
            const isDone = s <= doneCount;
            const btn = document.createElement('button');
            btn.className = `min-h-[44px] py-2 px-3 rounded-xl font-bold font-mono text-xs transition-all border flex items-center justify-between active:scale-95 ${
                isDone
                    ? 'bg-green-500/20 border-green-500/80 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                    : 'bg-[#111827] border-gray-700 text-gray-400 hover:border-gray-600'
            }`;
            btn.innerHTML = `<span>Set ${s}</span><span>${isDone ? '✓' : '○'}</span>`;
            btn.addEventListener('click', () => toggleSet(s, total));
            container.appendChild(btn);
        }
    }

    function toggleSet(setNumber, total) {
        const setKey = `d${activeDay}_e${activeExerciseIndex}`;
        const current = completedSets[setKey] || 0;
        if (current >= setNumber) {
            completedSets[setKey] = setNumber - 1;
        } else {
            completedSets[setKey] = setNumber;
            triggerRestTimer(90);
        }
        saveAppState();
        renderSetPills(total);
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

        const padding = { top: 20, right: 25, bottom: 25, left: 35 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;

        // Draw grid lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (graphHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
        }

        const weights = logs.map(l => isLbs ? l.weight * 2.20462 : l.weight);
        const minW = Math.min(...weights) - 2;
        const maxW = Math.max(...weights) + 2;

        const points = logs.map((l, i) => {
            const x = padding.left + (graphWidth / Math.max(1, logs.length - 1)) * i;
            const w = isLbs ? l.weight * 2.20462 : l.weight;
            const y = padding.top + graphHeight - ((w - minW) / Math.max(1, maxW - minW)) * graphHeight;
            return { x, y, log: l };
        });

        // Draw Weight Line (Amber)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        points.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Draw Points & Workout Dots
        points.forEach(pt => {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
            ctx.fill();

            if (pt.log.workout) {
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(pt.x, padding.top + 5, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }

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

        const logs = getLogs();
        const loggedDates = new Set(logs.map(l => l.date));

        for (let d = 1; d <= 31; d++) {
            const dateStr = `08/${String(d).padStart(2, '0')}`;
            const isLogged = loggedDates.has(dateStr);
            const isToday = (d === 25);

            const dot = document.createElement('div');
            dot.className = `w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                isLogged
                    ? 'bg-green-500 text-gray-900 shadow-[0_0_6px_rgba(34,197,94,0.4)]'
                    : isToday
                    ? 'bg-yellow-500 text-gray-900 border border-yellow-300'
                    : 'bg-[#111827] text-gray-500 border border-gray-800'
            }`;
            dot.textContent = d;
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
                const id = e.target.dataset.id;
                saveLogs(getLogs().filter(l => l.id !== id));
                renderLogsTable();
                renderMultiMetricGraph();
                renderDotMatrixGrid();
            });
        });
    }

    // ── Blueprint Customization Controls ─────────────────────────
    function syncBlueprintUI() {
        const equipList = userPrefs.availableEquipment || [];
        const equipIds = ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'];
        equipIds.forEach(id => {
            const el = document.getElementById(`equip-${id}`);
            if (el) el.checked = equipList.includes(id);
        });
        const shieldEl = document.getElementById('pref-shield-joints');
        if (shieldEl) shieldEl.checked = userPrefs.shieldJoints !== false;
    }

    function initBlueprintControls() {
        syncBlueprintUI();

        const setEquip = (list) => {
            ['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight'].forEach(id => {
                const el = document.getElementById(`equip-${id}`);
                if (el) el.checked = list.includes(id);
            });
        };

        // Presets
        document.getElementById('preset-zero')?.addEventListener('click', () => {
            setEquip(['bodyweight']);
        });
        document.getElementById('preset-home')?.addEventListener('click', () => {
            setEquip(['dumbbell', 'bench', 'bodyweight']);
        });
        document.getElementById('preset-condo')?.addEventListener('click', () => {
            setEquip(['dumbbell', 'bench', 'cable', 'treadmill', 'bike', 'bodyweight']);
        });
        document.getElementById('preset-commercial')?.addEventListener('click', () => {
            setEquip(['machine', 'cable', 'dumbbell', 'bench', 'treadmill', 'bike', 'barbell', 'bodyweight']);
        });

        // Generate and Apply Button
        document.getElementById('btn-generate-workout')?.addEventListener('click', () => {
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

            const shieldEl = document.getElementById('pref-shield-joints');
            userPrefs.availableEquipment = selected;
            userPrefs.shieldJoints = shieldEl ? shieldEl.checked : true;
            userPrefs.userWeightKg = baselineStartWeight;

            try {
                localStorage.setItem('mrmahesh_openfit_prefs', JSON.stringify(userPrefs));
            } catch (e) {}

            if (window.OpenFitData?.generateCustomSplit) {
                window.OpenFitData.WORKOUT_SPLIT = window.OpenFitData.generateCustomSplit(userPrefs);
            }

            activeExerciseIndex = 0;
            renderActiveExercise();

            // Refresh Calendar Tab Display
            const split = window.OpenFitData?.WORKOUT_SPLIT || {};
            const dData = split[activeDay] || split[1];
            if (dData) {
                const tag = document.getElementById('plan-day-tag');
                const count = document.getElementById('plan-day-ex-count');
                const title = document.getElementById('plan-day-title');
                if (tag) tag.textContent = dData.shortTag;
                if (count) count.textContent = `${dData.exercises.length} Exercises`;
                if (title) title.textContent = dData.title;
            }

            // Show Toast Notification
            const toast = document.getElementById('blueprint-status-toast');
            if (toast) {
                toast.textContent = `✓ Protocol calibrated! Active routine updated with ${selected.length} equipment types.`;
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 4000);
            }
        });
    }

    // ── DOM Initialization Runner ────────────────────────────────
    function startApp() {
        initTabElements();
        loadAppState();
        updateUnitUI();
        updateWaterDisplay();
        initBlueprintControls();
        renderActiveExercise();
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
                const split = window.OpenFitData?.WORKOUT_SPLIT || {};
                const dData = split[d] || split[1];
                if (dData) {
                    const tag = document.getElementById('plan-day-tag');
                    const count = document.getElementById('plan-day-ex-count');
                    const title = document.getElementById('plan-day-title');
                    if (tag) tag.textContent = dData.shortTag;
                    if (count) count.textContent = `${dData.exercises.length} Exercises`;
                    if (title) title.textContent = dData.title;
                }
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

            const rawW = parseFloat(weightInput?.value);
            if (isNaN(rawW) || rawW < 30) {
                alert('Please enter a valid weight.');
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
            alert('✓ Telemetry logged and plotted!');
        });

        // Edit Baseline Button
        document.getElementById('btn-edit-baseline')?.addEventListener('click', () => {
            const currentVal = isLbs ? (baselineStartWeight * 2.20462).toFixed(1) : baselineStartWeight.toFixed(1);
            const input = prompt(`Enter starting baseline weight in ${isLbs ? 'lbs' : 'kg'}:`, currentVal);
            if (input !== null && !isNaN(parseFloat(input)) && parseFloat(input) > 30) {
                baselineStartWeight = isLbs ? parseFloat(input) / 2.20462 : parseFloat(input);
                saveAppState();
                renderBaselineMetrics();
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
