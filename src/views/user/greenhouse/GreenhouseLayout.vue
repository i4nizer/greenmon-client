<template>
    <v-layout full-height>
        <GreenhouseNavDrawer></GreenhouseNavDrawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const GreenhouseNavDrawer = defineAsyncComponent(() => import("@/views/user/greenhouse/GreenhouseNavDrawer.vue"))



</script>

<style lang="scss" scoped>

</style>