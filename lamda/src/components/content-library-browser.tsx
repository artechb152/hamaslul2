"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import {
  getContentTypeLabel,
  getModeLabel,
  type ContentLibrary,
  type ContentLibraryItem,
} from "@/lib/catalog";
import {
  builderItemsKey,
  type BuilderLibraryItem,
} from "@/lib/builder-storage";

const typeOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "כל הסוגים" },
  { value: "iceBreaker", label: "שוברי קרח" },
  { value: "energizer", label: "אנרג'ייזרים" },
  { value: "discussionQuestion", label: "שאלות דיון" },
  { value: "trainingActivity", label: "פעילויות" },
  { value: "rolePlayScenario", label: "סימולציות" },
];

export function ContentLibraryBrowser({
  library,
  items,
}: {
  library: ContentLibrary;
  items: ContentLibraryItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [groupSize, setGroupSize] = useState("הכל");
  const [duration, setDuration] = useState("הכל");
  const [objective, setObjective] = useState("הכל");
  const [mode, setMode] = useState("הכל");
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const haystack = [item.title, item.description, item.objective, item.groupSize]
        .join(" ")
        .toLowerCase();

      return (
        (type === "all" || item.type === type) &&
        (groupSize === "הכל" || item.groupSize === groupSize) &&
        (duration === "הכל" || item.duration === duration) &&
        (objective === "הכל" || item.objective === objective) &&
        (mode === "הכל" || item.mode === mode) &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [duration, groupSize, items, mode, objective, query, type]);

  function addItem(item: ContentLibraryItem) {
    const nextItem: BuilderLibraryItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      typeLabel: getContentTypeLabel(item.type),
      duration: item.duration,
      groupSize: item.groupSize,
      objective: item.objective,
      modeLabel: getModeLabel(item.mode),
    };

    const current = readBuilderItems();
    const withoutDuplicate = current.filter((stored) => stored.id !== nextItem.id);
    sessionStorage.setItem(
      builderItemsKey,
      JSON.stringify([...withoutDuplicate, nextItem]),
    );
    setAddedIds((ids) => Array.from(new Set([...ids, item.id])));
  }

  function openBuilder() {
    router.push("/create");
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_160px_160px_220px_160px]">
          <label className="relative block xl:col-span-1">
            <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="חיפוש פעילות, שאלה, תרגיל או תרחיש"
              className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 pr-11 pl-4 text-white outline-none placeholder:text-white/40"
            />
          </label>

          <FilterSelect value={type} onChange={setType} options={typeOptions} />
          <FilterSelect
            value={groupSize}
            onChange={setGroupSize}
            options={["הכל", ...library.filters.groupSizes].map((item) => ({
              value: item,
              label: item,
            }))}
          />
          <FilterSelect
            value={duration}
            onChange={setDuration}
            options={["הכל", ...library.filters.durations].map((item) => ({
              value: item,
              label: item,
            }))}
          />
          <FilterSelect
            value={objective}
            onChange={setObjective}
            options={["הכל", ...library.filters.objectives].map((item) => ({
              value: item,
              label: item,
            }))}
          />
          <FilterSelect
            value={mode}
            onChange={setMode}
            options={[
              { value: "הכל", label: "כל המצבים" },
              ...library.filters.modes.map((item) => ({
                value: item,
                label: getModeLabel(item),
              })),
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/55">
        <span>{filteredItems.length} פריטי תוכן מוצגים</span>
        <button
          type="button"
          onClick={openBuilder}
          className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 font-semibold text-white transition hover:bg-white/[0.1]"
        >
          פתח בונה מערך
          <ArrowLeft size={16} />
        </button>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const wasAdded = addedIds.includes(item.id);

          return (
            <article
              key={item.id}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10 transition hover:border-white/25 hover:bg-white/[0.055]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#8f5cff]/15 px-3 py-1 text-xs text-[#d4c8ff]">
                  {getContentTypeLabel(item.type)}
                </span>
                <span className="text-xs text-white/42">{item.id}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {item.groupSize}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {item.duration}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {item.objective}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {getModeLabel(item.mode)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => addItem(item)}
                className={`focus-ring mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
                  wasAdded
                    ? "bg-[#22c55e]/20 text-[#9fffc1]"
                    : "bg-white text-[#090914] hover:bg-[#e9ddff]"
                }`}
              >
                {wasAdded ? <Check size={16} /> : <Plus size={16} />}
                {wasAdded ? "נוסף למערך" : "הוסף למערך"}
              </button>
            </article>
          );
        })}
      </section>

      <div className="rounded-lg border border-[#8f5cff]/25 bg-[#8f5cff]/10 p-5 text-sm leading-7 text-[#d4c8ff]">
        <Sparkles className="mb-3" size={20} />
        כל פריט שנוסף נשמר מקומית בדפדפן ויופיע בבונה המערך. אין כאן API, אין
        שליחה החוצה, ואין תלות במפתח OpenAI.
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring h-12 w-full rounded-md border border-white/10 bg-black/35 px-3 text-white outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function readBuilderItems() {
  const raw = sessionStorage.getItem(builderItemsKey);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as BuilderLibraryItem[];
  } catch {
    return [];
  }
}
