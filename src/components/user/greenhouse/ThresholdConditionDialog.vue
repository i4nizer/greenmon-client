<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form 
                class="bg-grey-darken-4 pa-7"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <h3>{{ `${type} Condition` }}</h3>
                <span class="text-grey">Please provide the condition details.</span>
                <v-select
                    label="Output"
                    class="mt-6"
                    v-model="condition.outputId"
                    :rules="[required('Number')]"
                    :items="outputs.filter(o => o.type == 'Number')"
                    :item-title="i => i.name"
                    :item-value="i => i?.id"
                    :prepend-inner-icon="output?.icon"
                >
                    <template #item="{ props: listItemProps, item }">
                        <v-list-item :="listItemProps" :prepend-icon="item.raw.icon"></v-list-item>
                    </template>
                </v-select>
                <v-select
                    label="Type"
                    v-model="condition.type"
                    :items="['Equal', 'Above', 'Below']"
                    :rules="[required()]"
                ></v-select>
                <v-text-field
                    label="Value"
                    type="number"
                    v-model="condition.value"
                    :rules="[required('Number')]"
                    :prefix="`${output?.unit || ''}`"
                ></v-text-field>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || (props.type == 'Update' && !changed)"
                    @click="isActive.value = !isActive.value"
                ></v-btn>
            </v-form>
        </template>
    </v-dialog>
</template>

<script setup>
import { useRules } from '@/composables/rules.composable';
import { computed, reactive } from 'vue';
import equal from 'fast-deep-equal';



// ---events
const emit = defineEmits(['submit'])

// ---props
const props = defineProps({
    type: {
        type: String,
        default: "Create",
    },
    outputs: {
        type: Array,
        default: [],
    },
    initial: {
        type: Object,
        default: {},
    },
})

// ---composables
const { required, min, max, } = useRules()

// ---data
const condition = reactive({
    type: props.initial?.type || 'Above',
    value: props.initial?.value || 30,
    outputId: props.initial?.outputId,
})

// ---getters
const output = computed(() => props.outputs.find(o => o.id == condition.outputId))
const conditionProps = computed(() => ({
    type: props.initial?.type,
    value: props.initial?.value,
    outputId: props.initial?.outputId,
}))
const changed = computed(() => !equal(condition, conditionProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...condition,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        condition.name = null
        condition.value = 0
        condition.duration = 30
        condition.precedence = 0
        condition.outputId = null
    }
}



</script>

<style lang="scss" scoped>

</style>