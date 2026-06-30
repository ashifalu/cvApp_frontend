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
        <div className="flex justify-between items-center">
            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Expertise Level</label>
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

// ─── Shared skill form fields ──────────────────────────────────────────────────
const SkillFormFields = ({ form, setForm, errors, clearError }) => (
    <div className="space-y-6">
        <div className="space-y-2">
            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">
                Skill Name <span className="text-red-500">*</span>
            </label>
            <input
                className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${
                    errors.skill
                        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                        : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"
                }`}
                placeholder="e.g. JavaScript, React, Node.js"
                value={form.skill}
                onChange={e => { setForm({ ...form, skill: e.target.value }); clearError("skill"); }}
            />
            <FieldError message={errors.skill} />
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
        if (showForm || !skills.length) {
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
            <div className="mb-5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Skills</h1>
                <p className="text-on-surface-variant font-body-md">Showcase your expertise. Add your top technical and soft skills to stand out to recruiters.</p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

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

                {/* Initial form (when list is empty) or Add More form */}
                {(showForm || !skills.length) && (
                    <SkillFormFields
                        form={form} setForm={setForm}
                        errors={errors} clearError={clearError}
                    />
                )}

                {editingIndex === null && (
                    <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                        <button className="flex items-center gap-3" onClick={handleAddMore}>
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                            <span className="hover:underline underline-offset-4">Add another skill</span>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                    <button onClick={onBack} className="px-8 py-3 border border-outline rounded-xl font-button text-button text-on-surface hover:bg-surface-container transition-colors">Back</button>
                    <button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary px-12 py-3 rounded-xl font-button text-button text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Next: Language</button>
                </div>
            </div>
        </div>
    );
};

export default SkillsStep;