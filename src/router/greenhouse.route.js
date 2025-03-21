import { greenhouseBeforeEnter } from "@/middlewares/greenhouse.middleware";
import { mcuBeforeEnter, mcuRoutes } from "./mcu.route";



const greenhouseRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Greenhouse Dashboard",
        component: () => import("@/views/user/greenhouse/GreenhouseDashboard.vue"),
    },
    {
        path: "mcu",
        name: "Greenhouse Mcus",
        component: () => import("@/views/user/greenhouse/GreenhouseMcus.vue"),
    },
    {
        path: "automation",
        name: "Greenhouse Automation",
        component: () => import("@/views/user/greenhouse/GreenhouseAutomation.vue"),
    },
    {
        path: "schedule",
        name: "Greenhouse Schedule",
        component: () => import("@/views/user/greenhouse/GreenhouseSchedule.vue"),
    },
    {
        path: "settings",
        name: "Greenhouse Settings",
        component: () => import("@/views/user/greenhouse/GreenhouseSettings.vue"),
    },
    {
        path: "mcu/:mcuId(\\d+)",
        children: mcuRoutes,
        beforeEnter: mcuBeforeEnter,
    },
];



export { greenhouseRoutes, greenhouseBeforeEnter };
