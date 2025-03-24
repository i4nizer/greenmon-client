import { authBeforeEnter } from "@/middlewares/auth.middleware"



const authRoutes = [
    {
        path: "",
        redirect: "/auth/sign-in",
    },
    {
        path: "sign-up",
        name: "Sign Up",
        component: () => import("@/views/auth/SignUp.vue"),
        beforeEnter: authBeforeEnter,
    },
    {
        path: "sign-in",
        name: "Sign In",
        component: () => import("@/views/auth/SignIn.vue"),
        beforeEnter: authBeforeEnter,
    },
    {
        path: "forgot-password",
        name: "Forgot Password",
        component: () => import("@/views/auth/ForgotPassword.vue"),
        beforeEnter: authBeforeEnter,
    },
    {
        path: "reset-password",
        name: "Reset Password",
        component: () => import("@/views/auth/ResetPassword.vue"),
        beforeEnter: authBeforeEnter,
    },
];



export { authRoutes }