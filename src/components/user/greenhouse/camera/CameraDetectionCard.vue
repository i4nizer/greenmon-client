<template>
    <v-card class="mx-auto" max-width="600">
        <template #prepend>
            <v-icon size="48" class="me-8" :color="leafColor">mdi-leaf</v-icon>
        </template>

        <template #title>
            <div>
                <span class="text-caption text-grey text-uppercase">Detections</span>
            </div>
            <span class="text-h4 font-weight-black">{{ props.count }}&nbsp;</span>
            <strong>{{ props.class }}</strong>
        </template>

    </v-card>
</template>

<script setup>
import { computed } from 'vue';
import colors from 'vuetify/util/colors'


//

// ---props
const props = defineProps({
    limit: {
        type: Number,
        default: 30,
    },
    class: {
        type: String,
        default: 'No Lettuce',
    },
    count: {
        type: Number,
        default: 0,
    },
});

// ---getters
const leafColor = computed(() =>
    props.class.startsWith('Healthy') ? colors.green.lighten2
    : props.class.startsWith('Nitrogen') ? colors.yellow.lighten2
    : props.class.startsWith('Phosphorus') ? colors.purple.lighten2
    : props.class.startsWith('Potassium') ? colors.brown.lighten2
    : colors.grey.lighten2
)

//

</script>

<style lang="scss" scoped></style>
