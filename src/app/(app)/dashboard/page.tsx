import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, Mountain, Zap, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [recentSessions, totalClimbs, projectCount] = await Promise.all([
    prisma.climbSession.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { climbs: true },
    }),
    prisma.climb.count({ where: { userId } }),
    prisma.climb.count({ where: { userId, isProject: true } }),
  ]);

  // This week's stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [weekSessions, weekClimbs] = await Promise.all([
    prisma.climbSession.count({ where: { userId, date: { gte: weekStart } } }),
    prisma.climb.count({ where: { userId, createdAt: { gte: weekStart } } }),
  ]);

  // Hardest send overall
  const hardestSend = await prisma.climb.findFirst({
    where: { userId, outcome: { in: ["SEND", "FLASH", "ONSIGHT"] } },
    orderBy: { gradeNormalized: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Ready to train?</p>
        </div>
        <Link
          href="/sessions/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Session
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Sessions this week" value={weekSessions} icon={<Mountain className="w-5 h-5 text-brand-500" />} />
        <StatCard label="Climbs this week" value={weekClimbs} icon={<Zap className="w-5 h-5 text-amber-500" />} />
        <StatCard label="Active projects" value={projectCount} icon={<Target className="w-5 h-5 text-purple-500" />} />
        <StatCard label="Total climbs" value={totalClimbs} icon={<Mountain className="w-5 h-5 text-slate-400" />} />
      </div>

      {hardestSend && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <p className="text-sm text-brand-700 font-medium">Personal Best</p>
          <p className="text-2xl font-bold text-brand-800 mt-1">{hardestSend.grade}</p>
          <p className="text-sm text-brand-600">{hardestSend.name ?? "Unnamed route"}</p>
        </div>
      )}

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Recent Sessions</h2>
          <Link href="/sessions" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed rounded-xl">
            <Mountain className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No sessions yet. Log your first climb!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((s) => (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                className="block bg-white rounded-xl border p-4 hover:border-brand-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{s.location}</p>
                    <p className="text-sm text-slate-500">{formatDate(s.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{s.climbs.length} climbs</p>
                    <p className="text-xs text-slate-400 capitalize">{s.climbingType.toLowerCase()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
