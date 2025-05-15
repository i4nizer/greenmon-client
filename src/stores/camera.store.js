import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";


export const useCameraStore = defineStore('camera', () => {

    // ---state
    const cameras = reactive([])

    // ---actions
    const createCamera = async (camera) => {
        const res = await api.post('/user/greenhouse/camera', camera)
        cameras.push(res.data.camera)
        return res
    }

    const retrieveCamera = async (greenhouseId) => {
        const url = `/user/greenhouse/camera?greenhouseId=${greenhouseId}`;
        const res = await api.get(url);
        
        const union = [...new Map([...cameras, ...res.data.cameras].map(m => [m.id, m])).values()]
        cameras.splice(0, cameras.length)
        cameras.push(...union)
        
        return res
    }

    const updateCamera = async (camera) => {
        camera.cameraId = camera.id
        const res = await api.patch('/user/greenhouse/camera', camera)

        const index = cameras.findIndex(m => m.id == camera.id)
        cameras.splice(index, 1, camera)

        return res
    }

    const destroyCamera = async (cameraId) => {
        const res = await api.delete(`/user/greenhouse/camera?cameraId=${cameraId}`)

        const index = cameras.findIndex(m => m.id == cameraId)
        cameras.splice(index, 1)

        return res
    }

    // ---expose
    return {
        cameras,
        createCamera,
        retrieveCamera,
        updateCamera,
        destroyCamera,
    }
}, { persist: true })