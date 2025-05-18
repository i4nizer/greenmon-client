import {
    cameraBeforeEnter,
    cameraRealtimeBeforeEnter,
} from "@/middlewares/camera.middleware"



const cameraRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/camera/${to.params.cameraId}/settings`,
    },
    {
        path: "realtime",
        name: "Camera Realtime",
        component: () => import("@/views/user/greenhouse/camera/CameraRealtime.vue"),
        beforeEnter: [cameraBeforeEnter, cameraRealtimeBeforeEnter],
    },
    {
        path: "settings",
        name: "Camera Settings",
        component: () => import("@/views/user/greenhouse/camera/CameraSettings.vue"),
        beforeEnter: [cameraBeforeEnter],
    },
]



export { cameraRoutes }