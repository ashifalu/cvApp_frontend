import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProfessionalSummary } from "../../../state/cvSlice"; // adjust path
import FieldError from "../components/FieldError";

// ─── SummaryStep ──────────────────────────────────────────────────────────────
// Props:
//   onNext – go to next step
//   onBack – go to previous step
const SummaryStep = ({ onNext, onBack }) => {
    const dispatch    = useDispatch();
    const savedSummary = useSelector(s => s.cv.cvData.professionalSummary);

    const [summary, setSummary] = useState("");
    const [errors,  setErrors]  = useState({});

    // Pre-fill from Redux if available
    useEffect(() => {
        if (savedSummary) setSummary(savedSummary);
    }, [savedSummary]);

    const validate = () => {
        if (!summary.trim()) {
            setErrors({ professionalSummary: "Professional summary is required." });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleNext = () => {
        if (!validate()) return;
        dispatch(addProfessionalSummary(summary));
        onNext();
    };

    return (
        <div>
            <div className="mb-5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Professional Summary</h1>
                <p className="text-on-surface-variant font-body-md">Write a short paragraph about your experience, skills, and what makes you stand out.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                <div className="space-y-1">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">
                        Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${
                            errors.professionalSummary
                                ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                                : "border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary"
                        }`}
                        placeholder="Describe your key achievements and professional strengths..."
                        rows="8"
                        maxLength={1000}
                        value={summary}
                        onChange={e => { setSummary(e.target.value); setErrors({}); }}
                    />
                    <FieldError message={errors.professionalSummary} />
                    <p className="text-xs text-on-surface-variant text-right">{summary.length}/1000</p>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-4 md:px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                        Next: Education
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SummaryStep;