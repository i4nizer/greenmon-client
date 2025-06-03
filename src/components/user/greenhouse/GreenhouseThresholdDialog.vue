<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-green-darken-4 pa-7 overflow-auto"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <h3>{{ `${type} Threshold` }}</h3>
                <span class="text-grey">Please provide the threshold details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="threshold.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-select
                    label="Operator"
                    v-model="threshold.operator"
                    :items="['All', 'Any']"
                    :rules="[required()]"
                ></v-select>
                <v-select
                    label="Flag"
                    v-model="threshold.disabled"
                    :items="['Enabled', 'Disabled']"
                    :item-title="v => v"
                    :item-value="v => v == 'Disabled'"
                ></v-select>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || (props.type != 'Create' && !changed)"
                    @click="isActive.value = !isActive.value"
                ></v-btn>
            </v-form>
        </template>
    </v-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import equal from 'fast-deep-equal';
import { useRules } from '@/composables/rules.composable';



// ---events
const emit = defineEmits(['submit'])

// ---props
const props = defineProps({
    type: {
        type: String,
        default: "Create",
    },
    initial: {
        type: Object,
        default: {},
    },
})

// ---composables
const { required, min, max } = useRules()

// ---data
const threshold = reactive({
    name: props.initial?.name,
    operator: props.initial?.operator || [],
    disabled: props.initial?.disabled == undefined ? true : props.initial?.disabled,
})

// ---getters
const thresholdProps = computed(() => ({
    name: props.initial?.name,
    operator: props.initial?.operator,
    disabled: props.initial?.disabled,
}))
const changed = computed(() => !equal(threshold, thresholdProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...threshold,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        threshold.name = null
        threshold.operator = []
        threshold.disabled = true
    }
}



</script>

<style lang="scss" scoped>

</style>