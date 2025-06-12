<template>
    <v-card class="border pt-3" :id="`sensor-${sensor?.id}`">
        <v-card-title class="d-flex ga-1 text-wrap">
            <span :class="sensor?.disabled ? 'text-red':'text-green'">{{ sensor?.name }}</span>
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
                        elevation="0"
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
                        <v-list-item 
                            link 
                            rounded 
                            :title="sensor?.disabled ? 'Enable':'Disable'"
                            @click="onToggleSensor"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </v-card-title>

        <v-card-subtitle class="text-wrap">Label: {{ sensor?.label }}</v-card-subtitle>
        
        <v-card-text>
            <span class="w-100 text-wrap">Read Interval: Every {{ sensor?.interval }} seconds</span>
            
            <!-- Output Lists -->
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
                                class="border"
                                elevation="0"
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
                <v-list-item v-if="!outputs.length" class="text-center">
                    <span class="text-grey">No Outputs Yet</span>
                </v-list-item>
            </v-list>
            
            <!-- Hook Lists -->
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <SensorHookDialog 
                        type="Create" 
                        class="w-100 w-md-50" 
                        :pins="pins"
                        :sensor="sensor"
                        :actions="actions"
                        @submit="onCreateHook"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Hook"
                                color="white"
                                class="border"
                                elevation="0"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </SensorHookDialog>
                </v-list-subheader>
                <v-list-item v-for="hook in hooksWithActions">
                    <SensorHookCard
                        :key="hook?.id"
                        :pins="pins"
                        :hook="hook"
                        :sensor="sensor"
                        :action="hook?.action"
                        :actions="actions"
                        @edit="o => emit('edit-hook', o)"
                        @delete="o => emit('delete-hook', o, sensor?.id)"
                    />
                </v-list-item>
                <v-list-item v-if="!hooksWithActions.length" class="text-center">
                    <span class="text-grey">No Hooks Yet</span>
                </v-list-item>
            </v-list>

        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed, defineAsyncComponent, reactive } from "vue";

const McuSensorDialog = defineAsyncComponent(() => import("./McuSensorDialog.vue"))
const SensorOutputCard = defineAsyncComponent(() => import("./SensorOutputCard.vue"));
const SensorOutputDialog = defineAsyncComponent(() => import("./SensorOutputDialog.vue"));
const SensorHookCard = defineAsyncComponent(() => import("./SensorHookCard.vue"));
const SensorHookDialog = defineAsyncComponent(() => import("./SensorHookDialog.vue"));


// ---events
const emit = defineEmits([
    'edit-sensor',
    'delete-sensor',
    'create-output',
    'edit-output',
    'delete-output',
    'create-hook',
    'edit-hook',
    'delete-hook',
])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    hooks: {
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
    actions: {
        type: Array,
        default: [],
    },
});

// ---getters
const hooksWithActions = computed(() => {
    const hwa = []
    props.hooks.forEach(h => hwa.push({ ...h, action: props.actions?.find(a => a.id == h.actionId) }))
    return hwa
})

// ---state
const state = reactive({
    sensorEditDialog: false,
})

// ---events
const onCreateHook = (hook) => {
    hook.sensorId = props.sensor?.id
    emit('create-hook', hook)
}

const onCreateOutput = (output) => {
    output.sensorId = props.sensor?.id
    emit('create-output', output)
}

const onToggleSensor = () => {
    const sensor = {
        ...props.sensor,
        disabled: !props.sensor.disabled,
    }

    emit('edit-sensor', sensor)
}


</script>

<style lang="scss" scoped></style>
