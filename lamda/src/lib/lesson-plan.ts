export type TrainingBrief = {
  topic: string;
  audience: string;
  duration: string;
  objectives: string;
  builderNotes?: string;
};

export type AgendaItem = {
  time: string;
  title: string;
  purpose: string;
};

export type Activity = {
  title: string;
  duration: string;
  instructions: string[];
  materials: string[];
};

export type MainContentSection = {
  title: string;
  duration: string;
  keyIdeas: string[];
  facilitationNotes: string[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type TrainingPlan = {
  title: string;
  subtitle: string;
  learningObjectives: string[];
  agenda: AgendaItem[];
  openingActivity: Activity;
  mainContentSections: MainContentSection[];
  interactiveExercise: Activity;
  summary: {
    keyTakeaways: string[];
    closingScript: string;
  };
  knowledgeQuiz: QuizQuestion[];
};

export type GenerateState =
  | {
      status: "idle";
      message?: string;
      fieldErrors?: Partial<Record<keyof TrainingBrief, string>>;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof TrainingBrief, string>>;
    }
  | {
      status: "success";
      message: string;
      plan: TrainingPlan;
      brief: TrainingBrief;
      generatedAt: string;
    };

export const initialGenerateState: GenerateState = {
  status: "idle",
};

export const lessonPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "subtitle",
    "learningObjectives",
    "agenda",
    "openingActivity",
    "mainContentSections",
    "interactiveExercise",
    "summary",
    "knowledgeQuiz",
  ],
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    learningObjectives: {
      type: "array",
      minItems: 4,
      maxItems: 7,
      items: { type: "string" },
    },
    agenda: {
      type: "array",
      minItems: 5,
      maxItems: 9,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["time", "title", "purpose"],
        properties: {
          time: { type: "string" },
          title: { type: "string" },
          purpose: { type: "string" },
        },
      },
    },
    openingActivity: activitySchema(),
    mainContentSections: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "duration", "keyIdeas", "facilitationNotes"],
        properties: {
          title: { type: "string" },
          duration: { type: "string" },
          keyIdeas: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: { type: "string" },
          },
          facilitationNotes: {
            type: "array",
            minItems: 2,
            maxItems: 5,
            items: { type: "string" },
          },
        },
      },
    },
    interactiveExercise: activitySchema(),
    summary: {
      type: "object",
      additionalProperties: false,
      required: ["keyTakeaways", "closingScript"],
      properties: {
        keyTakeaways: {
          type: "array",
          minItems: 3,
          maxItems: 6,
          items: { type: "string" },
        },
        closingScript: { type: "string" },
      },
    },
    knowledgeQuiz: {
      type: "array",
      minItems: 5,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "options", "answer", "explanation"],
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: { type: "string" },
          },
          answer: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
  },
} as const;

function activitySchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["title", "duration", "instructions", "materials"],
    properties: {
      title: { type: "string" },
      duration: { type: "string" },
      instructions: {
        type: "array",
        minItems: 3,
        maxItems: 7,
        items: { type: "string" },
      },
      materials: {
        type: "array",
        minItems: 1,
        maxItems: 6,
        items: { type: "string" },
      },
    },
  } as const;
}

export function getFormValue(formData: FormData, key: keyof TrainingBrief) {
  return String(formData.get(key) ?? "").trim();
}

export function extractOutputText(response: unknown) {
  if (!isRecord(response)) {
    return "";
  }

  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  if (!Array.isArray(response.output)) {
    return "";
  }

  return response.output
    .flatMap((item) => (isRecord(item) && Array.isArray(item.content) ? item.content : []))
    .map((content) => {
      if (!isRecord(content)) {
        return "";
      }

      return typeof content.text === "string" ? content.text : "";
    })
    .join("")
    .trim();
}

export function assertTrainingPlan(value: unknown): TrainingPlan {
  if (!isRecord(value)) {
    throw new Error("Invalid plan payload");
  }

  const plan = value as Partial<TrainingPlan>;
  const hasRequiredCollections =
    Array.isArray(plan.learningObjectives) &&
    Array.isArray(plan.agenda) &&
    Array.isArray(plan.mainContentSections) &&
    Array.isArray(plan.knowledgeQuiz);

  if (
    typeof plan.title !== "string" ||
    typeof plan.subtitle !== "string" ||
    !hasRequiredCollections ||
    !isRecord(plan.openingActivity) ||
    !isRecord(plan.interactiveExercise) ||
    !isRecord(plan.summary)
  ) {
    throw new Error("Invalid plan shape");
  }

  return plan as TrainingPlan;
}

export function validateBrief(brief: TrainingBrief) {
  const fieldErrors: Partial<Record<keyof TrainingBrief, string>> = {};

  if (brief.topic.length < 3) {
    fieldErrors.topic = "נדרש נושא הדרכה ברור.";
  }

  if (brief.audience.length < 3) {
    fieldErrors.audience = "נדרש תיאור קצר של קהל היעד.";
  }

  if (!brief.duration) {
    fieldErrors.duration = "בחרו משך הדרכה.";
  }

  if (brief.objectives.length < 10) {
    fieldErrors.objectives = "כתבו לפחות מטרת למידה אחת.";
  }

  return fieldErrors;
}

export function createDemoLessonPlan(brief: TrainingBrief): TrainingPlan {
  const duration = brief.duration || "90 דקות";
  const objectives = splitObjectives(brief.objectives);
  const builderItems = splitObjectives(brief.builderNotes ?? "").slice(0, 6);

  return {
    title: `מערך הדרכה: ${brief.topic}`,
    subtitle: `תוכנית דמו מקומית עבור ${brief.audience}, למשך ${duration}. התוצר בנוי כתבנית מקצועית וניתן לעריכה לפני העברה.`,
    learningObjectives: [
      ...objectives.slice(0, 3),
      `להסביר את עקרונות היסוד של ${brief.topic} בשפה ברורה ומעשית.`,
      `ליישם את הנלמד בתרחיש עבודה רלוונטי עבור ${brief.audience}.`,
      "לזהות טעויות נפוצות ולנסח דרכי פעולה לשיפור לאחר ההדרכה.",
    ].slice(0, 6),
    agenda: [
      {
        time: "0-10 דקות",
        title: "פתיחה ומיפוי ציפיות",
        purpose: "יצירת הקשר לנושא, איסוף ידע קודם וחיבור לצרכים של המשתתפים.",
      },
      {
        time: "10-25 דקות",
        title: "הצגת מושגי בסיס",
        purpose: `בניית שפה משותפת סביב ${brief.topic} והסבר המונחים המרכזיים.`,
      },
      {
        time: "25-45 דקות",
        title: "הדגמה מודרכת",
        purpose: "הצגת דוגמה מלאה של יישום נכון, כולל החלטות ושיקולים מקצועיים.",
      },
      {
        time: "45-65 דקות",
        title: "תרגול בקבוצות",
        purpose: "העברת האחריות למשתתפים דרך עבודה על תרחיש קצר ומשוב עמיתים.",
      },
      {
        time: "65-80 דקות",
        title: "דיון, תובנות וסיכום",
        purpose: "עיבוד הלמידה, חידוד מסרים מרכזיים והכנה ליישום בעבודה.",
      },
      {
        time: "80-90 דקות",
        title: "בוחן ידע והתחייבות לפעולה",
        purpose: "בדיקת הבנה ובחירת פעולה אחת ליישום לאחר ההדרכה.",
      },
    ],
    openingActivity: {
      title: "דקת מצב: מה כבר עובד ומה עדיין קשה",
      duration: "10 דקות",
      materials: ["לוח או מסמך משותף", "פתקיות", "טיימר"],
      instructions: [
        `בקשו מכל משתתף לכתוב דוגמה אחת שבה ${brief.topic} כבר פוגש אותו בעבודה.`,
        "אספו 3-4 דוגמאות בקול רם וסמנו דפוסים שחוזרים על עצמם.",
        "נסחו יחד שאלה מרכזית שתלווה את ההדרכה.",
        "חברו את השאלה למטרות הלמידה ולתוצר המצופה בסיום.",
      ],
    },
    mainContentSections: [
      {
        title: "מסגרת חשיבה מקצועית",
        duration: "20 דקות",
        keyIdeas: [
          `מהו ${brief.topic} ומה אינו חלק ממנו.`,
          "אילו החלטות המשתתפים צריכים לקבל בזמן אמת.",
          "איך מבחינים בין הבנה תאורטית לבין יישום איכותי.",
        ],
        facilitationNotes: [
          "השתמשו בדוגמאות מתוך סביבת העבודה של המשתתפים.",
          "שמרו על הסבר קצר והעבירו מהר לדוגמאות מעשיות.",
          "בדקו הבנה באמצעות שאלות קצרות ולא באמצעות הרצאה ארוכה.",
        ],
      },
      {
        title: "דוגמאות וניתוח מקרים",
        duration: "20 דקות",
        keyIdeas: [
          "תרחיש טוב כולל הקשר, מגבלה, החלטה ותוצאה.",
          "ניתוח מקרה עוזר לחשוף הנחות סמויות וטעויות נפוצות.",
          "השוואה בין שתי דרכי פעולה מחדדת שיקול דעת מקצועי.",
        ],
        facilitationNotes: [
          "בחרו מקרה אחד פשוט ומקרה אחד מורכב יותר.",
          "שאלו מה המשתתפים היו עושים לפני שמציגים פתרון.",
          "חזקו תשובות שמבוססות על עיקרון ולא רק על אינטואיציה.",
        ],
      },
      {
        title: "יישום בתפקיד",
        duration: "20 דקות",
        keyIdeas: [
          `כיצד ${brief.audience} יכול להשתמש בנושא כבר השבוע.`,
          "איך מתרגמים ידע לכללי עבודה קצרים וברורים.",
          "כיצד מודדים הצלחה לאחר ההדרכה.",
        ],
        facilitationNotes: [
          "הובילו את המשתתפים לנסח פעולה קטנה ומדידה.",
          "עודדו התאמות לתפקידים שונים בקבוצה.",
          "סיימו עם התחייבות אישית או צוותית אחת.",
        ],
      },
      ...(builderItems.length > 0
        ? [
            {
              title: "פריטים שנוספו מספריית התוכן",
              duration: "15 דקות",
              keyIdeas: builderItems.slice(0, 3),
              facilitationNotes: [
                "בחרו את הפריטים המתאימים ביותר לקהל ולזמן בפועל.",
                "שלבו את הפריטים כרצף קצר: פתיחה, תרגול, עיבוד וסיכום.",
                "התייחסו לפריטים כבסיס לעריכה ולא כהוראה קשיחה.",
              ],
            },
          ]
        : []),
    ],
    interactiveExercise: {
      title: "מעבדה קצרה: בונים פתרון לתרחיש",
      duration: "20 דקות",
      materials: ["דף תרחיש", "טבלת החלטות", "לוח להצגת תוצרים"],
      instructions: [
        "חלקו את המשתתפים לזוגות או שלשות.",
        `תנו לכל קבוצה תרחיש קצר שקשור ל-${brief.topic}.`,
        ...(builderItems[0] ? [`שלבו בתרגול את הפריט: ${builderItems[0]}.`] : []),
        "בקשו מהם לנסח דרך פעולה, סיכון אפשרי ומדד הצלחה.",
        "כל קבוצה מציגה תובנה אחת ותיקון אחד שהייתה מבצעת בפעם הבאה.",
        "סכמו את התרגול לשלושה כללי עבודה מעשיים.",
      ],
    },
    summary: {
      keyTakeaways: [
        `הדרכה על ${brief.topic} צריכה לחבר בין מושגים, דוגמאות ויישום.`,
        "למידה אפקטיבית נוצרת כאשר המשתתפים מתרגלים החלטות אמיתיות.",
        "סיכום טוב מסתיים בפעולה מדידה ולא רק בהבנה כללית.",
      ],
      closingScript: `לסיום, בקשו מכל משתתף לבחור פעולה אחת מתוך ההדרכה שהוא ינסה ליישם השבוע. הדגישו שהמטרה אינה שלמות, אלא התקדמות קטנה וברורה בנושא ${brief.topic}.`,
    },
    knowledgeQuiz: [
      {
        question: `מה המטרה המרכזית של ההדרכה בנושא ${brief.topic}?`,
        options: [
          "להעביר כמה שיותר מידע בזמן קצר",
          "ליצור הבנה ויכולת יישום מעשית",
          "להחליף תרגול בהרצאה תאורטית",
          "להציג רק דוגמאות ללא סיכום",
        ],
        answer: "ליצור הבנה ויכולת יישום מעשית",
        explanation: "הדרכה מקצועית נמדדת ביכולת המשתתפים להשתמש בידע לאחר המפגש.",
      },
      {
        question: "מה כדאי לכלול בתרגול אינטראקטיבי?",
        options: [
          "תרחיש, החלטה, משוב ותובנה",
          "רק קריאת טקסט",
          "שאלון ארוך ללא דיון",
          "הצגת שקפים ללא פעולה",
        ],
        answer: "תרחיש, החלטה, משוב ותובנה",
        explanation: "תרגול טוב מחבר בין מצב אמיתי, פעולה ועיבוד למידה.",
      },
      {
        question: "למה חשוב להתאים את המערך לקהל היעד?",
        options: [
          "כדי להאריך את ההדרכה",
          "כדי להשתמש במונחים מורכבים יותר",
          "כדי שהדוגמאות והמשימות יהיו רלוונטיות",
          "כדי לוותר על מטרות למידה",
        ],
        answer: "כדי שהדוגמאות והמשימות יהיו רלוונטיות",
        explanation: "רלוונטיות מעלה מעורבות ומקלה על יישום לאחר ההדרכה.",
      },
      {
        question: "מהו סיכום הדרכה איכותי?",
        options: [
          "חזרה על כל השקפים",
          "רשימת מושגים ללא הקשר",
          "חיבור בין תובנות לפעולה הבאה",
          "סיום ללא בדיקת הבנה",
        ],
        answer: "חיבור בין תובנות לפעולה הבאה",
        explanation: "סיכום צריך לעזור למשתתפים לדעת מה לעשות עם מה שלמדו.",
      },
      {
        question: "מה תפקיד בוחן הידע בסוף ההדרכה?",
        options: [
          "להלחיץ את המשתתפים",
          "לבדוק הבנה ולחזק מסרים מרכזיים",
          "להחליף את התרגול",
          "לסיים מהר יותר",
        ],
        answer: "לבדוק הבנה ולחזק מסרים מרכזיים",
        explanation: "בוחן קצר מסמן למנחה מה הובן ומסייע למשתתפים לעבד את הלמידה.",
      },
    ],
  };
}

function splitObjectives(objectives: string) {
  return objectives
    .split(/\r?\n|;|,/)
    .map((objective) => objective.trim())
    .filter((objective) => objective.length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
