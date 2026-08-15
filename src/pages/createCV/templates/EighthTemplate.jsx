import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const EighthTemplate = ({
                            personalInfo,
                            professionalSummary,
                            skills,
                            projects,
                            experience,
                            certifications,
                            education,
                            awards,
                            languages,
                            theme,
                            onPageCount,
                            currentPage
                        }) => {

    const selectedTheme = (theme && Object.keys(theme).length > 0)
        ? theme
        : { primary: "#000000" };

    const PAGE_WIDTH = 794;
    const PAGE_HEIGHT = 1123;
    const PAGE_1_HEIGHT = 1065;
    const PAGE_N_HEIGHT = 1000;

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
            ...(awards || []).map(a => ({ type: "award", data: a })),
            ...((languages && languages.length > 0) ? [{ type: "languages", data: languages }] : []),
        ];
    }, [personalInfo, professionalSummary, skills, projects, experience, certifications, education, awards, languages]);

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

    // ─── Section heading: bold uppercase + thin underline, matching the reference ───
    const SectionHeading = ({ children }) => (
        <div className="mb-3">
            <h2 className="text-sm font-bold tracking-wide uppercase text-black">{children}</h2>
            <div className="h-[1px] bg-black w-full mt-1" />
        </div>
    );

    const Header = ({ data }) => (
        <div className="px-10 pt-10 pb-4 flex justify-between items-start eighthTempFont">
            <div>
                <h1 className="text-2xl font-bold tracking-wide text-black uppercase">
                    {data?.firstName || "Your"} {data?.lastName || "Name"}
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                    {[data?.city, data?.country].filter(Boolean).join(", ")}
                    {(data?.city || data?.country) && (data?.phone || data?.email) ? " • " : ""}
                    {data?.phone}
                    {data?.phone && data?.email ? " • " : ""}
                    {data?.email}
                </p>
            </div>
            {data?.photo && (
                <img
                    src={data.photo}
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                />
            )}
        </div>
    );

    const Summary = ({ data }) => (
        <div className="px-10 py-3 eighthTempFont">
            <SectionHeading>Professional Profile</SectionHeading>
            <p className="text-xs text-gray-700 leading-relaxed">{data}</p>
        </div>
    );

    const Skills = ({ data }) => (
        <div className="px-10 py-3 eighthTempFont">
            <SectionHeading>Skills</SectionHeading>
            <p className="text-xs text-gray-700 leading-relaxed">
                {data.map(s => s.skill || s).join(", ")}
            </p>
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <div className="px-10 py-2 eighthTempFont">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black uppercase">{data.projectTitle}</p>
                {data.startDate && (
                    <p className="text-xs text-gray-500">{data.startDate} – {data.endDate || "Present"}</p>
                )}
            </div>
            {data.responsibilities?.length > 0 && (
                <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
            {data.projectUrl && (
                <p className="text-xs mt-1 text-gray-500">Live Demo: <span className="text-blue-600">{data.projectUrl}</span></p>
            )}
        </div>
    );

    const ExperienceItem = ({ data, index }) => (
        <div className="px-10 py-2 eighthTempFont">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Work Experience</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black uppercase">{data.jobTitle}</p>
                {data.startDate && (
                    <p className="text-xs text-gray-500">{data.startDate} – {data.endDate || "Present"}</p>
                )}
            </div>
            <p className="text-xs font-semibold text-gray-700">
                {[data.employer, data.city, data.country].filter(Boolean).join(", ")}
            </p>
            {data.responsibilities?.length > 0 && (
                <ul className="text-xs list-disc ml-4 mt-1 text-gray-700 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
        </div>
    );

    const CertificationItem = ({ data, index }) => (
        <div className="px-10 py-2 eighthTempFont">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading>Certifications</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.certificationName}</p>
                {data.issueingDate && (
                    <p className="text-xs text-gray-500">{data.issueingDate}{data.expirationDate ? ` – ${data.expirationDate}` : ""}</p>
                )}
            </div>
            {data.issuingOrg && <p className="text-xs text-gray-700">{data.issuingOrg}</p>}
        </div>
    );

    const EducationItem = ({ data, index }) => (
        <div className="px-10 py-2 eighthTempFont">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading>Education</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.degree ? `${data.degree} in ${data.fieldOfStudy || ""}` : data.fieldOfStudy}</p>
                {data.startDate && (
                    <p className="text-xs text-gray-500">{data.startDate} – {data.endDate || "Present"}</p>
                )}
            </div>
            <p className="text-xs text-gray-700">
                {[data.school, data.city, data.country].filter(Boolean).join(", ")}
            </p>
        </div>
    );

    const AwardItem = ({ data, index }) => (
        <div className="px-10 py-2 eighthTempFont">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading>Awards</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.awardName}</p>
                {data.issueingDate && (
                    <p className="text-xs text-gray-500">{data.issueingDate}{data.expirationDate ? ` – ${data.expirationDate}` : ""}</p>
                )}
            </div>
            {data.issueingOrg && <p className="text-xs text-gray-700">{data.issueingOrg}</p>}
            {data.description && <p className="text-xs text-gray-600 mt-0.5">{data.description}</p>}
        </div>
    );

    const Languages = ({ data }) => (
        <div className="px-10 py-2 eighthTempFont">
            <SectionHeading>Languages</SectionHeading>
            <p className="text-xs text-gray-700">
                {data.map(l => `${l.language} (${["Beginner", "Elementary", "Intermediate", "Advanced", "Fluent"][l.level] || ""})`).join(", ")}
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
            case "award":         return <AwardItem data={block.data} index={index} />;
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
                    <div
                        key={pageIndex}
                        style={{
                            backgroundColor: "#ffffff",
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                            paddingTop: pageIndex !== 0 ? 15 : 0,
                            paddingBottom: 15,
                            width: PAGE_WIDTH,
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

export default EighthTemplate;