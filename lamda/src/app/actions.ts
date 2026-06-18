"use server";

import {
  assertTrainingPlan,
  createDemoLessonPlan,
  extractOutputText,
  getFormValue,
  lessonPlanSchema,
  type GenerateState,
  type TrainingBrief,
  validateBrief,
} from "@/lib/lesson-plan";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.5";

export async function generateLessonPlan(
  _previousState: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  const brief: TrainingBrief = {
    topic: getFormValue(formData, "topic"),
    audience: getFormValue(formData, "audience"),
    duration: getFormValue(formData, "duration"),
    objectives: getFormValue(formData, "objectives"),
    builderNotes: getFormValue(formData, "builderNotes"),
  };

  const fieldErrors = validateBrief(brief);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "יש להשלים את הפרטים החסרים לפני יצירת ההדרכה.",
      fieldErrors,
    };
  }

  if (shouldUseDemoMode()) {
    return createSuccessState(
      brief,
      "נוצר מערך הדרכה במצב דמו מקומי, ללא שימוש ב-OpenAI.",
    );
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text:
                  "You are an expert Hebrew instructional designer. Create practical, professional training lesson plans in modern Hebrew. Keep the plan realistic for the requested duration, suitable for workplace training, and ready for a facilitator to deliver. Return only schema-valid JSON.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  `נושא ההדרכה: ${brief.topic}`,
                  `קהל יעד: ${brief.audience}`,
                  `משך ההדרכה: ${brief.duration}`,
                  `מטרות למידה שהמשתמש הגדיר: ${brief.objectives}`,
                  brief.builderNotes
                    ? `פריטי תבנית וספריית תוכן לשילוב: ${brief.builderNotes}`
                    : "",
                  "צרו מערך שיעור מלא הכולל מטרות למידה, אג'נדה וזמנים, פעילות פתיחה, חלקי תוכן מרכזיים, תרגול אינטראקטיבי, סיכום ובוחן ידע.",
                ]
                  .filter(Boolean)
                  .join("\n"),
              },
            ],
          },
        ],
        max_output_tokens: 6000,
        reasoning: {
          effort: "low",
        },
        text: {
          verbosity: "medium",
          format: {
            type: "json_schema",
            name: "hebrew_training_lesson_plan",
            strict: true,
            schema: lessonPlanSchema,
          },
        },
      }),
    });

    const payload: unknown = await response.json();

    if (!response.ok) {
      const errorCode = getOpenAIErrorCode(payload);

      if (errorCode === "insufficient_quota" || errorCode === "invalid_api_key") {
        return createSuccessState(
          brief,
          "OpenAI לא זמין כרגע, לכן נוצר מערך הדרכה במצב דמו מקומי.",
        );
      }

      return {
        status: "error",
        message: getOpenAIErrorMessage(payload),
      };
    }

    const outputText = extractOutputText(payload);

    if (!outputText) {
      return {
        status: "error",
        message: "המודל לא החזיר תוכן תקין. נסו שוב עם תיאור ממוקד יותר.",
      };
    }

    const plan = assertTrainingPlan(JSON.parse(outputText));

    return {
      status: "success",
      message: "מערך ההדרכה נוצר בהצלחה.",
      plan,
      brief,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(error);

    return createSuccessState(
      brief,
      "החיבור ל-OpenAI לא הצליח, לכן נוצר מערך הדרכה במצב דמו מקומי.",
    );
  }
}

function createSuccessState(brief: TrainingBrief, message: string): GenerateState {
  return {
    status: "success",
    message,
    plan: createDemoLessonPlan(brief),
    brief,
    generatedAt: new Date().toISOString(),
  };
}

function shouldUseDemoMode() {
  if (process.env.OPENAI_DEMO_MODE === "true") {
    return true;
  }

  return !hasUsableOpenAIKey(process.env.OPENAI_API_KEY);
}

function hasUsableOpenAIKey(apiKey?: string) {
  const key = apiKey?.trim();

  return Boolean(key && key.startsWith("sk-") && key.length > 40);
}

function getOpenAIErrorCode(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "code" in payload.error &&
    typeof payload.error.code === "string"
  ) {
    return payload.error.code;
  }

  return null;
}

function getOpenAIErrorMessage(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    if (
      "code" in payload.error &&
      payload.error.code === "insufficient_quota"
    ) {
      return "המפתח תקין, אבל לחשבון OpenAI אין כרגע קרדיט או מכסה זמינה. יש לבדוק Billing/Usage בפלטפורמת OpenAI.";
    }

    if ("code" in payload.error && payload.error.code === "invalid_api_key") {
      return "מפתח OpenAI לא תקין. בדקו שהערך ב-OPENAI_API_KEY הועתק במלואו וללא רווחים.";
    }

    return payload.error.message;
  }

  return "בקשת OpenAI נכשלה. בדקו את מפתח ה-API, המודל והרשאות החשבון.";
}
