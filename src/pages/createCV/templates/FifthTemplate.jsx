import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const FifthTemplate = ({
                           personalInfo,
                           professionalSummary,
                           skills,
                           projects,
                           experience,
                           certifications,
                           awards,
                           education,
                           languages,
                           theme,
                           onPageCount,
                           currentPage
                       }) => {

    const selectedTheme = (theme && Object.keys(theme).length > 0)
        ? theme
        : { primary: "#3B9FD4" };

    const HEADER_HEIGHT = 250;
    const SIDEBAR_WIDTH = 260;
    const PAGE_WIDTH = 794;
    const MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH;
    const PAGE_HEIGHT = 1123;
    const PAGE_1_MAIN_HEIGHT = 783;
    const PAGE_N_MAIN_HEIGHT = PAGE_HEIGHT - 40;

    const blocks = useMemo(() => {
        const result = [];
        if (professionalSummary) {
            result.push({ type: "summary", data: professionalSummary });
        }

        return [
            ...result,
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...(education || []).map(e => ({ type: "education", data: e })),
        ];
    }, [professionalSummary, projects, experience, certifications, awards, education]);

    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);

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
                const limit = isFirstPage ? PAGE_1_MAIN_HEIGHT : PAGE_N_MAIN_HEIGHT;

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
            setPages(newPages.length ? newPages : [[]]);
        };

        const images = Array.from(measureRef.current.querySelectorAll("img"));
        const runWhenReady = () => {
            const r1 = requestAnimationFrame(() => {
                const r2 = requestAnimationFrame(measure);
                return () => cancelAnimationFrame(r2);
            });
            return () => cancelAnimationFrame(r1);
        };

        const waitImages = () => {
            if (images.length === 0) { runWhenReady(); return; }
            let loaded = 0;
            const onLoad = () => { loaded++; if (loaded === images.length) runWhenReady(); };
            images.forEach(img => {
                if (img.complete) loaded++;
                else { img.addEventListener("load", onLoad); img.addEventListener("error", onLoad); }
            });
            if (loaded === images.length) runWhenReady();
        };

        if (document.fonts?.ready) document.fonts.ready.then(waitImages);
        else waitImages();

    }, [measureKey, blocks]);

    const Header = ({ data }) => {
        const initials = [data?.firstName?.[0], data?.lastName?.[0]].filter(Boolean).join("").toUpperCase();
        return (
            <div className="flex items-center gap-8 px-10 pt-10 pb-6 fifthTempFont" style={{ height: HEADER_HEIGHT }}>
                {data?.photo && <div
                    className="w-[190px] h-[190px] rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ border: `4px solid ${selectedTheme.primary}` }}
                >
                    {data?.photo
                        ? <img src={data.photo} alt="profile" className="w-full h-full object-cover" />
                        : <span className="text-4xl font-bold" style={{ color: selectedTheme.primary }}>{initials || "?"}</span>
                    }
                </div>}
                <div>
                    <h1 className="text-5xl font-light text-black">
                        {data?.firstName || "Your Name"} {data?.lastName || ""}
                    </h1>
                    {data?.role && (
                        <p className="text-base tracking-wide uppercase mt-2" style={{ color: selectedTheme.primary }}>
                            {data.role}
                        </p>
                    )}
                    <div style={{ backgroundColor: selectedTheme.primary }} className="h-[3px] w-[470px] mt-4" />
                </div>
            </div>
        );
    };

    const SidebarHeading = ({ children }) => (
        <div className="mb-3">
            <h3 className="text-sm font-bold tracking-wide uppercase text-black">{children}</h3>
        </div>
    );

    const Sidebar = ({ data, skills, languages }) => (
        <div style={{ width: SIDEBAR_WIDTH, backgroundColor: `${selectedTheme.primary}26` }} className="px-6 py-6 fifthTempFont">

            {(data?.phone || data?.email || data?.portfolioUrl) && (
                <div className="mb-6">
                    <SidebarHeading>Contact</SidebarHeading>
                    <div className="space-y-2 text-xs text-gray-700">
                        {data?.phone && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>call</span>
                                {data.phone}
                            </div>
                        )}
                        {data?.email && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>mail</span>
                                <span className="break-all">{data.email}</span>
                            </div>
                        )}
                        {data?.portfolioUrl && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px]" style={{ color: selectedTheme.primary }}>language</span>
                                <span className="break-all">{data.portfolioUrl}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] w-full mt-4" />
                </div>
            )}

            {(data?.city || data?.country) && (
                <div className="mb-6">
                    <SidebarHeading>Address</SidebarHeading>
                    <p className="text-xs text-gray-700 leading-relaxed">
                        {[data.city, data.country].filter(Boolean).join(", ")}
                    </p>
                    <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] w-full mt-4" />
                </div>
            )}

            {skills && skills.length > 0 && (
                <div className="mb-6">
                    <SidebarHeading>Skills</SidebarHeading>
                    <ul className="space-y-2 text-xs text-gray-700">
                        {skills.map((s, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: selectedTheme.primary }} />
                                {s.skill || s}
                            </li>
                        ))}
                    </ul>
                    <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] w-full mt-4" />
                </div>
            )}

            {languages && languages.length > 0 && (
                <div>
                    <SidebarHeading>Languages</SidebarHeading>
                    <ul className="space-y-2 text-xs text-gray-700">
                        {languages.map((l, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: selectedTheme.primary }} />
                                {l.language}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const SectionHeading = ({ children }) => (
        <div className="mb-3">
            <h2 className="text-sm font-bold tracking-wide uppercase text-black">{children}</h2>
        </div>
    );

    const Summary = ({ data }) => (
        <div className="mb-4">
            {data && (
                <div className="mb-6">
                    <SidebarHeading>Profile</SidebarHeading>
                    <p className="text-xs text-gray-600 leading-relaxed">{data}</p>
                    <div style={{ backgroundColor: selectedTheme.primary }} className="h-[2px] w-full mt-4" />
                </div>
            )}
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <div className="mb-4">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <p className="text-sm font-bold" style={{ color: selectedTheme.primary }}>{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && (
                <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
            {data.projectUrl && (
                <p className="text-xs mt-1 text-gray-600">
                    Live Demo: <span className="text-blue-500">{data.projectUrl}</span>
                </p>
            )}
        </div>
    );

    const ExperienceItem = ({ data, index }) => (
        <div className="mb-4">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Experience</SectionHeading>}
            <div className="flex gap-4">
                <div className="w-[90px] shrink-0 text-xs font-semibold text-gray-700 pt-0.5">
                    {data.startDate} - {data.endDate || "Now"}
                </div>
                <div className="flex-1 border-l-2 pl-4" style={{ borderColor: selectedTheme.primary }}>
                    <p className="text-sm font-bold text-black">{data.jobTitle}</p>
                    <p className="text-xs text-gray-500">{[data.employer, data.city, data.country].filter(Boolean).join(", ")}</p>
                    {data.responsibilities?.length > 0 && (
                        <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                            {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );

    const CertificationItem = ({ data, index }) => (
        <div className="mb-4">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading>Certifications</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-sm font-bold" style={{ color: selectedTheme.primary }}>{data.certificationName}</p>
                {data.issueingDate && (
                    <p className="text-xs text-gray-600">
                        {data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}
                    </p>
                )}
            </div>
            {data.issuingOrg && <p className="text-xs text-gray-500">{data.issuingOrg}</p>}
        </div>
    );

    const AwardItem = ({ data, index }) => (
        <div className="mb-4">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading>Awards</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-sm font-bold" style={{ color: selectedTheme.primary }}>{data.awardName}</p>
                {data.issueingDate && (
                    <p className="text-xs text-gray-600">
                        {data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}
                    </p>
                )}
            </div>
            {data.issueingOrg && <p className="text-xs text-gray-500">{data.issueingOrg}</p>}
            {data.description && <p className="text-xs text-gray-500 mt-0.5">{data.description}</p>}
        </div>
    );

    const EducationItem = ({ data, index }) => (
        <div className="mb-4">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading>Education</SectionHeading>}
            <div className="flex gap-6">
                <div className="w-[90px] shrink-0 text-xs font-semibold text-gray-700">
                    {data.startDate} - {data.endDate || "Present"}
                </div>
                <div>
                    <p className="text-sm font-bold text-black">{data.fieldOfStudy}</p>
                    <p className="text-xs text-gray-600 mt-1">
                        {[data.school, data.city, data.country].filter(Boolean).join(", ")}
                    </p>
                </div>
            </div>
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "summary":       return <Summary data={block.data} />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "award":         return <AwardItem data={block.data} index={index} />;
            case "education":     return <EducationItem data={block.data} index={index} />;
            default: return null;
        }
    };

    const pagesToRender = (currentPage === undefined || currentPage === null)
        ? pages
        : (pages.length ? [pages[Math.min(currentPage, pages.length - 1)]] : [[]]);

    return (
        <>
            {pagesToRender.map((page, idx) => {
                const pageIndex = (currentPage === undefined || currentPage === null) ? idx : currentPage;
                const isFirstPage = pageIndex === 0;
                return (
                    <div
                        key={pageIndex}
                        style={{
                            width: PAGE_WIDTH,
                            height: PAGE_HEIGHT,
                            backgroundColor: "#ffffff",
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {isFirstPage && <Header data={personalInfo} />}
                        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                            {isFirstPage
                                ? <Sidebar data={personalInfo} skills={skills} languages={languages} />
                                : <div style={{ width: SIDEBAR_WIDTH, backgroundColor: "#EAF0F6" }} />
                            }
                            <div style={{ width: MAIN_WIDTH }} className="px-8 py-6 fifthTempFont">
                                {page.map((block, index) => renderBlock(block, index))}
                            </div>
                        </div>
                    </div>
                );
            })}

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

export default FifthTemplate;