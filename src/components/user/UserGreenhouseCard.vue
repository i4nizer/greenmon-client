<template>
    <v-card class="border pt-3">
        <v-card-title class="d-flex">
            <v-icon>mdi-greenhouse</v-icon>
            <span class="ml-2">{{ greenhouse?.name }}</span>
        </v-card-title>

        <v-card-text class="text-grey">{{ greenhouse?.description }}</v-card-text>

        <v-card-actions>
            <v-btn @click="emit('view', greenhouse?.id)">
                <v-icon class="mr-1">mdi-cog</v-icon>
                <span v-if="$vuetify.display.smAndUp">View</span>
            </v-btn>
            <GreenhouseDialog
                class="w-100 w-md-50"
                :type="'Update'"
                :initial="greenhouse"
                @submit="(gh) => emit('edit', gh)"
            >
                <template #activator="{ props: activatorProps }">
                    <v-btn color="blue" :="activatorProps">
                        <v-icon class="mr-1">mdi-pencil</v-icon>
                        <span v-if="$vuetify.display.smAndUp">Edit</span>
                    </v-btn>
                </template>
            </GreenhouseDialog>
            <v-btn color="red" @click="emit('delete', greenhouse?.id)">
                <v-icon class="mr-1">mdi-delete</v-icon>
                <span v-if="$vuetify.display.smAndUp">Delete</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const GreenhouseDialog = defineAsyncComponent(() => import("@/components/user/UserGreenhouseDialog.vue"));

// ---events
const emit = defineEmits(["view", "edit", "delete"]);

// ---props
const props = defineProps({
    greenhouse: {
        type: Object,
        required: true,
    },
});
</script>

<style lang="scss" scoped></style>
