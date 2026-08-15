import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const SixthTemplate = ({
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
        : { primary: "#E8A33D" };

    const HEADER_HEIGHT = 220;
    const SIDEBAR_WIDTH = 260;
    const PAGE_WIDTH = 794;
    const MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH;
    const PAGE_HEIGHT = 1123;
    const PAGE_1_MAIN_HEIGHT = 800;
    const PAGE_N_MAIN_HEIGHT = PAGE_HEIGHT - 60;

    // ── Main column blocks only — sidebar is static, page 1 only ──
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
        ];
    }, [professionalSummary, projects, experience, certifications]);

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

    // ─── Header: B&W photo left, colored name/role block right ───
    const Header = ({ data }) => {
        const initials = [data?.firstName?.[0], data?.lastName?.[0]].filter(Boolean).join("").toUpperCase();
        return (
            <div className="flex sixthTempFont" style={{ height: HEADER_HEIGHT }}>
                <div className="w-[260px] shrink-0 bg-gray-200 overflow-hidden">
                    {data?.photo
                        ? <img src={data.photo} alt="profile" className="w-full h-full object-cover grayscale" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-400">{initials || "?"}</div>
                    }
                </div>
                <div style={{ backgroundColor: selectedTheme.primary }} className="flex-1 flex flex-col justify-center px-10">
                    <h1 className="text-4xl font-black tracking-wide text-black uppercase">
                        {data?.firstName || "Your"} <span className="font-light">{data?.lastName || "Name"}</span>
                    </h1>
                    {data?.role && (
                        <p className="text-lg font-light tracking-wide text-black mt-1 uppercase">{data.role}</p>
                    )}
                    {(data?.linkedInUrl || data?.portfolioUrl) && (
                        <div className="flex items-center gap-6 mt-4">
                            {data?.linkedInUrl && (
                                <div className="flex items-center gap-2 text-xs text-black">
                                    <span className="w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px]">link</span>
                                    </span>
                                    {data.linkedInUrl}
                                </div>
                            )}
                            {data?.portfolioUrl && (
                                <div className="flex items-center gap-2 text-xs text-black">
                                    <span className="w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px]">public</span>
                                    </span>
                                    {data.portfolioUrl}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ─── Sidebar: Contact / Education / Skills / Awards / Languages ───
    const SidebarHeading = ({ children }) => (
        <h3 className="text-sm font-black tracking-wide uppercase text-black mb-3">{children}</h3>
    );

    const ContactRow = ({ icon, text }) => (
        <div className="flex items-center gap-2 mb-3">
            <span
                style={{ backgroundColor: selectedTheme.primary }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            >
                <span className="material-symbols-outlined text-[14px] text-white">{icon}</span>
            </span>
            <span className="text-xs text-gray-700 break-all">{text}</span>
        </div>
    );

    const Sidebar = ({ data, skills, education, awards, languages }) => (
        <div style={{ width: SIDEBAR_WIDTH }} className="px-6 py-6 sixthTempFont">

            {(data?.phone || data?.email || data?.city || data?.country) && (
                <div className="mb-6 pb-6 border-b border-dotted border-gray-300">
                    <SidebarHeading>Contact</SidebarHeading>
                    {data?.phone && <ContactRow icon="call" text={data.phone} />}
                    {data?.email && <ContactRow icon="mail" text={data.email} />}
                    {(data?.city || data?.country) && (
                        <ContactRow icon="location_on" text={[data.city, data.country].filter(Boolean).join(", ")} />
                    )}
                </div>
            )}

            {education && education.length > 0 && (
                <div className="mb-6 pb-6 border-b border-dotted border-gray-300">
                    <SidebarHeading>Education</SidebarHeading>
                    <div className="space-y-3">
                        {education.map((e, i) => (
                            <div key={i}>
                                <p className="text-xs font-bold text-black">{e.fieldOfStudy || e.degree}</p>
                                <p className="text-xs text-gray-500">{e.school}</p>
                                <p className="text-xs text-gray-400">{e.startDate} - {e.endDate || "Present"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {skills && skills.length > 0 && (
                <div className="mb-6 pb-6 border-b border-dotted border-gray-300">
                    <SidebarHeading>Skills</SidebarHeading>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                        {skills.map((s, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span style={{ backgroundColor: selectedTheme.primary }} className="w-1.5 h-1.5 rounded-full shrink-0" />
                                {s.skill || s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {awards && awards.length > 0 && (
                <div className="mb-6 pb-6 border-b border-dotted border-gray-300">
                    <SidebarHeading>Awards</SidebarHeading>
                    <div className="space-y-3">
                        {awards.map((a, i) => (
                            <div key={i}>
                                <p className="text-xs font-bold text-black">{a.awardName}</p>
                                {a.description && <p className="text-xs text-gray-500">{a.description}</p>}
                                {a.issueingDate && <p className="text-xs text-gray-400">{a.issueingDate}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {languages && languages.length > 0 && (
                <div>
                    <SidebarHeading>Languages</SidebarHeading>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                        {languages.map((l, i) => (
                            <li key={i} className="flex justify-between">
                                <span>{l.language}</span>
                                <span className="text-gray-400">
                                    {["Beginner", "Elementary", "Intermediate", "Advanced", "Fluent"][l.level] || ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    // ─── Main column ───
    const SectionHeading = ({ children }) => (
        <h2 className="text-base font-black tracking-wide uppercase text-black mb-3">{children}</h2>
    );

    const Summary = ({ data }) => (
        <div className="mb-6">
            <SectionHeading>Profile</SectionHeading>
            <p className="text-xs text-gray-600 leading-relaxed">{data}</p>
        </div>
    );

    const TimelineItem = ({ isFirst, sectionTitle, title, subtitle, dateLabel, children, isLast }) => (
        <div className="mb-4">
            {isFirst && <SectionHeading>{sectionTitle}</SectionHeading>}
            <div className="flex gap-3">
                <div style={{ backgroundColor: selectedTheme.primary }} className="w-[3px] shrink-0 rounded-full" />
                <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm font-bold text-black">{title}</p>
                        {dateLabel && <p className="text-xs font-semibold text-gray-500 shrink-0 ml-2">{dateLabel}</p>}
                    </div>
                    {subtitle && <p className="text-xs text-gray-500 mb-1">{subtitle}</p>}
                    {children}
                </div>
            </div>
        </div>
    );

    const ProjectItem = ({ data, index }) => (
        <TimelineItem
            isFirst={projects.indexOf(data) === 0 || index === 0}
            sectionTitle="Projects"
            title={data.projectTitle}
            dateLabel={data.startDate ? `${data.startDate} - ${data.endDate || "Present"}` : ""}
        >
            {data.responsibilities?.length > 0 && (
                <ul className="text-xs list-disc ml-4 text-gray-700 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
            {data.projectUrl && (
                <p className="text-xs mt-1 text-gray-500">Live Demo: <span className="text-blue-500">{data.projectUrl}</span></p>
            )}
        </TimelineItem>
    );

    const ExperienceItem = ({ data, index }) => (
        <TimelineItem
            isFirst={experience.indexOf(data) === 0 || index === 0}
            sectionTitle="Work Experience"
            title={data.jobTitle}
            subtitle={[data.employer, data.city, data.country].filter(Boolean).join(", ")}
            dateLabel={`${data.startDate} - ${data.endDate || "Present"}`}
        >
            {data.responsibilities?.length > 0 && (
                <ul className="text-xs list-disc ml-4 text-gray-700 space-y-0.5">
                    {data.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            )}
        </TimelineItem>
    );

    const CertificationItem = ({ data, index }) => (
        <TimelineItem
            isFirst={certifications.indexOf(data) === 0 || index === 0}
            sectionTitle="Certifications"
            title={data.certificationName}
            subtitle={data.issuingOrg}
            dateLabel={data.issueingDate ? `${data.issueingDate}${data.expirationDate ? ` - ${data.expirationDate}` : ""}` : ""}
        />
    );

    const renderBlock = (block, index) => {
        switch (block.type) {
            case "summary":       return <Summary data={block.data} />;
            case "project":       return <ProjectItem data={block.data} index={index} />;
            case "experience":    return <ExperienceItem data={block.data} index={index} />;
            case "certification": return <CertificationItem data={block.data} index={index} />;
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
                                ? <Sidebar data={personalInfo} skills={skills} education={education} awards={awards} languages={languages} />
                                : <div style={{ width: SIDEBAR_WIDTH }} />
                            }
                            <div style={{ width: MAIN_WIDTH }} className="px-8 py-6 sixthTempFont">
                                {page.map((block, index) => renderBlock(block, index))}
                            </div>
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
        </>
    );
};

export default SixthTemplate;