import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper from "../components/ItemWrapper";
import { fieldClass, formatMonthYear } from "../utils";

const EMPTY_FORM = {
    awardName: "", issueingOrg: "", description: "",
    issueingDate: "", expirationDate: "",
};

// ─── Shared award form fields ──────────────────────────────────────────────────
const AwardFormFields = ({ form, setForm, errors }) => {
    const fc = (field) => fieldClass(errors, field);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Award Name</label>
                    <input className={fc("awardName")} placeholder="e.g. Best Developer Award"
                           value={form.awardName} onChange={e => setForm({ ...form, awardName: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Issuing Organisation</label>
                    <input className={fc("issueingOrg")} placeholder="e.g. Google"
                           value={form.issueingOrg} onChange={e => setForm({ ...form, issueingOrg: e.target.value })} />
                </div>
            </div>

            <div>
                <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1 mb-2">Description</label>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Describe the award..."
                    rows="3"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Date Issued</label>
                    <DatePicker selected={form.issueingDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Issued Date"
                                onChange={date => setForm({ ...form, issueingDate: formatMonthYear(date) })}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Expiration Date</label>
                    <DatePicker selected={form.expirationDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Expiration Date"
                                onChange={date => setForm({ ...form, expirationDate: formatMonthYear(date) })}
                                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                </div>
            </div>
        </div>
    );
};

// ─── AwardsStep ───────────────────────────────────────────────────────────────
const AwardsStep = ({ onNext, onBack }) => {
    const dispatch = useDispatch();
    const awards   = useSelector(s => s.cv.cvData.awards);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});

    const addEntry = () => {
        if (!form.awardName) return;
        const isDuplicate = awards.some(item => JSON.stringify(item) === JSON.stringify(form));
        if (!isDuplicate) dispatch(addToList({ form, step: "awards" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.awardName) addEntry();
    };

    const handleNext = () => {
        if (showForm && form.awardName) addEntry();
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(awards[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        dispatch(updateList({ index: editingIndex, data: form, step: "awards" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <div className="mb-5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Awards</h1>
                <p className="text-on-surface-variant font-body-md">Add certifications, awards, or recognitions you've earned.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                {/* Existing items */}
                {awards.map((a, index) => (
                    <ItemWrapper key={index} index={index}
                                 isEditing={editingIndex === index}
                                 onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                 onDelete={() => dispatch(removeFromList({ index, step: "awards" }))}
                                 editForm={<AwardFormFields form={form} setForm={setForm} errors={errors} />}
                    >
                        <p className="text-sm font-medium">{a.awardName}</p>
                        <p className="text-xs text-gray-600">{a.issueingOrg}</p>
                        {a.issueingDate && <p className="text-xs text-gray-500 mt-1">{a.issueingDate} – {a.expirationDate || "No Expiry"}</p>}
                    </ItemWrapper>
                ))}

                {/* New entry form */}
                {showForm && (
                    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                        <AwardFormFields form={form} setForm={setForm} errors={errors} />
                    </div>
                )}

                {editingIndex === null && (
                    <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                        <button className="flex items-center gap-3" onClick={handleAddMore}>
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                            <span className="hover:underline underline-offset-4">Add another award</span>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                    <button onClick={onBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                    <button onClick={handleNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next: Skills</button>
                </div>
            </div>
        </div>
    );
};

export default AwardsStep;