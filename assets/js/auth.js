/**
 * MrMahesh Client-Side Authentication & Cloud Sync Engine
 * Integrates Supabase BaaS with local fallback storage.
 */

window.MrMaheshAuth = (() => {
    // Config: replace with your Supabase Project settings or pass via window.SUPABASE_CONFIG
    const config = window.SUPABASE_CONFIG || {
        url: 'https://placeholder-project.supabase.co',
        anonKey: 'placeholder-anon-key'
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

    // Initialize auth state
    async function init() {
        if (supabaseClient) {
            const { data: { session } } = await supabaseClient.auth.getSession();
            currentUser = session ? session.user : null;
            supabaseClient.auth.onAuthStateChange((event, session) => {
                currentUser = session ? session.user : null;
                notifyListeners();
                updateNavUI();
            });
        } else {
            currentUser = getLocalSession();
        }
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

        onAuthStateChange: (callback) => {
            authListeners.push(callback);
            callback(currentUser);
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
        tabSignIn?.classList.add('border-yellow-500', 'text-yellow-500');
        tabSignIn?.classList.remove('text-gray-400');
        tabSignUp?.classList.remove('border-yellow-500', 'text-yellow-500');
        tabSignUp?.classList.add('text-gray-400');
        formSignIn?.classList.remove('hidden');
        formSignUp?.classList.add('hidden');
    } else {
        tabSignUp?.classList.add('border-yellow-500', 'text-yellow-500');
        tabSignUp?.classList.remove('text-gray-400');
        tabSignIn?.classList.remove('border-yellow-500', 'text-yellow-500');
        tabSignIn?.classList.add('text-gray-400');
        formSignUp?.classList.remove('hidden');
        formSignIn?.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.MrMaheshAuth.init();
});
