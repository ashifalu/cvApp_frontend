import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper, { TrashSvg } from "../components/ItemWrapper";
import FieldError from "../components/FieldError";
import { fieldClass, formatMonthYear } from "../utils";
import { parseMonthYear } from "../utils";

const EMPTY_FORM = {
    jobTitle: "", employer: "", startDate: null, endDate: null,
    currentlyWorking: false,
    country: "", city: "", responsibilities: [],
};

// ─── Shared experience form fields ────────────────────────────────────────────
const ExperienceFormFields = ({ form, setForm, errors, clearError, responsibility, setResponsibility,setShowForm }) => {
    const fc = (field) => fieldClass(errors, field);

    const addResponsibility = () => {
        if (!responsibility.trim()) return;
        const isDuplicate = form.responsibilities.some(r => r === responsibility.trim());
        if (!isDuplicate) {
            setForm({ ...form, responsibilities: [...form.responsibilities, responsibility.trim()] });
            setResponsibility("");
        }
    };

    const handleCurrentlyWorkingChange = (checked) => {
        setForm({
            ...form,
            currentlyWorking: checked,
            endDate: checked ? "Present" : null,
        });
    };

    return (
        <div className="relative">
            {setShowForm&&<button
                className="absolute right-0 top-0 rounded-xl transition-colors"
                onClick={() => setShowForm(false)}
            >
                <span className="material-symbols-outlined text-[20px] text-primary/50 hover:text-primary">close</span>

            </button>}
           <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">Job Title <span className="text-red-500">*</span></label>
                       <input className={fc("jobTitle")} placeholder="e.g. Senior Product Designer"
                              value={form.jobTitle} onChange={e => { setForm({ ...form, jobTitle: e.target.value }); clearError("jobTitle"); }} />
                       <FieldError message={errors.jobTitle} />
                   </div>
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant ">Employer <span className="text-red-500">*</span></label>
                       <input className={fc("employer")} placeholder="e.g. Google"
                              value={form.employer} onChange={e => { setForm({ ...form, employer: e.target.value }); clearError("employer"); }} />
                       <FieldError message={errors.employer} />
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">Start Date</label>
                       <DatePicker selected={form.startDate} dateFormat="MMM yyyy" showMonthYearPicker
                                   placeholderText="Select month & year"
                                   onChange={date => setForm({ ...form, startDate: formatMonthYear(date) })}
                                   className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                       <label className="flex items-center gap-2 pt-1 cursor-pointer w-fit">
                           <input
                               type="checkbox"
                               checked={form.currentlyWorking}
                               onChange={e => handleCurrentlyWorkingChange(e.target.checked)}
                               className="w-5 h-5 rounded accent-primary cursor-pointer"
                           />
                           <span className="font-label-md text-label-md text-on-surface-variant">I currently work here</span>
                       </label>
                   </div>
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">End Date</label>
                       {form.currentlyWorking ? (
                           <div className="w-full px-6 py-3 rounded-lg border border-outline-variant/20 bg-surface-container text-on-surface-variant/50 select-none cursor-not-allowed">
                               Present
                           </div>
                       ) : (
                           <DatePicker selected={form.endDate} dateFormat="MMM yyyy" showMonthYearPicker
                                       placeholderText="Select month & year"
                                       onChange={date => setForm({ ...form, endDate: formatMonthYear(date) })}
                                       className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                       )}
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">Country</label>
                       <input className={fc("exp_country")} placeholder="e.g. United States"
                              value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                   </div>
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">City</label>
                       <input className={fc("exp_city")} placeholder="e.g. San Francisco"
                              value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                   </div>
               </div>

               {/* Responsibilities */}
               <div className="space-y-2">
                   <div className="flex justify-between items-center mb-1">
                       <label className="block font-label-md text-label-md text-on-surface-variant ">Responsibilities</label>
                       <button
                           type="button"
                           className="px-2 py-1 text-xs  flex items-center justify-center rounded-lg border border-primary text-primary hover:scale-110 transition-transform active:scale-95 shadow-md"
                           onClick={addResponsibility}
                       >
                           add more
                       </button>
                   </div>
                   <textarea
                       className="w-full px-4 py-3 rounded-lg text-on-surface-variant text-sm border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none  resize-none"
                       placeholder="Describe a responsibility and click +"
                       rows="3"
                       value={responsibility}
                       onChange={e => setResponsibility(e.target.value)}
                   />
                   {form.responsibilities.map((r, i) => (
                       <div key={i} className="flex justify-between py-3 gap-4 px-4 items-center mb-1 rounded-xl bg-primary/10">
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
        const exp = experience[index];
        setForm({
            ...exp,
            startDate: parseMonthYear(exp.startDate),
            endDate: exp.currentlyWorking ? "Present" : parseMonthYear(exp.endDate),
        });
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        if (!validate()) return;
        const finalForm = flushAndGetForm();
        const normalized = {
            ...finalForm,
            startDate: finalForm.startDate instanceof Date ? formatMonthYear(finalForm.startDate) : finalForm.startDate,
            endDate: finalForm.currentlyWorking
                ? "Present"
                : (finalForm.endDate instanceof Date ? formatMonthYear(finalForm.endDate) : finalForm.endDate),
        };
        dispatch(updateList({ index: editingIndex, data: normalized, step: "experience" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className="hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[191.90px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 4 of 9: Experience</span>
                        </div>
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary  font-bold uppercase tracking-wider">Step 4 of 9: Experience</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[147.55px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">work</span>
                                Experience
                            </h3>

                        </div>
                        {(experience.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-center text-body-sm text-on-surface-variant">Detail your career milestones.
                                Focus on measurable achievements and key responsibilities.</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Experience
                            </button>
                        </div>}
                    </header>
                    <div className="space-y-3">



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
                        {(!showForm&&experience.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Experience
                            </button>
                        </div>}

                        {showForm && (
                            <div>
                                <div
                                    className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <ExperienceFormFields
                                        form={form} setForm={setForm}
                                        setShowForm={setShowForm}
                                        errors={errors} clearError={clearError}
                                        responsibility={responsibility} setResponsibility={setResponsibility}
                                    />
                                </div>
                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Experience
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
                                        className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    Next: Projects
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )};

export default ExperienceStep;