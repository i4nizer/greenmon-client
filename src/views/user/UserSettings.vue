<template>
    <UserLayout>
        <v-container class="pa-5 py-7" fluid>
            <v-row justify="center" align-content="center">
                <v-img
                    src="https://res.cloudinary.com/dqgnetjlz/image/upload/f_auto,q_auto/v1749725689/bg-doa.png"
                    class="position-fixed top-0 h-100 w-75 w-sm-50 w-md-33 w-lg-25 opacity-50"
                ></v-img>
            </v-row>
            <v-row>
                <v-col>
                    <h3>User Settings</h3>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <UserAccountCard
                        :user="user"
                        :loading="state.updatingUser"
                        :disabled="state.updatingUser"
                        @change="onUpdateUser"
                    />
                </v-col>
                <v-col>
                    <UserSecurityCard
                        :user="user"
                        :loading="state.forgettingPassword"
                        :disabled="state.forgettingPassword"
                        @change-password="onChangePassword"
                    />
                </v-col>
            </v-row>
        </v-container>
    </UserLayout>
</template>

<script setup>
import { useUserStore } from "@/stores/user.store";
import { defineAsyncComponent, reactive } from "vue";
import { useTokenStore } from "@/stores/token.store";
import { useRouter } from "vue-router";

const UserLayout = defineAsyncComponent(() => import("@/views/user/UserLayout.vue"));
const UserAccountCard = defineAsyncComponent(() => import("@/components/user/UserAccountCard.vue"));
const UserSecurityCard = defineAsyncComponent(() => import("@/components/user/UserSecurityCard.vue"));

// ---stores
const { user, update, forgotPassword } = useUserStore();
const { clear: clearTokens } = useTokenStore();

// ---composables
const router = useRouter();

// ---state
const state = reactive({
    updatingUser: false,
    forgettingPassword: false,
});

// ---events
const onUpdateUser = async (user) => {
    state.updatingUser = true;

    await update(user.name).catch(console.error);

    state.updatingUser = false;
};

const onChangePassword = async () => {
    state.forgettingPassword = true;

    await forgotPassword(user.email)
        .then(() => clearTokens())
        .then(() => router.push("/auth/forgot-password"))
        .catch(console.error);

    state.forgettingPassword = false;
};
</script>

<style lang="scss" scoped></style>
