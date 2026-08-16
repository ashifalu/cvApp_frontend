import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TemplateTwelve = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#2C3E5D", secondary: "#F4D7C3" };
    const SIDEBAR_WIDTH = 230, PAGE_WIDTH = 794, MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH, PAGE_HEIGHT = 1123;
    const PAGE_1_MAIN = PAGE_HEIGHT - 60, PAGE_N_MAIN = PAGE_HEIGHT - 60;

    const blocks = useMemo(() => {
        const r = [];
        if (professionalSummary) r.push({ type: "summary", data: professionalSummary });
        if (skills?.length > 0) r.push({ type: "skills", data: skills });
        return [...r,
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(education || []).map(e => ({ type: "education", data: e })),
        ];
    }, [professionalSummary, skills, experience, projects, awards, certifications, education]);

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

    const Sidebar = ({ data }) => {
        const initials = [data?.firstName?.[0], data?.lastName?.[0]].filter(Boolean).join("").toUpperCase();
        return (
            <div style={{ width: SIDEBAR_WIDTH, backgroundColor: selectedTheme.secondary }} className="px-6 py-8 fifteenTempFont h-full">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-white/40 flex items-center justify-center mb-6">
                    {data?.photo ? <img src={data.photo} alt="profile" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-gray-500">{initials || "?"}</span>}
                </div>
                <h1 className="text-2xl font-serif text-black leading-tight">{data?.firstName || "Your"} {data?.lastName || "Name"}</h1>
                {data?.role && <p className="text-xs tracking-widest uppercase text-gray-700 mt-2">{data.role}</p>}

                <div style={{ backgroundColor: selectedTheme.primary }} className="mt-8 -mx-6 px-6 py-2">
                    <h3 className="text-xs font-bold uppercase text-white">Contact</h3>
                </div>
                <div className="text-[11px] text-gray-700 mt-3 space-y-1">
                    {data?.phone && <p>Mobile: {data.phone}</p>}
                    {data?.email && <p className="break-all">Email: {data.email}</p>}
                    {(data?.city || data?.country) && <p>{[data.city, data.country].filter(Boolean).join(", ")}</p>}
                </div>
            </div>
        );
    };

    const SectionHeading = ({ children }) => (
        <div style={{ backgroundColor: selectedTheme.secondary }} className="px-3 py-1.5 mb-3">
            <h2 className="text-xs font-bold uppercase text-black">{children}</h2>
        </div>
    );

    const Summary = ({ data }) => <div className="mb-4"><SectionHeading>Career Objective</SectionHeading><p className="text-xs text-white/90 leading-relaxed">{data}</p></div>;
    const Skills = ({ data }) => <div className="mb-4"><SectionHeading>Professional Profile</SectionHeading><ul className="text-xs list-disc ml-4 text-white/90 space-y-0.5">{data.map((s,i)=><li key={i}>{s.skill||s}</li>)}</ul></div>;
    const ExperienceItem = ({ data, index }) => (
        <div className="mb-4">
            {(experience.indexOf(data)===0||index===0) && <SectionHeading>Experience</SectionHeading>}
            <p className="text-xs font-bold text-white">{data.jobTitle}</p>
            <p className="text-xs text-white/70">{[data.employer].filter(Boolean).join(", ")} {data.startDate?`| ${data.startDate} - ${data.endDate||"Present"}`:""}</p>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-white/90 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const ProjectItem = ({ data, index }) => (<div className="mb-4">{(projects.indexOf(data)===0||index===0)&&<SectionHeading>Projects</SectionHeading>}<p className="text-xs font-bold text-white">{data.projectTitle}</p>{data.responsibilities?.length>0&&<ul className="text-xs list-disc ml-4 mt-1 text-white/90 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}</div>);
    const AwardItem = ({ data, index }) => (<div className="mb-4">{(awards.indexOf(data)===0||index===0)&&<SectionHeading>Awards</SectionHeading>}<p className="text-xs font-bold text-white">{data.awardName}</p></div>);
    const CertificationItem = ({ data, index }) => (<div className="mb-4">{(certifications.indexOf(data)===0||index===0)&&<SectionHeading>Certifications</SectionHeading>}<p className="text-xs font-bold text-white">{data.certificationName}</p></div>);
    const EducationItem = ({ data, index }) => (
        <div className="mb-4">
            {(education.indexOf(data)===0||index===0) && <SectionHeading>Education</SectionHeading>}
            <p className="text-xs font-bold text-white uppercase">{data.school}</p>
            <p className="text-xs text-white/80">{data.degree ? `${data.degree} in ${data.fieldOfStudy||""}` : data.fieldOfStudy}</p>
            {data.endDate && <p className="text-xs text-white/60">Graduated in {data.endDate}</p>}
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "summary": return <Summary data={block.data} />;
            case "skills": return <Skills data={block.data} />;
            case "experience": return <ExperienceItem data={block.data} index={index} />;
            case "project": return <ProjectItem data={block.data} index={index} />;
            case "award": return <AwardItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "education": return <EducationItem data={block.data} index={index} />;
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
                    <div key={pageIndex} style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, backgroundColor: selectedTheme.primary, boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: "flex" }}>
                        {isFirst ? <Sidebar data={personalInfo} /> : <div style={{ width: SIDEBAR_WIDTH, backgroundColor: selectedTheme.secondary }} />}
                        <div style={{ width: MAIN_WIDTH }} className="px-8 py-8 fifteenTempFont">{page.map((b, i) => renderBlock(b, i))}</div>
                    </div>
                );
            })}
            {createPortal(<div ref={measureRef} style={{ position: "absolute", visibility: "hidden", width: MAIN_WIDTH, top: 0, left: 0, pointerEvents: "none", boxSizing: "border-box" }} className="px-8 py-8 fifteenTempFont">{blocks.map((b, i) => <div key={`${measureKey}-${i}`}>{renderBlock(b, i)}</div>)}</div>, document.body)}
        </>
    );
};export default TemplateTwelve;