<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form class="bg-green-darken-4 pa-7" v-model="state.valid" @submit.prevent="onSubmit">
                <h3>{{ `${type} Output` }}</h3>
                <span class="text-grey">Please provide the output details.</span>
                <v-select
                    label="Icon"
                    class="mt-6"
                    v-model="output.icon"
                    :rules="[required()]"
                    :items="sensorOutputIcons"
                    :item-title="(i) => i.substring(4)"
                    :item-value="(i) => i"
                    :prepend-inner-icon="output.icon"
                >
                    <template v-slot:item="{ props: listItemProps, item }">
                        <v-list-item :="listItemProps" :prepend-icon="item.raw"></v-list-item>
                    </template>
                </v-select>
                <v-text-field label="Name" v-model="output.name" :rules="[required(), min(3), max(100)]"></v-text-field>
                <v-text-field label="Unit" v-model="output.unit" :rules="[required(), max(100)]"></v-text-field>
                <v-select
                    label="Pin"
                    v-model="output.pinId"
                    :rules="[required('Number')]"
                    :items="pins"
                    :item-title="(i) => `${i?.number} - ${i?.type}`"
                    :item-value="(i) => i?.id"
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
import { useRules } from "@/composables/rules.composable";
import { computed, reactive } from "vue";
import equal from "fast-deep-equal";
import { sensorOutputIcons } from "@/utils/icons.util";

// ---events
const emit = defineEmits(["submit"]);

// ---props
const props = defineProps({
    type: {
        type: String,
        default: "Create",
    },
    pins: {
        type: Array,
        default: [],
    },
    initial: {
        type: Object,
        default: {},
    },
});

// ---composables
const { required, min, max } = useRules();

// ---data
const output = reactive({
    icon: props.initial?.icon || "mdi-thermometer",
    name: props.initial?.name,
    unit: props.initial?.unit,
    pinId: props.initial?.pinId,
});

// ---getters
const outputProps = computed(() => ({
    icon: props.initial?.icon,
    name: props.initial?.name,
    unit: props.initial?.unit,
    pinId: props.initial?.pinId,
}));
const changed = computed(() => !equal(output, outputProps.value));

// ---state
const state = reactive({ valid: false });

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...output,
    };

    emit("submit", data);

    if (props.type == "Create") {
        output.icon = "mdi-thermometer";
        output.name = null;
        output.unit = null;
        output.pinId = null;
    }
};
</script>

<style lang="scss" scoped></style>
