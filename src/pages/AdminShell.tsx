import ConnectedSection from "../components/ConnectedSection";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import { useState } from "react";
import type { AdminPage } from "../types/admin";

interface Props {
  currentSection: AdminPage;
  setCurrentSection: (s: AdminPage) => void;
  onLogout?: () => void;
}

const NAV_ITEMS: {
  id: AdminPage;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: <GridIcon /> },
  { id: "website-pages", label: "Website Pages", icon: <PagesIcon /> },
  { id: "news", label: "News & Insights", icon: <NewsIcon /> },
  { id: "programmes", label: "Programmes", icon: <ProgramIcon /> },
  { id: "events", label: "Events", icon: <EventIcon /> },
  { id: "publications", label: "Publications", icon: <DocIcon /> },
  { id: "media", label: "Media / Gallery", icon: <MediaIcon /> },
  { id: "leadership", label: "Leadership", icon: <PeopleIcon /> },
  { id: "partners", label: "Partners", icon: <PartnersIcon /> },
  { id: "messages", label: "Messages", icon: <MailIcon /> },
  {
    id: "registrations" as AdminPage,
    label: "Registrations",
    icon: <ClipboardIcon />,
  },
  { id: "newsletter", label: "Newsletter", icon: <NewsletterIcon /> },
  { id: "users", label: "Users", icon: <UserIcon /> },
  { id: "settings", label: "Website Settings", icon: <SettingsIcon /> },
];

export default function AdminShell({
  currentSection,
  setCurrentSection,
  onLogout,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accountEmail, setAccountEmail] = useState("");
  useEffect(() => {
    void supabase?.auth
      .getUser()
      .then(({ data }) => setAccountEmail(data.user?.email ?? ""));
  }, []);

  const activeSec = currentSection;

  const renderSection = () => (
    <ConnectedSection key={currentSection} section={currentSection} />
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f0f2f5" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col h-full flex-shrink-0 transition-all duration-200"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "#0d1e35",
          borderRight: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0"
          style={{ borderColor: "rgba(201,168,76,0.15)", minHeight: 64 }}
        >
          <img
            src="/ASGC_colored_logo.png"
            alt="ASGC"
            className="w-10 h-10 object-contain flex-shrink-0 bg-white rounded-md p-1"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm tracking-wider whitespace-nowrap">
                ASGC
              </div>
              <div
                className="text-xs whitespace-nowrap"
                style={{ color: "rgba(201,168,76,0.7)" }}
              >
                Admin Portal
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.id === activeSec ||
              (item.id === "events" &&
                currentSection === ("registrations" as AdminPage));
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 relative group"
                style={{
                  background: isActive ? "#1e3657" : "transparent",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1a2f4a";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(255,255,255,0.6)";
                  }
                }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ background: "#c9a84c" }}
                  />
                )}
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1 truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "#c9a84c", color: "#0a1628" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!sidebarOpen && item.badge && (
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: "#c9a84c" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div
          className="px-2 py-3 border-t space-y-1"
          style={{ borderColor: "rgba(201,168,76,0.12)" }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#1a2f4a";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.4)";
            }}
          >
            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </span>
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(220,38,38,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.4)";
              }}
            >
              <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <LogoutIcon />
              </span>
              {sidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center gap-4 px-6 border-b flex-shrink-0"
          style={{ height: 64, background: "#fff", borderColor: "#e2e4e9" }}
        >
          <div>
            <p
              className="font-semibold text-base"
              style={{ color: "#0a1628", fontFamily: "var(--font-display)" }}
            >
              {NAV_ITEMS.find((n) => n.id === currentSection)?.label ||
                "Dashboard"}
            </p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Live data
            </p>
          </div>
          <div className="flex-1" />
          {/* Avatar */}
          <div
            className="flex items-center gap-2.5 pl-3 border-l"
            style={{ borderColor: "#e2e4e9" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: "linear-gradient(135deg, #0a1628, #132040)",
                color: "#c9a84c",
              }}
            >
              {accountEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold" style={{ color: "#0a1628" }}>
                Administrator
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                {accountEmail}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{renderSection()}</main>
      </div>
    </div>
  );
}

// Icon components
function GridIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function PagesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}
function ProgramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function EventIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function MediaIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function PartnersIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="M15 6v8a2 2 0 0 0 2 2h5l-3-3-3 3V6z" />
      <rect x="8" y="2" width="13" height="13" rx="2" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function ClipboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}
function NewsletterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
