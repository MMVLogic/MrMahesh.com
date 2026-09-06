// Onboarding & Setup Logic for OpenFit
let currentOnboardingStep = 1;

function showOnboardingOverlay() {
    document.getElementById('onboarding-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function nextOnboardingStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(el => el.classList.add('hidden'));
    document.getElementById('onboarding-step-' + step).classList.remove('hidden');
}

function prevOnboardingStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(el => el.classList.add('hidden'));
    document.getElementById('onboarding-step-' + step).classList.remove('hidden');
}

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

// BMI calculator
document.getElementById('btn-suggest-bmi')?.addEventListener('click', () => {
    const h = parseFloat(document.getElementById('ob-height').value);
    if (!h || h <= 0) {
        alert("Please enter a valid height first.");
        return;
    }
    const hMeters = h / 100;
    // Target BMI 24.9
    const targetWt = (24.9 * (hMeters * hMeters)).toFixed(1);
    document.getElementById('ob-target').value = targetWt;
});

// Setup goal buttons
document.querySelectorAll('.ob-goal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.ob-goal-btn').forEach(b => {
            b.classList.remove('border-yellow-500', 'bg-yellow-500/10');
            b.classList.add('border-gray-700');
        });
        const target = e.currentTarget;
        target.classList.remove('border-gray-700');
        target.classList.add('border-yellow-500', 'bg-yellow-500/10');
        target.dataset.selected = 'true';
        setTimeout(() => nextOnboardingStep(2), 250);
    });
});

async function finishOnboarding() {
    const selectedGoal = document.querySelector('.ob-goal-btn[data-selected="true"]')?.dataset.goal || 'fat_loss';
    const height = parseFloat(document.getElementById('ob-height').value) || 175;
    const currentWeight = parseFloat(document.getElementById('ob-weight').value) || 100;
    const targetWeight = parseFloat(document.getElementById('ob-target').value) || 75;
    
    const equipmentInputs = document.querySelectorAll('#ob-equipment-list input:checked');
    const equipment = Array.from(equipmentInputs).map(i => i.value);
    
    // Add defaults if they forgot
    equipment.push('bodyweight');

    nextOnboardingStep(5); // Loading screen

    // Animate progress bar
    const bar = document.getElementById('ob-progress-bar');
    setTimeout(() => { bar.style.width = '100%'; }, 100);

    // Generate regimen
    const generatedSplit = window.OpenFitData.generateCustomSplit({
        availableEquipment: equipment,
        userWeightKg: currentWeight
    });

    const profileData = {
        goal: selectedGoal,
        height_cm: height,
        current_weight_kg: currentWeight,
        target_weight_kg: targetWeight,
        equipment: equipment,
        regimen: generatedSplit,
        onboarding_completed: true
    };

    try {
        let user = window.MrMaheshAuth?.getUser();
        if (user && user.id) {
            // Check if profile exists
            const { data: existing } = await window.MrMaheshAuth.supabase
                .from('openfit_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();
                
            if (existing) {
                await window.MrMaheshAuth.supabase
                    .from('openfit_profiles')
                    .update(profileData)
                    .eq('user_id', user.id);
            } else {
                profileData.user_id = user.id;
                await window.MrMaheshAuth.supabase
                    .from('openfit_profiles')
                    .insert([profileData]);
            }
        } else {
            // Fallback to local storage if no user
            localStorage.setItem('openfit_profile', JSON.stringify(profileData));
        }
    } catch(err) {
        console.error("Failed to save profile remotely, storing locally.", err);
        localStorage.setItem('openfit_profile', JSON.stringify(profileData));
    }

    // Apply the split globally
    window.OpenFitData.WORKOUT_SPLIT = generatedSplit;
    
    // Also save as the active active custom split logic for the main app
    localStorage.setItem('mrmahesh_openfit_custom_split', JSON.stringify(generatedSplit));
    localStorage.setItem('mrmahesh_openfit_prefs', JSON.stringify({ availableEquipment: equipment, userWeightKg: currentWeight }));
    localStorage.setItem('openfit_onboarding_done', 'true');

    setTimeout(() => {
        document.getElementById('onboarding-overlay').classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Force refresh the app state
        if (window.switchTab) window.switchTab('plan'); // Show calendar tab
        if (window.renderCalendarDayOverview) window.renderCalendarDayOverview();
        if (window.renderActiveExercise) window.renderActiveExercise();
    }, 2200);
}

window.showOnboardingOverlay = showOnboardingOverlay;
window.nextOnboardingStep = nextOnboardingStep;
window.prevOnboardingStep = prevOnboardingStep;
window.finishOnboarding = finishOnboarding;

window.updateUserPassword = async function() {
    const pwd = document.getElementById('pwd-reset-new').value;
    const msgEl = document.getElementById('pwd-reset-msg');
    
    if (!pwd || pwd.length < 6) {
        msgEl.textContent = 'Password must be at least 6 characters.';
        msgEl.className = 'text-[10px] text-red-400';
        msgEl.classList.remove('hidden');
        return;
    }
    
    msgEl.textContent = 'Updating...';
    msgEl.className = 'text-[10px] text-gray-400';
    msgEl.classList.remove('hidden');
    
    if (window.MrMaheshAuth && window.MrMaheshAuth.supabase) {
        const { data, error } = await window.MrMaheshAuth.supabase.auth.updateUser({
            password: pwd
        });
        
        if (error) {
            msgEl.textContent = error.message;
            msgEl.className = 'text-[10px] text-red-400';
        } else {
            msgEl.textContent = 'Password updated successfully! Please log in again.';
            msgEl.className = 'text-[10px] text-green-400';
            setTimeout(() => {
                window.MrMaheshAuth.signOut();
                window.location.reload();
            }, 2000);
        }
    }
}
