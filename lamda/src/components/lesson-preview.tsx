import { Clock3, ListChecks, MessageSquareText } from "lucide-react";

export function LessonPreview() {
  const rows = [
    ["09:00", "פתיחה ומיפוי ידע", "שאלה מהירה בקבוצות"],
    ["09:15", "עקרונות מרכזיים", "הדגמה מודרכת"],
    ["10:00", "תרגול יישומי", "סימולציה ומשוב"],
    ["10:35", "סיכום ובוחן", "בדיקת הבנה"],
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden max-w-6xl px-6 md:block"
    >
      <div className="translate-y-16 rounded-t-[8px] border border-black/10 bg-white shadow-2xl shadow-black/15">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-sm text-[#6a655e]">טיוטת מערך</p>
            <p className="font-semibold text-[#20201d]">הטמעת AI בצוותי שירות</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6a655e]">
            <span className="rounded-full bg-[#d8efe8] px-3 py-1 text-[#0f766e]">
              90 דקות
            </span>
            <span className="rounded-full bg-[#fff0d4] px-3 py-1 text-[#9a5a00]">
              מוכן להנחיה
            </span>
          </div>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-l border-black/10 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Clock3 size={16} />
              סדר יום וזמנים
            </div>
            <div className="space-y-2">
              {rows.map(([time, title, detail]) => (
                <div
                  key={time}
                  className="grid grid-cols-[72px_1fr] gap-3 rounded-md border border-black/10 px-3 py-2"
                >
                  <span className="font-mono text-xs text-[#0f766e]">{time}</span>
                  <span>
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="block text-xs text-[#6a655e]">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-4 p-5">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <ListChecks size={16} />
                מטרות למידה
              </div>
              <ul className="space-y-2 text-sm text-[#47433d]">
                <li>לזהות תהליכים מתאימים לאוטומציה.</li>
                <li>לנסח הנחיות עבודה ברורות ובטוחות.</li>
                <li>למדוד איכות תוצר ושיפור לאורך זמן.</li>
              </ul>
            </div>
            <div className="rounded-md bg-[#f4f1ea] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <MessageSquareText size={16} />
                תרגול אינטראקטיבי
              </div>
              <p className="text-sm leading-6 text-[#5f5c55]">
                המשתתפים בונים תסריט שירות, משווים בין גרסאות, ומנסחים כלל
                עבודה משותף לצוות.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
