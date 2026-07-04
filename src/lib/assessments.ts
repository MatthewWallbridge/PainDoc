import type { ODIQuestion, ScaleQuestion, ScoreCategory, SectionAQuestion } from './types';

export const ODI_QUESTIONS: ODIQuestion[] = [
  { id: "q1", text: "Pain intensity", opts: ["No pain at the moment", "Very mild pain at the moment", "Moderate pain at the moment", "Fairly severe pain at the moment", "Very severe pain at the moment", "Worst imaginable pain"] },
  { id: "q2", text: "Personal care", subtitle: "Washing, dressing, etc.", opts: ["I look after myself normally without extra pain", "I look after myself normally but it causes extra pain", "Painful to look after myself, I am slow and careful", "I need some help but manage most personal care", "I need help every day in most aspects of self-care", "I do not get dressed, I wash with difficulty and stay in bed"] },
  { id: "q3", text: "Lifting", opts: ["I can lift heavy weights without extra pain", "I can lift heavy weights but it gives extra pain", "Pain prevents lifting heavy weights off floor, but can manage if conveniently placed", "Pain prevents lifting heavy weights, can manage light to medium if conveniently positioned", "I can only lift very light weights", "I cannot lift or carry anything at all"] },
  { id: "q4", text: "Walking", opts: ["Pain does not prevent me walking any distance", "Pain prevents walking more than 1 mile", "Pain prevents walking more than ½ mile", "Pain prevents walking more than 100 yards", "I can only walk using a stick or crutches", "I am in bed most of the time"] },
  { id: "q5", text: "Sitting", opts: ["I can sit in any chair as long as I like", "I can only sit in my favourite chair as long as I like", "Pain prevents sitting more than 1 hour", "Pain prevents sitting more than 30 minutes", "Pain prevents sitting more than 10 minutes", "Pain prevents sitting at all"] },
  { id: "q6", text: "Standing", opts: ["I can stand as long as I want without extra pain", "I can stand as long as I want but it gives extra pain", "Pain prevents standing more than 1 hour", "Pain prevents standing more than 30 minutes", "Pain prevents standing more than 10 minutes", "Pain prevents standing at all"] },
  { id: "q7", text: "Sleeping", opts: ["My sleep is never disturbed by pain", "My sleep is occasionally disturbed by pain", "Because of pain I have less than 6 hours sleep", "Because of pain I have less than 4 hours sleep", "Because of pain I have less than 2 hours sleep", "Pain prevents me from sleeping at all"] },
  { id: "q8", text: "Sex life", subtitle: "If applicable — optional", opts: ["My sex life is normal and causes no extra pain", "My sex life is normal but causes some extra pain", "My sex life is nearly normal but is very painful", "My sex life is severely restricted by pain", "My sex life is nearly absent because of pain", "Pain prevents any sex life at all"], optional: true },
  { id: "q9", text: "Social life", opts: ["My social life is normal and gives no extra pain", "Normal social life but increases the degree of pain", "Pain limits energetic interests (e.g. sport) but no other effect", "Pain has restricted social life, I do not go out as often", "Pain has restricted my social life to my home", "I have no social life because of pain"] },
  { id: "q10", text: "Travelling", opts: ["I can travel anywhere without pain", "I can travel anywhere but it gives extra pain", "Pain is bad but I manage journeys over two hours", "Pain restricts me to journeys of less than 1 hour", "Pain restricts me to short necessary journeys under 30 minutes", "Pain prevents me from travelling except to receive treatment"] },
];

export function calcODI(answers: Record<string, number>): number {
  const keys = Object.keys(answers);
  if (!keys.length) return 0;
  const total = keys.reduce((s, k) => s + (answers[k] || 0), 0);
  return Math.round((total / (keys.length * 5)) * 100);
}

export function odiCategory(pct: number): ScoreCategory {
  if (pct <= 20) return { label: "Minimal disability",  color: "green"  };
  if (pct <= 40) return { label: "Moderate disability", color: "yellow" };
  if (pct <= 60) return { label: "Severe disability",   color: "orange" };
  if (pct <= 80) return { label: "Crippling back pain", color: "red"    };
  return                 { label: "Bed-bound",           color: "rose"   };
}

const FREQ_OPTS = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export const PHQ9_QUESTIONS: ScaleQuestion[] = [
  { id: "p1", text: "Little interest or pleasure in doing things", opts: FREQ_OPTS },
  { id: "p2", text: "Feeling down, depressed, or hopeless", opts: FREQ_OPTS },
  { id: "p3", text: "Trouble falling or staying asleep, or sleeping too much", opts: FREQ_OPTS },
  { id: "p4", text: "Feeling tired or having little energy", opts: FREQ_OPTS },
  { id: "p5", text: "Poor appetite or overeating", opts: FREQ_OPTS },
  { id: "p6", text: "Feeling bad about yourself — or that you are a failure, or have let yourself or your family down", opts: FREQ_OPTS },
  { id: "p7", text: "Trouble concentrating on things, such as reading the newspaper or watching television", opts: FREQ_OPTS },
  { id: "p8", text: "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual", opts: FREQ_OPTS },
  { id: "p9", text: "Thoughts that you would be better off dead, or of hurting yourself in some way", opts: FREQ_OPTS },
];

export const GAD7_QUESTIONS: ScaleQuestion[] = [
  { id: "g1", text: "Feeling nervous, anxious, or on edge", opts: FREQ_OPTS },
  { id: "g2", text: "Not being able to stop or control worrying", opts: FREQ_OPTS },
  { id: "g3", text: "Worrying too much about different things", opts: FREQ_OPTS },
  { id: "g4", text: "Trouble relaxing", opts: FREQ_OPTS },
  { id: "g5", text: "Being so restless that it is hard to sit still", opts: FREQ_OPTS },
  { id: "g6", text: "Becoming easily annoyed or irritable", opts: FREQ_OPTS },
  { id: "g7", text: "Feeling afraid, as if something awful might happen", opts: FREQ_OPTS },
];

export const PHQ9_DIFFICULTY_OPTIONS = ['Not difficult at all', 'Somewhat difficult', 'Very difficult', 'Extremely difficult'];

export function calcScale(answers: Record<string, number>): number {
  return Object.values(answers).reduce((s, v) => s + (v || 0), 0);
}

export function phq9Category(score: number): ScoreCategory {
  if (score <= 4)  return { label: "Minimal",          color: "green"  };
  if (score <= 9)  return { label: "Mild",             color: "yellow" };
  if (score <= 14) return { label: "Moderate",         color: "orange" };
  if (score <= 19) return { label: "Moderately severe", color: "red"    };
  return                   { label: "Severe",           color: "rose"   };
}

export function gad7Category(score: number): ScoreCategory {
  if (score <= 4)  return { label: "Minimal",  color: "green"  };
  if (score <= 9)  return { label: "Mild",     color: "yellow" };
  if (score <= 14) return { label: "Moderate", color: "orange" };
  return                   { label: "Severe",   color: "red"    };
}

const PAIN_DESCRIPTORS = ["Dull", "Aching", "Sharp", "Shooting", "Cramping", "Burning", "Pulsing", "Other"];

export const SECTION_A_QUESTIONS: SectionAQuestion[] = [
  {
    id: "q1", number: 1, title: "Where is the primary focus of your pain?",
    fields: [{ id: "primaryFocus", label: "Primary location", type: "text", placeholder: "e.g. lower back, left side" }],
  },
  {
    id: "q2", number: 2, title: "How long has it been there, and was it sudden or gradual in onset? Were you well / stressed at the time of onset?",
    fields: [{ id: "onset", label: "Onset", type: "textarea", placeholder: "How long, sudden or gradual, and were you well or stressed at the time" }],
  },
  {
    id: "q3", number: 3, title: "What does your pain feel like?",
    fields: [
      { id: "characterTags", label: "Character", type: "chips", options: PAIN_DESCRIPTORS },
      { id: "characterOther", label: "Describe in your own words", type: "text", optional: true, placeholder: "Optional — your own description" },
    ],
  },
  {
    id: "q4", number: 4, title: "Does your pain radiate / spread anywhere — if so, where?",
    fields: [{ id: "radiation", label: "Radiation / spread", type: "text", optional: true }],
  },
  {
    id: "q5", number: 5, title: "What things alleviate your pain?",
    fields: [{ id: "alleviating", label: "What helps", type: "text", placeholder: "Heat, position, rest…" }],
  },
  {
    id: "q6", number: 6, title: "What things make your pain worse?",
    fields: [{ id: "aggravating", label: "What makes it worse", type: "text" }],
  },
  {
    id: "q7", number: 7, title: "Does your pain occur at particular times?",
    fields: [{ id: "timing", label: "Timing", type: "text", placeholder: "Morning, afternoon, night…", optional: true }],
  },
  {
    id: "q8", number: 8, title: "Rate your pain out of 10",
    fields: [
      { id: "severityLeast", label: "At its least", type: "number", placeholder: "0–10" },
      { id: "severityMost", label: "At its most", type: "number", placeholder: "0–10" },
      { id: "severityAverage", label: "On average", type: "number", placeholder: "0–10" },
    ],
  },
  {
    id: "q9", number: 9, title: "Is the pain associated with other factors like weakness, pins and needles, nausea, others?",
    fields: [{ id: "associatedFeatures", label: "Associated features", type: "textarea", optional: true }],
  },
  {
    id: "q10", number: 10, title: "What are two or three things you can't do because of your pain that you want to do?",
    fields: [{ id: "functionalGoals", label: "Things you want to be able to do", type: "textarea", placeholder: "e.g. walk 1 km, sit for ½ an hour, stand for ¼ hour" }],
  },
  {
    id: "q11", number: 11, title: "Apart from your pain, do you feel well in the rest of your body, or are there other things you want to discuss?",
    fields: [{ id: "systemsReview", label: "Other symptoms", type: "textarea", subtitle: "e.g. head/ear/nose/throat, heart/chest, bowel/bladder, weakness/pins and needles/coordination, sleep, concentration", optional: true }],
  },
  {
    id: "q12", number: 12, title: "Doctors only have four treatments — tell me what you've tried",
    fields: [
      { id: "treatmentPills", label: "Pills", type: "textarea", subtitle: "Names (incl. natural), and roughly how much they help", optional: true },
      { id: "treatmentSkills", label: "Skills", type: "textarea", subtitle: "Physio / chiro / osteo / massage / Pilates / yoga / stretch sessions", optional: true },
      { id: "treatmentNeedles", label: "Needles", type: "textarea", subtitle: "Cortisone injections / acupuncture, and how much they helped", optional: true },
      { id: "treatmentSurgery", label: "Surgery", type: "textarea", subtitle: "Any operation to this area, or other relevant operations", optional: true },
    ],
  },
  {
    id: "q13", number: 13, title: "Past medical history, family history and allergies",
    fields: [
      { id: "pastMedicalHistory", label: "Key past illnesses and treatments", type: "textarea", subtitle: "May interact with what is prescribed" },
      { id: "familyHistory", label: "Family history", type: "text", subtitle: "Does something run in the family?", optional: true },
      { id: "allergies", label: "Allergies", type: "text", subtitle: "Pills, plasters or foods", optional: true },
    ],
  },
  {
    id: "q14", number: 14, title: "How your mind and lifestyle are working",
    fields: [
      { id: "smoking", label: "Smoking", type: "text", placeholder: "Yes / No / In the past — how many a day, for how many years", optional: true },
      { id: "otherSubstances", label: "Other smoking or recreational drugs", type: "text", optional: true },
      { id: "alcohol", label: "Alcohol", type: "text", placeholder: "Standard drinks per week", optional: true },
      { id: "dietRecall", label: "What have you eaten in the last 24 hours?", type: "textarea", subtitle: "A rough note is fine — what you eat matters more than most people realise", optional: true },
      { id: "weightNow", label: "Current weight", type: "text", optional: true },
      { id: "weightSchoolLeaver", label: "Weight when you left school", type: "text", subtitle: "Is there a difference, and why?", optional: true },
      { id: "caffeineFluid", label: "Coffee and water/juice per day", type: "text", optional: true },
      { id: "exercise", label: "Exercise per day", type: "text", placeholder: "Walk, run, swim, cycle, aqua-jog, garden — about how many minutes", optional: true },
      { id: "sleep", label: "Sleep per day", type: "text", placeholder: "Number of hours", optional: true },
      { id: "meditation", label: "Do you meditate?", type: "text", optional: true },
      { id: "motivation", label: "What's important to you? What gets you out of bed in the morning?", type: "textarea", optional: true },
    ],
  },
  {
    id: "q15", number: 15, title: "What do you think? Your ideas, concerns and expectations",
    fields: [
      { id: "ideas", label: "What are your ideas about what is causing the pain?", type: "textarea", optional: true },
      { id: "concerns", label: "What are your concerns?", type: "textarea", subtitle: "e.g. cancer, fear of not recovering, fear of loss of job", optional: true },
      { id: "expectations", label: "What are your expectations from this consultation?", type: "textarea", optional: true },
      { id: "anythingElse", label: "Is there anything else you would like to mention?", type: "textarea", optional: true },
    ],
  },
];

export function sectionARequiredFieldIds(): string[] {
  return SECTION_A_QUESTIONS.flatMap(q => q.fields.filter(f => !f.optional).map(f => f.id));
}
