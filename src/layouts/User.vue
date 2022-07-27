<template>
    <q-layout view="hHh Lpr lFf">
        <q-drawer v-model="leftDrawerOpen" show-if-above content-class="main-sidebar bg-grey-4 text-grey-8">
            <q-list padding>
                <q-item clickable v-ripple class="sidebar-brand" :to="{ name: 'Dashboard' }">
                    <q-item-section avatar class="q-pa-none">
                    </q-item-section>

                    <q-item-section>
                        <img :src="require('../assets/images/main.png')" alt="Amkor Logo" class="sidebar-logo" />
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

                <q-item clickable :active="clink === 'attendance'" active-class="semi-active" :class="{ 'sidebar-link--active': $route.path.includes('attendance') }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="today" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Attendance</q-item-label>
                        <q-item-label caption>{{ $route.path.includes('attendance') ? $route.meta.caption : '' }}</q-item-label>
                    </q-item-section>

                    <q-menu @show="clink = 'attendance'" @hide="clink = ''" anchor="top end" self="top start">
                        <q-list style="min-width: 250px;" class="_submenu">
                            <q-item clickable :to="{ name: 'Raw' }">
                                <q-item-section>Raw</q-item-section>
                            </q-item>

                            <q-item clickable :to="{ name: 'Processed' }">
                                <q-item-section>Processed</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-item>

                <q-item clickable :active="clink === 'file_request'" active-class="semi-active" :class="{ 'sidebar-link--active': $route.path.includes('requests') }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="las la-file-invoice" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>File Requests</q-item-label>
                        <q-item-label caption>{{ $route.path.includes('requests') ? $route.meta.caption : '' }}</q-item-label>
                    </q-item-section>

                    <q-menu @show="clink = 'file_request'" @hide="clink = ''" anchor="top end" self="top start">
                        <q-list style="min-width: 250px;" class="_submenu">
                            <q-item clickable :to="{ name: 'Leaves' }">
                                <q-item-section>Leaves</q-item-section>
                            </q-item>

                            <q-item clickable :to="{ name: 'OB' }">
                                <q-item-section>Official Business</q-item-section>
                            </q-item>

                            <q-item clickable disabled>
                                <q-item-section>Overtime</q-item-section>

                                <q-item-section side center>
                                    <q-icon name="las la-wrench" color="grey-6" />
                                </q-item-section>
                            </q-item>

                            <q-item clickable disabled>
                                <q-item-section>Change Shift</q-item-section>

                                <q-item-section side center>
                                    <q-icon name="las la-wrench" color="grey-6" />
                                </q-item-section>
                            </q-item>

                            <q-item clickable disabled>
                                <q-item-section>Change Rest Day</q-item-section>

                                <q-item-section side center>
                                    <q-icon name="las la-wrench" color="grey-6" />
                                </q-item-section>
                            </q-item>

                            <q-item clickable disabled>
                                <q-item-section>Payroll Complaints</q-item-section>

                                <q-item-section side center>
                                    <q-icon name="las la-wrench" color="grey-6" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-item>

                <!-- approve-filed-requests -->
                <q-item v-if="can('export-employee-attendance')" clickable exact active-class="sidebar-link--active" v-ripple :to="{ name: 'Request-Approval' }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="las la-tasks" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Request Approval</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item v-if="can('export-employee-attendance')" clickable exact active-class="sidebar-link--active" v-ripple :to="{ name: 'Report-Generator' }">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="lar la-file-archive" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Report Generator</q-item-label>
                    </q-item-section>
                </q-item>

                <!-- Add more link items here -->

                <q-item clickable class="fixed-bottom text-black" active-class="sidebar-link--active" v-ripple @click="logout">
                    <q-item-section avatar class="q-pa-none">
                        <q-icon name="person_pin" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label class="_displayname">{{ this.authName }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="logout" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <div class="row hidden">
                <div class="main-nav col q-py-md q-px-lg">
                    <div class="row reverse">
                        <div class="col">
                            <q-btn flat round color="standard" text-color="grey-6" icon="las la-bell">
                                <q-tooltip transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-white text-black">Notifications</q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>

            <slot></slot>
        </q-page-container>
    </q-layout>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'

    window.Laravel = {
        jsPermissions: JSON.parse(Cookies.get('jsPermissions'))
    }

    export default {
        name: 'UserLayout',
        data () {
            return {
                leftDrawerOpen: false,
                authName: "",
                clink: '',
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
                        Cookies.remove('authName')
                        Cookies.remove('userLatestTap')
                        Cookies.remove('userLatestTime')
                        Cookies.remove('jsPermissions')

                        this.$router.push('/login')
                    })
                    .catch(error => {
                        this.errorMessage = error.message
                        console.error(error)
                    })
            }
        },
        mounted() {
            this.authName = Cookies.get('authName')
        }
    }
</script>

<style lang="scss">
    .main-nav {
        border-bottom: 1px solid #CCCCCC;
    }

    .semi-active {
        background: #c0c9d5 !important;
        color: #0d4c8f !important;
    }

    .text-caption {
        color: #000000;
        font-weight: bolder !important;
    }

    .main-sidebar {
        overflow-y: hidden;

        border-right: 1px solid #CCCCCC;
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

        ._displayname {
            width: 300px;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    ._submenu {
        .q-item:not([disabled]) {
            transition: 0.2s ease;

            &.q-router-link--active {
                padding-left: 2rem;

                box-shadow: inset 5px 0px 0px 0px var(--q-color-primary);
                color: #444444 !important;
                font-weight: bold !important;
            }

            &:hover {
                padding-left: 1.5rem;

                font-weight: bold;

                transition: 0.2s ease;
            }
        }
    }
</style>