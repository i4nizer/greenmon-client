import { useActuatorStore } from "@/stores/actuator.store";
import { useMcuStore } from "@/stores/mcu.store";
import { useSensorStore } from "@/stores/sensor.store";



/** Requires valid mcuId parameter. */
const mcuBeforeEnter = async (to, from, next) => {
    // check mcuId params
    const { mcuId, greenhouseId } = to.params;
    if (!mcuId) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    // fetch mcus first
    const { mcus, retrieveMcu, retrievePin } = useMcuStore();
    await retrieveMcu(greenhouseId)
        .catch(console.error);

    // not exists
    const mcuIndex = mcus.findIndex((m) => m.id == mcuId);
    if (mcuIndex == -1) return next(`/user/greenhouse/${greenhouseId}/dashboard`);

    // fetch pins of the mcu
    Promise.all(mcus.map(m => retrievePin(m.id)))
        .catch(console.error())

    // fetch sensors & their outputs
    const { sensors, retrieveSensor, retrieveOutput } = useSensorStore();
    retrieveSensor(mcuId)
        .then(() => sensors.map((s) => retrieveOutput(s.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    // fetch actuators & their inputs
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore()
    retrieveActuator(mcuId)
        .then(() => actuators.map((a) => retrieveInput(a.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error)

    next();
};



export { mcuBeforeEnter };
