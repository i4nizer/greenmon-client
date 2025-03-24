import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";



const routes = [
    {
        path: "/",
        name: "Home",
        redirect: "/auth/sign-in",
    },
    {
        path: "/auth",
        children: authRoutes,
    },
    {
        path: "/user",
        children: userRoutes,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;
