import { z } from "zod";

export const sessionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  locationType: z.enum(["GYM", "OUTDOOR"]),
  climbingType: z.enum(["BOULDERING", "SPORT", "TRAD", "MULTI_PITCH", "TOP_ROPE"]),
  durationMinutes: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
  energyLevel: z.number().int().min(1).max(5).optional().nullable(),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
