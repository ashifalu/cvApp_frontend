const TemplateOne = () => {

    const Skill = ({ title, level }) => {
  return (
    <div className="mb-2">
      <p className="text-xs mb-1">{title}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full border border-[#5D5CFF]
              ${i <= level ? "bg-[#5D5CFF]" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

const Experiance = ({jobTitle,employer,startDate,endDate,country,city}) => {

    return (
        <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Experiance
        </h2>
        
    )

}

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      {/* A4 Page */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md font-[Quicksand]">

        {/* Header */}
        <div className="bg-[#000042] text-white p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">MUNIRA ALKHUDAIR</h1>
            <p className="text-sm">COOP-Training</p>
          </div>

          <div className="text-sm text-right">
            <p>+123-456-7890</p>
            <p>Dubai, United Arab Emirates</p>
            <p>hello@reallygreatsite.com</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Summary */}
          <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Recent graduate in French Translation with over one year of combined training, volunteer, and project experience. Proficient in literary translation, event coordination, training development, and Microsoft Office suite. Successfully delivered multilingual children's books and organized campus events, receiving third place in a national poetry translation competition. Strong communication, teamwork, problem‑solving, and time‑management abilities demonstrated through diverse volunteer roles. Seeking a translation or cultural liaison position where I can leverage linguistic expertise and project management skills to add value.
            </p>
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Education
            </h2>
            <p className="font-semibold text-xs">
              Translation French Language
            </p>
            <p className="text-xs">Bachelor</p>
            <p className="text-xs">
              Princess Nourah Bint Abdulrahman University, Riyadh
            </p>
            <p className="text-xs">GPA: 4 out of 5</p>
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>
          <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-1">
              Experiance
            </h2>
            <p className="font-semibold text-xs">
              Job Title
            </p>
            <p className="text-xs">Bachelor</p>
            <p className="text-xs">
              Princess Nourah Bint Abdulrahman University, Riyadh
            </p>
            <p className="text-xs">GPA: 4 out of 5</p>
            <div className="mt-2 h-[2px] w-full bg-[#5D5CFF]"></div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
              Skills
            </h2>

            <Skill title="French Translation" level={3} />
            <Skill title="Literary Translation" level={5} />
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-sm font-bold text-[#5F53F5] mb-2">
              Languages
            </h2>

            <Skill title="Arabic" level={3} />
            <Skill title="English" level={5} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;