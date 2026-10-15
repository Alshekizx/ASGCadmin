import { useState } from "react";
import type { AdminPage } from "../types/admin";

interface Content {
  id: string;
  kind: string;
  title: string;
  status: string;
  updated_at?: string;
  data: Record<string, unknown>;
}
interface Submission {
  id: string;
  kind: string;
  status: string;
  created_at: string;
  data: Record<string, string>;
}
const sections: { kind: string; label: string; section: AdminPage }[] = [
  { kind: "news", label: "News & insights", section: "news" },
  { kind: "event", label: "Events", section: "events" },
  { kind: "programme", label: "Programmes", section: "programmes" },
  { kind: "publication", label: "Publications", section: "publications" },
  { kind: "page", label: "Website pages", section: "website-pages" },
  { kind: "partner", label: "Partners", section: "partners" },
];
const formatCount = (value: number) => value.toLocaleString();
const shortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  });
const dayKey = (value: Date) =>
  value.toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
const incomingLabel = (kind: string) =>
  ({
    contact: "Contact enquiry",
    partnership: "Partnership enquiry",
    newsletter: "Newsletter subscription",
    registration: "Event registration",
  })[kind] || kind;

export default function Dashboard({
  rows,
  submissions,
  onNavigate,
}: {
  rows: Content[];
  submissions: Submission[];
  onNavigate: (section: AdminPage) => void;
}) {
  const [period, setPeriod] = useState(7);
  const published = rows.filter((row) => row.status === "published").length;
  const drafts = rows.filter((row) => row.status === "draft").length;
  const unread = submissions.filter(
    (row) =>
      ["contact", "partnership"].includes(row.kind) && row.status === "unread",
  ).length;
  const registrations = submissions.filter(
    (row) => row.kind === "registration",
  ).length;
  const subscribers = submissions.filter(
    (row) => row.kind === "newsletter" && row.status !== "unsubscribed",
  ).length;
  const now = new Date();
  const days = Array.from({ length: period }, (_, index) => {
    const date = new Date(now.getTime() - (period - 1 - index) * 86400000);
    const count = submissions.filter(
      (row) => dayKey(new Date(row.created_at)) === dayKey(date),
    ).length;
    return { date, count };
  });
  const peak = Math.max(1, ...days.map((day) => day.count));
  const periodTotal = days.reduce((total, day) => total + day.count, 0);
  const recent = [...submissions]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);
  const upcoming = rows
    .filter(
      (row) =>
        row.kind === "event" && row.status === "published" && !row.data.past,
    )
    .sort((a, b) => {
      const dateA = Date.parse(String(a.data.date));
      const dateB = Date.parse(String(b.data.date));
      return (
        (Number.isNaN(dateA) ? Infinity : dateA) -
        (Number.isNaN(dateB) ? Infinity : dateB)
      );
    })
    .slice(0, 3);
  const modified = [...rows]
    .filter((row) => row.updated_at)
    .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""))
    .slice(0, 4);
  const navigateToKind = (kind: string) =>
    sections.find((section) => section.kind === kind)?.section ||
    ({ settings: "settings", leadership: "leadership" }[kind] as
      AdminPage | undefined) ||
    "media";
  const card = "rounded-2xl border border-slate-200 bg-white shadow-sm";
  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#967929] mb-2">
            Administration / Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0d1e35]">
            ASGC Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Your content, community and website activity at a glance.
          </p>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {now.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Africa/Lagos",
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Published content",
            value: published,
            note: `${drafts} draft${drafts === 1 ? "" : "s"} in your workspace`,
            section: "news" as AdminPage,
            icon: "content",
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Unread enquiries",
            value: unread,
            note: "Contact & partnership messages",
            section: "messages" as AdminPage,
            icon: "mail",
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Event registrations",
            value: registrations,
            note: "All registration records",
            section: "registrations" as AdminPage,
            icon: "calendar",
            color: "bg-violet-50 text-violet-700",
          },
          {
            label: "Newsletter audience",
            value: subscribers,
            note: "Excludes unsubscribed addresses",
            section: "newsletter" as AdminPage,
            icon: "people",
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map((metric) => (
          <button
            key={metric.label}
            onClick={() => onNavigate(metric.section)}
            className={`${card} p-5 text-left hover:border-slate-400 transition-colors group`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">
                {metric.label}
              </span>
              <span className={`p-2 rounded-lg ${metric.color}`}>
                <DashboardIcon name={metric.icon} />
              </span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-[#0d1e35] tabular-nums">
              {formatCount(metric.value)}
            </p>
            <div className="flex justify-between items-center mt-3 gap-2">
              <p className="text-xs text-slate-500">{metric.note}</p>
              <span
                aria-hidden="true"
                className="text-slate-400 group-hover:text-[#967929]"
              >
                ↗
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-6">
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#0d1e35]">
                Audience activity
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Forms, subscriptions and event registrations · Lagos time
              </p>
            </div>
            <select
              aria-label="Activity period"
              value={period}
              onChange={(event) => setPeriod(Number(event.target.value))}
              className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
            </select>
          </div>
          <p className="text-3xl font-bold mt-6 tabular-nums">
            {formatCount(periodTotal)}
            <span className="text-sm text-slate-500 font-normal ml-3">
              submissions
            </span>
          </p>
          <div
            className="flex items-end gap-2 sm:gap-3 mt-6 h-40 border-b border-slate-200"
            role="img"
            aria-label={`Daily submissions for the last ${period} days: ${days.map((day) => `${shortDate(day.date.toISOString())}: ${day.count}`).join(", ")}`}
          >
            {days.map((day) => (
              <div
                key={day.date.toISOString()}
                className="flex-1 h-full flex items-end"
              >
                <div
                  title={`${shortDate(day.date.toISOString())}: ${day.count} submissions`}
                  className="w-full rounded-t bg-[#1e3657] hover:bg-[#b8963e] transition-colors"
                  style={{
                    height: day.count ? `${(day.count / peak) * 100}%` : "2px",
                    opacity: day.count ? 1 : 0.15,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-3">
            <span>{shortDate(days[0].date.toISOString())}</span>
            <span>
              {periodTotal
                ? "Daily submission volume"
                : "No submissions in this period"}
            </span>
            <span>Today</span>
          </div>
        </section>
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-[#0d1e35]">Content overview</h2>
            <span className="text-xs text-slate-400">Published / Total</span>
          </div>
          <div className="space-y-4">
            {sections.map((section) => {
              const total = rows.filter(
                (row) => row.kind === section.kind,
              ).length;
              const live = rows.filter(
                (row) =>
                  row.kind === section.kind && row.status === "published",
              ).length;
              return (
                <button
                  key={section.kind}
                  onClick={() => onNavigate(section.section)}
                  className="block w-full text-left group"
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 group-hover:text-[#967929]">
                      {section.label}
                    </span>
                    <span className="tabular-nums font-medium">
                      {live}
                      <span className="text-slate-400 font-normal">
                        {" "}
                        / {total}
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#b8963e]"
                      style={{ width: `${total ? (live / total) * 100 : 0}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-6">
        <section className={`${card} overflow-hidden`}>
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#0d1e35]">
                Recent submissions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Latest activity from your website
              </p>
            </div>
            <button
              onClick={() => onNavigate("messages")}
              className="text-xs font-semibold text-[#967929] hover:underline"
            >
              Open inbox →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.length ? (
              recent.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onNavigate(
                      item.kind === "registration"
                        ? "registrations"
                        : item.kind === "newsletter"
                          ? "newsletter"
                          : "messages",
                    )
                  }
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center gap-3 hover:bg-slate-50"
                >
                  <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <DashboardIcon
                      name={item.kind === "registration" ? "calendar" : "mail"}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.data.name || item.data.email || "Website visitor"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {incomingLabel(item.kind)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-medium ${item.status === "unread" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {shortDate(item.created_at)}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="p-6 text-sm text-slate-500">
                New submissions will appear here when visitors use your website
                forms.
              </p>
            )}
          </div>
        </section>
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#0d1e35]">Upcoming events</h2>
            <button
              onClick={() => onNavigate("events")}
              className="text-xs font-semibold text-[#967929] hover:underline"
            >
              Manage →
            </button>
          </div>
          <div className="space-y-4">
            {upcoming.length ? (
              upcoming.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onNavigate("events")}
                  className="text-left w-full rounded-xl border border-slate-100 p-4 hover:border-slate-300"
                >
                  <p className="text-xs text-[#967929] font-medium mb-2">
                    {String(event.data.date || "Date to be announced")}
                  </p>
                  <h3 className="text-sm font-semibold leading-relaxed">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    {String(event.data.location || "Location to be announced")}
                  </p>
                  <p
                    className={`text-xs mt-3 ${event.data.registration ? "text-emerald-700" : "text-slate-500"}`}
                  >
                    {event.data.registration
                      ? "Registration open"
                      : "Registration closed"}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-6">
                No published upcoming events.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="font-semibold text-[#0d1e35] mb-5">Quick actions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                label: "Manage news",
                note: "Publish stories and insights",
                section: "news" as AdminPage,
              },
              {
                label: "Manage events",
                note: "Update your event calendar",
                section: "events" as AdminPage,
              },
              {
                label: "Edit website pages",
                note: "Keep public information current",
                section: "website-pages" as AdminPage,
              },
              {
                label: "Website settings",
                note: "Branding and contact details",
                section: "settings" as AdminPage,
              },
            ].map((action) => (
              <button
                key={action.section}
                onClick={() => onNavigate(action.section)}
                className="text-left rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
              >
                <p className="text-sm font-semibold">
                  {action.label} <span className="text-[#967929]">↗</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5">{action.note}</p>
              </button>
            ))}
          </div>
        </section>
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className="font-semibold text-[#0d1e35] mb-2">
            Recently updated content
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Latest saved changes across your workspace
          </p>
          {modified.length ? (
            modified.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(navigateToKind(item.kind))}
                className="flex justify-between items-center gap-4 w-full py-3 text-left border-b border-slate-100 last:border-0 hover:text-[#967929]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 capitalize">
                    {item.kind} · {item.status}
                  </p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                  {shortDate(item.updated_at!)}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-6">
              Saved content changes will appear here.
            </p>
          )}
        </section>
      </div>
      <p className="text-xs text-slate-400 text-center pb-2">
        Live Supabase records · Updates automatically · Includes marked test
        data
      </p>
    </div>
  );
}

function DashboardIcon({ name }: { name: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "mail" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 6 9 7 9-7" />
        </>
      ) : name === "calendar" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4m10-4v4M3 11h18m-12 4h2m3 0h2" />
        </>
      ) : name === "people" ? (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a6 6 0 0 0-2-4" />
        </>
      ) : (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6m-6 4h6m-6 4h3" />
        </>
      )}
    </svg>
  );
}
