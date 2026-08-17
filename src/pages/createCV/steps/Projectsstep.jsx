import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToList, updateList, removeFromList } from "../../../state/cvSlice"; // adjust path
import ItemWrapper, { TrashSvg } from "../components/Itemwrapper.jsx";
import { fieldClass } from "../Utils.js";

const EMPTY_FORM = {
    projectTitle: "", keyFeatures: [], projectUrl: "", gitHubUrl: "",
};

// ─── Shared project form fields ───────────────────────────────────────────────
const ProjectFormFields = ({ form, setForm, errors, keyFeature, setKeyFeature,setShowForm }) => {
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
        <div className="relative">
            {setShowForm&&<button
                className="absolute right-0 top-0 rounded-xl transition-colors"
                onClick={() => setShowForm(false)}
            >
                <span className="material-symbols-outlined text-[20px] text-primary/50 hover:text-primary">close</span>

            </button>}
           <div className="space-y-2">
               <div className="space-y-2">
                   <label className="block font-label-md text-label-md text-on-surface-variant">Project Title</label>
                   <input className={fc("projectTitle")} placeholder="e.g. Resume Builder App"
                          value={form.projectTitle} onChange={e => setForm({ ...form, projectTitle: e.target.value })} />
               </div>

               {/* Key Features */}
               <div className="space-y-2">
                   <div className="flex justify-between items-center mb-1">
                       <label className="block font-label-md text-label-md text-on-surface-variant ">Key Features</label>
                       <button
                           type="button"
                           className="px-2 py-1 flex items-center justify-center rounded-lg border border-primary text-xs  text-primary hover:scale-110 transition-transform active:scale-95 shadow-md"
                           onClick={addKeyFeature}
                       >
                           add more
                       </button>
                   </div>
                   <textarea
                       className="w-full px-4 py-3 rounded-lg text-on-surface-variant text-sm font-label-md border border-outline-variant/30 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                       placeholder="Describe a key feature and click +"
                       rows="3"
                       value={keyFeature}
                       onChange={e => setKeyFeature(e.target.value)}
                   />
                   {form.keyFeatures.map((kf, i) => (
                       <div key={i} className="flex gap-2 rounded-xl px-2 py-2 justify-between bg-primary/10 items-center">
                           <div className=" p-2 w-full text-sm">{kf}</div>
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

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">Project URL</label>
                       <input className={fc("projectUrl")} placeholder="https://myproject.com"
                              value={form.projectUrl} onChange={e => setForm({ ...form, projectUrl: e.target.value })} />
                   </div>
                   <div className="space-y-2">
                       <label className="block font-label-md text-label-md text-on-surface-variant">GitHub URL</label>
                       <input className={fc("gitHubUrl")} placeholder="https://github.com/..."
                              value={form.gitHubUrl} onChange={e => setForm({ ...form, gitHubUrl: e.target.value })} />
                   </div>
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
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px] text-primary  font-bold uppercase tracking-wider">Step 5 of 9: Projects</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[184.44px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <div
                            className="hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[239.87px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 5 of 9: Projects</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">business</span>
                                Projects
                            </h3>

                        </div>
                        {(projects.length === 0 && !showForm)&&<div
                            className="border border-outline-variant/30 bg-surface-container-low rounded-lg p-6 flex flex-col justify-center gap-4 items-center">
                            <p className="font-body-sm text-center text-body-sm text-on-surface-variant">Detail your
                                career milestones.
                                Focus on measurable achievements and key responsibilities.</p>
                            <button onClick={handleAddMore}
                                    className="text-primary border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 hover:bg-primary hover:text-white">
                                Add Project
                            </button>
                        </div>}

                    </header>
                    <div className="space-y-3">

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
                        {(!showForm&&projects.length>0)&&<div className="mt-4 mb-10">
                            <button onClick={handleAddMore}
                                    className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                Add More Project
                            </button>
                        </div>}

                        {/* New entry form */}
                        {showForm && (
                            <div>
                                <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                                    <ProjectFormFields
                                        setShowForm={setShowForm}
                                        form={form} setForm={setForm}
                                        errors={errors}
                                        keyFeature={keyFeature} setKeyFeature={setKeyFeature}
                                    />
                                </div>

                                <div className="mt-4 mb-10">
                                    <button onClick={handleAddMore}
                                            className=" border border-primary rounded-lg  px-8 py-2 font-label-md text-label-md flex items-center gap-1 bg-primary text-white">
                                        Add More Project
                                    </button>
                                </div>
                            </div>
                )}

                            {/* Existing items */}


                        <div className="fixed bottom-0 left-0 w-full xl:w-1/2 bg-white border-t border-outline-variant/30 px-4 sm:px-6 md:px-10 py-3 sm:py-4 z-40">
                            <div className="max-w-2xl mx-auto flex justify-between items-center gap-2">
                                <button onClick={onBack}
                                        className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span> Back
                                </button>
                                <button onClick={handleNext}
                                        className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    Next: Awards
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ProjectsStep;