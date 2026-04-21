import React from 'react'
import { addPersonalInfo } from '../../state/cvSlice';

const PersonalInfo = () => {

    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        role: "",
        photo: "",
        linkedInUrl: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        nationality: "",
    })

  return (
    <> 
        <div>
        <h2 className="font-semibold">Basic Information</h2>
            <div className="grid grid-cols-2 gap-2">
                <input className="border p-2" placeholder="First Name" required onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} />
                <input className="border p-2" placeholder="Last Name" onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                <input className="border p-2" placeholder="Role" onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })} />
                <input className="border p-2" placeholder="LinkedIn Url" onChange={(e) => setPersonalInfo({ ...personalInfo, linkedInUrl: e.target.value })} />
                <input className="border p-2" placeholder="Email" onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                <input className="border p-2" placeholder="Phone" onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                <input className="border p-2" placeholder="Country" onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })} />
                <input className="border p-2" placeholder="City" onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })} />
                <input className="border p-2" placeholder="Nationality" onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })} />
                <div className="flex justify-end">
                    <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => {
                        dispatch(addPersonalInfo(personalInfo)); setCurrentStep("professionalSummary")
                    }}>Next</button>
                </div>
            </div>

        </div>
</>
  )
}

export default PersonalInfo