import { z } from "zod";

export const climbSchema = z.object({
  name: z.string().optional().nullable(),
  gradeSystem: z.enum(["V_SCALE", "FONT", "YDS", "FRENCH"]),
  grade: z.string().min(1, "Grade is required"),
  style: z.enum(["BOULDER", "SPORT", "TRAD", "TOP_ROPE"]),
  outcome: z.enum(["SEND", "FLASH", "ONSIGHT", "ATTEMPT", "PROJECT"]),
  attempts: z.number().int().positive().default(1),
  isProject: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().optional().nullable(),
  betaVideo: z.string().url().optional().nullable(),
});

export type ClimbFormData = z.infer<typeof climbSchema>;
