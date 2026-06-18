"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Eye,
  Filter,
  Layers3,
  Search,
  Users,
} from "lucide-react";
import {
  templateToBuilderDraft,
  type TrainingTemplate,
} from "@/lib/catalog";
import { builderDraftKey } from "@/lib/builder-storage";

export function TemplatesBrowser({
  templates,
  categories,
}: {
  templates: TrainingTemplate[];
  categories: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("הכל");
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? "");

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory = category === "הכל" || template.category === category;
      const haystack = [
        template.id,
        template.title,
        template.category,
        template.targetAudience,
        template.learningObjectives.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, query, templates]);

  const selectedTemplate =
    filteredTemplates.find((template) => template.id === selectedId) ??
    filteredTemplates[0] ??
    templates[0];

  function loadTemplate(template: TrainingTemplate) {
    sessionStorage.setItem(
      builderDraftKey,
      JSON.stringify(templateToBuilderDraft(template)),
    );
    router.push("/create");
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_280px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חיפוש לפי כותרת, קהל יעד, מטרה או מזהה תבנית"
            className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 pr-11 pl-4 text-white outline-none placeholder:text-white/40"
          />
        </label>

        <label className="relative block">
          <Filter className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 pr-11 pl-4 text-white outline-none"
          >
            <option>הכל</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="grid gap-3">
          <div className="flex items-center justify-between text-sm text-white/55">
            <span>{filteredTemplates.length} תבניות נמצאו</span>
            <span>מאגר מקומי: trainingTemplates.json</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <button
                type="button"
                key={template.id}
                onClick={() => setSelectedId(template.id)}
                className={`focus-ring group rounded-lg border p-4 text-right transition ${
                  selectedTemplate?.id === template.id
                    ? "border-[#9b7cff]/70 bg-[#8f5cff]/15"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/58">
                    {template.id}
                  </span>
                  <span className="rounded-full bg-[#22d3ee]/12 px-3 py-1 text-xs text-[#8beeff]">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                <div className="mt-4 grid gap-2 text-sm text-white/58">
                  <span className="flex items-center gap-2">
                    <Users size={15} />
                    {template.targetAudience}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 size={15} />
                    {template.recommendedDuration}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#c6b8ff]">
                  <Eye size={15} />
                  תצוגה מקדימה
                </div>
              </button>
            ))}
          </div>
        </section>

        {selectedTemplate ? (
          <aside className="h-fit rounded-lg border border-white/10 bg-[#070711]/88 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl xl:sticky xl:top-24">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#8beeff]">{selectedTemplate.category}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {selectedTemplate.title}
                </h2>
              </div>
              <Layers3 className="text-[#c6b8ff]" size={24} />
            </div>

            <PreviewBlock title="מטרות למידה" items={selectedTemplate.learningObjectives} />
            <PreviewBlock
              title="פעילות פתיחה"
              items={[
                `${selectedTemplate.openingActivity.title} (${selectedTemplate.openingActivity.duration})`,
                ...selectedTemplate.openingActivity.instructions,
              ]}
            />
            <PreviewBlock
              title="אג'נדה"
              items={selectedTemplate.agenda.map(
                (item) => `${item.time} | ${item.title}: ${item.purpose}`,
              )}
            />
            <PreviewBlock
              title="שאלות דיון"
              items={selectedTemplate.discussionQuestions}
            />

            <button
              type="button"
              onClick={() => loadTemplate(selectedTemplate)}
              className="focus-ring mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-4 font-semibold text-[#090914] transition hover:bg-[#e9ddff]"
            >
              טען לבונה המערך
              <ArrowLeft size={18} />
            </button>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function PreviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-5 border-t border-white/10 pt-4">
      <h3 className="mb-3 text-sm font-semibold text-white/80">{title}</h3>
      <ul className="grid gap-2 text-sm leading-6 text-white/58">
        {items.slice(0, 5).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#8beeff]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
