import { commonApi } from "./commonApi";
import { serverurl } from "./serverUrl";
import axios from "axios";

export const registerApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/register`,reqBody)
}

export const verifyEmailApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/verify-email`,reqBody)
}

export const loginApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/login`,reqBody)
}
export const googleloginApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/google-login`,reqBody)
}

export const forgotPasswordApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/forgot-password`,reqBody)
}

export const resetPasswordApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/reset-password`,reqBody)
}



export const resumeParseApi = async(reqBody) => {
    return await axios({
        method: "POST",
        url:`${serverurl}/resume-parse`,
        data: reqBody,
        responseType: "json",
        headers: {
            "Content-Type": "multipart/form-data",  // ← required for multer to read the file
        },
    });
};

//   ----------------users----------------------

export const storeDataApi = async(reqBody,reqHeader) => {
    return await commonApi("POST",`${serverurl}/store-data`,reqBody,reqHeader)
}
export const generatePdfApi = async(reqBody) => {
    return await axios({
        method: 'POST',
        url: `${serverurl}/generate-pdf`,
        data: reqBody,           // plain object, no JSON.stringify
        responseType: 'json',
        headers: { 'Content-Type': 'application/json' },
    });
}

export const getAllResumesApi = async(reqHeader) => {
    return await commonApi("GET",`${serverurl}/get-resumes`,"",reqHeader)
}

export const deleteResumeApi = async(id) => {
    return await commonApi("DELETE",`${serverurl}/delete-resume/${id}`,)
}

export const sendSetupPasswordOtpApi = async (reqHeader) => {
    return await commonApi('POST',`${serverurl}/send-setup-password-otp`,{},reqHeader)
}

export const setupPasswordApi = async (reqBody,reqHeader) => {
    return await commonApi('POST',`${serverurl}/setup-password`,reqBody,reqHeader)
}

export const deleteAccountApi = async (reqHeader) => {
    return await commonApi('DELETE',`${serverurl}/delete-account`,"",reqHeader)
}