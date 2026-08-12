import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const FirstTemplate = ({
                           personalInfo,
                           professionalSummary,
                           skills,
                           projects,
                           experience,
                           certifications,
                           education,
                           theme,
                           onPageCount,
                           currentPage,
                       }) => {

    const selectedTheme = (theme && Object.keys(theme).length > 0)
        ? theme
        : { primary: "#1d4ed8", secondary: "#1d4ed8" };

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
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(education || []).map(e => ({ type: "education", data: e })),
        ];
    }, [personalInfo, professionalSummary, skills, projects, experience, certifications, education]);

    // ── Pagination scaffolding (identical pattern to SecondTemplate) ──
    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);

    const PAGE_HEIGHT = 1123;
    const PAGE_1_HEIGHT = 1035;
    const PAGE_N_HEIGHT = 1000;

    useEffect(() => { onPageCount?.(pages.length); }, [pages.length]);
    useLayoutEffect(() => { setMeasureKey(k => k + 1); }, [blocks]);

    useLayoutEffect(() => {
        if (measureKey === 0 || !measureRef.current) return;

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

    // ── Section header with underline, matching the reference design ──
    const SectionHeading = ({ children }) => (
        <div className="mb-2">
            <h2 className="text-sm font-bold tracking-wide uppercase text-black">{children}</h2>
            <div className="h-[1.5px] bg-black w-full mt-1" />
        </div>
    );

    const Header = ({ data }) => (
        <div className="px-8 pt-8 pb-4 flex justify-between items-start thirdTempFont">
            <div>
                <h1 className="text-3xl font-bold text-black">
                    {data?.firstName || "Your Name"} {data?.lastName || ""}
                </h1>
                {data?.role && (
                    <p style={{ color: selectedTheme.primary }} className="text-sm mt-1">
                        {data.role}
                    </p>
                )}
            </div>
            <div className="border border-gray-300 rounded-md px-4 py-2 text-xs space-y-1 min-w-[220px]">
                {data?.email && (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>mail</span>
                        <span>{data.email}</span>
                    </div>
                )}
                {data?.phone && (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>call</span>
                        <span>{data.phone}</span>
                    </div>
                )}
                {(data?.city || data?.country) && (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>location_on</span>
                        <span>{[data.city, data.country].filter(Boolean).join(", ")}</span>
                    </div>
                )}
                {data?.linkedInUrl && (
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>link</span>
                        <a href={data.linkedInUrl} className="truncate">{data.linkedInUrl}</a>
                    </div>
                )}
            </div>
        </div>
    );

    const Summary = ({ data }) => (
        <div className="px-8 py-3 thirdTempFont">
            <SectionHeading>Summary</SectionHeading>
            <p className="text-xs text-gray-800 leading-relaxed">{data}</p>
        </div>
    );

    const Skills = ({ data }) => (
        <div className="px-8 py-3 thirdTempFont">
            <SectionHeading>Skills</SectionHeading>
            <p className="text-xs text-gray-800 leading-relaxed">
                {data.map(s => s.skill || s).join(" • ")}
            </p>
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <div className="px-8 py-2 thirdTempFont">
            {index === (projects?.indexOf(data) === 0 ? projects.indexOf(data) : index) && projects?.indexOf(data) === 0 && (
                <SectionHeading>Projects</SectionHeading>
            )}
            <p style={{ color: selectedTheme.primary }} className="text-xs font-bold">{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && (
                <ul className="list-disc ml-4 text-xs mt-1 space-y-1 text-gray-800">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
            {data.description && <p className="text-xs mt-1 text-gray-800">{data.description}</p>}
            {data.projectUrl && (
                <p className="text-xs mt-1">
                    Live Demo: <a href={data.projectUrl} className="text-blue-600 hover:underline">{data.projectUrl}</a>
                </p>
            )}
        </div>
    );

    const ExperienceItem = ({ data }) => (
        <div className="px-8 py-2 thirdTempFont">
            {experience?.indexOf(data) === 0 && <SectionHeading>Professional Experience</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p style={{ color: selectedTheme.primary }} className="text-xs font-bold">{data.jobTitle}</p>
                {data.startDate && (
                    <p className="text-xs font-medium text-gray-700">
                        {data.startDate} - {data.endDate || "Present"}
                    </p>
                )}
            </div>
            <p className="text-xs text-gray-600">
                {[data.employer, data.city, data.country].filter(Boolean).join(", ")}
            </p>
            {data.responsibilities?.length > 0 && (
                <ul className="list-disc ml-4 text-xs mt-1 space-y-1 text-gray-800">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
        </div>
    );

    const CertificationItem = ({ data }) => (
        <div className="px-8 py-2 thirdTempFont">
            {certifications?.indexOf(data) === 0 && <SectionHeading>Certifications</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-semibold">{data.certificationName}</p>
                {data.issueingDate && (
                    <p className="text-xs font-medium text-gray-700">
                        {data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}
                    </p>
                )}
            </div>
            {data.issuingOrg && <p className="text-xs text-gray-600">{data.issuingOrg}</p>}
        </div>
    );

    const EducationItem = ({ data }) => (
        <div className="px-8 py-2 thirdTempFont">
            {education?.indexOf(data) === 0 && <SectionHeading>Education</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p style={{ color: selectedTheme.primary }} className="text-xs font-bold">{data.fieldOfStudy}</p>
                {data.startDate && (
                    <p className="text-xs font-medium text-gray-700">
                        {data.startDate} - {data.endDate || "Present"}
                    </p>
                )}
            </div>
            <p className="text-xs text-gray-600">
                {[data.school, data.city, data.country].filter(Boolean).join(", ")}
            </p>
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header":        return <Header data={block.data} />;
            case "summary":       return <Summary data={block.data} />;
            case "skills":        return <Skills data={block.data} />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "education":     return <EducationItem data={block.data} index={index} />;
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

export default FirstTemplate;