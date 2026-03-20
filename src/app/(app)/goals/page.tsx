import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Flag, CheckCircle } from "lucide-react";

export default async function GoalsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [active, completed] = await Promise.all([
    prisma.goal.findMany({
      where: { userId, isCompleted: false },
      orderBy: { targetDate: "asc" },
    }),
    prisma.goal.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Goals</h1>

      <div>
        <h2 className="font-semibold mb-3 text-slate-700">Active</h2>
        {active.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed rounded-xl">
            <Flag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No active goals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((goal) => (
              <div key={goal.id} className="bg-white border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{goal.title}</p>
                    {goal.targetGrade && (
                      <p className="text-sm text-brand-600 mt-0.5">Target: {goal.targetGrade}</p>
                    )}
                    {goal.description && (
                      <p className="text-sm text-slate-500 mt-1">{goal.description}</p>
                    )}
                  </div>
                  {goal.targetDate && (
                    <span className="text-xs text-slate-400 shrink-0 ml-4">
                      by {formatDate(goal.targetDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-slate-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Completed
          </h2>
          <div className="space-y-2">
            {completed.map((goal) => (
              <div key={goal.id} className="bg-slate-50 border rounded-xl p-4 opacity-75">
                <p className="font-medium text-slate-700 line-through">{goal.title}</p>
                {goal.completedAt && (
                  <p className="text-xs text-slate-400 mt-0.5">Completed {formatDate(goal.completedAt)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
