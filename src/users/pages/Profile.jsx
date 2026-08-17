import React, { useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import ResumeCard from "../components/ResumeCard.jsx";
import { deleteResumeApi, getAllResumesApi, storeDataApi } from "../../services/allApi";
import {
    addPersonalInfo,
    addProfessionalSummary, setAwards,
    setEducation, setExperience, setLanguages,
    setProjects,
    setSkills
} from "../../state/cvSlice";
import Settings from "../components/Settings.jsx";

const Profile = () => {
    const [activeSection, setActiveSection] = useState(null)
    const [open, setOpen] = useState(false)
    const [token, setToken] = useState('')
    const [resumes, setResumes] = useState([])
    const [personalInfo, setPersonalInfo] = useState({})
    const [professionalSummary, setProfessionalSummary] = useState("")
    const [isDeleted, seIsDeleted] = useState(false)
    const [profilelistOpen, setProfilelistOpen] = useState(false)
    const [activeNav, setActiveNav] = useState('resumes')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const profileMenuRef = useRef(null)

    const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;
    const withUid = (arr) => (arr || []).map((item) => item._uid ? item : { ...item, _uid: uid() });
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const handleEditResume = (editData) => {
        console.log(editData)
        dispatch(addPersonalInfo(editData.previewData.personalInfo))
        if (editData.previewData.professionalSummary) {
            dispatch(addProfessionalSummary(editData.previewData.professionalSummary))
        }
        if (editData.previewData.education.length !== 0) {
            dispatch(setEducation(editData.previewData.education));
        }
        if (editData.previewData.projects.length !== 0) {
            dispatch(setProjects(editData.previewData.projects));
        }
        if (editData.previewData.skills.length !== 0) {
            dispatch(setSkills(editData.previewData.skills));
        }
        if (editData.previewData.experience.length !== 0) {
            dispatch(setExperience(editData.previewData.experience));
        }
        if (editData.previewData.languages.length !== 0) {
            dispatch(setLanguages(editData.previewData.languages));
        }
        if (editData.previewData.awards.length !== 0) {
            dispatch(setAwards(editData.previewData.awards));
        }
        navigate(`/create-cv/${editData.template}/${editData._id}`, {
            state: editData.theme
        });
    }


    const getResumes = async (tok) => {
        const reqHeader = { authorization: `Bearer ${tok}` };
        const result = await getAllResumesApi(reqHeader);
        if (result.status === 200) {
            setResumes(result.data.resumes);
        }
    };
    const reqHeader = { authorization: `Bearer ${token}` };

    const handleSave = async () => {
        setActiveSection(null)
        const reqHeader = { authorization: `Bearer ${token}` };
        const reqBody = { personalInfo, education, experience, projects, awards, skills, languages }
        const result = await storeDataApi(reqHeader, reqBody)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };


    const handleDownload = async (pdfUrl, title) => {
        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'resume'}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };


    const handleLogout = () => {
        sessionStorage.removeItem('existingUser')
        sessionStorage.removeItem('token')
        navigate('/')
    }

    const handleDelete = async (id) => {

            try {
                const result = await deleteResumeApi(id);
                if (result.status === 200) {
                    seIsDeleted(!isDeleted);
                    setOpenDeleteDialog(false)
                } else {
                    alert("Failed to delete resume");
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong while deleting the resume");
            }
    };

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            const tok = sessionStorage.getItem("token")
            setToken(tok)
            getResumes(tok)
        }
    }, [isDeleted])

    // ── Close the profile dropdown when clicking outside it ───────────
    useEffect(() => {
        if (!profilelistOpen) return
        const handleClickOutside = (e) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
                setProfilelistOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [profilelistOpen])

    return (
        // overflow-x-hidden here is load-bearing on mobile: if any child (e.g. an
        // unscaled A4-width resume preview inside ResumeCard) is wider than the
        // viewport, the document overflows horizontally. On iOS Safari that makes
        // `position: fixed` elements lay out against the wider layout viewport
        // instead of the visible one, which is why the profile icon looked like
        // it vanished (it was actually rendered off to the right, only visible
        // when pinch-zoomed out). Clipping overflow here keeps the fixed nav's
        // containing block honest.
        <div className="bg-background min-h-screen font-sans overflow-x-hidden">

            {/* NAVBAR */}
            <nav
                className="z-10 fixed top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-4 sm:px-8 py-4">
                <Link to={"/"}><div className=" w-[140px]  text-primary tracking-tighter text-2xl">
                    <img className="" src="/images/pro-cv-logo.svg"/>
                </div></Link>


                {/* Profile icon + dropdown, anchored as a single relative unit */}
                <div className="relative" ref={profileMenuRef}>

                    <button
                        className="text-black border text-[14px] border-black/5 hover:bg-surface flex items-center justify-center gap-2  shadow-sm font-bold px-3 sm:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                        onClick={() => setProfilelistOpen(o => !o)}
                        aria-haspopup="true"
                        aria-expanded={profilelistOpen}
                        aria-label="Toggle profile menu">
                        <span className="material-symbols-outlined">
                            {profilelistOpen ? 'close' : 'person'}
                        </span> My Account
                    </button>

                    {profilelistOpen && (
                        <div
                            className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-surface rounded-xl border border-outline-variant/30 shadow-lg flex flex-col py-2 z-50 origin-top-right animate-in">
                            <a className={`px-4 py-2 text-sm font-body-md hover:bg-primary/5 transition-colors ${activeNav === 'resumes' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                               href="#" onClick={(e) => { e.preventDefault(); setActiveNav('resumes'); setProfilelistOpen(false); }}>
                                Resumes
                            </a>
                            <a className={`px-4 py-2 text-sm font-body-md hover:bg-primary/5 transition-colors ${activeNav === 'settings' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                               href="#" onClick={(e) => { e.preventDefault(); setActiveNav('settings'); setProfilelistOpen(false); }}>
                                Settings
                            </a>
                            <a className="px-4 py-2 text-sm font-body-md text-on-surface-variant hover:bg-primary/5 transition-colors"
                               href="#" onClick={(e) => { e.preventDefault(); setProfilelistOpen(false); handleLogout(); }}>
                                Sign Out
                            </a>
                        </div>
                    )}
                </div>
            </nav>


            <div className="pt-24 sm:pt-28 w-full max-w-7xl mx-auto px-4 sm:px-6 gap-6">

                {activeNav === 'settings' ? (
                    <section className="space-y-6">
                        <Settings/>
                    </section>
                ) : (
                    <section className="space-y-6">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary">description</span>
                                <h2 className="font-headline-md text-md font-semibold sm:text-headline-md">My Resumes</h2>
                            </div>

                           <a href='/select-template'
                                    className="self-start sm:self-auto px-5 sm:px-6 py-2.5 font-label-md text-label-md bg-primary text-xs text-on-primary rounded-lg shadow-sm hover:scale-[0.98] transition-transform active:scale-95 whitespace-nowrap">
                                Create Resume
                            </a>
                        </div>

                        {resumes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 border border-dashed border-outline-variant/40 rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3">description</span>
                                <p className="font-body-md text-on-surface-variant mb-4">No resumes yet</p>
                                <button onClick={() => navigate('/select-template')}
                                        className="px-6 py-2.5 font-label-md text-label-md bg-primary text-xs text-on-primary rounded-lg shadow-sm hover:scale-[0.98] transition-transform active:scale-95">
                                    Create your first resume
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 xs:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                {[...resumes]
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((res) => (
                                        // min-w-0 lets this grid cell shrink below the intrinsic width of
                                        // its content (grid items default to min-width: auto, which would
                                        // otherwise let a fixed-width preview inside ResumeCard force the
                                        // whole column, and the page, wider than the viewport).
                                        <div key={res._id} className="min-w-0 overflow-hidden">
                                            <ResumeCard
                                                res={res}
                                                formatDate={formatDate}
                                                onEdit={handleEditResume}
                                                onDownload={handleDownload}
                                                onDelete={()=>{setOpenDeleteDialog(true)
                                                    setDeleteId(res._id)
                                            }}
                                            />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </section>
                )}

            </div>
            {openDeleteDialog&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div
                    className="flex flex-col items-center gap-4 bg-surface px-10 py-8 rounded-2xl shadow-2xl border border-outline-variant/30 max-w-[350px] ">
                    <div className="flex flex-col items-center justify-center text-center  ">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                            <span className="material-symbols-outlined text-red-600 text-[44px]">delete</span>
                        </div>
                        <h2 className="font-headline-lg text-[28px] text-on-surface mb-2">Confirm Deletion</h2>
                        <p className="font-body-md text-on-surface-variant mb-4">This resume will be permanently deleted. Do you want to continue?</p>
                        <div className='flex align-center w-full justify-center mt-2 gap-2'>
                            <button onClick={()=>setOpenDeleteDialog(false)} className="px-4 w-full py-1 rounded-lg border border-primary">No</button>
                            <button onClick={()=>handleDelete(deleteId)} className="px-4 w-full py-1 rounded-lg bg-red-600 text-white">Yes,Delete</button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Profile