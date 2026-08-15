import React, {useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import {Link, useNavigate, useParams} from "react-router-dom";
import UserAuth from "../users/components/UserAuth.jsx";

const ChooseMethode = () => {
    const temp_id = useParams().temp_id
    console.log(temp_id)
    const [open, setOpen] = useState(false)
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

    return (
        <div>
            <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-4 sm:px-8 pt-[0.6rem] pb-[0.6rem]">
                <a href={`/select-template`}><div className="font-display-lg text-black tracking-tighter text-2xl flex items-center"><span className="material-symbols-outlined">arrow_back</span></div></a>
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
            <main className="min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 sm:px-margin-mobile md:px-margin-desktop mt-16 sm:mt-20 py-12 sm:py-section-gap hero-gradient">

                <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-2xl">
                    <h1 className="font-semibold font-headline-lg text-2xl sm:text-headline-lg-mobile md:text-headline-lg text-on-background mb-3 sm:mb-4">
                        How would you like to build your resume?
                    </h1>
                    <p className="text-on-surface-variant text-sm sm:text-body-lg px-2 sm:px-0">
                        Choose the option that works best for you and create a job-winning resume in minutes.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
                    <Link to={`/upload-resume/${temp_id}`} className="w-full">
                        <button className="group relative flex flex-col items-center text-center w-full p-6 sm:p-8 md:p-12 bg-surface-container-lowest rounded-2xl sm:rounded-[32px] border border-outline-variant/30 shadow-[0px_20px_40px_rgba(107,56,212,0.06)] hover:shadow-[0px_30px_60px_rgba(107,56,212,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="mb-5 sm:mb-6 md:mb-8 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 relative h-[72px] sm:h-[112px]">
                                <span className="material-symbols-outlined text-[40px] sm:text-[52px] md:text-[64px] text-primary">cloud_upload</span>
                            </div>
                            <h3 className="font-headline-lg font-semibold text-lg sm:text-xl md:text-[24px] text-on-background mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                                I already have a resume
                            </h3>
                            <p className="text-on-surface-variant text-sm sm:text-body-md px-2 sm:px-4">
                                Upload your existing resume to improve content, enhance ATS compatibility, and refresh its design.
                            </p>
                            <div className="mt-5 sm:mt-6 md:mt-8 flex items-center gap-2 text-primary font-button text-sm sm:text-base">
                                <span>Get Started</span>
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </button>
                    </Link>

                    <a href={`/create-cv/${temp_id}`} className="w-full">
                        <button className="group relative flex flex-col items-center text-center w-full p-6 sm:p-8 md:p-12 bg-surface-container-lowest rounded-2xl sm:rounded-[32px] border border-outline-variant/30 shadow-[0px_20px_40px_rgba(180,19,109,0.06)] hover:shadow-[0px_30px_60px_rgba(180,19,109,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="mb-5 sm:mb-6 md:mb-8 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-500 relative h-[72px] sm:h-[112px] ">
                                <span className="material-symbols-outlined text-[40px] sm:text-[52px] md:text-[64px] text-secondary">edit_note</span>

                            </div>
                            <h3 className="font-semibold font-headline-lg text-lg sm:text-xl md:text-[24px] text-on-background mb-2 sm:mb-3 group-hover:text-secondary transition-colors">
                                Start from scratch
                            </h3>
                            <p className="text-on-surface-variant text-sm sm:text-body-md px-2 sm:px-4">
                                Build your resume step-by-step with guided assistance and professional suggestions.
                            </p>
                            <div className="mt-5 sm:mt-6 md:mt-8 flex items-center gap-2 text-secondary font-button text-sm sm:text-base">
                                <span>Get Started</span>
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </button>
                    </a>
                </div>
            </main>
            <UserAuth
                isOpen={open}
                mode={authMode}
                onClose={() => setOpen(false)}
            />
        </div>
    )
}

export default ChooseMethode