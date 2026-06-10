import axios from 'axios'

// ─── Create an axios instance with retry on network failures ──────────────────
// This fixes the "pending forever after backend restart" issue.
// When nodemon restarts the server, the first request may get no response.
// The interceptor retries it automatically instead of hanging forever.
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    // Success — return as-is
    (res) => res,

    // Error — retry network errors up to 3 times
    async (err) => {
        const config = err.config;

        // Only retry if there was NO response (network error / server not ready)
        // Never retry 4xx errors — those are real errors (wrong password, not found etc.)
        const isNetworkError = !err.response;

        config._retryCount = config._retryCount || 0;

        if (isNetworkError && config._retryCount < 3) {
            config._retryCount += 1;
            // Wait 500ms, 1000ms, 1500ms before each retry
            await new Promise((res) => setTimeout(res, config._retryCount * 500));
            return axiosInstance(config);
        }

        return Promise.reject(err);
    }
);

// ─── Your existing commonApi — no changes to the signature ───────────────────
export const commonApi = async (httpRequest, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpRequest,
        url,
        data: reqBody,
        headers: reqHeader
    }

    return await axiosInstance(reqConfig).then((res) => {
        return res
    }).catch((err) => {
        return err
    })
}