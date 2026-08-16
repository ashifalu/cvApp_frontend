import {useMemo, useState, useRef, useLayoutEffect, useEffect} from "react";
import { useSelector } from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import Preview from "./Preview.jsx"
import { templates } from "../../../constants/templates.js"; // adjust path

const A4_W = 794;
const A4_H = 1123;
const DESKTOP_SCALE = 0.65;   // fixed scale used on xl+ screens (plenty of room there)
const MOBILE_SIDE_PADDING = 16; // px of breathing space to leave on each side on small screens

// ─── PreviewPanel ─────────────────────────────────────────────────────────────
// Props:
//   temp_id        – template id from URL params
//   selectedTheme  – currently selected theme object
//   setSelectedTheme – setter for theme
const PreviewPanel = ({ temp_id, selectedTheme, setSelectedTheme }) => {
    const personalInfo        = useSelector(s => s.cv.cvData.personalInfo);
    const professionalSummary = useSelector(s => s.cv.cvData.professionalSummary);
    const experience          = useSelector(s => s.cv.cvData.experience);
    const education           = useSelector(s => s.cv.cvData.education);
    const skills              = useSelector(s => s.cv.cvData.skills);
    const languages           = useSelector(s => s.cv.cvData.languages);
    const projects            = useSelector(s => s.cv.cvData.projects);
    const awards              = useSelector(s => s.cv.cvData.awards);
    const certifications      = useSelector(s => s.cv.cvData.certifications);

    console.log(personalInfo)

    const navigate = useNavigate();

    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [scale, setScale] = useState(DESKTOP_SCALE);
    const containerRef = useRef(null);

// if pages shrink (e.g. content removed) and current index no longer exists, clamp it
    useEffect(() => {
        if (currentPage > pageCount - 1) {
            setCurrentPage(Math.max(0, pageCount - 1));
        }
    }, [pageCount]); // eslint-disable-line react-hooks/exhaustive-deps

    // Recompute scale whenever the panel's available width changes (resize,
    // orientation change, edit/preview tab switch on mobile, etc.)
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const availableWidth = el.clientWidth - MOBILE_SIDE_PADDING * 2;
            // On wide screens (xl+) just use the fixed desktop scale.
            // On narrow screens, shrink to fit with padding, but never
            // scale up past the desktop scale.
            const fitScale = availableWidth / A4_W;
            setScale(Math.min(DESKTOP_SCALE, fitScale));
        };

        updateScale();

        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
    }, []);

    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience,
        education, skills, languages, projects, awards,certifications
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards,certifications]);

    return (
        <div className="xl:flex flex-col bg-surface-container p-4 md:p-10 min-h-full relative" id="preview-panel">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <span
                        className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider">Theme:</span>
                    <div className="flex gap-1.5">
                        {templates[temp_id-1].themes?.map((t, i) => (
                            <button
                                key={i}
                                style={{backgroundColor: t.primary}}
                                className={`w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm hover:scale-110 transition-transform ${
                                    selectedTheme?.primary === t.primary
                                        ? "border-white ring-1 ring-primary/40 scale-110"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSelectedTheme(t)}
                                title={t.primary}
                            />
                        ))}
                    </div>
                </div>
                <button onClick={() => navigate(`/select-template/${temp_id}`)}
                        className="px-4 py-2 text-label-md font-label-md rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                    Templates
                </button>
            </div>


            {/* Scaled A4 preview */}
            <div ref={containerRef} className="flex-grow flex justify-center pt-6 pb-10 px-4 w-full">
                {/* Hidden copy used for PDF generation — full size, off screen */}
                <div id="pdf-print-area" style={{display: "none"}}>
                    <Preview previewData={previewData} temp={temp_id} theme={selectedTheme}/>
                </div>

                <div>{/* Visible scaled preview */}
                    <div
                        style={{
                            width: A4_W * scale,
                            height: A4_H * scale,
                            overflow: "hidden", flexShrink: 0
                        }}
                    >
                        <div
                            style={{
                                width: A4_W,
                                height: A4_H,
                                transform: `scale(${scale})`,
                                transformOrigin: "top left",
                            }}
                        >
                            <Preview previewData={previewData} temp={temp_id} theme={selectedTheme}
                                     onPageCount={setPageCount} currentPage={currentPage} />
                        </div>
                    </div>
                    {pageCount > 1 && (
                        <div className="flex justify-center pt-2 ">
                            <div className="rounded-full h-8  w-30 flex items-center justify-center bg-on-surface  gap-4 mt-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                    className="w-6 h-6 flex items-center justify-center text-white rounded-full  disabled:opacity-30 hover:text-surface-variant transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>

                                <span className=" text-surface text-xs  font-medium">
            {currentPage + 1} / {pageCount}
        </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
                                    disabled={currentPage === pageCount - 1}
                                    className="w-6 h-6 flex items-center justify-center rounded-full text-white  disabled:opacity-30 hover:text-surface-variant transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                            )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;