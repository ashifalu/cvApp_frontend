import { useState } from "react"
import Register from "../components/Register"


const CreateCv = () => {
    const [open, setOpen] = useState(false)
    const [personalInfo,setPersonalInfo] = useState({
            firstName:"",
            lastName:"",
            role:"",
            photo:"",
            professionalSummary:"",
            email:"",
            phone:"",
            country:"",
            city:"",
            nationality:"",
            language:""
        })
        const [education,setEducation] = useState({
            school:"",
            degree:"",
            fieldOfStudy:"",
            grade:"",
            startDate:"",
            endDate:"",
            country:"",
            city:""
        })
        const [experiance,setExperiance] = useState({
            jobTitle:"",
            employer:"",
            startDate:"",
            endDate:"",
            country:"",
            city:""
        })
        const [skills,setSkills] = useState({
            skill:"",
            level:"",
        })
        const [projects,setProjects] = useState({
            projectTitle:"",
            projectDescription:"",
            projectUrl:""
        })
        const [awards,setAwards] = useState({
            awardName:"",
            issueingOrg:"",
            issueingDate:"",
            expirationDate:"",
        })
        const [photoPreview,setPhotoPreview] = useState("")
    
        const handlePhotoUpload = (e) => {
            setPersonalInfo({ ...personalInfo, photo: e.target.files[0] })
        let url = URL.createObjectURL(e.target.files[0])
        console.log(url);
    
        setPhotoPreview(url)
        }
    
        const createCv = ()=>{
            setOpen(true)
        }
    
  return (
    <div className="grid grid-cols-2">
    
    <div className="max-w-3xl mx-auto p-4 space-y-6">

        <div className='my-10 flex justify-center items-center'>
                      <label htmlFor="photo">
                        <input type="file" onChange={(e) => handlePhotoUpload(e)} id='photo' className='hidden' />
                        <div className='relative'>
                          <img className='rounded-full w-20 h-20' src={photoPreview? photoPreview : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQqzBrUPyXpuWXPO2IbmBRIO-KMa29322Jow&s"} alt="" />
                         
                        </div>
                      </label>
                    </div>

      {/* Basic Info */}
      <h2 className="font-semibold">Basic Information</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="First Name" required onChange={(e)=>setPersonalInfo({...personalInfo,firstName: e.target.value})} />
        <input className="border p-2" placeholder="Last Name" onChange={(e)=>setPersonalInfo({...personalInfo,lastName: e.target.value})}/>
        <input className="border p-2" placeholder="Role" onChange={(e)=>setPersonalInfo({...personalInfo,role: e.target.value})}/>
        <input className="border p-2" placeholder="Email" onChange={(e)=>setPersonalInfo({...personalInfo,email: e.target.value})} />
        <input className="border p-2" placeholder="Phone" onChange={(e)=>setPersonalInfo({...personalInfo,phone: e.target.value})} />
        <input className="border p-2" placeholder="Country" onChange={(e)=>setPersonalInfo({...personalInfo,country: e.target.value})} />
        <input className="border p-2" placeholder="City" onChange={(e)=>setPersonalInfo({...personalInfo,city: e.target.value})} />
        <input className="border p-2" placeholder="Nationality" onChange={(e)=>setPersonalInfo({...personalInfo,nationality: e.target.value})} />
        <input className="border p-2" placeholder="Language" onChange={(e)=>setPersonalInfo({...personalInfo,language: e.target.value})} />
      </div>

      {/* Professional Summary */}
      <h2 className="font-semibold">Professional Summary</h2>
      <textarea className="border p-2 w-full" rows="3" placeholder="Professional Summary" onChange={(e)=>setPersonalInfo({...personalInfo,professionalSummary: e.target.value})} />

      {/* Experience */}
      <h2 className="font-semibold">Experience</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="Job Title" onChange={(e)=>setExperiance({...experiance,jobTitle: e.target.value})} />
        <input className="border p-2" placeholder="Employer" onChange={(e)=>setExperiance({...experiance,employer: e.target.value})} />
        <input className="border p-2" placeholder="Start Date" onChange={(e)=>setExperiance({...experiance,startDate: e.target.value})} />
        <input className="border p-2" placeholder="End Date" onChange={(e)=>setExperiance({...experiance,endDate: e.target.value})} />
        <input className="border p-2" placeholder="Country" onChange={(e)=>setExperiance({...experiance,country: e.target.value})} />
        <input className="border p-2" placeholder="City" onChange={(e)=>setExperiance({...experiance,city: e.target.value})} />
      </div>

      {/* Education */}
      <h2 className="font-semibold">Education</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="School" onChange={(e)=>setEducation({...education,school: e.target.value})} />
        <input className="border p-2" placeholder="Degree" onChange={(e)=>setEducation({...education,degree: e.target.value})} />
        <input className="border p-2" placeholder="Field of Study" onChange={(e)=>setEducation({...education,fieldOfStudy: e.target.value})} />
        <input className="border p-2" placeholder="Grade" onChange={(e)=>setEducation({...education,grade: e.target.value})} />
        <input className="border p-2" placeholder="Start Date" onChange={(e)=>setEducation({...education,startDate: e.target.value})} />
        <input className="border p-2" placeholder="End Date" onChange={(e)=>setEducation({...education,endDate: e.target.value})} />
        <input className="border p-2" placeholder="Country" onChange={(e)=>setEducation({...education,country: e.target.value})} />
        <input className="border p-2" placeholder="City" onChange={(e)=>setEducation({...education,city: e.target.value})} />
      </div>

      {/* Skills */}
      <h2 className="font-semibold">Skills</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="Skill" onChange={(e)=>setSkills({...skills,skill: e.target.value})} />
        <input className="border p-2" placeholder="Level" onChange={(e)=>setSkills({...skills,level: e.target.value})} />
      </div>

      {/* Projects */}
      <h2 className="font-semibold">Projects</h2>
      <div className="space-y-2">
        <input className="border p-2 w-full" placeholder="Project Title" onChange={(e)=>setProjects({...projects,projectTitle: e.target.value})} />
        <textarea className="border p-2 w-full" rows="2" placeholder="Project Description" onChange={(e)=>setProjects({...projects,projectDescription: e.target.value})} />
        <input className="border p-2 w-full" placeholder="Project URL" onChange={(e)=>setProjects({...projects,projectUrl: e.target.value})} />
      </div>

      {/* Awards */}
      <h2 className="font-semibold">Awards</h2>
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2" placeholder="Award Name" onChange={(e)=>setAwards({...awards,awardName: e.target.value})} />
        <input className="border p-2" placeholder="Issuing Organisation" onChange={(e)=>setAwards({...awards,issueingOrg: e.target.value})} />
        <input className="border p-2" placeholder="Issuing Date" onChange={(e)=>setAwards({...awards,issueingDate: e.target.value})} />
        <input className="border p-2" placeholder="Expiration Date" onChange={(e)=>setAwards({...awards,expirationDate: e.target.value})} />
      </div>

      <button className="border px-4 py-2" onClick={createCv}>
        Save CV
      </button>

    </div>
        <div className="w-1/2 p-10 text-center">
        {photoPreview && <div className="p-10">
            <img src={photoPreview} alt="" className="w-20 h-20"/>
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
                <p>{experiance.jobTitle}</p>
                <p>{experiance.employer}</p>
                <p>{experiance.startDate}</p>
                <p>{experiance.endDate}</p>
                
            </div>
            <div className="p-5">
                {education.school}
                {education.degree}
                {education.startDate}
                {education.endDate}

            </div>
            <div className="p-5">
                {skills.skill}
                {skills.level}
                
            </div>
            <div className="p-5">
                {awards.awardName}
                {awards.issueingOrg}
                {awards.issueingDate}
                {awards.expirationDate}
                
            </div>
        </div>
        <Register
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

export default CreateCv