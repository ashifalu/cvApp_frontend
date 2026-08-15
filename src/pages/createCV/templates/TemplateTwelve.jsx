import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TemplateTwelve = ({ personalInfo, professionalSummary, skills, experience, projects, awards, certifications, education, languages, theme, onPageCount, currentPage }) => {
    const selectedTheme = (theme && Object.keys(theme).length > 0) ? theme : { primary: "#1B3A5C", secondary: "#7FA99B" };
    const SIDEBAR_WIDTH = 260, PAGE_WIDTH = 794, MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH, PAGE_HEIGHT = 1123;
    const HEADER_HEIGHT = 300;
    const PAGE_1_MAIN = PAGE_HEIGHT - HEADER_HEIGHT - 40, PAGE_N_MAIN = PAGE_HEIGHT - 40;

    const blocks = useMemo(() => [
        ...(experience || []).map(e => ({ type: "experience", data: e })),
        ...(projects || []).map(p => ({ type: "project", data: p })),
        ...(awards || []).map(a => ({ type: "award", data: a })),
        ...(certifications || []).map(c => ({ type: "certification", data: c })),
        ...(education || []).map(e => ({ type: "education", data: e })),
    ], [experience, projects, awards, certifications, education]);

    const measureRef = useRef();
    const [measureKey, setMeasureKey] = useState(0);
    const [pages, setPages] = useState([]);
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

    const Header = ({ data }) => (
        <div style={{ backgroundColor: selectedTheme.primary, height: HEADER_HEIGHT }} className="relative overflow-hidden twelveTempFont">
            <div style={{ backgroundColor: selectedTheme.secondary }} className="absolute w-40 h-40 rounded-full -top-10 -left-10 opacity-70" />
            <div className="absolute w-32 h-32 rounded-full border-4 overflow-hidden" style={{ borderColor: "#fff", top: 60, left: 40, backgroundColor: "#ccc" }}>
                {data?.photo && <img src={data.photo} alt="profile" className="w-full h-full object-cover" />}
            </div>
            <div className="absolute top-8 right-10 text-right text-[11px] text-white flex items-center gap-2 justify-end">
                {data?.role && <span className="font-bold">{data.role}</span>}
                {data?.phone && <><span>•</span><span>{data.phone}</span></>}
                {data?.email && <><span>•</span><span>{data.email}</span></>}
            </div>
            <h1 className="absolute right-10 top-16 text-4xl font-light text-white text-right leading-tight">
                {data?.firstName || "Your"}<br/>{data?.lastName || "Name"}
            </h1>
        </div>
    );

    const SidebarHeading = ({ icon, children }) => (
        <div className="flex items-center gap-2 mb-3">
            <span style={{ backgroundColor: selectedTheme.primary }} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[14px] text-white">{icon}</span>
            </span>
            <h3 className="text-sm font-bold uppercase text-black">{children}</h3>
        </div>
    );

    const Sidebar = ({ summary, skills, languages }) => (
        <div style={{ width: SIDEBAR_WIDTH, backgroundColor: "#EAF3F1" }} className="px-6 py-6 twelveTempFont">
            {summary && <div className="mb-6"><SidebarHeading icon="person">Profile</SidebarHeading><p className="text-xs text-gray-700 leading-relaxed">{summary}</p></div>}
            {skills?.length > 0 && <div className="mb-6"><SidebarHeading icon="settings">Skills</SidebarHeading><ul className="text-xs text-gray-700 space-y-1">{skills.map((s,i)=><li key={i}>{s.skill||s}</li>)}</ul></div>}
            {languages?.length > 0 && <div><SidebarHeading icon="chat_bubble">Languages</SidebarHeading><p className="text-xs text-gray-700">{languages.map(l=>l.language).join(" | ")}</p></div>}
        </div>
    );

    const SectionHeading = ({ icon, children }) => (
        <div style={{ backgroundColor: selectedTheme.primary }} className="flex items-center gap-2 px-3 py-1.5 mb-3 rounded">
            <span className="material-symbols-outlined text-[14px] text-white">{icon}</span>
            <h2 className="text-sm font-bold uppercase text-white">{children}</h2>
        </div>
    );

    const ExperienceItem = ({ data, index }) => (
        <div className="mb-4">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading icon="work">Work Experience</SectionHeading>}
            <p className="text-xs italic" style={{ color: selectedTheme.secondary }}>{data.startDate} - {data.endDate || "Present"}</p>
            <p className="text-xs font-bold text-black">{[data.employer, data.city].filter(Boolean).join(", ")}</p>
            <p className="text-xs font-bold text-black">{data.jobTitle}</p>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const ProjectItem = ({ data, index }) => (
        <div className="mb-4">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading icon="folder">Projects</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">{data.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>}
        </div>
    );
    const AwardItem = ({ data, index }) => (
        <div className="mb-4">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading icon="emoji_events">Awards</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.awardName}</p>
            {data.issueingOrg && <p className="text-xs text-gray-600">{data.issueingOrg}</p>}
        </div>
    );
    const CertificationItem = ({ data, index }) => (
        <div className="mb-4">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading icon="workspace_premium">Certifications</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.certificationName}</p>
            {data.issuingOrg && <p className="text-xs text-gray-600">{data.issuingOrg}</p>}
        </div>
    );
    const EducationItem = ({ data, index }) => (
        <div className="mb-4">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading icon="school">Education</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.fieldOfStudy}</p>
            <p className="text-xs text-gray-600">{[data.school, data.city].filter(Boolean).join(", ")}</p>
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
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
                    <div key={pageIndex} style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, backgroundColor: "#fff", boxShadow: '0 4px 10px rgba(0,0,0,0.15)', display: "flex", flexDirection: "column" }}>
                        {isFirst && <Header data={personalInfo} />}
                        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                            {isFirst ? <Sidebar summary={professionalSummary} skills={skills} languages={languages} /> : <div style={{ width: SIDEBAR_WIDTH, backgroundColor: "#EAF3F1" }} />}
                            <div style={{ width: MAIN_WIDTH }} className="px-8 py-6 twelveTempFont">{page.map((b, i) => renderBlock(b, i))}</div>
                        </div>
                    </div>
                );
            })}
            {createPortal(
                <div ref={measureRef} style={{ position: "absolute", visibility: "hidden", width: MAIN_WIDTH, top: 0, left: 0, pointerEvents: "none", boxSizing: "border-box" }} className="px-8 py-6 twelveTempFont">
                    {blocks.map((b, i) => <div key={`${measureKey}-${i}`}>{renderBlock(b, i)}</div>)}
                </div>, document.body
            )}
        </>
    );
};
export default TemplateTwelve;