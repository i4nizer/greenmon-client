import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";





export const useMcuStore = defineStore('mcu', () => {

    // ---state
    const mcus = reactive([])
    const pins = reactive([])

    // ---actions
    const createMcu = async (mcu) => {
        const res = await api.post('/user/greenhouse/mcu', mcu)
        mcus.push(res.data.mcu)
        return res
    }

    const retrieveMcu = async (greenhouseId) => {
        const url = `/user/greenhouse/mcu?greenhouseId=${greenhouseId}`;
        const res = await api.get(url);
        
        const union = [...new Map([...mcus, ...res.data.mcus].map(m => [m.id, m])).values()]
        mcus.splice(0, mcus.length)
        mcus.push(...union)
        
        return res
    }

    const updateMcu = async (mcu) => {
        mcu.mcuId = mcu.id
        const res = await api.patch('/user/greenhouse/mcu', mcu)

        const index = mcus.findIndex(m => m.id == mcu.id)
        mcus.splice(index, 1, mcu)

        return res
    }

    const destroyMcu = async (mcuId) => {
        const res = await api.delete(`/user/greenhouse/mcu?mcuId=${mcuId}`)

        const index = mcus.findIndex(m => m.id == mcuId)
        mcus.splice(index, 1)

        return res
    }

    const createPin = async (pin) => {
        const res = await api.post('/user/greenhouse/mcu/pin', pin)
        pins.push(res.data.pin)
        return res
    }

    const retrievePin = async (mcuId) => {
        const url = `/user/greenhouse/mcu/pin?mcuId=${mcuId}`;
        const res = await api.get(url);
        
        const union = [...new Map([...pins, ...res.data.pins].map(p => [p.id, p])).values()]
        pins.splice(0, pins.length)
        pins.push(...union)
        
        return res
    }

    const updatePin = async (pin) => {
        pin.pinId = pin.id
        const res = await api.patch('/user/greenhouse/mcu/pin', pin)

        const index = pins.findIndex(p => p.id == pin.id)
        pins.splice(index, 1, pin)

        return res
    }

    const destroyPin = async (pinId) => {
        const res = await api.delete(`/user/greenhouse/mcu/pin?pinId=${pinId}`)

        const index = pins.findIndex(p => p.id == pinId)
        pins.splice(index, 1)

        return res
    }

    // ---expose
    return {
        mcus,
        createMcu,
        retrieveMcu,
        updateMcu,
        destroyMcu,
        
        pins,
        createPin,
        retrievePin,
        updatePin,
        destroyPin,
    }
})