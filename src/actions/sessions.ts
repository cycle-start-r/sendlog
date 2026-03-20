"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validations/session";
import { climbSchema } from "@/lib/validations/climb";
import { normalizeGrade } from "@/lib/grades";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createSessionSchema = sessionSchema.extend({
  climbs: z
    .array(
      climbSchema.extend({
        gradeSystem: z.enum(["V_SCALE", "FONT", "YDS", "FRENCH"]),
      })
    )
    .default([]),
});

export async function createSession(data: z.infer<typeof createSessionSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const userId = session.user.id;

  const parsed = createSessionSchema.parse(data);

  const climbSession = await prisma.climbSession.create({
    data: {
      userId,
      date: new Date(parsed.date),
      location: parsed.location,
      locationType: parsed.locationType,
      climbingType: parsed.climbingType,
      durationMinutes: parsed.durationMinutes ?? null,
      notes: parsed.notes ?? null,
      energyLevel: parsed.energyLevel ?? null,
      climbs: {
        create: parsed.climbs.map((climb) => ({
          userId,
          name: climb.name ?? null,
          gradeSystem: climb.gradeSystem,
          grade: climb.grade,
          gradeNormalized: normalizeGrade(climb.grade, climb.gradeSystem),
          style: climb.style,
          outcome: climb.outcome,
          attempts: climb.attempts,
          isProject: climb.isProject,
          rating: climb.rating ?? null,
          notes: climb.notes ?? null,
          betaVideo: climb.betaVideo ?? null,
        })),
      },
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  redirect(`/sessions/${climbSession.id}`);
}

export async function deleteSession(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.climbSession.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  redirect("/sessions");
}
