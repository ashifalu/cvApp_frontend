import PreviewPanel from "./components/Previewpanel.jsx";
import AwardsStep from "./steps/Awardsstep.jsx";
import CertificationsStep from "./steps/CertificationsStep.jsx";
import ProjectsStep from "./steps/Projectsstep.jsx";
import ExperienceStep from "./steps/Experiencestep.jsx";
import EducationStep from "./steps/Educationstep.jsx";
import SummaryStep from "./steps/Summarystep.jsx";
import PersonalInfoStep from "./steps/PersonalInfoStep.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";
import SkillsStep from "./steps/Skillsstep.jsx";
import LanguagesStep from "./steps/Languagesstep.jsx";
import {generatePdfApi, storeDataApi} from "../../services/allApi.js";
import UserAuth from "../../users/components/UserAuth.jsx";
import {useSelector, useDispatch} from "react-redux";
import Modal from "../../Modal.jsx";


const  Create_cv = () => {

    const personalInfo        = useSelector(s => s.cv.cvData.personalInfo);
    const professionalSummary = useSelector(s => s.cv.cvData.professionalSummary);
    const experience          = useSelector(s => s.cv.cvData.experience);
    const education           = useSelector(s => s.cv.cvData.education);
    const skills              = useSelector(s => s.cv.cvData.skills);
    const projects            = useSelector(s => s.cv.cvData.projects);
    const certifications      = useSelector(s => s.cv.cvData.certifications);
    const awards              = useSelector(s => s.cv.cvData.awards);
    const languages = useSelector(s => s.cv.cvData.languages)

    const temp_id = useParams().temp;
    const resume_id = useParams().resume_id;
    console.log(temp_id)
    const location = useLocation();
    const resumeTheme = location.state

    const [currentStep, setCurrentStep] = useState("personalInfo");
    const [selectedTheme, setSelectedTheme] = useState(resumeTheme?resumeTheme:{});
    const [switchTab, setSwitchTab] = useState("edit")
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    const [open, setOpen]                     = useState(false)
    const EMPTY_FORM = { language: "", level: 2 };
    const [form,         setForm]         = useState(EMPTY_FORM);
    const [saving,       setSaving]       = useState(false);
    const [authMode, setAuthMode] = useState('login')
    const [token, setToken] = useState('')
    const [existingUser, setExistingUser] = useState({})

    const navigate = useNavigate()

    useEffect(() => {

        if (sessionStorage.getItem("token")) {
            setToken(sessionStorage.getItem("token"))
            setExistingUser(JSON.parse(sessionStorage.getItem("existingUser")))
        }
        console.log(existingUser._id);
        console.log(token);
    }, [])
    const storeDataRef = useRef({});

    const steps = ["personalInfo", "professionalSummary", "education",
        "experience", "projects", "awards","certifications", "skills", "languages"];

    const goNext = () => {
        const i = steps.indexOf(currentStep);
        if (i < steps.length - 1) setCurrentStep(steps[i + 1]);
    };
    const goBack = () => {
        const i = steps.indexOf(currentStep);
        if (i > 0) setCurrentStep(steps[i - 1]);
    };

    const stepComponents = {
        personalInfo:        <PersonalInfoStep onNext={goNext} temp_id={temp_id} />,
        professionalSummary: <SummaryStep onNext={goNext} onBack={goBack}  />,
        education:           <EducationStep onNext={goNext} onBack={goBack}  />,
        experience:          <ExperienceStep onNext={goNext} onBack={goBack}  />,
        projects:            <ProjectsStep onNext={goNext} onBack={goBack}  />,
        awards:              <AwardsStep onNext={goNext} onBack={goBack}  />,
        certifications:      <CertificationsStep onNext={goNext} onBack={goBack}  />,
        skills:              <SkillsStep onNext={goNext} onBack={goBack} />,
        languages:           <LanguagesStep onBack={goBack} temp_id={temp_id} selectedTheme={selectedTheme} resume_id={resume_id} />,
    };

    const handleSave = async () => {
        if (form.language.trim()) {
            if (!validate()) return;
            addEntry();
        }

        setSaving(true);
        try {
            const token       = sessionStorage.getItem("token");
            const existingUser = JSON.parse(sessionStorage.getItem("existingUser") || "{}");

            const printArea = document.getElementById("pdf-print-area");
            if (!printArea) { alert("Template not found. Please try again."); return; }

            const pdfResponse = await generatePdfApi({ html: printArea.innerHTML });
            const pdfUrl      = pdfResponse.data.pdfUrl;

            const reqBody = {
                personalInfo: {
                    ...personalInfo,
                    phone: personalInfo.phone
                        ? `${personalInfo.phoneCountryCode} ${personalInfo.phone}`
                        : "",
                },
                professionalSummary,
                experience,
                education,
                projects,
                awards,
                certifications,
                skills,
                languages,
                resumeUrl: pdfUrl,
                template: temp_id,
                theme: selectedTheme
            };
            const reqHeader = { authorization: `Bearer ${token}` };

            if (token) {
                await storeDataApi(reqBody, reqHeader);
                navigate(`/user-profile/${existingUser._id}`);
            } else {
                storeDataRef.current = reqBody;
                setOpen(true);
            }
        } catch (err) {
            console.error("Save error:", err.message);
            alert("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };



    return (
        <div className="creteCv_body bg-surface text-on-surface">
            {/* ── Header ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-surface/80 backdrop-blur-[24px] shadow-md flex justify-between items-center px-4 sm:px-8 z-50 pt-[0.6rem] pb-[0.6rem]">
                <Link to={`/choose-methode/${temp_id}`}><div className="font-display-lg text-black tracking-tighter text-2xl flex item-center"><span className="material-symbols-outlined">arrow_back</span></div></Link>
                <div className="flex gap-4 items-center">
                    {!token? <button className=" text-black font-bold px-3 sm:px-6 border border-black/5 hover:bg-surface transition-all shadow-sm py-2 rounded-lg duration-300"
                                     onClick={() => {
                                         setOpen(true);
                                         setAuthMode('login')
                                     }}>Sign In</button>
                        :
                        <button className=" text-black border border-black/5 hover:bg-surface flex items-center justify-center gap-2  shadow-sm font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                onClick={() => { navigate(`/user-profile/${existingUser._id}`);}}>
                            <span className="material-symbols-outlined  ">person</span> My account

                        </button>
                    }
                    {/*<button onClick={()=>navigate("/select-template")} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300" >Create Resume</button>*/}
                </div>
            </nav>

            {/* ── Mobile / tablet tab switcher ──────────────────────────── */}
            <div className="fixed top-16 left-0 w-full z-40 flex bg-surface border-b border-outline-variant/30 xl:hidden">
                <button
                    className={`flex items-center justify-center px-8 w-1/2 py-3 sm:py-4 text-center   font-label-md text-xs sm:text-label-md ${switchTab === "edit" ? "tab-active" : ""}`}
                    onClick={() => setSwitchTab('edit')}>
                    <span className="material-symbols-outlined pe-1  text-[18px]">edit</span>
                    Edit Content
                </button>
                <button
                    className={` py-3 sm:py-4 text-center flex items-center justify-center px-8 w-1/2 font-label-md text-xs sm:text-label-md ${switchTab === "preview" ? "tab-active" : ""}`}
                    onClick={() => setSwitchTab('preview')}>
                    <span className="material-symbols-outlined pe-1  text-[18px] ">visibility</span>
                    Preview Resume
                </button>
            </div>

            {/* ── Desktop split view (xl and up) ────────────────────────── */}
            <main className="mt-[112px]  xl:mt-16 min-h-[calc(100vh-64px)] hidden xl:grid grid-cols-2">
                <div className=" overflow-y-auto">{stepComponents[currentStep]}</div>
                <div className="bg-surface-container">
                    <PreviewPanel temp_id={temp_id} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>
                </div>
            </main>

            {/* ── Mobile / tablet single-panel view (below xl) ──────────── */}
            <main className="mt-[109px] w-full  xl:hidden min-h-[calc(100vh-109px)]">
                {switchTab === "edit" &&
                    <div className=" w-full min-h-[calc(100vh-112px)]">
                        {stepComponents[currentStep]}
                    </div>}
                {switchTab === "preview" &&
                    <div className="w-full min-h-[calc(100vh-112px)] bg-surface-container">
                            <PreviewPanel temp_id={temp_id} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>
                    </div>}
            </main>


            <UserAuth isOpen={open} storeData={storeDataRef.current}  onClose={() => setOpen(false)} />
            {saving===true && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 bg-surface px-10 py-8 rounded-2xl shadow-2xl border border-outline-variant/30 min-w-[220px]">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-4 border-outline-variant/30"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <p className="font-label-md text-sm text-on-surface tracking-wide">Saving...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Create_cv;