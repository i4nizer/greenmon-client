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
                <h3>{{ `${type} Greenhouse` }}</h3>
                <span class="text-grey">Please provide the greenhouse details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="greenhouse.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-textarea
                    label="Description"
                    v-model="greenhouse.description"
                    :rules="[max(500)]"
                ></v-textarea>
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
import { useRules } from '@/composables/rules.composable';
import { computed, reactive, toRaw } from 'vue';
import equal from 'fast-deep-equal';



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
const { required, min, max, } = useRules()

// ---data
const greenhouse = reactive({
    ...props.initial,
    name: props?.initial?.name,
    description: props?.initial?.description,
})

// ---getters
const changed = computed(() => !equal(greenhouse, props.initial))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    emit("submit", { ...greenhouse });

    if (props.type == 'Create') {
        greenhouse.name = null
        greenhouse.description = null
    }
}



</script>

<style lang="scss" scoped>

</style>