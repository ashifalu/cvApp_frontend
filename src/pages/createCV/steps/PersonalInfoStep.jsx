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
            <div className="mb-5">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Personal Info</h1>
                <p className="text-on-surface-variant font-body-md">Tell us about yourself. This info appears at the top of your resume.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                {/* First / Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">First Name <span className="text-red-500">*</span></label>
                        <input className={fc("firstName")} placeholder="First Name" maxLength={30}
                            value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                        <FieldError message={errors.firstName} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Last Name</label>
                        <input className={fc("lastName")} placeholder="Last Name" maxLength={30}
                            value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                    </div>
                </div>

                {/* Role / LinkedIn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Role <span className="text-red-500">*</span></label>
                        <input className={fc("role")} placeholder="e.g. Full Stack Developer"
                            value={form.role} onChange={e => set("role", e.target.value)} />
                        <FieldError message={errors.role} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">LinkedIn URL</label>
                        <input className={fc("linkedInUrl")} placeholder="LinkedIn URL"
                            value={form.linkedInUrl} onChange={e => set("linkedInUrl", e.target.value)} />
                    </div>
                </div>

                {/* Email / Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" className={fc("email")} placeholder="you@example.com"
                            value={form.email} onChange={e => set("email", e.target.value)} />
                        <FieldError message={errors.email} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Phone</label>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Portfolio URL</label>
                        <input className={fc("portfolioUrl")} placeholder="Portfolio URL"
                            value={form.portfolioUrl} onChange={e => set("portfolioUrl", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                        <input className={fc("country")} placeholder="Country"
                            value={form.country} onChange={e => set("country", e.target.value)} />
                    </div>
                </div>

                {/* City / Nationality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                        <input className={fc("city")} placeholder="City"
                            value={form.city} onChange={e => set("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Nationality</label>
                        <input className={fc("nationality")} placeholder="Nationality"
                            value={form.nationality} onChange={e => set("nationality", e.target.value)} />
                    </div>
                </div>

                {/* Photo upload */}
                <div className="space-y-2">
                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        {photoPreview && (
                            <img src={photoPreview} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                        )}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload}
                            className="text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-container file:text-on-primary-container hover:file:opacity-90 cursor-pointer" />
                    </div>
                </div>

                {/* Next button */}
                <div className="flex justify-end items-center pt-8 border-t border-outline-variant/30">
                    <button
                        onClick={handleNext}
                        className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                        Next: Professional Summary
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoStep;