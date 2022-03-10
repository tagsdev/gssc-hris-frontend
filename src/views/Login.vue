<template>
    <div class="col-6 loginCol">
        <q-card class="q-pa-lg loginCard">
            <!-- <q-card-section class="q-pa-none">
                <h3>Log in</h3>
            </q-card-section> -->

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
                    >
                        <template v-slot:prepend>
                            <q-icon :color="activeInput.username ? 'secondary' : 'label'" name="account_circle" />
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
                    >
                        <template v-slot:prepend>
                            <q-icon :color="activeInput.password ? 'secondary' : 'label'" name="vpn_key" />
                        </template>
                        <template v-slot:append>
                            <q-icon
                                :name="!showPassword ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="showPassword = !showPassword"
                        />
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
                        Cookies.set('authName', response.data.user.DisplayName)
                        Cookies.set('jsPermissions', response.data.jsPermissions)

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
        width: 540px;
        box-shadow: none;
        filter: drop-shadow(10px 10px 15px rgba(0, 0, 0, 0.1));
        border-radius: 20px;
        padding: 50px 80px;

        h3 {
            font-weight: 600;
        }

        .q-field {
            border: 2px solid rgba(0, 0, 0, 0.1);
            transition: all 0.4s ease-in-out;

            &__control {
                padding: 0 15px !important;
            }

            &__label {
                font-size: 16px;
            }

            &--focused {
                border: none;
                box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
            }

            input {
                color: #000000;
                font-weight: 600;
            }
        }
    }

    .loginBtn {
        border-radius: 5px;
    }

    .loginLinks {
        font-weight: 600;
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