import { greenhouseBeforeEnter } from "@/middlewares/greenhouse.middleware";
import { mcuRoutes } from "./mcu.route";



const greenhouseRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Greenhouse Dashboard",
        component: () => import("@/views/user/greenhouse/GreenhouseDashboard.vue"),
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "mcu",
        name: "Greenhouse Mcus",
        component: () => import("@/views/user/greenhouse/GreenhouseMcus.vue"),
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "automation",
        name: "Greenhouse Automation",
        component: () => import("@/views/user/greenhouse/GreenhouseAutomation.vue"),
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "schedule",
        name: "Greenhouse Schedule",
        component: () => import("@/views/user/greenhouse/GreenhouseSchedule.vue"),
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "settings",
        name: "Greenhouse Settings",
        component: () => import("@/views/user/greenhouse/GreenhouseSettings.vue"),
        beforeEnter: greenhouseBeforeEnter,
    },
    {
        path: "mcu/:mcuId(\\d+)",
        children: mcuRoutes,
    },
];



export { greenhouseRoutes };
