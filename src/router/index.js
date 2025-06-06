import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import HomePage from "@/views/HomePage.vue";

//

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomePage,
    },
    {
        path: "/auth",
        children: authRoutes,
    },
    {
        path: "/user",
        children: userRoutes,
    },
    {
        path: "/model",
        children: [
            {
                path: "details",
                name: "Model Details",
                component: () => import("@/views/model/ModelDetails.vue"),
            },
            {
                path: "detect",
                name: "Model Detect",
                component: () => import("@/views/model/ModelDetect.vue"),
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;
