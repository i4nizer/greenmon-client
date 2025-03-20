import { greenhouseBeforeEnter } from "@/middlewares/greenhouse.middleware";



const greenhouseRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/user/greenhouse/GreenhouseLayout.vue"),
    },
    {
        path: "devices",
        name: "Devices",
        component: () => import("@/views/user/greenhouse/GreenhouseDevices.vue"),
    },
    {
        path: "automation",
        name: "Automation",
        component: () => import("@/views/user/greenhouse/GreenhouseAutomation.vue"),
    },
    {
        path: "schedule",
        name: "Schedule",
        component: () => import("@/views/user/greenhouse/GreenhouseSchedule.vue"),
    },
    {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/user/greenhouse/GreenhouseSettings.vue"),
    },
];



export { greenhouseRoutes, greenhouseBeforeEnter };
