<template>
    <q-layout>
        <q-page-container :style="{ 'background-color': '#e0e0e0' }">
            <q-page padding class="full-height column wrap justify-center items-center q-pa-xl auth">
                <div class="col-6 text-center">
                    <img :src="require('../assets/images/main.png')" alt="Amkor Logo" class="logo" />
                </div>

                <q-dialog v-model="reload" persistent>
                    <q-card class="auth--update" style="width: 350px; border-radius: 1.5rem;">

                        <q-card-section class="row items-center no-wrap">
                            <q-space />
                            <q-space />

                            <div class="q-py-md">
                                <div class="diaLogo">
                                    <img :src="require('../assets/images/main.png')" alt="Amkor Logo" />
                                </div>

                                <div class="text-weight-bold q-mb-md">Page will reload to apply updates.</div>

                                <div class="text-primary text-right">
                                    <span class="q-mr-xs">
                                        <q-spinner-orbit color="primary" size="1rem" />
                                        <q-tooltip :offset="[0, 8]">QSpinnerOval</q-tooltip>
                                    </span>
                                    Applying Updates
                                </div>
                            </div>

                            <q-space />
                        </q-card-section>
                    </q-card>
                </q-dialog>

                <slot></slot>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
    let pjinfo = require("../../package.json")

    import Cookies from 'js-cookie'

    export default {
        data() {
            return {
                reload: false,
            }
        },
        mounted() {
            let _reload = false

            if (Cookies.get('_version')) {
                if (Cookies.get('_version') != pjinfo.version) {
                    _reload = true
                }
            }

            Cookies.set('_version', pjinfo.version, { expires: 30 * 12 })

            if (_reload) {
                this.reload = _reload

                setTimeout(function () {
                    location.reload(true)
                }, 3000)
            }
        },
    }
</script>

<style lang="scss">
    .auth {
        font-family: 'Rajdhani', sans-serif;

        .logo {
            width: 250px;
            margin-top: -5rem;
            margin-bottom: 0px;
        }
    }

    .q-dialog__inner > .auth--update {
        overflow: visible !important;
    }

    .diaLogo {
        position: absolute;
        top: 50%;
        margin-top: -45px;
        margin-left: -50px;
        left: 0;

        background: var(--q-color-secondary);
        border-radius: 1.5rem;
        box-shadow: 7.5px 0px 20px -5px rgba(14, 76, 144, 1);

        img {
            filter: brightness(0) invert(100%) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
            --webkit-filter: brightness(0) invert(100%) drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));
            margin-top: 5px;
            height: 80px;
        }
    }

    @media screen and (max-width: 481px) {
        .auth {
            padding: 16px;
        }
    }
</style>