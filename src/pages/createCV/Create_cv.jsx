import PreviewPanel from "./components/Previewpanel.jsx";
import AwardsStep from "./steps/Awardsstep.jsx";
import ProjectsStep from "./steps/Projectsstep.jsx";
import ExperienceStep from "./steps/Experiencestep.jsx";
import EducationStep from "./steps/Educationstep.jsx";
import SummaryStep from "./steps/Summarystep.jsx";
import PersonalInfoStep from "./steps/PersonalInfoStep.jsx";
import {useState} from "react";
import {useParams} from "react-router-dom";
import SkillsStep from "./steps/Skillsstep.jsx";
import LanguagesStep from "./steps/Languagesstep.jsx";


const Create_cv = () => {
    const [currentStep, setCurrentStep] = useState("personalInfo");
    const [selectedTheme, setSelectedTheme] = useState({});
    const temp_id = useParams().temp;

    const steps = ["personalInfo", "professionalSummary", "education",
        "experience", "projects", "awards", "skills", "languages"];

    const goNext = () => {
        const i = steps.indexOf(currentStep);
        if (i < steps.length - 1) setCurrentStep(steps[i + 1]);
    };
    const goBack = () => {
        const i = steps.indexOf(currentStep);
        if (i > 0) setCurrentStep(steps[i - 1]);
    };

    const stepComponents = {
        personalInfo:        <PersonalInfoStep onNext={goNext} />,
        professionalSummary: <SummaryStep onNext={goNext} onBack={goBack} />,
        education:           <EducationStep onNext={goNext} onBack={goBack} />,
        experience:          <ExperienceStep onNext={goNext} onBack={goBack} />,
        projects:            <ProjectsStep onNext={goNext} onBack={goBack} />,
        awards:              <AwardsStep onNext={goNext} onBack={goBack} />,
        skills:              <SkillsStep onNext={goNext} onBack={goBack} />,
        languages:           <LanguagesStep onBack={goBack} />,
    };

    return (
        <div className="bg-surface text-on-surface font-body-md min-h-screen ">
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="font-headline-md text-headline-md font-bold text-primary">ResumeElite</div>
                    <nav className="hidden lg:flex items-center gap-1 border-l border-outline-variant/30 pl-6 ml-4">
                        <a className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 text-primary font-label-md text-label-md"
                           href="#">
                            <span className="material-symbols-outlined text-[20px]">work</span>Experience
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 font-label-md text-label-md"
                           href="#">
                            <span className="material-symbols-outlined text-[20px]">person</span>Contact
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 font-label-md text-label-md"
                           href="#">
                            <span className="material-symbols-outlined text-[20px]">school</span>Education
                        </a>
                        <a className="flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 font-label-md text-label-md"
                           href="#">
                            <span className="material-symbols-outlined text-[20px]">psychology</span>Skills
                        </a>
                    </nav>
                </div>
                <div className="flex gap-2 md:gap-4">
                    <button
                        className="hidden md:block font-label-md text-label-md px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all">Save
                        Draft
                    </button>
                    <button
                        className="font-label-md text-label-md px-4 py-2 bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Download PDF
                    </button>
                </div>
            </header>
            {/*mobile header*/}
            <div className="fixed top-16 left-0 w-full z-40 flex bg-surface border-b border-outline-variant/30 xl:hidden">
                <button className="flex-1 py-4 text-center font-label-md text-label-md tab-active" id="edit-tab" onClick={()=>switchTab('edit')}>
                    Edit Content
                </button>
                <button className="flex-1 py-4 text-center font-label-md text-label-md text-on-surface-variant" id="preview-tab" onClick={()=>switchTab('preview')}>
                    Preview Resume
                </button>
            </div>
            <div className="md:mx-20 py-10 px-margin-desktop">
                <main className="mt-[120px] bg-surface-container-lowest xl:mt-16 min-h-[calc(100vh-120px)] xl:min-h-[calc(100vh-64px)] grid grid-cols-1 xl:grid-cols-2">
                    <div className="bg-surface-container-lowest">{stepComponents[currentStep]}</div>
                    <PreviewPanel temp_id={temp_id} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}/>
                </main>
            </div>
        </div>
    );
};

export default Create_cv;