import { useActionStore } from "@/stores/action.store"
import { useActuatorStore } from "@/stores/actuator.store"
import { useGreenhouseStore } from "@/stores/greenhouse.store"
import { useMcuStore } from "@/stores/mcu.store"
import { useScheduleStore } from "@/stores/schedule.store"
import { useSensorStore } from "@/stores/sensor.store"
import { useThresholdStore } from "@/stores/threshold.store"



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

    return next()
}

/** Fetches mcus. */
const greenhouseMcuBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { retrieveMcu } = useMcuStore();

    // fetch mcus
    retrieveMcu(greenhouseId);

    return next()
}

/** Fetches mcus, sensors, outputs, actuators, inputs, thresholds, conditions, actions. */
const greenhouseAutomationBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { mcus, retrieveMcu } = useMcuStore();
    const { sensors, retrieveSensor, retrieveOutput } = useSensorStore();
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore();
    const { thresholds, retrieveThreshold, retrieveCondition } = useThresholdStore();
    const { retrieve: retrieveAction } = useActionStore();

    // fetch mcus
    retrieveMcu(greenhouseId)
        // fetch sensors & actuators
        .then(() => mcus.map((m) => [retrieveSensor(m.id), retrieveActuator(m.id)]))
        .then(async (reqs) => await Promise.all(reqs.flat()))
        // fetch inputs & outputs
        .then(() => [actuators.map((a) => retrieveInput(a.id)), sensors.map((s) => retrieveOutput(s.id))])
        .then(async (reqs) => await Promise.all(reqs.flat()))
        .catch(console.error);

    // fetch thresholds
    retrieveThreshold(greenhouseId)
        // fetch actions & conditions
        .then(() => thresholds.map((t) => [retrieveAction(null, t.id), retrieveCondition(t.id)]))
        .then(async (reqs) => await Promise.all(reqs.flat()))
        .catch(console.error);

    return next()
}

/** Fetches schedules, actions, mcus, actuators, inputs. */
const greenhouseScheduleBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { schedules, retrieve: retrieveSchedule } = useScheduleStore();
    const { retrieve: retrieveAction } = useActionStore();
    const { mcus, retrieveMcu } = useMcuStore();
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore();

    // fetch schedules
    retrieveSchedule(greenhouseId)
        // fetch actions
        .then(() => schedules.map((s) => retrieveAction(s.id, null)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    // fetch mcus
    retrieveMcu(greenhouseId)
        // fetch actuators
        .then(() => mcus.map((m) => retrieveActuator(m.id)))
        .then(async (reqs) => await Promise.all(reqs))
        // fetch inputs
        .then(() => actuators.map((a) => retrieveInput(a.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    return next()
}



export {
    greenhouseBeforeEnter,
    greenhouseMcuBeforeEnter,
    greenhouseAutomationBeforeEnter,
    greenhouseScheduleBeforeEnter,
}