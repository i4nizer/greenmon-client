<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Greenhouse Settings</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <GreenhouseDetailsCard
                        :loading="state.updating"
                        :disabled="state.updating"
                        :greenhouse="greenhouse"
                        @change="onUpdateGreenhouse"
                    />
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))
const GreenhouseDetailsCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseDetailsCard.vue"))


// ---stores
const { greenhouses, update } = useGreenhouseStore()

// ---composables
const route = useRoute()

// ---getters
const greenhouse = computed(() => greenhouses.find(g => g.id == route.params.greenhouseId))

// ---state
const state = reactive({ updating: false })

// ---events
const onUpdateGreenhouse = async (greenhouse) => {
    state.updating = true

    await update({ ...greenhouse })
        .catch(console.error)

    state.updating = false
}

</script>

<style lang="scss" scoped>

</style>