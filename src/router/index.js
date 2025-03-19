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
        name: "Authentication",
        redirect: "/auth/sign-in",
        children: authRoutes,
        beforeEnter: authBeforeEnter,
    },
    {
        path: "/user",
        name: "User",
        redirect: "/user/greenhouse",
        children: userRoutes,
        component: () => import("@/views/user/Greenhouse.vue"),
        beforeEnter: userBeforeEnter,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
