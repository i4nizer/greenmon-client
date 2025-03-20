import { useGreenhouseStore } from "@/stores/greenhouse.store"



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
    
    next()
}



export { greenhouseBeforeEnter }