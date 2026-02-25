import { useSelector } from "react-redux";

const TemplateOne = () => {

  const personalInfoData = useSelector((state) => state.cv.cvData.personalInfo);
  const professionalSummaryData = useSelector((state) => state.cv.cvData.professionalSummary);
  const experienceData = useSelector((state) => state.cv.cvData.experience)
  const educationaData = useSelector((state) => state.cv.cvData.education)
  const skillsData = useSelector((state) => state.cv.cvData.skills)
  const languageData = useSelector((state) => state.cv.cvData.languages)
  const projectsData = useSelector((state) => state.cv.cvData.projects)
  const awardsData = useSelector((state) => state.cv.cvData.awards)


  


  return (
    <div className=" min-h-screen py-10">
      {/* A4 Page */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md font-[Quicksand]">

        {/* Header */}
        {personalInfoData.firstName && <div className="bg-[#000042] text-white p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">{personalInfoData.firstName} {personalInfoData.lastName}</h1>
            <p className="text-sm">{personalInfoData.role}</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-xs text-right text-gray-300">
              <div className="flex gap-2 w-50 text-center">
                <img className="w-4 h-4" src="/images/phone.png" alt="phone" /><p>{personalInfoData.phone}</p>
              </div>
              <div className="flex gap-2 w-50 text-center">
                <img className="w-4 h-4" src="/images/location.png" alt="location" /><p>{personalInfoData.city}, {personalInfoData.country}</p>
              </div>
              <div className="flex gap-2 w-50 text-center">
                <img className="w-4 h-4" src="/images/email.png" alt="email" /><p>{personalInfoData.email}</p>
              </div>
            </div>
            <div className="text-xs text-gray-300">
              <div className="flex gap-2 w-50 text-center">
                <img className="w-4 h-4" src="/images/linkedin.png" alt="linkedin" /><p className="text-sm">{personalInfoData.linkedInUrl}</p>
              </div>
              <div className="flex gap-2 w-50 text-center">
                <img className="w-4 h-4" src="/images/nation.png" alt="nationality" /><p>{personalInfoData.nationality}</p>
              </div>
            </div>
          </div>

        </div>}

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Summary */}
          {professionalSummaryData && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              {professionalSummaryData}
            </p>
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>}

          {/* Education */}
          {educationaData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Education
            </h2>
            {
              educationaData.map((e) => (

                <div key={e.degree} >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xs">
                        {e.fieldOfStudy}
                      </p>
                      <p className="text-xs">{e.degree}</p>
                      <p className="text-xs">
                        {e.school}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs">{e.startDate}-{e.endDate}</p>
                    </div>
                  </div>
                  {educationaData.indexOf(e) < educationaData.length - 1 && <div className="my-2 h-[1px] w-full bg-gray-200"></div>}
                </div>
              )
              )
            }
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>}

          {/* experience */}
          {experienceData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Experiance
            </h2>
            {
              experienceData.map((exp) => (
                <div key={exp}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xs">
                        {exp.jobTitle}
                      </p>
                      <p className="text-xs">
                        {[exp.employer, exp.city, exp.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                    </div>
                    <div>
                      {exp.startDate && <p className="font-semibold text-xs">
                        {`${exp.startDate} - ${exp.endDate || "Present"} `}
                      </p>}
                    </div>
                  </div>
                  <div>
                    {exp.responsibilities && (
                      <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside marker:text-[#5F53F5]">
                        {exp.responsibilities.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {experienceData.indexOf(exp) < experienceData.length - 1 && <div className="my-2 h-[1px] w-full bg-gray-200"></div>}
                </div>

              )
              )
            }
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>
          }

          {/* projects */}
          {projectsData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Projects
            </h2>
            {
              projectsData.map((p) => (
                <div key={p}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xs">
                        {p.projectTitle}
                      </p>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {p.projectDescription}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-blue-500">
                        {p.projectUrl}
                      </p>
                    </div>
                  </div>
                  {projectsData.indexOf(p) < projectsData.length - 1 && <div className="my-2 h-[1px] w-full bg-gray-200"></div>}
                </div>

              )
              )
            }
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>
          }

          {/* awards */}
          {awardsData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Awards
            </h2>
            {
              awardsData.map((a) => (
                <div key={a}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xs">
                        {a.awardName}
                      </p>
                      <p className="text-xs">
                        {a.issueingOrg}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs">
                        {`${a.issueingDate} - ${a.expirationDate}`}
                      </p>
                    </div>
                  </div>
                  {awardsData.indexOf(a) < awardsData.length - 1 && <div className="my-2 h-[1px] w-full bg-gray-200"></div>}
                </div>

              )
              )
            }
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>
          }

          {/* Skills */}
          {skillsData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
              Skills
            </h2>


            
              <div className="grid grid-cols-5 gap-4">
                {skillsData.map((s, index) => (
                  <div key={index} className="mb-2 ">
                    <p className=" text-xs">{s.skill}</p>

                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border border-[#5D5CFF]
                            ${i <= s.level ? "bg-[#5D5CFF]" : ""}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
                
              </div>
              <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>}

          {languageData[0] && <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
              Languages
            </h2>
            <div className="grid grid-cols-5 gap-4">
                {languageData.map((l, index) => (
                  <div key={index} className="mb-2 ">
                    <p className=" text-xs">{l.language}</p>

                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border border-[#5D5CFF]
                            ${i <= l.level ? "bg-[#5D5CFF]" : ""}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
            
              </div>
∫          </section>}
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;