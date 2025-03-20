import { userBeforeEnter } from "@/middlewares/user.middleware"



const userRoutes = [
    {
        path: "",
        redirect: "/user/greenhouse",
    },
    {
        path: "greenhouse",
        name: "Greenhouse",
        components: {
            default: () => import("@/views/user/Greenhouse.vue"),
            UserNavDrawer: () => import("@/views/user/UserNavDrawer.vue"),
        }
    },
    {
        path: "settings",
        name: "Settings",
        components: {
            default: () => import("@/views/user/UserSettings.vue"),
            UserNavDrawer: () => import("@/views/user/UserNavDrawer.vue"),
        }
    },
]



export { userRoutes, userBeforeEnter }