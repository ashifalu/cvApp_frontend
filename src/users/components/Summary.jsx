import React from 'react'
import { addProfessionalSummary } from '../../state/cvSlice';

const Summary = () => {

    const [professionalSummary, setProfessionalSummary] = useState("")
    const steps = ["personalInfo", "professionalSummary", "education", "experience", "projects", "awards", "skills", "languages"];


  return (
    <>
        <div>
                    {/* Professional Summary */}
                    <h2 className="font-semibold">Professional Summary</h2>
                    <textarea className="border p-2 w-full" rows="3" placeholder="Professional Summary" onChange={(e) => setProfessionalSummary(e.target.value)} />
                    <div className="flex justify-between">
                        <button className="px-3 py-1 text-black border border-gray-200 rounded hover:border hover:border-blue-500 hover:text-blue-500" onClick={handleBack}>Back</button>
                        <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => {
                            dispatch(addProfessionalSummary(professionalSummary));
                            setCurrentStep("education")
                        }}>Next</button>
                    </div>

                </div>
    </>
  )
}

export default Summary