import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(18, 0, 0, 0);
  return d;
}

async function main() {
  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@sendlog.app" },
    update: {},
    create: {
      email: "demo@sendlog.app",
      name: "Demo Climber",
      passwordHash,
      gradeSystem: "V_SCALE",
    },
  });

  console.log("Created user:", user.email);

  // Grade normalization map (simplified inline for seed)
  const vNorm: Record<string, number> = {
    V3: 25, V4: 30, V5: 35, V6: 40, V7: 46, V8: 52, V9: 58,
  };

  // Session 1: 14 days ago
  const s1 = await prisma.climbSession.create({
    data: {
      userId: user.id,
      date: daysAgo(14),
      location: "Movement Oakland",
      locationType: "GYM",
      climbingType: "BOULDERING",
      durationMinutes: 90,
      energyLevel: 4,
      notes: "Felt strong. Worked the V7 overhang.",
      climbs: {
        create: [
          { userId: user.id, grade: "V4", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V4, style: "BOULDER", outcome: "FLASH", attempts: 1 },
          { userId: user.id, grade: "V4", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V4, style: "BOULDER", outcome: "SEND", attempts: 2 },
          { userId: user.id, grade: "V5", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V5, style: "BOULDER", outcome: "SEND", attempts: 1 },
          { userId: user.id, grade: "V5", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V5, style: "BOULDER", outcome: "SEND", attempts: 3 },
          { userId: user.id, grade: "V6", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V6, style: "BOULDER", outcome: "SEND", attempts: 4 },
          { userId: user.id, grade: "V7", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V7, style: "BOULDER", outcome: "ATTEMPT", attempts: 6, isProject: true, notes: "Got to the crux move." },
        ],
      },
    },
  });

  // Session 2: 10 days ago
  const s2 = await prisma.climbSession.create({
    data: {
      userId: user.id,
      date: daysAgo(10),
      location: "Movement Oakland",
      locationType: "GYM",
      climbingType: "BOULDERING",
      durationMinutes: 75,
      energyLevel: 3,
      notes: "Tired from work but got some good burns on the project.",
      climbs: {
        create: [
          { userId: user.id, grade: "V3", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V3, style: "BOULDER", outcome: "FLASH", attempts: 1 },
          { userId: user.id, grade: "V5", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V5, style: "BOULDER", outcome: "SEND", attempts: 2 },
          { userId: user.id, grade: "V5", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V5, style: "BOULDER", outcome: "FLASH", attempts: 1 },
          { userId: user.id, grade: "V6", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V6, style: "BOULDER", outcome: "ATTEMPT", attempts: 3 },
          { userId: user.id, grade: "V7", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V7, style: "BOULDER", outcome: "ATTEMPT", attempts: 5, isProject: true, notes: "Dynamic move still feels hard." },
        ],
      },
    },
  });

  // Session 3: 5 days ago (sent the project!)
  const s3 = await prisma.climbSession.create({
    data: {
      userId: user.id,
      date: daysAgo(5),
      location: "Movement Oakland",
      locationType: "GYM",
      climbingType: "BOULDERING",
      durationMinutes: 120,
      energyLevel: 5,
      notes: "Sent the V7!! Couldn't believe it. Everything clicked.",
      climbs: {
        create: [
          { userId: user.id, grade: "V4", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V4, style: "BOULDER", outcome: "FLASH", attempts: 1 },
          { userId: user.id, grade: "V5", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V5, style: "BOULDER", outcome: "SEND", attempts: 1 },
          { userId: user.id, grade: "V6", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V6, style: "BOULDER", outcome: "SEND", attempts: 2 },
          { userId: user.id, grade: "V6", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V6, style: "BOULDER", outcome: "FLASH", attempts: 1 },
          { userId: user.id, grade: "V7", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V7, style: "BOULDER", outcome: "SEND", attempts: 3, notes: "Project sent!" },
          { userId: user.id, grade: "V8", gradeSystem: "V_SCALE", gradeNormalized: vNorm.V8, style: "BOULDER", outcome: "ATTEMPT", attempts: 4, isProject: true, notes: "New project. Super powerful." },
        ],
      },
    },
  });

  // Training notes
  await prisma.trainingNote.createMany({
    data: [
      {
        userId: user.id,
        date: daysAgo(12),
        category: "HANGBOARD",
        content: "20mm edge, 7s on/3s off × 6 reps × 3 sets. Half crimp. Felt solid.",
        tags: ["hangboard", "strength", "half-crimp"],
      },
      {
        userId: user.id,
        date: daysAgo(7),
        category: "GENERAL",
        content: "Rest day. Did some light stretching and worked on hip flexibility. Feeling recovered.",
        tags: ["recovery", "flexibility"],
      },
      {
        userId: user.id,
        date: daysAgo(4),
        category: "MENTAL",
        content: "Read about fear of falling and dynamic movement. Watched some V9 beta online. Going to focus on commitment on the new project.",
        tags: ["mental", "beta"],
      },
    ],
  });

  // Goals
  await prisma.goal.createMany({
    data: [
      {
        userId: user.id,
        title: "Send a V8",
        description: "Step up to V8 by end of season",
        targetGrade: "V8",
        gradeSystem: "V_SCALE",
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isCompleted: false,
      },
      {
        userId: user.id,
        title: "Send V7",
        description: "First V7 send",
        targetGrade: "V7",
        gradeSystem: "V_SCALE",
        isCompleted: true,
        completedAt: daysAgo(5),
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Login: demo@sendlog.app / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
