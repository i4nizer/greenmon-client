<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Microcontroller Pins</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <McuPinsTable
                        class="w-sm-100 w-md-75 w-lg-50 w-xl-25"
                        :pins="mcu.pins"
                        :loading="state.loading"
                        @create="onCreatePin"
                        @edit="onEditPin"
                        @delete="onDeletePin"
                    />
                </v-col>
            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { useMcuStore } from '@/stores/mcu.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))
const McuPinsTable = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuPinsTable.vue"))


// ---stores
const { mcus, pins, createPin, updatePin, destroyPin } = useMcuStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId

// ---getters
const mcu = computed(() => {
    const mcu = mcus.find(m => m.id == mcuId)
    mcu.pins = pins.filter(p => p.mcuId == mcuId)
    return mcu;
})

// ---state
const state = reactive({ loading: false })

// ---events
const onCreatePin = async (pin) => {
    state.loading = true

    pin.mcuId = mcuId
    await createPin(pin).catch(console.error)

    state.loading = false
}

const onEditPin = async (pin) => {
    state.loading = true

    await updatePin(pin).catch(console.error)

    state.loading = false
}

const onDeletePin = async (pinId) => {
    state.loading = true

    await destroyPin(pinId).catch(console.error)

    state.loading = false
}


</script>

<style lang="scss" scoped>

</style>