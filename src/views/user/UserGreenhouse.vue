<template>
    <UserLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>User Greenhouse</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-end py-0">
                    
                    <!-- For creating greenhouse -->
                    <UserGreenhouseDialog class="w-100 w-md-50" :type="'Create'" @submit="onCreateGreenhouse">
                        <template #activator="{ props: activatorProps }">
                            <v-btn :="activatorProps">
                                <v-icon class="mr-1">mdi-plus</v-icon>
                                <span v-if="$vuetify.display.smAndUp">New Greenhouse</span>
                            </v-btn>
                        </template>
                    </UserGreenhouseDialog>
                
                </v-col>
            </v-row>
            <v-row>
                
                <!-- Greenhouse Lists -->
                <v-col v-for="greenhouse in greenhouses" xs="12" sm="6" md="4" lg="3" xl="2">
                    <UserGreenhouseCard
                        :key="greenhouse.id"
                        :greenhouse="greenhouse"
                        @view="onViewGreenhouse"
                        @edit="onEditGreenhouse"
                        @delete="onDeleteGreenhouse"
                    />
                </v-col>
                
                <!-- Fallback/emptystate when no greenhouse -->
                <v-col v-if="!greenhouses.length">
                    <v-empty-state
                        icon="mdi-greenhouse"
                        text="You haven't created any greenhouse yet."
                        title="No greenhouse yet"
                    ></v-empty-state>
                </v-col>
            
            </v-row>
        </v-container>
    </UserLayout>
</template>

<script setup>
import { useGreenhouseStore } from "@/stores/greenhouse.store";
import { defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";

const UserLayout = defineAsyncComponent(() => import("@/views/user/UserLayout.vue"))
const UserGreenhouseCard = defineAsyncComponent(() => import("@/components/user/UserGreenhouseCard.vue"));
const UserGreenhouseDialog = defineAsyncComponent(() => import("@/components/user/UserGreenhouseDialog.vue"));


// ---stores
const { greenhouses, createGreenhouse, updateGreenhouse, destroyGreenhouse } = useGreenhouseStore();

// ---composables
const router = useRouter()

// ---events
const onCreateGreenhouse = async (greenhouse) => {
    await createGreenhouse(greenhouse).catch(console.error);
};

const onViewGreenhouse = (greenhouseId) => {
    router.push(`/user/greenhouse/${greenhouseId}/dashboard`)
};

const onEditGreenhouse = async (greenhouse) => {
    await updateGreenhouse(greenhouse).catch(console.error);
};

const onDeleteGreenhouse = async (greenhouseId) => {
    await destroyGreenhouse(greenhouseId).catch(console.error);
};


</script>

<style lang="scss" scoped></style>
