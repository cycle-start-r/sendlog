import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { ArrowLeft, MapPin, Clock, Battery } from "lucide-react";

const outcomeColors: Record<string, string> = {
  SEND: "bg-green-100 text-green-700",
  FLASH: "bg-blue-100 text-blue-700",
  ONSIGHT: "bg-purple-100 text-purple-700",
  ATTEMPT: "bg-slate-100 text-slate-600",
  PROJECT: "bg-amber-100 text-amber-700",
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user!.id!;

  const climbSession = await prisma.climbSession.findUnique({
    where: { id },
    include: { climbs: { orderBy: { gradeNormalized: "desc" } } },
  });

  if (!climbSession || climbSession.userId !== userId) notFound();

  const sends = climbSession.climbs.filter((c) =>
    ["SEND", "FLASH", "ONSIGHT"].includes(c.outcome)
  );
  const attempts = climbSession.climbs.filter((c) => c.outcome === "ATTEMPT");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/sessions"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Sessions
        </Link>
        <h1 className="text-2xl font-bold">{climbSession.location}</h1>
        <p className="text-slate-500 mt-1">{formatDate(climbSession.date)}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="bg-slate-100 rounded-full px-3 py-1 text-slate-700">
          {climbSession.climbingType.toLowerCase()}
        </span>
        <span className="bg-slate-100 rounded-full px-3 py-1 text-slate-700">
          {climbSession.locationType.toLowerCase()}
        </span>
        {climbSession.durationMinutes && (
          <span className="flex items-center gap-1 bg-slate-100 rounded-full px-3 py-1 text-slate-700">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(climbSession.durationMinutes)}
          </span>
        )}
        {climbSession.energyLevel && (
          <span className="flex items-center gap-1 bg-slate-100 rounded-full px-3 py-1 text-slate-700">
            <Battery className="w-3.5 h-3.5" />
            Energy: {climbSession.energyLevel}/5
          </span>
        )}
      </div>

      {climbSession.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          {climbSession.notes}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white border rounded-xl p-3">
          <p className="text-2xl font-bold text-slate-900">{climbSession.climbs.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total climbs</p>
        </div>
        <div className="bg-white border rounded-xl p-3">
          <p className="text-2xl font-bold text-green-600">{sends.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Sends</p>
        </div>
        <div className="bg-white border rounded-xl p-3">
          <p className="text-2xl font-bold text-slate-500">{attempts.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Attempts</p>
        </div>
      </div>

      {/* Climbs list */}
      <div>
        <h2 className="font-semibold mb-3">Climbs</h2>
        {climbSession.climbs.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8 border-2 border-dashed rounded-xl">
            No climbs logged for this session.
          </p>
        ) : (
          <div className="space-y-2">
            {climbSession.climbs.map((climb) => (
              <div
                key={climb.id}
                className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{climb.grade}</span>
                    {climb.name && (
                      <span className="text-sm text-slate-500">{climb.name}</span>
                    )}
                  </div>
                  {climb.notes && (
                    <p className="text-xs text-slate-400 mt-0.5">{climb.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {climb.attempts > 1 && (
                    <span className="text-xs text-slate-400">{climb.attempts}×</span>
                  )}
                  <span
                    className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${outcomeColors[climb.outcome] ?? ""}`}
                  >
                    {climb.outcome.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
