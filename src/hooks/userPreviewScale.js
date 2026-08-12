// hooks/usePreviewScale.js
import { useState, useEffect, useRef } from "react";

const A4_W = 794;

const usePreviewScale = () => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.32);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const width = el.getBoundingClientRect().width;
            if (width > 0) setScale(width / A4_W);
        };

        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { scale, containerRef };
};

export default usePreviewScale;