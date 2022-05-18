<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <div class="page-header bg-primary">
            <h4>Attendance <q-badge color="primary" align="bottom">PROCESSED</q-badge></h4>
        </div>

        <div v-if="can('export-employee-attendance')" class="row">
            <h5># Generate Processed Employee Attendance</h5>
        </div>

        <div v-if="can('export-employee-attendance')" class="row">
            <div class="col-xs-12 col-sm-8 col-md-6 col-xl-4 q-pl-md">
                <q-input filled v-model="date_placeholder">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date_range" range today-btn mask="YYYY-MM-DD" @input="populateDateRange()" />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <br /><br />

                <q-btn icon="download" @click="exportExcel()" :loading="loadingExcelExport" color="green-7" label="Export To Excel" />
            </div>

            <div class="col-12 q-pt-lg">
                <hr />
            </div>
        </div>

        <div class="row">
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
                date_range: {
                    from: '',
                    to: ''
                },
                date_placeholder: "",
                loadingExcelExport: false,
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
            exportExcel() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    responseType: 'blob'
                }

                this.loadingExcelExport = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/get-emp-attendance`, { data: this.date_range, dataType: 'processed' }, { headers })
                    .then(response => {
                        const data = response.data
                        const fileName = `Amkor Employee Attendance (PROCESSED) (${ this.date_range.from } to ${ this.date_range.to })`
                        const exportType = exportFromJSON.types.csv

                        if (data) {
                            exportFromJSON({ data, fileName, exportType })
                        } else {
                            Notify.create({
                                type: 'warning',
                                message: `Requested data is empty.`,
                                closeBtn: false,
                            })
                        }

                        this.loadingExcelExport = false
                    })
                    .catch(error => {
                        this.errorMessage = error.message

                        Notify.create({
                            type: 'negative',
                            message: error.response.data.message,
                            closeBtn: false,
                        })

                        console.error(error)
                        this.loadingExcelExport = false
                    });
            },
            populateDateRange() {
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
    .Processed {
        .page-header {
            margin-top: -25px;
            padding: 5px 50px;
            width: 100%;

            border-radius: 0px 0px 20px 20px;
            color: #FFFFFF;
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