import { useGreenhouseStore } from "@/stores/greenhouse.store"
import { useMcuStore } from "@/stores/mcu.store"
import { usePinStore } from "@/stores/pin.store"



/** Requires valid greenhouseId parameter. */
const greenhouseBeforeEnter = async (to, from, next) => {
    
    // check greenhouseId params
    const { greenhouseId } = to.params
    if (!greenhouseId) return next("/user/greenhouse")
    
    // fetch data first
    const { greenhouses, retrieve } = useGreenhouseStore()
    await retrieve().catch(console.error)

    // not exist
    const greenhouseIndex = greenhouses.findIndex(g => g.id == greenhouseId)
    if (greenhouseIndex == -1) return next("/user/greenhouse")
    
    // fetch mcus with pins of that greenhouse
    const { retrieve: retrievePins } = usePinStore()
    const { mcus, retrieve: retrieveMcus } = useMcuStore()
    
    retrieveMcus(greenhouseId)
        .then(() => mcus
            .forEach(m =>
                retrievePins(m.id)
                    .then(res => m.pins = res.data.pins)
                    .catch(console.error)))
        .catch(console.error)
    
    next()
}



export { greenhouseBeforeEnter }