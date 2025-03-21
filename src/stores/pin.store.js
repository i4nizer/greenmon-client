import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";



export const usePinStore = defineStore('pin', () => {

    // ---state
    const pins = reactive([])

    // ---actions
    const create = async (pin) => {
        const res = await api.post('/user/greenhouse/mcu', pin)
        pins.push(res.data.pin)
        return res
    }

    const retrieve = async (mcuId) => {
        const url = `/user/greenhouse/mcu/pin?mcuId=${mcuId}`;
        const res = await api.get(url);
        
        pins.splice(0, pins.length)
        pins.push(...res.data.pins)
        
        return res
    }

    const update = async (pin) => {
        pin.pinId = pin.id
        const res = await api.patch('/user/greenhouse/mcu/pin', pin)

        const index = pins.findIndex(p => p.id == pin.id)
        pins.splice(index, 1, pin)

        return res
    }

    const destroy = async (pinId) => {
        const res = await api.delete(`/user/greenhouse/mcu/pin?pinId=${pinId}`)

        const index = pins.findIndex(p => p.id == pinId)
        pins.splice(index, 1)

        return res
    }

    // ---expose
    return {
        pins,
        create,
        retrieve,
        update,
        destroy,
    }
})