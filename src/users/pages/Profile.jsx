import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "../../Modal";
import { getAllResumesApi, storeDataApi } from "../../services/allApi";
import { addEducation } from "../../state/cvSlice";

const SectionModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
  <div
  style={{
  position: "fixed", inset: 0, zIndex: 50,
  display: "flex", alignItems: "center", justifyContent: "center",
  }}
  >
  {/* Backdrop */}
  <div
  onClick={onClose}
  style={{
  position: "absolute", inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(4px)",
  }}
  />
  {/* Panel */}
  <div
  style={{
  position: "relative", backgroundColor: "#fff",
  borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  width: "100%", maxWidth: 640, margin: "0 16px",
  maxHeight: "85vh", display: "flex", flexDirection: "column",
  overflow: "hidden",
  }}
  >
  {/* Header */}
  <div
  style={{
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "16px 24px", borderBottom: "1px solid #e5e7eb",
  }}
  >
  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", margin: 0 }}>{title}</h2>
  <button
  onClick={onClose}
  style={{
  background: "none", border: "none", fontSize: 24,
  color: "#9ca3af", cursor: "pointer", lineHeight: 1, padding: 0,
  }}
  >
  ×
  </button>
  </div>
  {/* Scrollable body */}
  <div style={{ overflowY: "auto", flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
  {children}
  </div>
  </div>
  </div>
  );
  };
  
  // ─── Reusable field ───────────────────────────────────────────────────────────
  const Field = ({ label, value, onChange, type = "text" }) => (
  
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "1px solid #e5e7eb", borderRadius: 8,
          padding: "8px 12px", fontSize: 14, outline: "none",
          fontFamily: "inherit", color: "#1f2937", background: "#fff",
        }}
        onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #6366f1")}
        onBlur={(e) => (e.target.style.boxShadow = "none")}
      />
    </div>
  );

  const PROFICIENCY_LEVELS = [
    { value: "", label: "Select level…" },
    { value: "1", label: "1 — Beginner" },
    { value: "2", label: "2 — Elementary" },
    { value: "3", label: "3 — Intermediate" },
    { value: "4", label: "4 — Advanced" },
    { value: "5", label: "5 — Expert" },
  ];

  const SelectField = ({ label, value, onChange }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #6366f1")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "8px 36px 8px 12px",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            color: value ? "#1f2937" : "#9ca3af",
            background: "#fff",
            cursor: "pointer",
            transition: "border-color 0.15s",
          }}
        >
          {PROFICIENCY_LEVELS.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.8"
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none" }}
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );

  const ArrayField = ({ label, values = [], onChange }) => {
    const update = (i, val) => onChange(values.map((v, idx) => (idx === i ? val : v)));
    const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
    const add = () => onChange([...values, ""]);
    
    return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    {label}
    </label>
    
    
      {values.map((val, i) => (
        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            value={val}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`${label} ${i + 1}`}
            style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 11px", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#1f2937", background: "#fff" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #6366f1")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            onClick={() => remove(i)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 20, lineHeight: 1, padding: "0 4px", flexShrink: 0 }}
            title={`Remove ${label}`}
          >×</button>
        </div>
      ))}
    
      <button
        onClick={add}
        style={{ alignSelf: "flex-start", marginTop: 2, background: "none", border: "1px dashed #a5b4fc", borderRadius: 8, padding: "5px 14px", fontSize: 13, fontWeight: 600, color: "#6366f1", cursor: "pointer" }}
      >
        + Add {label}
      </button>
    </div>
    
    
    );
    };
    
  // ─── Add button ───────────────────────────────────────────────────────────────
  const AddBtn = ({ onClick, label }) => (
  <button
  onClick={onClick}
  style={{
  width: "100%", marginTop: 8,
  border: "2px dashed #a5b4fc", borderRadius: 12,
  padding: "10px 0", fontSize: 14, fontWeight: 600,
  color: "#6366f1", background: "none", cursor: "pointer",
  }}
  onMouseEnter={(e) => (e.target.style.background = "#eef2ff")}
  onMouseLeave={(e) => (e.target.style.background = "none")}
  >
  {`+ Add ${label}`}
  
    </button>
  );
  
  // ─── Card wrapper ─────────────────────────────────────────────────────────────
  const Card = ({ children, onDelete }) => (
  
    <div
      style={{
        background: "#f9fafb", border: "1px solid #e5e7eb",
        borderRadius: 12, padding: 16,
      }}
    >
      {/* Delete row */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button
          onClick={onDelete}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 500, color: "#f87171", padding: 0,
          }}
          onMouseEnter={(e) => (e.target.style.color = "#dc2626")}
          onMouseLeave={(e) => (e.target.style.color = "#f87171")}
        >
          Delete
        </button>
      </div>
      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );


const Profile = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState('')
  const [resumes, setResumes] = useState([])
  const [personalInfo, setPersonalInfo] = useState({})
  const [professionalSummary, setProfessionalSummary] = useState("")
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [projects, setProjects] = useState([])
  const [awards, setAwards] = useState([])
  const [skills, setSkills] = useState([])
  const [languages, setLanguages] = useState([])

  const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;
  const withUid = (arr) => (arr || []).map((item) => item._uid ? item : { ...item, _uid: uid() });



  const getResumes = async (tok) => {
    const reqHeader = { authorization: `Bearer ${tok}` };
    const result = await getAllResumesApi(reqHeader);
    if (result.status === 200) {
    setResumes(result.data.resumes);
    const info = result.data.info[0];
    setPersonalInfo(info.personalInfo);
    setProfessionalSummary(info.personalInfo)
    setEducation(withUid(info.education));
    setExperience(withUid(info.experience));
    setProjects(withUid(info.projects));
    setAwards(withUid(info.awards));
    setSkills(withUid(info.skills));
    setLanguages(withUid(info.languages));
    }
    };
    
    const handleSave = async() => {
      setActiveSection(null)
      const reqHeader = { authorization: `Bearer ${token}` };
      const reqBody = { personalInfo , education , experience , projects, awards, skills , languages}
      const result = await storeDataApi(reqHeader,reqBody)
      console.log();
    }

  console.log(experience);
  // Add this helper function at the top of the component
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    // Older than a week — show date
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const sidebarItems = [
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "awards", label: "Awards" },
    { key: "languages", label: "Languages" },
    ];

  const handleDownload = async (pdfUrl, title) => {
    try {
        // Fetch the PDF as a blob
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
    }
};

const updateExp = (i, field, val) =>
      setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: val } : e)));
const updateExpArray = (i, field, arr) =>
      setExperience((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: arr } : e)));
const deleteExp = (i) => setExperience((prev) => prev.filter((_, idx) => idx !== i));
const addExp = () =>
      setExperience((prev) => [...prev,
      { _uid: uid(), jobTitle: "", employer: "",responsibilities:[], city:"",country:"", startDate: "", endDate: "" },
      ]);

const updateEdu = (i, field, val) =>
setEducation((prev) => prev.map((e, idx) => (idx === i ? {...e, [field]: val } : e)));
const deleteEdu = (i) => setEducation((prev) => prev.filter((_, idx) => idx !== i));
const addEdu = () =>
setEducation((prev) => [...prev,
{ _uid: uid(), degree: "", school: "", city:"",country:"", startDate: "", endDate: "" },
]);

const updatePrjct = (i, field, val) =>
setProjects((prev) => prev.map((e, idx) => (idx === i ? {...e, [field]: val } : e)));
const updatePrjctArray = (i, field, arr) =>
setProjects((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: arr } : e)));
const deletePrjct = (i) => setProjects((prev) => prev.filter((_, idx) => idx !== i));
const addPrjct = () =>
setProjects((prev) => [...prev,
{ _uid: uid(), prjectTitle: "", keyFeatures: [], projectUrl: ""},
]);

// ── Skills helpers ───────────────────────────────────────────────────────
const updateSkill = (i,field, val) =>
setSkills((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
const deleteSkill = (i) => setSkills((prev) => prev.filter((_, idx) => idx !== i));
const addSkill = () => setSkills((prev) => [...prev, { _uid: uid(), skill: "" , level: ""}]);

// ── Awards helpers ───────────────────────────────────────────────────────
const updateAward = (i, field, val) =>
setAwards((prev) => prev.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)));
const deleteAward = (i) => setAwards((prev) => prev.filter((_, idx) => idx !== i));
const addAward = () => setAwards((prev) => [...prev, { _uid: uid(), awardName: "", issuedBy:"", decription:"", year: "" }]);

// ── Languages helpers ────────────────────────────────────────────────────
const updateLang = (i, field, val) =>
setLanguages((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));
const deleteLang = (i) => setLanguages((prev) => prev.filter((_, idx) => idx !== i));
const addLang = () => setLanguages((prev) => [...prev, { _uid: uid(), language: "", level: "" }]);



 
 
console.log(resumes);
    console.log();


  useLayoutEffect(() => {
    console.log("useEffect");
    if (sessionStorage.getItem("token")) {
      const tok = sessionStorage.getItem("token")
      setToken(tok)
      getResumes(tok)
    }
  },[])
  console.log(`info ${resumes}`);
  // console.log(.personalInfo.firstName);
    return (
    <div className="bg-[#fcf8ff] min-h-screen font-sans ">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/70 backdrop-blur border-b z-50">
        <h1 className="font-bold text-xl">ResuMorph</h1>

        <div className="flex gap-4 items-center">
          <button>🔔</button>
          <button>⏳</button>
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>

      <div className="flex pt-16 max-w-[1440px] mx-auto px-6 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="w-72 hidden lg:block sticky top-16 h-screen py-6 space-y-6">

          {/* Profile Card */}
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="w-48 h-48 rounded-full mx-auto">
            <img
              src="/images/profileicon.png"
              className=""
            />
            </div>
            <h2 className="font-semibold">{`${personalInfo.firstName} ${personalInfo.lastName}`}</h2>
            <p className="text-sm text-gray-500 mb-3">{personalInfo.role}</p>

            <button className="w-full bg-indigo-600 text-white py-2 rounded mb-2">
              Edit Profile
            </button>
            <button className="w-full bg-gray-100 py-2 rounded">
              Download Resume
            </button>
          </div>

          {/* Menu */}
          <div className="bg-white p-4 rounded-xl shadow space-y-1">
        {sidebarItems.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`w-full text-left p-2 rounded transition font-medium text-sm ${
              activeSection === key
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 py-6 space-y-10">

          {/* HERO */}
          <section>
            <h1 className="text-4xl font-bold">
              Hello, I'm <span className="text-indigo-600">{`${personalInfo.firstName} ${personalInfo.lastName}`}</span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl">
            {professionalSummary}
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h2 className="text-2xl font-bold text-indigo-600">14</h2>
                <p className="text-sm text-gray-500">Years Experience</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h2 className="text-2xl font-bold text-indigo-600">8k</h2>
                <p className="text-sm text-gray-500">Clients</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <h2 className="text-2xl font-bold text-indigo-600">5</h2>
                <p className="text-sm text-gray-500">Resumes</p>
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Experience</h2>

            <div className="space-y-4">
            {experience.map((exp) => (
              <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold">{exp.jobTitle}</h3>
              <p className="text-sm text-gray-500">
                {`${exp.employer}`}
              </p>
              <p className="text-gray-600 mt-2">
              {`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
              </p>
            </div>
            ))}
            </div>
          </section>

          {/* SKILLS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Skills</h2>

            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s._id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {s.skill}
                </span>
              ))}
            </div>
          </section>

          {awards[0] && <section>
            <h2 className="text-xl font-semibold mb-4">Awards</h2>

            <div className="flex flex-wrap gap-2">
              {awards.map((a) => (
                <span
                  key={a._id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {a.awardName}
                </span>
              ))}
            </div>
          </section>}

  
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 hidden xl:block space-y-6 py-6">
          <div className="flex justify-between items-center my-7">
            <h2 className="text-xl font-semibold">My Resumes</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
              <a href="/create-cv">+ New</a>
            </button>
          </div>

          <div className="gap-6">
            {[...resumes]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
              .map((res, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow overflow-hidden my-4"
                >
                  <div className="p-4">
                    <h3 className="font-semibold">
                      {res.title || 'My Resume'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Updated {formatDate(res.updatedAt)}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-gray-100 py-2 rounded">
                        Preview
                      </button>
                      <button
                      onClick={() => handleDownload(res.pdfUrl, res.title)}
                      className="bg-indigo-600 text-white px-3 rounded"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="bg-indigo-600 text-white p-6 rounded-xl">
            <h3 className="font-semibold">Tips</h3>
            <p className="text-sm mt-2">
              Add leadership skills to improve your resume visibility.
            </p>
          </div>

        </aside>
      </div>
      <SectionModal isOpen={activeSection === "experience"} onClose={() => setActiveSection(null)} title="Experience">
    {experience.map((exp, i) => (
      <Card key={exp._uid} onDelete={() => deleteExp(i)}>
        <Field label="Job Title" value={exp.jobTitle} onChange={(v) => updateExp(i, "jobTitle", v)} />
        <Field label="Employer" value={exp.employer} onChange={(v) => updateExp(i, "employer", v)} />
        <ArrayField
          label="Responsibility"
          values={exp.responsibilities || []}
          onChange={(arr) => updateExpArray(i, "responsibilities", arr)}
        />  
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" value={exp.city} onChange={(v) => updateExp(i, "city", v)} />
          <Field label="Country" value={exp.country} onChange={(v) => updateExp(i, "country", v)} />
        </div>  
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date" type="date" value={exp.startDate?.slice(0, 10)} onChange={(v) => updateExp(i, "startDate", v)} />
          <Field label="End Date" type="date" value={exp.endDate?.slice(0, 10)} onChange={(v) => updateExp(i, "endDate", v)} />
        </div>
      </Card>
    ))}
    <AddBtn onClick={addExp} label="Experience" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>
  {/* ── EDUCATION MODAL ───────────────────────────────────────────────── */}
  <SectionModal
    isOpen={activeSection === "education"}
    onClose={() => setActiveSection(null)}
    title="Education"
  >
    {education.map((edu, i) => (
      <Card key={edu._uid} onDelete={() => deleteEdu(i)}>
        <Field label="Degree" value={edu.degree} onChange={(v) => updateEdu(i, "degree", v)} />
        <Field label="Institution" value={edu.institution} onChange={(v) => updateEdu(i, "institution", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="City" value={edu.city} onChange={(v) => updateEdu(i, "city", v)} />
          <Field label="Country" value={edu.country} onChange={(v) => updateEdu(i, "country", v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date" type="date" value={edu.startDate?.slice(0, 10)} onChange={(v) => updateEdu(i, "startDate", v)} />
          <Field label="End Date" type="date" value={edu.endDate?.slice(0, 10)} onChange={(v) => updateEdu(i, "endDate", v)} />
        </div>
      </Card>
    ))}
    <AddBtn onClick={addEdu} label="Education" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>

  {/* ── PRJECT MODAL ───────────────────────────────────────────────── */}
  <SectionModal
    isOpen={activeSection === "projects"}
    onClose={() => setActiveSection(null)}
    title="Projects"
  >
    {projects.map((p, i) => (
      <Card key={p._uid} onDelete={() => deletePrjct(i)}>
        <Field label="Project Title" value={p.prjectTitle} onChange={(v) => updatePrjct(i, "prjectTitle", v)} />
        <ArrayField
          label="Key Feature"
          values={p.keyFeatures || []}
          onChange={(arr) => updatePrjctArray(i, "keyFeatures", arr)}
        />        <Field label="Project URL" value={p.projectUrl} onChange={(v) => updatePrjct(i, "projectUrl", v)} />
      </Card>
    ))}
    <AddBtn onClick={addPrjct} label="Project" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>

  {/* ── SKILLS MODAL ──────────────────────────────────────────────────── */}
  <SectionModal
    isOpen={activeSection === "skills"}
    onClose={() => setActiveSection(null)}
    title="Skills"
  >
    <div className="flex grid grid-cols-2 justify-center items-center gap-2 mb-2">
      {skills.map((s, i) => (
        <Card key={s._uid} onDelete={() => deleteSkill(i)}>
        <Field label="Skill" value={s.skill} onChange={(e) => updateSkill(i, "skill", e)} />
        <SelectField label="Proficiency" value={s.level} onChange={(e) => updateSkill(i, "level", e)} />
      </Card>
      ))}
    </div>
    <AddBtn onClick={addSkill} label="Skill" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>

  {/* ── AWARDS MODAL ──────────────────────────────────────────────────── */}
  <SectionModal
    isOpen={activeSection === "awards"}
    onClose={() => setActiveSection(null)}
    title="Awards"
  >
    {awards.map((a, i) => (
      <Card key={a._uid} onDelete={() => deleteAward(i)}>
        <Field label="Award Name" value={a.awardName} onChange={(v) => updateAward(i, "awardName", v)} />
        <Field label="Year" value={a.year} onChange={(v) => updateAward(i, "year", v)} />
      </Card>
    ))}
    <AddBtn onClick={addAward} label="Award" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>

  {/* ── LANGUAGES MODAL ───────────────────────────────────────────────── */}
  <SectionModal
    isOpen={activeSection === "languages"}
    onClose={() => setActiveSection(null)}
    title="Languages"
  >
    {languages.map((l, i) => (
      <Card key={l._uid} onDelete={() => deleteLang(i)}>
        <Field label="Language" value={l.language} onChange={(v) => updateLang(i, "language", v)} />
        <SelectField label="Proficiency" value={l.level} onChange={(v) => updateLang(i, "level", v)} />
      </Card>
    ))}
    <AddBtn onClick={addLang} label="Language" />
    <div className="flex justify-end pt-2">
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
      >
        Save
      </button>
    </div>
  </SectionModal>
    </div>

  )
}

export default Profile
