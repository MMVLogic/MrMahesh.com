/**
 * OpenFit Protocol — Exercise Database & 7-Day Training Split
 */

(function() {
    'use strict';

    const WORKOUT_SPLIT = {
        1: {
            title: "Upper Body Strength & Cardio Finisher",
            shortTag: "Day 1 • Upper + Cardio",
            exercises: [
                { name: "Dumbbell / Cable Chest Press", sets: "3 sets × 10–12 reps", totalSets: 3, model: "press", cue: "Retract shoulder blades flat against bench. Press dumbbells straight up over mid-chest. Lower smoothly with elbows at 45-degree angle." },
                { name: "Lat Pulldown or Cable Seated Row", sets: "3 sets × 12 reps", totalSets: 3, model: "pull", cue: "Grip wide bar with thumbs over. Pull elbows down and back toward your hips. Squeeze back muscles firmly at clavicle level." },
                { name: "Dumbbell Overhead / Incline Press", sets: "3 sets × 10–12 reps", totalSets: 3, model: "press", cue: "Start dumbbells at shoulder level. Press straight overhead until arms lock out. Keep ribs pulled down and glutes tight." },
                { name: "Dumbbell Bicep Curls (Superset)", sets: "3 sets × 12–15 reps", totalSets: 3, model: "curl", cue: "Pin elbows tight against ribs. Curl up toward shoulders. Squeeze biceps for 1 second at top. Full controlled extension down." },
                { name: "Tricep Rope Pushdowns (Superset)", sets: "3 sets × 12–15 reps", totalSets: 3, model: "pull", cue: "Hinge forward slightly. Drive rope straight down and flare ends apart at full lockout. Keep elbows stationary." },
                { name: "Incline Treadmill Walk (Cardio)", sets: "15–20 mins @ 3.5–4.5 km/h", totalSets: 1, model: "walk", cue: "Set incline to 3–6%. Walk briskly with upright chest. Zero joint impact. Maintain steady nasal breathing." }
            ]
        },
        2: {
            title: "Lower Body & Core Focus",
            shortTag: "Day 2 • Lower & Core",
            exercises: [
                { name: "Goblet Box Squats to Bench", sets: "3 sets × 10–12 reps", totalSets: 3, model: "squat", cue: "Hold dumbbell tight against chest. Push hips back and descend until touching the box bench. Keep knees wide over toes." },
                { name: "Dumbbell Romanian Deadlifts (RDLs)", sets: "3 sets × 10–12 reps", totalSets: 3, model: "rdl", cue: "Soft knee bend with hip-width feet. Push hips back while sliding dumbbells down shins. Squeeze glutes to stand tall." },
                { name: "Seated / Standing Calf Raises", sets: "3 sets × 15 reps", totalSets: 3, model: "squat", cue: "Lower heels below step for full calf stretch. Press through balls of feet to maximum peak contraction. Hold 1 sec." },
                { name: "Leg Extensions or Machine Curls", sets: "3 sets × 12 reps", totalSets: 3, model: "squat", cue: "Adjust pad against ankles. Extend legs smoothly. 2-second controlled lowering cadence." },
                { name: "Plank Holds (or Pallof Press)", sets: "3 sets × 20–40s", totalSets: 3, model: "pull", cue: "Brace abdominal wall like preparing for a punch. Keep neutral spine without lower back sagging." },
                { name: "Stationary Bike (Cardio Finisher)", sets: "15 mins @ Moderate Pace", totalSets: 1, model: "walk", cue: "Maintain smooth 75–85 RPM cadence. Zero knee torque or high pounding." }
            ]
        },
        3: {
            title: "Active Recovery & Joint Mobility",
            shortTag: "Day 3 • Active Recovery",
            exercises: [
                { name: "Outdoor Brisk Walk or Elliptical", sets: "30–45 mins continuous", totalSets: 1, model: "walk", cue: "Gentle aerobic blood flow without joint strain. Relax shoulders and maintain conversational pace." },
                { name: "Cat-Cow & Spine Rotations", sets: "3 sets × 10 cycles", totalSets: 3, model: "rdl", cue: "Inhale arching spine upward, exhale tucking chin and pelvis. Gentle spinal mobilization." },
                { name: "Standing Hamstring & Quad Stretch", sets: "3 sets × 30s / leg", totalSets: 3, model: "pull", cue: "Gentle static stretch. Hold steady without bouncing. Breathe deeply into tight tissues." }
            ]
        },
        4: {
            title: "Full Body Push / Pull Strength",
            shortTag: "Day 4 • Push / Pull",
            exercises: [
                { name: "Cable Standing Rows", sets: "3 sets × 12 reps", totalSets: 3, model: "pull", cue: "Stand athletic with knees soft. Pull handles toward belly button driving elbows back. Squeeze shoulder blades." },
                { name: "Dumbbell Incline Bench Press", sets: "3 sets × 10–12 reps", totalSets: 3, model: "press", cue: "Set bench at 30-degree incline. Press dumbbells in gentle upward arc. Lower with 2-second controlled tempo." },
                { name: "Dumbbell Lateral Raises (Shoulders)", sets: "3 sets × 15 reps", totalSets: 3, model: "curl", cue: "Slight forward torso lean. Raise dumbbells outward leading with elbows until parallel with floor. No body swinging." },
                { name: "Dumbbell Hammer Curls", sets: "3 sets × 12 reps", totalSets: 3, model: "curl", cue: "Keep neutral palms-facing grip. Curl up towards shoulders focusing on forearm and brachialis contraction." },
                { name: "Overhead Dumbbell Tricep Extension", sets: "3 sets × 12 reps", totalSets: 3, model: "press", cue: "Hold single dumbbell overhead with both hands. Lower behind head bending elbows. Press to full extension." },
                { name: "Elliptical Cardio Finisher", sets: "20 mins @ Moderate", totalSets: 1, model: "walk", cue: "Zero-impact cardiovascular conditioning. Maintain steady heart rate between 110–130 BPM." }
            ]
        },
        5: {
            title: "Lower Body & Cardio Focus",
            shortTag: "Day 5 • Lower & Cardio",
            exercises: [
                { name: "Dumbbell Step-Ups (Low Height)", sets: "3 sets × 10 reps / leg", totalSets: 3, model: "squat", cue: "Drive through whole foot on low stable bench." },
                { name: "Glute Bridges (Mat Workout)", sets: "3 sets × 15 reps", totalSets: 3, model: "rdl", cue: "Squeeze glutes hard at the top." },
                { name: "Dumbbell Hamstring Curl", sets: "3 sets × 12 reps", totalSets: 3, model: "rdl", cue: "Controlled tempo." },
                { name: "Incline Treadmill Walk (Cardio)", sets: "25–30 mins @ 3.8–4.5 km/h", totalSets: 1, model: "walk", cue: "High calorie burn without knee impact." }
            ]
        },
        6: {
            title: "Light Walk & Mobility",
            shortTag: "Day 6 • Light Walk",
            exercises: [
                { name: "Leisure Outdoor Walk / Park Stroll", sets: "30–40 mins", totalSets: 1, model: "walk", cue: "Hit daily 7,000–10,000 step milestone." },
                { name: "Full Body Mobility on Mat", sets: "15 mins", totalSets: 2, model: "rdl", cue: "Focus on tight hip flexors and lower back." }
            ]
        },
        7: {
            title: "Complete Rest & Meal Prep",
            shortTag: "Day 7 • Rest & Prep",
            exercises: [
                { name: "Full Physical Rest & Recovery", sets: "All Day", totalSets: 1, model: "walk", cue: "Allow connective tissues to adapt and rebuild." },
                { name: "Hydration Target (3.5 Liters)", sets: "Throughout day", totalSets: 1, model: "walk", cue: "Clean water and electrolyte balance." },
                { name: "High-Protein Meal Prep", sets: "1–2 Hours", totalSets: 1, model: "press", cue: "Prep lean proteins for 1.6–2.0g/kg target." }
            ]
        }
    };

    window.OpenFitData = {
        WORKOUT_SPLIT: WORKOUT_SPLIT
    };

})();
