<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <FullCalendar :options="calendarOptions">
            <template v-slot:eventContent='arg'>
                <strong class="float-left">{{ arg.event.title.split('|')[0] }}</strong>
                <strong class="float-right">{{ arg.event.title.split('|')[1] }}</strong>
            </template>
        </FullCalendar>
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
            FullCalendar
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
            border: none;

            .fc-scrollgrid-section-body td {
                border: none !important;
            }

            .fc-col-header-cell {
                border: none;
                text-transform: uppercase;
            }

            .fc-daygrid-day {
                padding: 5px;

                border: none;
                font-weight: bold;
            }

            .fc-day-today {
                background: rgba(45, 125, 200, 0.25) !important;
            }

            .fc-day-other {
                background: #dedede;
            }
        }
    }
</style>