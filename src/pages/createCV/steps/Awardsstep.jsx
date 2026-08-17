import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper from "../components/Itemwrapper.jsx";
import { fieldClass, formatMonthYear } from "../Utils.js";

const EMPTY_FORM = {
    awardName: "", issueingOrg: "", description: "",
    issueingDate: "", expirationDate: "",
};

// ─── Shared award form fields ──────────────────────────────────────────────────
const AwardFormFields = ({ form, setForm, errors, setShowForm }) => {
    const fc = (field) => fieldClass(errors, field);
    return (
        <div className="relative">
            {setShowForm&&<button
                className="absolute right-0 top-0 rounded-xl transition-colors"
                onClick={() => setShowForm(false)}
            >
                <span className="material-symbols-outlined text-[20px] text-primary/50 hover:text-primary">close</span>

            </button>}

            <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant ">Award Name</label>
                        <input className={fc("awardName")} placeholder="e.g. Best Developer Award"
                               value={form.awardName} onChange={e => setForm({ ...form, awardName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant ">Issuing Organisation</label>
                        <input className={fc("issueingOrg")} placeholder="e.g. Google"
                               value={form.issueingOrg} onChange={e => setForm({ ...form, issueingOrg: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-1 space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant  ">Description</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                        placeholder="Describe the award..."
                        rows="3"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant ">Date Issued</label>
                        <DatePicker selected={form.issueingDate} dateFormat="MMM yyyy" showMonthYearPicker
                                    placeholderText="Issued Date"
                                    onChange={date => setForm({ ...form, issueingDate: formatMonthYear(date) })}
                                    className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Expiration Date</label>
                        <DatePicker selected={form.expirationDate} dateFormat="MMM yyyy" showMonthYearPicker
                                    placeholderText="Expiration Date"
                                    onChange={date => setForm({ ...form, expirationDate: formatMonthYear(date) })}
                                    className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                    </div>
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
        <div className="">
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary  font-bold uppercase tracking-wider">Step 6 of 8: Awards</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[221.33px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div
                            className="hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[287.85px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 6 of 8: Awards</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">emoji_events</span>
                                Awards
                            </h3>

                        </div>
                        {(awards.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-center text-body-sm text-on-surface-variant">Add certifications, awards, or recognitions you have earned..</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Award
                            </button>
                        </div>}
                    </header>
                    <div className="space-y-3">

                        {/* New entry form */}


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

                        {(!showForm&&awards.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Award
                            </button>
                        </div>}

                        {showForm && (
                            <div>
                                <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <AwardFormFields form={form} setForm={setForm} errors={errors} setShowForm={setShowForm} />
                                </div>
                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Award
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
                                    Next: Skills
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AwardsStep;