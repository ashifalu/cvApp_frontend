import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper, { TrashSvg } from "../components/ItemWrapper";
import FieldError from "../components/FieldError";
import { fieldClass, formatMonthYear } from "../utils";

const EMPTY_FORM = {
    jobTitle: "", employer: "", startDate: null, endDate: null,
    country: "", city: "", responsibilities: [],
};

// ─── Shared experience form fields ────────────────────────────────────────────
const ExperienceFormFields = ({ form, setForm, errors, clearError, responsibility, setResponsibility }) => {
    const fc = (field) => fieldClass(errors, field);

    const addResponsibility = () => {
        if (!responsibility.trim()) return;
        const isDuplicate = form.responsibilities.some(r => r === responsibility.trim());
        if (!isDuplicate) {
            setForm({ ...form, responsibilities: [...form.responsibilities, responsibility.trim()] });
            setResponsibility("");
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Job Title <span className="text-red-500">*</span></label>
                    <input className={fc("jobTitle")} placeholder="e.g. Senior Product Designer"
                           value={form.jobTitle} onChange={e => { setForm({ ...form, jobTitle: e.target.value }); clearError("jobTitle"); }} />
                    <FieldError message={errors.jobTitle} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Employer <span className="text-red-500">*</span></label>
                    <input className={fc("employer")} placeholder="e.g. Google"
                           value={form.employer} onChange={e => { setForm({ ...form, employer: e.target.value }); clearError("employer"); }} />
                    <FieldError message={errors.employer} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Start Date</label>
                    <DatePicker selected={form.startDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Select month & year"
                                onChange={date => setForm({ ...form, startDate: formatMonthYear(date) })}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">End Date</label>
                    <DatePicker selected={form.endDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Select month & year"
                                onChange={date => setForm({ ...form, endDate: formatMonthYear(date) })}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                    <input className={fc("exp_country")} placeholder="e.g. United States"
                           value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                    <input className={fc("exp_city")} placeholder="e.g. San Francisco"
                           value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Responsibilities</label>
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md"
                        onClick={addResponsibility}
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Describe a responsibility and click +"
                    rows="3"
                    value={responsibility}
                    onChange={e => setResponsibility(e.target.value)}
                />
                {form.responsibilities.map((r, i) => (
                    <div key={i} className="flex justify-between py-3 gap-4 px-4 items-center mb-1 rounded-xl bg-purple-100">
                        <div className="text-sm">{r}</div>
                        <button
                            type="button"
                            className="px-2 py-2 border border-red-500 bg-purple-100 rounded-xl"
                            onClick={() => setForm({ ...form, responsibilities: form.responsibilities.filter((_, j) => j !== i) })}
                        >
                            <TrashSvg />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── ExperienceStep ───────────────────────────────────────────────────────────
const ExperienceStep = ({ onNext, onBack }) => {
    const dispatch   = useDispatch();
    const experience = useSelector(s => s.cv.cvData.experience);

    const [form,           setForm]           = useState(EMPTY_FORM);
    const [editingIndex,   setEditingIndex]   = useState(null);
    const [showForm,       setShowForm]       = useState(false);
    const [errors,         setErrors]         = useState({});
    const [responsibility, setResponsibility] = useState("");

    const clearError = (field) => setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });

    const validate = () => {
        const e = {};
        if (!form.jobTitle.trim()) e.jobTitle = "Job title is required.";
        if (!form.employer.trim()) e.employer  = "Employer is required.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Flush the responsibility textarea before saving
    const flushAndGetForm = () => {
        if (responsibility.trim()) {
            const updated = { ...form, responsibilities: [...form.responsibilities, responsibility.trim()] };
            setResponsibility("");
            return updated;
        }
        return form;
    };

    const addEntry = () => {
        const finalForm = flushAndGetForm();
        if (!finalForm.jobTitle) return;
        const isDuplicate = experience.some(item => JSON.stringify(item) === JSON.stringify(finalForm));
        if (!isDuplicate) dispatch(addToList({ form: finalForm, step: "experience" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.jobTitle) addEntry();
    };

    const handleNext = () => {
        if (showForm) {
            if (!validate()) return;
            if (form.jobTitle) addEntry();
        }
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(experience[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        if (!validate()) return;
        const finalForm = flushAndGetForm();
        dispatch(updateList({ index: editingIndex, data: finalForm, step: "experience" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <section className="h-full bg-surface-container-lowest px-6 md:px-10 py-12 block" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <div
                            className="flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-1/2 h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 2 of 4: Experience</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant">Detail your career milestones.
                            Focus on measurable achievements and key responsibilities.</p>
                    </header>
                    <div className="space-y-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">work</span>
                                Experience
                            </h3>
                            <button
                                className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-sm">add</span> Add Role
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                {/* Existing items */}
                {experience.map((exp, index) => (
                    <ItemWrapper key={index} index={index}
                                 isEditing={editingIndex === index}
                                             onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                             onDelete={() => dispatch(removeFromList({index, step: "experience"}))}
                                             editForm={
                                                 <ExperienceFormFields
                                                     form={form} setForm={setForm}
                                                     errors={errors} clearError={clearError}
                                                     responsibility={responsibility}
                                                     setResponsibility={setResponsibility}
                                                 />
                                             }
                                >
                                    <p className="text-sm font-medium">{exp.jobTitle} at {exp.employer}</p>
                                    <p className="text-xs text-gray-600">{[exp.city, exp.country].filter(Boolean).join(", ")}</p>
                                    {exp.startDate &&
                                        <p className="text-xs text-gray-500 mt-1">{exp.startDate} – {exp.endDate || "Present"}</p>}
                                    {exp.responsibilities?.length > 0 && (
                                        <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside marker:text-[#5F53F5]">
                                            {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    )}
                                </ItemWrapper>
                            ))}

                            {/* New entry form */}
                            {showForm && (
                                <div
                                    className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                    <ExperienceFormFields
                                        form={form} setForm={setForm}
                                        errors={errors} clearError={clearError}
                                        responsibility={responsibility} setResponsibility={setResponsibility}
                                    />
                                </div>
                            )}

                            {editingIndex === null && (
                                <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                    <button className="flex items-center gap-3" onClick={handleAddMore}>
                                        <span
                                            className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                        <span
                                            className="hover:underline underline-offset-4">Add another experience</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                <button onClick={onBack}
                                        className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back
                                </button>
                                <button onClick={handleNext}
                                        className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next:
                                    Projects
                                </button>
                            </div>
                        </div>
                    </div>
                    );
                    };

                    export default ExperienceStep;