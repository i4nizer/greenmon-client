<template>
    <v-dialog>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default="{ isActive }">
            <v-form class="bg-green-darken-4 pa-7" v-model="state.valid" @submit.prevent="onSubmit">
                <h3>{{ `${type} Input` }}</h3>
                <span class="text-grey">Please provide the input details.</span>
                <v-select
                    label="Icon"
                    class="mt-6"
                    v-model="input.icon"
                    :rules="[required()]"
                    :items="actuatorInputIcons"
                    :item-title="(i) => i.substring(4)"
                    :item-value="(i) => i"
                    :prepend-inner-icon="input.icon"
                >
                    <template v-slot:item="{ props: listItemProps, item }">
                        <v-list-item :="listItemProps" :prepend-icon="item.raw"></v-list-item>
                    </template>
                </v-select>
                <v-text-field label="Name" v-model="input.name" :rules="[required(), min(3), max(100)]"></v-text-field>
                <v-select
                    label="Type"
                    v-model="input.type"
                    :items="['Boolean', 'Number']"
                    :item-title="(i) => (i == 'Boolean' ? 'ON/OFF' : 'Numerical Input')"
                    :item-value="(i) => i"
                    :rules="[required(), min(3), max(100)]"
                ></v-select>
                <v-number-input
                    label="Flag"
                    v-model="input.flag"
                    :rules="[required('Number')]"
                ></v-number-input>
                <v-number-input
                    label="Status"
                    v-model="input.status"
                    :rules="[required('Number')]"
                ></v-number-input>
                <v-select
                    label="Pin"
                    v-model="input.pinId"
                    :rules="[required('Number')]"
                    :items="pins"
                    :item-title="(i) => `${i?.type?.at(0)}${i?.number}`"
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
import { actuatorInputIcons } from "@/utils/icons.util";

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
const input = reactive({
    icon: props.initial?.icon || "mdi-fan",
    name: props.initial?.name,
    type: props.initial?.type || "Boolean",
    flag: props.initial?.flag ?? 0,
    status: props.initial?.status ?? 0,
    pinId: props.initial?.pinId,
});

// ---getters
const inputProps = computed(() => ({
    icon: props.initial?.icon,
    name: props.initial?.name,
    type: props.initial?.type,
    flag: props.initial?.flag ?? 0,
    status: props.initial?.status ?? 0,
    pinId: props.initial?.pinId,
}));
const changed = computed(() => !equal(input, inputProps.value));

// ---state
const state = reactive({ valid: false });

// ---events
const onSubmit = () => {
    const data = {
        ...props.initial,
        ...input,
    };

    emit("submit", data);

    if (props.type == "Create") {
        input.icon = "mdi-fan";
        input.name = null;
        input.type = "Boolean";
        input.flag = 0;
        input.status = 0;
        input.pinId = null;
    }
};
</script>

<style lang="scss" scoped></style>
