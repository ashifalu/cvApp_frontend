import { useEffect, useRef } from "react"
import { Previewer } from "pagedjs"

const CvPreview = ({ children }) => {
  const sourceRef = useRef()
  const previewRef = useRef()

  useEffect(() => {
    if (!sourceRef.current || !previewRef.current) return

    
    previewRef.current.innerHTML = ""

    const paged = new Previewer()

    paged.preview(
      sourceRef.current,
      [],
      previewRef.current
    )
    console.log(sourceRef.current);

  }, [children])

  return (
    <div className="cv-preview">
      {/* Hidden source */}
      <div ref={sourceRef} style={{ display: "block" }}>
        {children}
      </div>

      {/* Paged output */}
      <div ref={previewRef} />
    </div>
  )
}

export default CvPreview