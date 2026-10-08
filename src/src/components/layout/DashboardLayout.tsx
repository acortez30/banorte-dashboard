import { useEffect, useState, type ReactNode } from "react";
import AppSidebar from "./AppSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("banorte_sidebar_collapsed") === "true");

  useEffect(() => {
    localStorage.setItem("banorte_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
      <main className={`min-h-screen pt-16 transition-[padding] duration-300 lg:pt-0 ${collapsed ? "lg:pl-[72px]" : "lg:pl-[232px]"}`}>
        <div className="mx-auto w-full max-w-[1700px] p-4 sm:p-5 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
