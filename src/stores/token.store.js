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
        const res = await axios.post(`${env.apiDomain}/user/rotate-token`, body);

        // save new tokens
        accessToken.value = res.data.object.accessToken;
        refreshToken.value = res.data.object.refreshToken;
        console.log("Token: Token rotated successfully.");

        return res;
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