import { useState } from "react"
import UserAuth from "../components/UserAuth"


const CreateCv = () => {

    const [open, setOpen] = useState(false)
    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        role: "",
        photo: "",
        professionalSummary: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        nationality: "",
        language: ""
    })
    const [education, setEducation] = useState([])
    const [educationForm, setEducationForm] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startDate: "",
        endDate: "",
        country: "",
        city: ""
    })
    const [experience, setExperience] = useState([])
    const [experienceForm, setExperienceForm] = useState({
        jobTitle: "",
        employer: "",
        startDate: "",
        endDate: "",
        country: "",
        city: ""
    })
    const [skills, setSkills] = useState([])
    const [skillForm, setSkillForm] = useState({
        skill: "",
        level: "",
    })
    const [projects, setProjects] = useState([])
    const [projectForm, setProjectForm] = useState({
        projectTitle: "",
        projectDescription: "",
        projectUrl: ""
    })
    const [awards, setAwards] = useState([])
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
            setList: setExperience,
            emptyForm: {
                jobTitle: "",
                employer: "",
                startDate: "",
                endDate: "",
                city: "",
                country: ""
            },
            requiredKey: "jobTitle"
        },

        education: {
            form: educationForm,
            setForm: setEducationForm,
            list: education,
            setList: setEducation,
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
            setList: setProjects,
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
            setList: setSkills,
            emptyForm: {
                skill: "",
                level: ""
            },
            requiredKey: "skill"
        },
        awards: {
            form: awardForm,
            setForm: setAwardForm,
            list: awards,
            setList: setAwards,
            emptyForm: {
                awardName: "",
                issueingOrg: "",
                issueingDate: "",
                expirationDate: "",
            },
            requiredKey: "awardName"
        }

    };

    const steps = ["experience", "education", "projects", "skills","awards"];

    
    const goToNextStep = () => {
        const currentIndex = steps.indexOf(currentStep);
        if(currentIndex < steps.length - 1){
            setCurrentStep(steps[currentIndex+1]);
        }
    }

    const handleNext = () => {
        const step = stepConfig[currentStep];
        if(!step) return;
        const{form, setForm, emptyForm, list, setList, requiredKey} = step;

        if(form[requiredKey]){
        const isDuplicate = list.some(
            (item)=>{JSON.stringify(item) === JSON.stringify(form)}
        )
        if(!isDuplicate){
            setList(prev => [...prev,form])
        }
        setForm(emptyForm)
    }
    goToNextStep();
    };

    const createCv = () => {
        setAwards((prev) =>[...prev,awardForm])
        setOpen(true)
        console.log(experience);
        console.log(education);
        console.log(skills);
        console.log(awards);
        console.log(projects);





    }

    const addExperience = () => {
        setExperience([...experience, experienceForm])
        setExperienceForm({
            jobTitle: "",
            employer: "",
            startDate: "",
            endDate: "",
            country: "",
            city: ""
        })
    }

    const addEducation = () => {
        setEducation([...education, educationForm]);
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

    const addSkills = () => {
        setSkills([...skills, skillForm]);
        setSkillForm({
            skill: "",
            level: "",
        })
    }

    const addProjects = () => {
        setProjects([...projects, projectForm]);
        setProjectForm({
            projectTitle: "",
            projectDescription: "",
            projectUrl: ""
        })
    }

    const addAwards = () => {
        setAwards([...awards, awardForm]);
        setAwardForm({
            awardName: "",
            issueingOrg: "",
            issueingDate: "",
            expirationDate: "",
        })
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
                        <input className="border p-2" placeholder="Email" onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                        <input className="border p-2" placeholder="Phone" onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                        <input className="border p-2" placeholder="Country" onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })} />
                        <input className="border p-2" placeholder="City" onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })} />
                        <input className="border p-2" placeholder="Nationality" onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })} />
                        <input className="border p-2" placeholder="Language" onChange={(e) => setPersonalInfo({ ...personalInfo, language: e.target.value })} />
                        <div className="flex justify-end">
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={()=>setCurrentStep("professionalSummary")}>Next</button>
                        </div>
                    </div>

                </div>}
                {currentStep == "professionalSummary" && <div>
                    {/* Professional Summary */}
                    <h2 className="font-semibold">Professional Summary</h2>
                    <textarea className="border p-2 w-full" rows="3" placeholder="Professional Summary" onChange={(e) => setPersonalInfo({ ...personalInfo, professionalSummary: e.target.value })} />
                    <div className="flex justify-end">
                        <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={()=>setCurrentStep("experience")}>Next</button>
                    </div>
                </div>
                }
                {/* Experience */}
                {currentStep == "experience" && <div>
                    <h2 className="font-semibold">Experience</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="Job Title" value={experienceForm.jobTitle} onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })} />
                        <input className="border p-2" placeholder="Employer" value={experienceForm.employer} onChange={(e) => setExperienceForm({ ...experienceForm, employer: e.target.value })} />
                        <input className="border p-2" placeholder="Start Date" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
                        <input className="border p-2" placeholder="End Date" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} />
                        <input className="border p-2" placeholder="Country" value={experienceForm.country} onChange={(e) => setExperienceForm({ ...experienceForm, country: e.target.value })} />
                        <input className="border p-2" placeholder="City" value={experienceForm.city} onChange={(e) => setExperienceForm({ ...experienceForm, city: e.target.value })} />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addExperience}>Add one more experience</button>
                        <div className="flex justify-end">
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
                        <input className="border p-2" placeholder="Start Date" value={educationForm.startDate} onChange={(e) => setEducationForm({ ...educationForm, startDate: e.target.value })} />
                        <input className="border p-2" placeholder="End Date" value={educationForm.endDate} onChange={(e) => setEducationForm({ ...educationForm, endDate: e.target.value })} />
                        <input className="border p-2" placeholder="Country" value={educationForm.country} onChange={(e) => setEducationForm({ ...educationForm, country: e.target.value })} />
                        <input className="border p-2" placeholder="City" value={educationForm.city} onChange={(e) => setEducationForm({ ...educationForm, city: e.target.value })} />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addEducation}>Add one more education</button>
                        <div className="flex justify-end">
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
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addProjects}>Add one more project</button>
                        <div className="flex justify-end">
                            <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={handleNext}>Next</button>
                        </div>
                    </div>
                </div>}

                {/* Skills */}
                {currentStep == "skills" && <div>
                    <h2 className="font-semibold">Skills</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="border p-2" placeholder="Skill" value={skillForm.skill} onChange={(e) => setSkillForm({ ...skillForm, skill: e.target.value })} />
                        <input className="border p-2" placeholder="Level" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addSkills}>Add one more skill</button>
                        <div className="flex justify-end">
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
                        <input className="border p-2" placeholder="Issuing Date" value={awardForm.issueingDate} onChange={(e) => setAwardForm({ ...awardForm, issueingDate: e.target.value })} />
                        <input className="border p-2" placeholder="Expiration Date" value={awardForm.expirationDate} onChange={(e) => setAwardForm({ ...awardForm, expirationDate: e.target.value })} />
                        <button className="px-5 py-1 hover:bg-gray-100 rounded text-sm text-blue-500" onClick={addAwards}>Add one more award</button>
                    </div>
                    <button className="border px-4 py-2" onClick={createCv}>
                        Save CV
                    </button>
                </div>}

            </div>
            <div className="w-1/2 p-10 text-center">
                {photoPreview && <div className="p-10">
                    <img src={photoPreview} alt="" className="w-20 h-20" />
                </div>}
                <div className="p-5">
                    <p>{personalInfo.firstName}</p>
                    <p>{personalInfo.lastName}</p>
                    <p>{personalInfo.role}</p>
                    <p>{personalInfo.professionalSummary}</p>
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.country}</p>
                    <p>{personalInfo.city}</p>

                </div>
                <div className="p-5">
                    <p>{experienceForm.jobTitle}</p>
                    <p>{experienceForm.employer}</p>
                    <p>{experienceForm.startDate}</p>
                    <p>{experienceForm.endDate}</p>

                </div>
                <div className="p-5">
                    {educationForm.school}
                    {educationForm.degree}
                    {educationForm.startDate}
                    {educationForm.endDate}

                </div>
                <div className="p-5">
                    {skillForm.skill}
                    {skillForm.level}

                </div>
                <div className="p-5">
                    {awardForm.awardName}
                    {awardForm.issueingOrg}
                    {awardForm.issueingDate}
                    {awardForm.expirationDate}

                </div>
            </div>
            <UserAuth
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </div>
    )
}

export default CreateCv