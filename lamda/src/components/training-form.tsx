"use client";

import { useActionState, useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles, X } from "lucide-react";
import { generateLessonPlan } from "@/app/actions";
import { initialGenerateState, type GenerateState } from "@/lib/lesson-plan";
import {
  builderDraftKey,
  builderItemsKey,
  type BuilderDraft,
  type BuilderLibraryItem,
} from "@/lib/builder-storage";

const storageKey = "lamda:last-plan";

const durationOptions = [
  "45 דקות",
  "60 דקות",
  "90 דקות",
  "120 דקות",
  "חצי יום",
  "יום מלא",
];

export function TrainingForm() {
  const router = useRouter();
  const rawDraft = useSyncExternalStore(noopSubscribe, getDraftSnapshot, getNullSnapshot);
  const rawItems = useSyncExternalStore(noopSubscribe, getItemsSnapshot, getNullSnapshot);
  const [state, formAction, isPending] = useActionState<GenerateState, FormData>(
    generateLessonPlan,
    initialGenerateState,
  );

  const draft = useMemo(() => parseJson<BuilderDraft>(rawDraft), [rawDraft]);
  const builderItems = useMemo(
    () => parseJson<BuilderLibraryItem[]>(rawItems) ?? [],
    [rawItems],
  );
  const builderNotes = useMemo(
    () =>
      [
        draft?.builderNotes,
        ...builderItems.map(
          (item) =>
            `${item.typeLabel}: ${item.title} | ${item.description} | ${item.duration}, ${item.groupSize}, ${item.modeLabel}`,
        ),
      ]
        .filter(Boolean)
        .join("\n"),
    [builderItems, draft?.builderNotes],
  );

  useEffect(() => {
    if (state.status === "success") {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
      router.push("/results");
    }
  }, [router, state]);

  return (
    <form
      key={`${rawDraft ?? "empty"}-${rawItems ?? "none"}`}
      action={formAction}
      className="grid gap-5"
    >
      {draft || builderItems.length > 0 ? (
        <div className="rounded-md border border-[#8f5cff]/30 bg-[#8f5cff]/10 p-4 text-sm text-[#d4c8ff]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-semibold text-white">נטען לבונה המערך</p>
            <button
              type="button"
              onClick={clearBuilderContext}
              className="focus-ring inline-flex size-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:bg-white/10"
              aria-label="ניקוי תבנית ופריטי תוכן"
            >
              <X size={16} />
            </button>
          </div>
          {draft ? <p>תבנית מוכנה נטענה לשדות הטופס.</p> : null}
          {builderItems.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {builderItems.map((item) => (
                <li key={item.id} className="rounded-md bg-black/25 px-3 py-2">
                  {item.typeLabel}: {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <textarea name="builderNotes" value={builderNotes} readOnly hidden />

      <Field
        label="נושא ההדרכה"
        error={state.status === "error" ? state.fieldErrors?.topic : undefined}
      >
        <input
          name="topic"
          required
          minLength={3}
          defaultValue={draft?.topic}
          placeholder="לדוגמה: שימוש אחראי ב-AI בצוותי מכירות"
          className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition placeholder:text-white/35"
        />
      </Field>

      <Field
        label="קהל יעד"
        error={state.status === "error" ? state.fieldErrors?.audience : undefined}
      >
        <input
          name="audience"
          required
          minLength={3}
          defaultValue={draft?.audience}
          placeholder="לדוגמה: מנהלי צוותים ללא רקע טכנולוגי"
          className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition placeholder:text-white/35"
        />
      </Field>

      <Field
        label="משך ההדרכה"
        error={state.status === "error" ? state.fieldErrors?.duration : undefined}
      >
        <select
          name="duration"
          required
          defaultValue={draft?.duration ?? "90 דקות"}
          className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition"
        >
          {durationOptions.map((duration) => (
            <option key={duration}>{duration}</option>
          ))}
        </select>
      </Field>

      <Field
        label="מטרות למידה"
        error={state.status === "error" ? state.fieldErrors?.objectives : undefined}
      >
        <textarea
          name="objectives"
          required
          minLength={10}
          rows={5}
          defaultValue={draft?.objectives}
          placeholder="מה המשתתפים צריכים לדעת, לתרגל או להצליח לעשות בסוף ההדרכה?"
          className="focus-ring min-h-32 w-full resize-y rounded-md border border-white/10 bg-black/35 px-4 py-3 text-base leading-7 text-white outline-none transition placeholder:text-white/35"
        />
      </Field>

      {state.status === "error" ? (
        <div className="rounded-md border border-[#e6b1aa] bg-[#fff3f1] px-4 py-3 text-sm text-[#9f2a1f]">
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-base font-semibold text-[#090914] transition hover:bg-[#e9ddff] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isPending ? (
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
        ) : (
          <Sparkles size={18} aria-hidden="true" />
        )}
        <span>{isPending ? "יוצר מערך..." : "יצירת מערך הדרכה"}</span>
        <ArrowLeft size={18} aria-hidden="true" />
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white/80">
      <span className="flex items-center justify-between gap-3">
        {label}
        {error ? <span className="text-xs text-[#a63a2c]">{error}</span> : null}
      </span>
      {children}
    </label>
  );
}

function noopSubscribe() {
  return () => undefined;
}

function getDraftSnapshot() {
  return sessionStorage.getItem(builderDraftKey);
}

function getItemsSnapshot() {
  return sessionStorage.getItem(builderItemsKey);
}

function getNullSnapshot() {
  return null;
}

function parseJson<T>(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function clearBuilderContext() {
  sessionStorage.removeItem(builderDraftKey);
  sessionStorage.removeItem(builderItemsKey);
  window.location.reload();
}
