<template>
    <v-data-table
        class="border"
        :items="pins"
        :headers="headers"
        :loading="loading"
    >
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>
                    <v-icon>mdi-sine-wave</v-icon>
                    <span class="ml-2">Pins</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <McuPinDialog
                    class="w-100 w-md-50"
                    :type="'Create'"
                    :existing="pins"
                    @submit="p => emit('create', p)"
                >
                    <template #activator="{ props: activatorProps }">
                        <v-btn
                            text="Add Pin"
                            color="white"
                            class="mr-2"
                            variant="outlined"
                            :="activatorProps"
                            :disabled="loading"
                        ></v-btn>
                    </template>
                </McuPinDialog>
            </v-toolbar>
        </template>

        <template #item.actions="{ item }">
            <McuPinDialog
                class="w-100 w-md-50"
                :type="'Update'"
                :initial="item"
                :existing="pins"
                @submit="p => emit('edit', p)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn 
                        icon="mdi-pencil"
                        size="small" 
                        color="none" 
                        :="activatorProps" 
                        :disabled="loading"
                    ></v-btn>
                </template>
            </McuPinDialog>
            <v-btn 
                icon="mdi-delete"
                size="small" 
                color="none"
                :disabled="loading"
                @click="emit('delete', item.id)"
            ></v-btn>
        </template>
    </v-data-table>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const McuPinDialog = defineAsyncComponent(() => import("@/components/user/greenhouse/mcu/McuPinDialog.vue"))



// ---events
const emit = defineEmits(['create', 'edit', 'delete'])

// ---props
const props = defineProps({
    pins: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    }
})

// ---data
const headers = [
    { title: 'Pin', value: 'number' },
    { title: 'Type', value: 'type' },
    { title: 'Mode', key: 'mode', sortable: false },
    { title: 'Actions', value: 'actions', sortable: false },
]

</script>

<style lang="scss" scoped>

</style>