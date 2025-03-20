import { userBeforeEnter } from "@/middlewares/user.middleware";
import { greenhouseBeforeEnter, greenhouseRoutes } from "./greenhouse.route";



const userRoutes = [
    {
        path: "",
        redirect: "/user/greenhouse",
    },
    {
        path: "greenhouse",
        name: "User Greenhouse",
        component: () => import("@/views/user/UserGreenhouse.vue"),
    },
    {
        path: "settings",
        name: "User Settings",
        component: () => import("@/views/user/UserSettings.vue"),
    },
    {
        path: "greenhouse/:greenhouseId(\\d+)",
        children: greenhouseRoutes,
        beforeEnter: greenhouseBeforeEnter,
    },
];



export { userRoutes, userBeforeEnter };
