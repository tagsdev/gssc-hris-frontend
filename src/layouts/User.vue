<template>
    <q-layout view="hHh Lpr lFf">
        <!-- <q-header class="bg-primary">
            <q-toolbar>
                <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu" />

                <q-toolbar-title>
                    Amkor HRIS
                </q-toolbar-title>
            </q-toolbar>
        </q-header> -->

        <q-drawer v-model="leftDrawerOpen" show-if-above content-class="main-sidebar bg-white text-grey-8" elevated>
            <q-list padding>
                <q-item clickable v-ripple class="sidebar-brand" :to="{ name: 'Dashboard' }">
                    <q-item-section avatar class="q-pa-none">
                    </q-item-section>

                    <q-item-section>
                        <img :src="require('../assets/images/amkor_logo.png')" alt="Amkor Logo" class="sidebar-logo" />
                    </q-item-section>
                </q-item>

                <q-item clickable exact active-class="sidebar-link--active" v-ripple :to="{ name: 'Dashboard' }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="dashboard" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Dashboard</q-item-label>
                    </q-item-section>
                </q-item>

                <!-- <q-expansion-item expand-separator icon="card_giftcard" label="Compensation & Benefits">
                    <q-item clickable active-class="sidebar-link--active" v-ripple :inset-level="1">
                        <q-item-section>
                            <q-item-label>iLAP</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item clickable active-class="sidebar-link--active" v-ripple :inset-level="1">
                        <q-item-section>
                            <q-item-label>Tulong Aral</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item> -->

                <q-item clickable active-class="sidebar-link--active" v-ripple>
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="account_balance" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Compensations</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable active-class="sidebar-link--active" v-ripple>
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="account_balance" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Benefits</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable active-class="sidebar-link--active" v-ripple>
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="account_balance" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Payroll</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable active-class="sidebar-link--active" v-ripple>
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="hail" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Recruitment</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable active-class="sidebar-link--active" v-ripple :to="{ name: 'Attendance' }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="today" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Attendance</q-item-label>
                    </q-item-section>
                </q-item>

                <!-- Add more link items here -->

                <q-item clickable class="fixed-bottom text-black" active-class="sidebar-link--active" v-ripple @click="logout">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="person_pin" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ this.authName }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="logout" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <slot></slot>
        </q-page-container>
    </q-layout>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'

    export default {
        name: 'UserLayout',
        data () {
            return {
                leftDrawerOpen: false,
                authName: ""
            }
        },
        methods: {
            logout() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                axios.post(`${process.env.VUE_APP_API_URL}/logout`, {}, { headers })
                    .then(response => {
                        Cookies.remove('accessToken')

                        this.$router.push('/login')
                    })
                    .catch(error => {
                        this.errorMessage = error.message
                        console.error(error)
                    })
            }
        },
        mounted() {
            console.log(Cookies.get('authName'))
            this.authName = Cookies.get('authName')
        }
    }
</script>

<style lang="scss">
    .main-sidebar {
        overflow-y: hidden;

        background: #ebebeb !important;
        font-size: 14px !important;
        font-weight: bold;
        text-transform: uppercase;

        .q-item__section--avatar {
            margin-left: 10px;
            min-width: 50px;
            padding-left: 10px;
        }

        .sidebar-logo {
            padding-top: 20px;
            padding-bottom: 30px;
            width: 70%;
        }

        .q-item:not(.sidebar-brand) {
            margin: 10px 20px !important;
            padding: 10px 5px !important;

            border-radius: 10px;
            color: #AAAAAA;

            &:hover {
                color: #0d4c8f;
            }
        }

        .sidebar-link--active {
            background: #ffffff !important;
            box-shadow: 0px 5px 20px -10px rgba(0, 0, 0, 0.5);
            color: #0d4c8f !important;
        }
    }
</style>