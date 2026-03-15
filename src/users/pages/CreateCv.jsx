import { useState } from "react"
import UserAuth from "../components/UserAuth"
import { useDispatch, useSelector } from "react-redux"
import { addToList, addPersonalInfo, addProfessionalSummary, updateList, removeFromList } from "../../state/cvSlice"
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

    const steps = ["personalInfo", "professionalSummary","education","experience", "projects","awards", "skills", "languages"];
    const levels = ["Beginner", "Basic", "Skillful", "Advanced", "Expert"];

    const dispatch = useDispatch()
    const [editingIndex, setEditingIndex] = useState(null)
    const [responsibility, setResponsibility] = useState('')
    const [keyFeature, setKeyFeature] = useState('')
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
        keyFeatures: [],
        projectUrl: ""
    })
    const [awardForm, setAwardForm] = useState({
        awardName: "",
        issueingOrg: "",
        description: "",
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
            setList: addToList,
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
            setList: addToList,
            emptyForm: {
                school: "",
                degree: "",
                fieldOfStudy: "",
                grade: "",
                startDate: null,
                endDate: null,
                country: "",
                city: ""
            },
            requiredKey: "degree"
        },

        projects: {
            form: projectForm,
            setForm: setProjectForm,
            list: projects,
            setList: addToList,
            emptyForm: {
                projectTitle: "",
                keyFeatures: [],
                projectUrl: ""
            },
            requiredKey: "projectTitle"
        },
        skills: {
            form: skillForm,
            setForm: setSkillForm,
            list: skills,
            setList: addToList,
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
            setList: addToList,
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
            emptyForm: {
                awardName: "",
                issueingOrg: "",
                description: "",
                issueingDate: "",
                expirationDate: "",
            },
            requiredKey: "awardName"
        }

    };

    const step = stepConfig[currentStep] || {};

    // console.log(step);


    const {
        form,
        setForm,
        emptyForm,
        list,
        requiredKey,
    } = step;



    const addresponsibilities = () => {
        if (!responsibility.trim()) return;

        const isDuplicate = experienceForm.responsibilities.some(
            (item) => item === responsibility.trim()
        );

        if (!isDuplicate) {
            setExperienceForm({
                ...experienceForm,
                responsibilities: [
                    ...experienceForm.responsibilities,
                    responsibility.trim()
                ]
            });

            setResponsibility("");
        }
    };

    const addKeyFeatures = () => {
        if (!keyFeature.trim()) return;

        const isDuplicate = projectForm.keyFeatures.some(
            (item) => item === keyFeature.trim()
        );

        if (!isDuplicate) {
            setProjectForm({
                ...projectForm,
                keyFeatures: [
                    ...projectForm.keyFeatures,
                    keyFeature.trim()
                ]
            });

            setKeyFeature("");
        }
    };

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
        if (!step) return;
        console.log(step);

        if (form[requiredKey]) {

            let updatedForm = { ...form };

            if (currentStep === "experience" && responsibility.trim()) {
                updatedForm = {
                    ...form,
                    responsibilities: [
                        ...form.responsibilities,
                        responsibility.trim()
                    ]
                };
                setResponsibility("");
            }
            if (currentStep === "projects" && keyFeature.trim()) {
                updatedForm = {
                    ...form,
                    keyFeatures: [
                        ...form.keyFeatures,
                        keyFeature.trim()
                    ]
                };
                setKeyFeature("");
            }

            const isDuplicate = list.some(
                (item) => JSON.stringify(item) === JSON.stringify(updatedForm)
            );

            if (!isDuplicate) {
                console.log(form);

                dispatch(addToList({
                    form: updatedForm,
                    step: currentStep
                }));
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

    const addMoreHandler = () => {
        console.log(form);

        if (!form[requiredKey]) return;

        let updatedForm = { ...form };

        if (currentStep === "experience" && responsibility.trim()) {
            updatedForm = {
                ...form,
                responsibilities: [
                    ...form.responsibilities,
                    responsibility.trim()
                ]
            };
            setResponsibility("");
        }
        if (currentStep === "projects" && keyFeature.trim()) {
            updatedForm = {
                ...form,
                keyFeatures: [
                    ...form.keyFeatures,
                    keyFeature.trim()
                ]
            };
            setKeyFeature("");
        }

        dispatch(addToList({
            form: updatedForm,
            step: currentStep
        }))

        setForm(emptyForm)
    }

    const handleEdit = (index) => {
        const step = stepConfig[currentStep];
        if (!step) return;
        setForm(list[index])
        setEditingIndex(index);

    }

    const updateData = () => {
        let updatedForm = { ...form };

        if (currentStep === "experience" && responsibility.trim()) {
            updatedForm = {
                ...form,
                responsibilities: [
                    ...form.responsibilities,
                    responsibility.trim()
                ]
            };
            setResponsibility("");
        }
        if (currentStep === "projects" && keyFeature.trim()) {
            updatedForm = {
                ...form,
                keyFeatures: [
                    ...form.keyFeatures,
                    keyFeature.trim()
                ]
            };
            setKeyFeature("");
        }
        dispatch(updateList({
            index: editingIndex,
            data: updatedForm,
            step: currentStep
        }));
        setForm(emptyForm)
        setEditingIndex(null)
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

                {/* <div className='my-10 flex justify-center items-center'>
                    <label htmlFor="photo">
                        <input type="file" onChange={(e) => handlePhotoUpload(e)} id='photo' className='hidden' />
                        <div className='relative'>
                            <img className='rounded-full w-20 h-20' src={photoPreview ? photoPreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQqzBrUPyXpuWXPO2IbmBRIO-KMa29322Jow&s"} alt="" />

                        </div>
                    </label>
                </div> */}

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
                            setCurrentStep("education")
                        }}>Next</button>
                    </div>

                </div>
                }

                {/* Education */}
                {currentStep == "education" && <div>
                    <h2 className="font-semibold">Education</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="School" value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} />
                        <input className="border p-2" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
                        <input className="border p-2" placeholder="Field of Study" value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })} />
                        <input className="border p-2" placeholder="Grade" value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
                        <DatePicker
                            selected={educationForm.startDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setEducationForm({
                                    ...educationForm,
                                    startDate: formatted,
                                });
                            }}
                            dateFormat="MMM yyyy"        // 👈 Jan 2026 format
                            showMonthYearPicker          // 👈 only month + year
                            className="border p-2 rounded-md"
                            placeholderText="Select month & year"
                        />
                        <DatePicker
                            selected={educationForm.endDate}
                            onChange={(date) => {
                                const formatted = formatMonthYear(date);
                                setEducationForm({
                                    ...educationForm,
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
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more education</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            {editingIndex === null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button> :
                                <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>}
                        </div>
                    </div>
                    {education[0] && <div>
                        <div>
                            {
                                education.map((e, index) => (
                                    <div key={index} className="bg-blue-100 rounded p-5 mb-2">
                                        <div className="flex justify-between ">
                                            <div>
                                                <p className="font-semibold text-xs">
                                                    {`${e.degree} in ${e.fieldOfStudy}`}</p>
                                                <p className="font-semibold text-xs text-gray-800">{`${[e.school, e.city, e.country]
                                                    .filter(Boolean)
                                                    .join(", ")}`}</p>


                                            </div>
                                            <div>
                                                {e.startDate && <p className="font-semibold text-xs">
                                                    {`${e.startDate} - ${e.endDate || "Present"} `}
                                                </p>}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="px-3 py-1 text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                index,
                                                step: currentStep
                                            }))}>Delete</button>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
                </div>}


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
                            {experienceForm.responsibilities[0] && experienceForm.responsibilities.map((r, index) => (
                                <div className="flex gap-2 items-start mb-1" key={index}>
                                    <textarea key={index} className="border p-2 w-full" rows="1" value={r} onChange={(e) => {
                                        const updatedResponsibilities = [...experienceForm.responsibilities];
                                        updatedResponsibilities[index] = e.target.value;

                                        setExperienceForm({
                                            ...experienceForm,
                                            responsibilities: updatedResponsibilities
                                        });
                                    }} /><button type="button" className="px-3 py-1 hover:bg-gray-100 rounded text-lg bg-gray-100 text-blue-500 " onClick={() => {
          const updatedResponsibilities = experienceForm.responsibilities.filter(
            (_, i) => i !== index
          );

          setExperienceForm({
            ...experienceForm,
            responsibilities: updatedResponsibilities
          });
        }}>-</button>
                                </div>
                            ))}
                            <div className="flex gap-2 items-start">
                                <textarea className="border p-2 w-full" rows="1" placeholder="Responsibilities" value={responsibility} onChange={(e) => setResponsibility(e.target.value)} /><button type="button" className="px-3 py-1 hover:bg-gray-100 rounded text-lg bg-gray-100 text-blue-500" onClick={addresponsibilities}>+</button>
                            </div>
                            {editingIndex === null && <div className="bg-white pt-2 pb-5">
                                <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more experience</button>
                            </div>}
                        </div>
                        <div className="flex justify-between w-full my-2 py-4 rounded shadow">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            {editingIndex === null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button> :
                                <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>}
                        </div>
                    </div>
                    {experience[0] && <div>
                        <div>
                            {
                                experience.map((exp, index) => (
                                    <div key={index} className="bg-blue-100 rounded p-5 mb-2">
                                        <div className="flex justify-between ">
                                            <div>
                                                <p className="font-semibold text-xs">
                                                    {`${exp.jobTitle} at ${[exp.employer, exp.city, exp.country]
                                                        .filter(Boolean)
                                                        .join(", ")}`}
                                                </p>

                                            </div>
                                            <div>
                                                {exp.startDate && <p className="font-semibold text-xs">
                                                    {`${exp.startDate} - ${exp.endDate || "Present"} `}
                                                </p>}
                                            </div>
                                        </div>
                                        <div>
                                            {exp.responsibilities && (
                                                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside marker:text-[#5F53F5]">
                                                    {exp.responsibilities.map((point, i) => (
                                                        <li key={i}>{point}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="flex justify-end mt-2 gap-2 p-2">
                                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="px-3 py-1 text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                index,
                                                step: currentStep
                                            }))}>Delete</button>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
                </div>}

                {/* Projects */}
                {currentStep == "projects" && <div>
                    <h2 className="font-semibold">Projects</h2>
                    <div className="space-y-2">
                        <input className="border p-2 w-full" placeholder="Project Title" value={projectForm.projectTitle} onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })} />
                        {projectForm.keyFeatures[0] && projectForm.keyFeatures.map((kf,index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <textarea className="border p-2 w-full" rows="1"  value={kf} onChange={(e) => {
                                    const updatedKeyFeatures = [...projectForm.keyFeatures]
                                    updatedKeyFeatures[index] = e.target.value;
                                    setProjectForm({...projectForm,keyFeatures:updatedKeyFeatures})
                                }} /><button type="button" className="px-3 py-1 hover:bg-gray-100 rounded text-lg bg-gray-100 text-blue-500" onClick={() => {
                                    const updatedKeyFeatures = projectForm.keyFeatures.filter((_,i)=> i!=index)
                                    setProjectForm({...projectForm,keyFeatures:updatedKeyFeatures})
                                }
                                    
                                }>-</button>
                            </div>
                        ))}
                        <div className="flex gap-2 items-start">
                            <textarea className="border p-2 w-full" rows="1" placeholder="Key Features" value={keyFeature} onChange={(e) => setKeyFeature(e.target.value)} /><button type="button" className="px-3 py-1 hover:bg-gray-100 rounded text-lg bg-gray-100 text-blue-500" onClick={addKeyFeatures}>+</button>
                        </div>
                        <input className="border p-2 w-full" placeholder="Project URL" value={projectForm.projectUrl} onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })} />
                        <button type="button" className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more project</button>
                        <div className="flex justify-between">
                            <button type="button" className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            {editingIndex === null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button> :
                                <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>}
                        </div>
                    </div>
                    {projects[0] && <div>
                        <div>
                            {
                                projects.map((p, index) => (
                                    <div key={index} className="bg-blue-100 rounded p-5 mb-2">
                                        <div className="p-2">
                                            <div>
                                                <p className="font-semibold text-xs">
                                                    {p.projectTitle}</p>
                                                <div className="pb-2">
                                                    {p.keyFeatures && (
                                                        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside marker:text-[#5F53F5]">
                                                            {p.keyFeatures.map((point, i) => (
                                                                <li key={i}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>


                                            </div>
                                            {p.projectUrl && <div className="pb-2">
                                                <p className="font-semibold text-xs"> Live Demo :
                                                    <a href={p.projectUrl.startsWith("http") ? p.projectUrl : `https://${p.projectUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                                                        {p.projectUrl}
                                                    </a>
                                                </p>
                                            </div>}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="px-3 py-1 text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                index,
                                                step: currentStep
                                            }))}>Delete</button>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
                </div>}

                {/* Awards */}
                {currentStep == "awards" && <div>
                    <h2 className="font-semibold">Awards</h2>
                    <div className="py-8">
                        <div className="mb-2 flex gap-2">
                            <input className="border p-2" placeholder="Award Name" value={awardForm.awardName} onChange={(e) => setAwardForm({ ...awardForm, awardName: e.target.value })} />
                            <input className="border p-2" placeholder="Issuing Organisation" value={awardForm.issueingOrg} onChange={(e) => setAwardForm({ ...awardForm, issueingOrg: e.target.value })} />
                        </div>
                        <div className="mb-2">
                            <textarea className="border p-2 w-full" placeholder="Description" value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}></textarea>
                        </div>
                        <div className="mb-2 flex gap-2">
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
                        </div>
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more award</button>
                    </div>
                    <div className="justify-between">
                        <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                        {editingIndex === null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button> :
                                <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>}
                        {/* {editingIndex !== null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>
                            :
                            <button className="border px-4 py-2" onClick={() => {
                                if (awardForm.awardName.trim()) {
                                    dispatch(addToList({
                                        awardForm,
                                        step: currentStep
                                    }));
                                }

                                createCv();
                            }}>
                                Save CV
                            </button>
                        } */}

                    </div>
                    {awards[0] && <div>
                        <div>
                            {
                                awards.map((a, index) => (
                                    <div key={index} className="bg-blue-100 rounded p-5 mb-2">
                                        <div className="flex justify-between ">
                                            <div className="mb-2">
                                                <p className="font-semibold text-s">
                                                    {a.awardName} <span className=" text-xs">Issued By</span> {a.issueingOrg}</p>
                                            </div>
                                            <div>
                                                {a.issueingDate && <p className="font-semibold text-xs">
                                                    {`${a.issueingDate} - ${a.expirationDate || "Present"} `}
                                                </p>}
                                            </div>
                                        </div>
                                        <div className="text-[#666666] text-xs">
                                            {a.description}
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                            <button className="px-3 py-1 text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                index,
                                                step: currentStep
                                            }))}>Delete</button>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
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
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more skill</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            {editingIndex === null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button> :
                                <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>}
                        </div>
                    </div>
                    {skills[0] && <div>
                        <div className="m-10">
                            {
                                skills.map((s, index) => (
                                    <div key={index} className="bg-blue-100 rounded px-8 py-4 mb-4">
                                        <div className="py-2 grid grid-cols-2">
                                            <div className="p-2">
                                                <p className="font-semibold text-m">
                                                    {s.skill}</p>
                                                <div className="pb-2 flex">
                                                    <p className="text-m font-medium text-gray-600 mb-3">
                                                        Level — <span className="text-orange-500">{levels[s.level]}</span>
                                                    </p>

                                                </div>
                                            </div>
                                            <div className="ms-10 my-5">
                                                <button className="px-2 py-1 text-xs text-white bg-blue-500 me-2 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                                <button className="px-2 py-1 text-xs text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                    index,
                                                    step: currentStep
                                                }))}>Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
                </div>}

                {/* language */}
                {currentStep == "languages" && <div>
                    <h2 className="font-semibold p-10 text-lg">Languages</h2>
                    <div className="grid grid-cols-2 gap-4 w-200">
                        <input className="border p-2 h-10 w-50 rounded" placeholder="Language" value={languageForm.language} onChange={(e) => setLanguageForm({ ...languageForm, language: e.target.value })} />
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
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addMoreHandler}>Add one more skill</button>
                        <div className="flex justify-between">
                            <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                            {editingIndex !== null ? <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={updateData}>Update</button>
                            :
                            <button className="border px-4 py-2" onClick={() => {
                                console.log(form);
                                
                                if (form.requiredKey) {
                                    dispatch(addToList({
                                        form,
                                        step: currentStep
                                    }));
                                }

                                createCv();
                            }}>
                                Save CV
                            </button>
                        }
                        </div>
                    </div>
                    {languages[0] && <div>
                        <div className="m-10">
                            {
                                languages.map((l, index) => (
                                    <div key={index} className="bg-blue-100 rounded px-8 py-4 mb-4">
                                        <div className="py-2 grid grid-cols-2">
                                            <div className="p-2">
                                                <p className="font-semibold text-m">
                                                    {l.language}</p>
                                                <div className="pb-2 flex">
                                                    <p className="text-m font-medium text-gray-600 mb-3">
                                                        Level — <span className="text-orange-500">{levels[l.level]}</span>
                                                    </p>

                                                </div>
                                            </div>
                                            <div className="ms-10 my-5">
                                                <button className="px-2 py-1 text-xs text-white bg-blue-500 me-2 rounded" onClick={() => handleEdit(index)}>Edit</button>
                                                <button className="px-2 py-1 text-xs text-white bg-red-500 rounded" onClick={() => dispatch(removeFromList({
                                                    index,
                                                    step: currentStep
                                                }))}>Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                )
                                )
                            }
                        </div>

                    </div>}
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