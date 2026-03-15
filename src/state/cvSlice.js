import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedTemplate: null,
    cvData: {
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
        setTemplate: (state, action) => {
            state.selectedTemplate = action.payload;
        },
        addPersonalInfo: (state, action) => {
            state.cvData.personalInfo = action.payload;
        },
        addProfessionalSummary: (state, action) => {
            state.cvData.professionalSummary = action.payload;
        },
        addToList: (state, action) => {
            const { step, form } = action.payload;
            state.cvData[step].push(form)
        },
        updateList: (state, action) => {
            const { index, data,step } = action.payload;
            state.cvData[step][index] = data;
        },
        removeFromList: (state,action) => {
            const { step } = action.payload;
            state.cvData[step].splice(action.payload, 1);
        },
        // addToList: (state, action) => {
        //     state.cvData.experience.push(action.payload)
        // },
        removeEducation: (state, action) => {
            state.cvData.education.splice(action.payload, 1);
        },
        addSkills: (state, action) => {
            state.cvData.skills.push(action.payload)
        },
        addLanguages: (state, action) => {
            state.cvData.languages.push(action.payload)
        },
        addProjects: (state, action) => {
            state.cvData.projects.push(action.payload)
        },
        addAwards: (state, action) => {
            state.cvData.awards.push(action.payload)
        },
        resetCv: () => initialState
    }
})
export const {
    setTemplate,
    addPersonalInfo,
    addProfessionalSummary,
    addToList,
    updateList,
    removeFromList,
    addEducation,
    removeEducation,
    addSkills,
    addLanguages,
    addProjects,
    addAwards,
    resetCv
} = cvSlice.actions;

export default cvSlice.reducer;