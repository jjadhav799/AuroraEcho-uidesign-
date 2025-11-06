import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("sidebar-collapsed");
      setCollapsed(saved ? JSON.parse(saved) : false);
    };

    window.addEventListener("storage", handleStorage);
    
    // Also listen for changes within the same window
    const interval = setInterval(() => {
      const saved = localStorage.getItem("sidebar-collapsed");
      const current = saved ? JSON.parse(saved) : false;
      if (current !== collapsed) {
        setCollapsed(current);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [collapsed]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
