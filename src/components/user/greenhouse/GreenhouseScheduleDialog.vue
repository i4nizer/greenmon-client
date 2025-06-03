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
                <h3>{{ `${type} Schedule` }}</h3>
                <span class="text-grey">Please provide the schedule details.</span>
                <v-text-field
                    label="Name"
                    class="mt-6"
                    v-model="schedule.name"
                    :rules="[required(), min(3), max(100)]"
                ></v-text-field>
                <v-select
                    chips
                    multiple
                    clearable
                    label="Days"
                    v-model="schedule.days"
                    :items="Array.from({ length: 30 }, (_, i) => i + 1)"
                    :rules="[v => v.length >= 1 || 'This field must at least have one item.']"
                ></v-select>

                <!-- Creating a list of Times -->
                <v-list bg-color="transparent" density="compact">
                    <v-list-subheader>Set the times of this schedule.</v-list-subheader>
                    <v-list-item class="d-flex justify-end w-100">
                        <v-text-field
                            hide-details
                            type="time"
                            label="Time"
                            class="mt-2"
                            v-model="time"
                            append-icon="mdi-plus-circle"
                            :rules="[required()]"
                            @click:append="!!time && !schedule.times.includes(time) && schedule.times.push(time)"
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item v-for="(time, index) in schedule.times">
                        <v-text-field
                            hide-details
                            type="time"
                            label="Time"
                            class="mt-2"
                            append-icon="mdi-minus-circle"
                            :key="index"
                            :model-value="time"
                            :rules="[required()]"
                            @click:append="schedule.times.splice(index, 1)"
                            @update:model-value="t => schedule.times[index] = t"
                        ></v-text-field>
                    </v-list-item>
                </v-list>

                <v-select
                    label="Flag"
                    v-model="schedule.disabled"
                    :items="['Enabled', 'Disabled']"
                    :item-title="v => v"
                    :item-value="v => v == 'Disabled'"
                ></v-select>
                <v-btn
                    type="submit"
                    class="mt-3"
                    :text="type"
                    :disabled="!state.valid || !schedule?.times?.length || (props.type != 'Create' && !changed)"
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
const time = ref(null)
const schedule = reactive({
    name: props.initial?.name,
    days: props.initial?.days || [],
    times: [...(props.initial?.times || [])],
    disabled: props.initial?.disabled == undefined ? true : props.initial?.disabled,
})

// ---getters
const scheduleProps = computed(() => ({
    name: props.initial?.name,
    days: props.initial?.days,
    times: props.initial?.times,
    disabled: props.initial?.disabled,
}))
const changed = computed(() => !equal(schedule, scheduleProps.value))

// ---state
const state = reactive({ valid: false })

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...schedule,
    }

    emit("submit", data);

    if (props.type == 'Create') {
        schedule.name = null
        schedule.days = []
        schedule.times = []
        schedule.disabled = true
    }
}



</script>

<style lang="scss" scoped>

</style>