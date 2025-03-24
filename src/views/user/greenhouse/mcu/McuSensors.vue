<template>
    <McuLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Microcontroller Sensors</h3>
                </v-col>
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