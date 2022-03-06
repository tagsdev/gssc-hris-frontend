<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <div class="row">
            <div v-if="can('export-employee-attendance')" class="col-xs-12 col-sm-8 col-md-6 col-xl-4 q-pl-md">
                <h5># Generate Employee Attendance</h5>

                <q-input filled v-model="date_placeholder">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date_range" range today-btn @input="testingLang()" />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <br /><br />

                <q-btn icon="download" @click="exportExcel()" :loading="loadingExcelExport" color="green-7" label="Export To Excel" />
            </div>

            <div v-if="can('export-employee-attendance')" class="col-12 q-pt-lg">
                <hr />
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
    import moment from 'moment'
    import exportFromJSON from "export-from-json";

    window.Laravel = {
        jsPermissions: JSON.parse(Cookies.get('jsPermissions'))
    }

    export default {
        components: {
            FullCalendar,
            // TimeClock: () => import('../components/Dashboard/TimeClock')
        },
        data() {
            return {
                date_range: {
                    from: '',
                    to: ''
                },
                date_placeholder: "",
                json_fields: {
                    'BadgeNumber': 'BadgeNumber',
                    'Tap': 'Tap',
                    'DatePunches': 'DatePunches',
                    'Extracted': 'Extracted',
                },
                loadingExcelExport: false,
                json_data: [],
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
            getAttendance() {
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
            },
            exportExcel() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    responseType: 'blob'
                }

                axios.post(`${ process.env.VUE_APP_API_URL }/user/get-emp-attendance`, { data: this.date_range }, { headers })
                    .then(response => {
                        const data = response.data
                        const fileName = `Amkor Employee Attendance (${ this.date_range.from } to ${ this.date_range.to })`
                        const exportType = exportFromJSON.types.csv

                        if (data) {
                            exportFromJSON({ data, fileName, exportType })
                        }
                    })
                    .catch(error => {
                        this.errorMessage = error.message
                        console.error(error)
                    });
            },
            testingLang() {
                let _format = "MMM DD, YYYY"
                this.date_placeholder = `${ moment(this.date_range.from).format(_format) } to ${ moment(this.date_range.to).format(_format) }`
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

            a.fc-daygrid-event {
                display: grid;
            }
        }
    }
</style>