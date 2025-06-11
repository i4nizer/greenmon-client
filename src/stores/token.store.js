import env from "@/configs/env.config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";



export const useTokenStore = defineStore('token', () => {
    
    // ---state
    const accessToken = ref('');
    const refreshToken = ref('');

    // ---actions
    const set = (tokens) => {
        accessToken.value = tokens.accessToken
        refreshToken.value = tokens.refreshToken
    }

    const clear = () => {
        accessToken.value = "";
        refreshToken.value = "";
    };

    // ---actions
    const rotate = async () => {
        // send refresh token to get new tokens
        const body = { refreshToken: refreshToken.value };
        let response = null;
        let error = null;
        
        // clear on error
        await axios.post(`${env.apiDomain}/user/rotate-token`, body)
            .then(res => response = res)
            .catch(err => error = err)

        // throw but clear first
        if (error) {
            clear();
            throw error;
        }
        
        // save new tokens
        accessToken.value = response.data.accessToken;
        refreshToken.value = response.data.refreshToken;
        // console.log("Token: Token rotated successfully.");

        return response;
    }

    const expiration = () => {
        const accessTokenExpiry = !accessToken.value ? 0 : (jwtDecode(accessToken.value)?.exp * 1000) || 0;
        const refreshTokenExpiry = !refreshToken.value ? 0 : (jwtDecode(refreshToken.value)?.exp * 1000) || 0;

        return {
            accessTokenExpiry,
            accessTokenExpired: Date.now() > accessTokenExpiry,
            refreshTokenExpiry,
            refreshTokenExpired: Date.now() > refreshTokenExpiry,
        }
    }

    // ---expose
    return {
        accessToken,
        refreshToken,
        set,
        clear,
        rotate,
        expiration,
    }

}, { persist: true })