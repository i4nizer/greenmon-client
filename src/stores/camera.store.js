import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";


export const useCameraStore = defineStore('camera', () => {

    // ---state
    const images = reactive([])
    const cameras = reactive([])
    const detections = reactive([])

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

    const retrieveImage = async (cameraId, greenhouseId, limit = 25, offset = 0, year = new Date().getFullYear(), month = 0) => {
        const url = `/user/greenhouse/image?limit=${limit}&offset=${offset}&year=${year}&month=${month}`;
        let query = cameraId ? `&cameraId=${cameraId}` : "";
        query += greenhouseId ? `&greenhouseId=${greenhouseId}` : "";
        const res = await api.get(url + query);

        const union = [...new Map([...images, ...res.data.images].map((i) => [i.id, i])).values()];
        images.splice(0, images.length);
        images.push(...union);

        return res;
    };
    
    const retrieveDetection = async (imageId, label = null) => {
        const url = `/user/greenhouse/image/detection?imageId=${imageId}`;
        const query = label ? `&class=${label}` : ''
        const res = await api.get(url + query);

        const union = [...new Map([...detections, ...res.data.detections].map((m) => [m.id, m])).values()];
        detections.splice(0, detections.length);
        detections.push(...union);

        return res;
    };

    // ---expose
    return {
        cameras,
        createCamera,
        retrieveCamera,
        updateCamera,
        destroyCamera,

        images,
        retrieveImage,

        detections,
        retrieveDetection,
    }
}, { persist: true })