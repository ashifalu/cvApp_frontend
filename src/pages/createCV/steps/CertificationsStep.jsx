import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ItemWrapper from "../components/Itemwrapper.jsx";
import { fieldClass, formatMonthYear } from "../Utils.js";

const EMPTY_FORM = {
    certificationName: "", issuingOrg: "", credentialId: "",
    issueingDate: "", expirationDate: "", credentialUrl: "",
};

// ─── Shared certification form fields ──────────────────────────────────────────
const CertificationFormFields = ({ form, setForm, errors, setShowForm }) => {
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
                        <label className="block font-label-md text-label-md text-on-surface-variant">Certification Name</label>
                        <input className={fc("certificationName")} placeholder="e.g. AWS Certified Solutions Architect"
                               value={form.certificationName} onChange={e => setForm({ ...form, certificationName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Issuing Organisation</label>
                        <input className={fc("issuingOrg")} placeholder="e.g. Amazon Web Services"
                               value={form.issuingOrg} onChange={e => setForm({ ...form, issuingOrg: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Credential ID</label>
                        <input className={fc("credentialId")} placeholder="e.g. ABC123XYZ"
                               value={form.credentialId} onChange={e => setForm({ ...form, credentialId: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Credential URL</label>
                        <input className={fc("credentialUrl")} placeholder="e.g. https://credential.link/abc"
                               value={form.credentialUrl} onChange={e => setForm({ ...form, credentialUrl: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Date Issued</label>
                        <DatePicker selected={form.issueingDate} dateFormat="MMM yyyy" showMonthYearPicker
                                    placeholderText="Issued Date"
                                    onChange={date => setForm({ ...form, issueingDate: formatMonthYear(date) })}
                                    className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-label-md text-label-md text-on-surface-variant">Expiration Date</label>
                        <DatePicker selected={form.expirationDate} dateFormat="MMM yyyy" showMonthYearPicker
                                    placeholderText="Expiration Date (optional)"
                                    onChange={date => setForm({ ...form, expirationDate: formatMonthYear(date) })}
                                    className="w-full px-6 pe-24 py-3 rounded-lg border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── CertificationsStep ────────────────────────────────────────────────────────
const CertificationsStep = ({ onNext, onBack }) => {
    const dispatch       = useDispatch();
    const certifications = useSelector(s => s.cv.cvData.certifications);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});

    const addEntry = () => {
        if (!form.certificationName) return;
        const isDuplicate = certifications.some(item => JSON.stringify(item) === JSON.stringify(form));
        if (!isDuplicate) dispatch(addToList({ form, step: "certifications" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.certificationName) addEntry();
    };

    const handleNext = () => {
        if (showForm && form.certificationName) addEntry();
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(certifications[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        dispatch(updateList({ index: editingIndex, data: form, step: "certifications" }));
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
                            <span className="font-label-md text-[10px] text-primary  font-bold uppercase tracking-wider">Step 7 of 9: Certifications</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[258.22px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div
                            className="hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[335.82px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 7 of 9: Certifications</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">workspace_premium</span>
                                Certifications
                            </h3>

                        </div>
                        {(certifications.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-center text-body-sm text-on-surface-variant">Add certifications, awards, or recognitions you have earned..</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Certification
                            </button>
                        </div>}
                    </header>
                    <div className="space-y-3">

                        {certifications.map((c, index) => (
                            <ItemWrapper key={index} index={index}
                                         isEditing={editingIndex === index}
                                         onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                         onDelete={() => dispatch(removeFromList({ index, step: "certifications" }))}
                                         editForm={<CertificationFormFields form={form} setForm={setForm} errors={errors} />}
                            >
                                <p className="text-sm font-medium">{c.certificationName}</p>
                                <p className="text-xs text-gray-600">{c.issuingOrg}</p>
                                {c.issueingDate && <p className="text-xs text-gray-500 mt-1">{c.issueingDate} – {c.expirationDate || "No Expiry"}</p>}
                            </ItemWrapper>
                        ))}
                        {(!showForm&&certifications.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Certification
                            </button>
                        </div>}

                        {/* New entry form */}
                        {showForm && (
                            <div>
                                <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <CertificationFormFields form={form} setForm={setForm} errors={errors} setShowForm={setShowForm} />
                                </div>
                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Certification
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

export default CertificationsStep;