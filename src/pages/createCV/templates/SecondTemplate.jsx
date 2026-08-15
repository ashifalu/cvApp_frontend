import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const SecondTemplate = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#8FC7A8" };
    const PAGE_WIDTH = 794, PAGE_HEIGHT = 1123, PAGE_1_HEIGHT = 1010, PAGE_N_HEIGHT = 1000;
    const FRAME = 18;

    const blocks = useMemo(() => {
        const r = [{ type: "header", data: personalInfo }];
        if (professionalSummary) r.push({ type: "summary", data: professionalSummary });
        return [...r,
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(education || []).map(e => ({ type: "education", data: e })),
            ...((skills?.length > 0) ? [{ type: "skills", data: skills }] : []),
            ...((languages?.length > 0) ? [{ type: "languages", data: languages }] : []),
        ];
    }, [personalInfo, professionalSummary, experience, projects, awards, certifications, education, skills, languages]);

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
                const limit = first ? PAGE_1_HEIGHT : PAGE_N_HEIGHT;
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

    const SectionHeading = ({ children }) => (
        <div className="mb-2">
            <h2 className="text-xs font-bold tracking-[3px] uppercase text-black">{children}</h2>
            <div className="h-[1px] bg-gray-300 w-full mt-1" />
        </div>
    );

    const Header = ({ data }) => (
        <div className="px-8 pt-6 pb-3 text-center eighteenTempFont">
            <h1 className="text-2xl font-bold tracking-[4px] text-black">{data?.firstName?.toUpperCase() || "YOUR"} {data?.lastName?.toUpperCase() || "NAME"}</h1>
            {data?.role && <p className="text-xs tracking-[3px] uppercase text-gray-500 mt-1">{data.role}</p>}
            <div style={{ backgroundColor: "#111" }} className="flex justify-center items-center gap-6 text-[10px] text-white mt-3 py-2 -mx-8">
                {data?.phone && <span>{data.phone}</span>}
                {data?.email && <span>{data.email}</span>}
                {(data?.city || data?.country) && <span>{[data.city, data.country].filter(Boolean).join(", ")}</span>}
                {data?.linkedInUrl && <span>{data.linkedInUrl}</span>}
            </div>
        </div>
    );

    const Summary = ({ data }) => <div className="px-8 py-2 eighteenTempFont"><SectionHeading>Profile</SectionHeading><p className="text-xs text-gray-700 leading-relaxed">{data}</p></div>;
    const ExperienceItem = ({ data, index }) => (
        <div className="px-8 py-2 eighteenTempFont">
            {(experience.indexOf(data)===0||index===0) && <SectionHeading>Experience</SectionHeading>}
            <p className="text-xs text-gray-500">{data.startDate} - {data.endDate||"Present"}</p>
            <p className="text-xs font-bold text-black">{data.jobTitle}</p>
            <p className="text-xs text-gray-600">{data.employer}</p>
            {data.responsibilities?.length > 0 && <p className="text-xs text-gray-700 mt-1">{data.responsibilities.join(" ")}</p>}
        </div>
    );
    const ProjectItem = ({ data, index }) => (<div className="px-8 py-2 eighteenTempFont">{(projects.indexOf(data)===0||index===0)&&<SectionHeading>Projects</SectionHeading>}<p className="text-xs font-bold text-black">{data.projectTitle}</p>{data.responsibilities?.length>0&&<ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}</div>);
    const AwardItem = ({ data, index }) => (<div className="px-8 py-2 eighteenTempFont">{(awards.indexOf(data)===0||index===0)&&<SectionHeading>Awards</SectionHeading>}<p className="text-xs font-bold text-black">{data.awardName}</p></div>);
    const CertificationItem = ({ data, index }) => (<div className="px-8 py-2 eighteenTempFont">{(certifications.indexOf(data)===0||index===0)&&<SectionHeading>Certifications</SectionHeading>}<p className="text-xs font-bold text-black">{data.certificationName}</p></div>);
    const EducationItem = ({ data, index }) => (
        <div className="px-8 py-2 eighteenTempFont">
            {(education.indexOf(data)===0||index===0) && <SectionHeading>Education</SectionHeading>}
            <p className="text-xs text-gray-500">{data.startDate} - {data.endDate||"Present"}</p>
            <p className="text-xs font-bold text-black">{data.fieldOfStudy}</p>
            <p className="text-xs text-gray-600">{data.school}</p>
        </div>
    );
    const Skills = ({ data }) => (
        <div className="px-8 py-2 eighteenTempFont">
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-2">
                {data.map((s,i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-gray-700">{s.skill}</span>
                        <div className="flex gap-1">{[0,1,2,3,4].map(j => <span key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: j <= s.level ? "#111" : "#d1d5db" }} />)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
    const Languages = ({ data }) => <div className="px-8 py-2 eighteenTempFont"><SectionHeading>Languages</SectionHeading><p className="text-xs text-gray-700">{data.map(l=>l.language).join(", ")}</p></div>;

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header": return <Header data={block.data} />;
            case "summary": return <Summary data={block.data} />;
            case "experience": return <ExperienceItem data={block.data} index={index} />;
            case "project": return <ProjectItem data={block.data} index={index} />;
            case "award": return <AwardItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "education": return <EducationItem data={block.data} index={index} />;
            case "skills": return <Skills data={block.data} />;
            case "languages": return <Languages data={block.data} />;
            default: return null;
        }
    };
    const pagesToRender = (currentPage == null) ? pages : (pages.length ? [pages[Math.min(currentPage, pages.length - 1)]] : [[]]);

    return (
        <>
            {pagesToRender.map((page, idx) => {
                const pageIndex = (currentPage == null) ? idx : currentPage;
                return (
                    <div key={pageIndex} style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, backgroundColor: selectedTheme.primary, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', padding: FRAME }}>
                        <div style={{ backgroundColor: "#fff", width: "100%", height: "100%", paddingTop: pageIndex !== 0 ? 15 : 0, paddingBottom: 15 }}>
                            {page.map((b, i) => renderBlock(b, i))}
                        </div>
                    </div>
                );
            })}
            {createPortal(<div ref={measureRef} style={{ position: "absolute", visibility: "hidden", paddingBottom: 15, width: PAGE_WIDTH - FRAME*2, top: 0, left: 0, pointerEvents: "none", boxSizing: "border-box" }}>{blocks.map((b, i) => <div key={`${measureKey}-${i}`}>{renderBlock(b, i)}</div>)}</div>, document.body)}
        </>
    );
};
export default SecondTemplate;