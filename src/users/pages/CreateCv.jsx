import { useState } from "react"
import UserAuth from "../components/UserAuth"
import { useDispatch, useSelector } from "react-redux"
import { addAwards, addEducation, addExperience, addLanguages, addPersonalInfo, addProfessionalSummary, addProjects, addSkills } from "../../state/cvSlice"
import TemplateOne from "../../templates/Template1"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CreateCv = () => {

    const experience = useSelector((state) => state.cv.cvData.experience)
    const education = useSelector((state) => state.cv.cvData.education)
    const skills = useSelector((state) => state.cv.cvData.skills)
    const languages = useSelector((state) => state.cv.cvData.languages)
    const projects = useSelector((state) => state.cv.cvData.projects)
    const awards = useSelector((state) => state.cv.cvData.awards)

    const steps = ["personalInfo", "professionalSummary", "experience", "education", "projects", "skills","languages", "awards"];
    const levels = ["Beginner", "Basic", "Skillful", "Advanced", "Expert"];


    const dispatch = useDispatch()
    const [responsibility, setResponsibility] = useState('')
    const [open, setOpen] = useState(false)
    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        role: "",
        photo: "",
        linkedInUrl: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        nationality: "",
    })
    const [professionalSummary, setProfessionalSummary] = useState("")
    const [educationForm, setEducationForm] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startDate: null,
        endDate: null,
        country: "",
        city: ""
    })
    const [experienceForm, setExperienceForm] = useState({
        jobTitle: "",
        employer: "",
        startDate: null,
        endDate: null,
        country: "",
        city: "",
        responsibilities: []
    })
    const [skillForm, setSkillForm] = useState({
        skill: "",
        level: 2,
    })
    const [languageForm, setLanguageForm] = useState({
        language: "",
        level: 2,
    })
    const [projectForm, setProjectForm] = useState({
        projectTitle: "",
        projectDescription: "",
        projectUrl: ""
    })
    const [awardForm, setAwardForm] = useState({
        awardName: "",
        issueingOrg: "",
        issueingDate: "",
        expirationDate: "",
    })
    const [photoPreview, setPhotoPreview] = useState("")

    const [currentStep, setCurrentStep] = useState("personalInfo")


    const handlePhotoUpload = (e) => {
        setPersonalInfo({ ...personalInfo, photo: e.target.files[0] })
        let url = URL.createObjectURL(e.target.files[0])
        console.log(url);

        setPhotoPreview(url)
    }

    const stepConfig = {
        experience: {
            form: experienceForm,
            setForm: setExperienceForm,
            list: experience,
            setList: addExperience,
            emptyForm: {
                jobTitle: "",
                employer: "",
                startDate: "",
                endDate: "",
                city: "",
                country: "",
                responsibilities: []
            },
            requiredKey: "jobTitle"
        },

        education: {
            form: educationForm,
            setForm: setEducationForm,
            list: education,
            setList: addEducation,
            emptyForm: {
                degree: "",
                institute: "",
                startDate: "",
                endDate: ""
            },
            requiredKey: "degree"
        },

        projects: {
            form: projectForm,
            setForm: setProjectForm,
            list: projects,
            setList: addProjects,
            emptyForm: {
                projectTitle: "",
                projectDescription: "",
                projectUrl: ""
            },
            requiredKey: "projectTitle"
        },
        skills: {
            form: skillForm,
            setForm: setSkillForm,
            list: skills,
            setList: addSkills,
            emptyForm: {
                skill: "",
                level: 2
            },
            requiredKey: "skill"
        },
        languages: {
            form: languageForm,
            setForm: setLanguageForm,
            list: languages,
            setList: addLanguages,
            emptyForm: {
                language: "",
                level: 2
            },
            requiredKey: "language"
        },
        awards: {
            form: awardForm,
            setForm: setAwardForm,
            list: awards,
            setList: addAwards,
            emptyForm: {
                awardName: "",
                issueingOrg: "",
                issueingDate: "",
                expirationDate: "",
            },
            requiredKey: "awardName"
        }

    };

    const addresponsibilities = () => {

        if (!responsibility.trim()) return;
        setExperienceForm({ ...experienceForm, responsibilities: [...experienceForm.responsibilities, responsibility] })
        setResponsibility("");

    }

    const formatMonthYear = (date) => {
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return `${month} ${year}`;
    };



    const goToNextStep = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    }

    const handleNext = () => {
        const step = stepConfig[currentStep];
        if (!step) return;
        console.log(step);

        const { form, setForm, emptyForm, list, setList, requiredKey } = step;

        if (form[requiredKey]) {

            const isDuplicate = list.some(
                (item) => JSON.stringify(item) === JSON.stringify(form)
            );

            if (!isDuplicate) {
                dispatch(setList(form));
            }

            setForm(emptyForm);
            goToNextStep();
        } else {
            goToNextStep();
        }
    };

    const createCv = () => {
        console.log(experience);
        console.log(education);
        console.log(skills);
        console.log(languages);
        console.log(projects);
        console.log(awards);



        setOpen(true)

    }

    const addExperienceHandler = () => {
        if (!experienceForm.jobTitle.trim()) return;

        let updatedResponsibilities = [...experienceForm.responsibilities]

        if (responsibility.trim()) {

            const isDuplicate = updatedResponsibilities.some(
                (item) => item === responsibility

            );
            if (!isDuplicate) {
                updatedResponsibilities.push(responsibility.trim())
                setResponsibility("")
            }
        }

        const updatedExperienceForm = { ...experienceForm, responsibilities: updatedResponsibilities }

        dispatch(addExperience(updatedExperienceForm))

        setExperienceForm({
            jobTitle: "",
            employer: "",
            startDate: "",
            endDate: "",
            country: "",
            city: "",
            responsibilities: []
        })
    }

    const addEducationHandler = () => {
        if (!educationForm.degree.trim()) return;

        dispatch(addEducation(educationForm));

        setEducationForm({
            school: "",
            degree: "",
            fieldOfStudy: "",
            grade: "",
            startDate: "",
            endDate: "",
            country: "",
            city: ""
        })
    }

    const addSkillsHandler = () => {

        if (!skillForm.skill.trim()) return;

        dispatch(addSkills(skillForm))

        setSkillForm({
            skill: "",
            level: 2,
        })
    }
    const addLanguageHandler = () => {

        if (!languageForm.language.trim()) return;

        dispatch(addLanguages(languageForm))

        setLanguageForm({
            language: "",
            level: 2,
        })
    }

    const addProjectsHandler = () => {

        if (!projectForm.projectTitle.trim()) return;


        dispatch(addProjects(projectForm));

        setProjectForm({
            projectTitle: "",
            projectDescription: "",
            projectUrl: ""
        })
    }

    const addAwardsHandler = () => {

        if (!awardForm.awardName.trim()) return;

        dispatch(addAwards(awardForm))
        setAwardForm({
            awardName: "",
            issueingOrg: "",
            issueingDate: "",
            expirationDate: "",
        })
    }

    const handleBack = () => {
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    }

    return (
        <div className="grid grid-cols-2">

            <div className="max-w-3xl mx-auto p-4 space-y-6">

                <div className='my-10 flex justify-center items-center'>
                    <label htmlFor="photo">
                        <input type="file" onChange={(e) => handlePhotoUpload(e)} id='photo' className='hidden' />
                        <div className='relative'>
                            <img className='rounded-full w-20 h-20' src={photoPreview ? photoPreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQqzBrUPyXpuWXPO2IbmBRIO-KMa29322Jow&s"} alt="" />

                        </div>
                    </label>
                </div>

                {/* Basic Info */}
                {currentStep == "personalInfo" && <div>
                    <h2 className="font-semibold">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="First Name" required onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} />
                        <input className="border p-2" placeholder="Last Name" onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                        <input className="border p-2" placeholder="Role" onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })} />
                        <input className="border p-2" placeholder="LinkedIn Url" onChange={(e) => setPersonalInfo({ ...personalInfo, linkedInUrl: e.target.value })} />
                        <input className="border p-2" placeholder="Email" onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                        <input className="border p-2" placeholder="Phone" onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                        <input className="border p-2" placeholder="Country" onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })} />
                        <input className="border p-2" placeholder="City" onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })} />
                        <input className="border p-2" placeholder="Nationality" onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })} />
                        <div className="flex justify-end">
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => {
                                dispatch(addPersonalInfo(personalInfo)); setCurrentStep("professionalSummary")
                            }}>Next</button>
                        </div>
                    </div>

                </div>}
                {currentStep == "professionalSummary" && <div>
                    {/* Professional Summary */}
                    <h2 className="font-semibold">Professional Summary</h2>
                    <textarea className="border p-2 w-full" rows="3" placeholder="Professional Summary" onChange={(e) => setProfessionalSummary(e.target.value)} />
                    <div className="flex justify-between">
                        <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                        <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => {
                            dispatch(addProfessionalSummary(professionalSummary));
                            setCurrentStep("experience")
                        }}>Next</button>
                    </div>

                </div>
                }
                {/* Experience */}
                {currentStep == "experience" && <div>
                    <div>
                        <h2 className="font-semibold">Experience</h2>
                        <div className=" border border-gray-200 bg-white rounded p-10 w-full">
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <input className="border bg-gray-100 p-2" placeholder="Job Title" value={experienceForm.jobTitle} onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })} />
                                <input className="border p-2 bg-gray-100" placeholder="Employer" value={experienceForm.employer} onChange={(e) => setExperienceForm({ ...experienceForm, employer: e.target.value })} />

                                <DatePicker
                                    selected={experienceForm.startDate}
                                    onChange={(date) => {
                                        const formatted = formatMonthYear(date);
                                        setExperienceForm({
                                            ...experienceForm,
                                            startDate: formatted,
                                        });
                                    }}
                                    dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                                    showMonthYearPicker          // 👈 only month + year
                                    className="border p-2 rounded-md"
                                    placeholderText="Select month & year"
                                />
                                <DatePicker
                                    selected={experienceForm.endDate}
                                    onChange={(date) => {
                                        const formatted = formatMonthYear(date);
                                        setExperienceForm({
                                            ...experienceForm,
                                            endDate: formatted,
                                        });
                                    }}
                                    dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                                    showMonthYearPicker          // 👈 only month + year
                                    className="border p-2 rounded-md"
                                    placeholderText="Select month & year"
                                />

                                <input className="border p-2" placeholder="Country" value={experienceForm.country} onChange={(e) => setExperienceForm({ ...experienceForm, country: e.target.value })} />
                                <input className="border p-2" placeholder="City" value={experienceForm.city} onChange={(e) => setExperienceForm({ ...experienceForm, city: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2">

                            </div>

                            <div className="flex gap-2 items-start">
                                <textarea className="border p-2 w-full" rows="1" placeholder="Highlites" value={responsibility} onChange={(e) => setResponsibility(e.target.value)} /><button type="button" className="px-3 py-1 hover:bg-gray-100 rounded text-lg bg-gray-100 text-blue-500" onClick={addresponsibilities}>+</button>
                            </div>
                            <div className="bg-white pt-2 pb-5">
                                <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addExperienceHandler}>Add more</button>
                            </div>
                        </div>
                        <div className="flex justify-between w-full my-2 py-4 rounded shadow">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </div>}

                {/* Education */}
                {currentStep == "education" && <div>
                    <h2 className="font-semibold">Education</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="School" value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} />
                        <input className="border p-2" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
                        <input className="border p-2" placeholder="Field of Study" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} />
                        <input className="border p-2" placeholder="Grade" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
                        <DatePicker
                            selected={experienceForm.startDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setExperienceForm({
                                    ...experienceForm,
                                    startDate: formatted,
                                });
                            }}
                            dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                            showMonthYearPicker          // 👈 only month + year
                            className="border p-2 rounded-md"
                            placeholderText="Select month & year"
                        />
                        <DatePicker
                            selected={experienceForm.endDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setExperienceForm({
                                    ...experienceForm,
                                    endDate: formatted,
                                });
                            }}
                            dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                            showMonthYearPicker          // 👈 only month + year
                            className="border p-2 rounded-md"
                            placeholderText="Select month & year"
                        />
                        <input className="border p-2" placeholder="Country" value={educationForm.country} onChange={(e) => setEducationForm({ ...educationForm, country: e.target.value })} />
                        <input className="border p-2" placeholder="City" value={educationForm.city} onChange={(e) => setEducationForm({ ...educationForm, city: e.target.value })} />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addEducationHandler}>Add one more education</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </div>}

                {/* Projects */}
                {currentStep == "projects" && <div>
                    <h2 className="font-semibold">Projects</h2>
                    <div className="space-y-2">
                        <input className="border p-2 w-full" placeholder="Project Title" value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} />
                        <textarea className="border p-2 w-full" rows="2" placeholder="Project Description" value={projectForm.projectDescription} onChange={(e) => setProjectForm({ ...projectForm, projectDescription: e.target.value })} />
                        <input className="border p-2 w-full" placeholder="Project URL" value={projectForm.projectUrl} onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })} />
                        <button type="button" className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addProjectsHandler}>Add one more project</button>
                        <div className="flex justify-between">
                            <button type="button" className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            <button type="button" className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </div>}

                {/* Skills */}
                {currentStep == "skills" && <div>
                    <h2 className="font-semibold p-10 text-lg">Skills</h2>
                    <div className="grid grid-cols-2 gap-4 w-200">
                        <input className="border p-2 h-10 w-50 rounded" placeholder="Skill" value={skillForm.skill} onChange={(e) => setSkillForm({ ...skillForm, skill: e.target.value })} />
                        <div>

                            {/* Bar */}
                            <div className="relative flex bg-[#E8D9B5] rounded-xl h-10 overflow-hidden">

                                {/* Active Highlight */}
                                <div
                                    className="absolute top-0 h-full bg-orange-500 rounded-xl transition-all duration-300"
                                    style={{
                                        width: `${100 / levels.length}%`,
                                        left: `${(100 / levels.length) * skillForm.level}%`
                                    }}
                                />

                                {/* Click Areas */}
                                {levels.map((level, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSkillForm({ ...skillForm, level: index })}
                                        className="flex-1 relative z-10 flex items-center justify-center"
                                    >
                                        {/* Separator */}
                                        {index !== 0 && (
                                            <div className="absolute left-0 h-6 w-[2px] bg-orange-400 opacity-50" />
                                        )}
                                    </button>
                                ))}
                                
                            </div>
                            {/* Label */}
                            <p className="text-lg font-medium text-gray-600 mb-3">
                                Level — <span className="text-orange-500">{levels[skillForm.level]}</span>
                            </p>
                        </div>
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addSkillsHandler}>Add one more skill</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>}

                {/* language */}
                {currentStep == "languages"&& <div>
                    <h2 className="font-semibold p-10 text-lg">Languages</h2>
                    <div className="grid grid-cols-2 gap-4 w-200">
                        <input className="border p-2 h-10 w-50 rounded" placeholder="Language" value={languageForm.language} onChange={(e) => setLanguageForm({...languageForm,language:e.target.value})} />
                        <div>

                            {/* Bar */}
                            <div className="relative flex bg-[#E8D9B5] rounded-xl h-10 overflow-hidden">

                                {/* Active Highlight */}
                                <div
                                    className="absolute top-0 h-full bg-orange-500 rounded-xl transition-all duration-300"
                                    style={{
                                        width: `${100 / levels.length}%`,
                                        left: `${(100 / levels.length) * languageForm.level}%`
                                    }}
                                />

                                {/* Click Areas */}
                                {levels.map((level, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setLanguageForm({ ...languageForm, level: index })}
                                        className="flex-1 relative z-10 flex items-center justify-center"
                                    >
                                        {/* Separator */}
                                        {index !== 0 && (
                                            <div className="absolute left-0 h-6 w-[2px] bg-orange-400 opacity-50" />
                                        )}
                                    </button>
                                ))}
                                
                            </div>
                            {/* Label */}
                            <p className="text-lg font-medium text-gray-600 mb-3">
                                Level — <span className="text-orange-500">{levels[languageForm.level]}</span>
                            </p>
                        </div>
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addLanguageHandler}>Add one more skill</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>

                </div>}



                {/* Awards */}
                {currentStep == "awards" && <div>
                    <h2 className="font-semibold">Awards</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="Award Name" value={awardForm.awardName} onChange={(e) => setAwardForm({ ...awardForm, awardName: e.target.value })} />
                        <input className="border p-2" placeholder="Issuing Organisation" value={awardForm.issueingOrg} onChange={(e) => setAwardForm({ ...awardForm, issueingOrg: e.target.value })} />
                        {/* <input className="border p-2" placeholder="Issuing Date" value={awardForm.issueingDate} onChange={(e) => setAwardForm({ ...awardForm, issueingDate: e.target.value })} />
                        <input className="border p-2" placeholder="Expiration Date" value={awardForm.expirationDate} onChange={(e) => setAwardForm({ ...awardForm, expirationDate: e.target.value })} /> */}
                        <DatePicker
                            selected={awardForm.issueingDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setAwardForm({
                                    ...awardForm,
                                    issueingDate: formatted,
                                });
                            }}
                            dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                            showMonthYearPicker          // 👈 only month + year
                            className="border p-2 rounded-md"
                            placeholderText="Issued Date"
                        />
                        <DatePicker
                            selected={awardForm.expirationDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setAwardForm({
                                    ...awardForm,
                                    expirationDate: formatted,
                                });
                            }}
                            dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                            showMonthYearPicker          // 👈 only month + year
                            className="border p-2 rounded-md"
                            placeholderText="Expiration Date"
                        />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addAwardsHandler}>Add one more award</button>
                    </div>
                    <div className="justify-between">
                        <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                        <button className="border px-4 py-2" onClick={() => {
                            if (awardForm.awardName.trim()) {
                                dispatch(addAwards(awardForm));
                            }

                            createCv();
                        }}>
                            Save CV
                        </button>

                    </div>

                </div>}

            </div>
            <div className="w-1/2">
                <TemplateOne />
            </div>
            <UserAuth
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </div>
    )
}

export default CreateCv