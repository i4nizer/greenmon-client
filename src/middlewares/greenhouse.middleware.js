import { useActionStore } from "@/stores/action.store"
import { useActuatorStore } from "@/stores/actuator.store"
import { useGreenhouseStore } from "@/stores/greenhouse.store"
import { useMcuStore } from "@/stores/mcu.store"
import { useCameraStore } from "@/stores/camera.store"
import { useScheduleStore } from "@/stores/schedule.store"
import { useSensorStore } from "@/stores/sensor.store"
import { useThresholdStore } from "@/stores/threshold.store"



/** Requires valid greenhouseId parameter. */
const greenhouseBeforeEnter = async (to, from, next) => {
    // check greenhouseId params
    const { greenhouseId } = to.params;
    if (!greenhouseId) return next("/user/greenhouse");

    // fetch greenhouses first
    const { greenhouses, retrieveGreenhouse } = useGreenhouseStore();
    await retrieveGreenhouse().catch(console.error);

    // not exist
    const greenhouseIndex = greenhouses.findIndex((g) => g.id == greenhouseId);
    if (greenhouseIndex == -1) return next("/user/greenhouse");

    return next()
}

/** Fetches mcus, sensors, outputs, actuators, inputs. */
const greenhouseDashboardBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { mcus, retrieveMcu } = useMcuStore();
    const { sensors, retrieveSensor, retrieveOutput } = useSensorStore()
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore()

    // fetch mcus
    retrieveMcu(greenhouseId)
        // fetch sensors & actuators
        .then(() => mcus.map((m) => [retrieveSensor(m.id), retrieveActuator(m.id)]))
        .then(async (reqs) => await Promise.all(reqs.flat()))
        // fetch outputs & inputs
        .then(() => [sensors.map((s) => retrieveOutput(s.id)), actuators.map((a) => retrieveInput(a.id))])
        .then(async (reqs) => await Promise.all(reqs.flat()))
        .catch(console.error);

    return next()
}

/** Fetches mcus, sensors, outputs. */
const greenhouseStatisticsBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { mcus, retrieveMcu } = useMcuStore();
    const { sensors, retrieveSensor, retrieveOutput } = useSensorStore()

    // fetch mcus
    retrieveMcu(greenhouseId)
        // fetch sensors
        .then(() => mcus.map((m) => retrieveSensor(m.id)))
        .then(async (reqs) => await Promise.all(reqs))
        // fetch outputs
        .then(() => sensors.map((s) => retrieveOutput(s.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    return next()
}

/** Fetches mcus. */
const greenhouseMcuBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { mcus, retrieveMcu, retrievePin } = useMcuStore();

    // fetch mcus
    retrieveMcu(greenhouseId)
        .then(() => mcus.map(m => retrievePin(m.id)))
        .catch(console.error);

    return next()
}

/** Fetches cameras. */
const greenhouseCameraBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { retrieveCamera } = useCameraStore()

    // fetch mcus
    retrieveCamera(greenhouseId)
        .catch(console.error);

    return next()
}

/** Fetches mcus, actuators, inputs, thresholds, conditions, actions. */
const greenhouseActionBeforeEnter = async (to, from, next) => {
    const greenhouseId = to.params.greenhouseId;

    // init stores for data & funcs
    const { mcus, retrieveMcu } = useMcuStore();
    const { actuators, retrieveActuator, retrieveInput } = useActuatorStore();
    const { retrieveAction } = useActionStore();
    const { retrieveSchedule } = useScheduleStore()
    const { retrieveThreshold } = useThresholdStore()

    // fetch mcus
    retrieveMcu(greenhouseId)
        // fetch actuators
        .then(() => mcus.map((m) => retrieveActuator(m.id)))
        .then(async (reqs) => await Promise.all(reqs))
        // fetch inputs
        .then(() => actuators.map((a) => retrieveInput(a.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error);

    // fetch actions
    retrieveAction(null, null, greenhouseId)
        .catch(console.error);
        
    // fetch schedules
    retrieveSchedule(greenhouseId)
        .catch(console.error);
    
    // fetch thresholds
    retrieveThreshold(greenhouseId)
        .catch(console.error);

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
    const { retrieveAction } = useActionStore();

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
    const { schedules, retrieveSchedule } = useScheduleStore();
    const { retrieveAction } = useActionStore();
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
    greenhouseDashboardBeforeEnter,
    greenhouseStatisticsBeforeEnter,
    greenhouseMcuBeforeEnter,
    greenhouseCameraBeforeEnter,
    greenhouseActionBeforeEnter,
    greenhouseAutomationBeforeEnter,
    greenhouseScheduleBeforeEnter,
}