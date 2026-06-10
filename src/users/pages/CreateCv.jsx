import React, { useState, useMemo, useEffect, useRef } from "react"
import UserAuth from "../components/UserAuth"
import { useDispatch, useSelector } from "react-redux"
import { addToList, addPersonalInfo, addProfessionalSummary, updateList, removeFromList } from "../../state/cvSlice"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import SecondTemplate from "../../templates/SecondTemplate"
import ThirdTemplate from "../../templates/ThirdTemplate"
import Preview from "../components/Preview";
import { generatePdfApi, storeDataApi } from "../../services/allApi"
import Navbar from "../../components/Navbar";
import { templateThemes } from "../../../constants/tempThemes";


// ─── Country codes data ───────────────────────────────────────────────────────
const COUNTRY_CODES = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "+92", flag: "🇵🇰", name: "Pakistan" },
    { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+39", flag: "🇮🇹", name: "Italy" },
    { code: "+34", flag: "🇪🇸", name: "Spain" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+82", flag: "🇰🇷", name: "South Korea" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+20", flag: "🇪🇬", name: "Egypt" },
    { code: "+234", flag: "🇳🇬", name: "Nigeria" },
    { code: "+27", flag: "🇿🇦", name: "South Africa" },
    { code: "+31", flag: "🇳🇱", name: "Netherlands" },
    { code: "+46", flag: "🇸🇪", name: "Sweden" },
    { code: "+47", flag: "🇳🇴", name: "Norway" },
    { code: "+41", flag: "🇨🇭", name: "Switzerland" },
    { code: "+64", flag: "🇳🇿", name: "New Zealand" },
    { code: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "+63", flag: "🇵🇭", name: "Philippines" },
    { code: "+62", flag: "🇮🇩", name: "Indonesia" },
    { code: "+66", flag: "🇹🇭", name: "Thailand" },
    { code: "+90", flag: "🇹🇷", name: "Turkey" },
    { code: "+98", flag: "🇮🇷", name: "Iran" },
    { code: "+48", flag: "🇵🇱", name: "Poland" },
    { code: "+32", flag: "🇧🇪", name: "Belgium" },
    { code: "+351", flag: "🇵🇹", name: "Portugal" },
    { code: "+30", flag: "🇬🇷", name: "Greece" },
    { code: "+52", flag: "🇲🇽", name: "Mexico" },
    { code: "+54", flag: "🇦🇷", name: "Argentina" },
    { code: "+56", flag: "🇨🇱", name: "Chile" },
    { code: "+57", flag: "🇨🇴", name: "Colombia" },
    { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
    { code: "+977", flag: "🇳🇵", name: "Nepal" },
    { code: "+964", flag: "🇮🇶", name: "Iraq" },
    { code: "+962", flag: "🇯🇴", name: "Jordan" },
    { code: "+961", flag: "🇱🇧", name: "Lebanon" },
    { code: "+974", flag: "🇶🇦", name: "Qatar" },
    { code: "+965", flag: "🇰🇼", name: "Kuwait" },
    { code: "+968", flag: "🇴🇲", name: "Oman" },
    { code: "+973", flag: "🇧🇭", name: "Bahrain" },
];

// ─── Phone Input with country code selector ───────────────────────────────────
const PhoneInput = ({ phoneNumber, onPhoneChange, countryCode, onCountryCodeChange, hasError }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef(null);
    const selected = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0];
    const filtered = COUNTRY_CODES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
    );
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) { setIsOpen(false); setSearch(""); }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    const baseInputClass = hasError
        ? "border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-400"
        : "border-outline-variant bg-surface-container-low focus-within:ring-2 focus-within:ring-primary focus-within:border-primary";
    return (
        <div className="relative" ref={dropdownRef}>
            <div className={`flex items-center w-full rounded-xl border transition-all outline-none overflow-visible ${baseInputClass}`}>
                <button type="button" onClick={() => setIsOpen(prev => !prev)}
                    className="flex items-center gap-1.5 pl-3 pr-2.5 py-3 border-r border-outline-variant/40 hover:bg-black/5 transition-colors rounded-l-xl shrink-0">
                    <span className="text-lg leading-none">{selected.flag}</span>
                    <span className="text-sm font-medium text-on-surface-variant tabular-nums">{selected.code}</span>
                    <svg className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <input type="tel" placeholder="e.g. 555 012 3456" value={phoneNumber} onChange={e => onPhoneChange(e.target.value)}
                    className="flex-1 px-3 py-3 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/40 min-w-0" />
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-outline-variant/50 rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden">
                    <div className="p-2.5 border-b border-outline-variant/20">
                        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/30">
                            <svg className="w-3.5 h-3.5 text-on-surface-variant shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
                            <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country or code..."
                                className="flex-1 bg-transparent outline-none text-xs text-on-surface placeholder:text-on-surface-variant/50" />
                            {search && (
                                <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1">
                        {filtered.length > 0 ? filtered.map((c, i) => (
                            <button key={i} type="button" onClick={() => { onCountryCodeChange(c.code); setIsOpen(false); setSearch(""); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-primary/5 ${c.code === countryCode ? "bg-primary/8" : ""}`}>
                                <span className="text-base shrink-0">{c.flag}</span>
                                <span className="text-sm text-on-surface flex-1 truncate">{c.name}</span>
                                <span className="text-xs text-on-surface-variant font-mono tabular-nums shrink-0">{c.code}</span>
                                {c.code === countryCode && (
                                    <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}
                            </button>
                        )) : <div className="py-6 text-center"><p className="text-xs text-on-surface-variant">No countries found</p></div>}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Reusable inline error message ───────────────────────────────────────────
const FieldError = ({ message }) =>
    message ? (
        <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {message}
        </p>
    ) : null;



const CreateCv = () => {
    const temp_id = useParams().temp;
    const experience = useSelector((state) => state.cv.cvData.experience);
    const education  = useSelector((state) => state.cv.cvData.education);
    const skills     = useSelector((state) => state.cv.cvData.skills);
    const languages  = useSelector((state) => state.cv.cvData.languages);
    const projects   = useSelector((state) => state.cv.cvData.projects);
    const awards     = useSelector((state) => state.cv.cvData.awards);

    const steps  = ["personalInfo", "professionalSummary", "education", "experience", "projects", "awards", "skills", "languages"];
    const levels = ["Beginner", "Basic", "Skillful", "Advanced", "Expert"];

    const templateRef = useRef();
    const navigate    = useNavigate();
    const dispatch    = useDispatch();

    const [token, setToken]               = useState("")
    const [existingUser, setExistingUser] = useState({})
    const [currentStep, setCurrentStep]   = useState("personalInfo")
    const [editingIndex, setEditingIndex] = useState(null)
    const [responsibility, setResponsibility] = useState('')
    const [keyFeature, setKeyFeature]         = useState('')
    const [open, setOpen]                     = useState(false)
    const [selectedTheme, setSelectedTheme] = useState({})  
    const [showForm, setShowForm]             = useState(false)

    const [errors, setErrors] = useState({})

    const [personalInfo, setPersonalInfo] = useState({
        firstName: "", lastName: "", role: "", photo: "",
        linkedInUrl: "", email: "",
        phoneCountryCode: "+1",
        phone: "",
        country: "", city: "", nationality: "", portfolioUrl: ""
    })
    const [professionalSummary, setProfessionalSummary] = useState("")
    const [educationForm, setEducationForm] = useState({
        school: "", degree: "", fieldOfStudy: "", grade: "",
        startDate: null, endDate: null, country: "", city: ""
    })
    const [experienceForm, setExperienceForm] = useState({
        jobTitle: "", employer: "", startDate: null, endDate: null,
        country: "", city: "", responsibilities: []
    })
    const [skillForm,    setSkillForm]    = useState({ skill: "", level: 2 })
    const [languageForm, setLanguageForm] = useState({ language: "", level: 2 })
    const [projectForm,  setProjectForm]  = useState({ projectTitle: "", keyFeatures: [], projectUrl: "", gitHubUrl: "" })
    const [awardForm,    setAwardForm]    = useState({ awardName: "", issueingOrg: "", description: "", issueingDate: "", expirationDate: "" })
    const [photoPreview, setPhotoPreview] = useState("")

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setToken(sessionStorage.getItem('token'))
            setExistingUser(JSON.parse(sessionStorage.getItem("existingUser")))
        }
    }, [])

    const validateStep = (step) => {
        const newErrors = {};
        if (step === "personalInfo") {
            if (!personalInfo.firstName.trim()) newErrors.firstName = "First name is required.";
            if (!personalInfo.role.trim())      newErrors.role      = "Role is required.";
            if (!personalInfo.email.trim())     newErrors.email     = "Email is required.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email))
                newErrors.email = "Enter a valid email address.";
        }
        if (step === "professionalSummary") {
            if (!professionalSummary.trim()) newErrors.professionalSummary = "Professional summary is required.";
        }
        if (step === "education") {
            if (!educationForm.degree)       newErrors.degree       = "Please select a degree.";
            if (!educationForm.fieldOfStudy) newErrors.fieldOfStudy = "Please select a field of study.";
        }
        if (step === "experience") {
            if (!experienceForm.jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
            if (!experienceForm.employer.trim()) newErrors.employer = "Employer is required.";
        }
        if (step === "skills")    { if (!skillForm.skill.trim())       newErrors.skill    = "Skill name is required."; }
        if (step === "languages") { if (!languageForm.language.trim()) newErrors.language = "Language is required."; }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
    };

    const fieldClass = (field) =>
        `w-full px-4 py-3 rounded-xl border transition-all outline-none ${errors[field]
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
            : "border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary"
        }`;

    const handleSaveAndNavigate = async () => {
        const printArea = document.getElementById('pdf-print-area');
        if (!printArea) return;
        const html = printArea.innerHTML;
        try {
            const pdfResponse = await generatePdfApi({ html });
            const pdfUrl = pdfResponse.data.pdfUrl;
            const reqHeader = { "authorization": `Bearer ${token}` };
            const reqBody = {
                personalInfo: {
                    ...personalInfo,
                    phone: personalInfo.phone ? `${personalInfo.phoneCountryCode} ${personalInfo.phone}` : ""
                },
                professionalSummary, experience, education,
                projects, awards, skills, languages, resumeUrl: pdfUrl
            };
            await storeDataApi(reqBody, reqHeader);
            if (token) { navigate(`/user-profile/${existingUser._id}`); } else { setOpen(true); }
        } catch (error) {
            console.error('Error:', error.message);
            alert('Something went wrong. Please try again.');
        }
    };

    const handlePhotoUpload = (e) => {
        setPersonalInfo({ ...personalInfo, photo: e.target.files[0] })
        setPhotoPreview(URL.createObjectURL(e.target.files[0]))
    }

    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience, education,
        skills, languages, projects, awards
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards]);

    const stepConfig = {
        experience: {
            form: experienceForm, setForm: setExperienceForm, list: experience, setList: addToList,
            emptyForm: { jobTitle: "", employer: "", startDate: "", endDate: "", city: "", country: "", responsibilities: [] },
            requiredKey: "jobTitle"
        },
        education: {
            form: educationForm, setForm: setEducationForm, list: education, setList: addToList,
            emptyForm: { school: "", degree: "", fieldOfStudy: "", grade: "", startDate: null, endDate: null, country: "", city: "" },
            requiredKey: "degree"
        },
        projects: {
            form: projectForm, setForm: setProjectForm, list: projects, setList: addToList,
            emptyForm: { projectTitle: "", keyFeatures: [], projectUrl: "", gitHubUrl: "" },
            requiredKey: "projectTitle"
        },
        skills: {
            form: skillForm, setForm: setSkillForm, list: skills, setList: addToList,
            emptyForm: { skill: "", level: 2 }, requiredKey: "skill"
        },
        languages: {
            form: languageForm, setForm: setLanguageForm, list: languages, setList: addToList,
            emptyForm: { language: "", level: 2 }, requiredKey: "language"
        },
        awards: {
            form: awardForm, setForm: setAwardForm, list: awards,
            emptyForm: { awardName: "", issueingOrg: "", description: "", issueingDate: "", expirationDate: "" },
            requiredKey: "awardName"
        }
    };

    const step = stepConfig[currentStep] || {};
    const { form, setForm, emptyForm, list, requiredKey } = step;

    const addresponsibilities = () => {
        if (!responsibility.trim()) return;
        const isDuplicate = experienceForm.responsibilities.some((item) => item === responsibility.trim());
        if (!isDuplicate) {
            setExperienceForm({ ...experienceForm, responsibilities: [...experienceForm.responsibilities, responsibility.trim()] });
            setResponsibility("");
        }
    };

    const addKeyFeatures = () => {
        if (!keyFeature.trim()) return;
        const isDuplicate = projectForm.keyFeatures.some((item) => item === keyFeature.trim());
        if (!isDuplicate) {
            setProjectForm({ ...projectForm, keyFeatures: [...projectForm.keyFeatures, keyFeature.trim()] });
            setKeyFeature("");
        }
    };

    const formatMonthYear = (date) => {
        const month = date.toLocaleString("en-US", { month: "short" });
        return `${month} ${date.getFullYear()}`;
    };

    const goToNextStep = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1]);
        setErrors({});
    };

    const handleNext = () => {
        if (showForm) {
            if (!validateStep(currentStep)) return;
            if (!step) return;
            if (form && form[requiredKey]) {
                let updatedForm = { ...form };
                if (currentStep === "experience" && responsibility.trim()) {
                    updatedForm = { ...form, responsibilities: [...form.responsibilities, responsibility.trim()] };
                    setResponsibility("");
                }
                if (currentStep === "projects" && keyFeature.trim()) {
                    updatedForm = { ...form, keyFeatures: [...form.keyFeatures, keyFeature.trim()] };
                    setKeyFeature("");
                }
                const isDuplicate = list.some((item) => JSON.stringify(item) === JSON.stringify(updatedForm));
                if (!isDuplicate) dispatch(addToList({ form: updatedForm, step: currentStep }));
                setForm(emptyForm);
            }
        }
        goToNextStep();
        setEditingIndex(null);
        setShowForm(false);
    };

    const addMoreHandler = () => {
        setShowForm(true);
        if (!form[requiredKey]) return;
        let updatedForm = { ...form };
        if (currentStep === "experience" && responsibility.trim()) {
            updatedForm = { ...form, responsibilities: [...form.responsibilities, responsibility.trim()] };
            setResponsibility("");
        }
        if (currentStep === "projects" && keyFeature.trim()) {
            updatedForm = { ...form, keyFeatures: [...form.keyFeatures, keyFeature.trim()] };
            setKeyFeature("");
        }
        dispatch(addToList({ form: updatedForm, step: currentStep }));
        setForm(emptyForm);
        setErrors({});
    };

    const handleEdit = (index) => {
        setShowForm(false);
        const step = stepConfig[currentStep];
        if (!step) return;
        setForm(list[index]);
        setEditingIndex(index);
        setErrors({});
    };

    const updateData = () => {
        if (!validateStep(currentStep)) return;
        let updatedForm = { ...form };
        if (currentStep === "experience" && responsibility.trim()) {
            updatedForm = { ...form, responsibilities: [...form.responsibilities, responsibility.trim()] };
            setResponsibility("");
        }
        if (currentStep === "projects" && keyFeature.trim()) {
            updatedForm = { ...form, keyFeatures: [...form.keyFeatures, keyFeature.trim()] };
            setKeyFeature("");
        }
        dispatch(updateList({ index: editingIndex, data: updatedForm, step: currentStep }));
        setForm(emptyForm);
        setEditingIndex(null);
        setErrors({});
    };

    const handleBack = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1]);
        setErrors({});
    };

    const A4_W = 794;
    const A4_H = 1123;

    // ─── Shared edit/delete icon SVGs ─────────────────────────────────────────
    const EditSvg = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#420093" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" />
        </svg>
    );
    const TrashSvg = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
    );

    // ─── Shared inline item wrapper ───────────────────────────────────────────
    const ItemWrapper = ({ index, onEdit, onDelete, children, isEditing, editForm }) => (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md shadow-primary/5 border border-outline-variant/30 my-4">
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">{children}</div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                    {isEditing ? (
                        <button className="px-3 py-[7px] text-xs rounded-xl text-primary border border-primary hover:bg-primary/5 transition-colors" onClick={onEdit}>
                            Update
                        </button>
                    ) : (
                        <button className="px-2 py-[7px] rounded-xl border border-primary hover:bg-primary/5 transition-colors" onClick={onEdit}>
                            <EditSvg />
                        </button>
                    )}
                    <button className="px-[8px] py-[7px] rounded-xl border border-red-500 hover:bg-red-50 transition-colors" onClick={onDelete}>
                        <TrashSvg />
                    </button>
                </div>
            </div>
            {isEditing && (
                <div className="space-y-6 pt-6 mt-4 border-t border-outline-variant/30">
                    {editForm}
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-background font-body-md min-h-screen text-on-surface">
            <div className=" md:mx-20 py-10 px-margin-desktop py-8">
                <div className="md:grid grid-cols-2 gap-20 items-center">
                    <div className="">

                        {/* ── Personal Info ─────────────────────────────── */}
                        {currentStep === "personalInfo" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Personal Info</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">First Name <span className="text-red-500">*</span></label>
                                            <input className={fieldClass("firstName")} placeholder="First Name" maxLength={30} value={personalInfo.firstName}
                                                onChange={(e) => { setPersonalInfo({ ...personalInfo, firstName: e.target.value }); clearError("firstName"); }} />
                                            <FieldError message={errors.firstName} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Last Name</label>
                                            <input className={fieldClass("lastName")} placeholder="Last Name" maxLength={30} value={personalInfo.lastName} onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Role <span className="text-red-500">*</span></label>
                                            <input className={fieldClass("role")} placeholder="Role" value={personalInfo.role}
                                                onChange={(e) => { setPersonalInfo({ ...personalInfo, role: e.target.value }); clearError("role"); }} />
                                            <FieldError message={errors.role} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">LinkedIn URL</label>
                                            <input className={fieldClass("linkedInUrl")} placeholder="LinkedIn URL" value={personalInfo.linkedInUrl} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedInUrl: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Email <span className="text-red-500">*</span></label>
                                            <input type="email" className={fieldClass("email")} placeholder="you@example.com" value={personalInfo.email}
                                                onChange={(e) => { setPersonalInfo({ ...personalInfo, email: e.target.value }); clearError("email"); }} />
                                            <FieldError message={errors.email} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Phone</label>
                                            <PhoneInput phoneNumber={personalInfo.phone} onPhoneChange={(val) => setPersonalInfo({ ...personalInfo, phone: val })}
                                                countryCode={personalInfo.phoneCountryCode} onCountryCodeChange={(code) => setPersonalInfo({ ...personalInfo, phoneCountryCode: code })} hasError={!!errors.phone} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Portfolio URL</label>
                                            <input className={fieldClass("portfolioUrl")} placeholder="Portfolio URL" value={personalInfo.portfolioUrl} onChange={(e) => setPersonalInfo({ ...personalInfo, portfolioUrl: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                                            <input className={fieldClass("country")} placeholder="Country" value={personalInfo.country} onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                                            <input className={fieldClass("city")} placeholder="City" value={personalInfo.city} onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Nationality</label>
                                            <input className={fieldClass("nationality")} placeholder="Nationality" value={personalInfo.nationality} onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center pt-8 border-t border-outline-variant/30">
                                        <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                            onClick={() => { if (!validateStep("personalInfo")) return; dispatch(addPersonalInfo(personalInfo)); setCurrentStep("professionalSummary"); setErrors({}); }}>
                                            Next: Professional Summary
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Professional Summary ──────────────────────── */}
                        {currentStep === "professionalSummary" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Professional Summary</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                    <div className="space-y-1">
                                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Summary <span className="text-red-500">*</span></label>
                                        <textarea className={`w-full px-4 py-3 rounded-xl border transition-all outline-none resize-none ${errors.professionalSummary ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary"}`}
                                            placeholder="Describe your key achievements and duties..." rows="8" maxLength={1000} value={professionalSummary}
                                            onChange={(e) => { setProfessionalSummary(e.target.value); clearError("professionalSummary"); }} />
                                        <FieldError message={errors.professionalSummary} />
                                    </div>
                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95" onClick={handleBack}>Back</button>
                                        <button className="px-4 md:px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                            onClick={() => { if (!validateStep("professionalSummary")) return; dispatch(addProfessionalSummary(professionalSummary)); setCurrentStep("education"); setErrors({}); }}>
                                            Next: Education
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Education ─────────────────────────────────── */}
                        {currentStep === "education" && (
                            <div>
                                <div className="mb-4">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Education</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                    {/* Existing education items */}
                                    {education[0] && education.map((e, index) => (
                                        <ItemWrapper key={index} index={index}
                                            isEditing={editingIndex === index}
                                            onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                            onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                            editForm={
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">School</label>
                                                            <input className={fieldClass("school")} placeholder="e.g. Harvard University" value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Degree <span className="text-red-500">*</span></label>
                                                            <select value={educationForm.degree} onChange={(e) => { setEducationForm({ ...educationForm, degree: e.target.value }); clearError("degree"); }} className={fieldClass("degree")}>
                                                                <option value="">Select Degree</option>
                                                                {["High School Diploma","Internship Course","Associate's","Bachelor's","Master's","MBA","PhD / Doctorate","MD (Medicine)","JD (Law)","Certificate","Diploma","Other"].map(d => <option key={d} value={d}>{d}</option>)}
                                                            </select>
                                                            <FieldError message={errors.degree} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Field Of Study <span className="text-red-500">*</span></label>
                                                            <select value={educationForm.fieldOfStudy} onChange={(e) => { setEducationForm({ ...educationForm, fieldOfStudy: e.target.value }); clearError("fieldOfStudy"); }} className={fieldClass("fieldOfStudy")}>
                                                                <option value="">Select Field of Study</option>
                                                                <optgroup label="Science & Technology">
                                                                    {["Computer Science","MERN Stack Development","Software Engineering","Information Technology","Data Science","Artificial Intelligence","Cybersecurity","Biology","Chemistry","Physics","Mathematics","Statistics","Environmental Science"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Engineering">
                                                                    {["Electrical Engineering","Mechanical Engineering","Civil Engineering","Chemical Engineering","Biomedical Engineering"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Business & Finance">
                                                                    {["Business Administration","Finance","Accounting","Marketing","Economics","Management","Human Resources"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Arts & Humanities">
                                                                    {["English Literature","History","Philosophy","Fine Arts","Graphic Design","Architecture","Film & Media Studies"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Social Sciences">
                                                                    {["Psychology","Sociology","Political Science","International Relations","Communications"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Health & Medicine">
                                                                    {["Medicine","Nursing","Pharmacy","Public Health","Dentistry"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <optgroup label="Law & Education">
                                                                    {["Law","Education","Early Childhood Education"].map(f=><option key={f} value={f}>{f}</option>)}
                                                                </optgroup>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                            <FieldError message={errors.fieldOfStudy} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GPA</label>
                                                            <input className={fieldClass("grade")} placeholder="Grade" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Start Date</label>
                                                            <DatePicker selected={educationForm.startDate} onChange={(date) => setEducationForm({ ...educationForm, startDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Select month & year" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">End Date</label>
                                                            <DatePicker selected={educationForm.endDate} onChange={(date) => setEducationForm({ ...educationForm, endDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Select month & year" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                                                            <input className={fieldClass("edu_country")} placeholder="e.g. United States" value={educationForm.country} onChange={(e) => setEducationForm({ ...educationForm, country: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                                                            <input className={fieldClass("edu_city")} placeholder="e.g. San Francisco" value={educationForm.city} onChange={(e) => setEducationForm({ ...educationForm, city: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">School</label>
                                                    <input className={fieldClass("school")} placeholder="e.g. Harvard University" value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Degree <span className="text-red-500">*</span></label>
                                                    <select value={educationForm.degree} onChange={(e) => { setEducationForm({ ...educationForm, degree: e.target.value }); clearError("degree"); }} className={fieldClass("degree")}>
                                                        <option value="">Select Degree</option>
                                                        {["High School Diploma","Internship Course","Associate's","Bachelor's","Master's","MBA","PhD / Doctorate","MD (Medicine)","JD (Law)","Certificate","Diploma","Other"].map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                    <FieldError message={errors.degree} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Field Of Study <span className="text-red-500">*</span></label>
                                                    <select value={educationForm.fieldOfStudy} onChange={(e) => { setEducationForm({ ...educationForm, fieldOfStudy: e.target.value }); clearError("fieldOfStudy"); }} className={fieldClass("fieldOfStudy")}>
                                                        <option value="">Select Field of Study</option>
                                                        <optgroup label="Science & Technology">
                                                            {["Computer Science","MERN Stack Development","Software Engineering","Information Technology","Data Science","Artificial Intelligence","Cybersecurity","Biology","Chemistry","Physics","Mathematics","Statistics","Environmental Science"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Engineering">
                                                            {["Electrical Engineering","Mechanical Engineering","Civil Engineering","Chemical Engineering","Biomedical Engineering"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Business & Finance">
                                                            {["Business Administration","Finance","Accounting","Marketing","Economics","Management","Human Resources"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Arts & Humanities">
                                                            {["English Literature","History","Philosophy","Fine Arts","Graphic Design","Architecture","Film & Media Studies"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Social Sciences">
                                                            {["Psychology","Sociology","Political Science","International Relations","Communications"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Health & Medicine">
                                                            {["Medicine","Nursing","Pharmacy","Public Health","Dentistry"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Law & Education">
                                                            {["Law","Education","Early Childhood Education"].map(f=><option key={f} value={f}>{f}</option>)}
                                                        </optgroup>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <FieldError message={errors.fieldOfStudy} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GPA</label>
                                                    <input className={fieldClass("grade")} placeholder="Grade" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Start Date</label>
                                                    <DatePicker selected={educationForm.startDate} onChange={(date) => setEducationForm({ ...educationForm, startDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Select month & year" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">End Date</label>
                                                    <DatePicker selected={educationForm.endDate} onChange={(date) => setEducationForm({ ...educationForm, endDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Select month & year" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                                                    <input className={fieldClass("edu_country")} placeholder="e.g. United States" value={educationForm.country} onChange={(e) => setEducationForm({ ...educationForm, country: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                                                    <input className={fieldClass("edu_city")} placeholder="e.g. San Francisco" value={educationForm.city} onChange={(e) => setEducationForm({ ...educationForm, city: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editingIndex === null && (
                                        <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                            <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                <span className="hover:underline underline-offset-4">Add another education</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95" onClick={handleBack}>Back</button>
                                        <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95" onClick={handleNext}>Next: Experience</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Experience ────────────────────────────────── */}
                        {currentStep === "experience" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Work Experience</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                    {/* Existing experience items */}
                                    {experience[0] && experience.map((exp, index) => (
                                        <ItemWrapper key={index} index={index}
                                            isEditing={editingIndex === index}
                                            onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                            onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                            editForm={
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Job Title <span className="text-red-500">*</span></label>
                                                            <input className={fieldClass("jobTitle")} placeholder="e.g. Senior Product Designer" value={experienceForm.jobTitle}
                                                                onChange={(e) => { setExperienceForm({ ...experienceForm, jobTitle: e.target.value }); clearError("jobTitle"); }} />
                                                            <FieldError message={errors.jobTitle} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Employer <span className="text-red-500">*</span></label>
                                                            <input className={fieldClass("employer")} placeholder="e.g. Google" value={experienceForm.employer}
                                                                onChange={(e) => { setExperienceForm({ ...experienceForm, employer: e.target.value }); clearError("employer"); }} />
                                                            <FieldError message={errors.employer} />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Start Date</label>
                                                            <DatePicker selected={experienceForm.startDate} onChange={(date) => setExperienceForm({ ...experienceForm, startDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Select month & year" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">End Date</label>
                                                            <DatePicker selected={experienceForm.endDate} onChange={(date) => setExperienceForm({ ...experienceForm, endDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Select month & year" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                                                            <input className={fieldClass("exp_country")} placeholder="e.g. United States" value={experienceForm.country} onChange={(e) => setExperienceForm({ ...experienceForm, country: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                                                            <input className={fieldClass("exp_city")} placeholder="e.g. San Francisco" value={experienceForm.city} onChange={(e) => setExperienceForm({ ...experienceForm, city: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Responsibilities</label>
                                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md" onClick={addresponsibilities}>
                                                                <span className="material-symbols-outlined text-[20px]">add</span>
                                                            </button>
                                                        </div>
                                                        <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Describe a responsibility..." rows="3" value={responsibility} onChange={(e) => setResponsibility(e.target.value)} />
                                                        {experienceForm.responsibilities[0] && experienceForm.responsibilities.map((r, i) => (
                                                            <div key={i} className="flex justify-between py-3 gap-4 px-4 items-center mb-1 rounded-xl bg-purple-100">
                                                                <div>{r}</div>
                                                                <button type="button" className="px-2 py-2 border border-red-500 bg-purple-100 rounded-xl" onClick={() => setExperienceForm({ ...experienceForm, responsibilities: experienceForm.responsibilities.filter((_, j) => j !== i) })}>
                                                                    <TrashSvg />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="text-sm font-medium">{exp.jobTitle} at {exp.employer}</p>
                                            <p className="text-xs text-gray-600">{[exp.city, exp.country].filter(Boolean).join(", ")}</p>
                                            {exp.startDate && <p className="text-xs text-gray-500 mt-1">{exp.startDate} – {exp.endDate || "Present"}</p>}
                                            {exp.responsibilities?.length > 0 && (
                                                <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside marker:text-[#5F53F5]">
                                                    {exp.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            )}
                                        </ItemWrapper>
                                    ))}

                                    {/* New entry form */}
                                    {showForm && (
                                        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Job Title <span className="text-red-500">*</span></label>
                                                    <input className={fieldClass("jobTitle")} placeholder="e.g. Senior Product Designer" value={experienceForm.jobTitle}
                                                        onChange={(e) => { setExperienceForm({ ...experienceForm, jobTitle: e.target.value }); clearError("jobTitle"); }} />
                                                    <FieldError message={errors.jobTitle} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Employer <span className="text-red-500">*</span></label>
                                                    <input className={fieldClass("employer")} placeholder="e.g. Google" value={experienceForm.employer}
                                                        onChange={(e) => { setExperienceForm({ ...experienceForm, employer: e.target.value }); clearError("employer"); }} />
                                                    <FieldError message={errors.employer} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Start Date</label>
                                                    <DatePicker selected={experienceForm.startDate} onChange={(date) => setExperienceForm({ ...experienceForm, startDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Select month & year" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">End Date</label>
                                                    <DatePicker selected={experienceForm.endDate} onChange={(date) => setExperienceForm({ ...experienceForm, endDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker placeholderText="Select month & year" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Country</label>
                                                    <input className={fieldClass("exp_country")} placeholder="e.g. United States" value={experienceForm.country} onChange={(e) => setExperienceForm({ ...experienceForm, country: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">City</label>
                                                    <input className={fieldClass("exp_city")} placeholder="e.g. San Francisco" value={experienceForm.city} onChange={(e) => setExperienceForm({ ...experienceForm, city: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Responsibilities</label>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md" onClick={addresponsibilities}>
                                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                                    </button>
                                                </div>
                                                <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Describe your key achievements and duties..." rows="3" value={responsibility} onChange={(e) => setResponsibility(e.target.value)} />
                                                {experienceForm.responsibilities[0] && experienceForm.responsibilities.map((r, i) => (
                                                    <div key={i} className="flex justify-between py-3 gap-4 px-4 items-center mb-1 rounded-xl bg-purple-100">
                                                        <div>{r}</div>
                                                        <button type="button" className="px-2 py-2 border border-red-500 bg-purple-100 rounded-xl" onClick={() => setExperienceForm({ ...experienceForm, responsibilities: experienceForm.responsibilities.filter((_, j) => j !== i) })}>
                                                            <TrashSvg />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {editingIndex === null && (
                                        <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                            <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                <span className="hover:underline underline-offset-4">Add another experience</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95" onClick={handleBack}>Back</button>
                                        <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95" onClick={handleNext}>Next: Projects</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Projects ── */}
                        {currentStep === "projects" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Projects</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                    {/* Existing project items */}
                                    {projects[0] && projects.map((p, index) => (
                                        <ItemWrapper key={index} index={index}
                                            isEditing={editingIndex === index}
                                            onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                            onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                            editForm={
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project Title</label>
                                                        <input className={fieldClass("projectTitle")} placeholder="Project Title" value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Key Features</label>
                                                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md" onClick={addKeyFeatures}>
                                                                <span className="material-symbols-outlined text-[20px]">add</span>
                                                            </button>
                                                        </div>
                                                        <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Describe a key feature..." rows="3" value={keyFeature} onChange={(e) => setKeyFeature(e.target.value)} />
                                                        {projectForm.keyFeatures[0] && projectForm.keyFeatures.map((kf, i) => (
                                                            <div key={i} className="flex gap-2 rounded-xl px-2 py-3 justify-between bg-purple-100 items-center">
                                                                <div className="border p-2 w-full">{kf}</div>
                                                                <button type="button" className="px-2 py-2 rounded-xl border border-red-500" onClick={() => setProjectForm({ ...projectForm, keyFeatures: projectForm.keyFeatures.filter((_, j) => j !== i) })}>
                                                                    <TrashSvg />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project URL</label>
                                                            <input className={fieldClass("projectUrl")} placeholder="Project URL" value={projectForm.projectUrl} onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GitHub URL</label>
                                                            <input className={fieldClass("gitHubUrl")} placeholder="GitHub URL" value={projectForm.gitHubUrl} onChange={(e) => setProjectForm({ ...projectForm, gitHubUrl: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="text-sm font-medium">{p.projectTitle}</p>
                                            {p.keyFeatures?.length > 0 && <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-gray-600 marker:text-[#5F53F5]">{p.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}</ul>}
                                            {p.projectUrl && <a href={p.projectUrl.startsWith("http") ? p.projectUrl : `https://${p.projectUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">{p.projectUrl}</a>}
                                        </ItemWrapper>
                                    ))}

                                    {/* New entry form */}
                                    {showForm && (
                                        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                            <div className="space-y-2">
                                                <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project Title</label>
                                                <input className={fieldClass("projectTitle")} placeholder="Project Title" value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Key Features</label>
                                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:scale-110 transition-transform active:scale-95 shadow-md" onClick={addKeyFeatures}>
                                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                                    </button>
                                                </div>
                                                <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Describe your key achievements and duties..." rows="3" value={keyFeature} onChange={(e) => setKeyFeature(e.target.value)} />
                                                {projectForm.keyFeatures[0] && projectForm.keyFeatures.map((kf, i) => (
                                                    <div key={i} className="flex gap-2 rounded-xl px-2 py-3 justify-between bg-purple-100 items-center">
                                                        <div className="border p-2 w-full">{kf}</div>
                                                        <button type="button" className="px-2 py-2 rounded-xl border border-red-500" onClick={() => setProjectForm({ ...projectForm, keyFeatures: projectForm.keyFeatures.filter((_, j) => j !== i) })}>
                                                            <TrashSvg />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Project URL</label>
                                                    <input className={fieldClass("projectUrl")} placeholder="Project URL" value={projectForm.projectUrl} onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">GitHub URL</label>
                                                    <input className={fieldClass("gitHubUrl")} placeholder="GitHub URL" value={projectForm.gitHubUrl} onChange={(e) => setProjectForm({ ...projectForm, gitHubUrl: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editingIndex === null && (
                                        <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                            <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                <span className="hover:underline underline-offset-4">Add another project</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button onClick={handleBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                                        <button onClick={handleNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next: Awards</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Awards ── */}
                        {currentStep === "awards" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Awards</h1>
                                    <p className="text-on-surface-variant font-body-md">Tell us about your professional journey. Start with your most recent role.</p>
                                </div>
                                <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                    {/* Existing award items */}
                                    {awards[0] && awards.map((a, index) => (
                                        <ItemWrapper key={index} index={index}
                                            isEditing={editingIndex === index}
                                            onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                            onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                            editForm={
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Award Name</label>
                                                            <input className={fieldClass("awardName")} placeholder="Award Name" value={awardForm.awardName} onChange={(e) => setAwardForm({ ...awardForm, awardName: e.target.value })} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Issuing Organisation</label>
                                                            <input className={fieldClass("issueingOrg")} placeholder="Issuing Organisation" value={awardForm.issueingOrg} onChange={(e) => setAwardForm({ ...awardForm, issueingOrg: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Description..." rows="3" value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Date of Issued</label>
                                                            <DatePicker selected={awardForm.issueingDate} onChange={(date) => setAwardForm({ ...awardForm, issueingDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Issued Date" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Expiration Date</label>
                                                            <DatePicker selected={awardForm.expirationDate} onChange={(date) => setAwardForm({ ...awardForm, expirationDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Expiration Date" />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="text-sm font-medium">{a.awardName}</p>
                                            <p className="text-xs text-gray-600">{a.issueingOrg}</p>
                                            {a.issueingDate && <p className="text-xs text-gray-500 mt-1">{a.issueingDate} – {a.expirationDate || "No Expiry"}</p>}
                                        </ItemWrapper>
                                    ))}

                                    {/* New entry form */}
                                    {showForm && (
                                        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Award Name</label>
                                                    <input className={fieldClass("awardName")} placeholder="Award Name" value={awardForm.awardName} onChange={(e) => setAwardForm({ ...awardForm, awardName: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Issuing Organisation</label>
                                                    <input className={fieldClass("issueingOrg")} placeholder="Issuing Organisation" value={awardForm.issueingOrg} onChange={(e) => setAwardForm({ ...awardForm, issueingOrg: e.target.value })} />
                                                </div>
                                            </div>
                                            <div>
                                                <textarea className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Describe your key achievements and duties..." rows="4" value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Date of Issued</label>
                                                    <DatePicker selected={awardForm.issueingDate} onChange={(date) => setAwardForm({ ...awardForm, issueingDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Issued Date" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-on-surface-variant block ml-1">Expiration Date</label>
                                                    <DatePicker selected={awardForm.expirationDate} onChange={(date) => setAwardForm({ ...awardForm, expirationDate: formatMonthYear(date) })} dateFormat="MMM yyyy" showMonthYearPicker className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholderText="Expiration Date" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editingIndex === null && (
                                        <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                            <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                <span className="hover:underline underline-offset-4">Add another award</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button onClick={handleBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                                        <button onClick={handleNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">Next: Skills</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Skills ── */}
                        {currentStep === "skills" && (
                            <div>
                                <section className="flex-1 space-y-10">
                                    <div className="mb-5">
                                        <h1 className="font-headline-lg text-headline-lg text-on-surface">Skills</h1>
                                        <p className="text-on-surface-variant font-body-md">Showcase your expertise. Add your top technical and soft skills to stand out to recruiters.</p>
                                    </div>
                                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                        {/* Existing skill items */}
                                        {skills[0] && skills.map((s, index) => (
                                            <ItemWrapper key={index} index={index}
                                                isEditing={editingIndex === index}
                                                onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                                onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                                editForm={
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Skill Name <span className="text-red-500">*</span></label>
                                                            <input className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${errors.skill ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"}`}
                                                                placeholder="e.g. JavaScript" value={skillForm.skill}
                                                                onChange={(e) => { setSkillForm({ ...skillForm, skill: e.target.value }); clearError("skill"); }} />
                                                            <FieldError message={errors.skill} />
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Expertise Level</label>
                                                                <span className="text-secondary font-bold text-body-lg">{levels[skillForm.level]}</span>
                                                            </div>
                                                            <div className="h-12">
                                                                <div className="relative flex bg-surface-container-high rounded-xl h-4">
                                                                    <div className="absolute top-0 h-full bg-secondary rounded-xl transition-all duration-300" style={{ width: `${100 / levels.length}%`, left: `${(100 / levels.length) * skillForm.level}%` }}>
                                                                        <div className="absolute left-[50%] top-[-70%] h-10 w-10 bg-white border-[4px] border-secondary rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
                                                                            <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                                                        </div>
                                                                    </div>
                                                                    {levels.map((level, i) => (
                                                                        <button key={i} onClick={() => setSkillForm({ ...skillForm, level: i })} className="flex-1 relative z-10 flex items-center justify-center">
                                                                            <p className="mt-14 text-xs font-label-bold text-[10px] text-outline">{level}</p>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <p className="text-sm font-medium">{s.skill}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Level — <span className="text-secondary font-medium">{levels[s.level]}</span></p>
                                            </ItemWrapper>
                                        ))}

                                        {/* New entry form (or initial form when list is empty) */}
                                        {(showForm || !skills[0]) && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Skill Name <span className="text-red-500">*</span></label>
                                                    <input className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${errors.skill ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"}`}
                                                        placeholder="e.g. JavaScript, Project Management" value={skillForm.skill}
                                                        onChange={(e) => { setSkillForm({ ...skillForm, skill: e.target.value }); clearError("skill"); }} />
                                                    <FieldError message={errors.skill} />
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center">
                                                        <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Expertise Level</label>
                                                        <span className="text-secondary font-bold text-body-lg">{levels[skillForm.level]}</span>
                                                    </div>
                                                    <div className="h-12">
                                                        <div className="relative flex bg-surface-container-high rounded-xl h-4">
                                                            <div className="absolute top-0 h-full bg-secondary rounded-xl transition-all duration-300" style={{ width: `${100 / levels.length}%`, left: `${(100 / levels.length) * skillForm.level}%` }}>
                                                                <div className="absolute left-[50%] top-[-70%] h-10 w-10 bg-white border-[4px] border-secondary rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
                                                                    <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                                                </div>
                                                            </div>
                                                            {levels.map((level, index) => (
                                                                <button key={index} onClick={() => setSkillForm({ ...skillForm, level: index })} className="flex-1 relative z-10 flex items-center justify-center">
                                                                    <p className="mt-14 text-xs font-label-bold text-[10px] text-outline">{level}</p>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {editingIndex === null && (
                                            <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                                <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                    <span className="hover:underline underline-offset-4">Add another skill</span>
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                            <button onClick={handleBack} className="px-8 py-3 border border-outline rounded-xl font-button text-button text-on-surface hover:bg-surface-container transition-colors">Back</button>
                                            <button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary px-12 py-3 rounded-xl font-button text-button text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Next: Language</button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* ── Languages ── */}
                        {currentStep === "languages" && (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Language</h1>
                                    <p className="text-on-surface-variant font-body-md">Showcase languages which you are fluent in to stand out to recruiters.</p>
                                </div>
                                <div className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl shadow-primary/5 border border-outline-variant/30 space-y-6">

                                    {/* Existing language items */}
                                    {languages[0] && languages.map((l, index) => (
                                        <ItemWrapper key={index} index={index}
                                            isEditing={editingIndex === index}
                                            onEdit={editingIndex === index ? updateData : () => handleEdit(index)}
                                            onDelete={() => dispatch(removeFromList({ index, step: currentStep }))}
                                            editForm={
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Language <span className="text-red-500">*</span></label>
                                                        <input className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${errors.language ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"}`}
                                                            placeholder="e.g. English" value={languageForm.language}
                                                            onChange={(e) => { setLanguageForm({ ...languageForm, language: e.target.value }); clearError("language"); }} />
                                                        <FieldError message={errors.language} />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Expertise Level</label>
                                                            <span className="text-secondary font-bold text-body-lg">{levels[languageForm.level]}</span>
                                                        </div>
                                                        <div className="h-12">
                                                            <div className="relative flex bg-surface-container-high rounded-xl h-4">
                                                                <div className="absolute top-0 h-full bg-secondary rounded-xl transition-all duration-300" style={{ width: `${100 / levels.length}%`, left: `${(100 / levels.length) * languageForm.level}%` }}>
                                                                    <div className="absolute left-[50%] top-[-70%] h-10 w-10 bg-white border-[4px] border-secondary rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
                                                                        <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                                                    </div>
                                                                </div>
                                                                {levels.map((level, i) => (
                                                                    <button key={i} onClick={() => setLanguageForm({ ...languageForm, level: i })} className="flex-1 relative z-10 flex items-center justify-center">
                                                                        <p className="mt-14 text-xs font-label-bold text-[10px] text-outline">{level}</p>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="text-sm font-medium">{l.language}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Level — <span className="text-secondary font-medium">{levels[l.level]}</span></p>
                                        </ItemWrapper>
                                    ))}

                                    {/* New entry form (or initial form when list is empty) */}
                                    {(showForm || !languages[0]) && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Language <span className="text-red-500">*</span></label>
                                                <input className={`w-full rounded-lg px-4 py-3 transition-all outline-none font-body-md text-body-md border ${errors.language ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400" : "bg-surface-container-low border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent"}`}
                                                    placeholder="e.g. English" value={languageForm.language}
                                                    onChange={(e) => { setLanguageForm({ ...languageForm, language: e.target.value }); clearError("language"); }} />
                                                <FieldError message={errors.language} />
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="font-label-bold text-label-bold text-outline uppercase tracking-wider">Expertise Level</label>
                                                    <span className="text-secondary font-bold text-body-lg">{levels[languageForm.level]}</span>
                                                </div>
                                                <div className="h-12">
                                                    <div className="relative flex bg-surface-container-high rounded-xl h-4">
                                                        <div className="absolute top-0 h-full bg-secondary rounded-xl transition-all duration-300" style={{ width: `${100 / levels.length}%`, left: `${(100 / levels.length) * languageForm.level}%` }}>
                                                            <div className="absolute left-[50%] top-[-70%] h-10 w-10 bg-white border-[4px] border-secondary rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform">
                                                                <div className="h-2 w-2 bg-secondary rounded-full"></div>
                                                            </div>
                                                        </div>
                                                        {levels.map((level, index) => (
                                                            <button key={index} onClick={() => setLanguageForm({ ...languageForm, level: index })} className="flex-1 relative z-10 flex items-center justify-center">
                                                                <p className="mt-14 text-xs font-label-bold text-[10px] text-outline">{level}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editingIndex === null && (
                                        <div className="pt-2 flex items-center text-primary font-button group cursor-pointer">
                                            <button className="flex items-center gap-3" onClick={addMoreHandler}>
                                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
                                                <span className="hover:underline underline-offset-4">Add another language</span>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-8 border-t border-outline-variant/30">
                                        <button onClick={handleBack} className="px-8 py-3 rounded-xl border-2 border-outline-variant font-button text-button text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">Back</button>
                                        <button
                                            className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                            onClick={() => {
                                                if (!validateStep("languages")) return;
                                                if (languageForm.language.trim()) {
                                                    dispatch(addToList({ form: languageForm, step: currentStep }));
                                                }
                                                handleSaveAndNavigate();
                                            }}
                                        >
                                            Save CV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Preview Panel ── */}
                    {/* ── Preview Panel ── */}
{/* 
  HOW CENTERING WORKS:
  - A4 is 794px wide. We scale it to 0.6 → rendered width = 794 * 0.6 = 476px
  - The outer container is exactly 476px wide
  - overflow:hidden clips the scaled content cleanly
  - No left/right pink gaps because width matches the scaled output exactly
*/}

{(() => {
    const SCALE   = 0.65;
    const A4_W    = 794;
    const A4_H    = 1123;
    const DISPLAY_W = A4_W * SCALE;   // 476px — exact rendered width
    const DISPLAY_H = A4_H * SCALE;   // 674px — exact rendered height

    return (
        <div className="flex flex-col h-full">
            {/* Top bar: theme + change template */}
            <div className="w-full flex justify-between p-4 items-center bg-surface-container-lowest border-b border-outline-variant/30 rounded-t-2xl">
                <div className="flex flex-col justify-center items-start gap-2">
                    <h3 className="font-semibold text-sm text-on-surface">Choose Theme</h3>
                    <div className="flex gap-2">
                        {templateThemes[temp_id]?.map((t, i) => (
                            <button
                                key={i}
                                style={{ backgroundColor: t.primary }}
                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                                    selectedTheme?.primary === t.primary
                                        ? "border-white ring-2 ring-primary scale-110"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSelectedTheme(t)}
                                title={t.primary}
                            />
                        ))}
                    </div>
                </div>
                <Link to="/select-template">
                    <button className="py-2 px-3 text-white bg-secondary text-sm rounded-xl hover:opacity-90 transition-opacity">
                        Change Template
                    </button>
                </Link>
            </div>

            {/* Centered scaled preview */}
            <div className="flex-1 flex justify-center items-start bg-gray-100 p-4 rounded-b-2xl overflow-auto">
                {/* Hidden template for PDF generation */}
                <div id="hidden-template" style={{ display: "none" }}>
                    <Preview previewData={previewData} temp={temp_id} theme={selectedTheme} />
                </div>

                {/* 
                    Outer box = exact scaled A4 width/height → no side gaps
                    overflow:hidden clips anything that bleeds out during scale
                */}
                <div
                    id="pdf-print-area"
                    style={{
                        width:    DISPLAY_W,
                        height:   DISPLAY_H,
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <div
                        id="pdf-scale-wrapper"
                        style={{
                            width:           A4_W,
                            height:          A4_H,
                            transform:       `scale(${SCALE})`,
                            transformOrigin: "top left",   // scale from top-left…
                            // …but the outer container is already sized to DISPLAY_W/H
                            // so it appears perfectly centred inside its parent
                        }}
                    >
                        <Preview previewData={previewData} temp={temp_id} theme={selectedTheme} />
                    </div>
                </div>
            </div>
        </div>
    );
})()}
                </div>
            </div>

            <UserAuth isOpen={open} onClose={() => setOpen(false)} />
        </div>
    );
};

export default CreateCv;