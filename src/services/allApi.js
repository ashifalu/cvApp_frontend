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