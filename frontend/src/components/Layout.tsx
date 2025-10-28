import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Search,
  Bell,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/skills", icon: BookOpen, label: "Skills" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <header
        className="fixed top-0 left-0 right-0 h-16 border-b z-40"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              SkillForge
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <Search className="w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="Search skills..."
                className="bg-transparent border-none outline-none text-sm w-48"
                style={{ color: "var(--text)" }}
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ backgroundColor: "var(--background)" }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              className="p-2 rounded-lg transition-all hover:scale-110 relative"
              style={{ backgroundColor: "var(--background)" }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--danger)" }}
              />
            </button>

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              MC
            </div>
          </div>
        </div>
      </header>

      <aside
        className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 border-r flex-col z-30"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  color: active ? "white" : "var(--text)",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div
            className="px-4 py-3 rounded-lg"
            style={{ backgroundColor: "var(--background)" }}
          >
            <p className="text-xs opacity-60 mb-1">Current Streak</p>
            <p className="text-2xl font-bold">
              <span style={{ color: "var(--warning)" }}>🔥</span> 7 Days
            </p>
          </div>
        </div>
      </aside>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t z-40 flex items-center justify-around"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all"
              style={{
                color: active ? "var(--primary)" : "var(--text)",
                opacity: active ? 1 : 0.6,
              }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <main className="md:ml-64 mt-16 md:mb-0 mb-16 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
