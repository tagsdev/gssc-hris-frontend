<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <div class="row reverse">
            <div class="col-xs-12 col-sm-8 col-md-6 col-xl-4 q-pl-md inoutclockCol">
                <time-clock></time-clock>
            </div>

            <div class="col-xs-12 q-pt-lg">
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

    export default {
        components: {
            FullCalendar,
            TimeClock: () => import('../components/Dashboard/TimeClock')
        },
        data() {
            return {
                calendarOptions: {
                    plugins: [ dayGridPlugin, interactionPlugin ],
                    initialView: 'dayGridMonth',
                    dateClick: this.handleDateClick,
                    contentHeight: 500,
                    fixedWeekCount: false,
                    events: [],
                    eventBackgroundColor: 'transparent',
                    eventBorderColor: 'transparent',
                    eventTextColor: 'black'
                }
            }
        },
        methods: {
            handleDateClick: function (arg) {
                // alert('date click! ' + arg.dateStr)
            },
            getAttendance: function () {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                axios.get(`${ process.env.VUE_APP_API_URL }/user/list-attendance`, { headers })
                    .then(response => {
                        this.calendarOptions.events = response.data
                    })
                    .catch(error => {
                        this.errorMessage = error.message
                        console.error(error)
                    })
            }
        },
        mounted() {
            this.getAttendance();
        }
    }
</script>

<style lang="scss">
    .Attendance {
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
        }
    }
</style>