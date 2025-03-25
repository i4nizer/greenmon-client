<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex ga-1">
            <span>{{ sensor?.name }}</span>
            <v-spacer></v-spacer>

            <McuSensorDialog 
                type="Update" 
                class="w-100 w-md-50" 
                v-model="state.sensorEditDialog"
                :initial="sensor"
                @submit="s => emit('edit-sensor', s)"
            ></McuSensorDialog>

            <v-menu open-on-hover>
                <template #activator="{ props: menuProps }">
                    <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        color="white"
                        class="bg-transparent"
                        :="menuProps"
                    ></v-btn>
                </template>
                <template #default>
                    <v-list>
                        <v-list-item 
                            link 
                            rounded 
                            title="Edit"
                            @click="state.sensorEditDialog = true"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Delete"
                            @click="emit('delete-sensor', sensor?.id)"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </v-card-title>

        <v-card-subtitle>{{ sensor?.label }}</v-card-subtitle>
        
        <v-card-text>
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <SensorOutputDialog 
                        type="Create" 
                        class="w-100 w-md-50" 
                        :pins="pins"
                        @submit="onCreateOutput"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Output"
                                color="white"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </SensorOutputDialog>
                </v-list-subheader>
                <v-list-item v-for="output in outputs">
                    <SensorOutputCard
                        :key="output?.id"
                        :pins="pins"
                        :output="output"
                        @edit="o => emit('edit-output', o)"
                        @delete="o => emit('delete-output', o, sensor?.id)"
                    />
                </v-list-item>
            </v-list>
            <span v-if="!outputs.length" class="text-grey">No Outputs Yet</span>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent, reactive } from "vue";

const McuSensorDialog = defineAsyncComponent(() => import("./McuSensorDialog.vue"))
const SensorOutputCard = defineAsyncComponent(() => import("./SensorOutputCard.vue"));
const SensorOutputDialog = defineAsyncComponent(() => import("./SensorOutputDialog.vue"));


// ---events
const emit = defineEmits([
    'edit-sensor',
    'delete-sensor',
    'create-output',
    'edit-output',
    'delete-output',
])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    sensor: {
        type: Object,
        required: true,
    },
    outputs: {
        type: Array,
        required: true,
    },
});

// ---state
const state = reactive({
    sensorEditDialog: false,
})

// ---events
const onCreateOutput = (output) => {
    output.sensorId = props.sensor?.id
    emit('create-output', output)
}


</script>

<style lang="scss" scoped></style>
