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
    startDate: null, endDate: null, country: "", city: "",
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
const EducationFormFields = ({ form, setForm, errors, clearError }) => {
    const fc = (field) => fieldClass(errors, field);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">School</label>
                    <input className={fc("school")} placeholder="e.g. Harvard University"
                           value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Degree <span className="text-red-500">*</span></label>
                    <select value={form.degree} className={fc("degree")}
                            onChange={e => { setForm({ ...form, degree: e.target.value }); clearError("degree"); }}>
                        <option value="">Select Degree</option>
                        {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <FieldError message={errors.degree} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Field Of Study <span className="text-red-500">*</span></label>
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
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GPA</label>
                    <input className={fc("grade")} placeholder="e.g. 3.8"
                           value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
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
                    <input className={fc("edu_country")} placeholder="e.g. United States"
                           value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                    <input className={fc("edu_city")} placeholder="e.g. Boston"
                           value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
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
            <div className="mb-4">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Education</h1>
                <p className="text-on-surface-variant font-body-md">Add your academic qualifications, starting with the most recent.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                {/* Existing items */}
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

                {/* New entry form */}
                {showForm && (
                    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                        <EducationFormFields
                            form={form} setForm={setForm}
                            errors={errors} clearError={clearError}
                        />
                    </div>
                )}

                {/* Add more */}
                {editingIndex === null && (
                    <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                        <button className="flex items-center gap-3" onClick={handleAddMore}>
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                            <span className="hover:underline underline-offset-4">Add another education</span>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                    <button onClick={onBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                    <button onClick={handleNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next: Experience</button>
                </div>
            </div>
        </div>
    );
};

export default EducationStep;