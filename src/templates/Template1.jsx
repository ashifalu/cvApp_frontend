import React, { useRef } from "react";
import { useEffect } from "react";
// import '../cvprint.css'


const TemplateOne = ({
  personalInfo,
  professionalSummary,
  experience,
  education,
  skills,
  languages,
  projects,
  awards
}) => {


  const Page = ({ children }) => {
    return (
      <div
        className="bg-white shadow-md mx-auto mb-6"
        style={{
          width: "794px",      // A4 width in px
          height: "1122px",    // A4 height in px
          padding: "40px",
          boxSizing: "border-box",
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    );
  };

  const dataArray = [
  personalInfo,
  professionalSummary,
  experience,
  {education},
  {skills},
  {languages},
  {projects},
  {awards}
  ]

  const headerHeight = useRef();
  const summaryHeight = useRef();

useEffect(()=>{
  if(personalInfo && professionalSummary){
        const currentHeight = headerHeight.current.scrollHeight + summaryHeight.current.scrollHeight
        console.log(currentHeight);
  }
},[personalInfo],[professionalSummary])

  return (
    <div className="min-h-screen flex justify-center">
      <div className=" w-full m-10 bg-white shadow-md font-[Quicksand] container">

        {/* Header */}
        {personalInfo?.firstName && (
          <div ref={headerHeight} className="bg-[#000042] text-white p-6 flex justify-between cv-section">
            <div>
              <h1 className="text-2xl font-bold">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
             <p className="text-sm">{personalInfo.role}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="text-xs text-right text-gray-300">
                {personalInfo.phone && <div className="flex gap-2 w-50 text-center">
                  <img className="w-4 h-4" src="/images/phone.png" alt="phone" /><p>{personalInfo.phone}</p>
                </div>}
                {personalInfo.country && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/location.png" alt="location" /><p>{personalInfo.city}, {personalInfo.country}</p>
                </div>}
                {personalInfo.email && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/email.png" alt="email" /><p>{personalInfo.email}</p>
                </div>}
              </div>
              <div className="text-xs text-gray-300">
                {personalInfo.linkedInUrl && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/linkedin.png" alt="linkedin" /><p className="text-sm">{personalInfo.linkedInUrl}</p>
                </div>}
                {personalInfo.nationality && <div className="flex gap-2 w-50 text-center"> <img className="w-4 h-4" src="/images/nation.png" alt="nationality" /><p>{personalInfo.nationality}</p>
                </div>}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4" >

          {/* professionalSummary */}
          {professionalSummary && (
            <div className="cv-section" ref={summaryHeight}>
              <div className="section-header">
                <div className="table-row">
                    <h2 className="text-sm font-bold text-[#5F53F5] mb-1 ">
                    Professional Summary
                  </h2>
                </div>
              </div>
              <div className="section-body" data-title="Professional Summary">
                <p className="text-xs text-gray-600">{professionalSummary}</p>
              </div>
              <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]" />
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                  Education
                </h2>
              </div>

              <div className="section-body" data-title="Education">
              {education.map((e, index) => (
                <div className="item" key={`${e.degree}-${index}`}>
                  <div className="flex justify-between">
                    <div className="">
                      <p className="text-xs font-semibold">{e.fieldOfStudy}</p>
                      <p className="text-xs">{e.degree}</p>
                      <p className="text-xs">{e.school},{e.city},{e.country}</p>
                      <p className="text-xs">GPA : {e.grade}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">
                        {e.startDate} - {e.endDate || "Present"}
                      </p>
                    </div>
                  </div>

                  {index < education.length - 1 && (
                    <div className="my-2 h-[1px] bg-gray-200" />
                  )}
                </div>
              ))}
              </div>

              <div className="mt-2 h-[2px] bg-[#5D5CFF]" />
            </section>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                  Experience
                </h2>
              </div>

              <div className="section-body" data-title="Experience">
              {experience.map((exp, index) => (
                <div key={`${exp.jobTitle}-${index}`} className="item" >
                  <div className="flex justify-between">
                    <div className="">
                      <p className="font-bold text-xs">{exp.jobTitle}</p>
                      <p className="text-xs">
                        {[exp.employer, exp.city, exp.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs font-bold">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                    </div>
                  </div>

                  <ul className="text-xs list-disc ml-4">
                    {exp.responsibilities?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>

                  {index < experience.length - 1 && (
                    <div className="my-2 h-[1px] bg-gray-200" />
                  )}
                </div>
              ))}
              </div>

              <div className="mt-2 h-[2px] bg-[#5D5CFF]" />
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                  Projects
                </h2>
              </div>

              <div className="section-body" data-title="Projects" >
              {projects.map((p, index) => (
                <div className="item" key={`${p.projectTitle}-${index}`}>
                  <div className="">
                    <p className="text-xs font-semibold">{p.projectTitle}</p>
 
                    <ul className="text-xs list-disc ml-4">
                      {p.keyFeatures?.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                    <p className="text-xs my-1">Live Demo : <span className="hover:text-blue-500">{p.projectUrl}</span></p>
                  </div>

                  {index < projects.length - 1 && (
                    <div className="my-2 h-[1px] bg-gray-200" />
                  )}
                </div>
              ))}
              </div>

              <div className="mt-2 h-[2px] bg-[#5D5CFF]" />
            </section>
          )}

          {/* Awards */}
          {awards?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                  <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                  Awards
                </h2>
              </div>

              <div className="section-body" data-title="Awards">
              {awards.map((a, index) => (
                <div key={`${a.awardName}-${index}`} className="item flex justify-between">
                  <div>
                    <p className="text-xs font-semibold">{a.awardName}</p>
                    <p className="text-xs">{a.issueingOrg}</p>
                    <p className="text-xs my-1">{a.description}</p>
                  </div>
                  <div className="flex">
                      <p className="text-xs font-bold">
                        {a.issueingDate} - {a.expirationDate || "Present"}
                      </p>
                    </div>
                </div>
              ))}
              </div>
              <div className="mt-2 h-[2px] bg-[#5D5CFF]" />
            </section>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                Skills
              </h2>
              </div>

              <div className="grid grid-cols-5 gap-2 section-body" data-title="Skills">
                {skills.map((s, index) => (
                  <div key={`${s.skill}-${index}`} className="item">
                    <p className="text-xs">{s.skill}</p>
                    <div className="flex gap-1 my-1">
                    {[0,1,2,3,4].map((i)=> 
                      ( i<= s.level?
                      <div className="w-2 h-2 rounded-xl bg-[#5F53F5]" ></div> : <div className="w-2 h-2 rounded-xl border border-[#5F53F5]"> </div>
                      )
                    )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-[2px] bg-[#5D5CFF]" />
            </section>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <section className="cv-section">
              <div className="section-header">
                <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
                Languages
              </h2>
             </div>

              <div className="grid grid-cols-5 gap-2 section-body" data-title="Languages">
                {languages.map((l, index) => (
                  <div key={`${l.language}-${index}`} className="item">
                    <p className="text-xs">{l.language}</p>
                    <div className="flex gap-1 my-1">
                    {[0,1,2,3,4].map((i)=> 
                      ( i<= l.level?
                      <div className="w-2 h-2 rounded-xl bg-[#5F53F5]" ></div> : <div className="w-2 h-2 rounded-xl border border-[#5F53F5]"> </div>
                      )
                    )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default React.memo(TemplateOne);