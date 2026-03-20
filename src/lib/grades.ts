/**
 * Grade normalization utilities.
 * All grades map to a 0-100 numeric scale for sorting and charting.
 * Higher numbers = harder grades.
 */

// V-Scale: V0 (10) to V17 (93)
const V_SCALE_MAP: Record<string, number> = {
  "VB": 5,
  "V0": 10,
  "V0+": 13,
  "V1": 17,
  "V2": 21,
  "V3": 25,
  "V4": 30,
  "V5": 35,
  "V6": 40,
  "V7": 46,
  "V8": 52,
  "V9": 58,
  "V10": 64,
  "V11": 70,
  "V12": 76,
  "V13": 82,
  "V14": 87,
  "V15": 90,
  "V16": 92,
  "V17": 94,
};

// Fontainebleau (Font): 3 to 9A
const FONT_MAP: Record<string, number> = {
  "3":   5,
  "4":   10,
  "4+":  14,
  "5":   18,
  "5+":  22,
  "6A":  26,
  "6A+": 30,
  "6B":  34,
  "6B+": 38,
  "6C":  42,
  "6C+": 46,
  "7A":  52,
  "7A+": 58,
  "7B":  64,
  "7B+": 70,
  "7C":  76,
  "7C+": 82,
  "8A":  87,
  "8A+": 90,
  "8B":  92,
  "8B+": 94,
  "8C":  96,
  "8C+": 98,
  "9A":  100,
};

// Yosemite Decimal System (YDS): 5.6 to 5.15d
const YDS_MAP: Record<string, number> = {
  "5.6":  5,
  "5.7":  9,
  "5.8":  13,
  "5.9":  17,
  "5.10a": 21,
  "5.10b": 24,
  "5.10c": 27,
  "5.10d": 30,
  "5.11a": 34,
  "5.11b": 37,
  "5.11c": 40,
  "5.11d": 43,
  "5.12a": 47,
  "5.12b": 51,
  "5.12c": 55,
  "5.12d": 59,
  "5.13a": 63,
  "5.13b": 67,
  "5.13c": 71,
  "5.13d": 75,
  "5.14a": 79,
  "5.14b": 83,
  "5.14c": 87,
  "5.14d": 91,
  "5.15a": 94,
  "5.15b": 96,
  "5.15c": 98,
  "5.15d": 100,
};

// French sport grades: 4 to 9c+
const FRENCH_MAP: Record<string, number> = {
  "4":   5,
  "4+":  9,
  "5":   13,
  "5+":  17,
  "6a":  21,
  "6a+": 25,
  "6b":  29,
  "6b+": 33,
  "6c":  37,
  "6c+": 41,
  "7a":  46,
  "7a+": 51,
  "7b":  56,
  "7b+": 61,
  "7c":  66,
  "7c+": 71,
  "8a":  76,
  "8a+": 80,
  "8b":  84,
  "8b+": 88,
  "8c":  91,
  "8c+": 94,
  "9a":  96,
  "9a+": 97,
  "9b":  98,
  "9b+": 99,
  "9c":  100,
  "9c+": 100,
};

export type GradeSystem = "V_SCALE" | "FONT" | "YDS" | "FRENCH";

export function normalizeGrade(grade: string, system: GradeSystem): number {
  const normalized = grade.trim().toUpperCase();
  switch (system) {
    case "V_SCALE":
      return V_SCALE_MAP[normalized] ?? 0;
    case "FONT":
      return FONT_MAP[normalized.toUpperCase()] ?? FONT_MAP[grade.trim()] ?? 0;
    case "YDS":
      return YDS_MAP[grade.trim()] ?? 0;
    case "FRENCH":
      return FRENCH_MAP[grade.trim().toLowerCase()] ?? 0;
    default:
      return 0;
  }
}

export function getGradeOptions(system: GradeSystem): string[] {
  switch (system) {
    case "V_SCALE":
      return Object.keys(V_SCALE_MAP);
    case "FONT":
      return Object.keys(FONT_MAP);
    case "YDS":
      return Object.keys(YDS_MAP);
    case "FRENCH":
      return Object.keys(FRENCH_MAP);
    default:
      return [];
  }
}

export function gradeSystemLabel(system: GradeSystem): string {
  switch (system) {
    case "V_SCALE": return "V-Scale";
    case "FONT":    return "Font";
    case "YDS":     return "YDS";
    case "FRENCH":  return "French";
  }
}
