import { createRouter, createWebHistory } from "vue-router";
import { authRoutes, authBeforeEnter } from "./auth.route";
import { userRoutes, userBeforeEnter } from "./user.route";



const routes = [
    {
        path: "/",
        name: "Home",
        redirect: "/auth/sign-in",
    },
    {
        path: "/auth",
        children: authRoutes,
        beforeEnter: authBeforeEnter,
    },
    {
        path: "/user",
        children: userRoutes,
        beforeEnter: userBeforeEnter,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;
