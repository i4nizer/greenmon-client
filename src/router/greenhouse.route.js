import {
    greenhouseBeforeEnter,
    greenhouseMcuBeforeEnter,
    greenhouseCameraBeforeEnter,
    greenhouseScheduleBeforeEnter,
    greenhouseAutomationBeforeEnter,
    greenhouseActionBeforeEnter,
    greenhouseDashboardBeforeEnter,
    greenhouseStatisticsBeforeEnter,
} from "@/middlewares/greenhouse.middleware";
import { mcuRoutes } from "./mcu.route";
import { cameraRoutes } from "./camera.route";



const greenhouseRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Greenhouse Dashboard",
        component: () => import("@/views/user/greenhouse/GreenhouseDashboard.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseDashboardBeforeEnter],
    },
    {
        path: "statistics",
        name: "Greenhouse Statistics",
        component: () => import("@/views/user/greenhouse/GreenhouseStatistics.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseStatisticsBeforeEnter],
    },
    {
        path: "mcu",
        name: "Greenhouse Mcus",
        component: () => import("@/views/user/greenhouse/GreenhouseMcus.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseMcuBeforeEnter],
    },
    {
        path: "camera",
        name: "Greenhouse Camera",
        component: () => import("@/views/user/greenhouse/GreenhouseCamera.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseCameraBeforeEnter],
    },
    {
        path: "action",
        name: "Greenhouse Action",
        component: () => import("@/views/user/greenhouse/GreenhouseAction.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseActionBeforeEnter],
    },
    {
        path: "automation",
        name: "Greenhouse Automation",
        component: () => import("@/views/user/greenhouse/GreenhouseAutomation.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseAutomationBeforeEnter],
    },
    {
        path: "schedule",
        name: "Greenhouse Schedule",
        component: () => import("@/views/user/greenhouse/GreenhouseSchedule.vue"),
        beforeEnter: [greenhouseBeforeEnter, greenhouseScheduleBeforeEnter],
    },
    {
        path: "settings",
        name: "Greenhouse Settings",
        component: () => import("@/views/user/greenhouse/GreenhouseSettings.vue"),
        beforeEnter: [greenhouseBeforeEnter],
    },
    {
        path: "mcu/:mcuId(\\d+)",
        children: mcuRoutes,
    },
    {
        path: "camera/:cameraId(\\d+)",
        children: cameraRoutes,
    },
];



export { greenhouseRoutes };
