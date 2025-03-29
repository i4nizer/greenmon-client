import {
    mcuBeforeEnter,
    mcuPinsBeforeEnter,
    mcuSensorsBeforeEnter,
    mcuActuatorsBeforeEnter,
} from "@/middlewares/mcu.middleware"



const mcuRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/mcu/${to.params.mcuId}/dashboard`,
    },
    {
        path: "dashboard",
        name: "Mcu Dashboard",
        component: () => import("@/views/user/greenhouse/mcu/McuDashboard.vue"),
        beforeEnter: [mcuBeforeEnter],
    },
    {
        path: "pins",
        name: "Mcu Pins",
        component: () => import("@/views/user/greenhouse/mcu/McuPins.vue"),
        beforeEnter: [mcuBeforeEnter, mcuPinsBeforeEnter],
    },
    {
        path: "sensors",
        name: "Mcu Sensors",
        component: () => import("@/views/user/greenhouse/mcu/McuSensors.vue"),
        beforeEnter: [mcuBeforeEnter, mcuSensorsBeforeEnter],
    },
    {
        path: "actuators",
        name: "Mcu Actuators",
        component: () => import("@/views/user/greenhouse/mcu/McuActuators.vue"),
        beforeEnter: [mcuBeforeEnter, mcuActuatorsBeforeEnter],
    },
    {
        path: "settings",
        name: "Mcu Settings",
        component: () => import("@/views/user/greenhouse/mcu/McuSettings.vue"),
        beforeEnter: [mcuBeforeEnter],
    },
]



export { mcuRoutes }