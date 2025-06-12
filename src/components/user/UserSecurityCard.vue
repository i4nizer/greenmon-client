<template>
    <v-card>
        <v-card-title>
            <v-icon>mdi-shield-lock</v-icon>
            <span class="ml-2">Security</span>
        </v-card-title>
        <v-card-subtitle class="text-wrap">Manage your password and security settings.</v-card-subtitle>
        <v-card-text>
            <v-btn
                text="Change Password"
                color="red"
                elevation="0"
                v-tooltip="'You will be signed-out.'"
                @click="emit('change-password')"
            ></v-btn>
        </v-card-text>
    </v-card>
</template>

<script setup>


// ---events
const emit = defineEmits(['change-password'])


</script>

<style lang="scss" scoped>

</style>