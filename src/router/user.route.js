import { userBeforeEnter } from "@/middlewares/user.middleware"



const userRoutes = [
    {
        path: "greenhouses",
        name: "Greenhouses",
        component: () => import("@/views/user/Greenhouses.vue"),
    },
]



export { userRoutes, userBeforeEnter }