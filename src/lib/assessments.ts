import type { ODIQuestion, HADSQuestion, ScoreCategory } from './types';

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

export const HADS_QUESTIONS: HADSQuestion[] = [
  { id: "h1",  type: "A", text: "I feel tense or \"wound up\"",                                                       opts: ["Not at all", "From time to time, occasionally", "A lot of the time", "Most of the time"],             scores: [0,1,2,3] },
  { id: "h2",  type: "D", text: "I still enjoy the things I used to enjoy",                                           opts: ["Definitely as much", "Not quite so much", "Only a little", "Hardly at all"],                       scores: [0,1,2,3] },
  { id: "h3",  type: "A", text: "I get a frightened feeling as if something awful is about to happen",                opts: ["Not at all", "A little, but it doesn't worry me", "Yes, but not too badly", "Very definitely and quite badly"], scores: [0,1,2,3] },
  { id: "h4",  type: "D", text: "I can laugh and see the funny side of things",                                       opts: ["As much as I always could", "Not quite so much now", "Definitely not so much now", "Not at all"],    scores: [0,1,2,3] },
  { id: "h5",  type: "A", text: "Worrying thoughts go through my mind",                                               opts: ["Only occasionally", "From time to time, but not too often", "A lot of the time", "A great deal of the time"], scores: [0,1,2,3] },
  { id: "h6",  type: "D", text: "I feel cheerful",                                                                    opts: ["Most of the time", "Sometimes", "Not often", "Not at all"],                                         scores: [0,1,2,3] },
  { id: "h7",  type: "A", text: "I can sit at ease and feel relaxed",                                                 opts: ["Definitely", "Usually", "Not often", "Not at all"],                                                scores: [0,1,2,3] },
  { id: "h8",  type: "D", text: "I feel as if I am slowed down",                                                      opts: ["Not at all", "Sometimes", "Very often", "Nearly all the time"],                                    scores: [0,1,2,3] },
  { id: "h9",  type: "A", text: "I get a sort of frightened feeling like \"butterflies\" in the stomach",              opts: ["Not at all", "Occasionally", "Quite often", "Very often"],                                          scores: [0,1,2,3] },
  { id: "h10", type: "D", text: "I have lost interest in my appearance",                                              opts: ["I take just as much care as ever", "I may not take quite as much care", "I don't take as much care as I should", "Definitely"], scores: [0,1,2,3] },
  { id: "h11", type: "A", text: "I feel restless as I have to be on the move",                                        opts: ["Not at all", "Not very much", "Quite a lot", "Very much indeed"],                                   scores: [0,1,2,3] },
  { id: "h12", type: "D", text: "I look forward with enjoyment to things",                                            opts: ["As much as I ever did", "Rather less than I used to", "Definitely less than I used to", "Hardly at all"], scores: [0,1,2,3] },
  { id: "h13", type: "A", text: "I get sudden feelings of panic",                                                     opts: ["Not at all", "Not very often", "Quite often", "Very often indeed"],                                  scores: [0,1,2,3] },
  { id: "h14", type: "D", text: "I can enjoy a good book, radio or TV programme",                                     opts: ["Often", "Sometimes", "Not often", "Very seldom"],                                                   scores: [0,1,2,3] },
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

export function calcHADS(answers: Record<string, number>): { a: number; d: number } {
  let a = 0, d = 0;
  HADS_QUESTIONS.forEach(q => {
    const val = answers[q.id];
    if (val !== undefined) {
      if (q.type === "A") a += q.scores[val];
      else d += q.scores[val];
    }
  });
  return { a, d };
}

export function hadsCategory(score: number): ScoreCategory {
  if (score <= 7)  return { label: "Normal",     color: "green"  };
  if (score <= 10) return { label: "Borderline", color: "yellow" };
  return                   { label: "Abnormal",  color: "red"    };
}
