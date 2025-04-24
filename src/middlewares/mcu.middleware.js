import { useActionStore } from "@/stores/action.store";
import { useActuatorStore } from "@/stores/actuator.store";
import { useMcuStore } from "@/stores/mcu.store";
import { useSensorStore } from "@/stores/sensor.store";



/** Requires valid mcuId parameter. */
const mcuBeforeEnter = async (to, from, next) => {
    // check mcuId params
    const { mcuId, greenhouseId } = to.params;
    if (!mcuId) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    // fetch mcus first
    const { mcus, retrieveMcu } = useMcuStore();
    await retrieveMcu(greenhouseId)
        .catch(console.error);

    // not exists
    const mcuIndex = mcus.findIndex((m) => m.id == mcuId);
    if (mcuIndex == -1) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    return next()
};

/** Fetches mcu pins. */
const mcuPinsBeforeEnter = async (to, from, next) => {
    const mcuId = to.params.mcuId;

    // init stores for data & funcs
    const { retrievePin } = useMcuStore()

    // fetch pins
    retrievePin(mcuId)
        .catch(console.error)
    
    return next()
}

/** Fetches mcu sensors, outputs. */
const mcuSensorsBeforeEnter = async (to, from, next) => {
    const mcuId = to.params.mcuId;
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { retrievePin } = useMcuStore()
    const { retrieveAction } = useActionStore()
    const { sensors, retrieveSensor, retrieveOutput, retrieveHook } = useSensorStore()

    // fetch pins
    retrievePin(mcuId)
        .catch(console.error)
        
    // fetch actions
    retrieveAction(null, null, greenhouseId)
        .catch(console.error)
    
    // fetch sensors
    retrieveSensor(mcuId)
        // fetch outputs
        .then(() => sensors.map((s) => [retrieveOutput(s.id), retrieveHook(s.id)]))
        .then(async (reqs) => await Promise.all(reqs.flat()))
        .catch(console.error);
    
    return next();
}

/** Fetches mcu actuators, inputs. */
const mcuActuatorsBeforeEnter = async (to, from, next) => {
    const mcuId = to.params.mcuId;

    // init stores for data & funcs
    const { retrievePin } = useMcuStore();
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore()

    // fetch pins
    retrievePin(mcuId)
        .catch(console.error)

    // fetch actuators
    retrieveActuator(mcuId)
        // fetch inputs
        .then(() => actuators.map((a) => retrieveInput(a.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error)
    
    return next();
}



export {
    mcuBeforeEnter,
    mcuPinsBeforeEnter,
    mcuSensorsBeforeEnter,
    mcuActuatorsBeforeEnter,
};
