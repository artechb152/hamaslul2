# למדא

אפליקציית SaaS בעברית ליצירת מערכי שיעור והדרכות מקצועיים, כולל תבניות
מקומיות וספריית תוכן ללא תלות ב-API חיצוני.

## הרצה מקומית

צרו קובץ `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.5
OPENAI_DEMO_MODE=true
```

אפשר להריץ בלי מפתח OpenAI על ידי השארת `OPENAI_DEMO_MODE=true`. במצב הזה
האפליקציה יוצרת מערך דמו מקומי מתבנית מקצועית ולא שולחת בקשות ל-OpenAI.

הריצו את סביבת הפיתוח:

```bash
npm run dev
```

פתחו את `http://localhost:3000`.

## מה יש באפליקציה

- Next.js App Router
- TypeScript
- Tailwind CSS
- Server Actions
- מצב דמו מקומי ללא API חיצוני
- ממשק RTL בעברית
- דף נחיתה, טופס יצירת הדרכה ועמוד תוצאות
- מסך תבניות ב-`/templates`
- ספריית תוכן ב-`/library`
- מאגר `src/data/trainingTemplates.json` עם 36 תבניות הדרכה
- מאגר `src/data/contentLibrary.json` עם 450 פריטי תוכן:
  100 שוברי קרח, 100 אנרג'ייזרים, 100 שאלות דיון, 100 פעילויות ו-50 סימולציות

## הערות פריסה

מפתח ה-API נקרא רק בצד השרת דרך `OPENAI_API_KEY`. אין לשים אותו בקוד לקוח או
בקובצי מקור שמועלים למאגר.

אם רוצים לעבוד מקומית בלבד, השאירו:

```bash
OPENAI_DEMO_MODE=true
```
