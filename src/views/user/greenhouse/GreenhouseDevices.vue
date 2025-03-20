<template>
    <GreenhouseLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row>
                <v-col>
                    <h3>Greenhouse Devices</h3>
                </v-col>
            </v-row>
            <v-row>
                
            </v-row>
        </v-container>
    </GreenhouseLayout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const GreenhouseLayout = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseLayout.vue"))



</script>

<style lang="scss" scoped>

</style>