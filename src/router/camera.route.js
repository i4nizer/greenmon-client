import {
    cameraBeforeEnter,
    cameraCaptureBeforeEnter,
    cameraRealtimeBeforeEnter,
} from "@/middlewares/camera.middleware"



const cameraRoutes = [
    {
        path: "",
        redirect: (to) => `/user/greenhouse/${to.params.greenhouseId}/camera/${to.params.cameraId}/settings`,
    },
    {
        path: "dashboard",
        name: "Camera Dashboard",
        component: () => import("@/views/user/greenhouse/camera/CameraDashboard.vue"),
        beforeEnter: [cameraBeforeEnter],
    },
    {
        path: "capture",
        name: "Camera Capture",
        component: () => import("@/views/user/greenhouse/camera/CameraCapture.vue"),
        beforeEnter: [cameraBeforeEnter, cameraCaptureBeforeEnter],
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