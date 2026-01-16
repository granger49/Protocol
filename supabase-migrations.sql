-- Athletic Longevity Training Agent - Complete Database Schema
-- Run this in Supabase SQL Editor

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout logs table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  scheduled_workout TEXT NOT NULL,
  achilles_pain INTEGER DEFAULT 0 CHECK (achilles_pain >= 0 AND achilles_pain <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, date DESC);

-- Exercise logs table
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  category TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  weight TEXT,
  reps TEXT,
  sets TEXT,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout ON exercise_logs(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user ON exercise_logs(user_id, completed_at DESC);

-- Personal records table
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercise_name, weight, reps, sets)
);

CREATE INDEX IF NOT EXISTS idx_prs_user_exercise ON personal_records(user_id, exercise_name, weight DESC);

-- Pushed exercises table
CREATE TABLE IF NOT EXISTS public.pushed_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pushed_exercises_user_to_date ON pushed_exercises(user_id, to_date);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  basketball_days TEXT[] DEFAULT ARRAY['wednesday', 'sunday'],
  equipment_available JSONB DEFAULT '{"rack": false, "bands": true, "kettlebells": true}'::jsonb,
  custom_exercises JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise library table (for extensibility)
CREATE TABLE IF NOT EXISTS public.exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  form_cue TEXT,
  sets INTEGER,
  reps TEXT,
  duration TEXT,
  rest_sec INTEGER,
  intensity_percent TEXT,
  alternatives TEXT[],
  tags TEXT[],
  source TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_exercise_library_user_category ON exercise_library(user_id, category) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_exercise_library_tags ON exercise_library USING GIN(tags);

-- Workout templates table (for extensibility)
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schedule JSONB NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_by TEXT DEFAULT 'user',
  version INTEGER DEFAULT 1,
  parent_template_id UUID REFERENCES public.workout_templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_templates_user_active ON workout_templates(user_id, is_active);

-- Constraint: Only one active template per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_template_per_user 
ON workout_templates(user_id) 
WHERE is_active = TRUE;

-- =====================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pushed_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Workout logs policies
CREATE POLICY "Users can view own workouts" ON public.workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON public.workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON public.workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON public.workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Exercise logs policies
CREATE POLICY "Users can view own exercise logs" ON public.exercise_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise logs" ON public.exercise_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise logs" ON public.exercise_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercise logs" ON public.exercise_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Personal records policies
CREATE POLICY "Users can view own PRs" ON public.personal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PRs" ON public.personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PRs" ON public.personal_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs" ON public.personal_records
  FOR DELETE USING (auth.uid() = user_id);

-- Pushed exercises policies
CREATE POLICY "Users can view own pushed exercises" ON public.pushed_exercises
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pushed exercises" ON public.pushed_exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pushed exercises" ON public.pushed_exercises
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pushed exercises" ON public.pushed_exercises
  FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Exercise library policies (users can see global + own)
CREATE POLICY "Users can view own and global exercises" ON public.exercise_library
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" ON public.exercise_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises" ON public.exercise_library
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exercises" ON public.exercise_library
  FOR DELETE USING (auth.uid() = user_id);

-- Workout templates policies
CREATE POLICY "Users can view own templates" ON public.workout_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON public.workout_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.workout_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.workout_templates
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON public.workout_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON public.workout_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- 4. SEED DEFAULT EXERCISES (Global - user_id = NULL)
-- =====================================================

-- Clear existing global exercises first
DELETE FROM public.exercise_library WHERE user_id IS NULL;

-- STRENGTH EXERCISES
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, reps, rest_sec, intensity_percent, tags) VALUES
(NULL, 'Deadlift', 'strength', 'Conventional stance. Hinge at hips, neutral spine throughout. Drive through heels, squeeze glutes at top. Control the descent - don''t drop the bar.', 4, '6', 180, '75-80% 1RM', ARRAY['compound', 'posterior-chain']),
(NULL, 'Overhead Press', 'strength', 'Strict press, no leg drive. Elbows slightly forward, press bar in straight line. Lock out overhead, squeeze glutes for stability.', 4, '8', 120, '70-75% 1RM', ARRAY['compound', 'shoulders']),
(NULL, 'Bulgarian Split Squat', 'strength', 'Back foot elevated 12 inches. Front shin vertical, torso upright. Drive through front heel, don''t let knee cave inward.', 3, '10', 90, '65% squat max', ARRAY['unilateral', 'legs']),
(NULL, 'Incline Press', 'strength', '30-45° incline. Lower to upper chest, elbows 45° angle. Deep stretch at bottom, full lockout at top without shoulder shrug.', 3, '10', 90, '65-70% bench max', ARRAY['chest', 'shoulders']),
(NULL, 'Face Pulls', 'strength', 'High anchor point. Pull to face level, separate hands and externally rotate shoulders. Squeeze shoulder blades together at end position.', 3, '15', 60, NULL, ARRAY['shoulders', 'rear-delts']),
(NULL, 'Bicep Curl', 'strength', 'Strict form, elbows pinned at sides. Supinate wrists at top. 3-second negative (lowering phase). No swinging or momentum.', 3, '10', 60, NULL, ARRAY['arms', 'biceps']),
(NULL, 'Back Squat', 'strength', 'High bar position. Break at knees and hips simultaneously. Depth to parallel minimum. Drive through whole foot, knees track over toes.', 4, '8', 180, '70-75% 1RM', ARRAY['compound', 'legs']),
(NULL, 'Bent-Over Row', 'strength', 'Hip hinge, back flat. Pull to lower chest/upper abs. Lead with elbows, squeeze shoulder blades. Underhand or overhand grip.', 4, '8', 120, '70% 1RM', ARRAY['compound', 'back']),
(NULL, 'Romanian Deadlift', 'strength', 'Slight knee bend, push hips back. Feel stretch in hamstrings. Bar stays close to legs. Squeeze glutes to stand, don''t hyperextend back.', 3, '10', 90, '65-70% deadlift max', ARRAY['posterior-chain', 'hamstrings']),
(NULL, 'Floor Press', 'strength', 'Lie on floor, knees bent. Lower until elbows touch floor - pause briefly. Press up explosively. Protects shoulders, emphasizes triceps.', 3, '10', 90, '70% bench max', ARRAY['chest', 'triceps']),
(NULL, 'Hammer Curl', 'strength', 'Neutral grip (palms facing). Strict form, no swinging. Can alternate arms or lift together. Targets brachialis and forearms.', 3, '12', 60, NULL, ARRAY['arms', 'biceps']),
(NULL, 'Tempo Push-Ups', 'strength', '3-1-1 tempo: 3 seconds down, 1 second pause at bottom, 1 second up. Hands on push-up grips if available. Plank position throughout.', 3, '15', 60, NULL, ARRAY['chest', 'bodyweight']),
(NULL, 'DB Chest Fly', 'strength', 'Slight elbow bend (15-20°). Arc motion bringing DBs together above chest. Deep stretch at bottom without losing shoulder stability.', 3, '12', 60, NULL, ARRAY['chest', 'isolation']),
(NULL, 'Concentration Curl', 'strength', 'Seated, elbow braced on inner thigh. Full supination at top (pinky higher than thumb). Squeeze bicep at peak. Slow controlled negative.', 3, '10', 60, NULL, ARRAY['arms', 'biceps', 'isolation']),
(NULL, 'Standing Calf Raise', 'strength', 'Full range: deep stretch at bottom, maximum plantarflexion at top. 2-second pause at top. Use wall/rack for balance only, not support.', 3, '15', 60, NULL, ARRAY['legs', 'calves']),
(NULL, 'KB Swing', 'strength', 'Hip hinge pattern - explosive hip extension drives KB. Arms are relaxed ropes. KB to chest/shoulder height. Powerful glute squeeze at top.', 3, '30 sec', 60, NULL, ARRAY['posterior-chain', 'explosive']);

-- STABILITY EXERCISES
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, reps, tags) VALUES
(NULL, 'Dead Bug', 'stability', 'Supine, lower back pressed to floor. Extend opposite arm and leg simultaneously. Move slowly, maintain core brace. Anti-extension work.', 3, '10/side', ARRAY['core', 'anti-extension']),
(NULL, 'Side Plank', 'stability', 'Stacked shoulders, hips, ankles. Drive top hip toward ceiling. Option: add hip dips for oblique work. Anti-lateral flexion.', 3, '30 sec/side', ARRAY['core', 'obliques']),
(NULL, 'Bird Dog', 'stability', 'Quadruped. Extend opposite arm and leg, hold 2 seconds. No torso rotation. Focus on stability, not range. Anti-rotation work.', 3, '10/side', ARRAY['core', 'anti-rotation']),
(NULL, 'Pallof Press', 'stability', 'Band/cable at chest height. Stand perpendicular, press out and resist rotation. Core fights the pull. Gold standard anti-rotation.', 3, '10/side', ARRAY['core', 'anti-rotation']),
(NULL, 'Copenhagen Plank', 'stability', 'Side plank with top leg elevated on bench. Bottom leg hangs. Adductor work for groin/hip stability. Advanced - start with short duration.', 3, '20 sec/side', ARRAY['core', 'adductors', 'advanced']),
(NULL, 'Suitcase Carry', 'stability', 'Heavy KB or DB in one hand. Walk without leaning. Core resists lateral flexion. Shoulder packed, upright posture. Anti-lateral work.', 3, '30 sec/side', ARRAY['core', 'functional']),
(NULL, 'Single-Leg RDL', 'stability', 'Balance on one leg, hinge forward. Non-weight leg extends back for balance. Feel hamstring stretch. Proprioception + hip stability.', 3, '8/side', ARRAY['balance', 'hamstrings']),
(NULL, 'Bosu Ball Single-Leg', 'stability', 'Stand on bosu (dome up or down). Progress to eyes closed. Small adjustments engage stabilizers. Can add ball toss for challenge.', 3, '30 sec/side', ARRAY['balance', 'proprioception']),
(NULL, 'Clamshells', 'stability', 'Side-lying, hips stacked, knees bent. Open top knee while keeping feet together. Squeeze glute medius. Band above knees increases resistance.', 3, '15/side', ARRAY['glutes', 'hip-stability']),
(NULL, 'Fire Hydrants', 'stability', 'Quadruped. Lift bent leg out to side, keep 90° angle. Controlled movement, no torso rotation. Glute medius activation.', 3, '15/side', ARRAY['glutes', 'hip-stability']);

-- MOBILITY EXERCISES
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, duration, tags) VALUES
(NULL, '90/90 Hip Switches', 'mobility', 'Seated, both knees at 90°. Switch between internal and external hip rotation. Breathe into end ranges. Hip capsule mobility.', 1, '2 min', ARRAY['hips', 'hip-mobility']),
(NULL, 'World''s Greatest Stretch', 'mobility', 'Lunge position, same-side elbow to instep. Rotate toward front leg, reach up. Hip flexor + thoracic rotation + hamstring. Dynamic flow.', 1, '2 min', ARRAY['full-body', 'dynamic']),
(NULL, 'Thread the Needle', 'mobility', 'Quadruped. Thread one arm under body, rotate thoracic spine. Opposite arm can reach overhead for deeper rotation. T-spine mobility.', 3, '30 sec/side', ARRAY['thoracic', 't-spine']),
(NULL, 'Band Pull-Aparts', 'mobility', 'Light band at chest height, arms extended. Pull band to chest by squeezing shoulder blades. Scapular retraction, rear delt activation.', 3, '20 reps', ARRAY['shoulders', 'scapular']),
(NULL, 'Cat-Cow', 'mobility', 'Quadruped. Alternate between spinal flexion (cat) and extension (cow). Rhythmic breathing. Segmental spinal mobility.', 1, '1 min', ARRAY['spine', 'warmup']),
(NULL, 'Doorway Pec Stretch', 'mobility', 'Arm in doorway at 90°. Step through doorway, rotate chest away. Feel stretch across pec and anterior shoulder. Static hold.', 2, '1 min/side', ARRAY['chest', 'shoulders', 'static']),
(NULL, 'Thoracic Extension Foam Roll', 'mobility', 'Foam roller under mid-back. Support head with hands. Extend over roller, breathe. Move roller up/down thoracic spine. Counters desk posture.', 1, '2 min', ARRAY['thoracic', 't-spine', 'foam-roll']);

-- TONE/TENDON HEALTH
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, duration, tags) VALUES
(NULL, 'Foam Roll - Full Body', 'tone', 'Roll each major muscle group 60-90 seconds. Quads, hamstrings, IT band, calves, lats, adductors. Pause on tender spots, don''t rush.', NULL, '10 min', ARRAY['recovery', 'foam-roll']),
(NULL, 'Lacrosse Ball - Feet', 'tone', 'Roll plantar fascia. Stand on ball, apply pressure, roll from heel to toes. Helps with foot mechanics and Achilles health.', NULL, '3 min', ARRAY['feet', 'plantar-fascia']),
(NULL, 'Band Shoulder CARs', 'tone', 'Controlled Articular Rotations. Move shoulder through full pain-free range in all planes. Light band resistance. Joint health.', 2, '5/direction', ARRAY['shoulders', 'joint-health']),
(NULL, 'Ankle Rockers', 'tone', 'Lunge position, front knee over toes. Rock forward loading ankle. Improves dorsiflexion, Achilles elasticity. Key for squat depth.', 3, '10 reps', ARRAY['ankles', 'dorsiflexion']);

-- CARDIO
INSERT INTO public.exercise_library (user_id, name, category, form_cue, duration, tags) VALUES
(NULL, 'Zone 2 Rowing', 'cardio', '130-140 BPM. Stroke rate 18-22. Long, powerful strokes. Conversational pace - difficult but possible to speak in short sentences.', '30 min', ARRAY['zone2', 'rowing']),
(NULL, 'Zone 2 Peloton', 'cardio', '130-140 BPM. Power Zone 2 classes or manual ride. Cadence 80-90 rpm. Moderate resistance, sustainable. Nose breathing difficult but possible.', '35 min', ARRAY['zone2', 'cycling']),
(NULL, 'Norwegian 4x4', 'cardio', 'After 10 min warm-up: 4 rounds of 4 min HARD (90-95% max HR) + 3 min easy. VO2 max work. RPE 8-9 during hard blocks.', '30 min', ARRAY['vo2max', 'intervals']),
(NULL, 'Rucking', 'cardio', '30 lb weight in backpack. 3.5-4 mph pace on trails. Upright posture, engaged core. Combines cardio with stability challenge.', '45 min', ARRAY['zone2', 'walking']),
(NULL, 'Basketball (if scheduled)', 'cardio', 'Full court play. Monitor Achilles closely - warm up thoroughly. Count as VO2 max session. Hydrate well.', '60-90 min', ARRAY['vo2max', 'sport']),
(NULL, 'Norwegian 4x4 (if no basketball)', 'cardio', 'After 10 min warm-up: 4 rounds of 4 min HARD (90-95% max HR) + 3 min easy. VO2 max work. RPE 8-9 during hard blocks.', '30 min', ARRAY['vo2max', 'intervals']),
(NULL, 'Zone 2 (40-60 min choice)', 'cardio', 'Choose: rowing, cycling, or walking. 130-140 BPM target. Conversational pace. Build aerobic base.', '40-60 min', ARRAY['zone2', 'choice']);

-- REHAB (Achilles)
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, duration, reps, tags) VALUES
(NULL, 'Achilles Isometric Holds', 'rehab', 'Calf raise position (on toes). Hold at top - both legs then progress to single leg. Builds tendon stiffness without eccentric stress.', 3, '45 sec', NULL, ARRAY['achilles', 'isometric']),
(NULL, 'Achilles Eccentric Lowers', 'rehab', 'Rise on both legs, lower on single leg (weaker leg emphasis). 5-second lowering phase. Gold standard for Achilles tendon remodeling.', 3, NULL, '15', ARRAY['achilles', 'eccentric']),
(NULL, 'Ankle Dorsiflexion', 'rehab', 'Band around foot, pull toes toward shin. Strengthens tibialis anterior. Balances calf work, protects ankle.', 3, NULL, '15/side', ARRAY['ankle', 'tibialis']),
(NULL, 'Ankle Circles', 'rehab', 'Slow, controlled circles. Full range of motion. Both directions. Maintains ankle mobility for Achilles health.', 3, NULL, '10 each direction', ARRAY['ankle', 'mobility']);

-- WARMUP
INSERT INTO public.exercise_library (user_id, name, category, form_cue, sets, reps, tags) VALUES
(NULL, 'Dynamic Leg Swings', 'warmup', 'Forward/back and side-to-side. Hold wall for balance. Loosen hips before lower body work.', 2, '10/leg', ARRAY['dynamic', 'hips']),
(NULL, 'Arm Circles', 'warmup', '10 forward, 10 backward. Small to large circles. Shoulder prep before pressing.', 2, '20 total', ARRAY['dynamic', 'shoulders']),
(NULL, 'Bodyweight Squats', 'warmup', 'Full depth, controlled tempo. Wakes up glutes, quads, ankles. Movement prep.', 2, '15', ARRAY['dynamic', 'legs']),
(NULL, 'Hip Circles', 'warmup', 'Hands on hips or wall. Large circles, both directions. Hip capsule warm-up.', 2, '10/direction', ARRAY['dynamic', 'hips']),
(NULL, 'Scapular Push-Ups', 'warmup', 'Plank position. Push shoulder blades apart (protract), then squeeze together (retract). No elbow bend. Scapular activation.', 2, '10', ARRAY['dynamic', 'scapular']);

-- =====================================================
-- 5. SEED DEFAULT TEMPLATE
-- =====================================================

-- Note: Default template is seeded per-user on first login via the application
-- The template JSON structure is stored in the app constants
