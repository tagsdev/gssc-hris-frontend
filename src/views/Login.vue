<template>
    <div class="col-6 loginCol">
        <q-card class="q-pa-lg loginCard">
            <q-card-section class="q-pa-none">
                <q-form @submit.prevent="login">
                    <q-input
                        @focus="activeInput.username = true"
                        @blur="activeInput.username = false"
                        v-model="loginForm.username"
                        borderless
                        color="secondary"
                        label="Username or Email Address"
                        label-color="label"
                        class="q-mb-lg"
                        :class="{
                            '--filled': loginForm.username != ''
                        }"
                    >
                        <template v-slot:prepend>
                            <q-icon :color="activeInput.username || loginForm.username != '' ? 'secondary' : 'label'" style="font-size: 1.75rem;" name="las la-user-shield" />
                        </template>
                    </q-input>

                    <q-input
                        @focus="activeInput.password = true"
                        @blur="activeInput.password = false"
                        v-model="loginForm.password"
                        borderless
                        color="secondary"
                        label="Password"
                        label-color="label"
                        :type="!showPassword ? 'password' : 'text'"
                        class="q-mb-lg"
                        :class="{
                            '--filled': loginForm.password != ''
                        }"
                    >
                        <template v-slot:prepend>
                            <q-icon :color="activeInput.password || loginForm.password != '' ? 'secondary' : 'label'" style="font-size: 1.5rem;" name="las la-key" />
                        </template>
                        <template v-slot:append>
                            <q-icon :name="!showPassword ? 'lar la-eye-slash' : 'lar la-eye'" class="cursor-pointer" @click="showPassword = !showPassword" />
                        </template>
                    </q-input>

                    <q-btn type="submit" color="secondary" class="full-width q-py-xs loginBtn" :loading="isLoading" :disabled="isLoading" label="Log in" no-caps />
                </q-form>
            </q-card-section>
        </q-card>

        <div class="row justify-center items-center q-mt-md">
            <q-btn flat color="grey-7" label="Forgot your password?" no-caps class="loginLinks" />
            <q-btn flat color="secondary" label="Reset Password" no-caps class="loginLinks" />
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'
    import { Notify } from 'quasar'

    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                isLoading: false,
                showPassword: false,
                activeInput: {
                    username: false,
                    password: false
                }
            }
        },
        methods: {
            login() {
                const body = {
                    email: this.loginForm.username,
                    password: this.loginForm.password
                }

                this.isLoading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/login`, body)
                    .then(response => {
                        Cookies.set('accessToken', response.data.access_token)
                        Cookies.set('authName', response.data.user.display_name)
                        Cookies.set('jsPermissions', response.data.jsPermissions)
                        Cookies.set('leaves', JSON.stringify(response.data.leaves))
                        Cookies.set('leaveEligibility', JSON.stringify(response.data.leave_eligibility))
                        Cookies.set('sfid', JSON.stringify(response.data.user.sfid))

                        if (response.data.latestPunch) {
                            Cookies.set('userLatestTap', response.data.latestPunch.tap == 'I' ? "Timed In" : "Timed Out")
                            Cookies.set('userLatestTime', response.data.latestPunch.time)
                        }

                        this.$router.push('/')
                    })
                    .catch(error => {
                        this.isLoading = false
                        this.errorMessage = error.message

                        Notify.create({
                            type: 'negative',
                            message: error.response.data.message,
                            closeBtn: false,
                        })

                        console.error(error)
                    })
            }
        }
    }
</script>

<style lang="scss">
    .loginCol * {
        font-size: 1.15rem;
    }

    .loginCard {
        padding: 50px 80px;
        width: 540px;

        border-radius: 20px;
        box-shadow: none;
        filter: drop-shadow(10px 10px 15px rgba(0, 0, 0, 0.1));

        h3 {
            font-weight: 600;
        }

        .q-field {
            border: 1px solid rgba(0, 0, 0, 0.075);
            border-radius: 0.5rem;

            transition: 0.5s ease;

            &__control {
                padding: 0 15px !important;
            }

            &__label {
                font-size: 16px;
                font-weight: 500;
            }

            &--focused {
                border: 1px solid transparent;
                box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.15);

                transition: 0.5s ease;
            }

            input {
                color: #000000;
                font-weight: 600;
            }
        }
    }

    .loginBtn {
        border-radius: 0.5rem;
    }

    .loginLinks {
        font-weight: 600;
    }

    .q-field {
        &--float {
            transform: 0.5s ease;

            .q-field__label {
                font-weight: bold !important;
                text-transform: uppercase !important;

                transform: 0.5s ease;
            }
        }

        &.--filled .q-field__label {
            color: var(--q-color-secondary);
            font-weight: bold !important;
            text-transform: uppercase !important;

            transform: 0.5s ease;
        }
    }

    @media screen and (max-width: 767px) {
        .loginCol, .loginCard {
            width: 100% !important;
        }
    }

    @media screen and (max-width: 600px) {
        .loginCard {
            h3 {
                font-size: 2rem;
            }
        }
    }
</style>