import {resumeParseApi} from "../services/allApi.js";

const UploadResume = () => {

    const handleResume = async(e) => {
        const resume_file = e.target.files[0];
        const formData = new FormData();
        formData.append('resume', resume_file);
        const result = await resumeParseApi(formData)
        console.log(result)
    }


    return (
        <div>
            <div className="mesh-bg min-h-screen flex flex-col font-body-md text-on-surface">
            <main
                className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-section-gap">
                <div className="w-full max-w-3xl">
                    <div className="mb-8 animate-fade-in">
                        <a className="inline-flex items-center text-primary font-button text-button group" href="#">
                            <span
                                className="material-symbols-outlined mr-2 transition-transform group-hover:-translate-x-1">arrow_back</span>
                            Go Back
                        </a>
                    </div>
                    <div className="text-center mb-12">
                        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Import
                            Your Resume</h1>
                        <p className="text-on-surface-variant max-w-lg mx-auto">Let our high-performance AI handle the
                            heavy lifting. parse your existing data into a professional template in seconds.</p>
                    </div>
                    <div
                        className="glass-card dashed-border p-12 md:p-20 text-center relative group cursor-pointer hover:bg-surface-container-low transition-all duration-500 shadow-2xl shadow-primary/5">
                        <input
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleResume(e)}  // ✅ here, not on the button
                        />
                        <div className="relative z-0">
                            <div
                                className="w-24 h-24 bg-primary-fixed rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                            </div>
                            <h2 className="font-headline-lg text-2xl md:text-3xl text-on-surface mb-2">Drag and drop
                                your resume here</h2>
                            <p className="text-on-surface-variant mb-8 font-body-md">or choose a file from your
                                computer</p>
                            <div className="inline-block">
                                <button
                                    className="bg-primary text-on-primary px-10 py-4 rounded-xl font-button text-button hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25">
                                    Upload from device
                                </button>
                            </div>
                            <div
                                className="mt-8 flex items-center justify-center gap-4 text-outline font-label-bold uppercase tracking-widest text-[10px]">
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
                    <div
                        className="mt-12 flex flex-col md:flex-row items-center gap-6 bg-primary-container/10 p-6 rounded-2xl border border-primary-container/20">
                        <div
                            className="flex-shrink-0 w-12 h-12 bg-primary-container flex items-center justify-center rounded-xl shadow-lg shadow-primary/10">
                            <span className="material-symbols-outlined text-on-primary-container">bolt</span>
                        </div>
                        <div>
                            <span
                                className="font-label-bold text-primary uppercase text-[12px] block mb-1">Pro Tip</span>
                            <p className="text-on-surface-variant font-body-md">Our AI parses your existing resume in
                                seconds to save you time. We automatically extract skills, experience, and contact
                                details with 99% accuracy.</p>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <button
                            className="text-on-surface-variant hover:text-primary font-button text-button transition-colors underline underline-offset-4">
                            Choose another method
                        </button>
                    </div>
                </div>
            </main>
            <footer
                className="bg-surface-container-lowest dark:bg-on-background w-full border-t border-outline-variant mt-auto">
                <div
                    className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-8 max-w-container-max mx-auto">
                    <div className="font-headline-lg text-primary dark:text-primary-fixed-dim mb-4 md:mb-0">ResumeAI
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
                        <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-body-md underline-offset-4 hover:underline"
                           href="#">Privacy Policy</a>
                        <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-body-md underline-offset-4 hover:underline"
                           href="#">Terms of Service</a>
                        <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-body-md underline-offset-4 hover:underline"
                           href="#">Cookies</a>
                        <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors font-body-md text-body-md underline-offset-4 hover:underline"
                           href="#">Contact Support</a>
                    </div>
                    <div className="text-on-surface-variant dark:text-surface-variant font-body-md text-body-md">
                        © 2024 ResumeAI. All rights reserved.
                    </div>
                </div>
            </footer>
            </div>
        </div>
    )
}

export default UploadResume