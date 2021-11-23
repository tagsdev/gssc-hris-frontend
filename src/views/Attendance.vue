<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <FullCalendar :options="calendarOptions" />
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
                    contentHeight: 600,
                    fixedWeekCount: false,
                    events: []
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