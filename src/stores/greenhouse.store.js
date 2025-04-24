import api from "@/utils/api.util"
import { reactive } from "vue";
import { defineStore } from "pinia";



export const useGreenhouseStore = defineStore('greenhouse', () => {
    // ---state
    const greenhouses = reactive([]);

    // ---actions
    const createGreenhouse = async (greenhouse) => {
        const res = await api.post('/user/greenhouse', greenhouse);
        greenhouses.push(res.data.greenhouse);
        return res;
    }

    const retrieveGreenhouse = async () => {
        const res = await api.get('/user/greenhouse');

        const union = [...new Map([...greenhouses, ...res.data.greenhouses].map(g => [g.id, g])).values()]
        greenhouses.splice(0, greenhouses.length);
        greenhouses.push(...union);

        return res;
    }

    const updateGreenhouse = async (greenhouse) => {
        greenhouse.greenhouseId = greenhouse.id
        const res = await api.patch(`/user/greenhouse`, greenhouse);
        
        const index = greenhouses.findIndex(g => g.id == greenhouse.id);
        greenhouses.splice(index, 1, greenhouse);
        
        return res;
    }

    const destroyGreenhouse = async (greenhouseId) => {
        const res = await api.delete(`/user/greenhouse?greenhouseId=${greenhouseId}`);
        const index = greenhouses.findIndex(g => g.id == greenhouseId);
        greenhouses.splice(index, 1);
        return res;
    }

    // ---expose
    return {
        greenhouses,
        createGreenhouse,
        retrieveGreenhouse,
        updateGreenhouse,
        destroyGreenhouse,
    }
}, { persist: true })