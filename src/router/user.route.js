import { userBeforeEnter } from "@/middlewares/user.middleware";
import { greenhouseRoutes } from "./greenhouse.route";



const userRoutes = [
    {
        path: "",
        redirect: "/user/greenhouse",
    },
    {
        path: "greenhouse",
        name: "User Greenhouse",
        component: () => import("@/views/user/UserGreenhouse.vue"),
        beforeEnter: userBeforeEnter,
    },
    {
        path: "settings",
        name: "User Settings",
        component: () => import("@/views/user/UserSettings.vue"),
        beforeEnter: userBeforeEnter,
    },
    {
        path: "greenhouse/:greenhouseId(\\d+)",
        children: greenhouseRoutes,
    },
];



export { userRoutes };
