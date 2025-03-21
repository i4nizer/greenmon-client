import { useMcuStore } from "@/stores/mcu.store"



/** Requires valid mcuId parameter. */
const mcuBeforeEnter = async (to, from, next) => {

    // check mcuId params
    const { mcuId, greenhouseId } = to.params
    if (!mcuId) return next(`/user/greenhouse/${greenhouseId}/dashboard`)
    
    // fetch mcus for the greenhouse
    const { mcus, retrieve } = useMcuStore()
    await retrieve(greenhouseId).catch(console.error)

    // not exists
    const mcuIndex = mcus.findIndex(m => m.id == mcuId)
    if (mcuIndex == -1) return next(`/user/greenhouse/${greenhouseId}/dashboard`)

    next()
}



export { mcuBeforeEnter }