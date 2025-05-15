<template>
    <v-layout full-height>
        <CameraNavDrawer></CameraNavDrawer>
        <v-main>
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';


const CameraNavDrawer = defineAsyncComponent(() => import("@/views/user/greenhouse/camera/CameraNavDrawer.vue"))



</script>

<style lang="scss" scoped>

</style>