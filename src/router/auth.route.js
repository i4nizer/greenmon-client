import { authBeforeEnter } from "@/middlewares/auth.middleware"



const authRoutes = [
    {
        path: "sign-up",
        name: "Sign Up",
        component: () => import("@/views/auth/SignUp.vue"),
    },
    {
        path: "sign-in",
        name: "Sign In",
        component: () => import("@/views/auth/SignIn.vue"),
    },
    {
        path: "forgot-password",
        name: "Forgot Password",
        component: () => import("@/views/auth/ForgotPassword.vue"),
    },
    {
        path: "reset-password",
        name: "Reset Password",
        component: () => import("@/views/auth/ResetPassword.vue"),
    },
]



export { authRoutes, authBeforeEnter }