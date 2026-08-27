/**
 * OpenFit Protocol — Tabulated Master Exercise Database & Dynamic Generator
 * Covers 0 machines (bodyweight home/travel) to full commercial gym (Crunch/GoodLife/Movati)
 */

(function() {
    'use strict';

    /**
     * MASTER TABULATED EXERCISE CATALOG
     * Joint Impact Score (JIS): 
     * 1 = Zero Impact / Cartilage-Safe (Safe for 135kg+ / any weight)
     * 2 = Low Impact / Controlled Load
     * 3 = Moderate Impact / Unstabilized Joint Angle (Caution for 110kg+)
     * 4 = High Shearing Forces (Restricted for 100kg+)
     * 5 = Ballistic / High Impact (Contraindicated for 90kg+)
     */
    const EXERCISE_CATALOG = [
        // ── 1. KNEE-DOMINANT SQUAT PATTERN ────────────────────────────────────────
        {
            id: "squat_db_box",
            name: "Goblet Box Squat to Bench",
            pattern: "knee_squat",
            category: "lower",
            primaryMuscles: ["quads", "glutes"],
            secondaryMuscles: ["core"],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "squat",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Hold dumbbell tight against sternum. Push hips back and descend to the box bench. Keep knees tracking wide over toes."
        },
        {
            id: "squat_machine_leg_press",
            name: "Pin-Loaded Leg Press Machine",
            pattern: "knee_squat",
            category: "lower",
            primaryMuscles: ["quads", "glutes"],
            secondaryMuscles: ["hamstrings"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "squat",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Feet shoulder-width on platform. Lower sled under control until knees reach 90 degrees. Never let lower back round off pad."
        },
        {
            id: "squat_cable_low",
            name: "Cable Squat with Low Pulley",
            pattern: "knee_squat",
            category: "lower",
            primaryMuscles: ["quads", "glutes"],
            secondaryMuscles: ["core"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "squat",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Hold rope attachment at chest height. Cable creates backward counter-balance allowing vertical upright torso and zero knee stress."
        },
        {
            id: "squat_bw_chair",
            name: "Bodyweight Chair / Box Sit-to-Stand",
            pattern: "knee_squat",
            category: "lower",
            primaryMuscles: ["quads", "glutes"],
            secondaryMuscles: ["core"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "squat",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Extend arms forward for balance. Sit back onto chair until glutes gently touch. Drive firmly through mid-foot and heels to stand."
        },
        {
            id: "squat_barbell_box",
            name: "Barbell Box Squat",
            pattern: "knee_squat",
            category: "lower",
            primaryMuscles: ["quads", "glutes"],
            secondaryMuscles: ["hamstrings", "erectors"],
            equipment: ["barbell", "bench"],
            jointImpact: 2,
            expertLevel: 2,
            maxUserWeightKg: 140,
            model: "squat",
            sets: "3 sets × 8–10 reps",
            totalSets: 3,
            cue: "Rest bar across upper traps. Sit back onto box bench to halt downward momentum before driving upwards."
        },

        // ── 2. HORIZONTAL PUSH PATTERN ───────────────────────────────────────────
        {
            id: "push_h_machine_chest",
            name: "Seated Chest Press Machine",
            pattern: "horizontal_push",
            category: "push",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["front_delts", "triceps"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Set handles at mid-chest height. Retract shoulder blades flat against pad. Press smoothly without locking elbows."
        },
        {
            id: "push_h_cable_press",
            name: "Standing Cable Chest Press",
            pattern: "horizontal_push",
            category: "push",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["core", "triceps"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Stagger your stance for balance. Press handles forward in a gentle converging arc. Keep abdominal wall braced."
        },
        {
            id: "push_h_db_bench",
            name: "Dumbbell Flat / Incline Bench Press",
            pattern: "horizontal_push",
            category: "push",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["triceps", "front_delts"],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Keep elbows at a 45-degree angle to protect shoulder joints. Press dumbbells up until hovering over chest."
        },
        {
            id: "push_h_db_floor",
            name: "Dumbbell Floor Press",
            pattern: "horizontal_push",
            category: "push",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["triceps"],
            equipment: ["dumbbell"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Lie on floor with knees bent. Lower until upper arms tap floor gently, eliminating shoulder hyper-extension."
        },
        {
            id: "push_h_bw_incline",
            name: "Incline Counter / Wall Push-Up",
            pattern: "horizontal_push",
            category: "push",
            primaryMuscles: ["chest"],
            secondaryMuscles: ["triceps", "core"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "press",
            sets: "3 sets × 10–15 reps",
            totalSets: 3,
            cue: "Place hands on sturdy countertop or wall. Keep straight line from heels to crown. Lower chest with elbows tucked."
        },

        // ── 3. VERTICAL PULL PATTERN ─────────────────────────────────────────────
        {
            id: "pull_v_lat_pulldown",
            name: "Wide Lat Pulldown Machine",
            pattern: "vertical_pull",
            category: "pull",
            primaryMuscles: ["lats", "upper_back"],
            secondaryMuscles: ["biceps"],
            equipment: ["machine", "cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Thighs locked under pad. Pull bar down toward upper collarbone leading with elbows. Control the weight on the way up."
        },
        {
            id: "pull_v_cable_kneeling",
            name: "Dual Cable High Pulldown",
            pattern: "vertical_pull",
            category: "pull",
            primaryMuscles: ["lats"],
            secondaryMuscles: ["biceps"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Kneel or sit between dual cable pulleys. Pull handles down and out, following the natural angle of the lats."
        },
        {
            id: "pull_v_db_pullover",
            name: "Dumbbell Bench Pullover",
            pattern: "vertical_pull",
            category: "pull",
            primaryMuscles: ["lats"],
            secondaryMuscles: ["chest", "triceps"],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Lie flat on bench holding dumbbell over chest. Lower dumbbell in an arc over your head feeling lats stretch. Pull back up."
        },
        {
            id: "pull_v_bw_doorway",
            name: "Doorframe Isometric Lat Row",
            pattern: "vertical_pull",
            category: "pull",
            primaryMuscles: ["lats", "rhomboids"],
            secondaryMuscles: ["biceps"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 30s holds",
            totalSets: 3,
            cue: "Grip sturdy doorframe at chest level. Lean back and pull chest to frame, engaging upper back isometrically."
        },

        // ── 4. HORIZONTAL PULL PATTERN ───────────────────────────────────────────
        {
            id: "pull_h_cable_row",
            name: "Seated Cable Row (Neutral Grip)",
            pattern: "horizontal_pull",
            category: "pull",
            primaryMuscles: ["rhomboids", "lats"],
            secondaryMuscles: ["biceps", "rear_delts"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Sit tall with chest proud. Pull V-bar attachment to navel. Squeeze shoulder blades together for 1 second."
        },
        {
            id: "pull_h_machine_row",
            name: "Chest-Supported Machine Row",
            pattern: "horizontal_pull",
            category: "pull",
            primaryMuscles: ["upper_back", "lats"],
            secondaryMuscles: ["biceps"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Chest pressed against pad, taking 100% of shear off your lumbar spine. Drive elbows backward."
        },
        {
            id: "pull_h_db_incline_row",
            name: "Chest-Supported Dumbbell Row",
            pattern: "horizontal_pull",
            category: "pull",
            primaryMuscles: ["rhomboids", "rear_delts"],
            secondaryMuscles: ["biceps"],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Lie face down on 30-degree incline bench. Row dumbbells up, pinching back muscles with zero lower back strain."
        },
        {
            id: "pull_h_db_one_arm_row",
            name: "Single-Arm Dumbbell Row",
            pattern: "horizontal_pull",
            category: "pull",
            primaryMuscles: ["lats"],
            secondaryMuscles: ["biceps"],
            equipment: ["dumbbell"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 10 reps / arm",
            totalSets: 3,
            cue: "Support non-working hand on a table or bench. Pull dumbbell to hip pocket keeping spine flat and neutral."
        },
        {
            id: "pull_h_bw_cobra",
            name: "Prone Floor Cobra (Y-T-W Raises)",
            pattern: "horizontal_pull",
            category: "pull",
            primaryMuscles: ["rear_delts", "mid_traps"],
            secondaryMuscles: ["lower_back"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 15 reps",
            totalSets: 3,
            cue: "Lie on mat face down. Lift chest 2 inches and rotate thumbs to ceiling. Squeeze shoulder blades hard."
        },

        // ── 5. VERTICAL PUSH PATTERN ─────────────────────────────────────────────
        {
            id: "push_v_machine_overhead",
            name: "Seated Overhead Shoulder Press Machine",
            pattern: "vertical_push",
            category: "push",
            primaryMuscles: ["shoulders"],
            secondaryMuscles: ["triceps", "upper_chest"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Back firmly supported against pad. Press upward along the fixed machine track. Avoid arching lower back."
        },
        {
            id: "push_v_cable_press",
            name: "Standing Cable Shoulder Press",
            pattern: "vertical_push",
            category: "push",
            primaryMuscles: ["shoulders"],
            secondaryMuscles: ["core", "triceps"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Pulleys set low. Press handles smoothly overhead with a braced core, keeping constant accommodating cable tension."
        },
        {
            id: "push_v_db_seated",
            name: "Seated Dumbbell Shoulder Press",
            pattern: "vertical_push",
            category: "push",
            primaryMuscles: ["shoulders"],
            secondaryMuscles: ["triceps"],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Sit on high-back bench. Start dumbbells at ear height with palms forward. Press up until overhead."
        },
        {
            id: "push_v_db_standing",
            name: "Standing Dumbbell Neutral Press",
            pattern: "vertical_push",
            category: "push",
            primaryMuscles: ["shoulders"],
            secondaryMuscles: ["core"],
            equipment: ["dumbbell"],
            jointImpact: 2,
            expertLevel: 1,
            maxUserWeightKg: 150,
            model: "press",
            sets: "3 sets × 10 reps",
            totalSets: 3,
            cue: "Palms facing inwards (neutral grip) to keep shoulder capsule open. Press upward under strict control."
        },
        {
            id: "push_v_bw_wall_slides",
            name: "Wall Overhead Arm Slides",
            pattern: "vertical_push",
            category: "push",
            primaryMuscles: ["shoulders", "serratus"],
            secondaryMuscles: ["upper_back"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "press",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Back against wall. Slide forearms up wall in a 'W to Y' pattern without letting lower back pull away from wall."
        },

        // ── 6. HIP HINGE PATTERN ─────────────────────────────────────────────────
        {
            id: "hinge_db_rdl",
            name: "Dumbbell Romanian Deadlift (RDL)",
            pattern: "hip_hinge",
            category: "lower",
            primaryMuscles: ["hamstrings", "glutes"],
            secondaryMuscles: ["erectors"],
            equipment: ["dumbbell"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "rdl",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Soft knees. Push hips straight back as if touching a wall behind you. Slide dumbbells down to mid-shin level."
        },
        {
            id: "hinge_machine_leg_curl",
            name: "Seated / Lying Hamstring Curl Machine",
            pattern: "hip_hinge",
            category: "lower",
            primaryMuscles: ["hamstrings"],
            secondaryMuscles: ["calves"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "rdl",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Pad adjusted against Achilles tendon. Curl legs smoothly under control. 2-second eccentric lowering."
        },
        {
            id: "hinge_cable_pullthrough",
            name: "Cable Rope Pull-Through",
            pattern: "hip_hinge",
            category: "lower",
            primaryMuscles: ["glutes", "hamstrings"],
            secondaryMuscles: ["core"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "rdl",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Face away from low pulley with rope between legs. Hinge at hips backwards, then snap hips forward squeezing glutes."
        },
        {
            id: "hinge_bw_glute_bridge",
            name: "Floor / Mat Glute Bridge",
            pattern: "hip_hinge",
            category: "lower",
            primaryMuscles: ["glutes"],
            secondaryMuscles: ["hamstrings", "core"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "rdl",
            sets: "3 sets × 15 reps",
            totalSets: 3,
            cue: "Lie on back with feet flat on mat. Drive through heels to lift hips until thighs align with torso. Squeeze glutes at top."
        },

        // ── 7. ARM ISOLATION (BICEPS) ────────────────────────────────────────────
        {
            id: "arm_bicep_db_curl",
            name: "Dumbbell Incline / Standing Bicep Curl",
            pattern: "arm_curl",
            category: "pull",
            primaryMuscles: ["biceps"],
            secondaryMuscles: ["forearms"],
            equipment: ["dumbbell"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "curl",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Elbows pinned at sides. Rotate wrists outward as you curl up toward shoulders. Squeeze peak for 1 second."
        },
        {
            id: "arm_bicep_cable_curl",
            name: "Cable Straight Bar / Rope Bicep Curl",
            pattern: "arm_curl",
            category: "pull",
            primaryMuscles: ["biceps"],
            secondaryMuscles: ["forearms"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "curl",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Low pulley cable ensures constant rotational tension at both full extension and peak contraction."
        },
        {
            id: "arm_bicep_machine_preacher",
            name: "Machine Preacher Curl",
            pattern: "arm_curl",
            category: "pull",
            primaryMuscles: ["biceps"],
            secondaryMuscles: ["brachialis"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "curl",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Armpits snug over preacher pad. Eliminates body momentum for pure bicep recruitment."
        },
        {
            id: "arm_bicep_bw_isometric",
            name: "Towel / Doorframe Resistance Curl",
            pattern: "arm_curl",
            category: "pull",
            primaryMuscles: ["biceps"],
            secondaryMuscles: ["forearms"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "curl",
            sets: "3 sets × 20s contractions",
            totalSets: 3,
            cue: "Loop a strong bath towel under foot or hold doorframe. Pull upwards against self-generated resistance."
        },

        // ── 8. ARM ISOLATION (TRICEPS) ───────────────────────────────────────────
        {
            id: "arm_tricep_cable_pushdown",
            name: "Cable Tricep Rope Pushdown",
            pattern: "tricep_extension",
            category: "push",
            primaryMuscles: ["triceps"],
            secondaryMuscles: [],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 12–15 reps",
            totalSets: 3,
            cue: "Pin elbows at sides. Drive rope down and spread handles apart at bottom. Squeeze triceps hard."
        },
        {
            id: "arm_tricep_machine_dip",
            name: "Seated Machine Tricep Dip",
            pattern: "tricep_extension",
            category: "push",
            primaryMuscles: ["triceps"],
            secondaryMuscles: ["chest"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "press",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Sit in machine with pad locked over thighs. Push handles downward to full lockout with zero shoulder shear."
        },
        {
            id: "arm_tricep_db_overhead",
            name: "Overhead Dumbbell Tricep Extension",
            pattern: "tricep_extension",
            category: "push",
            primaryMuscles: ["triceps"],
            secondaryMuscles: [],
            equipment: ["dumbbell", "bench"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 12 reps",
            totalSets: 3,
            cue: "Support dumbbell vertically with both hands overhead. Lower behind neck bending elbows, then press straight up."
        },
        {
            id: "arm_tricep_bw_chair_dip",
            name: "Bench / Chair Modified Tricep Dips",
            pattern: "tricep_extension",
            category: "push",
            primaryMuscles: ["triceps"],
            secondaryMuscles: ["front_delts"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "press",
            sets: "3 sets × 10–12 reps",
            totalSets: 3,
            cue: "Hands on front edge of chair, knees bent 90 degrees with feet flat on floor. Lower 3 inches and press up."
        },

        // ── 9. CORE STABILITY PATTERN ────────────────────────────────────────────
        {
            id: "core_cable_pallof",
            name: "Cable Pallof Anti-Rotation Press",
            pattern: "core_stability",
            category: "core",
            primaryMuscles: ["obliques", "transverse_abdominis"],
            secondaryMuscles: ["glutes"],
            equipment: ["cable"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 12 reps / side",
            totalSets: 3,
            cue: "Stand sideways to cable column. Hold handle at sternum. Press straight out resisting any rotational pull."
        },
        {
            id: "core_machine_rotary",
            name: "Machine Rotary Torso (Low Resistance)",
            pattern: "core_stability",
            category: "core",
            primaryMuscles: ["obliques"],
            secondaryMuscles: ["core"],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "pull",
            sets: "3 sets × 12 reps / side",
            totalSets: 3,
            cue: "Sit in rotation machine. Smoothly rotate torso 30 degrees using core, not momentum. Keep lower body locked."
        },
        {
            id: "core_db_suitcase_carry",
            name: "Dumbbell Standing Suitcase Carry",
            pattern: "core_stability",
            category: "core",
            primaryMuscles: ["obliques", "quadratus_lumborum"],
            secondaryMuscles: ["forearms"],
            equipment: ["dumbbell"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "walk",
            sets: "3 sets × 30 paces / side",
            totalSets: 3,
            cue: "Carry heavy dumbbell in one hand only. Walk tall without tilting sideways. Anti-lateral flexion builder."
        },
        {
            id: "core_bw_deadbug",
            name: "Deadbug / Modified Forearm Plank",
            pattern: "core_stability",
            category: "core",
            primaryMuscles: ["deep_core"],
            secondaryMuscles: ["hip_flexors"],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "pull",
            sets: "3 sets × 10 reps / side",
            totalSets: 3,
            cue: "Lie on mat with knees and arms at 90 degrees. Lower opposite arm and leg while pressing lower back flat against floor."
        },

        // ── 10. CARDIO CONDITIONING PATTERN (ZERO JOINT POUNDING) ────────────────
        {
            id: "cardio_treadmill_incline",
            name: "Incline Treadmill Walk (Cardio)",
            pattern: "cardio_finisher",
            category: "cardio",
            primaryMuscles: ["calves", "glutes", "cardiovascular"],
            secondaryMuscles: [],
            equipment: ["treadmill", "machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "walk",
            sets: "15–20 mins @ 3.5–4.5 km/h",
            totalSets: 1,
            cue: "Set incline to 3–6%. Walk tall with proud chest. Zero footstrike pounding. Maintain steady nasal breathing."
        },
        {
            id: "cardio_stationary_bike",
            name: "Stationary Recumbent Bike",
            pattern: "cardio_finisher",
            category: "cardio",
            primaryMuscles: ["quads", "cardiovascular"],
            secondaryMuscles: [],
            equipment: ["bike", "machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "walk",
            sets: "15–20 mins @ 75–85 RPM",
            totalSets: 1,
            cue: "Smooth circular pedal strokes. Low joint shear with full lumbar support in recumbent seat."
        },
        {
            id: "cardio_elliptical",
            name: "Low-Impact Elliptical Glider",
            pattern: "cardio_finisher",
            category: "cardio",
            primaryMuscles: ["full_body", "cardiovascular"],
            secondaryMuscles: [],
            equipment: ["machine"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 180,
            model: "walk",
            sets: "15–20 mins @ Moderate",
            totalSets: 1,
            cue: "Feet stay completely stationary on pedals eliminating any impact shock. Push and pull handlebars smoothly."
        },
        {
            id: "cardio_bw_outdoor_walk",
            name: "Outdoor Brisk Walk (Flat Ground)",
            pattern: "cardio_finisher",
            category: "cardio",
            primaryMuscles: ["calves", "cardiovascular"],
            secondaryMuscles: [],
            equipment: ["bodyweight"],
            jointImpact: 1,
            expertLevel: 1,
            maxUserWeightKg: 200,
            model: "walk",
            sets: "25–35 mins @ Conversational Pace",
            totalSets: 1,
            cue: "Wear supportive cushioned shoes. Stride briskly on flat turf or asphalt. Zero high-impact running."
        }
    ];

    /**
     * DYNAMIC PROTOCOL GENERATOR
     * Selects best variations for each movement pattern based on available equipment & joint limits.
     */
    function pickBestExercise(pattern, availableEquipment, shieldJoints, userWeightKg) {
        const matches = EXERCISE_CATALOG.filter(ex => {
            if (ex.pattern !== pattern) return false;

            // Joint Shield Mode: max JIS 1 or 2
            if (shieldJoints && ex.jointImpact > 2) return false;

            // User Weight Limit
            if (userWeightKg && userWeightKg > ex.maxUserWeightKg) return false;

            // Equipment Match: exercise must be performable with available equipment
            const hasEquipment = ex.equipment.every(eq => availableEquipment.includes(eq));
            return hasEquipment;
        });

        if (matches.length > 0) {
            // Prefer machine/cable if available for maximal joint stability, else dumbbell, else bodyweight
            return matches[0];
        }

        // Fallback: search for bodyweight fallback for this pattern
        const fallback = EXERCISE_CATALOG.find(ex => ex.pattern === pattern && ex.equipment.includes("bodyweight"));
        return fallback || EXERCISE_CATALOG.find(ex => ex.pattern === pattern);
    }

    function generateCustomSplit(userPrefs = {}) {
        const availableEquipment = userPrefs.availableEquipment || [
            "dumbbell", "bench", "cable", "machine", "treadmill", "bike", "bodyweight"
        ];
        const shieldJoints = userPrefs.shieldJoints !== false; // Default true
        const userWeightKg = userPrefs.userWeightKg || 135;

        // Pattern Selectors
        const squatEx   = pickBestExercise("knee_squat", availableEquipment, shieldJoints, userWeightKg);
        const hPushEx   = pickBestExercise("horizontal_push", availableEquipment, shieldJoints, userWeightKg);
        const vPullEx   = pickBestExercise("vertical_pull", availableEquipment, shieldJoints, userWeightKg);
        const hPullEx   = pickBestExercise("horizontal_pull", availableEquipment, shieldJoints, userWeightKg);
        const vPushEx   = pickBestExercise("vertical_push", availableEquipment, shieldJoints, userWeightKg);
        const hingeEx   = pickBestExercise("hip_hinge", availableEquipment, shieldJoints, userWeightKg);
        const curlEx    = pickBestExercise("arm_curl", availableEquipment, shieldJoints, userWeightKg);
        const tricepEx  = pickBestExercise("tricep_extension", availableEquipment, shieldJoints, userWeightKg);
        const coreEx    = pickBestExercise("core_stability", availableEquipment, shieldJoints, userWeightKg);
        const cardioEx  = pickBestExercise("cardio_finisher", availableEquipment, shieldJoints, userWeightKg);

        return {
            1: {
                title: "Upper Body Strength & Cardio Finisher",
                shortTag: "Day 1 • Upper + Cardio",
                exercises: [hPushEx, vPullEx, vPushEx, curlEx, tricepEx, cardioEx].filter(Boolean)
            },
            2: {
                title: "Lower Body & Core Stability",
                shortTag: "Day 2 • Lower & Core",
                exercises: [squatEx, hingeEx, coreEx, cardioEx].filter(Boolean)
            },
            3: {
                title: "Active Recovery & Joint Mobility",
                shortTag: "Day 3 • Active Recovery",
                exercises: [
                    cardioEx,
                    { name: "Cat-Cow & Spine Rotations", sets: "3 sets × 10 cycles", totalSets: 3, model: "rdl", cue: "Gentle spinal mobilization without joint pressure." },
                    { name: "Standing Hamstring & Hip Stretch", sets: "3 sets × 30s / leg", totalSets: 3, model: "pull", cue: "Hold gentle static stretch. Breathe deeply into tight tissues." }
                ]
            },
            4: {
                title: "Full Body Push / Pull Balance",
                shortTag: "Day 4 • Push / Pull",
                exercises: [hPullEx, hPushEx, vPushEx, curlEx, tricepEx, cardioEx].filter(Boolean)
            },
            5: {
                title: "Lower Body Power & Core Conditioning",
                shortTag: "Day 5 • Lower & Cardio",
                exercises: [squatEx, hingeEx, coreEx, cardioEx].filter(Boolean)
            },
            6: {
                title: "Cardiovascular Engine & Metabolic Finisher",
                shortTag: "Day 6 • Cardio Engine",
                exercises: [
                    cardioEx,
                    hPullEx,
                    coreEx
                ].filter(Boolean)
            },
            7: {
                title: "Complete Rest & Cellular Recovery",
                shortTag: "Day 7 • Rest & Recharge",
                exercises: [
                    { name: "Full Body Mobility & Light Walk", sets: "20–30 mins easy pace", totalSets: 1, model: "walk", cue: "Low intensity leisurely walk. Focus on hydration and restorative sleep." }
                ]
            }
        };
    }

    // Default split for instant startup
    const DEFAULT_SPLIT = generateCustomSplit();

    // Export globally for OpenFit runtime
    window.OpenFitData = {
        EXERCISE_CATALOG: EXERCISE_CATALOG,
        generateCustomSplit: generateCustomSplit,
        WORKOUT_SPLIT: DEFAULT_SPLIT
    };

})();
