import React from 'react'
import Navbar from '../components/Navbar'
import {Link} from "react-router-dom";

const ChooseMethode = () => {
    return (
        <div>
            <div>
            <Navbar />
            </div>
            <main className="min-h-[calc(100vh-200px)] top-[200px] flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop mt-20 py-section-gap hero-gradient">
                
                <div className="text-center mb-16 max-w-2xl">
                    <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-4">
                        How will you make your resume?
                    </h1>
                    <p className="text-on-surface-variant text-body-lg">
                        Choose the best path to land your dream job. Our AI helps you no matter where you're starting from.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <Link to={'/upload-resume'}>
                        <button className="group relative flex flex-col items-center text-center p-12 bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 shadow-[0px_20px_40px_rgba(107,56,212,0.06)] hover:shadow-[0px_30px_60px_rgba(107,56,212,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="mb-8 p-6 rounded-3xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 relative">
                                <span className="material-symbols-outlined text-[64px] text-primary" >cloud_upload</span>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md">
                                    <span className="material-symbols-outlined text-primary text-[18px]" >colors_spark</span>
                                </div>
                            </div>
                            <h3 className="font-headline-lg text-[24px] text-on-background mb-3 group-hover:text-primary transition-colors">
                                I already have a resume
                            </h3>
                            <p className="text-on-surface-variant text-body-md px-4">
                                Upload your existing resume to make quick edits, optimize for ATS, and refresh your design instantly.
                            </p>
                            <div className="mt-8 flex items-center gap-2 text-primary font-button">
                                <span>Get Started</span>
                                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </button>

                    </Link>
                    <a href="/select-template">
                    <button className="group relative flex flex-col items-center text-center p-12 bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 shadow-[0px_20px_40px_rgba(180,19,109,0.06)] hover:shadow-[0px_30px_60px_rgba(180,19,109,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="mb-8 p-6 rounded-3xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-500 relative">
                            <span className="material-symbols-outlined text-[64px] text-secondary" >edit_note</span>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md text-secondary">
                                <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
                            </div>
                        </div>
                        <h3 className="font-headline-lg text-[24px] text-on-background mb-3 group-hover:text-secondary transition-colors">
                            Start from scratch
                        </h3>
                        <p className="text-on-surface-variant text-body-md px-4">
                            Our AI will guide you through creating a resume step-by-step, generating high-impact descriptions for you.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-secondary font-button">
                            <span>Get Started</span>
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </button>
                    </a>
                </div>
            </main>
        </div>
    )
}

export default ChooseMethode