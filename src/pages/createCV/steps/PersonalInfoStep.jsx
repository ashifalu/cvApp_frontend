import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPersonalInfo } from "../../../state/cvSlice";
import PhoneInput from "../components/PhoneInput";
import FieldError from "../components/FieldError";
import { fieldClass } from "../utils";

const EMPTY_FORM = {
    firstName: "", lastName: "", role: "", photo: "",
    linkedInUrl: "", email: "",
    phoneCountryCode: "+1", phone: "",
    country: "", city: "", nationality: "", portfolioUrl: "",
};

const PersonalInfoStep = ({ onNext }) => {
    const dispatch  = useDispatch();
    const savedData = useSelector(s => s.cv.cvData.personalInfo);

    const [form,   setForm]   = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState("");

    // Pre-fill from Redux (parsed resume data arrives here)
    useEffect(() => {
        if (savedData) setForm(prev => ({ ...prev, ...savedData }));
    }, [savedData]);

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required.";
        if (!form.role.trim())      e.role      = "Role is required.";
        if (!form.email.trim())     e.email     = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Enter a valid email address.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePhotoUpload = (e) => {
        set("photo", e.target.files[0]);
        setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleNext = () => {
        if (!validate()) return;
        dispatch(addPersonalInfo(form));
        onNext();
    };

    const fc = (field) => fieldClass(errors, field);

    return (
        <div>
            <section className="h-full bg-surface-container-lowest px-6 md:px-10 py-12 block" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-10">
                        <div
                            className="flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[57.6px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md text-[12px] text-primary font-bold uppercase tracking-wider">Step 1 of 6: Personal Information</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Personal Information
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant">Detail your career milestones.
                            Focus on measurable achievements and key responsibilities.</p>
                    </header>
                    <div className="space-y-12">
                        <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                            {/* First / Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">First
                                        Name <span className="text-red-500">*</span></label>
                                    <input className={fc("firstName")} placeholder="First Name" maxLength={30}
                                           value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                                    <FieldError message={errors.firstName} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Last Name</label>
                                    <input className={fc("lastName")} placeholder="Last Name" maxLength={30}
                                           value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                                </div>
                            </div>

                            {/* Role / LinkedIn */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Role <span className="text-red-500">*</span></label>
                                    <input className={fc("role")} placeholder="e.g. Full Stack Developer"
                                           value={form.role} onChange={e => set("role", e.target.value)} />
                                    <FieldError message={errors.role} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">LinkedIn URL</label>
                                    <input className={fc("linkedInUrl")} placeholder="LinkedIn URL"
                                           value={form.linkedInUrl} onChange={e => set("linkedInUrl", e.target.value)} />
                                </div>
                            </div>

                            {/* Email / Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Email <span className="text-red-500">*</span></label>
                                    <input type="email" className={fc("email")} placeholder="you@example.com"
                                           value={form.email} onChange={e => set("email", e.target.value)} />
                                    <FieldError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Phone</label>
                                    <PhoneInput
                                        phoneNumber={form.phone}
                                        onPhoneChange={val => set("phone", val)}
                                        countryCode={form.phoneCountryCode}
                                        onCountryCodeChange={code => set("phoneCountryCode", code)}
                                        hasError={!!errors.phone}
                                    />
                                </div>
                            </div>

                            {/* Portfolio / Country */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Portfolio URL</label>
                                    <input className={fc("portfolioUrl")} placeholder="Portfolio URL"
                                           value={form.portfolioUrl} onChange={e => set("portfolioUrl", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Country</label>
                                    <input className={fc("country")} placeholder="Country"
                                           value={form.country} onChange={e => set("country", e.target.value)} />
                                </div>
                            </div>

                            {/* City / Nationality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">City</label>
                                    <input className={fc("city")} placeholder="City"
                                           value={form.city} onChange={e => set("city", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Nationality</label>
                                    <input className={fc("nationality")} placeholder="Nationality"
                                           value={form.nationality} onChange={e => set("nationality", e.target.value)} />
                                </div>
                            </div>

                            {/* Photo upload */}
                            <div className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {photoPreview && (
                                        <img src={photoPreview} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                                    )}
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload}
                                           className="text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-container file:text-on-primary-container hover:file:opacity-90 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <div
                            className="pt-8 flex justify-end  items-center border-t border-outline-variant/30 pb-12">
                            <button onClick={handleNext}
                                    className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                Next: Professional summary
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PersonalInfoStep;