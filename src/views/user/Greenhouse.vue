<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>Greenhouses</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating greenhouse -->
                <GreenhouseDialog
                    class="w-100 w-md-50"
                    :type="'Create'"
                    :initial="{}"
                    @submit="onCreateGreenhouse"
                >
                    <template #activator="{ props: activatorProps }">
                        <v-btn :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">New Greenhouse</span>
                        </v-btn>
                    </template>
                </GreenhouseDialog>
            </v-col>
        </v-row>
        <v-row>
            <v-col 
                v-for="greenhouse in greenhouses"
                xs="12" sm="6" md="4" lg="3" xl="2"
            >
                <GreenhouseCard 
                    :key="greenhouse.id" 
                    :greenhouse="greenhouse" 
                    @view="onViewGreenhouse"
                    @edit="onEditGreenhouse"
                    @delete="onDeleteGreenhouse"
                />
            </v-col>
            <v-col v-if="!greenhouses.length">
                <v-empty-state
                    icon="mdi-greenhouse"
                    text="You haven't created any greenhouse yet."
                    title="No greenhouse yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useUserStore } from '@/stores/user.store';
import { useGreenhouseStore } from '@/stores/greenhouse.store';
import { defineAsyncComponent, onMounted, reactive } from 'vue';
import router from '@/router';

const GreenhouseCard = defineAsyncComponent(() => import('@/components/user/GreenhouseCard.vue'));
const GreenhouseDialog = defineAsyncComponent(() => import("@/components/user/GreenhouseDialog.vue"))


// ---stores
const { user } = useUserStore()
const {
    greenhouses,
    create,
    retrieve,
    update,
    destroy,
} = useGreenhouseStore()

// ---events
const onCreateGreenhouse = async (greenhouse) => {
    await create(greenhouse)
        .catch(console.error)
}

const onViewGreenhouse = (greenhouseId) => {
    // redirect here to the greenhouse
    console.log(greenhouseId)
}

const onEditGreenhouse = async (greenhouse) => {
    console.log(greenhouse)
    await update(greenhouse)
        .catch(console.error)
}

const onDeleteGreenhouse = async (greenhouseId) => {
    await destroy(greenhouseId)
        .catch(console.error)
}

// ---hooks
onMounted(async () => {
    await retrieve().catch(console.error)
})


</script>

<style lang="scss" scoped>

</style>