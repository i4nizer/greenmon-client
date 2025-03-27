import { useActionStore } from "@/stores/action.store"
import { useActuatorStore } from "@/stores/actuator.store"
import { useGreenhouseStore } from "@/stores/greenhouse.store"
import { useMcuStore } from "@/stores/mcu.store"
import { useScheduleStore } from "@/stores/schedule.store"



/** Requires valid greenhouseId parameter. */
const greenhouseBeforeEnter = async (to, from, next) => {
    // check greenhouseId params
    const { greenhouseId } = to.params;
    if (!greenhouseId) return next("/user/greenhouse");

    // fetch greenhouses first
    const { greenhouses, retrieve } = useGreenhouseStore();
    await retrieve().catch(console.error);

    // not exist
    const greenhouseIndex = greenhouses.findIndex((g) => g.id == greenhouseId);
    if (greenhouseIndex == -1) return next("/user/greenhouse");

    // fetch schedules & actions of that greenhouse
    const { retrieve: retrieveAction } = useActionStore();
    const { schedules, retrieve: retrieveSchedule } = useScheduleStore();
    retrieveSchedule(greenhouseId)
        .then(() => schedules.map((s) => retrieveAction(s.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    // fetch mcus, pins, actuators, inputs of that greenhouse
    const { mcus, retrieveMcu, retrievePin } = useMcuStore();
    const { actuators, inputs, retrieveActuator, retrieveInput } = useActuatorStore();
    
    retrieveMcu(greenhouseId)
        .then(() => mcus.map((m) => [retrievePin(m.id), retrieveActuator(m.id)]))
        .then(async (reqs) => await Promise.all(reqs.flat()))
        .then(() => actuators.map((a) => retrieveInput(a.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    next();
}



export { greenhouseBeforeEnter }