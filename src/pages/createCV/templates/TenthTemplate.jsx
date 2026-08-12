import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const TenthTemplate = ({
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
        : { primary: "#A9C0AC" };

    const PAGE_WIDTH = 794;
    const PAGE_HEIGHT = 1123;
    const PAGE_1_HEIGHT = 1035;
    const PAGE_N_HEIGHT = 1000;

    const blocks = useMemo(() => {
        const result = [{ type: "header", data: personalInfo }];
        if (professionalSummary) result.push({ type: "summary", data: professionalSummary });
        if (skills && skills.length > 0) result.push({ type: "skills", data: skills });
        return [
            ...result,
            ...(projects || []).map(p => ({ type: "project", data: p })),
            ...(experience || []).map(e => ({ type: "experience", data: e })),
            ...(certifications || []).map(c => ({ type: "certification", data: c })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...(education || []).map(e => ({ type: "education", data: e })),
            ...((languages && languages.length > 0) ? [{ type: "languages", data: languages }] : []),
        ];
    }, [personalInfo, professionalSummary, skills, projects, experience, certifications, awards, education, languages]);

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

    const SectionHeading = ({ children }) => (
        <div style={{ backgroundColor: `${selectedTheme.primary}33` }} className="flex items-center gap-2 px-3 py-1.5 mb-3">
            <div style={{ backgroundColor: selectedTheme.primary }} className="w-[4px] h-4 shrink-0" />
            <h2 className="text-xs font-bold tracking-[2px] uppercase text-black">{children}</h2>
        </div>
    );

    const Header = ({ data }) => (
        <div className="px-10 pt-10 pb-4 tenthTempFont">
            <h1 className="text-3xl font-serif font-bold text-black">
                {data?.firstName || "Your"} {data?.lastName || "Name"}
            </h1>
            {data?.role && <p className="text-xs tracking-[3px] uppercase text-gray-500 mt-1">{data.role}</p>}
            <div className="flex items-center gap-2 text-[11px] text-gray-700 mt-3">
                {data?.phone && <span>{data.phone}</span>}
                {data?.phone && (data?.email || data?.city) && <span>•</span>}
                {data?.email && <span>{data.email}</span>}
                {data?.email && (data?.city || data?.country) && <span>•</span>}
                {(data?.city || data?.country) && <span>{[data.city, data.country].filter(Boolean).join(", ")}</span>}
                {data?.linkedInUrl && <><span>•</span><span>{data.linkedInUrl}</span></>}
            </div>
        </div>
    );

    const Summary = ({ data }) => (
        <div className="px-10 py-2 tenthTempFont">
            <SectionHeading>Profile Summary</SectionHeading>
            <p className="text-xs text-gray-700 leading-relaxed px-1">{data}</p>
        </div>
    );

    const Skills = ({ data }) => (
        <div className="px-10 py-2 tenthTempFont">
            <SectionHeading>Skills</SectionHeading>
            <p className="text-xs text-gray-700 leading-relaxed px-1">{data.map(s => s.skill || s).join(" • ")}</p>
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <div className="px-10 py-2 tenthTempFont">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <div className="px-1">
                <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-black">{data.projectTitle}</p>
                    {data.startDate && <p className="text-xs font-bold text-gray-700">{data.startDate} - {data.endDate || "Present"}</p>}
                </div>
                {data.responsibilities?.length > 0 && (
                    <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                        {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );

    const ExperienceItem = ({ data, index }) => (
        <div className="px-10 py-2 tenthTempFont">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Work Experiences</SectionHeading>}
            <div className="px-1">
                <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-black">
                        {data.jobTitle} {data.employer && <span className="font-normal italic text-gray-600">| {data.employer}, {data.city}</span>}
                    </p>
                    {data.startDate && <p className="text-xs font-bold text-gray-700 shrink-0 ml-2">{data.startDate} - {data.endDate || "Present"}</p>}
                </div>
                {data.responsibilities?.length > 0 && (
                    <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                        {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                )}
            </div>
        </div>
    );

    const CertificationItem = ({ data, index }) => (
        <div className="px-10 py-2 tenthTempFont">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading>Certifications</SectionHeading>}
            <div className="px-1 flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.certificationName}</p>
                {data.issueingDate && <p className="text-xs font-bold text-gray-700">{data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}</p>}
            </div>
            {data.issuingOrg && <p className="text-xs text-gray-600 px-1">{data.issuingOrg}</p>}
        </div>
    );

    const AwardItem = ({ data, index }) => (
        <div className="px-10 py-2 tenthTempFont">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading>Awards</SectionHeading>}
            <div className="px-1 flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.awardName}</p>
                {data.issueingDate && <p className="text-xs font-bold text-gray-700">{data.issueingDate}</p>}
            </div>
            {data.issueingOrg && <p className="text-xs text-gray-600 px-1">{data.issueingOrg}</p>}
        </div>
    );

    const EducationItem = ({ data, index }) => (
        <div className="px-10 py-2 tenthTempFont">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading>Education</SectionHeading>}
            <div className="px-1 flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.fieldOfStudy}, {data.degree}</p>
                {data.startDate && <p className="text-xs font-bold text-gray-700">{data.startDate} - {data.endDate || "Present"}</p>}
            </div>
            <p className="text-xs text-gray-600 px-1">{[data.school, data.city].filter(Boolean).join(", ")}</p>
        </div>
    );

    const Languages = ({ data }) => (
        <div className="px-10 py-2 tenthTempFont">
            <SectionHeading>Languages</SectionHeading>
            <p className="text-xs text-gray-700 px-1">
                {data.map(l => `${l.language} (${["Beginner","Elementary","Intermediate","Advanced","Fluent"][l.level] || ""})`).join(" • ")}
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
            case "award":         return <AwardItem data={block.data} index={index} />;
            case "education":     return <EducationItem data={block.data} index={index} />;
            case "languages":     return <Languages data={block.data} />;
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
                return (
                    <div key={pageIndex} style={{
                        backgroundColor: "#ffffff", boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        paddingTop: pageIndex !== 0 ? 15 : 0, paddingBottom: 15,
                        width: PAGE_WIDTH, height: PAGE_HEIGHT,
                    }}>
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

export default TenthTemplate;