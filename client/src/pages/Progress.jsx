import { useEffect, useState } from "react";
import {
  Flame,
  CheckCircle2,
  Trophy,
  Activity,
  Loader2,
  Code2,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const iso = (d) => d.toISOString().slice(0, 10);

function streaks(days) {
  const set = new Set(days);
  // current streak (counts today or yesterday backward)
  let cur = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) {
    cur++;
    d.setDate(d.getDate() - 1);
  }
  // longest streak
  let longest = 0,
    run = 0,
    prev = null;
  [...set].sort().forEach((s) => {
    const cd = new Date(s);
    if (prev && Math.round((cd - prev) / 86400000) === 1) run++;
    else run = 1;
    longest = Math.max(longest, run);
    prev = cd;
  });
  return { cur, longest };
}

function relTime(at) {
  const s = Math.floor((Date.now() - new Date(at)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(at).toLocaleDateString();
}

function Heatmap({ days }) {
  const set = new Set(days);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(end.getDate() - (17 * 7 + end.getDay()));
  const weeks = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weeks.map((w, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {w.map((day, di) => {
            const future = day > end;
            const active = set.has(iso(day));
            return (
              <span
                key={di}
                title={iso(day)}
                className="w-3 h-3 rounded-[3px]"
                style={{
                  background: future
                    ? "transparent"
                    : active
                      ? "#18a884"
                      : "rgba(255,255,255,0.07)",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Progress() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/progress")
      .then(({ data }) => setData(data))
      .catch(() => setData({ solved: [], submissions: [], days: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid place-items-center py-32 text-ink2">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );

  const { solved = [], submissions = [], days = [] } = data || {};
  const { cur, longest } = streaks(days);
  const accepted = submissions.filter((s) => s.verdict === "Accepted").length;

  const cards = [
    {
      icon: CheckCircle2,
      label: "Problems solved",
      value: solved.length,
      color: "#18a884",
    },
    {
      icon: Flame,
      label: "Current streak",
      value: `${cur} day${cur === 1 ? "" : "s"}`,
      color: "#e0743a",
    },
    {
      icon: Trophy,
      label: "Longest streak",
      value: `${longest} day${longest === 1 ? "" : "s"}`,
      color: "#d4a23a",
    },
    {
      icon: Activity,
      label: "Active days",
      value: days.length,
      color: "#2dd4bf",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-9">
      <div className="mb-8">
        <p className="text-sm text-ink2">{user?.name}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
          Your progress
        </h1>
        <p className="text-ink2 mt-2 text-[15px]">
          Your solved problems, streaks, and recent activity — saved to your
          account.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-line bg-card p-5"
          >
            <span
              className="grid place-items-center w-10 h-10 rounded-xl mb-3"
              style={{ background: c.color + "1a", color: c.color }}
            >
              <c.icon size={18} />
            </span>
            <div className="font-display text-2xl font-semibold leading-none">
              {c.value}
            </div>
            <div className="text-xs text-ink2 mt-1.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Activity</h2>
          <span className="text-xs text-ink2">last ~4 months</span>
        </div>
        <Heatmap days={days} />
        <div className="flex items-center gap-2 mt-3 text-[11px] text-ink2">
          <span>Less</span>
          <span
            className="w-3 h-3 rounded-[3px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <span
            className="w-3 h-3 rounded-[3px]"
            style={{ background: "rgba(24,168,132,.45)" }}
          />
          <span
            className="w-3 h-3 rounded-[3px]"
            style={{ background: "#18a884" }}
          />
          <span>More</span>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold mb-4">
          Recent submissions
        </h2>
        {submissions.length === 0 ? (
          <p className="text-ink2 text-sm py-6 text-center">
            No submissions yet. Solve a problem with the{" "}
            <span className="font-semibold text-ink">Submit</span> button to see
            it here.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {submissions.slice(0, 25).map((s, i) => {
              const ok = s.verdict === "Accepted";
              return (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <Code2 size={15} className="text-ink2 shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">
                    {s.problem}
                  </span>
                  <span className="text-xs text-ink2 shrink-0">
                    {relTime(s.at)}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      color: ok ? "#18a884" : "#e0743a",
                      background: (ok ? "#18a884" : "#e0743a") + "1a",
                    }}
                  >
                    {s.verdict}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
