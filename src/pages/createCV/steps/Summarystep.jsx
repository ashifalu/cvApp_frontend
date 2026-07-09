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
            <section className="h-full bg-surface-container-lowest px-6 md:px-10 py-12 block" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <div
                            className="flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[115.2px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 2 of 6: Summary</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">note</span>
                            Professional Summary
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Write a short paragraph about your experience, skills, and what makes you stand out.</p>
                    </header>
                    <div className="space-y-12">
                        <div className="">
                            <div className="space-y-1">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                                    Summary <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${
                                        errors.professionalSummary
                                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                                            : "border-outline-variant/30 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                        </div>
                        <div
                            className="pt-8 flex justify-between items-center border-t border-outline-variant/30 pb-12">
                            <button onClick={onBack}
                                    className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span> Back
                            </button>
                            <button onClick={handleNext}
                                    className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                Next: Education
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SummaryStep;