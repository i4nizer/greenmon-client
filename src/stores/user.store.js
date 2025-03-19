import env from "@/configs/env.config";
import api from "@/utils/api.util";
import axios from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";



export const useUserStore = defineStore('user', () => {
    
    // ---state
    const user = reactive({
        id: "",
        name: "",
        email: "",
        verified: false,
        disabled: false,
        createdAt: new Date(),
    });
    
    /** Dates in milliseconds these actions are done. */
    const recent = reactive({
        /** The time password-reset is done. */
        passwordReset: 0,
        
        /** The time password-reset otp email is sent. */
        passwordResetOtp: 0,

        /** The time user's account is verified. */
        accountVerification: 0,

        /** The time account-verification otp email is sent. */
        accountVerificationOtp: 0,
    });

    // ---actions
    const set = (data) => {
        user.id = data.id ?? user.id;
        user.name = data.name ?? user.name;
        user.email = data.email ?? user.email;
        user.verified = data.verified ?? user.verified;
        user.disabled = data.disabled ?? user.disabled;
        user.createdAt = data.createdAt ?? user.createdAt;
    };

    const clear = () => {
        user.id = "";
        user.name = "";
        user.email = "";
        user.verified = false;
        user.disabled = false;
        user.createdAt = new Date(Date.now());
    };

    const signUp = async (user) => {
        const res = await axios.post(`${env.apiDomain}/user/sign-up`, user);
        set(res.data.user);
        recent.accountVerificationOtp = Date.now();
        return res;
    }

    const verifyAccountVerificationOtp = async (userId, otp) => {
        const url = `${env.apiDomain}/user/account-verification-otp`;
        const res = await axios.post(url, { userId, otp });
        
        user.verified = true;
        recent.accountVerification = Date.now();
        recent.accountVerificationOtp = 0;
        
        return res;
    }

    const signIn = async (email, password) => {
        const res = await axios.post(`${env.apiDomain}/user/sign-in`, { email, password })
        set(res.data.user)
        return res;
    }

    const signOut = async (refreshToken) => {
        const body = { refreshToken }
        const res = await api.post("/user/sign-out", body);
        clear();
        return res;
    }

    const forgotPassword = async (email) => {
        const res = await axios.post(`${env.apiDomain}/user/forgot-password`, { email });
        recent.passwordResetOtp = Date.now();
        return res;
    }

    const verifyResetPasswordOtp = async (email, otp) => {
        const url = `${env.apiDomain}/user/reset-password-otp`;
        const res = await axios.post(url, { email, otp });
        recent.passwordResetOtp = 0;
        return res;
    };

    const resetPassword = async (email, password) => {
        const url = `${env.apiDomain}/user/reset-password`;
        const res = await axios.post(url, { email, password });
        recent.passwordReset = Date.now();
        return res;
    }

    const update = async (name) => {
        const res = await api.patch("/user", { name });
        user.name = name;
        return res;
    };

    // ---expose
    return {
        user,
        recent,
        
        set,
        clear,

        signUp,
        verifyAccountVerificationOtp,
        signIn,
        signOut,
        forgotPassword,
        verifyResetPasswordOtp,
        resetPassword,
        update,
    };
}, { persist: true })