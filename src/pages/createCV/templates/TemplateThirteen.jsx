import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TemplateThirteen = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#5B6C9B" };
    const PAGE_WIDTH = 794, PAGE_HEIGHT = 1123, PAGE_1_HEIGHT = 1035, PAGE_N_HEIGHT = 1000;

    const blocks = useMemo(() => {
        const r = [{ type: "header", data: personalInfo }];
        if (professionalSummary) r.push({ type: "summary", data: professionalSummary });
        if (skills?.length > 0) r.push({ type: "skills", data: skills });
        return [...r,
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(education || []).map(e => ({ type: "education", data: e })),
            ...((languages?.length > 0) ? [{ type: "languages", data: languages }] : []),
        ];
    }, [personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages]);

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
        <div style={{ backgroundColor: selectedTheme.primary }} className="px-3 py-1.5 mb-3">
            <h2 className="text-xs font-bold tracking-wide uppercase text-white">{children}</h2>
        </div>
    );

    const Header = ({ data }) => (
        <div className="px-10 pt-10 pb-4 flex justify-between items-start thirteenTempFont">
            <div>
                <h1 className="text-2xl font-bold" style={{ color: selectedTheme.primary }}>{data?.firstName || "Your"} {data?.lastName || "Name"}</h1>
                {data?.role && <p className="text-xs text-gray-600 mt-1">{data.role}</p>}
            </div>
            <div className="text-right text-[11px] text-gray-700 space-y-0.5">
                {data?.email && <p>{data.email}</p>}
                {data?.phone && <p>{data.phone}</p>}
                {data?.portfolioUrl && <p>{data.portfolioUrl}</p>}
                {data?.linkedInUrl && <p>{data.linkedInUrl}</p>}
            </div>
        </div>
    );
    const Summary = ({ data }) => <div className="px-10 py-2 thirteenTempFont"><SectionHeading>Summary</SectionHeading><p className="text-xs text-gray-700 leading-relaxed">{data}</p></div>;
    const Skills = ({ data }) => <div className="px-10 py-2 thirteenTempFont"><SectionHeading>Skills</SectionHeading><p className="text-xs text-gray-700">{data.map(s=>s.skill||s).join(", ")}</p></div>;
    const ExperienceItem = ({ data, index }) => (
        <div className="px-10 py-2 thirteenTempFont">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Work Experience</SectionHeading>}
            <p className="text-xs text-gray-500">{[data.employer, data.city].filter(Boolean).join(", ")}</p>
            <div className="flex justify-between items-baseline"><p className="text-xs font-bold text-black">{data.jobTitle}</p><p className="text-xs italic text-gray-500">{data.startDate} - {data.endDate||"Present"}</p></div>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const ProjectItem = ({ data, index }) => (
        <div className="px-10 py-2 thirteenTempFont">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const AwardItem = ({ data, index }) => (<div className="px-10 py-2 thirteenTempFont">{(awards.indexOf(data)===0||index===0)&&<SectionHeading>Awards</SectionHeading>}<p className="text-xs font-bold text-black">{data.awardName}</p>{data.issueingOrg && <p className="text-xs text-gray-600">{data.issueingOrg}</p>}</div>);
    const CertificationItem = ({ data, index }) => (<div className="px-10 py-2 thirteenTempFont">{(certifications.indexOf(data)===0||index===0)&&<SectionHeading>Certifications</SectionHeading>}<p className="text-xs font-bold text-black">{data.certificationName}</p>{data.issuingOrg && <p className="text-xs text-gray-600">{data.issuingOrg}</p>}</div>);
    const EducationItem = ({ data, index }) => (
        <div className="px-10 py-2 thirteenTempFont">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading>Education</SectionHeading>}
            <p className="text-xs text-gray-500">{[data.school, data.city].filter(Boolean).join(", ")}</p>
            <p className="text-xs font-bold text-black">{data.fieldOfStudy}</p>
        </div>
    );
    const Languages = ({ data }) => <div className="px-10 py-2 thirteenTempFont"><SectionHeading>Languages</SectionHeading><p className="text-xs text-gray-700">{data.map(l=>l.language).join(", ")}</p></div>;

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "header": return <Header data={block.data} />;
            case "summary": return <Summary data={block.data} />;
            case "skills": return <Skills data={block.data} />;
            case "experience": return <ExperienceItem data={block.data} index={index} />;
            case "project": return <ProjectItem data={block.data} index={index} />;
            case "award": return <AwardItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "education": return <EducationItem data={block.data} index={index} />;
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
                    <div key={pageIndex} style={{ backgroundColor: "#fff", boxShadow: '0 4px 10px rgba(0,0,0,0.15)', paddingTop: pageIndex !== 0 ? 15 : 0, paddingBottom: 15, width: PAGE_WIDTH, height: PAGE_HEIGHT }}>
                        {page.map((b, i) => renderBlock(b, i))}
                    </div>
                );
            })}
            {createPortal(<div ref={measureRef} style={{ position: "absolute", visibility: "hidden", paddingBottom: 15, width: PAGE_WIDTH, top: 0, left: 0, pointerEvents: "none", boxSizing: "border-box" }}>{blocks.map((b, i) => <div key={`${measureKey}-${i}`}>{renderBlock(b, i)}</div>)}</div>, document.body)}
        </>
    );
};
export default TemplateThirteen;