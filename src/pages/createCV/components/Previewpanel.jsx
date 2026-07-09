import {useMemo, useState, useRef, useLayoutEffect} from "react";
import { useSelector } from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import Preview from "../templates/Preview.jsx"; // adjust path to your Preview component
import { templateThemes } from "../../../constants/tempThemes.js"; // adjust path

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

    const [pageCount, setPageCount] = useState(1);
    const [scale, setScale] = useState(DESKTOP_SCALE);
    const containerRef = useRef(null);

    const navigate = useNavigate();

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
        education, skills, languages, projects, awards,
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards]);

    return (
        <div className="xl:flex flex-col bg-surface-container p-6 md:p-10 min-h-full relative" id="preview-panel">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <span
                        className="font-label-md text-[12px] text-on-surface-variant uppercase tracking-wider">Theme:</span>
                    <div className="flex gap-1.5">
                        {templateThemes[temp_id]?.map((t, i) => (
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
                <button onClick={() => navigate('/select-template')}
                        className="px-4 py-2 text-label-md font-label-md rounded-lg bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    Template
                </button>
            </div>


            {/* Scaled A4 preview */}
            <div ref={containerRef} className="flex-grow flex justify-center pt-8 pb-10 px-4 w-full">
                {/* Hidden copy used for PDF generation — full size, off screen */}
                <div id="pdf-print-area" style={{display: "none"}}>
                    <Preview previewData={previewData} temp={temp_id} theme={selectedTheme}/>
                </div>

                {/* Visible scaled preview */}
                <div
                    style={{
                        width: A4_W * scale,
                        height: A4_H * scale * pageCount,  // grows with pages
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
                                 onPageCount={setPageCount}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;