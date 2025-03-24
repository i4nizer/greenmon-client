<template>
    <v-card class="border pt-3">
        <v-card-title>{{ sensor?.name }}</v-card-title>
        <v-card-subtitle>{{ sensor?.label }}</v-card-subtitle>

        <v-card-text >
            <SensorOutputCard
                v-for="output in outputs"
                :key="output?.id"
                :pins="pins"
                :output="output"
                @edit="o => emit('edit-output', o)"
                @delete="o => emit('delete-output', o, sensor?.id)"
            />
        </v-card-text>

        <v-card-actions>
            <SensorOutputDialog 
                type="Create" 
                class="w-100 w-md-50" 
                :pins="pins"
                @submit="onCreateOutput"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn :="activatorProps">
                        <v-icon class="mr-1">mdi-thermometer-plus</v-icon>
                        <span v-if="$vuetify.display.smAndUp">Add Output</span>
                    </v-btn>
                </template>
            </SensorOutputDialog>

            <McuSensorDialog 
                type="Update" 
                class="w-100 w-md-50" 
                :initial="sensor"
                @submit="s => emit('edit-sensor', s)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn color="blue" :="activatorProps">
                        <v-icon>mdi-pencil</v-icon>
                        <span v-if="$vuetify.display.smAndUp" class="ml-1">Edit</span>
                    </v-btn>
                </template>
            </McuSensorDialog>

            <v-btn color="red" @click="emit('delete-sensor', sensor?.id)">
                <v-icon>mdi-delete</v-icon>
                <span v-if="$vuetify.display.smAndUp" class="ml-1">Delete</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

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

// ---events
const onCreateOutput = (output) => {
    output.sensorId = props.sensor?.id
    emit('create-output', output)
}


</script>

<style lang="scss" scoped></style>
