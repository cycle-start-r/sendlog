import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, BookOpen } from "lucide-react";

const categoryColors: Record<string, string> = {
  HANGBOARD: "bg-blue-100 text-blue-700",
  STRENGTH: "bg-orange-100 text-orange-700",
  CARDIO: "bg-green-100 text-green-700",
  FLEXIBILITY: "bg-teal-100 text-teal-700",
  MENTAL: "bg-purple-100 text-purple-700",
  INJURY: "bg-red-100 text-red-700",
  GOAL: "bg-brand-100 text-brand-700",
  GENERAL: "bg-slate-100 text-slate-600",
};

export default async function JournalPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const notes = await prisma.trainingNote.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Training Journal</h1>
        <Link
          href="/journal/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed rounded-xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No journal entries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">{formatDate(note.date)}</p>
                <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${categoryColors[note.category]}`}>
                  {note.category.toLowerCase()}
                </span>
              </div>
              <p className="text-slate-800 text-sm whitespace-pre-wrap line-clamp-4">{note.content}</p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-500 rounded px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
