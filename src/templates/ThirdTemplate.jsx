import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useState } from 'react';
import { createPortal } from 'react-dom'

const ThirdTemplate = ({
personalInfo,
professionalSummary,
experience,
education,
skills,
languages,
projects,
awards
}) => {


const blocks = useMemo(() => {
    const result = [
        { type: "header", data: personalInfo },
    ];

    const chunkArray = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );

    if (professionalSummary) {
        result.push({ type: "summary", data: professionalSummary });
    }

    return [
        ...result,
        ...education.map(e => ({ type: "education", data: e })),
        ...experience.map(e => ({ type: "experience", data: e })),
        ...projects.map(p => ({ type: "project", data: p })),
        ...awards.map(a => ({ type: "award", data: a })),
        ...chunkArray(skills, 5).map((chunk, i) => ({
            type: "skills-row",
            data: chunk,
            isFirst: i === 0
        })),
        ...chunkArray(languages, 5).map((chunk, i) => ({
            type: "languages-row",
            data: chunk,
            isFirst: i === 0
        })),
    ];
}, [personalInfo, professionalSummary, education, experience,
    projects, awards, skills, languages]);

const measureRef = useRef();
const pageRefs = useRef([]);
const [measureKey, setMeasureKey] = useState(0);
const [pages, setPages] = useState([]);

const PAGE_HEIGHT = 1123;
const PAGE_1_HEIGHT = 1050;
const PAGE_N_HEIGHT = 1000;

useLayoutEffect(() => {
    setMeasureKey(k => k + 1);
}, [blocks]);

useLayoutEffect(() => {
    if (measureKey === 0) return;
    if (!measureRef.current) return;

    const measure = () => {
        if (!measureRef.current) return;
        const newPages = [];
        let currentPage = [];
        let currentHeight = 0;
        let isFirstPage = true;

        blocks.forEach((block, i) => {
            const el = measureRef.current?.children[i];
            if (!el) return;

            const blockHeight = el.getBoundingClientRect().height;
            const limit = isFirstPage ? PAGE_1_HEIGHT : PAGE_N_HEIGHT;

            if (currentHeight + blockHeight > limit && currentPage.length > 0) {
                newPages.push([...currentPage]);
                currentPage = [block];
                currentHeight = blockHeight;
                isFirstPage = false;
            } else {
                currentPage.push(block);
                currentHeight += blockHeight;
            }
        });

        if (currentPage.length) newPages.push([...currentPage]);
        setPages(newPages);
    };

    const images = Array.from(measureRef.current.querySelectorAll("img"));

    if (images.length === 0) {
        const r1 = requestAnimationFrame(() => {
            const r2 = requestAnimationFrame(measure);
            return () => cancelAnimationFrame(r2);
        });
        return () => cancelAnimationFrame(r1);
    }

    let loaded = 0;
    const onLoad = () => {
        loaded++;
        if (loaded === images.length) measure();
    };

    images.forEach(img => {
        if (img.complete) {
            loaded++;
        } else {
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
        }
    });

    if (loaded === images.length) {
        const r1 = requestAnimationFrame(() => {
            const r2 = requestAnimationFrame(measure);
            return () => cancelAnimationFrame(r2);
        });
        return () => cancelAnimationFrame(r1);
    }

    return () => {
        images.forEach(img => {
            img.removeEventListener("load", onLoad);
            img.removeEventListener("error", onLoad);
        });
    };

}, [measureKey, blocks]);

// ─── Sub-components (Tailwind only) ───────────────────────────────────────

const Header = ({ data }) => {
    if (!data?.firstName) return null;
    return (
        <div className="bg-[#fff] text-[#000000] px-6 py-5 text-center mb-2">
            <h1 className="text-2xl font-extrabold tracking-wide">
                {data.firstName} {data.lastName}
            </h1>
            {data.role && (
                <p className="text-sm font-medium text-black mt-1">{data.role}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
                {data.phone && <ContactItem icon="/images/phone3.png" text={data.phone} />}
                {data.email && <ContactItem icon="/images/email3.png" text={data.email} />}
                {(data.city || data.country) && (
                    <ContactItem icon="/images/location3.png" text={[data.city, data.country].filter(Boolean).join(", ")} />
                )}
                {data.birthdate && <ContactItem icon="/images/birth3.png" text={data.birthdate} />}
                {(data.nationality || data.gender || data.maritalStatus) && (
                    <ContactItem icon="/images/nation3.png" text={[data.nationality, data.gender, data.maritalStatus].filter(Boolean).join(", ")} />
                )}
                {data.linkedInUrl && <ContactItem icon="/images/linkedin copy.png" text={data.linkedInUrl} />}
            </div>
        </div>
    );
};

const ContactItem = ({ icon, text }) => (
    <div className="flex items-center gap-1">
        <img src={icon}/>
        <span className="text-xs text-black">{text}</span>
    </div>
);

const SectionHeader = ({ title }) => (
    <div className="flex items-center mt-2 mb-2">
        <div className="bg-[#9F0045] text-[#fff] text-[14px] font-bold px-3 py-1 rounded-r-full w-[238px] ">
            {title}
        </div>
        <div className="h-[2px] w-full bg-[#9F0045] " />
    </div>
);


const Summary = ({ data }) => {
    if (!data) return null;
    return (
        <div className="item px-6">
            <SectionHeader title="Professional Summary" />
            <p className="text-xs text-[#666666] leading-relaxed mb-1">{data}</p>
            
        </div>
    );
};

const EducationItem = ({ data, index }) => {
    const isFirst = education.indexOf(data) === 0 || index === 0;
    const isLast = education.indexOf(data) === education.length - 1;
    return (
        <div className="item px-6">
            {isFirst && <SectionHeader title="Education" />}
            <div className="grid grid-cols-[180px_1fr] gap-2 items-start">
                <div>
                    <p className="text-[11px] mt-1 text-[#666666]">
                        {[data.school, data.city, data.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-[11px] font-semibold text-[#000000] my-1">
                        {data.startDate} – {data.endDate || "Present"}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] font-bold text-[#8B1A4A]">{data.fieldOfStudy}</p>
                    <p className="text-[11px] text-[#666666]">{data.degree}</p>
                    {data.grade && <p className="text-xs text-[#666666]">GPA: {data.grade}</p>}
                </div>
            </div>
            {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]'/>}
        </div>
    );
};

const ExperienceItem = ({ data, index }) => {
    const isFirst = experience.indexOf(data) === 0 || index === 0;
    const isLast = experience.indexOf(data) === experience.length - 1;
    return (
        <div className="item px-6">
            {isFirst && <SectionHeader title="Work Experience" />}
            <div className="grid grid-cols-[180px_1fr] gap-2 items-start">
                <div>
                    <p className="text-[11px] mt-1 text-gray-500">
                        {[data.employer, data.city, data.country].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-xs font-semibold text-[#000000] my-1">
                        {data.startDate} – {data.endDate || "Present"}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-[#8B1A4A]">{data.jobTitle}</p>
                    <ul className="text-xs list-disc ml-4 mt-1 text-[#666666] space-y-0.5">
                        {data.responsibilities?.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]'/>}
        </div>
    );
};

const ProjectItem = ({ data, index }) => {
    const isFirst = projects.indexOf(data) === 0 || index === 0;
    const isLast = projects.indexOf(data) === projects.length - 1;
    return (
        <div className="item px-6">
            {isFirst && <SectionHeader title="Projects" />}
            <div className="grid grid-cols-[180px_1fr] gap-2">
                <div />
                <div>
                    <p className="text-xs font-bold text-[#8B1A4A]">{data.projectTitle}</p>
                    <ul className="text-xs list-disc ml-4 mt-1 text-[#666666] space-y-0.5">
                        {data.keyFeatures?.map((k, i) => (
                            <li key={i}>{k}</li>
                        ))}
                    </ul>
                    {data.projectUrl && (
                        <p className="text-xs mt-1 text-gray-500">
                            Live Demo: <span className="text-blue-500">{data.projectUrl}</span>
                        </p>
                    )}
                </div>
            </div>
            {!isLast && <div className='bg-gray-200 w-full my-1 h-[1px]'/>}
        </div>
    );
};

const AwardItem = ({ data, index }) => {
    const isFirst = awards.indexOf(data) === 0 || index === 0;
    const isLast = awards.indexOf(data) === awards.length - 1;
    return (
        <div className="item px-6">
            {isFirst && <SectionHeader title="Awards" />}
            <div className="grid grid-cols-[180px_1fr] gap-2">
                <div>
                    <p className="text-xs text-gray-500">{data.issueingOrg}</p>
                    <p className="text-xs font-semibold text-[#000000] mt-0.5">
                        {data.issueingDate}{data.expirationDate ? ` – ${data.expirationDate}` : ""}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-[#8B1A4A]">{data.awardName}</p>
                    {data.description && <p className="text-xs text-[#666666] mt-0.5">{data.description}</p>}
                </div>
            </div>
        </div>
    );
};

const DotRating = ({ level }) => (
    <div className="flex gap-1 my-1">
        {[0, 1, 2, 3, 4].map(j => (
            <div
                key={j}
                className={`w-[34px] h-2 rounded-full border border-[#8B1A4A] ${j <= level ? "bg-[#8B1A4A]" : "bg-transparent"}`}
            />
        ))}
    </div>
);

const SkillsRow = ({ data, isFirst }) => {
    const isLast = skills.indexOf(data[data.length - 1]) === skills.length - 1;
    return (
        <div className="item px-6 ">
            {isFirst && <SectionHeader title="Skills" />}
            <div className="grid grid-cols-5 gap-x-4 my-2">
                {data.map((s, i) => (
                    <div key={i}>
                        <p className="text-xs text-[#666666]">{s.skill}</p>
                        <DotRating level={s.level} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const LanguageRow = ({ data, isFirst }) => {
    const isLast = languages.indexOf(data[data.length - 1]) === languages.length - 1;
    return (
        <div className="item px-6">
            {isFirst && <SectionHeader title="Languages" />}
            <div className="grid grid-cols-5 gap-x-4 gap-y-2">
                {data.map((l, i) => (
                    <div key={i}>
                        <p className="text-xs text-[#666666]">{l.language}</p>
                        <DotRating level={l.level} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Block renderer ────────────────────────────────────────────────────────

const renderBlock = (block, index) => {
    switch (block.type) {
        case "header":        return <Header data={block.data} />;
        case "summary":       return <Summary data={block.data} />;
        case "education":     return <EducationItem data={block.data} index={index} />;
        case "experience":    return <ExperienceItem data={block.data} index={index} />;
        case "project":       return <ProjectItem data={block.data} index={index} />;
        case "award":         return <AwardItem data={block.data} index={index} />;
        case "skills-row":    return <SkillsRow data={block.data} isFirst={block.isFirst} />;
        case "languages-row": return <LanguageRow data={block.data} isFirst={block.isFirst} />;
        default:              return null;
    }
};

// ─── Render ────────────────────────────────────────────────────────────────

return (
    <>
        {pages.map((page, pageIndex) => (
            <div
                key={pageIndex}
                ref={el =>pageRefs.current[pageIndex]= el}
                className="bg-white border border-gray-300 overflow-hidden mb-5"
                style={{
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    marginTop:20,
                    marginLeft:15,
                    marginRight:15,
                    paddingTop: pageIndex !== 0 ? 15 : 0,
                    paddingBottom: 15,
                    width: 794,
                    height: PAGE_HEIGHT,
                }}
            >
                {page.map((block, index) => renderBlock(block, index))}
            </div>
        ))}

        {/* Hidden measurement container */}
        {createPortal(<div
            ref={measureRef}
            className="absolute invisible top-0 left-0 pointer-events-none box-border"
            style={{ paddingBottom: 15, width: 794 }}
        >
            {blocks.map((block, i) => (
                <div key={`${measureKey}-${i}`}>
                    {renderBlock(block, i)}
                </div>
            ))}
        </div>,
        document.body
    )}
    </>
);


};

export default ThirdTemplate;