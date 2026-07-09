// ─── fieldClass ──────────────────────────────────────────────────────────────
// Returns tailwind classes for an input field, red when there's an error.
export const fieldClass = (errors, field) =>
    `w-full px-4 py-3 rounded-lg border transition-all outline-none ${
        errors[field]
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
            : "border-outline-variant/30 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
    }`;

// ─── formatMonthYear ─────────────────────────────────────────────────────────
// Converts a Date object → "Jan 2024"
export const formatMonthYear = (date) => {
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${month} ${date.getFullYear()}`;
};

// ─── LEVELS ──────────────────────────────────────────────────────────────────
export const LEVELS = ["Beginner", "Basic", "Skillful", "Advanced", "Expert"];

// ─── STEPS ───────────────────────────────────────────────────────────────────
export const STEPS = [
    "personalInfo",
    "professionalSummary",
    "education",
    "experience",
    "projects",
    "awards",
    "skills",
    "languages",
];