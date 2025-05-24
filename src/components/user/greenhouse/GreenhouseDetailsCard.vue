<template>
    <v-card>
        <v-card-title>
            <v-icon>mdi-greenhouse</v-icon>
            <span class="ml-2">Details</span>
        </v-card-title>
        <v-card-subtitle>Manage your greenhouse settings and preferences.</v-card-subtitle>
        <v-card-text>
            <v-form 
                class="border-none pa-1"
                v-model="state.valid" 
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    label="Name"
                    v-model="greenhouse.name"
                ></v-text-field>
                <v-textarea
                    label="Description"
                    v-model="greenhouse.description"
                ></v-textarea>
                <v-text-field
                    readonly
                    label="Api Key"
                    v-model="greenhouse.key"
                    append-inner-icon="mdi-content-copy"
                    @click:append-inner="onCopyKey"
                ></v-text-field>
                <v-btn
                    type="submit"
                    text="Save"
                    color="green"
                    elevation="0"
                    :disabled="!state.valid || !changed"
                ></v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import equal from 'fast-deep-equal';
import { computed, reactive } from 'vue';



// ---events
const emit = defineEmits(['change'])

// ---props
const props = defineProps({
    greenhouse: {
        type: Object,
        required: true,
    }
})

// ---data
const greenhouse = reactive({
    name: props.greenhouse?.name,
    description: props.greenhouse?.description,
    key: props.greenhouse?.key,
})

// ---getters
const propsGreenhouse = computed(() => ({
    name: props.greenhouse.name,
    description: props.greenhouse.description,
    key: props.greenhouse.key,
}))
const changed = computed(() => !equal(greenhouse, propsGreenhouse.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => emit('change', { ...props.greenhouse, ...greenhouse })

const onCopyKey = async () => await navigator.clipboard.writeText(greenhouse.key).catch(console.error)

</script>

<style lang="scss" scoped>

</style>