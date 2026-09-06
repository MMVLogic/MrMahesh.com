import re

with open('assets/js/openfit/onboarding.js', 'r') as f:
    text = f.read()

replacement = """
// Global modal fns
let previousTab = 'plan'; // Store the active tab before opening settings

window.openBlueprintModal = function() {
    const activeBtn = document.querySelector('.tab-nav-btn.bg-yellow-500');
    if (activeBtn) {
        previousTab = activeBtn.id === 'tab-btn-workout' ? 'workout' : 'plan';
    }
    
    // Hide standard frame items
    document.getElementById('app-nav-tabs')?.classList.add('hidden');
    document.getElementById('tab-panel-workout')?.classList.add('hidden');
    document.getElementById('tab-panel-plan')?.classList.add('hidden');
    
    // Show settings panel inline
    document.getElementById('blueprint-panel')?.classList.remove('hidden');
}

window.closeBlueprintModal = function() {
    document.getElementById('blueprint-panel')?.classList.add('hidden');
    document.getElementById('app-nav-tabs')?.classList.remove('hidden');
    
    // Restore previous tab via global switchTab
    if (window.switchTab) {
        window.switchTab(previousTab);
    } else {
        document.getElementById(`tab-panel-${previousTab}`)?.classList.remove('hidden');
    }
}

window.confirmDataReset = async function() {
    const email = document.getElementById('reset-auth-email').value;
    const pwd = document.getElementById('reset-auth-password').value;
    const errorEl = document.getElementById('reset-auth-error');
    
    if (!email || !pwd) {
        errorEl.textContent = 'Please enter both email and password.';
        errorEl.classList.remove('hidden');
        return;
    }
    
    errorEl.classList.add('hidden');
    
    if (window.MrMaheshAuth && window.MrMaheshAuth.supabase) {
        try {
            const { data, error } = await window.MrMaheshAuth.supabase.auth.signInWithPassword({
                email: email,
                password: pwd
            });
            
            if (error) {
                errorEl.textContent = error.message;
                errorEl.classList.remove('hidden');
                return;
            }
            
            // If auth successful, update profile to reset onboarding
            if (data.user) {
                await window.MrMaheshAuth.supabase
                    .from('openfit_profiles')
                    .update({ 
                        onboarding_completed: false, 
                        regimen: {} 
                    })
                    .eq('user_id', data.user.id);
            }
        } catch(err) {
            console.error(err);
        }
    }
    
    // Clear all localStorage keys for OpenFit
    localStorage.removeItem('mrmahesh_openfit_v6');
    localStorage.removeItem('mrmahesh_openfit_logs');
    localStorage.removeItem('mrmahesh_openfit_custom_split');
    localStorage.removeItem('mrmahesh_openfit_prefs');
    localStorage.removeItem('mrmahesh_openfit_hide_guardrails');
    localStorage.removeItem('openfit_profile');
    localStorage.removeItem('openfit_onboarding_done');
    
    // Reload window to trigger onboarding again
    window.location.reload();
}
"""

text = re.sub(
    r'// Global modal fns.*?window\.closeBlueprintModal = function\(\) \{.*?\n\}', 
    replacement.strip(), 
    text, 
    flags=re.DOTALL
)

with open('assets/js/openfit/onboarding.js', 'w') as f:
    f.write(text)
