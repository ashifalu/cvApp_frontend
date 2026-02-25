import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedTemplate : null,
    cvData : {
        personalInfo: {},
        professionalSummary: "",
        education: [],
        experience: [],
        skills: [],
        languages: [],
        projects: [],
        awards: []
    }
}

const cvSlice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        setTemplate : (state, action) => {
            state.selectedTemplate = action.payload; 
        },
        addPersonalInfo : (state,action) => {
            state.cvData.personalInfo = action.payload;
        },
        addProfessionalSummary : (state,action) => {
            state.cvData.professionalSummary = action.payload;
        },
        addExperience : (state, action) => {
            state.cvData.experience.push(action.payload)
        },
        addEducation : (state, action) => {
            state.cvData.education.push(action.payload)
        },
        addSkills : (state, action) => {
            state.cvData.skills.push(action.payload)
        },
        addLanguages : (state, action) => {
            state.cvData.languages.push(action.payload)
        },
        addProjects : (state, action) => {
            state.cvData.projects.push(action.payload)
        },
        addAwards : (state, action) => {
            state.cvData.awards.push(action.payload)
        },
        resetCv : () => initialState
    }
})
export const {
    setTemplate,
    addPersonalInfo,
    addProfessionalSummary, 
    addExperience,
    addEducation,
    addSkills,
    addLanguages,
    addProjects,
    addAwards,
    resetCv
} = cvSlice.actions;

export default cvSlice.reducer;