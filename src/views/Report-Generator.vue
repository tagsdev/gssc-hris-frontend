<template>
    <q-page padding :class="$route.name" class="q-pa-lg bg-grey-4">
        <div class="row justify-center">
            <div class="col-xs-12 col-sm-8 col-md-5 bg-white q-px-xl q-py-lg q-mt-xl report-container">
                <h4 class="text-uppercase" style="margin-bottom: 0;">Generate Report</h4>
                <small class="text-grey-6">
                    Generate available HR-exclusive Reports
                </small>
                <hr class="q-my-md" style="border-top: 1px solid #fff;" />

                <div class="row">
                    <q-select outlined v-model="report_type" color="primary" :options="report_types" class="col q-mt-md" label="Report Type" />
                </div>

                <q-input class="q-mt-lg" filled v-model="date_placeholder" label="Date Range">
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="date_range" range today-btn mask="YYYY-MM-DD" @input="populateDateRange()" />
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <q-btn icon="download" @click="exportExcel()" :disabled="report_type == ''" :loading="loadingExcelExport" color="primary" class="q-pa-xs q-my-lg" label="Export To Excel" />
            </div>
        </div>
    </q-page>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'
    import moment from 'moment'
    import exportFromJSON from "export-from-json";
    import { Notify } from 'quasar'

    window.Laravel = {
        jsPermissions: JSON.parse(Cookies.get('jsPermissions'))
    }

    export default {
        components: {
        },
        data() {
            return {
                date_range: {
                    from: '',
                    to: ''
                },
                date_placeholder: "",
                loadingExcelExport: false,
                report_type: "",
                report_types: [
                    {
                        label: 'Employee Attendance (Raw)',
                        value: 'attendance_raw',
                    }, {
                        label: 'Employee Attendance (Processed)',
                        value: 'attendance_processed',
                    }, {
                        label: 'AMSASB',
                        value: 'amsasb',
                    }, {
                        label: 'Employee Payroll Complaints',
                        value: 'payroll_complaints',
                    },
                ],
            }
        },
        methods: {
            exportExcel() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    responseType: 'blob'
                }

                this.loadingExcelExport = true

                axios.post(`${ process.env.VUE_APP_API_URL }/hr/generate-report`, { data: this.date_range, report_type: this.report_type.value }, { headers })
                    .then(response => {
                        const data = response.data
                        const exportType = exportFromJSON.types.csv

                        let fileName = `${ this.report_type.label } (${ this.date_range.from } to ${ this.date_range.to })`

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

        }
    }
</script>

<style lang="scss">
    .report-container {
        border-radius: 2rem;
        box-shadow: 0px 20px 20px -5px rgba(0, 0, 0, 0.2);
    }
</style>