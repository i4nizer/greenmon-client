import { useGreenhouseStore } from "@/stores/greenhouse.store"
import { useMcuStore } from "@/stores/mcu.store"



/** Requires valid greenhouseId parameter. */
const greenhouseBeforeEnter = async (to, from, next) => {
    
    // check greenhouseId params
    const { greenhouseId } = to.params
    if (!greenhouseId) return next("/user/greenhouse")
    
    // fetch greenhouses first
    const { greenhouses, retrieve } = useGreenhouseStore()
    await retrieve()
        .catch(console.error)

    // not exist
    const greenhouseIndex = greenhouses.findIndex(g => g.id == greenhouseId)
    if (greenhouseIndex == -1) return next("/user/greenhouse")
    
    // fetch mcus & pins of that greenhouse
    const { mcus, retrieveMcu, retrievePin } = useMcuStore()
    retrieveMcu(greenhouseId)
        .then(() => mcus.map(m => retrievePin(m.id)))
        .then(async (reqs) => await Promise.all(reqs))
        .catch(console.error)
    
    next()
}



export { greenhouseBeforeEnter }