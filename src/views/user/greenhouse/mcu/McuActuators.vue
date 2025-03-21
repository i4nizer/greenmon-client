<template>
    <McuLayout>
        <v-container>
            <v-row>
                <v-col>Microcontroller Actuators</v-col>
            </v-row>
        </v-container>
    </McuLayout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const McuLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/mcu/McuLayout.vue"))



</script>

<style lang="scss" scoped>

</style>