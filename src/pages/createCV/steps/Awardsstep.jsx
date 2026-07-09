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
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Award Name</label>
                    <input className={fc("awardName")} placeholder="e.g. Best Developer Award"
                           value={form.awardName} onChange={e => setForm({ ...form, awardName: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Issuing Organisation</label>
                    <input className={fc("issueingOrg")} placeholder="e.g. Google"
                           value={form.issueingOrg} onChange={e => setForm({ ...form, issueingOrg: e.target.value })} />
                </div>
            </div>

            <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Description</label>
                <textarea
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    placeholder="Describe the award..."
                    rows="3"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Date Issued</label>
                    <DatePicker selected={form.issueingDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Issued Date"
                                onChange={date => setForm({ ...form, issueingDate: formatMonthYear(date) })}
                                className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Expiration Date</label>
                    <DatePicker selected={form.expirationDate} dateFormat="MMM yyyy" showMonthYearPicker
                                placeholderText="Expiration Date"
                                onChange={date => setForm({ ...form, expirationDate: formatMonthYear(date) })}
                                className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
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
            <section className="h-full bg-surface-container-lowest px-6 md:px-10 py-12 block" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <div
                            className="flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[345.8px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 6 of 8: Awards</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">emoji_events</span>
                                Awards
                            </h3>
                            <button onClick={handleAddMore}
                                    className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                                <span className="material-symbols-outlined text-sm">add</span> Add Role
                            </button>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Add certifications, awards, or recognitions you have earned..</p>
                    </header>
                    <div className="space-y-12">
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
                            <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                <AwardFormFields form={form} setForm={setForm} errors={errors} />
                            </div>
                        )}
                        <div
                            className="pt-8 flex justify-between items-center border-t border-outline-variant/30 pb-12">
                            <button onClick={onBack}
                                    className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span> Back
                            </button>
                            <button onClick={handleNext}
                                    className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                Next: Skills
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AwardsStep;