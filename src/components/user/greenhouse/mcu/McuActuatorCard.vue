<template>
    <v-card class="border pt-3" :id="`actuator-${actuator?.id}`">
        <v-card-title class="d-flex ga-1">
            <span :class="actuator?.disabled ? 'text-red':'text-green'">{{ actuator?.name }}</span>
            <v-spacer></v-spacer>

            <McuActuatorDialog 
                type="Update" 
                class="w-100 w-md-50" 
                v-model="state.actuatorEditDialog"
                :initial="actuator"
                @submit="s => emit('edit-actuator', s)"
            ></McuActuatorDialog>

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
                            @click="state.actuatorEditDialog = true"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            title="Delete"
                            @click="emit('delete-actuator', actuator?.id)"
                        ></v-list-item>
                        <v-list-item 
                            link 
                            rounded 
                            :title="actuator?.disabled ? 'Enable':'Disable'"
                            @click="onToggleSensor"
                        ></v-list-item>
                    </v-list>
                </template>
            </v-menu>
        </v-card-title>

        <v-card-subtitle>Label: {{ actuator?.label }}</v-card-subtitle>
        
        <v-card-text>
            <v-list>
                <v-list-subheader class="d-flex justify-end">
                    <ActuatorInputDialog 
                        type="Create" 
                        class="w-100 w-md-50" 
                        :pins="pins"
                        @submit="onCreateOutput"
                    >
                        <template #activator="{ props: activatorProps }">
                            <v-btn 
                                text="Add Input"
                                color="white"
                                class="border"
                                :="activatorProps" 
                            ></v-btn>
                        </template>
                    </ActuatorInputDialog>
                </v-list-subheader>
                <v-list-item v-for="input in inputs">
                    <ActuatorInputCard
                        :key="input?.id"
                        :pins="pins"
                        :input="input"
                        @edit="i => emit('edit-input', i)"
                        @delete="i => emit('delete-input', i, actuator?.id)"
                    />
                </v-list-item>
                <v-list-item v-if="!inputs.length" class="text-center">
                    <span class="text-grey">No Outputs Yet</span>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent, reactive } from "vue";

const McuActuatorDialog = defineAsyncComponent(() => import("./McuActuatorDialog.vue"))
const ActuatorInputCard = defineAsyncComponent(() => import("./ActuatorInputCard.vue"));
const ActuatorInputDialog = defineAsyncComponent(() => import("./ActuatorInputDialog.vue"));


// ---events
const emit = defineEmits([
    'edit-actuator',
    'delete-actuator',
    'create-input',
    'edit-input',
    'delete-input',
])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        default: [],
    },
    actuator: {
        type: Object,
        required: true,
    },
    inputs: {
        type: Array,
        required: true,
    },
});

// ---state
const state = reactive({
    actuatorEditDialog: false,
})

// ---events
const onCreateOutput = (input) => {
    input.actuatorId = props.actuator?.id
    emit('create-input', input)
}

const onToggleSensor = () => {
    const actuator = {
        ...props.actuator,
        disabled: !props.actuator.disabled,
    }

    emit('edit-actuator', actuator)
}


</script>

<style lang="scss" scoped></style>
