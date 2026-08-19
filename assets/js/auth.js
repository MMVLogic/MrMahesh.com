/**
 * MrMahesh Client-Side Authentication & Cloud Sync Engine
 * Integrates Supabase BaaS with local fallback storage.
 */

window.MrMaheshAuth = (() => {
    // Config: Supabase Project settings
    const config = window.SUPABASE_CONFIG || {
        url: 'https://xigxtoxxeyiokmalyydx.supabase.co',
        anonKey: 'sb_publishable_bDz4w-zYq29J7tXaX3T0IA_DASPlkTr'
    };

    let supabaseClient = null;
    let currentUser = null;
    const authListeners = [];

    // Initialize Supabase if available
    const isLiveSupabase = config.url && !config.url.includes('placeholder') && window.supabase;
    if (isLiveSupabase) {
        try {
            supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        } catch (e) {
            console.warn('Supabase initialization failed, falling back to local auth mode:', e.message);
        }
    }

    // Local Storage Mock Session (For offline / demo mode)
    const LOCAL_SESSION_KEY = 'mrmahesh_user_session';
    const LOCAL_DB_PREFIX = 'mrmahesh_cloud_';

    function getLocalSession() {
        try {
            const raw = localStorage.getItem(LOCAL_SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function setLocalSession(user) {
        if (user) {
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(LOCAL_SESSION_KEY);
        }
    }

    let authReady = false;

    // Initialize auth state
    async function init() {
        if (authReady) return;
        if (supabaseClient) {
            supabaseClient.auth.onAuthStateChange((event, session) => {
                const prevId = currentUser?.id;
                currentUser = session ? session.user : null;
                updateNavUI();
                // Only notify if user state actually changed after initial load
                if (authReady && prevId !== currentUser?.id) {
                    notifyListeners();
                }
            });
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                currentUser = session ? session.user : null;
            } catch (e) {
                console.warn('Failed to retrieve Supabase session:', e);
                currentUser = null;
            }
        } else {
            currentUser = getLocalSession();
        }
        authReady = true;
        notifyListeners();
        updateNavUI();
    }

    function notifyListeners() {
        authListeners.forEach(cb => {
            try { cb(currentUser); } catch (e) { console.error('Auth listener error:', e); }
        });
    }

    function updateNavUI() {
        const authBtn = document.getElementById('nav-auth-btn');
        const authUserLabel = document.getElementById('nav-auth-user');
        if (!authBtn) return;

        if (currentUser) {
            const displayName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member';
            authBtn.innerHTML = `<span class="text-green-400 font-bold">🟢 ${displayName}</span>`;
            authBtn.classList.remove('border-yellow-500', 'text-yellow-500');
            authBtn.classList.add('border-green-500', 'bg-gray-900');
            if (authUserLabel) authUserLabel.textContent = displayName;
        } else {
            authBtn.innerHTML = `<span class="font-bold">👤 Login</span>`;
            authBtn.classList.add('border-yellow-500', 'text-yellow-500');
            authBtn.classList.remove('border-green-500', 'bg-gray-900');
            if (authUserLabel) authUserLabel.textContent = 'Guest';
        }
    }

    return {
        init,
        getUser: () => currentUser,
        isLoggedIn: () => !!currentUser,
        isReady: () => authReady,

        onAuthStateChange: (callback) => {
            authListeners.push(callback);
            if (authReady) {
                try { callback(currentUser); } catch(e) {}
            }
        },

        async signUp(email, password, fullName) {
            if (supabaseClient) {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (error) throw error;
                currentUser = data.user;
                updateNavUI();
                notifyListeners();
                return data;
            } else {
                // Local mock signup
                currentUser = {
                    id: 'usr_' + Math.random().toString(36).substring(2, 9),
                    email,
                    user_metadata: { full_name: fullName || email.split('@')[0] },
                    created_at: new Date().toISOString()
                };
                setLocalSession(currentUser);
                updateNavUI();
                notifyListeners();
                return { user: currentUser };
            }
        },

        async signIn(email, password) {
            if (supabaseClient) {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;
                currentUser = data.user;
                updateNavUI();
                notifyListeners();
                return data;
            } else {
                // Local mock signin
                currentUser = {
                    id: 'usr_local_' + btoa(email).substring(0, 8),
                    email,
                    user_metadata: { full_name: email.split('@')[0] }
                };
                setLocalSession(currentUser);
                updateNavUI();
                notifyListeners();
                return { user: currentUser };
            }
        },

        async signOut() {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            } else {
                setLocalSession(null);
            }
            currentUser = null;
            updateNavUI();
            notifyListeners();
        },

        // Cloud Data Synchronization Helper for Apps
        async syncData(tableName, recordKey, payload) {
            if (!currentUser) {
                // Save locally if guest
                localStorage.setItem(`guest_${tableName}_${recordKey}`, JSON.stringify(payload));
                return { mode: 'guest-local', success: true };
            }

            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from(tableName)
                    .upsert({
                        user_id: currentUser.id,
                        record_key: recordKey,
                        payload: payload,
                        updated_at: new Date().toISOString()
                    });
                if (error) throw error;
                return { mode: 'cloud-supabase', success: true, data };
            } else {
                // Mock cloud storage in user space
                const userKey = `${LOCAL_DB_PREFIX}${currentUser.id}_${tableName}_${recordKey}`;
                localStorage.setItem(userKey, JSON.stringify({
                    payload,
                    updated_at: new Date().toISOString()
                }));
                return { mode: 'mock-cloud', success: true };
            }
        },

        async loadData(tableName, recordKey) {
            if (!currentUser) {
                const raw = localStorage.getItem(`guest_${tableName}_${recordKey}`);
                return raw ? JSON.parse(raw) : null;
            }

            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from(tableName)
                    .select('payload')
                    .eq('user_id', currentUser.id)
                    .eq('record_key', recordKey)
                    .single();
                if (error && error.code !== 'PGRST116') throw error;
                return data ? data.payload : null;
            } else {
                const userKey = `${LOCAL_DB_PREFIX}${currentUser.id}_${tableName}_${recordKey}`;
                const raw = localStorage.getItem(userKey);
                return raw ? JSON.parse(raw).payload : null;
            }
        },

        // ── Timesheet Entries: append-only history log ──────────────────────

        /**
         * Save a new timesheet entry to timesheet_entries table (or localStorage fallback).
         * @param {Object} dateContext  - { year, week, day, label, resolvedDate }
         * @param {Array}  shiftSlots  - [{ startHr, startMin, startAmpm, endHr, endMin, endAmpm }]
         * @param {Array}  breaks      - [{ type, name, duration }]
         * @param {number} totalPaidMinutes - pre-computed net minutes
         */
        async saveTimesheetEntry(dateContext, shiftSlots, breaks, totalPaidMinutes) {
            const entry = {
                ctx_year:            dateContext.year  !== undefined ? dateContext.year  : null,
                ctx_week:            dateContext.week  !== undefined ? dateContext.week  : null,
                ctx_day:             dateContext.day   !== undefined ? dateContext.day   : null,
                ctx_date:            dateContext.resolvedDate || null,
                ctx_label:           dateContext.label || 'Untagged',
                shift_slots:         shiftSlots || [],
                breaks:              breaks     || [],
                total_paid_minutes:  totalPaidMinutes  || 0,
                updated_at:          new Date().toISOString()
            };

            if (supabaseClient && currentUser) {
                const { data, error } = await supabaseClient
                    .from('timesheet_entries')
                    .insert({ user_id: currentUser.id, ...entry });
                if (error) throw error;
                return { mode: 'cloud-supabase', success: true, data };
            } else {
                const userId = currentUser ? currentUser.id : 'guest';
                const key = `mrmahesh_timesheet_entries_${userId}`;
                const all = JSON.parse(localStorage.getItem(key) || '[]');
                const newEntry = {
                    id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                    user_id: userId,
                    ...entry,
                    created_at: new Date().toISOString()
                };
                all.unshift(newEntry);
                localStorage.setItem(key, JSON.stringify(all));
                return { mode: currentUser ? 'mock-cloud' : 'guest-local', success: true, data: newEntry };
            }
        },

        /**
         * Query timesheet_entries matching a date context. NULL fields match stored NULL rows.
         * @param {Object} dateContext - { year, week, day }
         * @returns {Array} records sorted newest-first
         */
        async queryTimesheetEntries(dateContext) {
            const yIsNull = dateContext.year  === null || dateContext.year  === undefined;
            const wIsNull = dateContext.week  === null || dateContext.week  === undefined;
            const dIsNull = dateContext.day   === null || dateContext.day   === undefined;

            if (supabaseClient && currentUser) {
                let q = supabaseClient
                    .from('timesheet_entries')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false });

                q = yIsNull ? q.is('ctx_year', null) : q.eq('ctx_year', dateContext.year);
                q = wIsNull ? q.is('ctx_week', null) : q.eq('ctx_week', dateContext.week);
                q = dIsNull ? q.is('ctx_day',  null) : q.eq('ctx_day',  dateContext.day);

                const { data, error } = await q;
                if (error) throw error;
                return data || [];
            } else {
                const userId = currentUser ? currentUser.id : 'guest';
                const key = `mrmahesh_timesheet_entries_${userId}`;
                const all = JSON.parse(localStorage.getItem(key) || '[]');
                return all.filter(e => {
                    const yOk = yIsNull ? (e.ctx_year == null) : (e.ctx_year === dateContext.year);
                    const wOk = wIsNull ? (e.ctx_week == null) : (e.ctx_week === dateContext.week);
                    const dOk = dIsNull ? (e.ctx_day  == null) : (e.ctx_day  === dateContext.day);
                    return yOk && wOk && dOk;
                });
            }
        },

        /**
         * Delete a single timesheet entry by id.
         * @param {string} id - UUID or local id string
         */
        async deleteTimesheetEntry(id) {
            if (supabaseClient && currentUser) {
                const { error } = await supabaseClient
                    .from('timesheet_entries')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', currentUser.id);
                if (error) throw error;
                return { success: true };
            } else {
                const userId = currentUser ? currentUser.id : 'guest';
                const key = `mrmahesh_timesheet_entries_${userId}`;
                const all = JSON.parse(localStorage.getItem(key) || '[]');
                localStorage.setItem(key, JSON.stringify(all.filter(e => e.id !== id)));
                return { success: true };
            }
        }
    };
})();

// Global Modal Helpers
function openAuthModal(tab = 'signin') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function switchAuthTab(tab) {
    const tabSignIn = document.getElementById('auth-tab-signin');
    const tabSignUp = document.getElementById('auth-tab-signup');
    const formSignIn = document.getElementById('auth-form-signin');
    const formSignUp = document.getElementById('auth-form-signup');
    const authFeedback = document.getElementById('auth-feedback');
    if (authFeedback) authFeedback.classList.add('hidden');

    if (tab === 'signin') {
        if (tabSignIn) {
            tabSignIn.className = 'flex-1 pb-2 border-b-2 border-yellow-500 text-yellow-500 font-bold focus:outline-none text-center transition-all';
        }
        if (tabSignUp) {
            tabSignUp.className = 'flex-1 pb-2 border-b-2 border-transparent text-gray-400 hover:text-gray-200 font-bold focus:outline-none text-center transition-all';
        }
        formSignIn?.classList.remove('hidden');
        formSignUp?.classList.add('hidden');
    } else {
        if (tabSignUp) {
            tabSignUp.className = 'flex-1 pb-2 border-b-2 border-yellow-500 text-yellow-500 font-bold focus:outline-none text-center transition-all';
        }
        if (tabSignIn) {
            tabSignIn.className = 'flex-1 pb-2 border-b-2 border-transparent text-gray-400 hover:text-gray-200 font-bold focus:outline-none text-center transition-all';
        }
        formSignUp?.classList.remove('hidden');
        formSignIn?.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.MrMaheshAuth.init();
});
