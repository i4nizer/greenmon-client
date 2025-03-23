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
                        density="compact"
                        :pins="mcuPins"
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
import { usePinStore } from '@/stores/pin.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))
const McuPinsTable = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuPinsTable.vue"))


// ---stores
const { pins, create, update, destroy } = usePinStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId

// ---getters
const mcuPins = computed(() => pins.filter(p => p.mcuId == mcuId))

// ---state
const state = reactive({ loading: false })

// ---events
const onCreatePin = async (pin) => {
    state.loading = true

    pin.mcuId = mcuId
    await create(pin).catch(console.error)

    state.loading = false
}

const onEditPin = async (pin) => {
    state.loading = true

    await update(pin).catch(console.error)

    state.loading = false
}

const onDeletePin = async (pinId) => {
    state.loading = true

    await destroy(pinId).catch(console.error)

    state.loading = false
}


</script>

<style lang="scss" scoped>

</style>