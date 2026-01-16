import { WeeklyTemplate } from '@/types/workout'

export const DEFAULT_TEMPLATE: WeeklyTemplate = {
  monday: {
    name: "Full Body A (Push/Lower)",
    sections: {
      warmup: ["Dynamic Leg Swings", "Hip Circles", "Bodyweight Squats", "Arm Circles", "Band Pull-Aparts"],
      strength: ["Deadlift", "Overhead Press", "Bulgarian Split Squat", "Incline Press", "Face Pulls", "Bicep Curl"],
      stability: ["Clamshells", "Fire Hydrants", "Single-Leg RDL"],
      cardio: ["Zone 2 Rowing"],
      mobility: ["90/90 Hip Switches", "World's Greatest Stretch"],
      tone: ["Foam Roll - Full Body"],
      rehab: ["Achilles Isometric Holds", "Achilles Eccentric Lowers", "Ankle Circles"],
      other: [{ name: "Steam", duration: "15 min", type: "recovery" }]
    }
  },
  tuesday: {
    name: "Recovery & Stability",
    sections: {
      warmup: [],
      strength: [],
      stability: ["Dead Bug", "Side Plank", "Bird Dog", "Pallof Press"],
      cardio: ["Basketball (if scheduled)"],
      mobility: ["Thread the Needle", "Doorway Pec Stretch", "Cat-Cow"],
      tone: ["Lacrosse Ball - Feet"],
      rehab: ["Achilles Isometric Holds", "Ankle Dorsiflexion", "Ankle Circles"],
      other: []
    }
  },
  wednesday: {
    name: "VO2 Max Day",
    sections: {
      warmup: ["Arm Circles", "Bodyweight Squats", "Hip Circles"],
      strength: [],
      stability: [],
      cardio: ["Basketball (if scheduled)", "Norwegian 4x4 (if no basketball)"],
      mobility: ["World's Greatest Stretch", "Thoracic Extension Foam Roll", "Cat-Cow"],
      tone: [],
      rehab: ["Achilles Isometric Holds", "Ankle Circles"],
      other: []
    }
  },
  thursday: {
    name: "Full Body B (Pull/Lower)",
    sections: {
      warmup: ["Band Pull-Aparts", "Bodyweight Squats", "Scapular Push-Ups", "Hip Circles"],
      strength: ["Back Squat", "Bent-Over Row", "Romanian Deadlift", "Floor Press", "Hammer Curl"],
      stability: ["Pallof Press", "Suitcase Carry", "Copenhagen Plank"],
      cardio: ["Zone 2 Peloton"],
      mobility: ["90/90 Hip Switches", "Thread the Needle"],
      tone: ["Band Shoulder CARs", "Ankle Rockers"],
      rehab: ["Achilles Isometric Holds", "Achilles Eccentric Lowers", "Ankle Circles"],
      other: [{ name: "Steam", duration: "15 min", type: "recovery" }]
    }
  },
  friday: {
    name: "Accessory & Hypertrophy",
    sections: {
      warmup: ["Arm Circles", "Scapular Push-Ups"],
      strength: ["Tempo Push-Ups", "DB Chest Fly", "Concentration Curl", "Standing Calf Raise", "KB Swing"],
      stability: ["Dead Bug", "Bosu Ball Single-Leg"],
      cardio: [],
      mobility: ["Doorway Pec Stretch"],
      tone: ["Foam Roll - Full Body"],
      rehab: ["Achilles Isometric Holds", "Achilles Eccentric Lowers", "Ankle Dorsiflexion", "Ankle Circles"],
      other: [{ name: "Steam", duration: "15 min", type: "recovery" }]
    }
  },
  saturday: {
    name: "Active Recovery",
    sections: {
      warmup: [],
      strength: [],
      stability: [],
      cardio: ["Rucking"],
      mobility: ["World's Greatest Stretch", "90/90 Hip Switches", "Thoracic Extension Foam Roll"],
      tone: ["Lacrosse Ball - Feet"],
      rehab: ["Ankle Circles"],
      other: []
    }
  },
  sunday: {
    name: "Long Cardio",
    sections: {
      warmup: [],
      strength: [],
      stability: [],
      cardio: ["Basketball (if scheduled)", "Zone 2 (40-60 min choice)"],
      mobility: ["90/90 Hip Switches", "Cat-Cow"],
      tone: [],
      rehab: ["Achilles Isometric Holds", "Ankle Circles"],
      other: []
    }
  }
}

export const DEFAULT_TEMPLATE_NAME = "Athletic Longevity v1"
export const DEFAULT_TEMPLATE_DESCRIPTION = "Full-body athletic longevity program with Achilles recovery focus. Based on Peter Attia protocols."
