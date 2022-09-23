<template>
    <q-page padding :class="$route.name" class="bg-grey-4">
        <div class="row justify-center">
            <div class="col-xs-12 bg-white q-px-xl q-py-xl attendance-container">
                <div class="q-mb-lg">
                    <h4 class="text-uppercase" style="margin-top: 0; margin-bottom: 0;">My Attendance</h4>
                    <span class="text-grey-6">
                        Processed Time Ins and Outs
                    </span>
                </div>

                <FullCalendar :options="calendarOptions">
                    <template v-slot:eventContent='arg'>
                        <code class="float-left">{{ arg.event.title.split('|')[0] }}</code>
                        <code class="float-right">{{ arg.event.title.split('|')[1] }}</code>
                    </template>
                </FullCalendar>
            </div>
        </div>
    </q-page>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'
    import '@fullcalendar/core/vdom'
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import interactionPlugin from '@fullcalendar/interaction'
    import moment from 'moment'
    import exportFromJSON from "export-from-json";
    import { Notify } from 'quasar'

    window.Laravel = {
        jsPermissions: JSON.parse(Cookies.get('jsPermissions'))
    }

    export default {
        components: {
            FullCalendar,
        },
        data() {
            return {
                calendarOptions: {
                    plugins: [ dayGridPlugin, interactionPlugin ],
                    initialView: 'dayGridMonth',
                    // dateClick: this.handleDateClick,
                    contentHeight: 'auto',
                    fixedWeekCount: false,
                    events: [],
                    eventOverlap: false,
                    eventBackgroundColor: 'transparent',
                    eventBorderColor: 'transparent',
                    eventTextColor: 'black'
                }
            }
        },
        methods: {
            getAttendance() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                axios.get(`${ process.env.VUE_APP_API_URL }/user/list-attendance/processed`, { headers })
                    .then(response => {
                        this.calendarOptions.events = response.data
                    })
                    .catch(error => {
                        this.errorMessage = error.message
                        console.error(error)
                    })
            },
        },
        mounted() {
            this.getAttendance()
        }
    }
</script>

<style lang="scss">
    .Processed {
        .attendance-container {
            border-radius: 2rem;
            box-shadow: 0px 20px 20px -5px rgba(0, 0, 0, 0.2);
        }

        .fc-scrollgrid {
            // border: none;

            .fc-scrollgrid-section-body td {
                // border: none !important;
            }

            .fc-col-header-cell {
                padding: 5px 0px;

                // border: none;
                background: #aeaeae;
                // color: #ffffff;
                text-transform: uppercase;
            }

            .fc-daygrid-day {
                padding: 5px;

                // border: none;
                border: 1px solid #cfcfcf;
                font-weight: bold;
            }

            .fc-day-today {
                background: rgba(45, 125, 200, 0.25) !important;
            }

            .fc-day-other {
                background: #cfcfcf;
            }

            .fc-scroller-liquid-absolute {
                overflow: hidden !important;
            }

            a.fc-daygrid-event {
                display: grid;
            }

            .fc-daygrid-event-harness {
                margin-top: 0 !important;
            }

            .fc-daygrid-event-harness-abs {
                right: 0 !important;
            }
        }
    }
</style>