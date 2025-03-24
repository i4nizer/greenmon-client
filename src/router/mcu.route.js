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
        beforeEnter: mcuBeforeEnter,
    },
    {
        path: "pins",
        name: "Mcu Pins",
        component: () => import("@/views/user/greenhouse/mcu/McuPins.vue"),
        beforeEnter: mcuBeforeEnter,
    },
    {
        path: "sensors",
        name: "Mcu Sensors",
        component: () => import("@/views/user/greenhouse/mcu/McuSensors.vue"),
        beforeEnter: mcuBeforeEnter,
    },
    {
        path: "actuators",
        name: "Mcu Actuators",
        component: () => import("@/views/user/greenhouse/mcu/McuActuators.vue"),
        beforeEnter: mcuBeforeEnter,
    },
    {
        path: "settings",
        name: "Mcu Settings",
        component: () => import("@/views/user/greenhouse/mcu/McuSettings.vue"),
        beforeEnter: mcuBeforeEnter,
    },
]



export { mcuRoutes }