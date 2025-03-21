import { mcuBeforeEnter } from "@/middlewares/mcu.middleware"



const mcuRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/mcu/${to.params.mcuId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Mcu Dashboard",
        component: () => import("@/views/user/greenhouse/mcu/McuDashboard.vue"),
    },
    {
        path: "pins",
        name: "Mcu Pins",
        component: () => import("@/views/user/greenhouse/mcu/McuPins.vue"),
    },
    {
        path: "sensors",
        name: "Mcu Sensors",
        component: () => import("@/views/user/greenhouse/mcu/McuSensors.vue"),
    },
    {
        path: "actuators",
        name: "Mcu Actuators",
        component: () => import("@/views/user/greenhouse/mcu/McuActuators.vue"),
    },
    {
        path: "settings",
        name: "Mcu Settings",
        component: () => import("@/views/user/greenhouse/mcu/McuSettings.vue"),
    },
]



export { mcuRoutes, mcuBeforeEnter }