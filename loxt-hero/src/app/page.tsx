"use client";

import dynamic from "next/dynamic";

// WebGL/shader component → client-only (ssr: false). Per Next.js 16 docs,
// ssr:false is only allowed inside a Client Component, hence "use client" above.
const ShaderShowcase = dynamic(() => import("@/components/ui/hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen w-full bg-black" />,
});

export default function Home() {
  return (
    <main className="min-h-screen h-full w-full">
      <ShaderShowcase />
    </main>
  );
}
