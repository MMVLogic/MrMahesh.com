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
window.openBlueprintModal = function() {
    document.getElementById('blueprint-modal').classList.remove('hidden');
}

window.closeBlueprintModal = function() {
    document.getElementById('blueprint-modal').classList.add('hidden');
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
