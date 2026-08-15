// components/ResumeCard.jsx
import { useRef, useState, useEffect } from "react";
import Preview from "../../pages/createCV/components/Preview.jsx";
const A4_W = 794;
const A4_H = 1123;

const ResumeCard = ({ res, formatDate, onEdit, onDownload, onDelete }) => {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ scale: 0.25, height: A4_H * 0.25 });
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateDims = () => {
            const width = el.getBoundingClientRect().width;
            if (width > 0) {
                const scale = width / A4_W;
                setDims({ scale, height: A4_H * scale }); // explicit px height, not %
            }
        };

        updateDims();
        const observer = new ResizeObserver(updateDims);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        // max-w-full + overflow-hidden on the root: a defensive guard so this
        // card can never contribute to page-level horizontal overflow, even if
        // something inside Preview renders wider than expected (e.g. a
        // position: fixed element, which can escape the inner scale-box's
        // overflow: hidden in some browsers).
        <div className="flex flex-col p-3 md:p-4 bg-gray-400/5 rounded-lg border border-outline-variant/30 hover:shadow-md transition-all w-full max-w-full overflow-hidden">
            <div className="flex flex-col items-center mb-2 text-center">
                <h6 className="mb-1 text-xs md:text-body-md font-semibold text-on-surface line-clamp-1">
                    {res.title || "My Resume"}
                </h6>
                <p className="text-[10px] md:text-xs text-on-surface-variant">
                    Last modified: {formatDate(res.updatedAt)}
                </p>
            </div>

            {/* Measured container: width comes from layout, height is computed in JS */}
            <div ref={containerRef} className="relative w-full max-w-full overflow-hidden" style={{ contain: "layout paint" }}>
                <div
                    style={{
                        width: "100%",
                        height: dims.height,       // ← explicit px, always clips correctly
                        overflow: "hidden",
                        contain: "layout paint",   // ← stops the scaled child's untransformed
                        //   794px layout size from leaking into any
                        //   ancestor's scrollWidth/intrinsic sizing
                    }}
                >
                    <div
                        className="shadow-lg"
                        style={{
                            width: A4_W,
                            transform: `scale(${dims.scale})`,
                            transformOrigin: "top left",
                            pointerEvents: "none",

                        }}
                    >
                        <Preview previewData={res.previewData} temp={res.template} theme={res.theme}
                                 onPageCount={setPageCount} currentPage={currentPage} />
                    </div>
                </div>

                <div
                    className="absolute left-0 flex gap-2 md:gap-3  items-center justify-center w-full"
                    style={{ top: dims.height - 30 }} // pin buttons just above bottom of the *actual* box
                >
                    <button
                        onClick={() => onEdit(res)}
                        className="group px-1 lg:px-2 py-0.5 lg:py-1 text-xs text-primary border border-primary bg-primary/10 rounded-lg hover:bg-primary transition-colors"
                    >
                        <span className="material-symbols-outlined group-hover:text-white text-primary text-xs">edit</span>
                    </button>
                    <button
                        onClick={() => onDownload(res.pdfUrl, res.title)}
                        className="group px-1 lg:px-2 py-0.5 lg:py-1 text-xs bg-green-700/10 border border-green-700 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-green-700 group-hover:text-white text-xs">download</span>
                    </button>
                    <button
                        onClick={() => onDelete(res._id)}
                        className="group px-1 lg:px-2 py-0.5 lg:py-1 text-xs bg-red-700/10 border border-red-600 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-red-600 group-hover:text-white text-xs">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeCard;
