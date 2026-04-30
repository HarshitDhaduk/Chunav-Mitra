import { JourneySidebar } from "@/components/journey/JourneySidebar";
import { HomeButton } from "@/components/journey/HomeButton";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { ChunавMitraFAB } from "@/components/chatbot/ChunавMitraFAB";

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* ── Sidebar (desktop) — sticky, never scrolls with page ── */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex" style={{ height: "100vh", position: "sticky", top: 0 }}>

        {/* Logo — clicking opens home confirm modal */}
        <div className="shrink-0 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <HomeButton asLogo />
        </div>

        {/* Step list — scrolls independently */}
        <div className="min-h-0 flex-1 overflow-y-auto py-3">
          <JourneySidebar />
        </div>

        {/* Back to home text button */}
        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">
          <HomeButton />
        </div>
      </aside>

      {/* ── Main content — scrollable ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:px-6" style={{ zIndex: 30, position: "relative" }}>
          {/* Mobile: home button */}
          <div className="lg:hidden">
            <HomeButton />
          </div>

          {/* Desktop: breadcrumb */}
          <div className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 lg:block">
            Electoral Journey
          </div>

          <AccessibilityToolbar />
        </header>

        {/* Mobile step progress strip */}
        <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <JourneySidebar mobile />
        </div>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <ChunавMitraFAB />
    </div>
  );
}
