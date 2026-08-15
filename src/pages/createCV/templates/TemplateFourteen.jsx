import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TemplateFourteen = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#9B2247" };
    const PAGE_WIDTH = 794, PAGE_HEIGHT = 1123, PAGE_1_HEIGHT = 1070, PAGE_N_HEIGHT = 1000;

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

    const SectionHeading = ({ children }) => (<div className="mb-2"><h2 className="text-sm font-bold text-black">{children}</h2><div className="h-[1px] bg-gray-400 w-full mt-1" /></div>);

    const Header = ({ data }) => (
        <div className="px-10 pt-10 fourteenTempFont">
            <h1 className="text-3xl font-black text-black">{data?.firstName?.toUpperCase() || "YOUR"} <span style={{ color: selectedTheme.primary }}>{data?.lastName?.toUpperCase() || "NAME"}</span></h1>
            <div className="bg-black text-white text-[11px] px-4 py-2 mt-2 flex items-center gap-2">
                {[data?.city, data?.country].filter(Boolean).join(", ")}
                {data?.phone && <>| {data.phone}</>}
                {data?.email && <>| {data.email}</>}
            </div>
        </div>
    );
    const Summary = ({ data }) => <div className="px-10 py-3 fourteenTempFont"><SectionHeading>Professional Summary</SectionHeading><p className="text-xs text-gray-700 leading-relaxed">{data}</p></div>;
    const Skills = ({ data }) => {
        const half = Math.ceil(data.length/2);
        return (
            <div className="px-10 py-3 fourteenTempFont">
                <SectionHeading>Skills</SectionHeading>
                <div className="grid grid-cols-2 gap-x-8">
                    <ul className="text-xs list-disc ml-4 text-gray-700 space-y-1">{data.slice(0,half).map((s,i)=><li key={i}>{s.skill||s}</li>)}</ul>
                    <ul className="text-xs list-disc ml-4 text-gray-700 space-y-1">{data.slice(half).map((s,i)=><li key={i}>{s.skill||s}</li>)}</ul>
                </div>
            </div>
        );
    };
    const ExperienceItem = ({ data, index }) => (
        <div className="px-10 py-2 fourteenTempFont">
            {(experience.indexOf(data)===0||index===0) && <SectionHeading>Work History</SectionHeading>}
            <div className="flex justify-between items-baseline"><p className="text-xs font-bold text-black">{data.jobTitle}</p><p className="text-xs text-gray-600">{data.startDate} to {data.endDate||"Current"}</p></div>
            <p className="text-xs font-bold text-black">{[data.employer, data.city].filter(Boolean).join(" – ")}</p>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const ProjectItem = ({ data, index }) => (<div className="px-10 py-2 fourteenTempFont">{(projects.indexOf(data)===0||index===0)&&<SectionHeading>Projects</SectionHeading>}<p className="text-xs font-bold text-black">{data.projectTitle}</p>{data.responsibilities?.length>0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}</div>);
    const AwardItem = ({ data, index }) => (<div className="px-10 py-2 fourteenTempFont">{(awards.indexOf(data)===0||index===0)&&<SectionHeading>Awards</SectionHeading>}<p className="text-xs font-bold text-black">{data.awardName}</p></div>);
    const CertificationItem = ({ data, index }) => (<div className="px-10 py-2 fourteenTempFont">{(certifications.indexOf(data)===0||index===0)&&<SectionHeading>Certifications</SectionHeading>}<ul className="text-xs list-disc ml-4 text-gray-700"><li>{data.certificationName}{data.issuingOrg?` - ${data.issuingOrg}`:""}</li></ul></div>);
    const EducationItem = ({ data, index }) => (<div className="px-10 py-2 fourteenTempFont">{(education.indexOf(data)===0||index===0)&&<SectionHeading>Education</SectionHeading>}<p className="text-xs font-bold text-black">
        {[data.degree, data.fieldOfStudy].filter(Boolean).join(": ")}
    </p><p className="text-xs text-gray-700">{data.school} - {data.city}</p></div>);
    const Languages = ({ data }) => <div className="px-10 py-2 fourteenTempFont"><SectionHeading>Languages</SectionHeading><p className="text-xs text-gray-700">{data.map(l=>l.language).join(", ")}</p></div>;

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
export default TemplateFourteen;