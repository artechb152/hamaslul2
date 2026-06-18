import contentLibraryJson from "@/data/contentLibrary.json";
import trainingTemplatesJson from "@/data/trainingTemplates.json";

export type TrainingTemplate = {
  id: string;
  category: string;
  title: string;
  targetAudience: string;
  recommendedDuration: string;
  learningObjectives: string[];
  openingActivity: {
    title: string;
    duration: string;
    instructions: string[];
  };
  agenda: Array<{
    time: string;
    title: string;
    purpose: string;
  }>;
  mainContentSections: Array<{
    title: string;
    duration: string;
    keyPoints: string[];
  }>;
  interactiveExercise: {
    title: string;
    duration: string;
    instructions: string[];
  };
  discussionQuestions: string[];
  summary: string[];
  knowledgeCheckQuestions: Array<{
    question: string;
    answer: string;
  }>;
};

export type ContentMode = "online" | "in-person" | "hybrid";

export type ContentLibraryItem = {
  id: string;
  type:
    | "iceBreaker"
    | "energizer"
    | "discussionQuestion"
    | "trainingActivity"
    | "rolePlayScenario";
  title: string;
  description: string;
  groupSize: string;
  duration: string;
  objective: string;
  mode: ContentMode;
};

export type ContentLibrary = {
  filters: {
    groupSizes: string[];
    durations: string[];
    objectives: string[];
    modes: ContentMode[];
  };
  iceBreakers: ContentLibraryItem[];
  energizers: ContentLibraryItem[];
  discussionQuestions: ContentLibraryItem[];
  trainingActivities: ContentLibraryItem[];
  rolePlayScenarios: ContentLibraryItem[];
};

export const trainingTemplates = trainingTemplatesJson as TrainingTemplate[];
export const contentLibrary = contentLibraryJson as ContentLibrary;

export const templateCategories = Array.from(
  new Set(trainingTemplates.map((template) => template.category)),
);

export function flattenContentLibrary() {
  return [
    ...contentLibrary.iceBreakers,
    ...contentLibrary.energizers,
    ...contentLibrary.discussionQuestions,
    ...contentLibrary.trainingActivities,
    ...contentLibrary.rolePlayScenarios,
  ];
}

export function templateToBuilderDraft(template: TrainingTemplate) {
  return {
    topic: template.title,
    audience: template.targetAudience,
    duration: template.recommendedDuration,
    objectives: template.learningObjectives.join("\n"),
    builderNotes: [
      `תבנית מקור: ${template.id} - ${template.title}`,
      `קטגוריה: ${template.category}`,
      "",
      "פעילות פתיחה:",
      `${template.openingActivity.title} (${template.openingActivity.duration})`,
      ...template.openingActivity.instructions.map((item) => `- ${item}`),
      "",
      "אג'נדה:",
      ...template.agenda.map((item) => `- ${item.time}: ${item.title} - ${item.purpose}`),
      "",
      "חלקי תוכן:",
      ...template.mainContentSections.flatMap((section) => [
        `- ${section.title} (${section.duration})`,
        ...section.keyPoints.map((point) => `  * ${point}`),
      ]),
      "",
      "תרגול אינטראקטיבי:",
      `${template.interactiveExercise.title} (${template.interactiveExercise.duration})`,
      ...template.interactiveExercise.instructions.map((item) => `- ${item}`),
      "",
      "שאלות דיון:",
      ...template.discussionQuestions.map((item) => `- ${item}`),
      "",
      "סיכום:",
      ...template.summary.map((item) => `- ${item}`),
      "",
      "בדיקת ידע:",
      ...template.knowledgeCheckQuestions.map(
        (item) => `- ${item.question} תשובה: ${item.answer}`,
      ),
    ].join("\n"),
  };
}

export function getContentTypeLabel(type: ContentLibraryItem["type"]) {
  const labels: Record<ContentLibraryItem["type"], string> = {
    iceBreaker: "שובר קרח",
    energizer: "אנרג'ייזר",
    discussionQuestion: "שאלת דיון",
    trainingActivity: "פעילות הדרכה",
    rolePlayScenario: "סימולציית תפקידים",
  };

  return labels[type];
}

export function getModeLabel(mode: ContentMode) {
  const labels: Record<ContentMode, string> = {
    online: "אונליין",
    "in-person": "פרונטלי",
    hybrid: "היברידי",
  };

  return labels[mode];
}
