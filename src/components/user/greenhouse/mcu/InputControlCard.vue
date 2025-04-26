<template>
    <v-card class="bg-grey-darken-3">
        <v-card-title class="d-flex align-center">
            <v-icon size="48" class="me-8">{{ input?.icon }}</v-icon>
            <span class="text-h6 font-weight-black text-truncate">{{ input?.name }}</span>
            <v-spacer></v-spacer>
            <span class="text-subtitle-2 text-grey">{{ loading ? '(Applying Input)':'' }}</span>
        </v-card-title>
        <v-card-text class="d-flex align-center justify-space-between px-5">
            
            <span v-if="input?.type == 'Boolean'" class="w-50">Status: {{ !!input.status ? 'ON' : 'OFF' }}</span>
            <span v-if="input?.type == 'Number'" class="w-50">Status: {{ input.status }}</span>

            <!-- Boolean Input = ON/OFF -->
            <v-switch
                v-if="input?.type == 'Boolean'"
                inset
                hide-details
                class="w-50"
                density="compact"
                v-model="input.flag"
                :model-value="!!input.flag"
                :label="input?.flag ? '&nbsp;&nbsp;TURN OFF' : '&nbsp;&nbsp;TURN ON'"
                :loading="loading"
                @update:model-value="onChange"
            ></v-switch>

            <!-- Numerical Input -->
            <v-number-input
                v-if="input?.type == 'Number'"
                hide-details
                class="w-50"
                label="Input"
                v-model="input.flag"
                :rules="[min(0)]"
                :loading="loading"
                @update:model-value="onChange"
            ></v-number-input>

        </v-card-text>
    </v-card>
</template>

<script setup>
import { useRules } from "@/composables/rules.composable";
import { computed } from "vue";

// ---events
const emit = defineEmits(["change"]);

// ---props
const props = defineProps({
    input: {
        type: Object,
        required: true,
    },
});

// ---composables
const { min } = useRules();

// ---getters
const loading = computed(() => props.input?.flag != props.input?.status);

// ---events
const onChange = (value) => {
    if (value <= -1) return;
    const data = { ...props.input, flag: value };
    emit("change", data);
};
</script>

<style scoped></style>
