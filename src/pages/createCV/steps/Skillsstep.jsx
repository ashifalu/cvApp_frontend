import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import ItemWrapper from "../components/ItemWrapper";
import FieldError from "../components/FieldError";
import { LEVELS } from "../utils";

const EMPTY_FORM = { skill: "", level: 2 };

// ─── Level Slider ──────────────────────────────────────────────────────────────
const LevelSlider = ({ level, onChange }) => (
    <div className="space-y-4">
        <div className="flex justify-between my-2 items-center">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Expertise Level</label>
            <span className="text-secondary font-semi-bold text-[14px]">{LEVELS[level]}</span>
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

// ─── Shared skill form fields ──────────────────────────────────────────────────
const SkillFormFields = ({ form, setForm, errors, clearError,setShowForm,showForm }) => (
    <div className="relative">
        {setShowForm&&<button
            className="absolute right-0 top-0 rounded-xl transition-colors"
            onClick={() => setShowForm(false)}
        >
            <span className="material-symbols-outlined text-[20px] text-primary/50 hover:text-primary">close</span>

        </button>}
        <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant ">
                Skill Name <span className="text-red-500">*</span>
            </label>
            <input
                className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${
                    (errors.skill&& showForm === true)
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                        : "border-outline-variant/30 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                }`}
                placeholder="e.g. JavaScript, React, Node.js"
                value={form.skill}
                onChange={e => { setForm({ ...form, skill: e.target.value }); clearError("skill"); }}
            />
            {showForm&&<FieldError message={errors.skill}/>}
        </div>
        <LevelSlider level={form.level} onChange={level => setForm({ ...form, level })} />
    </div>
);

// ─── SkillsStep ───────────────────────────────────────────────────────────────
const SkillsStep = ({ onNext, onBack }) => {
    const dispatch = useDispatch();
    const skills   = useSelector(s => s.cv.cvData.skills);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});

    const clearError = (field) => setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });

    const validate = () => {
        if (!form.skill.trim()) {
            setErrors({ skill: "Skill name is required." });
            return false;
        }
        setErrors({});
        return true;
    };

    const addEntry = () => {
        if (!form.skill.trim()) return;
        const isDuplicate = skills.some(item => JSON.stringify(item) === JSON.stringify(form));
        if (!isDuplicate) dispatch(addToList({ form, step: "skills" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.skill.trim()) addEntry();
    };

    const handleNext = () => {
        if (showForm && !skills.length) {
            if (!validate()) return;
            if (form.skill.trim()) addEntry();
        }
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(skills[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        if (!validate()) return;
        dispatch(updateList({ index: editingIndex, data: form, step: "skills" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary  font-bold uppercase tracking-wider">Step 8 of 9: Skills</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[295.2px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div
                            className="hidden md:flex items-center gap-4 mb-6 w-[672px]  bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden ">
                                <div className="w-[385.82px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] mx-7 text-primary font-bold uppercase tracking-wider">Step 8 of 9: Skills</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                Skills
                            </h3>

                        </div>
                        {(skills.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-center text-body-sm text-on-surface-variant">Add certifications, awards, or recognitions you have earned..</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Skill
                            </button>
                        </div>}                    </header>
                    <div className="space-y-3">


                        {/* Existing items */}
                        {skills.map((s, index) => (
                            <ItemWrapper key={index} index={index}
                                         isEditing={editingIndex === index}
                                         onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                         onDelete={() => dispatch(removeFromList({ index, step: "skills" }))}
                                         editForm={
                                             <SkillFormFields
                                                 form={form} setForm={setForm}
                                                 errors={errors} clearError={clearError}
                                             />
                                         }
                            >
                                <p className="text-sm font-medium">{s.skill}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Level — <span className="text-secondary font-medium">{LEVELS[s.level]}</span>
                                </p>
                            </ItemWrapper>
                        ))}
                        {(!showForm&&skills.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Skill
                            </button>
                        </div>}

                        {showForm  && (
                            <div>
                                <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <SkillFormFields
                                        showForm={showForm}
                                        setShowForm={setShowForm}
                                        form={form} setForm={setForm}
                                        errors={errors} clearError={clearError}
                                    />
                                </div>
                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Skill
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="fixed bottom-0 left-0 w-full xl:w-1/2 bg-white border-t border-outline-variant/30 px-4 sm:px-6 md:px-10 py-3 sm:py-4 z-40">
                            <div className="max-w-2xl mx-auto flex justify-between items-center gap-2">
                                <button onClick={onBack}
                                        className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span> Back
                                </button>
                                <button onClick={handleNext}
                                        className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    Next: Language
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SkillsStep;