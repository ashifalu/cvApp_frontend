import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom'


const SecondTemplate = ({
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    languages,
    projects,
    awards,
    theme,
    onPageCount,
     currentPage
}) => {

    let selectedTheme ={}


    {theme && Object.keys(theme).length > 0 ?
        selectedTheme = theme        
         :
          selectedTheme = {
            primary : "#000042",
            secondary : '#5F53F5'
        }
      }

    // const blocks = useMemo(() => {
    //     const result = [
    //         { type: "header", data: personalInfo },
    //     ];
    //
    //     const chunkArray = (arr, size) =>
    //         Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    //             arr.slice(i * size, i * size + size)
    //         );
    //
    //     // ✅ only add summary if it has content
    //     if (professionalSummary) {
    //         result.push({ type: "summary", data: professionalSummary });
    //     }
    //
    //     return [
    //         ...result,
    //         { type: "skills-group", data: skills },
    //         ...chunkArray(skills, 5).map((chunk, i) => ({
    //             type: "skills-row",
    //             data: chunk,
    //             isFirst: i === 0
    //         })),
    //         ...projects.map(p => ({ type: "project", data: p })),
    //         ...experience.map(e => ({ type: "experience", data: e })),
    //         ...awards.map(a => ({ type: "award", data: a })),
    //         ...education.map(e => ({ type: "education", data: e })),
    //         { type: "language-group", data: languages },
    //         ...chunkArray(languages, 5).map((chunk, i) => ({
    //             type: "languages-row",
    //             data: chunk,
    //             isFirst: i === 0
    //         })),
    //     ];
    // }, [personalInfo, professionalSummary, education, experience,
    //     projects, awards, skills, languages]);


    const blocks = useMemo(() => {
        const result = [
            { type: "header", data: personalInfo },
        ];

        const chunkArray = (arr, size) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
                arr.slice(i * size, i * size + size)
            );

        // ✅ only add summary if it has content
        if (professionalSummary) {
            result.push({ type: "summary", data: professionalSummary });
        }


        return [
            ...result,
            ...education.map(e => ({ type: "education", data: e })),
            ...experience.map(e => ({ type: "experience", data: e })),
            ...projects.map(p => ({ type: "project", data: p })),
            ...awards.map(a => ({ type: "award", data: a })),
            { type: "skills-group", data: skills },
            { type: "language-group", data: languages },
            ...chunkArray(skills, 5).map((chunk, i) => ({
                type: "skills-row",
                data: chunk,
                isFirst: i === 0  // ← carry this flag
            })),
            ...chunkArray(languages, 5).map((chunk, i) => ({
                type: "languages-row",
                data: chunk,
                isFirst: i === 0
            })),
        ];
    }, [personalInfo, professionalSummary, education, experience,
        projects, awards, skills, languages]);




    // Step 1: force complete remeasure on any change
    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);

    const BORDER = 2
    const BUFFER = 5
    const PAGE_HEIGHT = 1123;
    const PAGE_1_HIGHT = 1035;
    const PAGE_N_HEIGHT = 1000;

    useEffect(() => {
        onPageCount?.(pages.length);
    }, [pages.length]);

    // Step 1: trigger remeasure when blocks change
    useLayoutEffect(() => {
        setMeasureKey(k => k + 1);
    }, [blocks]);

    useLayoutEffect(() => {
        if (measureKey === 0) return;
        if (!measureRef.current) return;

        const measure = () => {
            if (!measureRef.current) return;
            const newPages = [];
            let currentPage = [];
            let currentHeight = 0;
            let isFirstPage = true;

            blocks.forEach((block, i) => {
                const el = measureRef.current?.children[i];
                if (!el) return;

                const blockHeight = el.getBoundingClientRect().height;
                console.log(`block ${i} (${block.type}): ${blockHeight}px`);

                const limit = isFirstPage
                    ? PAGE_1_HIGHT
                    : PAGE_N_HEIGHT;

                console.log(`[${i}] ${block.type} | blockH: ${blockHeight} | runningH: ${currentHeight} | willBe: ${currentHeight + blockHeight} | limit: ${limit} | overflow: ${currentHeight + blockHeight > limit}`);

                if (currentHeight + blockHeight > limit && currentPage.length > 0) {
                    newPages.push([...currentPage]);
                    currentPage = [block];
                    currentHeight = blockHeight;
                    isFirstPage = false;
                } else {
                    currentPage.push(block);
                    currentHeight += blockHeight;
                }
            });
            // Add inside measure() after forEach
            console.log("Total measured height:",
                blocks.reduce((sum, _, i) => {
                    const el = measureRef.current?.children[i];
                    return sum + (el?.getBoundingClientRect().height || 0);
                }, 0)
            );

            if (currentPage.length) newPages.push([...currentPage]);
            setPages(newPages);
        };

        // Wait for all images in measurement container to load
        const images = Array.from(measureRef.current.querySelectorAll("img"));

        if (images.length === 0) {
            // No images — double rAF is enough
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(measure);
                return () => cancelAnimationFrame(r2);
            });
            return () => cancelAnimationFrame(r1);
        }

        // Has images — wait for all to load first
        let loaded = 0;
        const onLoad = () => {
            loaded++;
            if (loaded === images.length) measure(); // all images ready
        };

        images.forEach(img => {
            if (img.complete) {
                loaded++;  // already cached
            } else {
                img.addEventListener("load", onLoad);
                img.addEventListener("error", onLoad); // count errors too, don't hang
            }
        });

        if (loaded === images.length) {
            // all were already cached
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(measure);
                return () => cancelAnimationFrame(r2);
            });
            return () => cancelAnimationFrame(r1);
        }

        return () => {
            images.forEach(img => {
                img.removeEventListener("load", onLoad);
                img.removeEventListener("error", onLoad);
            });
        };

    }, [measureKey, blocks]);
    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header":
                return <Header data={block.data} />;

            case "summary":
                return <Summary data={block.data} index={index} />;

            case "education":
                return <EducationItem data={block.data} index={index} />;

            case "experience":
                return <ExperienceItem data={block.data} index={index} />;

            case "project":
                return <ProjectItem data={block.data} index={index} />;

            case "award":
                return <AwardItem data={block.data} index={index} />;

            case "languages-row":
                return <LanguageRow data={block.data} index={index} isFirst={block.isFirst} />;
            // In renderBlock:
            case "skills-row":
                return <SkillsRow data={block.data} index={index} isFirst={block.isFirst} />;



            default:
                return null;
        }
    };

    const Header = ({ data }) => {
        return (
            <>
                {data?.firstName ?
                    <div style={{ backgroundColor: selectedTheme ? selectedTheme.primary : '#000000' }} className={` text-white secondTempFont p-6 px-4 flex justify-between cv-section mb-2`}>
                        <div className='w-1/3 secondTempFont'>
                            <h1 className="text-2xl font-Quicksand font-bold">
                                {data.firstName} {data.lastName}
                            </h1>
                            <p className="text-l">{data.role}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex items-center ">
                            <div className={`text-xs  text-white`}>
                                {data.email && <div className="flex gap-2  text-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                                        <path d="M3 7l9 6l9 -6" />
                                    </svg><p>{data.email}</p>
                                </div>}
                                {data.phone && <div className="flex gap-2 w-50 mb-1 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                    </svg>
                                    <p className={``}>{data.phone}</p>
                                </div>}
                                {data.nationality && <div className="flex gap-2 w-50 text-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-exclamation">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
                                        <path d="M19 16v3" />
                                        <path d="M19 22v.01" />
                                    </svg>
                                    <p>{data.nationality}</p>
                                </div>}

                            </div>
                            <div className={`text-xs  text-white mb-1`}>
                                {data.country && <div className="flex gap-2 w-50 mb-1 text-center mb-1"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
                                    </svg><p>{data.city}, {data.country}</p>
                                </div>}
                                {data.linkedInUrl && <div className="flex gap-2  text-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M8 11v5" />
                                        <path d="M8 8v.01" />
                                        <path d="M12 16v-5" />
                                        <path d="M16 16v-3a2 2 0 1 0 -4 0" />
                                        <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
                                    </svg><a href={data.linkedInUrl}>{data.linkedInUrl}</a>
                                </div>}
                                {data.portfolioUrl && <div className="flex gap-2  text-center mb-1" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={`${selectedTheme? selectedTheme.secondary : '#5F53F5'}`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-dribbble">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                        <path d="M9 3.6c5 6 7 10.5 7.5 16.2" />
                                        <path d="M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4" />
                                        <path d="M3.1 10.75c5 0 9.814 -.38 15.314 -5" />
                                    </svg><a href={data.portfolioUrl}>{data.portfolioUrl}</a>
                                </div>}
                            </div>
                        </div>
                    </div> :
                    <div  style={{ backgroundColor: selectedTheme ? selectedTheme.primary : '#5F53F5' }}  className={`bg-[${selectedTheme? selectedTheme.secondary : `#5F53F5`}] opacity-30 text-white secondTempFont p-6 px-4 flex justify-between cv-section mb-2`}>
                    <div className='w-1/3 secondTempFont'>
                        <h1 className="text-2xl font-Quicksand font-bold">
                            Your Name 
                        </h1>
                        <p className="text-l">Professional Role</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 flex items-center ">
                        <div className={`text-xs  text-white`}>
                             <div className="flex gap-2 w-50 mb-1 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke='#F7F4EA' strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                </svg>
                                <p className={``}>+971567853</p>
                            </div>
                             <div className="flex gap-2  text-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F7F4EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                                    <path d="M3 7l9 6l9 -6" />
                                </svg><p>you@gmail.com</p>
                            </div>
                            <div className="flex gap-2 w-50 text-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#F7F4EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-exclamation">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128" />
                                    <path d="M19 16v3" />
                                    <path d="M19 22v.01" />
                                </svg>
                                <p>nation</p>
                            </div>
                        </div>
                        <div className={`text-xs  text-white mb-1`}>
                            <div className="flex gap-2 w-50 mb-1 text-center mb-1"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F7F4EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
                                </svg><p>Indore, Delhi</p>
                            </div>

                             <div className="flex gap-2  text-center mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F7F4EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 11v5" />
                                    <path d="M8 8v.01" />
                                    <path d="M12 16v-5" />
                                    <path d="M16 16v-3a2 2 0 1 0 -4 0" />
                                    <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
                                </svg><a>linkdn@url</a>
                            </div>
                             <div className="flex gap-2  text-center mb-1" >
                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F7F4EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-dribbble">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                    <path d="M9 3.6c5 6 7 10.5 7.5 16.2" />
                                    <path d="M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4" />
                                    <path d="M3.1 10.75c5 0 9.814 -.38 15.314 -5" />
                                </svg><a>portfolio@url</a>
                            </div>
                        </div>
                    </div>
                </div>}

            </>

        )
    };
    const Summary = ({ data }) => {
        console.log(data.length)
        return(
            <>
                 {data ?         <div className="item px-6  secondTempFont">
                         <div className="my-1">
                             <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold text-[${selectedTheme? selectedTheme.secondary : '#5F53F5'}] mb-1`}>
                                 Professional Summary
                             </h2>
                         </div>
                         <div className="section-body">
                             <p className={`text-xs text-[#666666]`}>{data}</p>
                         </div>
                         <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }}  className={`my-2 h-[2px] w-full bg-[${selectedTheme? selectedTheme.secondary : '#5F53F5'}] `} />
                     </div>

                     :
                     <div className="item px-6 opacity-30 secondTempFont">
                     <div className="my-1">
                     <h2 className={`text-sm font-bold text-[${selectedTheme? selectedTheme.secondary : '#5F53F5'}] mb-1`}>
            Professional Summary
            </h2>
    </div>
        <div className="section-body">
            <p className={`text-xs text-[#666666]`}>r4t5y6u7ji8kujy67t5r4e3w2qw3e4r5t6i8u7y654212ju7i.</p>
        </div>
        <div  style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }}  className={`my-2 h-[2px] w-full  `} />
    </div>
    }
            </>
        )
    };

    const EducationItem = ({ data, index }) => {
        return (
            <> 
                {( data.fieldOfStudy ==="" && data.degree === "")?
             <div className="item px-6 secondTempFont opacity-30">
             <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1 `}>
                 Education
             </h2>
 

     <div className="flex justify-between">
         <div className="">
             <p className="text-xs font-semibold">Field of study</p>
             <p className="text-xs">Degree</p>
             <p className="text-xs">School name,city,country</p>
             <p className="text-xs">GPA : in percentage</p>
         </div>
         <div>
             <p className={`text-xs text-black] font-semibold`}>
                 start date - end date
             </p>
         </div>
     </div>



     {education.indexOf(data) < education.length - 1 ?
         <div className="my-2 h-[1px] bg-gray-200" />
         :
         <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />
     }
 </div>
            :
            <div className="item px-6 secondTempFont">
            {(education.indexOf(data) == 0 || index == 0) &&
                <div className="my-1">
                    <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1 `}>
                        Education
                    </h2>
                </div>
            }
            <div className="flex justify-between">
                <div className="">
                    <p className="text-xs font-semibold">{data.fieldOfStudy}</p>
                    <p className="text-xs">{data.degree}</p>
                    <p className="text-xs">{data.school},{data.city},{data.country}</p>
                    {data.grade&&<p className="text-xs">GPA : {data.grade}</p>}
                </div>
                {data.startDate!==null&&<div className="">
                <p className="text-xs font-bold">
                    {data.startDate} - {data.endDate || "Present"}
                </p>
            </div>}
            </div>



            {education.indexOf(data) < education.length - 1 ?
                <div className="my-2 h-[1px] bg-gray-200" />
                :
                <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />
            }
        </div>
           }
            </>
            



        )
    };
    const ExperienceItem = ({ data, index }) => {
        return (
            <div className="item px-6 secondTempFont">
                {(experience.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1 `}>
                            Experience
                        </h2>
                    </div>}
                <div className="flex justify-between">
                    <div className="">
                        <p className="font-bold text-xs">{data.jobTitle}</p>
                        <p className="text-xs">
                            {[data.employer, data.city, data.country]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>
                    {data.startDate!==null&&<div className="">
                        <p className="text-xs font-bold">
                            {data.startDate} - {data.endDate || "Present"}
                        </p>
                    </div>}
                </div>

                <ul className="text-xs list-disc ml-4">
                    {data.responsibilities?.map((r, i) => (
                        <li style={{color:selectedTheme ? selectedTheme.secondary : '#5F53F5', opacity:'0.7' }} key={i}><span style={{color:'#000000'}} >{r}</span></li>
                    ))}
                </ul>

                {experience.indexOf(data) < experience.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />
                }

            </div>



        )
    };

    const ProjectItem = ({ data, index }) => {
        return (
            <div className="item px-6 secondTempFont">
                {(projects.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1`}>
                            Projects
                        </h2>
                    </div>}
                <div className="">
                    <p className="text-xs font-semibold">{data.projectTitle}</p>

                    <ul className="text-xs list-disc ml-4">
                    {data.responsibilities?.map((r, i) => (
                        <li style={{color:selectedTheme ? selectedTheme.secondary : '#5F53F5', opacity:'0.7' }} key={i}><span style={{color:'#000000'}} >{r}</span></li>
                    ))}
                </ul>

                    <ul className="text-xs list-disc ml-4">
                        {data.keyFeatures?.map((k, i) => (
                            <li style={{color:selectedTheme ? selectedTheme.secondary : '#5F53F5', opacity:'0.7' }} key={i}><span style={{color:'#000000'}} >{k}</span></li>
                        ))}
                    </ul>
                    {data.projectUrl && <p className="text-xs my-1">Live Demo : <span className="hover:text-blue-500"><a href={data.projectUrl}>{data.projectUrl}</a></span></p>}
                    {data.gitHubUrl && <p className="text-xs my-1"> gitHub Url : <span className="hover:text-blue-500"><a href={data.gitHubUrl}>{data.gitHubUrl}</a></span></p>}
                </div>

                {projects.indexOf(data) < projects.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />
                }

            </div>



        )
    };

    const AwardItem = ({ data, index }) => {
        return (
            <div className="item px-6 secondTempFont">
                {(awards.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1`}>
                            Awards
                        </h2>
                    </div>}
                <div className="item flex justify-between">
                    <div>
                        <p className="text-xs font-semibold">{data.awardName}</p>
                        <p className="text-xs">{data.issueingOrg}</p>
                        <p className="text-xs my-1">{data.description}</p>
                    </div>
                    <div className="flex">
                        <p className="text-xs font-bold">
                            {data.issueingDate} - {data.expirationDate || "Present"}
                        </p>
                    </div>
                </div>

                {awards.indexOf(data) < awards.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />
                }
            </div>


        )
    };
    const LanguageRow = ({ data, isFirst, index }) => (
        <div className="item px-6 secondTempFont">
            {(isFirst || index == 0) && (
                <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1`}>Languages</h2>
            )}
            <div className="grid grid-cols-5 gap-x-4">
                {data.map((l, i) => (
                    <div key={i}>
                        <p className="text-xs">{l.language}</p>
                        <div className="flex gap-1 my-1">
                            {[0, 1, 2, 3, 4].map(j => (
                                j <= l.level
                                    ? <div key={j} style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`w-2 h-2 rounded-xl `} />
                                    : <div key={j} style={{ borderColor: selectedTheme?.secondary || '#5F53F5',}} className={`w-2 h-2 rounded-xl border `} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {languages.indexOf(data[data.length - 1]) == languages.length - 1 && <div className={`my-2 h-[2px] bg-[${selectedTheme? selectedTheme.secondary : '#5F53F5'}]`} />}
        </div>
    );
    const SkillsRow = ({ data, isFirst }) => (
        <div className="item px-6 secondTempFont">
            {isFirst && (
                <h2 style={{color: selectedTheme ? selectedTheme.secondary : '#5F53F5'}} className={`text-sm font-bold  mb-1`}>Skills</h2>
            )}
            <div className="grid grid-cols-5 gap-x-4">
                {data.map((s, i) => (
                    <div key={i}>
                        <p className="text-xs">{s.skill}</p>
                        <div className="flex gap-1 my-1">
                            {[0, 1, 2, 3, 4].map(j => (
                                j <= s.level
                                ? <div key={j} style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`w-2 h-2 rounded-xl `} />
                                : <div key={j} style={{ borderColor: selectedTheme?.secondary || '#5F53F5',}}  className={`w-2 h-2 rounded-xl border `} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {skills.indexOf(data[data.length - 1]) == skills.length - 1 && <div style={{ backgroundColor: selectedTheme ? selectedTheme.secondary : '#5F53F5' }} className={`my-2 h-[2px] `} />}
        </div>
    );



    return (
        <>
            {/* ---- Paginated output ---- */}
            {(currentPage === undefined || currentPage === null
                    ? pages                                        // no currentPage prop -> render ALL pages (used for PDF export)
                    : pages.length
                        ? [pages[Math.min(currentPage, pages.length - 1)]]   // only the selected page (used for on-screen preview)
                        : []
            ).map((page, idx) => {
                const pageIndex = (currentPage === undefined || currentPage === null) ? idx : currentPage;
                return (
                    <div
                        key={pageIndex}
                        style={{
                            backgroundColor: "#ffff",
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            paddingTop: pageIndex !== 0 ? 15 : 0,
                            paddingBottom: 15,
                            width: 794,
                            height: PAGE_HEIGHT,
                        }}
                    >
                        {page.map((block, index) => renderBlock(block, index))}
                    </div>
                );
            })}

            {/* ---- Hidden measurement container ---- */}
            {/* visibility:hidden = invisible BUT still has real layout and real heights */}

            {createPortal(
                // ── Zero-size, strictly-contained wrapper ──────────────────
                // This is the fix. The measurement clone below MUST stay in the
                // DOM (it's how pagination heights get measured), but portaling
                // it straight to document.body as a bare `position: absolute;
                // width: 794px` element means it sits directly on <body>,
                // outside of ANY ancestor's overflow/contain rules — including
                // ResumeCard's overflow:hidden and contain:layout, and even a
                // page-level `overflow-x: hidden` on <body> isn't reliably
                // enough on every browser once `position: fixed` interacts with
                // transformed ancestors elsewhere on the page. Wrapping it in a
                // `position: fixed; width: 0; height: 0; overflow: hidden;
                // contain: strict` box pins it off in its own layout/paint
                // universe: the outer box has zero size, `contain: strict`
                // (layout + paint + size) guarantees nothing inside it can ever
                // influence the size or scroll area of anything outside it, and
                // `position: fixed` takes it out of normal document flow
                // entirely. This is what was making every rendered resume card
                // contribute an invisible 794px-wide box to the page, which is
                // why the fixed nav icon appeared to vanish on mobile.
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                        overflow: "hidden",
                        contain: "strict",
                    }}
                >
                    <div
                        ref={measureRef}
                        style={{
                            position: "absolute",
                            visibility: "hidden",
                            paddingTop: 0,
                            paddingBottom: 15,
                            width: "794px",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                            boxSizing: "border-box"
                        }}
                    >
                        {blocks.map((block, i) => (
                            <div key={`${measureKey}-${i}`}>{renderBlock(block, i)}</div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>

    )
};


export default SecondTemplate