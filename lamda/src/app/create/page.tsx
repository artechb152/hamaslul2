import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/app-shell";
import { TrainingForm } from "@/components/training-form";

export default function CreatePage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-4rem)] overflow-hidden bg-[#05050b] text-white">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_16%_12%,rgba(143,92,255,0.24),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(34,211,238,0.16),transparent_28%)]" />
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <aside className="relative grid content-start gap-6">
            <Link
              href="/"
              className="focus-ring inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-white/55 hover:text-white"
            >
              <ArrowRight size={16} aria-hidden="true" />
              חזרה לדף הבית
            </Link>
            <div className="grid gap-4">
              <p className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm font-medium text-[#8beeff]">
                יצירת מערך הדרכה
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                ספרו ללמדא מה צריך ללמד
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/60">
                המערכת תבנה מערך מלא בעברית, כולל מטרות למידה, רצף זמנים, פעילויות,
                תרגול ובוחן ידע.
              </p>
            </div>
            <div className="grid gap-3 rounded-md border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 font-semibold">
                <LockKeyhole size={18} aria-hidden="true" />
                מקומי כברירת מחדל
              </div>
              <p className="text-sm leading-6 text-white/58">
                אפשר לעבוד עם דמו מקומי, תבניות ופריטי תוכן ללא API חיצוני.
              </p>
            </div>
            <Link
              href="/templates"
              className="focus-ring inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 font-semibold text-white hover:bg-white/[0.1]"
            >
              <BookOpen size={17} />
              בחירת תבנית
            </Link>
          </aside>

          <section className="relative rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="grid size-10 place-items-center rounded-md bg-white text-[#090914]">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">פרטי ההדרכה</h2>
                <p className="text-sm text-white/50">אפשר להתחיל מאפס או מתבנית מוכנה.</p>
              </div>
            </div>
            <TrainingForm />
          </section>
        </section>
      </main>
    </>
  );
}
