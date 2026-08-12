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
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block" id="edit-panel">                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className=" hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[95.95px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 2 of 9: Summary</span>
                        </div>
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary font-bold uppercase tracking-wider">Step 2 of 9: Professional Summary</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[73.44px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">note</span>
                            Professional Summary
                        </h3>
                        <p className="font-body-md text-[14px]  md:text-body-md text-on-surface-variant">Write a short paragraph about your experience, skills, and what makes you stand out.</p>
                    </header>
                    <div className="space-y-12">
                        <div className="">
                            <div className="space-y-1">
                                <label className="block font-label-md text-label-md text-on-surface-variant ">
                                    Summary <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    className={`w-full px-4 py-3 rounded-lg border text-on-surface-variant text-sm font-label-m transition-all outline-none resize-none ${
                                        errors.professionalSummary
                                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                                            : "border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                        <div className="fixed bottom-0 left-0 w-full xl:w-1/2 bg-white border-t border-outline-variant/30 px-4 sm:px-6 md:px-10 py-3 sm:py-4 z-40">
                            <div className="max-w-2xl mx-auto flex justify-between items-center gap-2">
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
                </div>
            </section>
        </div>
    );
};

export default SummaryStep;