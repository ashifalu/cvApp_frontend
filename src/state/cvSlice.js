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
        setEducation: (state, action) => {
            state.cvData.education = action.payload;
        },
        setProjects: (state, action) => {
            state.cvData.projects = action.payload;
        },
        setExperience: (state, action) => {
            state.cvData.experience = action.payload;
        },
        setAwards: (state, action) => {
            state.cvData.awards = action.payload;
        },
        setSkills: (state, action) => {
            state.cvData.skills = action.payload;
        },
        setLanguages: (state, action) => {
            state.cvData.languages = action.payload;
        },

        // addToList: (state, action) => {
        //     state.cvData.experience.push(action.payload)
        // },


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
    setEducation,
    setProjects,
    setExperience,
    setAwards,
    setSkills,
    setLanguages,
    resetCv
} = cvSlice.actions;

export default cvSlice.reducer;