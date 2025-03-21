import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";





export const useMcuStore = defineStore('mcu', () => {

    // ---state
    const mcus = reactive([])

    // ---actions
    const create = async (mcu) => {
        const res = await api.post('/user/greenhouse/mcu', mcu)
        mcus.push(res.data.mcu)
        return res
    }

    const retrieve = async (greenhouseId) => {
        const url = `/user/greenhouse/mcu?greenhouseId=${greenhouseId}`;
        const res = await api.get(url);
        
        mcus.splice(0, mcus.length)
        mcus.push(...res.data.mcus)
        
        return res
    }

    const update = async (mcu) => {
        mcu.mcuId = mcu.id
        const res = await api.patch('/user/greenhouse/mcu', mcu)

        const index = mcus.findIndex(m => m.id == mcu.id)
        mcus.splice(index, 1, mcu)

        return res
    }

    const destroy = async (mcuId) => {
        const res = await api.delete(`/user/greenhouse/mcu?mcuId=${mcuId}`)

        const index = mcus.findIndex(m => m.id == mcuId)
        mcus.splice(index, 1)

        return res
    }

    // ---expose
    return {
        mcus,
        create,
        retrieve,
        update,
        destroy,
    }
})