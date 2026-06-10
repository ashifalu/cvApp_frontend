import React from 'react'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { templateThemes } from '../../constants/tempThemes'
import Preview from '../users/components/Preview'

const TemplateList = () => {
    const [selectedTemp, setSelectedTemp] = useState("2")
    const [selectedTheme, setSelectedTheme] = useState({})  


    const personalInfo = useSelector((state) => state.cv.cvData.personalInfo)
    const professionalSummary = useSelector((state) => state.cv.cvData.professionalSummary)
    const experience = useSelector((state) => state.cv.cvData.experience)
    const education = useSelector((state) => state.cv.cvData.education)
    const skills = useSelector((state) => state.cv.cvData.skills)
    const languages = useSelector((state) => state.cv.cvData.languages)
    const projects = useSelector((state) => state.cv.cvData.projects)
    const awards = useSelector((state) => state.cv.cvData.awards)

    console.log(personalInfo);
    console.log(education);

    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience, education,
        skills, languages, projects, awards
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards])

    console.log(previewData);

    const A4_W = 794
    const A4_H = 1123

    const templates = [
        { id: "1", name: "Classic Double", stat: "43% of your peers", img: "/images/template3.jpeg" },
        { id: "2", name: "Modern Pro", stat: "31% of your peers", img: "/images/template2.jpeg" },
        { id: "3", name: "Minimal Clean", stat: "15% of your peers", img: "/images/template3.jpeg" },
        { id: "4", name: "Bold Impact", stat: "11% of your peers", img: "/images/template3.jpeg" },
    ]
console.log(templateThemes);
    return (
        <>

            {personalInfo.firstName ?
                <div className="min-h-screen bg-background">
                    {/* ── Header ──────────────────────────────────────────────────── */}
                    <div className="text-center pt-16 pb-10 px-6 max-w-2xl mx-auto">
                        <h1 className="font-headline-lg text-headline-lg text-on-background mb-3">
                            Pick a template for your resume
                        </h1>
                        <p className="text-on-surface-variant text-body-lg">
                            You can always change it later. Recruiters appreciate readability and one-page resumes.
                        </p>
                    </div>

                    <div className="flex gap-8 px-10 pb-16 items-start max-w-screen-2xl mx-auto">

                        {/* ── Template grid ────────────────────────────────────────── */}
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols-2 gap-6 mx-10 ">
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
                                        {/* Thumbnail */}
                                        <div className="relative w-full overflow-hidden rounded-xl">
                                            <img
                                                src={t.img}
                                                alt={t.name}
                                                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Overlay */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/30
                                        ${selectedTemp === t.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                                <span className={`px-5 py-2 rounded-xl text-sm font-semibold text-white
                                            ${selectedTemp === t.id ? "bg-primary" : "bg-black/50"}`}>
                                                    {selectedTemp === t.id ? "✓ Selected" : "Select"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Label */}
                                        <div className="mt-3 px-1">
                                            <p className={`font-semibold text-sm ${selectedTemp === t.id ? "text-primary" : "text-on-surface"}`}>
                                                {t.name}
                                            </p>
                                            <p className="text-xs text-on-surface-variant mt-0.5">Selected by {t.stat}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="w-[526px] mx-10  top-8">
                                <div className='mb-5 flex flex-col justify-center items-center w-full'>
                                    <h3 className='font-semibold mb-2'>Choose Theme</h3>
                                    <div className='flex gap-3 '>
                                    {templateThemes[selectedTemp].map((t)=> (
                                        <button style={{ backgroundColor: t.primary }} className={`bg-[${t.primary}] w-8 h-8 rounded-full hover:border hover:border-[${t.secondary}]`} onClick={() => {setSelectedTheme(t);
                                             console.log(selectedTheme); } }></button>
                                    ))
                                    }
                                        
                                    </div>
                                </div>
                                <div className=" rounded-2xl border border-outline-variant/30 p-4 shadow-lg">
                                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 text-center">
                                        Live Preview
                                    </p>
                                    <div style={{ width: A4_W * 0.62, overflow: "hidden", }}>
                                        <div style={{
                                            width: A4_W,
                                            transform: "scale(0.62)",
                                            transformOrigin: "top left",
                                            marginBottom: -(A4_H * 0.38),
                                            marginRight: -(A4_W * 0.38),
                                            pointerEvents: "none"
                                        }}>
                                            <Preview previewData={previewData} temp={selectedTemp} theme={selectedTheme}/>

                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <Link to={`/create-cv/${selectedTemp}`}>
                                                <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-95">
                                                    Use This Template →
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* ── Live preview ─────────────────────────────────────────── */}


                    </div>
                </div>

                :
                <div className='w-full h-screen flex flex-col justify-center items-center bg-background px-16 py-20'>
                    <div className='text-center  mb-16 max-w-2xl '>
                        <h1 className='font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-4'>Please select a template for your resume.</h1>
                        <h1 className='font-headline-lg text-headline-lg-mobile md:text-md text-on-background mb-4'>You can always change it later.</h1>
                        <p className='text-on-surface-variant text-body-lg'>Recruiters do appreciate readability and one-page resumes, though.</p>
                        <p className='text-on-surface-variant text-body-lg'></p>
                    </div>
                    <div className='flex mx-10 mb-10'>
                        <a href={`/create-cv/${selectedTemp}`}>
                            <button onClick={() => setSelectedTemp(1)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                                <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                                    <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                                    <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                                    <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                                </div>
                            </button>
                        </a>

                        <a href={`/create-cv/${selectedTemp}`}>
                            <button onClick={() => setSelectedTemp(2)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                                <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                                    <img src="/images/template2.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                                    <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                                    <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                                </div>
                            </button>
                        </a>

                        <a href={`/create-cv/${selectedTemp}`}>
                            <button onClick={() => setSelectedTemp(3)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                                <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                                    <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                                    <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                                    <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                                </div>
                            </button>
                        </a>

                        <a href={`/create-cv/${selectedTemp}`}>
                            <button onClick={() => setSelectedTemp(4)} className='w-[350px]  p-4 mx-5 bg-gray-400/20 hover:bg-purple-300/20 group rounded-2xl hover:scale-105 transition-all duration-300 '>
                                <div className='w-full relative flex flex-col justify-center items-center hover:border hover:border-purple-300 '>
                                    <img src="/images/template3.jpeg" alt="template3" className='w-full object-cover transition-transform duration-500' />
                                    <button className="absolute hidden group-hover:flex transition-all duration-300 hover:shadow-xl group-hover:opacity-100 gradient-button text-on-primary px-8 py-4 rounded-xl text-lsm shadow-lg shadow-primary/10 hover:shadow-xl transition-all z-10">Use Template</button>
                                </div>
                                <div className='w-full flex flex-col justify-center items-center py-2'>
                                    <h2 className='text-gray-700 font-semibold'>Double Column</h2>
                                    <p className='text-xs text-gray-500'>Selected by 43% of your peers.</p>
                                </div>
                            </button>
                        </a>
                    </div>
                </div>
            }
        </>
    )
}

export default TemplateList

