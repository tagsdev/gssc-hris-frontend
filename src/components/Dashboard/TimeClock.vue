<template>
    <q-card dark class="bg-primary inoutclock q-pa-md">
        <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-card-section class="q-pa-none" v-show="!loading" key="time">
                <div class="row justify-between items-center">
                    <div class="col-3 text-center">
                        <p class="time relative-position">{{ hours }} <span class="time-separator absolute">:</span></p>
                        <p class="time-label">Hours</p>
                    </div>

                    <div class="col-3 text-center">
                        <p class="time relative-position">{{ minutes }} <span class="time-separator absolute">:</span></p>
                        <p class="time-label">Minutes</p>
                    </div>

                    <div class="col-3 text-center">
                        <p class="time relative-position">{{ seconds }} <span class="time-separator absolute">:</span></p>
                        <p class="time-label">Seconds</p>
                    </div>

                    <div class="col-3 text-center">
                        <p class="time relative-position">{{ period }}</p>
                        <p class="time-label">Period</p>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pa-none" v-show="!loading" key="inout">
                <div class="row justify-center">
                    <div class="col-6 text-center">
                        <q-btn flat icon="login" label="Time In" class="inout" :class="[ clockedIn ? 'inactive' : 'active' ]" :disable="clockedIn" @click="inout"></q-btn>
                    </div>

                    <div class="col-6 text-center">
                        <q-btn flat icon="logout" label="Time Out" class="inout" :class="[ clockedIn ? 'active' : 'inactive' ]" :disable="!clockedIn" @click="inout"></q-btn>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pa-none" v-show="!loading" key="lastactivity">
                <p v-show="latestPunchTime.length" class="text-center last-activity">Last Activity: {{ latestPunchTap }} {{ latestPunchTime }}</p>
            </q-card-section>
        </transition-group>

        <q-inner-loading :showing="loading">
            <template v-slot:default>
                <q-spinner size="xl" />
                <span class="text-subtitle1 q-mt-md">Loading Time Clock</span>
            </template>
        </q-inner-loading>
    </q-card>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'
    import { DateTime } from 'luxon'
    import moment from 'moment'
    import { Notify } from 'quasar'

    export default {
        name: 'TimeClock',
        data() {
            return {
                hours: '',
                minutes: '',
                seconds: '',
                period: '',
                clockedIn: false,
                loading: true,
                latestPunchTap: '',
                latestPunchTime: '',
            }
        },
        mounted() {
            this.getLatestPunch()
            this.getCurrentTime()
            this.displayClock()

            // this.latestPunchTap = Cookies.get('userLatestTap')
            // this.latestPunchTime = Cookies.get('userLatestTime')

            // if ((this.latestPunchTap == "Timed In") && (moment().diff(this.latestPunchTime, 'hours') >= 13)) {
            //     this.promptMissedLog()
            // }
        },
        methods: {
            getCurrentTime() {
                setInterval(() => {
                    let currentTime = DateTime.now()
                    this.hours = currentTime.toFormat('hh')
                    this.minutes = currentTime.toFormat('mm')
                    this.seconds = currentTime.toFormat('ss')
                    this.period = currentTime.toFormat('a')
                }, 1000)
            },
            displayClock() {
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            },
            getLatestPunch() {
                if ((Cookies.get('userLatestTap')) && (Cookies.get('userLatestTap') != "undefined")) {
                    this.latestPunchTap = Cookies.get('userLatestTap')
                }

                if ((Cookies.get('userLatestTime')) && (Cookies.get('userLatestTime') != "undefined")) {
                    this.latestPunchTime = Cookies.get('userLatestTime')
                }

                this.clockedIn = this.latestPunchTap == 'Timed In' ? true : false
            },
            inout() {
                var punch = !this.clockedIn ? 'I' : 'O'
                let _punch = punch == 'I' ? "Time In" : "Time Out"

                this.$q.dialog({
                    title: 'Confirm',
                    message: `You are about to ${ _punch }.`,
                    cancel: true,
                    persistent: true
                }).onOk(() => {
                    this.clockedIn = !this.clockedIn

                    let headers = {
                        'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                    }

                    axios.post(`${ process.env.VUE_APP_API_URL }/user/attend`, { tap: punch, DatePunches: moment(new Date()).format('YYYY-MM-DD h:mm:ss A') }, { headers })
                        .then(response => {
                            this.latestPunchTap = punch == 'I' ? 'Timed In' : 'Timed Out'
                            this.latestPunchTime = moment(new Date()).format('MMMM DD, YYYY h:mm:ss A')
                            this.$emit('refetchEvents')

                            Cookies.set('userLatestTap', this.latestPunchTap)
                            Cookies.set('userLatestTime', this.latestPunchTime)

                            Notify.create({
                                type: 'positive',
                                message: `Successfully ${ this.latestPunchTap }!`,
                                closeBtn: false,
                            })
                        })
                        .catch(error => {
                            this.errorMessage = error.message

                            Notify.create({
                                type: 'negative',
                                message: error.message,
                                closeBtn: false,
                            })

                            console.error(error)
                        })
                })
            },
            promptMissedLog() {
                this.$q.dialog({
                    title: 'Missed Clock Out?',
                    message: `The system detected something.<br /><em>Last Activity: ${ this.latestPunchTap } ${ this.latestPunchTime }</em>`,
                    html: true,
                    options: {
                        type: 'radio',
                        model: 'opt1',
                        items: [
                            {
                                label: 'No, It looks good.',
                                value: 'opt1',
                                color: 'secondary'
                            },
                            {
                                label: 'Yes, I forgot to Clock Out.',
                                value: 'opt2',
                                color: 'secondary'
                            },
                        ]
                    },
                    cancel: false,
                    ok: "Submit",
                    persistent: true
                }).onOk(data => {
                    if (data == "opt2") {
                        this.$q.dialog({
                            title: 'Clock-Out Correction',
                            message: `Date and Time of missed Clock Out:<br /><em>Last Activity: ${ this.latestPunchTap } ${ this.latestPunchTime }</em>`,
                            html: true,
                            prompt: {
                                model: '',
                                isValid: val => true,
                                type: 'datetime-local'
                            },
                            ok: "Submit",
                            cancel: false,
                            persistent: true
                        }).onOk(data => {
                            const correction = Notify.create({
                                type: 'ongoing',
                                message: `Sending Clock Out correction...`,
                                closeBtn: false,
                            })

                            let _datePunches = moment(data).format('YYYY-MM-DD h:mm:ss A')
                            let headers = {
                                'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                            }

                            axios.post(`${ process.env.VUE_APP_API_URL }/user/attend`, { tap: 'O', DatePunches: _datePunches }, { headers })
                                .then(response => {
                                    correction()
                                    this.$emit('refetchEvents')

                                    Cookies.set('userLatestTap', 'Timed Out')
                                    Cookies.set('userLatestTime', moment(data).format('MMMM DD, YYYY h:mm:ss A'))

                                    this.clockedIn = false
                                    this.latestPunchTap = "Timed Out"
                                    this.latestPunchTime = moment(data).format('MMMM DD, YYYY h:mm:ss A')

                                    Notify.create({
                                        type: 'positive',
                                        message: `Successfully Timed Out!`,
                                        closeBtn: false,
                                    })
                                })
                                .catch(error => {
                                    correction()
                                    this.errorMessage = error.message

                                    Notify.create({
                                        type: 'negative',
                                        message: error.message,
                                        closeBtn: false,
                                    })

                                    console.error(error)
                                })
                        })
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
    .inoutclock {
        border-radius: 20px !important;
        filter: drop-shadow(0px 10px 20px #0075B8);
        height: 245px;

        .q-inner-loading {
            border-radius: 20px !important;
            background-color: #0075B8;
        }
    }

    .time {
        color: #FFFFFF;
        font-size: 36px;
        text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        margin: 14px 0;
    }


    .time-separator {
        color: rgba(255, 255, 255, 0.3);
        font-size: 18px;
        font-weight: 500;
        right: 0;
        top: 18px;
    }

    .time-label {
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        margin: 14px;
    }

    .inout {
        font-size: 18px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .inout.active {
        color: #FFFFFF;
    }

    .inout.inactive {
        color: rgba(255, 255, 255, 0.3);
    }

    .last-activity {
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        font-weight: 400;
        font-style: italic;
        margin: 14px;
    }

    @media screen and (max-width: 1199px) {
        .inoutclock {
            height: 225px;
        }

        .time {
            font-size: 30px;
        }

        .time-label {
            font-size: 12px;
        }

        .inout, .last-activity {
            font-size: 13px;
        }
    }

    @media screen and (max-width: 480px) {
        .time-label {
            margin: 0;
            margin-bottom: 14px;
        }
    }
</style>