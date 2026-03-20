import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Plus, MapPin, Clock, Zap } from "lucide-react";

export default async function SessionsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const sessions = await prisma.climbSession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { climbs: true },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <Link
          href="/sessions/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed rounded-xl">
          <p className="text-sm">No sessions logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const sends = s.climbs.filter((c) =>
              ["SEND", "FLASH", "ONSIGHT"].includes(c.outcome)
            ).length;
            return (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                className="block bg-white rounded-xl border p-4 hover:border-brand-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 truncate">{s.location}</p>
                      <span className="text-xs bg-slate-100 text-slate-600 rounded px-2 py-0.5 shrink-0">
                        {s.climbingType.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{formatDate(s.date)}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <div className="flex items-center gap-1 justify-end text-sm text-slate-700">
                      <Zap className="w-3.5 h-3.5" />
                      {s.climbs.length} climbs · {sends} sends
                    </div>
                    {s.durationMinutes && (
                      <div className="flex items-center gap-1 justify-end text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDuration(s.durationMinutes)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
