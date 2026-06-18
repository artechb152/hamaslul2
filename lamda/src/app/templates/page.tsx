import { Database, Layers3, Search } from "lucide-react";
import { AppHeader } from "@/components/app-shell";
import { TemplatesBrowser } from "@/components/templates-browser";
import { templateCategories, trainingTemplates } from "@/lib/catalog";

export default function TemplatesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen overflow-hidden bg-[#05050b] text-white">
        <section className="relative border-b border-white/10 px-4 py-14 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(143,92,255,0.28),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.18),transparent_30%)]" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-[#8beeff] backdrop-blur-xl">
                <Layers3 size={16} />
                ספריית תבניות מקומית
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
                בחרו תבנית מקצועית והטעינו אותה לבונה המערך
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
                36 תבניות הדרכה בעברית, לפי קטגוריות ארגוניות נפוצות, נשמרות
                מקומית בקובץ JSON ונגישות ללא חיבור חיצוני.
              </p>
            </div>
            <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <Stat icon={<Database size={18} />} label="תבניות" value={trainingTemplates.length} />
              <Stat icon={<Search size={18} />} label="קטגוריות" value={templateCategories.length} />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <TemplatesBrowser
            templates={trainingTemplates}
            categories={templateCategories}
          />
        </section>
      </main>
    </>
  );
}

function Stat({
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
