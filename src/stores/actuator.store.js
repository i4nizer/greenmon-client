import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";



export const useActuatorStore = defineStore('actuator', () => {

    // ---state
    const actuators = reactive([])
    const inputs = reactive([])

    // ---actions
    const createActuator = async (actuator) => {
        const res = await api.post('/user/greenhouse/mcu/actuator', actuator)
        actuators.push(res.data.actuator)
        return res
    }

    const retrieveActuator = async (mcuId) => {
        const url = `/user/greenhouse/mcu/actuator?mcuId=${mcuId}`;
        const res = await api.get(url);
        
        const union = [...new Map([...actuators, ...res.data.actuators].map(p => [p.id, p])).values()]
        actuators.splice(0, actuators.length)
        actuators.push(...union)
        
        return res
    }

    const updateActuator = async (actuator) => {
        actuator.actuatorId = actuator.id
        const res = await api.patch('/user/greenhouse/mcu/actuator', actuator)

        const index = actuators.findIndex(p => p.id == actuator.id)
        actuators.splice(index, 1, actuator)

        return res
    }

    const destroyActuator = async (actuatorId) => {
        const res = await api.delete(`/user/greenhouse/mcu/actuator?actuatorId=${actuatorId}`)

        const index = actuators.findIndex(p => p.id == actuatorId)
        actuators.splice(index, 1)

        return res
    }

    const createInput = async (input) => {
        const url = "/user/greenhouse/mcu/actuator/input";
        const res = await api.post(url, input);
        inputs.push(res.data.input);
        return res;
    };

    const retrieveInput = async (actuatorId) => {
        const url = `/user/greenhouse/mcu/actuator/input?actuatorId=${actuatorId}`;
        const res = await api.get(url);

        const union = [...new Map([...inputs, ...res.data.inputs].map((p) => [p.id, p])).values()];
        inputs.splice(0, inputs.length);
        inputs.push(...union);

        return res;
    };

    const updateInput = async (input) => {
        input.inputId = input.id;
        const url = "/user/greenhouse/mcu/actuator/input";
        const res = await api.patch(url, input);

        const index = inputs.findIndex((p) => p.id == input.id);
        inputs.splice(index, 1, input);

        return res;
    };

    const destroyInput = async (inputId) => {
        const url = `/user/greenhouse/mcu/actuator/input?inputId=${inputId}`;
        const res = await api.delete(url);

        const index = inputs.findIndex((p) => p.id == inputId);
        inputs.splice(index, 1);

        return res;
    };

    // ---expose
    return {
        actuators,
        createActuator,
        retrieveActuator,
        updateActuator,
        destroyActuator,

        inputs,
        createInput,
        retrieveInput,
        updateInput,
        destroyInput,
    }
}, { persist: true })