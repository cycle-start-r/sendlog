import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Target } from "lucide-react";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const projects = await prisma.climb.findMany({
    where: { userId, isProject: true },
    orderBy: { updatedAt: "desc" },
    include: { session: true },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>

      {projects.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed rounded-xl">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No active projects. Mark a climb as a project when logging.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-slate-900">{project.grade}</span>
                    {project.name && (
                      <span className="text-slate-600">{project.name}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Last tried {formatDate(project.session.date)} · {project.attempts} attempt{project.attempts !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-3 py-1 font-medium">
                  project
                </span>
              </div>
              {project.notes && (
                <p className="text-sm text-slate-500 mt-2 border-t pt-2">{project.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
