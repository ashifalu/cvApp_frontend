import {useMemo, useState} from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Preview from "../templates/Preview.jsx"; // adjust path to your Preview component
import { templateThemes } from "../../../constants/tempThemes.js"; // adjust path

const SCALE     = 0.65;
const A4_W      = 794;
const A4_H      = 1123;
const DISPLAY_W = A4_W * SCALE; // 516px
const DISPLAY_H = A4_H * SCALE; // 730px

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


    const previewData = useMemo(() => ({
        personalInfo, professionalSummary, experience,
        education, skills, languages, projects, awards,
    }), [personalInfo, professionalSummary, experience, education, skills, languages, projects, awards]);

    return (
        <div className="flex flex-col h-full">
            {/* Top bar */}
            <div className="w-full flex justify-between p-4 items-center bg-surface-container-lowest border-b border-outline-variant/30 rounded-t-2xl">
                <div className="flex flex-col justify-center items-start gap-2">
                    <h3 className="font-semibold text-sm text-on-surface">Choose Theme</h3>
                    <div className="flex gap-2">
                        {templateThemes[temp_id]?.map((t, i) => (
                            <button
                                key={i}
                                style={{ backgroundColor: t.primary }}
                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                                    selectedTheme?.primary === t.primary
                                        ? "border-white ring-2 ring-primary scale-110"
                                        : "border-transparent"
                                }`}
                                onClick={() => setSelectedTheme(t)}
                                title={t.primary}
                            />
                        ))}
                    </div>
                </div>
                <Link to="/select-template">
                    <button className="py-2 px-3 text-white bg-secondary text-sm rounded-xl hover:opacity-90 transition-opacity">
                        Change Template
                    </button>
                </Link>
            </div>

            {/* Scaled A4 preview */}
            <div className="flex-1 flex justify-center items-start bg-gray-100 p-4 rounded-b-2xl overflow-auto">
                {/* Hidden copy used for PDF generation — full size, off screen */}
                <div id="pdf-print-area" style={{ display: "none" }}>
                    <Preview previewData={previewData} temp={temp_id} theme={selectedTheme} />
                </div>

                {/* Visible scaled preview */}
                <div
                    style={{ width: DISPLAY_W, height: A4_H * SCALE * pageCount,  // grows with pages
                        overflow: "hidden", flexShrink: 0 }}
                >
                    <div
                        style={{
                            width:           A4_W,
                            height:          A4_H,
                            transform:       `scale(${SCALE})`,
                            transformOrigin: "top left",
                        }}
                    >
                        <Preview previewData={previewData} temp={temp_id} theme={selectedTheme} onPageCount={setPageCount} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;