import { greenhouseBeforeEnter } from "@/middlewares/greenhouse.middleware";



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
        path: "devices",
        name: "Greenhouse Devices",
        component: () => import("@/views/user/greenhouse/GreenhouseDevices.vue"),
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
];



export { greenhouseRoutes, greenhouseBeforeEnter };
