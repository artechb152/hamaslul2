"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clipboard,
  Clock3,
  Download,
  FileText,
  ListChecks,
  Plus,
  Printer,
} from "lucide-react";
import type { GenerateState, TrainingPlan } from "@/lib/lesson-plan";

const storageKey = "lamda:last-plan";

export function ResultsView() {
  const rawState = useSyncExternalStore(subscribeToStoredPlan, getStoredPlan, getServerPlan);
  const [copyLabel, setCopyLabel] = useState("העתקה");

  const state = useMemo(() => {
    if (!rawState) {
      return null;
    }
    try {
      return JSON.parse(rawState) as GenerateState;
    } catch {
      return null;
    }
  }, [rawState]);

  const markdown = useMemo(() => {
    if (state?.status !== "success") {
      return "";
    }

    return toMarkdown(state.plan);
  }, [state]);

  async function copyPlan() {
    if (!markdown) {
      return;
    }

    await navigator.clipboard.writeText(markdown);
    setCopyLabel("הועתק");
    window.setTimeout(() => setCopyLabel("העתקה"), 1600);
  }

  function downloadPlan() {
    if (!markdown) {
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lamda-lesson-plan.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (state?.status !== "success") {
    return (
      <section className="mx-auto grid min-h-[68vh] w-full max-w-3xl place-items-center bg-[#05050b] px-4 py-16 text-center text-white sm:px-6">
        <div className="grid gap-5">
          <div className="mx-auto grid size-14 place-items-center rounded-lg border border-white/10 bg-white/[0.08] text-[#8beeff] shadow-sm">
            <FileText size={24} aria-hidden="true" />
          </div>
          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">עדיין אין תוצאה להצגה</h1>
            <p className="text-white/58">
              צרו מערך הדרכה חדש, והתוצאה תופיע כאן מיד לאחר השליחה.
            </p>
          </div>
          <Link
            href="/create"
            className="focus-ring mx-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 font-semibold text-[#090914]"
          >
            <Plus size={18} aria-hidden="true" />
            יצירת הדרכה
          </Link>
        </div>
      </section>
    );
  }

  const { plan, brief, generatedAt } = state;

  return (
    <main className="bg-[#05050b] text-white">
      <section className="border-b border-white/10 bg-[#090914]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/create"
            className="focus-ring inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-white/55 hover:text-white"
          >
            <ArrowRight size={16} aria-hidden="true" />
            חזרה לטופס
          </Link>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3">
              <p className="text-sm font-semibold text-[#8beeff]">מערך נוצר</p>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-5xl">
                {plan.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-white/58">{plan.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={copyPlan} icon={<Clipboard size={17} />}>
                {copyLabel}
              </ActionButton>
              <ActionButton onClick={downloadPlan} icon={<Download size={17} />}>
                הורדה
              </ActionButton>
              <ActionButton onClick={() => window.print()} icon={<Printer size={17} />}>
                הדפסה
              </ActionButton>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-white/58">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">{brief.topic}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">{brief.audience}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">{brief.duration}</span>
            <span className="rounded-full bg-[#8beeff]/12 px-3 py-1 text-[#8beeff]">
              {new Intl.DateTimeFormat("he-IL", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(generatedAt))}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit rounded-md border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl lg:sticky lg:top-24">
          <p className="mb-3 text-sm font-semibold">ניווט במערך</p>
          <nav className="grid gap-1 text-sm text-white/58">
            {[
              ["objectives", "מטרות למידה"],
              ["agenda", "אג'נדה וזמנים"],
              ["opening", "פעילות פתיחה"],
              ["content", "חלקי תוכן"],
              ["exercise", "תרגול אינטראקטיבי"],
              ["summary", "סיכום"],
              ["quiz", "בוחן ידע"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={`#${href}`}
                className="focus-ring rounded-md px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-5">
          <ResultSection id="objectives" title="מטרות למידה" icon={<ListChecks size={18} />}>
            <BulletList items={plan.learningObjectives} />
          </ResultSection>

          <ResultSection id="agenda" title="אג'נדה וזמנים" icon={<Clock3 size={18} />}>
            <div className="grid gap-3">
              {plan.agenda.map((item) => (
                <div
                  key={`${item.time}-${item.title}`}
                  className="grid gap-3 rounded-md border border-white/10 bg-black/20 p-4 sm:grid-cols-[120px_1fr]"
                >
                  <div className="font-mono text-sm font-semibold text-[#8beeff]">{item.time}</div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/58">{item.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </ResultSection>

          <ActivitySection id="opening" title="פעילות פתיחה" activity={plan.openingActivity} />

          <ResultSection id="content" title="חלקי תוכן מרכזיים">
            <div className="grid gap-4">
              {plan.mainContentSections.map((section) => (
                <article key={section.title} className="rounded-md border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-white/58">
                      {section.duration}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-semibold">רעיונות מרכזיים</p>
                      <BulletList items={section.keyIdeas} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold">הערות הנחיה</p>
                      <BulletList items={section.facilitationNotes} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ResultSection>

          <ActivitySection id="exercise" title="תרגול אינטראקטיבי" activity={plan.interactiveExercise} />

          <ResultSection id="summary" title="סיכום">
            <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="mb-2 text-sm font-semibold">נקודות לקחת הלאה</p>
                <BulletList items={plan.summary.keyTakeaways} />
              </div>
              <div className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm font-semibold">טקסט סיום למנחה</p>
                <p className="leading-7 text-white/62">{plan.summary.closingScript}</p>
              </div>
            </div>
          </ResultSection>

          <ResultSection id="quiz" title="בוחן ידע">
            <div className="grid gap-4">
              {plan.knowledgeQuiz.map((question, index) => (
                <article key={question.question} className="rounded-md border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold">
                    {index + 1}. {question.question}
                  </h3>
                  <ol className="mt-3 grid gap-2 text-sm text-white/58">
                    {question.options.map((option) => (
                      <li key={option} className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2">
                        {option}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-sm font-semibold text-[#8beeff]">תשובה: {question.answer}</p>
                  <p className="mt-1 text-sm leading-6 text-white/58">{question.explanation}</p>
                </article>
              ))}
            </div>
          </ResultSection>
        </div>
      </section>
    </main>
  );
}

function subscribeToStoredPlan() {
  return () => undefined;
}

function getStoredPlan() {
  return sessionStorage.getItem(storageKey);
}

function getServerPlan() {
  return null;
}

function ActionButton({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex h-10 min-w-24 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
    >
      {icon}
      {children}
    </button>
  );
}

function ResultSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-md border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/10">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ActivitySection({
  id,
  title,
  activity,
}: {
  id: string;
  title: string;
  activity: TrainingPlan["openingActivity"];
}) {
  return (
    <ResultSection id={id} title={title}>
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h3 className="text-lg font-semibold">{activity.title}</h3>
          <p className="mt-1 text-sm text-[#8beeff]">{activity.duration}</p>
          <p className="mb-2 mt-5 text-sm font-semibold">חומרים</p>
          <BulletList items={activity.materials} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">הנחיות ביצוע</p>
          <BulletList items={activity.instructions} />
        </div>
      </div>
    </ResultSection>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-white/60">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#8beeff]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function toMarkdown(plan: TrainingPlan) {
  const lines = [
    `# ${plan.title}`,
    "",
    plan.subtitle,
    "",
    "## מטרות למידה",
    ...plan.learningObjectives.map((item) => `- ${item}`),
    "",
    "## אג'נדה וזמנים",
    ...plan.agenda.map((item) => `- ${item.time} - ${item.title}: ${item.purpose}`),
    "",
    "## פעילות פתיחה",
    `### ${plan.openingActivity.title} (${plan.openingActivity.duration})`,
    ...plan.openingActivity.instructions.map((item) => `- ${item}`),
    "",
    "## חלקי תוכן מרכזיים",
    ...plan.mainContentSections.flatMap((section) => [
      `### ${section.title} (${section.duration})`,
      "רעיונות מרכזיים:",
      ...section.keyIdeas.map((item) => `- ${item}`),
      "הערות הנחיה:",
      ...section.facilitationNotes.map((item) => `- ${item}`),
      "",
    ]),
    "## תרגול אינטראקטיבי",
    `### ${plan.interactiveExercise.title} (${plan.interactiveExercise.duration})`,
    ...plan.interactiveExercise.instructions.map((item) => `- ${item}`),
    "",
    "## סיכום",
    ...plan.summary.keyTakeaways.map((item) => `- ${item}`),
    plan.summary.closingScript,
    "",
    "## בוחן ידע",
    ...plan.knowledgeQuiz.flatMap((item, index) => [
      `${index + 1}. ${item.question}`,
      ...item.options.map((option) => `   - ${option}`),
      `   תשובה: ${item.answer}`,
      `   הסבר: ${item.explanation}`,
      "",
    ]),
  ];

  return lines.join("\n");
}
