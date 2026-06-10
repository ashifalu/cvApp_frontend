import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'   // ← Link keeps Redux alive
import Preview from '../users/components/Preview'

// ─── Defined here (were missing before) ──────────────────────────────────────
const THEMES = ["#5F53F5", "#810B38", "#000042", "#043915", "#435663", "#043915"]

const TemplateList = () => {
    const [selectedTemp,  setSelectedTemp]  = useState("1")
    const [selectedTheme, setSelectedTheme] = useState("#5F53F5")   // ← was missing

    const navigate = useNavigate()

    // ── Read CV data from Redux ───────────────────────────────────────────────
    const personalInfo        = useSelector((state) => state.cv.cvData.personalInfo)
    const professionalSummary = useSelector((state) => state.cv.cvData.professionalSummary)
    const experience          = useSelector((state) => state.cv.cvData.experience)
    const education           = useSelector((state) => state.cv.cvData.education)
    const skills              = useSelector((state) => state.cv.cvData.skills)
    const languages           = useSelector((state) => state.cv.cvData.languages)
    const projects            = useSelector((state) => state.cv.cvData.projects)
    const awards              = useSelector((state) => state.cv.cvData.awards)

    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience, education,
        skills, languages, projects, awards
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards])

    // ── Check if the user has any CV data at all ──────────────────────────────
    // education is an ARRAY — education.degree is always undefined!
    // Check array length or personalInfo.firstName instead:
    const hasCvData = personalInfo?.firstName?.trim() || education?.length > 0

    const A4_W = 794
    const A4_H = 1123

    const templates = [
        { id: "1", name: "Classic Double", stat: "43% of your peers", img: "/images/template3.jpeg" },
        { id: "2", name: "Modern Pro",     stat: "31% of your peers", img: "/images/template2.jpeg" },
        { id: "3", name: "Minimal Clean",  stat: "15% of your peers", img: "/images/template3.jpeg" },
        { id: "4", name: "Bold Impact",    stat: "11% of your peers", img: "/images/template3.jpeg" },
    ]

    // ── No CV data: show the plain template picker without live preview ───────
    if (!hasCvData) {
        return (
            <div className='w-full min-h-screen flex flex-col justify-center items-center bg-background px-16 py-20'>
                <div className='text-center mb-16 max-w-2xl'>
                    <h1 className='font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-4'>
                        Please select a template for your resume.
                    </h1>
                    <p className='text-on-surface-variant text-body-lg'>
                        You can always change it later. Recruiters appreciate readability and one-page resumes.
                    </p>
                </div>

                <div className='flex flex-wrap justify-center gap-6 mb-10'>
                    {templates.map((t) => (
                        // ↓ Link instead of <a> — keeps Redux state alive
                        <Link key={t.id} to={`/create-cv/${t.id}`}>
                            <button
                                onClick={() => setSelectedTemp(t.id)}
                                className='w-[300px] p-4 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300'
                            >
                                <div className='w-full relative flex flex-col justify-center items-center'>
                                    <img src={t.img} alt={t.name} className='w-full object-cover transition-transform duration-500' />
                                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20 rounded-xl">
                                        <span className="gradient-button text-white px-6 py-3 rounded-xl text-sm font-semibold">
                                            Use Template
                                        </span>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h2 className='text-gray-700 font-semibold'>{t.name}</h2>
                                    <p className='text-xs text-gray-500'>Selected by {t.stat}</p>
                                </div>
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }

    // ── Has CV data: show full picker with live preview ───────────────────────
    return (
        <div className="min-h-screen bg-background">

            {/* Header */}
            <div className="text-center pt-16 pb-10 px-6 max-w-2xl mx-auto">
                <h1 className="font-headline-lg text-headline-lg text-on-background mb-3">
                    Pick a template for your resume
                </h1>
                <p className="text-on-surface-variant text-body-lg">
                    You can always change it later. Recruiters appreciate readability and one-page resumes.
                </p>
            </div>

            <div className="flex gap-8 px-10 pb-16 items-start max-w-screen-2xl mx-auto">

                {/* Template grid + theme picker */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemp(t.id)}
                                className={`group p-3 rounded-2xl transition-all duration-300 hover:scale-105 text-left
                                    ${selectedTemp === t.id
                                        ? "bg-primary/10 ring-2 ring-primary shadow-lg shadow-primary/15"
                                        : "bg-surface-container-low hover:bg-primary/5"
                                    }`}
                            >
                                <div className="relative w-full overflow-hidden rounded-xl">
                                    <img
                                        src={t.img}
                                        alt={t.name}
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/30
                                        ${selectedTemp === t.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                        <span className={`px-5 py-2 rounded-xl text-sm font-semibold text-white
                                            ${selectedTemp === t.id ? "bg-primary" : "bg-black/50"}`}>
                                            {selectedTemp === t.id ? "✓ Selected" : "Select"}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 px-1">
                                    <p className={`font-semibold text-sm ${selectedTemp === t.id ? "text-primary" : "text-on-surface"}`}>
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">Selected by {t.stat}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Theme picker */}
                    <div className="mt-8 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
                        <p className="text-sm font-semibold text-on-surface mb-4">Choose a colour theme</p>
                        <div className="flex gap-3 flex-wrap">
                            {THEMES.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedTheme(color)}
                                    className={`w-10 h-10 rounded-xl transition-all hover:scale-110 active:scale-95
                                        ${selectedTheme === color ? "ring-2 ring-offset-2 ring-primary scale-110" : ""}`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* CTA — useNavigate instead of <a href> ───────────────── */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => navigate(`/create-cv/${selectedTemp}`)}
                            className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-95"
                        >
                            Use This Template →
                        </button>
                    </div>
                </div>

                {/* Live preview panel */}
                <div className="hidden xl:block w-[380px] shrink-0 sticky top-8">
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 shadow-lg">
                        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 text-center">
                            Live Preview
                        </p>
                        <div style={{ width: A4_W * 0.45, overflow: "hidden", borderRadius: 8 }}>
                            <div style={{
                                width: A4_W,
                                transform: "scale(0.45)",
                                transformOrigin: "top left",
                                marginBottom: -(A4_H * 0.55),
                                marginRight: -(A4_W * 0.55),
                                pointerEvents: "none"
                            }}>
                                <Preview previewData={previewData} temp={selectedTemp} theme={selectedTheme} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TemplateList