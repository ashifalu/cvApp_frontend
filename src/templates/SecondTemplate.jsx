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
    awards
}) => {

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
            ...chunkArray(languages, 5).map((chunk, i)=> ({ type: "languages-row",
             data: chunk ,
             isFirst: i === 0 })),
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
                return <SkillsRow data={block.data} index={index}  isFirst={block.isFirst} />;



            default:
                return null;
        }
    };

    const Header = ({ data }) => {
        return (
            <>
                {data?.firstName &&
                    <div className="bg-[#000042] text-white p-6 flex justify-between cv-section mb-2">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {data.firstName} {data.lastName}
                            </h1>
                            <p className="text-sm">{data.role}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="text-xs text-right text-gray-300">
                                {data.phone && <div className="flex gap-2 w-50 text-center">
                                    <img className="w-4 h-4" src="/images/phone.png" alt="phone" /><p>{data.phone}</p>
                                </div>}
                                {data.country && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/location.png" alt="location" /><p>{data.city}, {data.country}</p>
                                </div>}
                                {data.email && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/email.png" alt="email" /><p>{data.email}</p>
                                </div>}
                            </div>
                            <div className="text-xs text-gray-300">
                                {data.linkedInUrl && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/linkedin.png" alt="linkedin" /><p className="text-sm">{data.linkedInUrl}</p>
                                </div>}
                                {data.nationality && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/nation.png" alt="nationality" /><p>{data.nationality}</p>
                                </div>}
                            </div>
                        </div>
                    </div>}

            </>

        )
    };
    const Summary = ({ data }) => {
        if (!data) return null;  // ← return null entirely, don't render empty div
        return (
            <div className="item px-6">
                <div className="my-1">
                    <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
                        Professional Summary
                    </h2>
                </div>
                <div className="section-body">
                    <p className="text-xs text-gray-600">{data}</p>
                </div>
                <div className="my-2 h-[2px] w-full bg-[#5D5CFF]" />
            </div>
        );
    };

    const EducationItem = ({ data, index }) => {
        return (
            <div className="item px-6">
                {(education.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 className="text-sm font-bold text-[#5F53F5] mb-1 ">
                            Education
                        </h2>
                    </div>
                }
                <div className="flex justify-between">
                    <div className="">
                        <p className="text-xs font-semibold">{data.fieldOfStudy}</p>
                        <p className="text-xs">{data.degree}</p>
                        <p className="text-xs">{data.school},{data.city},{data.country}</p>
                        <p className="text-xs">GPA : {data.grade}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold">
                            {data.startDate} - {data.endDate || "Present"}
                        </p>
                    </div>
                </div>



                {education.indexOf(data) < education.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div className="my-2 h-[2px] bg-[#5D5CFF]" />
                }
            </div>



        )
    };
    const ExperienceItem = ({ data, index }) => {
        return (
            <div className="item px-6">
                {(experience.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 className="text-sm font-bold text-[#5F53F5] mb-1 ">
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
                    <div className="">
                        <p className="text-xs font-bold">
                            {data.startDate} - {data.endDate || "Present"}
                        </p>
                    </div>
                </div>

                <ul className="text-xs list-disc ml-4">
                    {data.responsibilities?.map((r, i) => (
                        <li key={i}>{r}</li>
                    ))}
                </ul>

                {experience.indexOf(data) < experience.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div className="my-2 h-[2px] bg-[#5D5CFF]" />
                }

            </div>



        )
    };

    const ProjectItem = ({ data, index }) => {
        return (
            <div className="item px-6">
                {(projects.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 className="text-sm font-bold text-[#5F53F5] mb-1 ">
                            Projects
                        </h2>
                    </div>}
                <div className="">
                    <p className="text-xs font-semibold">{data.projectTitle}</p>

                    <ul className="text-xs list-disc ml-4">
                        {data.keyFeatures?.map((k, i) => (
                            <li key={i}>{k}</li>
                        ))}
                    </ul>
                    <p className="text-xs my-1">Live Demo : <span className="hover:text-blue-500">{data.projectUrl}</span></p>
                </div>

                {projects.indexOf(data) < projects.length - 1 ?
                    <div className="my-2 h-[1px] bg-gray-200" />
                    :
                    <div className="my-2 h-[2px] bg-[#5D5CFF]" />
                }

            </div>



        )
    };

    const AwardItem = ({ data, index }) => {
        return (
            <div className="item px-6">
                {(awards.indexOf(data) == 0 || index == 0) &&
                    <div className="my-1">
                        <h2 className="text-sm font-bold text-[#5F53F5] mb-1 ">
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
                    <div className="my-2 h-[2px] bg-[#5D5CFF]" />
                }
            </div>


        )
    };
    const LanguageRow = ({ data, isFirst, index }) => (
        <div className="item px-6">
            {(isFirst || index == 0 )&& (
                <h2 className="text-sm font-bold text-[#5F53F5] mb-1">Languages</h2>
            )}
            <div className="grid grid-cols-5 gap-x-4">
                {data.map((l, i) => (
                    <div key={i}>
                        <p className="text-xs">{l.language}</p>
                        <div className="flex gap-1 my-1">
                            {[0, 1, 2, 3, 4].map(j => (
                                j <= l.level
                                    ? <div key={j} className="w-2 h-2 rounded-xl bg-[#5F53F5]" />
                                    : <div key={j} className="w-2 h-2 rounded-xl border border-[#5F53F5]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {languages.indexOf(data[data.length - 1]) == languages.length -1 && <div className="my-2 h-[2px] bg-[#5D5CFF]" />}
        </div>
    );
    const SkillsRow = ({ data, isFirst }) => (
        <div className="item px-6">
            { isFirst && (
                <h2 className="text-sm font-bold text-[#5F53F5] mb-1">Skills</h2>
            )}
            <div className="grid grid-cols-5 gap-x-4">
                {data.map((s, i) => (
                    <div key={i}>
                        <p className="text-xs">{s.skill}</p>
                        <div className="flex gap-1 my-1">
                            {[0, 1, 2, 3, 4].map(j => (
                                j <= s.level
                                    ? <div key={j} className="w-2 h-2 rounded-xl bg-[#5F53F5]" />
                                    : <div key={j} className="w-2 h-2 rounded-xl border border-[#5F53F5]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {skills.indexOf(data[data.length - 1]) == skills.length -1 && <div className="my-2 h-[2px] bg-[#5D5CFF]" />}
        </div>
    );
   


    return (
        <>
            {/* ---- Paginated output ---- */}
            {pages.map((page, pageIndex) => (
                <div
                    key={pageIndex}
                    style={{
                        paddingTop: `${pageIndex > 0 ? "15px" : "0px"}`,
                        paddingBottom: "15px",
                        width: "794px",
                        height: `${PAGE_HEIGHT}px`,
                        border: "1px solid #ccc",
                        marginBottom: "20px",
                        overflow: "hidden",
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        backgroundColor: "white",
                    }}
                >
                    {page.map((block, index) => renderBlock(block, index))}
                </div>
            ))}

            {/* ---- Hidden measurement container ---- */}
            {/* visibility:hidden = invisible BUT still has real layout and real heights */}

            {createPortal(<div
                ref={measureRef}
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    paddingTop: "0px",
                    paddingBottom: "15px",
                    width: "794px",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    boxSizing: "border-box"
                }}
            >
                {blocks.map((block, i) => (   // ✅ use blocks directly, not measurepage
                    <div key={`${measureKey}-${i}`}>
                        {renderBlock(block, i)}

                    </div>
                ))
                }
            </div>,
            document.body
            )}
        </>

    )
};


export default SecondTemplate