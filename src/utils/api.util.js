import env from "@/configs/env.config";
import axios from "axios";
import router from "@/router";
import { useTokenStore } from "@/stores/token.store";



/**
 * This axios instance automatically adds access token in authorization headers.
 */
const api = axios.create({ baseURL: env.apiDomain, withCredentials: true })

/**
 * Automatically add access token in authorization headers.
 */
api.interceptors.request.use(
    async (config) => {
        // check if need token rotation
        const { accessToken, rotate, expiration } = useTokenStore();
        const { accessTokenExpired, refreshTokenExpired } = expiration();

        // must reauthenticate
        if (refreshTokenExpired) {
            const controller = new AbortController();
            config.signal = controller.signal;
            controller.abort("User session has expired.");

            router.push("/auth/sign-in");
            return Promise.reject("Your session has expired, kindly login again.")
        }

        // must rotate
        if (accessTokenExpired) {
            let error = null;
            await rotate().catch(err => error = err);
            
            // failed to rotate
            if (error) return Promise.reject("Authentication error occurred, kindly login again.");
        }

        // add to headers
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
    }
)



export default api;