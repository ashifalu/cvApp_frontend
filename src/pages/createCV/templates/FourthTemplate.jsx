import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { createPortal } from 'react-dom'


const FourthTemplate = ({
                            personalInfo,
                            professionalSummary,
                            experience,
                            education,
                            skills,
                            languages,
                            projects,
                            certifications,
                            theme,
                            onPageCount,
                            currentPage
                        }) => {
    console.log("this is fourth")


    let selectedTheme = {}

    { theme && Object.keys(theme).length > 0 ?
        selectedTheme = theme
        :
        selectedTheme = { primary: "#810B38" }
    }

    const blocks = useMemo(() => {
        const result = [{ type: "header", data: personalInfo }];

        if (professionalSummary) {
            result.push({ type: "summary", data: professionalSummary });
        }
        if (skills && skills.length > 0) {
            result.push({ type: "skills", data: skills });
        }

        return [
            ...result,
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(education || []).map(e => ({ type: "education", data: e })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...((languages && languages.length > 0) ? [{ type: "languages", data: languages }] : []),
        ];
    }, [personalInfo, professionalSummary, skills, experience, education, certifications, projects, languages]);

    // ── Pagination scaffolding (identical pattern to ThirdTemplate) ──
    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);

    const PAGE_HEIGHT = 1123;
    const PAGE_1_HEIGHT = 1041;
    const PAGE_N_HEIGHT = 1000;

    useLayoutEffect(() => { onPageCount?.(pages.length); }, [pages.length]);
    useLayoutEffect(() => { setMeasureKey(k => k + 1); }, [blocks]);

    useLayoutEffect(() => {
        if (measureKey === 0) return;
        if (!measureRef.current) return;

        const measure = () => {
            if (!measureRef.current) return;
            const newPages = [];
            let currentPageBlocks = [];
            let currentHeight = 0;
            let isFirstPage = true;

            blocks.forEach((block, i) => {
                const el = measureRef.current?.children[i];
                if (!el) return;
                const blockHeight = el.getBoundingClientRect().height;
                const limit = isFirstPage ? PAGE_1_HEIGHT : PAGE_N_HEIGHT;

                if (currentHeight + blockHeight > limit && currentPageBlocks.length > 0) {
                    newPages.push([...currentPageBlocks]);
                    currentPageBlocks = [block];
                    currentHeight = blockHeight;
                    isFirstPage = false;
                } else {
                    currentPageBlocks.push(block);
                    currentHeight += blockHeight;
                }
            });

            if (currentPageBlocks.length) newPages.push([...currentPageBlocks]);
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
        const onLoad = () => { loaded++; if (loaded === images.length) measure(); };
        images.forEach(img => {
            if (img.complete) loaded++;
            else { img.addEventListener("load", onLoad); img.addEventListener("error", onLoad); }
        });
        if (loaded === images.length) {
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(measure);
                return () => cancelAnimationFrame(r2);
            });
            return () => cancelAnimationFrame(r1);
        }
        return () => images.forEach(img => {
            img.removeEventListener("load", onLoad);
            img.removeEventListener("error", onLoad);
        });
    }, [measureKey, blocks]);

    // ─── Sub-components ─────────────────────────────────────────────────────────

    const Header = ({ data }) => {
        if (!data?.firstName) return null;
        return (
            <div className="px-6 pt-6 pb-4 fourthTempFont">
                <h1 style={{ color: selectedTheme.primary }} className="text-3xl font-extrabold">
                    {data.firstName} {data.lastName}
                </h1>
                {data.role && (
                    <p className="text-lg font-bold text-black mt-1">{data.role}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-black">
                    {data.email && (
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>mail</span>
                            {data.email}
                        </span>
                    )}
                    {data.phone && <span className="text-gray-400">|</span>}
                    {data.phone && (
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>call</span>
                            {data.phone}
                        </span>
                    )}
                    {data.linkedInUrl && <span className="text-gray-400">|</span>}
                    {data.linkedInUrl && (
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>link</span>
                            {data.linkedInUrl}
                        </span>
                    )}
                    {(data.city || data.country) && <span className="text-gray-400">|</span>}
                    {(data.city || data.country) && (
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>location_on</span>
                            {[data.city, data.country].filter(Boolean).join(", ")}
                        </span>
                    )}
                </div>
                <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] w-full mt-3" />
            </div>
        );
    };

    const SectionHeader = ({ title, icon }) => (
        <div className="flex items-center gap-2 mt-3 mb-2 fourthTempFont">
            <span className="material-symbols-outlined text-[18px]" style={{ color: selectedTheme.primary }}>{icon}</span>
            <h2 style={{ color: selectedTheme.primary }} className="text-sm font-extrabold uppercase tracking-wide">
                {title}
            </h2>
            <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] flex-1" />
        </div>
    );

    const Summary = ({ data }) => {
        if (!data) return null;
        return (
            <div className="item px-6 fourthTempFont">
                <p className="text-xs text-[#333333] leading-relaxed">{data}</p>
            </div>
        );
    };

    const Bar = ({ level }) => (
        <div className="w-full h-[6px] rounded-full bg-gray-200 mt-1">
            <div
                className="h-full rounded-full"
                style={{
                    width: `${((level + 1) / 5) * 100}%`,
                    backgroundColor: selectedTheme.primary,
                }}
            />
        </div>
    );

    const Skills = ({ data }) => {
        const half = Math.ceil(data.length / 2);
        const left = data.slice(0, half);
        const right = data.slice(half);
        return (
            <div className="item px-6 fourthTempFont">
                <SectionHeader title="Skills" icon="military_tech" />
                <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                    {left.map((s, i) => (
                        <div key={`l-${i}`}>
                            <p className="text-xs text-[#333333]">{s.skill}</p>
                            <Bar level={s.level} />
                        </div>
                    ))}
                    {right.map((s, i) => (
                        <div key={`r-${i}`} style={{ gridColumn: 2, gridRow: i + 1 }}>
                            <p className="text-xs text-[#333333]">{s.skill}</p>
                            <Bar level={s.level} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const ExperienceItem = ({ data, index }) => {
        const isFirst = experience.indexOf(data) === 0 || index === 0;
        const isLast = experience.indexOf(data) === experience.length - 1;
        return (
            <div className="item px-6 fourthTempFont">
                {isFirst && <SectionHeader title="Experience" icon="work" />}
                <div className="flex justify-between items-baseline">
                    <p style={{ color: selectedTheme.primary }} className="text-sm font-bold">{data.jobTitle}</p>
                    <p style={{ color: selectedTheme.primary }} className="text-xs font-semibold">
                        {[data.city, data.country].filter(Boolean).join(", ")}
                        {(data.city || data.country) && data.startDate ? " | " : ""}
                        {data.startDate&&<p>{data.startDate} - {data.endDate}</p>}
                    </p>
                </div>
                <p className="text-sm text-gray-500 mb-1">{data.employer}</p>
                <ul className="text-xs list-disc ml-4 text-[#333333] space-y-0.5">
                    {data.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                {!isLast && <div className="my-2" />}
            </div>
        );
    };

    const EducationItem = ({ data, index }) => {
        const isFirst = education.indexOf(data) === 0 || index === 0;
        return (
            <div className="item px-6 fourthTempFont">
                {isFirst && <SectionHeader title="Education" icon="school" />}
                <div className="flex justify-between items-baseline">
                    <p style={{ color: selectedTheme.primary }} className="text-sm font-bold">
                        {[data.degree, data.fieldOfStudy].filter(Boolean).join(" in ")}
                    </p>
                    {data.startDate&&<p style={{color: selectedTheme.primary}} className="text-xs font-semibold">
                        {data.startDate} - {data.endDate || "Present"}
                    </p>}
                </div>
                <p className="text-sm text-gray-500">
                    {[data.school, data.city, data.country].filter(Boolean).join(" – ")}
                </p>
                {data.grade && (
                    <p className="text-xs text-[#333333] mt-1">GPA: {data.grade}</p>
                )}
            </div>
        );
    };

    const CertificationItem = ({ data, index }) => {
        const isFirst = certifications.indexOf(data) === 0 || index === 0;
        const isLast = certifications.indexOf(data) === certifications.length - 1;
        return (
            <div className="item px-6 fourthTempFont">
                {isFirst && <SectionHeader title="Certifications" icon="workspace_premium" />}
                <div className="flex justify-between items-baseline">
                    <p style={{ color: selectedTheme.primary }} className="text-sm font-bold">{data.certificationName}</p>
                    {data.issueingDate && (
                        <p style={{ color: selectedTheme.primary }} className="text-xs font-semibold">
                            {data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}
                        </p>
                    )}
                </div>
                {data.issuingOrg && <p className="text-sm text-gray-500">{data.issuingOrg}</p>}
                {!isLast && <div className="my-2" />}
            </div>
        );
    };

    const ProjectItem = ({ data, index }) => {
        const isFirst = projects.indexOf(data) === 0 || index === 0;
        const isLast = projects.indexOf(data) === projects.length - 1;
        return (
            <div className="item px-6 fourthTempFont">
                {isFirst && <SectionHeader title="Projects" icon="folder" />}
                <div className="flex justify-between items-baseline">
                    <p style={{ color: selectedTheme.primary }} className="text-sm font-bold">{data.projectTitle}</p>
                    {data.startDate && (
                        <p style={{ color: selectedTheme.primary }} className="text-xs font-semibold">
                            {data.startDate} - {data.endDate || "Present"}
                        </p>
                    )}
                </div>
                {data.role && <p className="text-sm text-gray-500">{data.role}</p>}
                {data.description && <p className="text-xs text-[#333333] mt-1">{data.description}</p>}
                <ul className="text-xs list-disc ml-4 mt-1 text-[#333333] space-y-0.5">
                    {data.keyFeatures?.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
                {data.projectUrl && (
                    <p className="text-xs mt-1">
                        Live Demo: <span className="text-blue-500">{data.projectUrl}</span>
                    </p>
                )}
                {!isLast && <div className="my-2" />}
            </div>
        );
    };

    const Languages = ({ data }) => (
        <div className="item px-6 fourthTempFont">
            <SectionHeader title="Languages" icon="public" />
            <div className="flex flex-wrap justify-between gap-y-2">
                {data.map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[#333333]">{l.language}</span>
                        <span className="text-xs text-gray-500">
                            {["Beginner", "Elementary", "Intermediate", "Advanced", "Fluent"][l.level] || ""}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header":        return <Header data={block.data} />;
            case "summary":       return <Summary data={block.data} />;
            case "skills":        return <Skills data={block.data} />;
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "education":     return <EducationItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "languages":     return <Languages data={block.data} />;
            default: return null;
        }
    };

    return (
        <>
            {(currentPage === undefined || currentPage === null
                    ? pages
                    : pages.length
                        ? [pages[Math.min(currentPage, pages.length - 1)]]
                        : []
            ).map((page, idx) => {
                const pageIndex = (currentPage === undefined || currentPage === null) ? idx : currentPage;
                return (
                    <div
                        key={pageIndex}
                        style={{
                            backgroundColor: "#ffffff",
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
    );
};

export default FourthTemplate;