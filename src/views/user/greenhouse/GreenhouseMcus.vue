<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>Greenhouse Microcontrollers</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    <!-- For creating microcontroller -->
                    <GreenhouseMcuDialog class="w-100 w-md-50" type="Create" @submit="onCreateMcu">
                        <template #activator="{ props: activatorProps }">
                            <v-btn class="bg-green" :="activatorProps">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Microcontroller</span>
                            </v-btn>
                        </template>
                    </GreenhouseMcuDialog>
                </v-col>
            </v-row>
            <v-row>
                <!-- Microcontroller Lists -->
                <v-col v-for="mcu in mcusWithPins" xs="12" sm="6" md="4" lg="3" xl="2">
                    <GreenhouseMcuCard :key="mcu.id" :mcu="mcu" @view="onViewMcu" @edit="onEditMcu" @delete="onDeleteMcu" />
                </v-col>

                <!-- Fallback/emptystate when no mcu -->
                <v-col v-if="!mcusWithPins.length">
                    <v-empty-state
                        icon="mdi-chip"
                        text="You haven't created any microcontroller yet."
                        title="No microcontroller yet"
                    ></v-empty-state>
                </v-col>
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { useMcuStore } from "@/stores/mcu.store";
import { computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"));
const GreenhouseMcuCard = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseMcuCard.vue"));
const GreenhouseMcuDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/GreenhouseMcuDialog.vue"));

// ---stores
const { mcus, pins, createMcu, updateMcu, destroyMcu } = useMcuStore();

// ---composables
const route = useRoute();
const router = useRouter();

// ---getters
const greenhouseId = route.params.greenhouseId;
const mcusWithPins = computed(() => {
    const mwp = [];
    mcus.filter((m) => m.greenhouseId == greenhouseId).forEach((m) => mwp.push({ ...m, pins: pins.filter((p) => p.mcuId == m.id) }));
    return mwp;
});

// ---events
const onCreateMcu = async (mcu) => {
    mcu.greenhouseId = greenhouseId;
    await createMcu(mcu).catch(console.error);
};

const onViewMcu = (mcuId) => {
    router.push(`/user/greenhouse/${greenhouseId}/mcu/${mcuId}/dashboard`);
};

const onEditMcu = async (mcu) => {
    await updateMcu(mcu).catch(console.error);
};

const onDeleteMcu = async (mcuId) => {
    await destroyMcu(mcuId).catch(console.error);
};
</script>

<style lang="scss" scoped></style>
