import type { ExamType } from "@/types";

export const APP_NAME = "MindMirror";

export const EXAM_TYPES: ExamType[] = ["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC"];

export const MOOD_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Neutral",
  4: "Good",
  5: "Great",
};

export const MOOD_EMOJIS: Record<number, string> = {
  1: "😔",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😊",
};

/** Verified Indian mental health helplines */
export const INDIAN_HELPLINES = [
  {
    name: "Tele-MANAS",
    number: "14416",
    description: "National tele-mental health helpline (24/7, toll-free)",
    url: "https://telemanas.mohfw.gov.in/",
  },
  {
    name: "iCall (TISS)",
    number: "9152987821",
    description: "Counselling helpline by Tata Institute of Social Sciences",
    url: "https://icallhelpline.org/",
  },
  {
    name: "AASRA",
    number: "9820466726",
    description: "24/7 crisis helpline for emotional support",
    url: "http://www.aasra.info/",
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    description: "24/7 mental health support helpline",
    url: "https://www.vandrevalafoundation.com/",
  },
] as const;

export const DISCLAIMER =
  "MindMirror is an AI wellness companion, not a therapist or medical professional. If you are in crisis, please contact a verified helpline immediately.";

export const STORAGE_KEYS = {
  ENCRYPTED_STATE: "mindmirror_encrypted_state",
  ENCRYPTION_SALT: "mindmirror_encryption_salt",
} as const;

export const EXAM_CONTEXT: Record<ExamType, { tone: string; examples: string[] }> = {
  NEET: {
    tone: "empathetic and encouraging for medical aspirants",
    examples: ["mock tests", "biology chapters", "NEET rank anxiety"],
  },
  JEE: {
    tone: "supportive for engineering aspirants facing intense competition",
    examples: ["JEE Main/Advanced", "problem-solving burnout", "coaching pressure"],
  },
  CUET: {
    tone: "reassuring for university entrance candidates",
    examples: ["domain subjects", "general test anxiety", "college choices"],
  },
  CAT: {
    tone: "motivating for MBA aspirants balancing work and prep",
    examples: ["mock CATs", "DILR sections", "percentile pressure"],
  },
  GATE: {
    tone: "encouraging for postgraduate engineering aspirants",
    examples: ["technical subjects", "research vs industry", "GATE score stress"],
  },
  UPSC: {
    tone: "patient and steady for long-haul civil services aspirants",
    examples: ["current affairs", "answer writing", "multiple attempt fatigue"],
  },
};
