import api from "@/utils/api.util";
import { defineStore } from "pinia";
import { reactive } from "vue";



export const useSensorStore = defineStore('sensor', () => {

    // ---state
    const hooks = reactive([])
    const sensors = reactive([])
    const outputs = reactive([])

    // ---actions
    const createSensor = async (sensor) => {
        const res = await api.post('/user/greenhouse/mcu/sensor', sensor)
        sensors.push(res.data.sensor)
        return res
    }

    const retrieveSensor = async (mcuId) => {
        const url = `/user/greenhouse/mcu/sensor?mcuId=${mcuId}`;
        const res = await api.get(url);
        
        const union = [...new Map([...sensors, ...res.data.sensors].map(p => [p.id, p])).values()]
        sensors.splice(0, sensors.length)
        sensors.push(...union)
        
        return res
    }

    const updateSensor = async (sensor) => {
        sensor.sensorId = sensor.id
        const res = await api.patch('/user/greenhouse/mcu/sensor', sensor)

        const index = sensors.findIndex(p => p.id == sensor.id)
        sensors.splice(index, 1, sensor)

        return res
    }

    const destroySensor = async (sensorId) => {
        const res = await api.delete(`/user/greenhouse/mcu/sensor?sensorId=${sensorId}`)

        const index = sensors.findIndex(p => p.id == sensorId)
        sensors.splice(index, 1)

        return res
    }

    const createOutput = async (output) => {
        const url = "/user/greenhouse/mcu/sensor/output";
        const res = await api.post(url, output);
        outputs.push(res.data.output);
        return res;
    };

    const retrieveOutput = async (sensorId) => {
        const url = `/user/greenhouse/mcu/sensor/output?sensorId=${sensorId}`;
        const res = await api.get(url);

        const union = [...new Map([...outputs, ...res.data.outputs].map((p) => [p.id, p])).values()];
        outputs.splice(0, outputs.length);
        outputs.push(...union);

        return res;
    };

    const updateOutput = async (output) => {
        output.outputId = output.id;
        const url = "/user/greenhouse/mcu/sensor/output";
        const res = await api.patch(url, output);

        const index = outputs.findIndex((p) => p.id == output.id);
        outputs.splice(index, 1, output);

        return res;
    };

    const destroyOutput = async (outputId) => {
        const url = `/user/greenhouse/mcu/sensor/output?outputId=${outputId}`;
        const res = await api.delete(url);

        const index = outputs.findIndex((p) => p.id == outputId);
        outputs.splice(index, 1);

        return res;
    };
    
    const createHook = async (hook) => {
        const url = "/user/greenhouse/mcu/sensor/hook";
        const res = await api.post(url, hook);
        hooks.push(res.data.hook);
        return res;
    };

    const retrieveHook = async (sensorId) => {
        const url = `/user/greenhouse/mcu/sensor/hook?sensorId=${sensorId}`;
        const res = await api.get(url);

        const union = [...new Map([...hooks, ...res.data.hooks].map((p) => [p.id, p])).values()];
        hooks.splice(0, hooks.length);
        hooks.push(...union);

        return res;
    };

    const updateHook = async (hook) => {
        hook.hookId = hook.id;
        const url = "/user/greenhouse/mcu/sensor/hook";
        const res = await api.patch(url, hook);

        const index = hooks.findIndex((p) => p.id == hook.id);
        hooks.splice(index, 1, hook);

        return res;
    };

    const destroyHook = async (hookId) => {
        const url = `/user/greenhouse/mcu/sensor/hook?hookId=${hookId}`;
        const res = await api.delete(url);

        const index = hooks.findIndex((p) => p.id == hookId);
        hooks.splice(index, 1);

        return res;
    };

    // ---expose
    return {
        sensors,
        createSensor,
        retrieveSensor,
        updateSensor,
        destroySensor,

        outputs,
        createOutput,
        retrieveOutput,
        updateOutput,
        destroyOutput,
        
        hooks,
        createHook,
        retrieveHook,
        updateHook,
        destroyHook,
    }
}, { persist: true })