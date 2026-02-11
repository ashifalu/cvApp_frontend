import { commonApi } from "./commonApi";
import { serverurl } from "./serverUrl";


export const registerApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/register`,reqBody)
}

export const verifyEmailApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/verify-email`,reqBody)
}

export const loginApi = async (reqBody) => {
    return await commonApi('POST',`${serverurl}/login`,reqBody)
}