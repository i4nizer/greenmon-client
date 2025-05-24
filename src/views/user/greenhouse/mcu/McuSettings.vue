<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="@/assets/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Microcontroller Settings</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <McuDetailsCard 
                        :mcu="mcu"
                        :loading="state.updating"
                        :disabled="state.updating"
                        @change="onUpdateMcu"
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
const McuDetailsCard = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuDetailsCard.vue"))


// ---stores
const { mcus, updateMcu } = useMcuStore()

// ---composables
const route = useRoute()

// ---data
const mcuId = route.params.mcuId

// ---getters
const mcu = computed(() => mcus.find(m => m.id == mcuId))

// ---state
const state = reactive({ updating: false })

// ---events
const onUpdateMcu = async (mcu) => {
    state.updating = true

    await updateMcu(mcu)
        .catch(console.error)

    state.updating = false
}


</script>

<style lang="scss" scoped>

</style>