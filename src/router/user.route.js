import { userBeforeEnter } from "@/middlewares/user.middleware";
import { greenhouseBeforeEnter, greenhouseRoutes } from "./greenhouse.route";



const userRoutes = [
    {
        path: "",
        redirect: "/user/greenhouse",
    },
    {
        path: "greenhouse/:greenhouseId",
        children: greenhouseRoutes,
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "greenhouse",
        name: "Greenhouse",
        component: () => import("@/views/user/UserGreenhouse.vue"),
    },
    {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/user/UserSettings.vue"),
    },
];



export { userRoutes, userBeforeEnter };
