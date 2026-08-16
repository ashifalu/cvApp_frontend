import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { templates } from '../constants/templates.js'
import Preview from './createCV/components/Preview.jsx'
import UserAuth from "../users/components/UserAuth.jsx";

const TemplateList = () => {
    const temp_id = useParams().temp_id
    const [selectedTemp, setSelectedTemp] = useState(temp_id ? temp_id : "1")
    const [selectedTheme, setSelectedTheme] = useState({})
    const [token, setToken] = useState('')
    const [existingUser, setExistingUser] = useState({})
    const [open, setOpen] = useState(false)
    const [authMode, setAuthMode] = useState('login')
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [style, setStyle] = useState("all")
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const [mobileTemplatesOpen, setMobileTemplatesOpen] = useState(false)

    const navigate = useNavigate()

    const personalInfo = useSelector((state) => state.cv.cvData.personalInfo)
    const professionalSummary = useSelector((state) => state.cv.cvData.professionalSummary)
    const experience = useSelector((state) => state.cv.cvData.experience)
    const education = useSelector((state) => state.cv.cvData.education)
    const skills = useSelector((state) => state.cv.cvData.skills)
    const languages = useSelector((state) => state.cv.cvData.languages)
    const projects = useSelector((state) => state.cv.cvData.projects)
    const awards = useSelector((state) => state.cv.cvData.awards)
    const certifications = useSelector((state) => state.cv.cvData.certifications)

    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience, education,
        skills, languages, projects, awards, certifications
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards, certifications])

    const A4_W = 794
    const A4_H = 1123

    // ── Responsive A4 preview scaling ──────────────────────────────
    // Instead of a hardcoded 0.92 scale (which only looks right on wide
    // desktop viewports), measure the actual available width and scale
    // the resume to fit it, capping at 0.92 so it never looks oversized
    // on large screens.
    const previewWrapRef = useRef(null)
    const [scale, setScale] = useState(0.92)

    useEffect(() => {
        const el = previewWrapRef.current
        if (!el) return

        const updateScale = () => {
            const availableWidth = el.clientWidth
            if (!availableWidth) return
            const next = Math.min(availableWidth / A4_W, 0.92)
            setScale(next > 0.15 ? next : 0.15)
        }

        updateScale()
        const ro = new ResizeObserver(updateScale)
        ro.observe(el)
        window.addEventListener('resize', updateScale)
        return () => {
            ro.disconnect()
            window.removeEventListener('resize', updateScale)
        }
    }, [])

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            setToken(sessionStorage.getItem("token"))
            setExistingUser(JSON.parse(sessionStorage.getItem("existingUser")))
        }
    }, [])

    const activeTemplate = templates[selectedTemp - 1]

    return (
        <>
            {personalInfo.firstName ?
                <div className="min-h-screen bg-background flex flex-col">
                    {/* ── Header ──────────────────────────────────────────────────── */}
                    <nav className="fixed z-10 top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-4 sm:px-8 pt-[0.6rem] pb-[0.6rem]">
                        <Link to={"/"}><div className="font-display-lg text-black tracking-tighter text-2xl flex item-center"><span className="material-symbols-outlined">arrow_back</span></div></Link>
                        <div className="flex gap-4 items-center">
                            {!token? <button className=" text-black font-bold px-3 sm:px-6 border border-black/5 hover:bg-surface transition-all shadow-sm py-2 rounded-lg duration-300"
                                             onClick={() => {
                                                 setOpen(true);
                                                 setAuthMode('login')
                                             }}>Sign In</button>
                                :
                                <button className="text-black border text-[14px] border-black/5 hover:bg-surface flex items-center justify-center gap-2  shadow-sm font-bold px-3 sm:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                        onClick={() => { navigate(`/user-profile/${existingUser._id}`);}}>
                                    <span className="material-symbols-outlined  ">person</span> My Account

                                </button>
                            }
                            {/*<button onClick={()=>navigate("/select-template")} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300" >Create Resume</button>*/}
                        </div>
                    </nav>

                    <div className="mt-16 min-h-[calc(100vh-64px)] flex flex-col lg:flex-row flex-1  overflow-hidden">

                        {/* ── Template grid ────────────────────────────────────────── */}
                        <div
                            className={`w-full lg:w-[400px] xl:w-[460px] border-b lg:border-b-0 lg:border-r border-outline-variant/30 bg-white shrink-0 lg:overflow-y-auto no-scrollbar
                            ${mobileTemplatesOpen ? 'max-h-[60vh] overflow-y-auto' : 'max-h-[250px] overflow-hidden'} lg:max-h-none`}>
                            <div className="flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
                                <h1 className="font-headline-md text-xl sm:text-2xl font-bold mb-0 lg:mb-6">Templates</h1>
                                <button
                                    onClick={() => setMobileTemplatesOpen(o => !o)}
                                    className="lg:hidden flex items-center gap-1 text-sm text-primary font-medium">
                                    {mobileTemplatesOpen ? 'Collapse' : 'Browse all'}
                                    <span className="material-symbols-outlined text-lg">
                                        {mobileTemplatesOpen ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-4 sm:gap-6 lg:mx-10">
                                    {templates.map((t) => (
                                        <div className="group w-full max-w-[150px] mx-auto relative cursor-pointer" key={t.id}>
                                            <div onClick={() => setSelectedTemp(t.id)}
                                                 className={`${selectedTemp == t.id
                                                     ? `aspect-a4 bg-surface-container-low rounded overflow-hidden group-hover:border-primary transition-all ring-0 group-hover:ring-2 ring-primary/20 border border-primary`
                                                     : `aspect-a4 bg-surface-container-low rounded overflow-hidden group-hover:border-primary transition-all ring-0 group-hover:ring-2 ring-primary/20 border border-outline-variant/30`}`}>
                                                <img alt={t.name}
                                                     className="w-full h-full object-cover grayscale-[0.2]"
                                                     src={t.img}/>
                                                {selectedTemp == t.id && <div
                                                    className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5 w-[32px] h-[32px] flex items-center justify-center ">
                                                    <span
                                                        className="material-symbols-outlined text-sm font-bold">check</span>
                                                </div>}
                                            </div>
                                            <p className="mt-2 text-xs font-medium text-on-surface-variant truncate">{t.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Preview ──────────────────────────────────────────────── */}
                        <div
                            className="flex-1 bg-surface-container-low relative overflow-y-auto p-4 sm:p-8 lg:p-12 flex flex-col items-center no-scrollbar">
                            <div className="w-full max-w-[800px] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex gap-3 flex-wrap justify-center">
                                        {(activeTemplate?.themes || []).map((t, idx) => (
                                            <button
                                                key={idx}
                                                style={{
                                                    backgroundColor: t.primary,
                                                    ...(selectedTheme === t && { border: `3px solid ${t.secondary}` }),
                                                }}
                                                className="w-7 h-7 rounded-full hover:border-2 shrink-0"
                                                onClick={() => setSelectedTheme(t)}>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                                    <button onClick={() => navigate(`/create-cv/${selectedTemp}`, { state: selectedTheme })}
                                            className="flex-1 sm:flex-none bg-primary text-white font-bold px-6 py-2 rounded-lg text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all">
                                        Use Template
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex flex-col items-center" ref={previewWrapRef}>
                                <div style={{ width: A4_W * scale, overflow: "hidden" }}>
                                    <div className="shadow-lg" style={{
                                        width: A4_W,
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top left",
                                        marginBottom: -(A4_H * (1 - scale)),
                                        marginRight: -(A4_W * (1 - scale)),
                                        pointerEvents: "none"
                                    }}>
                                        <Preview previewData={previewData} temp={selectedTemp}
                                                 theme={selectedTheme} onPageCount={setPageCount} currentPage={currentPage} />
                                    </div>

                                    {pageCount > 1 && (
                                        <div className="flex justify-center pt-2">
                                            <div className="rounded-full h-8 w-auto px-4 flex items-center justify-center bg-on-surface gap-4 mt-2">
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                                    disabled={currentPage === 0}
                                                    className="w-6 h-6 flex items-center justify-center text-white rounded-full disabled:opacity-30 hover:text-surface-variant transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                                </button>

                                                <span className="text-surface text-xs font-medium whitespace-nowrap">
                                                    {currentPage + 1} / {pageCount}
                                                </span>

                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
                                                    disabled={currentPage === pageCount - 1}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white disabled:opacity-30 hover:text-surface-variant transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                :

                <div className="bg-surface text-on-surface min-h-screen">
                    <nav className="fixed z-10 top-0 left-1/2 -translate-x-1/2 w-full   border border-black/5 bg-white/70 backdrop-blur-[24px] shadow-lg flex justify-between items-center px-4 sm:px-8 pt-[0.6rem] pb-[0.6rem]">
                        <Link to={"/"}><div className="font-display-lg text-black tracking-tighter text-2xl flex item-center"><span className="material-symbols-outlined">arrow_back</span></div></Link>
                        <div className="flex gap-4 items-center">
                            {!token? <button className=" text-black font-bold px-3 sm:px-6 border border-black/5 hover:bg-surface transition-all shadow-sm py-2 rounded-lg duration-300"
                                             onClick={() => {
                                                 setOpen(true);
                                                 setAuthMode('login')
                                             }}>Sign In</button>
                                :
                                <button className=" text-black border text-[14px] border-black/5 hover:bg-surface flex items-center justify-center gap-2  shadow-sm font-bold px-3 sm:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                        onClick={() => { navigate(`/user-profile/${existingUser._id}`);}}>
                                    <span className="material-symbols-outlined  ">person</span> My Account

                                </button>
                            }
                            {/*<button onClick={()=>navigate("/select-template")} className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300" >Create Resume</button>*/}
                        </div>
                    </nav>


                    <main className="pt-24   sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                        <header className="text-center mb-8 sm:mb-12">
                            <h1 className="font-display-lg text-3xl sm:text-4xl md:text-display-lg text-on-surface mb-3 sm:mb-4">
                                Start with a Template
                            </h1>
                            <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant max-w-2xl mx-auto px-2">
                                Pick a resume template and customize it to create your professional CV.
                            </p>
                        </header>

                        <div>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'ats', label: 'ATS Friendly'},
                                    { key: 'executive', label: 'Executive' },
                                    { key: 'modern', label: 'Modern' },
                                ].map((s) => (
                                    <button key={s.key} onClick={() => setStyle(s.key)}
                                            className={`${style === s.key
                                                ? `bg-primary px-3 py-1  rounded-lg text-on-primary font-label-md text-xs sm:text-label-md shadow-md transition-all`
                                                : `px-3 py-1 rounded-lg bg-surface-container-lowest text-on-surface-variant border border-outline-variant font-label-md text-xs sm:text-label-md hover:bg-primary-fixed/20 transition-all`}`}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
                                {(style === "all" ? templates : templates.filter(temps => temps.style === style)).map((temp) => (
                                    <div key={temp.id}
                                         className={`${selectedTemp === temp.id ?`border-primary  md:border-gray-100 group relative resume-preview-hover rounded-xl overflow-hidden bg-white border-2  md:hover:border-primary  transition-all ring-0 hover:ring-2 ring-primary/20 shadow-sm duration-500 hover:shadow-2xl hover:-translate-y-2`:`group relative resume-preview-hover rounded-xl overflow-hidden bg-white border-2 md:hover:border-primary   transition-all ring-0 hover:ring-2 ring-primary/20 shadow-sm duration-500 hover:shadow-2xl hover:-translate-y-2`}`}>
                                        <div onClick={() => setSelectedTemp(temp.id)}
                                             className="relative aspect-[3/4] bg-surface-container-low  overflow-hidden">
                                            <img alt={`${temp.name} resume template preview`}
                                                 className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
                                                 src={temp.img}/>
                                            <div className="absolute hidden md:flex md:opacity-0 md:group-hover:opacity-100 inset-0 backdrop-blur-[3px]  w-full h-full  justify-center items-center">
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/choose-methode/${temp.id}`)
                                                }}
                                                        className=" hidden md:flex bg-gradient-to-r from-primary to-secondary text-white rounded-lg py-2 px-3  items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <p className="text-xs sm:text-sm font-bold">Use Template</p>
                                                </button>
                                            </div>


                                            {selectedTemp === temp.id &&
                                                <div className="absolute flex md:hidden  inset-0 backdrop-blur-[2px]  w-full h-full  justify-center items-center">
                                                        <button onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTemp(temp.id)
                                                    }} className="bg-primary  text-white rounded-full w-[32px] h-[32px] d-flex items-center justify-center   transition-opacity">
                                                    <span
                                                        className="material-symbols-outlined text-sm font-bold top-[1px] relative">check</span>
                                                    </button>
                                                </div>}
                                        </div>

                                        <div className="p-4 sm:p-6 hidden md:flex justify-between items-center gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-headline-md text-headline-sm  text-on-surface truncate">{temp.name}</h3>
                                                <p className="font-body-sm  md:text-xs text-on-surface-variant">Best for leadership roles</p>
                                            </div>

                                            <div className="flex gap-0.5 md:gap-1 shrink-0">
                                                {(temp.themes || []).map((t, idx) => (
                                                    <div key={idx}
                                                         style={{
                                                             backgroundColor: t.primary,
                                                             ...(selectedTheme === t && { border: `2px solid ${t.secondary}` }),
                                                         }}
                                                         className="w-2 md:w-4 h-2 md:h-4 rounded-full hover:border cursor-pointer"
                                                         onClick={() => setSelectedTheme(t)}>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6 flex-col md:hidden justify-between items-center gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-headline-md  text-sm text-on-surface truncate">{temp.name}</h3>
                                                <p className="font-body-sm text-[8px]  text-on-surface-variant">Best for leadership roles</p>
                                            </div>

                                            <div className="flex gap-0.5 md:gap-1 mt-1 shrink-0">
                                                {(temp.themes || []).map((t, idx) => (
                                                    <div key={idx}
                                                         style={{
                                                             backgroundColor: t.primary,
                                                             ...(selectedTheme === t && { border: `2px solid ${t.secondary}` }),
                                                         }}
                                                         className="w-2 md:w-4 h-2 md:h-4 rounded-full hover:border cursor-pointer"
                                                         onClick={() => setSelectedTheme(t)}>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className="fixed flex md:hidden bottom-0  justify-center items-center  bg-surface-container-lowest w-full py-4 px-2 pe-8">
                            <button onClick={() => navigate(`/choose-methode/${selectedTemp}`)}
                                    className=" w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                                Use Template
                            </button>

                        </div>
                    </main>
                </div>
            }
            <UserAuth
                isOpen={open}
                mode={authMode}
                onClose={() => setOpen(false)}
            />
        </>
    )
}

export default TemplateList