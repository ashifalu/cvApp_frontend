import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Country, City } from "country-state-city";
import { addPersonalInfo } from "../../../state/cvSlice";
import PhoneInput from "../components/PhoneInput";
import FieldError from "../components/FieldError";
import { fieldClass } from "../utils";

const EMPTY_FORM = {
    firstName: "", lastName: "", role: "", photo: "",
    linkedInUrl: "", email: "",
    phoneCountryCode: "+1", phone: "",
    country: "", countryCode: "", city: "", nationality: "", portfolioUrl: "",
};

const PersonalInfoStep = ({ onNext,  }) => {
    const dispatch  = useDispatch();
    const savedData = useSelector(s => s.cv.cvData.personalInfo);

    const [form,   setForm]   = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState("");

    // All countries, loaded once
    const countries = useMemo(() => Country.getAllCountries(), []);

    // Cities for the currently selected country
    const cities = useMemo(
        () => (form.countryCode ? City.getCitiesOfCountry(form.countryCode) : []),
        [form.countryCode]
    );

    // Pre-fill from Redux (parsed resume data arrives here)
    useEffect(() => {
        if (savedData) {
            setForm(prev => {
                const merged = { ...prev, ...savedData };
                // If we have a country name but no countryCode (e.g. from parsed resume),
                // try to resolve the iso code so the city list can populate.
                if (merged.country && !merged.countryCode) {
                    const match = countries.find(
                        c => c.name.toLowerCase() === merged.country.toLowerCase()
                    );
                    if (match) merged.countryCode = match.isoCode;
                }
                return merged;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedData]);

    const set = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const handleCountryChange = (isoCode) => {
        const country = countries.find(c => c.isoCode === isoCode);
        setForm(prev => ({
            ...prev,
            country: country ? country.name : "",
            countryCode: isoCode,
            city: "", // reset city whenever country changes
        }));
        if (errors.country) setErrors(prev => { const e = { ...prev }; delete e.country; return e; });
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
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be smaller than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            set("photo", reader.result);        // base64 data URL string, not the File
            setPhotoPreview(reader.result);      // reuse the same string for the preview — no need for createObjectURL
        };
        reader.readAsDataURL(file);
    };
    const handleNext = () => {
        if (!validate()) return;
        dispatch(addPersonalInfo(form));
        onNext();
    };

    const fc = (field) => fieldClass(errors, field);

    return (
            <section className="min-h-[calc(100vh-112px)] bg-surface-container-lowest px-4 sm:px-6 md:px-10 py-4 md:py-8 sm:py-12 pb-28 block mb-20" id="edit-panel">
                <div className="max-w-2xl mx-auto">
                    <header className="mb-4">
                        <div
                            className=" hidden md:flex items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div className="w-[47.97px] h-full bg-primary"></div>
                            </div>
                            <span className="font-label-md  md:text-[12px] text-primary font-bold uppercase tracking-wider">Step 1 of 6: Personal Information</span>
                        </div>
                        <div
                            className="opacity-100 md:hidden items-center text-center md:gap-4 mb-6 bg-surface-container-low px-3 pt-1 pb-3 rounded-xl border border-outline-variant/20">
                            <span className="font-label-md text-[10px]  text-primary font-bold uppercase tracking-wider">Step 1 of 6: Personal Information</span>
                            <div className="flex-1 h-2 bg-primary/10 rounded-full overflow-hidden mb-0.5">
                                <div className="w-[36.88px] h-full bg-primary"></div>
                            </div>
                        </div>
                        <h3 className="font-headline-md text-[20px] font-semibold md:text-headline-md mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            Personal Information
                        </h3>
                        <p className="font-body-md text-[14px]  md:text-body-md text-on-surface-variant">Detail your career milestones.
                            Focus on measurable achievements and key responsibilities.</p>
                    </header>
                    <div className="space-y-12">
                        <div className="bg-surface rounded-xl border border-outline-variant/50 p-6 relative group">
                            {/* First / Last Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">First
                                        Name <span className="text-red-500">*</span></label>
                                    <input className={fc("firstName")} placeholder="First Name" maxLength={30}
                                           value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                                    <FieldError message={errors.firstName} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">Last Name</label>
                                    <input className={fc("lastName")} placeholder="Last Name" maxLength={30}
                                           value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                                </div>
                            </div>

                            {/* Role / LinkedIn */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant ">Role <span className="text-red-500">*</span></label>
                                    <input className={fc("role")} placeholder="e.g. Full Stack Developer"
                                           value={form.role} onChange={e => set("role", e.target.value)} />
                                    <FieldError message={errors.role} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">LinkedIn URL</label>
                                    <input className={fc("linkedInUrl")} placeholder="LinkedIn URL"
                                           value={form.linkedInUrl} onChange={e => set("linkedInUrl", e.target.value)} />
                                </div>
                            </div>

                            {/* Email / Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">Email <span className="text-red-500">*</span></label>
                                    <input type="email" className={fc("email")} placeholder="you@example.com"
                                           value={form.email} onChange={e => set("email", e.target.value)} />
                                    <FieldError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">Phone</label>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">Portfolio URL</label>
                                    <input className={fc("portfolioUrl")} placeholder="Portfolio URL"
                                           value={form.portfolioUrl} onChange={e => set("portfolioUrl", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant ">Country</label>
                                    <select
                                        className={fc("country")}
                                        value={form.countryCode}
                                        onChange={e => handleCountryChange(e.target.value)}
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map(c => (
                                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* City / Nationality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">City</label>
                                    <select
                                        className={fc("city")}
                                        value={form.city}
                                        onChange={e => set("city", e.target.value)}
                                        disabled={!form.countryCode}
                                    >
                                        <option value="">
                                            {form.countryCode ? "Select a city" : "Select a country first"}
                                        </option>
                                        {cities.map(city => (
                                            <option key={`${city.name}-${city.latitude}-${city.longitude}`} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-md text-label-md text-on-surface-variant">Nationality</label>
                                    <input className={fc("nationality")} placeholder="Nationality"
                                           value={form.nationality} onChange={e => set("nationality", e.target.value)} />
                                </div>
                            </div>

                            {/* Photo upload */}
                            <div className="space-y-2">
                                <label className="block font-label-md text-label-md text-on-surface-variant">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {photoPreview && (
                                        <img src={photoPreview} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                                    )}
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload}
                                           className="text-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary-container file:text-white hover:file:opacity-90 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <div className="fixed bottom-0 left-0 w-full xl:w-1/2 bg-white border-t border-outline-variant/30 px-4 sm:px-6 md:px-10 py-3 sm:py-4 z-40">
                            <div className="max-w-2xl mx-auto flex justify-end items-center gap-2">
                                <button onClick={handleNext}
                                        className="bg-gradient-to-r from-primary to-secondary text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    Next: Summary
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );
};

export default PersonalInfoStep;