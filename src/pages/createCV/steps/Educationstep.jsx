import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper from "../components/ItemWrapper";
import FieldError from "../components/FieldError";
import { fieldClass, formatMonthYear } from "../utils";

const EMPTY_FORM = {
    school: "", degree: "", fieldOfStudy: "", grade: "",
    startDate: null, endDate: null, currentlyEnrolled: false,
    country: "", city: "",
};

const DEGREES = [
    "High School Diploma","Internship Course","Associate's","Bachelor's",
    "Master's","MBA","PhD / Doctorate","MD (Medicine)","JD (Law)",
    "Certificate","Diploma","Other",
];

const FIELDS_OF_STUDY = {
    "Science & Technology": ["Computer Science","MERN Stack Development","Software Engineering","Information Technology","Data Science","Artificial Intelligence","Cybersecurity","Biology","Chemistry","Physics","Mathematics","Statistics","Environmental Science"],
    "Engineering":          ["Electrical Engineering","Mechanical Engineering","Civil Engineering","Chemical Engineering","Biomedical Engineering"],
    "Business & Finance":   ["Business Administration","Finance","Accounting","Marketing","Economics","Management","Human Resources"],
    "Arts & Humanities":    ["English Literature","History","Philosophy","Fine Arts","Graphic Design","Architecture","Film & Media Studies"],
    "Social Sciences":      ["Psychology","Sociology","Political Science","International Relations","Communications"],
    "Health & Medicine":    ["Medicine","Nursing","Pharmacy","Public Health","Dentistry"],
    "Law & Education":      ["Law","Education","Early Childhood Education"],
};

// ─── Shared education form fields ─────────────────────────────────────────────
const EducationFormFields = ({ form, setForm, errors, clearError, setShowForm }) => {
    const fc = (field) => fieldClass(errors, field);

    const handleCurrentlyEnrolledChange = (checked) => {
        setForm({
            ...form,
            currentlyEnrolled: checked,
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
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">School</label>
                        <input className={fc("school")} placeholder="e.g. Harvard University"
                               value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Degree <span className="text-red-500">*</span></label>
                        <select value={form.degree} className={fc("degree")}
                                onChange={e => { setForm({ ...form, degree: e.target.value }); clearError("degree"); }}>
                            <option value="">Select Degree</option>
                            {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <FieldError message={errors.degree} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Field Of Study <span className="text-red-500">*</span></label>
                        <select value={form.fieldOfStudy} className={fc("fieldOfStudy")}
                                onChange={e => { setForm({ ...form, fieldOfStudy: e.target.value }); clearError("fieldOfStudy"); }}>
                            <option value="">Select Field of Study</option>
                            {Object.entries(FIELDS_OF_STUDY).map(([group, items]) => (
                                <optgroup key={group} label={group}>
                                    {items.map(f => <option key={f} value={f}>{f}</option>)}
                                </optgroup>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        <FieldError message={errors.fieldOfStudy} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">GPA</label>
                        <input className={fc("grade")} placeholder="e.g. 3.8"
                               value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
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
                                checked={form.currentlyEnrolled}
                                onChange={e => handleCurrentlyEnrolledChange(e.target.checked)}
                                className="w-5 h-5 rounded accent-primary cursor-pointer"
                            />
                            <span className="font-label-md text-label-md text-on-surface-variant">I'm still enrolled</span>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">End Date</label>
                        {form.currentlyEnrolled ? (
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
                        <input className={fc("edu_country")} placeholder="e.g. United States"
                               value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant ">City</label>
                        <input className={fc("edu_city")} placeholder="e.g. Boston"
                               value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── EducationStep ────────────────────────────────────────────────────────────
const EducationStep = ({ onNext, onBack }) => {
    const dispatch  = useDispatch();
    const education = useSelector(s => s.cv.cvData.education);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});

    const clearError = (field) => setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });

    const validate = () => {
        const e = {};
        if (!form.degree)       e.degree       = "Please select a degree.";
        if (!form.fieldOfStudy) e.fieldOfStudy = "Please select a field of study.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const addEntry = () => {
        if (!form.degree) return;
        const isDuplicate = education.some(item => JSON.stringify(item) === JSON.stringify(form));
        if (!isDuplicate) dispatch(addToList({ form, step: "education" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.degree) { addEntry(); }
    };

    const handleNext = () => {
        if (showForm) {
            if (!validate()) return;
            if (form.degree) addEntry();
        }
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(education[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        if (!validate()) return;
        dispatch(updateList({ index: editingIndex, data: form, step: "education" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className=" hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[143.92px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 3 of 9: Education</span>
                        </div>
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary font-bold uppercase tracking-wider">Step 3 of 9: Education</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[110.66px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                                Education
                            </h3>

                        </div>
                        {(education.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-[14px]  md:text-body-sm text-center text-on-surface-variant">Detail your career milestones.
                                Focus on measurable achievements and key responsibilities.</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Education
                            </button>
                        </div>}

                    </header>
                    <div className="space-y-3">

                        {education.map((e, index) => (
                            <ItemWrapper key={index} index={index}
                                         isEditing={editingIndex === index}
                                         onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                         onDelete={() => dispatch(removeFromList({ index, step: "education" }))}
                                         editForm={
                                             <EducationFormFields
                                                 form={form} setForm={setForm}
                                                 errors={errors} clearError={clearError}
                                             />
                                         }
                            >
                                <p className="text-sm font-medium">{e.degree} in {e.fieldOfStudy}</p>
                                <p className="text-xs text-gray-600">{[e.school, e.city, e.country].filter(Boolean).join(", ")}</p>
                                {e.startDate && <p className="text-xs text-gray-500 mt-1">{e.startDate} – {e.endDate || "Present"}</p>}
                            </ItemWrapper>
                        ))}

                        {(!showForm&&education.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Education
                            </button>
                        </div>}
                        {/* New entry form */}
                        {showForm && (
                            <div>
                                <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <EducationFormFields
                                        setShowForm={setShowForm}
                                        form={form} setForm={setForm}
                                        errors={errors} clearError={clearError}
                                    />
                                </div>
                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Education
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
                                    Next: Experiance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default EducationStep;