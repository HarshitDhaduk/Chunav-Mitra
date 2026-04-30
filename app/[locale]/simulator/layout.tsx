import { HomeButton } from "@/components/journey/HomeButton";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { ChunавMitraFAB } from "@/components/chatbot/ChunавMitraFAB";

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top bar — exact same style as journey */}
      <header 
        className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:px-6" 
        style={{ zIndex: 30, position: "relative" }}
      >
        <div className="flex items-center gap-4">
          <HomeButton asLogo />
          
          <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 lg:block" />

          {/* Desktop: breadcrumb */}
          <div className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 lg:block">
            EVM Simulator
          </div>
        </div>

        <AccessibilityToolbar />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          {children}
        </div>
      </main>

      <ChunавMitraFAB />
    </div>
  );
}
