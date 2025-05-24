<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="@/assets/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
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
const { greenhouses, updateGreenhouse } = useGreenhouseStore()

// ---composables
const route = useRoute()

// ---getters
const greenhouse = computed(() => greenhouses.find(g => g.id == route.params.greenhouseId))

// ---state
const state = reactive({ updating: false })

// ---events
const onUpdateGreenhouse = async (greenhouse) => {
    state.updating = true

    await updateGreenhouse({ ...greenhouse })
        .catch(console.error)

    state.updating = false
}

</script>

<style lang="scss" scoped>

</style>