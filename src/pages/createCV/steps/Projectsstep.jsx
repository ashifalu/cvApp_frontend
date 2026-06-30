import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import ItemWrapper, { TrashSvg } from "../components/ItemWrapper";
import { fieldClass } from "../utils";

const EMPTY_FORM = {
    projectTitle: "", keyFeatures: [], projectUrl: "", gitHubUrl: "",
};

// ─── Shared project form fields ───────────────────────────────────────────────
const ProjectFormFields = ({ form, setForm, errors, keyFeature, setKeyFeature }) => {
    const fc = (field) => fieldClass(errors, field);

    const addKeyFeature = () => {
        if (!keyFeature.trim()) return;
        const isDuplicate = form.keyFeatures.some(f => f === keyFeature.trim());
        if (!isDuplicate) {
            setForm({ ...form, keyFeatures: [...form.keyFeatures, keyFeature.trim()] });
            setKeyFeature("");
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project Title</label>
                <input className={fc("projectTitle")} placeholder="e.g. Resume Builder App"
                       value={form.projectTitle} onChange={e => setForm({ ...form, projectTitle: e.target.value })} />
            </div>

            {/* Key Features */}
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Key Features</label>
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md"
                        onClick={addKeyFeature}
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Describe a key feature and click +"
                    rows="3"
                    value={keyFeature}
                    onChange={e => setKeyFeature(e.target.value)}
                />
                {form.keyFeatures.map((kf, i) => (
                    <div key={i} className="flex gap-2 rounded-xl px-2 py-3 justify-between bg-purple-100 items-center">
                        <div className="border p-2 w-full text-sm">{kf}</div>
                        <button
                            type="button"
                            className="px-2 py-2 rounded-xl border border-red-500"
                            onClick={() => setForm({ ...form, keyFeatures: form.keyFeatures.filter((_, j) => j !== i) })}
                        >
                            <TrashSvg />
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project URL</label>
                    <input className={fc("projectUrl")} placeholder="https://myproject.com"
                           value={form.projectUrl} onChange={e => setForm({ ...form, projectUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GitHub URL</label>
                    <input className={fc("gitHubUrl")} placeholder="https://github.com/..."
                           value={form.gitHubUrl} onChange={e => setForm({ ...form, gitHubUrl: e.target.value })} />
                </div>
            </div>
        </div>
    );
};

// ─── ProjectsStep ─────────────────────────────────────────────────────────────
const ProjectsStep = ({ onNext, onBack }) => {
    const dispatch = useDispatch();
    const projects = useSelector(s => s.cv.cvData.projects);

    const [form,         setForm]         = useState(EMPTY_FORM);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showForm,     setShowForm]     = useState(false);
    const [errors,       setErrors]       = useState({});
    const [keyFeature,   setKeyFeature]   = useState("");

    const flushAndGetForm = () => {
        if (keyFeature.trim()) {
            const updated = { ...form, keyFeatures: [...form.keyFeatures, keyFeature.trim()] };
            setKeyFeature("");
            return updated;
        }
        return form;
    };

    const addEntry = () => {
        const finalForm = flushAndGetForm();
        if (!finalForm.projectTitle) return;
        const isDuplicate = projects.some(item => JSON.stringify(item) === JSON.stringify(finalForm));
        if (!isDuplicate) dispatch(addToList({ form: finalForm, step: "projects" }));
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleAddMore = () => {
        setShowForm(true);
        if (form.projectTitle) addEntry();
    };

    const handleNext = () => {
        if (showForm && form.projectTitle) addEntry();
        setEditingIndex(null);
        setShowForm(false);
        setErrors({});
        onNext();
    };

    const handleEdit = (index) => {
        setForm(projects[index]);
        setEditingIndex(index);
        setShowForm(false);
        setErrors({});
    };

    const handleUpdate = () => {
        const finalForm = flushAndGetForm();
        dispatch(updateList({ index: editingIndex, data: finalForm, step: "projects" }));
        setForm(EMPTY_FORM);
        setEditingIndex(null);
        setErrors({});
    };

    return (
        <div>
            <div className="mb-5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Projects</h1>
                <p className="text-on-surface-variant font-body-md">Showcase your best work — personal, academic, or professional projects.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                {/* Existing items */}
                {projects.map((p, index) => (
                    <ItemWrapper key={index} index={index}
                                 isEditing={editingIndex === index}
                                 onEdit={editingIndex === index ? handleUpdate : () => handleEdit(index)}
                                 onDelete={() => dispatch(removeFromList({ index, step: "projects" }))}
                                 editForm={
                                     <ProjectFormFields
                                         form={form} setForm={setForm}
                                         errors={errors}
                                         keyFeature={keyFeature} setKeyFeature={setKeyFeature}
                                     />
                                 }
                    >
                        <p className="text-sm font-medium">{p.projectTitle}</p>
                        {p.keyFeatures?.length > 0 && (
                            <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-gray-600 marker:text-[#5F53F5]">
                                {p.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        )}
                        {p.projectUrl && (
                            <a href={p.projectUrl.startsWith("http") ? p.projectUrl : `https://${p.projectUrl}`}
                               target="_blank" rel="noopener noreferrer"
                               className="text-xs text-blue-600 hover:underline block mt-1">{p.projectUrl}</a>
                        )}
                    </ItemWrapper>
                ))}

                {/* New entry form */}
                {showForm && (
                    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                        <ProjectFormFields
                            form={form} setForm={setForm}
                            errors={errors}
                            keyFeature={keyFeature} setKeyFeature={setKeyFeature}
                        />
                    </div>
                )}

                {editingIndex === null && (
                    <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                        <button className="flex items-center gap-3" onClick={handleAddMore}>
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                            <span className="hover:underline underline-offset-4">Add another project</span>
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                    <button onClick={onBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                    <button onClick={handleNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next: Awards</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectsStep;