import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const SeventhTemplate = ({
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
        : { primary: "#1E2749", secondary: "#EBD9B4" };

    const SIDEBAR_WIDTH = 190;
    const PAGE_WIDTH = 794;
    const MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH;
    const PAGE_HEIGHT = 1123;
    const MAIN_TOP_PADDING = 60; // room for "Hello, I'm ___" heading, page 1 only
    const PAGE_1_MAIN_HEIGHT = 622
    const PAGE_N_MAIN_HEIGHT = 960;

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
            ...(education || []).map(e => ({ type: "education", data: e })),
            ...(awards || []).map(a => ({ type: "award", data: a })),
        ];
    }, [professionalSummary, projects, experience, certifications, education, awards]);

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
                console.log(currentHeight)
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

    // ─── Sidebar ───────────────────────────────────────────────────────────────
    const Sidebar = ({ data, skills, languages }) => (
        <div style={{ width: SIDEBAR_WIDTH, backgroundColor: selectedTheme.secondary }} className="relative overflow-hidden seventhTempFont h-full">
            {/* Decorative circle — becomes the photo if one was uploaded, else stays solid */}

                {data?.photo && (
                    <div className="  absolute w-[150px] h-[150px] mx-5 my-8 mt-16 rounded-full border-8 border-white ">
                        <img src={data.photo} alt="profile" className="w-full rounded-full h-full object-cover" />

                    </div>
                )}

            <div
                className="absolute rounded-full overflow-hidden flex items-center justify-center"
                style={{
                    width: 140, height: 140,
                    backgroundColor: selectedTheme.primary,
                    top: -74, left: -45,
                }}
            >

            </div>

            {/* Bottom decorative arc — purely stylistic, matches the reference image */}
            <div
                className="absolute rounded-full"
                style={{
                    width: 130, height: 130,
                    backgroundColor: selectedTheme.primary,
                    bottom: -40, left: -40,
                }}
            />

            <div className="relative px-5 pt-6 pb-8">

                {data?.portfolioUrl && (
                    <p className="text-[10px] text-gray-600 mt-0.5 break-all">{data.portfolioUrl.toUpperCase()}</p>
                )}

                {/* spacing to clear the decorative circle */}
                <div style={{ height: 200 }} />

                {(data?.city || data?.country || data?.phone || data?.email) && (
                    <div className="mb-6 text-[10px] text-gray-700 leading-relaxed">
                        {(data?.city || data?.country) && (
                            <p className="font-semibold text-black">{[data.city, data.country].filter(Boolean).join(", ")}</p>
                        )}
                        {data?.phone && <p>{data.phone}</p>}
                        {data?.email && <p className="break-all">{data.email}</p>}
                    </div>
                )}

                {data?.linkedInUrl && (
                    <div className="mb-6 text-[10px] text-gray-700 space-y-1">
                        <p>{[data.firstName, data.lastName].filter(Boolean).join(" ")}</p>
                        <p className="break-all">{data.linkedInUrl}</p>
                    </div>
                )}

                {skills && skills.length > 0 && (
                    <div className="mb-6">
                        <div className="space-y-3">
                            {skills.map((s, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-black uppercase tracking-wide mb-1">{s.skill}</p>
                                    <div className="h-[3px] w-full bg-black/10 rounded-full">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${((s.level + 1) / 5) * 100}%`,
                                                backgroundColor: selectedTheme.primary,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {languages && languages.length > 0 && (
                    <ul className="text-[10px] text-gray-700 space-y-1.5">
                        {languages.map((l, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span style={{ backgroundColor: selectedTheme.primary }} className="w-1.5 h-1.5 rounded-full shrink-0" />
                                {l.language}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    // ─── Main column ───────────────────────────────────────────────────────────
    const Greeting = ({ data, summary }) => (
        <div className="mb-8">
            <h1 className="text-4xl font-light text-black leading-tight">
                <span className="font-semibold">{[data?.firstName, data?.lastName].filter(Boolean).join(" ") || "Your Name"}</span>
            </h1>
            {data?.role && <p className="text-sm text-gray-500 mt-2">{data.role}</p>}
            {summary && <p className="text-xs text-gray-500 leading-relaxed mt-3 max-w-[420px]">{summary}</p>}
        </div>
    );

    const SectionHeading = ({ children }) => (
        <h2 className="text-sm font-bold tracking-wide uppercase text-black mb-3">{children}</h2>
    );

    const Summary = () => null; // folded into Greeting on page 1; nothing to render on overflow pages

    const ProjectItem = ({ data, index }) => (
        <div className="mb-4">
            {(projects.indexOf(data) === 0 || index === 0) && <SectionHeading>Projects</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.projectTitle}</p>
            {data.responsibilities?.length > 0 && (
                <ul className="text-[11px] list-disc ml-4 mt-1 text-gray-500 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
            {data.projectUrl && (
                <p className="text-[11px] mt-1 text-gray-500">Live Demo: <span className="text-blue-500">{data.projectUrl}</span></p>
            )}
        </div>
    );

    const ExperienceItem = ({ data, index }) => (
        <div className="mb-4">
            {(experience.indexOf(data) === 0 || index === 0) && <SectionHeading>Work Experience</SectionHeading>}
            <p className="text-xs font-bold text-black uppercase">{data.jobTitle}</p>
            <p className="text-[11px] text-gray-400">
                {[data.employer, data.city, data.country].filter(Boolean).join(", ")}
                {data.startDate ? ` | ${data.startDate} - ${data.endDate || "Present"}` : ""}
            </p>
            {data.responsibilities?.length > 0 && (
                <ul className="text-[11px] list-disc ml-4 mt-1 text-gray-500 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
        </div>
    );

    const CertificationItem = ({ data, index }) => (
        <div className="mb-4">
            {(certifications.indexOf(data) === 0 || index === 0) && <SectionHeading>Certifications</SectionHeading>}
            <div className="flex justify-between items-baseline">
                <p className="text-xs font-bold text-black">{data.certificationName}</p>
                {data.issueingDate && (
                    <p className="text-[11px] text-gray-400">{data.issueingDate}{data.expirationDate ? ` - ${data.expirationDate}` : ""}</p>
                )}
            </div>
            {data.issuingOrg && <p className="text-[11px] text-gray-500">{data.issuingOrg}</p>}
        </div>
    );

    const EducationItem = ({ data, index }) => (
        <div className="mb-4">
            {(education.indexOf(data) === 0 || index === 0) && <SectionHeading>Education</SectionHeading>}
            <p className="text-xs font-bold text-black uppercase">{data.fieldOfStudy}</p>
            <p className="text-[11px] text-gray-500">
                {[data.school, data.city, data.country].filter(Boolean).join(", ")}
                {data.startDate ? ` | ${data.startDate} - ${data.endDate || "Present"}` : ""}
            </p>
        </div>
    );

    const AwardItem = ({ data, index }) => (
        <div className="mb-4">
            {(awards.indexOf(data) === 0 || index === 0) && <SectionHeading>Awards</SectionHeading>}
            <p className="text-xs font-bold text-black">{data.awardName}</p>
            {data.issueingOrg && <p className="text-[11px] text-gray-500">{data.issueingOrg}</p>}
            {data.description && <p className="text-[11px] text-gray-500 mt-0.5">{data.description}</p>}
        </div>
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "summary":       return <Summary />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
            case "education":     return <EducationItem data={block.data} index={index} />;
            case "award":         return <AwardItem data={block.data} index={index} />;
            default: return null;
        }
    };

    const pagesToRender = (currentPage === undefined || currentPage === null)
        ? pages
        : (pages.length ? [pages[Math.min(currentPage, pages.length - 1)]] : [[]]);

    return (
        <div className="relative">
            <div
                className="absolute rounded-full overflow-hidden flex items-center justify-center"
                style={{
                    width: 80, height: 80,
                    backgroundColor: selectedTheme.secondary,
                    top: -30, right: 45,
                }}
            >

            </div>
            <div
                className="absolute rounded-full overflow-hidden flex items-center justify-center"
                style={{
                    width: 170, height: 170,
                    backgroundColor: selectedTheme.primary,
                    top: 90, right: -55,
                }}
            >
            </div>
            <div
                className="absolute rounded-full  overflow-hidden flex items-center justify-center"
                style={{
                    width: 140, height: 140,

                    backgroundColor: selectedTheme.secondary,

                    bottom: -10, right: -85,
                }}
            >



                <div className="rounded-full bg-white w-[120px] h-[120px]"></div>
            </div>
            <div
                className="absolute z-50 rounded-full overflow-hidden flex items-center justify-center"
                style={{
                    width: 80, height: 80,
                    backgroundColor: selectedTheme.primary,
                    bottom: 100, right: -45,
                }}
            >

            </div>
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
                        }}
                    >
                        {isFirstPage
                            ? <Sidebar data={personalInfo} skills={skills} languages={languages} />
                            : <div style={{ width: SIDEBAR_WIDTH, backgroundColor: selectedTheme.secondary }} />
                        }
                        <div style={{ width: MAIN_WIDTH }} className="px-10 py-8 seventhTempFont">

                            {isFirstPage && <Greeting data={personalInfo} summary={professionalSummary} />}
                            {page.map((block, index) => renderBlock(block, index))}
                        </div>
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
        </div>
    );
};

export default SeventhTemplate;