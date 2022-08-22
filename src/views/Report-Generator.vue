<template>
    <q-page padding :class="$route.name" class="q-pa-lg bg-grey-4">
        <div class="row justify-center">
            <div class="col-12 bg-white q-px-xl q-py-xl report-container">
                <h4 class="text-uppercase" style="margin-top: 0; margin-bottom: 0;">Generate Report</h4>
                <span class="text-grey-6">
                    Generate available HR-exclusive Reports
                </span>

                <div class="row q-mt-lg">
                    <div class="col-4">
                        <q-select class="q-mr-sm" outlined v-model="report_type" color="primary" :options="report_types" label="Report Type" />
                    </div>

                    <div class="col-4">
                        <q-input class="q-mx-sm" filled v-model="date_placeholder" label="Date Range">
                            <template v-slot:append>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="date_range" range today-btn mask="YYYY-MM-DD" @input="populateDateRange()" />
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>

                    <div class="col-4">
                        <q-btn icon="las la-search" @click="previewReport()" :disabled="report_type == ''" :loading="loadingExcelExport" color="primary" class="q-pa-sm q-mx-sm" label="Preview Report" />
                        <q-btn icon="las la-file-excel" @click="exportExcel()" :disabled="report_type == ''" :loading="loadingExcelExport" color="green-10" class="q-pa-sm q-mx-sm" label="Export To Excel" />
                    </div>
                </div>

                <div class="row q-mt-lg">
                    <q-table flat :data="preview.data"
                    :loading="loadingExcelExport"
                    :columns="preview.columns"
                    :rows-per-page-options="rowsOptions"
                    :pagination.sync="pagination"
                    class="col my-sticky-column-table"
                    no-data-label="No data found"
                    row-key="_row"
                    @row-click="selectedRow"
                    :filter="filter"
                    :filter-method="customFilter"
                    selection="multiple"
                    :selected.sync="selected">
                        <template v-if="this.preview.data.length > 0" v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="search" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:loading>
                            <q-inner-loading showing color="primary" />
                        </template>

                        <template v-slot:header="props">
                            <q-tr :props="props">
                                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                                    {{ col.label }}
                                </q-th>
                            </q-tr>
                        </template>

                        <template v-slot:body="props">
                            <q-tr class="cursor-pointer" :props="props" @click="selectedRow(props.row, props)">
                                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                                    {{ (props.row[col.name] !== null && !isNaN(props.row[col.name]) && props.row[col.name].toString().indexOf('.') != -1) ? parseFloat(props.row[col.name]).toFixed(2) : props.row[col.name] }}
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>
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
                search: "",
                selected: [],
                rowsOptions: [5, 10, 15, 20, 50, 0],
                pagination: {
                    rowsPerPage: 10,
                    page: 1
                },
                date_placeholder: "",
                loadingExcelExport: false,
                preview: {
                    columns: [],
                    data: [],
                },
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
                    }, {
                        label: 'Past Cut-Off Leaves',
                        value: 'past_leaves',
                    },
                ],
                filter_column: {
                    attendance_raw: 'Employee ID Number',
                    attendance_processed: '"Employee ID"',
                    amsasb: 'ADEMID',
                    payroll_complaints: '"Employee ID"',
                    past_leaves: 'LBREMID',
                },
            }
        },
        computed: {
            filter() {
                return {
                    search: this.search
                }
            }
        },
        methods: {
            customFilter(rows, terms){
                this.selected = []
                let lowerSearch = terms.search ? terms.search.toLowerCase() : ""

                const filteredRows = rows.filter((row, i) => {
                    let ans = false
                    let s1 = true

                    if(lowerSearch != ""){
                        s1 = false

                        let s1_values = Object.values(row)
                        let s1_lower = s1_values.map((x) => {
                            if (x !== null && x.length > 0) {
                                return x.toString().toLowerCase()
                            }
                        })

                        for (let val = 0; val < s1_lower.length; val++){
                            if (typeof s1_lower[val] !== 'undefined'
                                && row[this.filter_column[this.report_type.value]] !== null
                                && row[this.filter_column[this.report_type.value]].toString().length > 0
                                && row[this.filter_column[this.report_type.value]].toString() != ''
                                && row[this.filter_column[this.report_type.value]].toString().includes(lowerSearch)
                            ){
                                s1 = true
                                break
                            }
                        }
                    }

                    ans = s1 ? true : false

                    return ans
                })

                return filteredRows
            },
            selectedRow (val) {
                let i = 0
                const matched = this.selected.find((item, index) => {
                    i = index
                    return item._row === val._row
                })

                if (matched) {
                    this.selected.splice(i, 1)
                } else {
                    this.selected.push(val)
                }
            },
            previewReport() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.selected = []
                this.loadingExcelExport = true
                this.preview.columns = []
                this.preview.data = []

                axios.post(`${ process.env.VUE_APP_API_URL }/hr/generate-report`, { data: this.date_range, report_type: this.report_type.value }, { headers })
                    .then(response => {
                        const data = response.data

                        if (data.length > 0) {
                            this.preview.columns.push({
                                name: "_row",
                                required: true,
                                label: "#",
                                align: 'left',
                                field: row => row.label,
                                format: val => `${val}`,
                                sortable: true
                            })

                            Object.keys(data[0]).forEach((item, index) => {
                                this.preview.columns.push({
                                    name: item,
                                    label: item.replace(/"/g, "").toUpperCase(),
                                    field: row => row.name,
                                    format: val => `${val}`,
                                    align: 'left',
                                    sortable: true
                                })
                            })

                            data.forEach((item, index) => {
                                item._row = index + 1
                            });

                            this.preview.data = data
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
                            message: error.message,
                            closeBtn: false,
                        })

                        console.error(error)
                        this.loadingExcelExport = false
                    });
            },
            exportExcel() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    responseType: 'blob'
                }

                this.selected = []
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

                if (this.date_range.from) {
                    this.date_placeholder = `${ moment(this.date_range.from).format(_format) } to ${ moment(this.date_range.to).format(_format) }`
                } else {
                    this.date_placeholder = `${ moment(this.date_range).format(_format) }`
                }

                this.$refs.qDateProxy.hide()
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

    .q-table th {
        font-weight: bold;
    }

    .q-table tr.selected td {
        background: rgb(0 117 184 / 100%) !important;
        color: #FFFFFF;
        font-weight: bold;
    }
</style>