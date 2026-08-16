import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { createPortal } from 'react-dom'


const ThirdTemplate = (
    {
        personalInfo,
        professionalSummary,
        experience,
        education,
        skills,
        languages,
        projects,
        awards,
        certifications,
        theme,
        onPageCount,
        currentPage
    }, ref) => {

    let selectedTheme = {}

    { theme && Object.keys(theme).length > 0 ?
        selectedTheme = theme
        :
        selectedTheme = {
            primary: "#810B38",
        }
    }

    const blocks = useMemo(() => {
        const result = [
            { type: "header", data: personalInfo },
        ];

        const chunkArray = (arr, size) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
                arr.slice(i * size, i * size + size)
            );

        if (professionalSummary) {
            result.push({ type: "summary", data: professionalSummary });
        }

        return [
            ...result,
            ...education.map(e => ({ type: "education", data: e })),
            ...experience.map(e => ({ type: "experience", data: e })),
            ...projects.map(p => ({ type: "project", data: p })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...awards.map(a => ({ type: "award", data: a })),
            ...chunkArray(skills, 5).map((chunk, i) => ({
                type: "skills-row",
                data: chunk,
                isFirst: i === 0
            })),
            ...chunkArray(languages, 5).map((chunk, i) => ({
                type: "languages-row",
                data: chunk,
                isFirst: i === 0
            })),
        ];
    }, [personalInfo, professionalSummary, education, experience,
        projects, certifications, awards, skills, languages]);

    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);

    const PAGE_HEIGHT = 1123;
    const PAGE_1_HEIGHT = 1050;
    const PAGE_N_HEIGHT = 1000;

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
                const limit = isFirstPage ? PAGE_1_HEIGHT : PAGE_N_HEIGHT;

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

            if (currentPage.length) newPages.push([...currentPage]);
            setPages(newPages);
        };

        const images = Array.from(measureRef.current.querySelectorAll("img"));

        if (images.length === 0) {
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(measure);
                return () => cancelAnimationFrame(r2);
            });
            return () => cancelAnimationFrame(r1);
        }

        let loaded = 0;
        const onLoad = () => {
            loaded++;
            if (loaded === images.length) measure();
        };

        images.forEach(img => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener("load", onLoad);
                img.addEventListener("error", onLoad);
            }
        });

        if (loaded === images.length) {
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

    const Header = ({ data }) => {
        if (!data?.firstName) return null;
        return (
            <div className="bg-[#fff] text-[#000000] px-6 py-5 text-center mb-2">
                <h1 className="text-2xl font-extrabold tracking-wide">
                    {data.firstName} {data.lastName}
                </h1>
                {data.role && (
                    <p className="text-sm font-medium text-black mt-1">{data.role}</p>
                )}
                <div className="mt-3 flex flex-wrap justify-center items-center minWidth-100 gap-4">
                    {data.phone && <ContactItem icon="icon-tabler-mail"
                                                path = {<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />}
                                                text={data.phone} />}
                    {(data.city || data.country) && (
                        <ContactItem icon="http://localhost:5173/images/location3.png"
                                     path={<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0 M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0"/>} text={[data.city, data.country].filter(Boolean).join(", ")}  />
                    )}
                    {(data.nationality || data.gender || data.maritalStatus) && (
                        <ContactItem icon="http://localhost:5173/images/nation3.png"
                                     path={<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0 M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.008 .128 M19 16v3 M19 22v.01" />} text={[data.nationality, data.gender, data.maritalStatus].filter(Boolean).join(", ")} />
                    )}

                    {data.linkedInUrl && <ContactItem icon="http://localhost:5173/images/linkedincopy.png"
                                                      path={<path d="M8 11v5 M8 8v.01 M12 16v-5 M16 16v-3a2 2 0 1 0 -4 0 M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />} text={data.linkedInUrl} />}
                    {data.portfolioUrl && <ContactItem icon="http://localhost:5173/images/linkedincopy.png"
                                                       path={<path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M9 3.6c5 6 7 10.5 7.5 16.2 M6.4 19c3.5 -3.5 6 -6.5 14.5 -6.4 M3.1 10.75c5 0 9.814 -.38 15.314 -5" />} text={data.portfolioUrl} />}
                </div>
            </div>
        );
    };

    const ContactItem = ({ icon, text , path }) => (
        <div className="flex items-center gap-1 secondTempFont">
            <div style={{ backgroundColor: selectedTheme ? selectedTheme.primary : '#5F53F5' }} className={`rounded-full  w-8 h-8 flex justify-center items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`icon icon-tabler icons-tabler-outline icon-tabler-${icon}`}>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    {path}
                </svg>
            </div>

            <span className="text-xs text-black">{text}</span>
        </div>
    );

    const SectionHeader = ({ title }) => (
        <div className="flex items-center mt-2 mb-2 secondTempFont">
            <div style={{ backgroundColor: selectedTheme ? selectedTheme.primary : '#5F53F5' }} className={`text-[#fff] text-[14px] font-bold px-3 py-1 rounded-r-full w-[238px] `}>
                {title}
            </div>
            <div style={{ backgroundColor: selectedTheme ? selectedTheme.primary : '#5F53F5' }} className={`h-[2px] w-full `} />
        </div>
    );

    const Summary = ({ data }) => {
        if (!data) return null;
        return (
            <div className="item px-6 secondTempFont">
                <SectionHeader title="Professional Summary" />
                <p className="text-xs text-[#666666] leading-relaxed mb-1">{data}</p>
            </div>
        );
    };

    const EducationItem = ({ data, index }) => {
        const isFirst = education.indexOf(data) === 0 || index === 0;
        const isLast = education.indexOf(data) === education.length - 1;
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Education" />}
                <div className="grid grid-cols-[180px_1fr] gap-2 items-start">
                    <div>
                        <p className="text-[11px] mt-1 text-[#666666]">
                            {[data.school, data.city, data.country].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-[11px] font-semibold text-[#000000] my-1">
                            {data.startDate} – {data.endDate || "Present"}
                        </p>
                    </div>
                    <div>
                        <p className={`text-[11px] font-bold text-[${theme?theme:'#810B38'}]`}>{data.fieldOfStudy}</p>
                        <p className="text-[11px] text-[#666666]">{data.degree}</p>
                        {data.grade && <p className="text-xs text-[#666666]">GPA: {data.grade}</p>}
                    </div>
                </div>
                {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]' />}
            </div>
        );
    };

    const ExperienceItem = ({ data, index }) => {
        const isFirst = experience.indexOf(data) === 0 || index === 0;
        const isLast = experience.indexOf(data) === experience.length - 1;
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Work Experience" />}
                <div className="grid grid-cols-[180px_1fr] gap-2 items-start">
                    <div>
                        <p className="text-[11px] mt-1 text-gray-500">
                            {[data.employer, data.city, data.country].filter(Boolean).join(", ")}
                        </p>
                        <p className="text-xs font-semibold text-[#000000] my-1">
                            {data.startDate} – {data.endDate || "Present"}
                        </p>
                    </div>
                    <div>
                        <p className={`text-xs font-bold text-[${theme?theme:'#810B38'}]`}>{data.jobTitle}</p>
                        <ul className="text-xs list-disc ml-4 mt-1 text-[#666666] space-y-0.5">
                            {data.responsibilities?.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]' />}
            </div>
        );
    };

    const ProjectItem = ({ data, index }) => {
        const isFirst = projects.indexOf(data) === 0 || index === 0;
        const isLast = projects.indexOf(data) === projects.length - 1;
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Projects" />}
                <div className="grid grid-cols-[180px_1fr] gap-2">
                    <div />
                    <div>
                        <p className={`text-xs font-bold text-[${theme?theme:'#810B38'}]`}>{data.projectTitle}</p>
                        <ul className="text-xs list-disc ml-4 mt-1 text-[#666666] space-y-0.5">
                            {data.keyFeatures?.map((k, i) => (
                                <li key={i}>{k}</li>
                            ))}
                        </ul>
                        {data.projectUrl && (
                            <p className="text-xs mt-1 text-gray-500">
                                Live Demo: <span className="text-blue-500">{data.projectUrl}</span>
                            </p>
                        )}
                    </div>
                </div>
                {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]' />}
            </div>
        );
    };

    const CertificationItem = ({ data, index }) => {
        const isFirst = certifications.indexOf(data) === 0 || index === 0;
        const isLast = certifications.indexOf(data) === certifications.length - 1;
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Certifications" />}
                <div className="grid grid-cols-[180px_1fr] gap-2">
                    <div>
                        <p className="text-xs text-gray-500">{data.issuingOrg}</p>
                        <p className="text-xs font-semibold text-[#000000] mt-0.5">
                            {data.issueingDate}{data.expirationDate ? ` – ${data.expirationDate}` : ""}
                        </p>
                    </div>
                    <div>
                        <p className={`text-xs font-bold text-[${theme?theme:'#810B38'}]`}>{data.certificationName}</p>
                    </div>
                </div>
                {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]' />}
            </div>
        );
    };

    const AwardItem = ({ data, index }) => {
        const isFirst = awards.indexOf(data) === 0 || index === 0;
        const isLast = awards.indexOf(data) === awards.length - 1;
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Awards" />}
                <div className="grid grid-cols-[180px_1fr] gap-2">
                    <div>
                        <p className="text-xs text-gray-500">{data.issueingOrg}</p>
                        <p className="text-xs font-semibold text-[#000000] mt-0.5">
                            {data.issueingDate}{data.expirationDate ? ` – ${data.expirationDate}` : ""}
                        </p>
                    </div>
                    <div>
                        <p className={`text-xs font-bold text-[${theme?theme:'#810B38'}]`}>{data.awardName}</p>
                        {data.description && <p className="text-xs text-[#666666] mt-0.5">{data.description}</p>}
                    </div>
                </div>
                {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]' />}
            </div>
        );
    };

    const DotRating = ({ level }) => (
        <div className="flex gap-1 my-1">
            {[0, 1, 2, 3, 4].map(j => (
                <div
                    className="w-[34px] h-2 rounded-full border"
                    style={{
                        borderColor: selectedTheme?.primary || "#810B38",
                        backgroundColor:
                            j <= level
                                ? selectedTheme?.primary || "#810B38"
                                : "transparent",
                    }}
                />
            ))}
        </div>
    );

    const SkillsRow = ({ data, isFirst }) => {
        return (
            <div className="item px-6 secondTempFont ">
                {isFirst && <SectionHeader title="Skills" />}
                <div className="grid grid-cols-5 gap-x-4 my-2">
                    {data.map((s, i) => (
                        <div key={i}>
                            <p className="text-xs text-[#666666]">{s.skill}</p>
                            <DotRating level={s.level} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const LanguageRow = ({ data, isFirst }) => {
        return (
            <div className="item px-6 secondTempFont">
                {isFirst && <SectionHeader title="Languages" />}
                <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                    {data.map((l, i) => (
                        <div key={i}>
                            <p className="text-xs text-[#666666]">{l.language}</p>
                            <DotRating level={l.level} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header": return <Header data={block.data} />;
            case "summary": return <Summary data={block.data} />;
            case "education": return <EducationItem data={block.data} index={index} />;
            case "experience": return <ExperienceItem data={block.data} index={index} />;
            case "project": return <ProjectItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "award": return <AwardItem data={block.data} index={index} />;
            case "skills-row": return <SkillsRow data={block.data} isFirst={block.isFirst} />;
            case "languages-row": return <LanguageRow data={block.data} isFirst={block.isFirst} />;
            default: return null;
        }
    };

    return (
        <>
            {pages.map((page, pageIndex) => (
                <div
                    key={pageIndex}
                    className="bg-white border border-gray-300 print-page overflow-hidden mb-5"
                    style={{
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        paddingTop: pageIndex !== 0 ? 15 : 0,
                        width: 794,
                        height: PAGE_HEIGHT,
                    }}
                >
                    {page.map((block, index) => renderBlock(block, index))}
                </div>
            ))}

            {createPortal(
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
    );
};

export default ThirdTemplate;