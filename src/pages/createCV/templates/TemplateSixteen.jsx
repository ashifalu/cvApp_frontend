import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TemplateSixteen = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#1a1a1a" };
    const SIDEBAR_WIDTH = 220, PAGE_WIDTH = 794, MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH, PAGE_HEIGHT = 1123;
    const HEADER_HEIGHT = 195; // photo-box height on page 1
    const PAGE_1_MAIN = PAGE_HEIGHT - HEADER_HEIGHT - 50, PAGE_N_MAIN = PAGE_HEIGHT - 50;

    const blocks = useMemo(() => [
        ...(experience || []).map(e => ({ type: "experience", data: e })),
        ...(projects || []).map(p => ({ type: "project", data: p })),
        ...(awards || []).map(a => ({ type: "award", data: a })),
        ...(certifications || []).map(c => ({ type: "certification", data: c })),
        ...((skills?.length > 0) ? [{ type: "skills", data: skills }] : []),
        ...((education?.length > 0) ? [{ type: "education", data: education }] : []),
    ], [experience, projects, awards, certifications, skills, education]);

    const measureRef = useRef(); const [measureKey, setMeasureKey] = useState(0); const [pages, setPages] = useState([]);
    useEffect(() => { onPageCount?.(pages.length); }, [pages.length]);
    useLayoutEffect(() => { setMeasureKey(k => k + 1); }, [blocks]);
    useLayoutEffect(() => {
        if (measureKey === 0 || !measureRef.current) return;
        const measure = () => {
            if (!measureRef.current) return;
            const newPages = []; let cur = [], h = 0, first = true;
            blocks.forEach((b, i) => {
                const el = measureRef.current?.children[i]; if (!el) return;
                const bh = el.getBoundingClientRect().height;
                const limit = first ? PAGE_1_MAIN : PAGE_N_MAIN;
                if (h + bh > limit && cur.length > 0) { newPages.push([...cur]); cur = [b]; h = bh; first = false; }
                else { cur.push(b); h += bh; }
            });
            if (cur.length) newPages.push([...cur]);
            setPages(newPages.length ? newPages : [[]]);
        };
        const images = Array.from(measureRef.current.querySelectorAll("img"));
        const run = () => { const r1 = requestAnimationFrame(() => { const r2 = requestAnimationFrame(measure); return () => cancelAnimationFrame(r2); }); return () => cancelAnimationFrame(r1); };
        const wait = () => { if (images.length === 0) { run(); return; } let loaded = 0; const onLoad = () => { loaded++; if (loaded === images.length) run(); }; images.forEach(img => { if (img.complete) loaded++; else { img.addEventListener("load", onLoad); img.addEventListener("error", onLoad); } }); if (loaded === images.length) run(); };
        if (document.fonts?.ready) document.fonts.ready.then(wait); else wait();
    }, [measureKey, blocks]);

    // ─── Header row: gray photo box (left) + white name/title area (right) ───
    const HeaderRow = ({ data }) => {
        const initials = [data?.firstName?.[0], data?.lastName?.[0]].filter(Boolean).join("").toUpperCase();
        return (
            <div style={{ height: HEADER_HEIGHT }} className="flex sixteenTempFont">
                <div style={{ width: SIDEBAR_WIDTH, backgroundColor: "#c9c9c9" }} className="flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-400 flex items-center justify-center">
                        {data?.photo
                            ? <img src={data.photo} alt="profile" className="w-full h-full object-cover" />
                            : <span className="text-2xl font-bold text-white">{initials || "?"}</span>
                        }
                    </div>
                </div>
                <div style={{ width: MAIN_WIDTH }} className="flex flex-col justify-center px-8">
                    <h1 className="text-3xl font-extrabold text-black leading-tight">
                        {data?.firstName?.toUpperCase() || "YOUR"} {data?.lastName?.toUpperCase() || "NAME"}
                    </h1>
                    {data?.role && <p className="text-lg font-bold text-black mt-1">{data.role?.toUpperCase()}</p>}
                </div>
            </div>
        );
    };

    // ─── Sidebar: solid black, starts below header row, full height on every page ───
    const SidebarHeading = ({ children }) => <h3 className="text-xs font-bold uppercase tracking-wide text-white mb-2">{children}</h3>;

    const Sidebar = ({ data, summary }) => (
        <div style={{ width: SIDEBAR_WIDTH, backgroundColor: "#111111" }} className="px-6 py-6 sixteenTempFont h-full">
            {summary && (
                <div className="mb-6">
                    <SidebarHeading>About Me</SidebarHeading>
                    <p className="text-[11px] text-gray-300 leading-relaxed">{summary}</p>
                </div>
            )}
            {(data?.phone || data?.email || data?.city) && (
                <div className="mb-6">
                    <SidebarHeading>Contact Me</SidebarHeading>
                    <div className="text-[11px] text-gray-300 space-y-2">
                        {(data?.city || data?.country) && (
                            <p className="flex items-start gap-2"><span className="material-symbols-outlined text-[13px] shrink-0">location_on</span>{[data.city, data.country].filter(Boolean).join(", ")}</p>
                        )}
                        {data?.phone && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[13px] shrink-0">call</span>{data.phone}</p>}
                        {data?.email && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[13px] shrink-0">mail</span><span className="break-all">{data.email}</span></p>}
                        {data?.linkedInUrl && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[13px] shrink-0">link</span><span className="break-all">{data.linkedInUrl}</span></p>}
                    </div>
                </div>
            )}
        </div>
    );

    // ─── Main column sections ───
    const SectionHeading = ({ children }) => <h2 className="text-2xl font-extrabold text-black mb-3">{children}</h2>;

    const ExperienceItem = ({ data, index }) => (
        <div className="mb-4">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Career</SectionHeading>}
            <div className="flex justify-between items-baseline mb-1">
                <p className="text-xs font-bold text-black">{data.jobTitle}{data.employer ? ` –  ${data.employer}` : ""}</p>
                <p className="text-xs font-semibold text-gray-700 shrink-0 ml-2">{data.startDate} - {data.endDate || "Present"}</p>
            </div>
            {data.responsibilities?.length > 0 && (
                <p className="text-xs text-gray-700 leading-relaxed">{data.responsibilities.join(" ")}</p>
            )}
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <div className="mb-4">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && <p className="text-xs text-gray-700 leading-relaxed mt-1">{data.responsibilities.join(" ")}</p>}
        </div>
    );

    const AwardItem = ({ data, index }) => (
        <div className="mb-4">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading>Awards</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.awardName}</p>
            {data.description && <p className="text-xs text-gray-700 mt-1">{data.description}</p>}
        </div>
    );

    const CertificationItem = ({ data, index }) => (
        <div className="mb-4">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading>Certifications</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.certificationName}</p>
            {data.issuingOrg && <p className="text-xs text-gray-700">{data.issuingOrg}</p>}
        </div>
    );

    // Flat bordered bar — matches the reference's segmented rectangle style, not rounded pills
    const SkillBar = ({ level }) => (
        <div className="flex-1 h-[9px] border border-black">
            <div className="h-full bg-black" style={{ width: `${((level + 1) / 5) * 100}%` }} />
        </div>
    );

    const Skills = ({ data }) => {
        const half = Math.ceil(data.length / 2);
        const left = data.slice(0, half);
        const right = data.slice(half);
        return (
            <div className="mb-4">
                <SectionHeading>Skills</SectionHeading>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                    {[left, right].map((col, ci) => (
                        <div key={ci} className="space-y-4">
                            {col.map((s, i) => (
                                <div key={i}>
                                    <p className="text-xs text-black mb-1">{s.skill}</p>
                                    <SkillBar level={s.level} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const Education = ({ data }) => (
        <div className="mb-4">
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-2">
                {data.map((e, i) => (
                    <div key={i} className="grid grid-cols-[110px_1fr_1fr] text-xs text-black">
                        <span>{e.startDate} - {e.endDate || "Present"}</span>
                        <span>{e.fieldOfStudy || e.degree}</span>
                        <span>{e.school}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "award":         return <AwardItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "skills":        return <Skills data={block.data} />;
            case "education":     return <Education data={block.data} />;
            default: return null;
        }
    };

    const pagesToRender = (currentPage == null) ? pages : (pages.length ? [pages[Math.min(currentPage, pages.length - 1)]] : [[]]);

    return (
        <>
            {pagesToRender.map((page, idx) => {
                const pageIndex = (currentPage == null) ? idx : currentPage;
                const isFirst = pageIndex === 0;
                return (
                    <div key={pageIndex} style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, backgroundColor: "#fff", boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: "flex", flexDirection: "column" }}>
                        {isFirst && <HeaderRow data={personalInfo} />}
                        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                            <Sidebar data={personalInfo} summary={professionalSummary} />
                            <div style={{ width: MAIN_WIDTH }} className="px-8 py-6 sixteenTempFont">
                                {page.map((b, i) => renderBlock(b, i))}
                            </div>
                        </div>
                    </div>
                );
            })}
            {createPortal(
                <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", width: MAIN_WIDTH, top: 0, left: 0, pointerEvents: "none", boxSizing: "border-box" }} className="px-8 py-6 sixteenTempFont">
                    {blocks.map((b, i) => <div key={`${measureKey}-${i}`}>{renderBlock(b, i)}</div>)}
                </div>, document.body
            )}
        </>
    );
};
export default TemplateSixteen;