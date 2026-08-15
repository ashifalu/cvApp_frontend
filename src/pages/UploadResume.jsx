import {resumeParseApi} from "../services/allApi.js";
import  {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch,} from "react-redux";
import {
    setEducation,
    addPersonalInfo,
    setProjects,
    setSkills,
    setExperience,
    setLanguages,
    setAwards, addProfessionalSummary
} from "../state/cvSlice.js";
import React from "react";

const UploadResume = () => {
    console.log(useParams())
    const temp_id = useParams().temp_id

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
        const [authMode, setAuthMode] = useState('login')
        const [token, setToken] = useState('')
        const [existingUser, setExistingUser] = useState({})


        useEffect(() => {

            if (sessionStorage.getItem("token")) {
                setToken(sessionStorage.getItem("token"))
                setExistingUser(JSON.parse(sessionStorage.getItem("existingUser")))
            }
            console.log(existingUser._id);
            console.log(token);
        }, [])

    const handleResume = async(e) => {
        const resume_file = e.target.files[0];
        console.log(resume_file)
        const formData = new FormData();
        formData.append('resume', resume_file);
        const result = await resumeParseApi(formData)
        if (result.status === 200) {
            const data = result.data.data

            const personalInfo = {
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                photo: "",
                linkedInUrl:data.linkedin,
                email: data.email,
                phoneCountryCode: "+1",
                phone: data.phone,
                country: data.country,
                city: data.city,
                nationality: data.nationality,
                portfolioUrl:data.portfolioUrl
            }
            dispatch(addPersonalInfo(personalInfo))
            if(data.professionalSummary){
                dispatch(addProfessionalSummary(data.professionalSummary))
            }
            if(data.education.length !== 0){
                dispatch(setEducation(data.education));
            }
            if(data.projects.length !== 0){
                dispatch(setProjects(data.projects));
            }
            if(data.skills.length !== 0){
                dispatch(setSkills(data.skills));
            }
            if(data.experience.length !== 0){
                dispatch(setExperience(data.experience));
            }
            if(data.languages.length !== 0){
                dispatch(setLanguages(data.languages));
            }
            if(data.awards.length !== 0){
                dispatch(setAwards(data.awards));
            }
            navigate(`/create-cv/${temp_id}`)
        }
        console.log(result)
    }


    return (
        <div>
            <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-4 sm:px-8 py-4 z-50">
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

            <div className="mesh-bg min-h-screen flex flex-col font-body-md text-on-surface">
                <main
                    className="flex-grow flex flex-col items-center justify-center px-4 sm:px-margin-mobile md:px-margin-desktop py-12 sm:py-section-gap">
                    <div className="w-full max-w-3xl">
                        <div className="text-center mb-8 sm:mb-12">
                            <h1 className="font-headline-lg text-3xl sm:text-headline-lg-mobile md:text-headline-lg text-on-surface mb-3 sm:mb-4">
                                Import Your Resume
                            </h1>
                            <p className="text-on-surface-variant text-sm sm:text-base max-w-lg mx-auto px-2 sm:px-0">
                                Upload your existing resume and convert it into a professional template in seconds.
                            </p>
                        </div>
                        <div
                            className="glass-card dashed-border p-6 sm:p-12 md:p-20 text-center relative group cursor-pointer hover:bg-surface-container-low transition-all duration-500 shadow-2xl shadow-primary/5 hover:shadow-primary/10 hover:-translate-y-1 rounded-2xl sm:rounded-3xl">
                            <input
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleResume(e)}  // ✅ here, not on the button
                            />
                            <div className="relative z-0">
                                <div
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary-fixed rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-5 sm:mb-8 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl md:text-5xl">cloud_upload</span>
                                </div>
                                <h2 className="font-headline-lg text-lg sm:text-2xl md:text-3xl text-on-surface mb-2 px-2">
                                    Drag and drop your resume here
                                </h2>
                                <p className="text-on-surface-variant mb-6 sm:mb-8 font-body-md text-sm sm:text-base">
                                    or choose a file from your device
                                </p>
                                <div className="inline-block">
                                    <button
                                        className="bg-primary text-on-primary px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-button text-sm sm:text-button hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25">
                                        Upload from device
                                    </button>
                                </div>
                                <div
                                    className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-outline font-label-bold uppercase tracking-widest text-[9px] sm:text-[10px]">
                                    <span>DOCX</span>
                                    <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                                    <span>PDF</span>
                                    <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                                    <span>HTML</span>
                                    <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                                    <span>TXT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer
                    className="bg-surface-container-lowest dark:bg-on-background w-full border-t border-outline-variant mt-auto">
                    <div
                        className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 sm:px-margin-desktop py-8 max-w-container-max mx-auto text-center md:text-left">
                        <div className="font-headline-lg text-lg sm:text-headline-lg text-primary dark:text-primary-fixed-dim">
                            ResumeAI
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-sm sm:text-body-md underline-offset-4 hover:underline"
                               href="#">Privacy Policy</a>
                            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-sm sm:text-body-md underline-offset-4 hover:underline"
                               href="#">Terms of Service</a>
                            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-sm sm:text-body-md underline-offset-4 hover:underline"
                               href="#">Cookies</a>
                            <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-sm sm:text-body-md underline-offset-4 hover:underline"
                               href="#">Contact Support</a>
                        </div>
                        <div className="text-on-surface-variant dark:text-surface-variant font-body-md text-xs sm:text-body-md">
                            © 2024 ResumeAI. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default UploadResume