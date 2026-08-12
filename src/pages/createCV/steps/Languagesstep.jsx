import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice.js"; // adjust path
import { useNavigate } from "react-router-dom";
import ItemWrapper from "../components/ItemWrapper";
import FieldError from "../components/FieldError";
import { LEVELS } from "../utils";
import { generatePdfApi, storeDataApi } from "../../../services/allApi.js";
import UserAuth from "../../../users/components/UserAuth.jsx"; // adjust path

const EMPTY_FORM = { language: "", level: 2 };

// ─── Level Slider (same as SkillsStep — reusable) ─────────────────────────────
const LevelSlider = ({ level, onChange,}) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Proficiency Level</label>
            <span className="text-secondary font-bold text-body-lg">{LEVELS[level]}</span>
        </div>
        <div className="h-12">
            <div className="relative flex bg-surface-container-high rounded-xl h-4">
                <div
                    className="absolute top-0 h-full bg-secondary rounded-xl transition-all duration-300"
                    style={{ width: `${100 / LEVELS.length}%`, left: `${(100 / LEVELS.length) * level}%` }}
                >
                    <div className="absolute left-[50%] top-[-70%] h-10 w-10 bg-white border-[4px] border-secondary rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
                        <div className="h-2 w-2 bg-secondary rounded-full" />
                    </div>
                </div>
                {LEVELS.map((lbl, i) => (
                    <button key={i} type="button" onClick={() => onChange(i)}
                            className="flex-1 relative z-10 flex items-center justify-center">
                        <p className="mt-14 text-xs font-label-bold text-[10px] text-outline">{lbl}</p>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

// ─── Shared language form fields ───────────────────────────────────────────────
const LanguageFormFields = ({ form, setForm, errors, clearError }) => (
    <div className="space-y-6">
        <div className="space-y-2">
            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">
                Language <span className="text-red-500">*</span>
            </label>
            <input
                className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${
                    errors.language
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                        : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"
                }`}
                placeholder="e.g. English, Arabic, French"
                value={form.language}
                onChange={e => { setForm({ ...form, language: e.target.value }); clearError("language"); }}
            />
            <FieldError message={errors.language} />
        </div>
        <LevelSlider level={form.level} onChange={level => setForm({ ...form, level })} />
    </div>
);

// ─── LanguagesStep ────────────────────────────────────────────────────────────
// This is the LAST step — it also handles Save CV (PDF generation + store data)
const LanguagesStep = ({ onBack,selectedTheme,temp_id }) => {
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const languages  = useSelector(s => s.cv.cvData.languages);

    // Need all CV data for saving
    const personalInfo        = useSelector(s => s.cv.cvData.personalInfo);
    const professionalSummary = useSelector(s => s.cv.cvData.professionalSummary);
    const experience          = useSelector(s => s.cv.cvData.experience);
    const education           = useSelector(s => s.cv.cvData.education);
    const skills              = useSelector(s => s.cv.cvData.skills);
    const projects            = useSelector(s => s.cv.cvData.projects);
    const awards              = useSelector(s => s.cv.cvData.awards);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});
    const [saving,       setSaving]       = useState(false);
    const [open, setOpen]                     = useState(false)

    const storeDataRef = useRef({});


    const clearError = (field) => setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });

    const validate = () => {
        if (!form.language.trim()) {
            setErrors({ language: "Language is required." });
            return false;
        }
        setErrors({});
        return true;
    };

    const addEntry = () => {
        if (!form.language.trim()) return;
        const isDuplicate = languages.some(item => JSON.stringify(item) === JSON.stringify(form));
        if (!isDuplicate) dispatch(addToList({ form, step: "languages" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.language.trim()) addEntry();
    };

    const handleEdit = (index) => {
        setForm(languages[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        if (!validate()) return;
        dispatch(updateList({ index: editingIndex, data: form, step: "languages" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    // ─── Save CV ───────────────────────────────────────────────────────────────
    const handleSave = async () => {
        // Add last language entry if the user hasn't clicked + yet
        if (form.language.trim()) {
            if (!validate()) return;
            addEntry();
        }

        setSaving(true);
        try {
            const token       = sessionStorage.getItem("token");
            const existingUser = JSON.parse(sessionStorage.getItem("existingUser") || "{}");

            // Get the rendered HTML from the hidden print area
            const printArea = document.getElementById("pdf-print-area");
            if (!printArea) { alert("Template not found. Please try again."); return; }

            const pdfResponse = await generatePdfApi({ html: printArea.innerHTML });
            const pdfUrl      = pdfResponse.data.pdfUrl;

            const reqBody = {
                personalInfo: {
                    ...personalInfo,
                    phone: personalInfo.phone
                        ? `${personalInfo.phoneCountryCode} ${personalInfo.phone}`
                        : "",
                },
                professionalSummary,
                experience,
                education,
                projects,
                awards,
                skills,
                languages,
                resumeUrl: pdfUrl,
                template: temp_id,
                theme: selectedTheme
            };
            const reqHeader = { authorization: `Bearer ${token}` };

            if (token) {
                await storeDataApi(reqBody, reqHeader);
                navigate(`/user-profile/${existingUser._id}`);

            } else {
                storeDataRef.current = reqBody;
                setOpen(true); // open auth modal
            }
        } catch (err) {
            console.error("Save error:", err.message);
            alert("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-8 sm:py-12 pb-28 block" id="edit-panel">                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <div
                            className="flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 7 of 8: Skills</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">Language</span>
                                Languages
                            </h3>
                            <button onClick={handleAddMore}
                                    className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-sm">add</span> Add Role
                            </button>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Add certifications, awards, or recognitions you have earned..</p>
                    </header>
                    <div className="space-y-12">

                        {/* Initial form (when list is empty) or Add More form */}
                        {(showForm || !languages.length) && (
                            <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                <LanguageFormFields
                                    form={form} setForm={setForm}
                                    errors={errors} clearError={clearError}
                                />
                            </div>
                        )}

                        {/* Existing items */}
                        {languages.map((l, index) => (
                            <ItemWrapper key={index} index={index}
                                         isEditing={editingIndex === index}
                                         onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                         onDelete={() => dispatch(removeFromList({ index, step: "languages" }))}
                                         editForm={
                                             <LanguageFormFields
                                                 form={form} setForm={setForm}
                                                 errors={errors} clearError={clearError}
                                             />
                                         }
                            >
                                <p className="text-sm font-medium">{l.language}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Level — <span className="text-secondary font-medium">{LEVELS[l.level]}</span>
                                </p>
                            </ItemWrapper>
                        ))}

                        <div className="fixed bottom-0 left-0 w-full xl:w-1/2 bg-white border-t border-outline-variant/30 px-4 sm:px-6 md:px-10 py-3 sm:py-4 z-40">
                            <div className="max-w-2xl mx-auto flex justify-between items-center gap-2">
                                <button onClick={onBack}
                                        className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span> Back
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                        className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                                    {saving ? "Saving..." : "Save CV"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <UserAuth isOpen={open} storeData={storeDataRef.current} onClose={() => setOpen(false)} />

        </div>
    );
};

export default LanguagesStep;