"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSession } from "@/actions/sessions";
import { getGradeOptions, gradeSystemLabel } from "@/lib/grades";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const climbSchema = z.object({
  name: z.string().optional(),
  gradeSystem: z.enum(["V_SCALE", "FONT", "YDS", "FRENCH"]),
  grade: z.string().min(1, "Required"),
  style: z.enum(["BOULDER", "SPORT", "TRAD", "TOP_ROPE"]),
  outcome: z.enum(["SEND", "FLASH", "ONSIGHT", "ATTEMPT", "PROJECT"]),
  attempts: z.number().int().positive().default(1),
  isProject: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

const formSchema = z.object({
  date: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  locationType: z.enum(["GYM", "OUTDOOR"]),
  climbingType: z.enum(["BOULDERING", "SPORT", "TRAD", "MULTI_PITCH", "TOP_ROPE"]),
  durationMinutes: z.number().int().positive().optional(),
  energyLevel: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
  climbs: z.array(climbSchema),
});

type FormData = z.infer<typeof formSchema>;

const GRADE_SYSTEMS = ["V_SCALE", "FONT", "YDS", "FRENCH"] as const;

export function NewSessionForm() {
  const [step, setStep] = useState<"session" | "climbs">("session");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      locationType: "GYM" as const,
      climbingType: "BOULDERING" as const,
      climbs: [] as FormData["climbs"],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "climbs" });

  const watchedClimbs = watch("climbs");

  function addClimb() {
    append({
      gradeSystem: "V_SCALE",
      grade: "V4",
      style: "BOULDER",
      outcome: "SEND",
      attempts: 1,
      isProject: false,
    });
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      await createSession(data as Parameters<typeof createSession>[0]);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === "session" && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Session Details</h2>

          <Field label="Date" error={errors.date?.message}>
            <input
              type="date"
              {...register("date")}
              className={inputClass(!!errors.date)}
            />
          </Field>

          <Field label="Location" error={errors.location?.message}>
            <input
              type="text"
              placeholder="e.g. Movement Oakland, Red Rock Canyon"
              {...register("location")}
              className={inputClass(!!errors.location)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Location type">
              <select {...register("locationType")} className={inputClass()}>
                <option value="GYM">Gym</option>
                <option value="OUTDOOR">Outdoor</option>
              </select>
            </Field>

            <Field label="Climbing type">
              <select {...register("climbingType")} className={inputClass()}>
                <option value="BOULDERING">Bouldering</option>
                <option value="SPORT">Sport</option>
                <option value="TRAD">Trad</option>
                <option value="TOP_ROPE">Top rope</option>
                <option value="MULTI_PITCH">Multi-pitch</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (minutes)">
              <input
                type="number"
                min={1}
                placeholder="e.g. 90"
                {...register("durationMinutes", { valueAsNumber: true })}
                className={inputClass()}
              />
            </Field>

            <Field label="Energy level (1-5)">
              <select {...register("energyLevel", { valueAsNumber: true })} className={inputClass()}>
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              rows={3}
              placeholder="How did the session feel?"
              {...register("notes")}
              className={inputClass()}
            />
          </Field>

          <button
            type="button"
            onClick={() => setStep("climbs")}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg py-2 text-sm transition-colors"
          >
            Next: Add Climbs →
          </button>
        </div>
      )}

      {step === "climbs" && (
        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Climbs</h2>
              <button
                type="button"
                onClick={addClimb}
                className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add climb
              </button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-lg">
                <p className="text-sm">No climbs yet.</p>
                <button
                  type="button"
                  onClick={addClimb}
                  className="mt-2 text-sm text-brand-600 hover:underline"
                >
                  Add your first climb
                </button>
              </div>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const gs = (watchedClimbs[index]?.gradeSystem ?? "V_SCALE") as "V_SCALE" | "FONT" | "YDS" | "FRENCH";
                const gradeOptions = getGradeOptions(gs);
                return (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Climb {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Field label="Name (optional)">
                      <input
                        type="text"
                        placeholder="Route or problem name"
                        {...register(`climbs.${index}.name`)}
                        className={inputClass()}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Grade system">
                        <select
                          {...register(`climbs.${index}.gradeSystem`)}
                          className={inputClass()}
                        >
                          {GRADE_SYSTEMS.map((gs) => (
                            <option key={gs} value={gs}>{gradeSystemLabel(gs)}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Grade" error={errors.climbs?.[index]?.grade?.message}>
                        <select
                          {...register(`climbs.${index}.grade`)}
                          className={inputClass(!!errors.climbs?.[index]?.grade)}
                        >
                          {gradeOptions.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Outcome">
                        <select {...register(`climbs.${index}.outcome`)} className={inputClass()}>
                          <option value="SEND">Send</option>
                          <option value="FLASH">Flash</option>
                          <option value="ONSIGHT">Onsight</option>
                          <option value="ATTEMPT">Attempt</option>
                          <option value="PROJECT">Project</option>
                        </select>
                      </Field>

                      <Field label="Attempts">
                        <input
                          type="number"
                          min={1}
                          {...register(`climbs.${index}.attempts`, { valueAsNumber: true })}
                          className={inputClass()}
                        />
                      </Field>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`project-${index}`}
                        {...register(`climbs.${index}.isProject`)}
                        className="rounded"
                      />
                      <label htmlFor={`project-${index}`} className="text-sm text-slate-600">
                        Mark as project
                      </label>
                    </div>

                    <Field label="Notes">
                      <input
                        type="text"
                        placeholder="Beta, crux, conditions…"
                        {...register(`climbs.${index}.notes`)}
                        className={inputClass()}
                      />
                    </Field>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("session")}
              className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg py-2 text-sm transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg py-2 text-sm transition-colors"
            >
              {submitting ? "Saving…" : "Save Session"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

function inputClass(hasError = false) {
  return cn(
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white",
    hasError ? "border-red-400" : "border-slate-200"
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
