import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  BrainCircuit,
  Database,
  Layers3,
  Sparkles,
} from "lucide-react";
import { AppFooter, AppHeader } from "@/components/app-shell";
import { contentLibrary, templateCategories, trainingTemplates } from "@/lib/catalog";

export default function Home() {
  const contentCount =
    contentLibrary.iceBreakers.length +
    contentLibrary.energizers.length +
    contentLibrary.discussionQuestions.length +
    contentLibrary.trainingActivities.length +
    contentLibrary.rolePlayScenarios.length;

  return (
    <>
      <AppHeader />
      <main className="overflow-hidden bg-[#05050b] text-white">
        <section className="soft-grid relative min-h-[88vh] border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(143,92,255,0.33),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.2),transparent_28%),linear-gradient(to_bottom,transparent_40%,#05050b_95%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:grid-cols-[1fr_480px] lg:items-center lg:px-8">
            <div className="max-w-4xl">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-[#8beeff] backdrop-blur-xl">
                <Sparkles size={16} />
                פלטפורמת הדרכה מקומית בעברית
              </p>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-normal sm:text-7xl">
                למדא בונה מערכי הדרכה, תבניות וספריית תוכן במקום אחד
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-white/62">
                ממשק RTL כהה, תבניות מקצועיות, פעילויות מוכנות ובונה מערכי שיעור
                שעובד גם במצב דמו מקומי ללא API חיצוני.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/templates"
                  className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-base font-semibold text-[#090914] transition hover:bg-[#e9ddff]"
                >
                  בחירת תבנית
                  <ArrowLeft size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/library"
                  className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-5 text-base font-semibold text-white transition hover:bg-white/[0.1]"
                >
                  ספריית תוכן
                  <BookOpen size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/35 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/45">Local training OS</p>
                  <h2 className="text-2xl font-semibold">מאגר למדא</h2>
                </div>
                <BrainCircuit className="text-[#c6b8ff]" size={28} />
              </div>
              <div className="grid gap-3">
                <Metric icon={<Layers3 size={18} />} label="תבניות הדרכה" value={trainingTemplates.length} />
                <Metric icon={<Database size={18} />} label="קטגוריות" value={templateCategories.length} />
                <Metric icon={<Boxes size={18} />} label="פריטי תוכן" value={contentCount} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <Feature
            title="תבניות מקצועיות"
            text="קליטת עובדים, שירות, מכירות, ניהול, אבטחת מידע, בטיחות ועוד."
          />
          <Feature
            title="ספריית תוכן"
            text="שוברי קרח, אנרג'ייזרים, שאלות דיון, פעילויות וסימולציות."
          />
          <Feature
            title="בונה מערך"
            text="טעינת תבנית ופריטי תוכן ישירות לטופס יצירת מערך השיעור."
          />
        </section>
      </main>
      <AppFooter />
    </>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-black/25 px-4 py-3">
      <span className="flex items-center gap-2 text-white/58">
        {icon}
        {label}
      </span>
      <span className="text-2xl font-semibold text-white">{value}</span>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 leading-7 text-white/58">{text}</p>
    </article>
  );
}
