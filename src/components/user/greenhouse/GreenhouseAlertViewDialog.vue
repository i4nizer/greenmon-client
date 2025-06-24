<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-card class="w-100  pa-5 overflow-auto">
                <template #title>Title: {{ alert?.title }}</template>
                <template #append>
                    <v-btn
                        icon="mdi-close"
                        class="bg-transparent"
                        elevation="0"
                        @click="isActive.value = false"
                    ></v-btn>
                </template>
                <template #text>
                    <div>Message: {{ alert?.message }}</div>
                    <div class="mt-2">Created: {{ date.format(alert?.createdAt, 'fullDateWithWeekday') }}</div>
                </template>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
import { useDate } from 'vuetify';

//

// ---props
const props = defineProps({
    alert: {
        type: Object,
        required: true,
    },
})

// ---composables
const date = useDate()

//

</script>

<style scoped>

</style>