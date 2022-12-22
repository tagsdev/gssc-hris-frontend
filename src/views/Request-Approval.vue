<template>
    <q-page padding :class="$route.name" class="bg-grey-4">
        <div class="row justify-center">
            <div class="col-xs-12 bg-white q-px-xl q-py-xl approval-container">
                <div class="page-header">
                    <h4 class="text-uppercase" style="margin-top: 0; margin-bottom: 0;">Request Approval</h4>
                    <span class="text-grey-6">
                        Employee Filed Requests for Approval
                    </span>
                </div>

                <div class="q-pa-xs" style="margin-top: -60px;">
                    <q-table flat
                        :data="rows"
                        :loading="loading"
                        :columns="columns"
                        row-key="employee_name"
                        :rows-per-page-options="rowsOptions"
                        :pagination.sync="pagination"
                        class="col my-sticky-column-table"
                        no-data-label="All Filed Requests are Approved!"
                        :visible-columns="visibleColumns"
                        :filter="search"
                        @request="onRequest"
                    >
                        <template v-slot:top-right>
                            <div class="q-pa-md">
                                <div class="q-gutter-xs">
                                    <q-chip
                                        :selected.sync="filterSources.leave"
                                        :class="{
                                            'text-weight-bold': filterSources.leave,
                                        }"
                                        v-if="Object.keys(sources).includes('leave')"
                                        size="14px"
                                        class="text-uppercase"
                                        @click="filterSource('leave')"
                                    >
                                        <q-avatar size="30px" color="secondary" text-color="white">{{ sources.leave }}</q-avatar>
                                        Leaves <q-badge v-if="filterSources.leave" rounded color="teal-6" class="q-ml-md" :label="sources.leave" />
                                    </q-chip>

                                    <q-chip
                                        :selected.sync="filterSources.ob"
                                        :class="{
                                            'text-weight-bold': filterSources.ob,
                                        }"
                                        v-if="Object.keys(sources).includes('ob')"
                                        size="14px"
                                        class="text-uppercase"
                                        @click="filterSource('ob')"
                                    >
                                        <q-avatar size="30px" color="secondary" text-color="white">{{ sources.ob }}</q-avatar>
                                        Official Business <q-badge v-if="filterSources.ob" rounded color="teal-6" class="q-ml-md" :label="sources.ob" />
                                    </q-chip>

                                    <q-chip
                                        :selected.sync="filterSources.change_rd"
                                        :class="{
                                            'text-weight-bold': filterSources.change_rd,
                                        }"
                                        v-if="Object.keys(sources).includes('change_rd')"
                                        size="14px"
                                        class="text-uppercase"
                                        @click="filterSource('change_rd')"
                                    >
                                        <q-avatar size="30px" color="secondary" text-color="white">{{ sources.change_rd }}</q-avatar>
                                        Change Rest Day <q-badge v-if="filterSources.change_rd" rounded color="teal-6" class="q-ml-md" :label="sources.change_rd" />
                                    </q-chip>

                                    <q-chip
                                        :selected.sync="filterSources.change_shift"
                                        :class="{
                                            'text-weight-bold': filterSources.change_shift,
                                        }"
                                        v-if="Object.keys(sources).includes('change_shift')"
                                        size="14px"
                                        class="text-uppercase"
                                        @click="filterSource('change_shift')"
                                    >
                                        <q-avatar size="30px" color="secondary" text-color="white">{{ sources.change_shift }}</q-avatar>
                                        Change Shift <q-badge v-if="filterSources.change_shift" rounded color="teal-6" class="q-ml-md" :label="sources.change_shift" />
                                    </q-chip>

                                    <q-chip
                                        :selected.sync="filterSources.payroll_complaint"
                                        :class="{
                                            'text-weight-bold': filterSources.payroll_complaint,
                                        }"
                                        v-if="Object.keys(sources).includes('payroll_complaint')"
                                        size="14px"
                                        class="text-uppercase"
                                        @click="filterSource('payroll_complaint')"
                                    >
                                        <q-avatar size="30px" color="secondary" text-color="white">{{ sources.payroll_complaint }}</q-avatar>
                                        Payroll Complaints <q-badge v-if="filterSources.payroll_complaint" rounded color="teal-6" class="q-ml-md" :label="sources.payroll_complaint" />
                                    </q-chip>
                                </div>
                            </div>

                            <div class="q-pa-md">
                                <q-input borderless dense debounce="500" v-model="search" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </div>
                        </template>

                        <template v-slot:top-center>
                            <q-input borderless dense debounce="500" v-model="search" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:loading>
                            <q-inner-loading showing color="primary" />
                        </template>

                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="employee_name" :props="props" auto-width class="text-center cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <div align="right">
                                        <!-- <table class="--date-coverage">
                                            <tr class="--header">
                                                <td :colspan="convertDateFormat(props.row.date_from, 'MMM') != convertDateFormat(props.row.date_to, 'MMM') ? 1 : 3">{{ convertDateFormat(props.row.date_from, 'MMM') }}</td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 1 && (convertDateFormat(props.row.date_from, 'MMM') != convertDateFormat(props.row.date_to, 'MMM'))">&nbsp;</td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 0 && (convertDateFormat(props.row.date_from, 'MMM') != convertDateFormat(props.row.date_to, 'MMM'))">
                                                    {{ convertDateFormat(props.row.date_to, 'MMM') }}
                                                </td>
                                            </tr>
                                            <tr class="--body">
                                                <td>{{ convertDateFormat(props.row.date_from, 'DD') }}</td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 1 && (convertDateFormat(props.row.date_from, 'DD') != convertDateFormat(props.row.date_to, 'DD'))">
                                                    <q-icon style="font-size: 18px;" name="las la-ellipsis-h" />
                                                </td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 0">{{ convertDateFormat(props.row.date_to, 'DD') }}</td>
                                            </tr>
                                            <tr class="--footer">
                                                <td :colspan="convertDateFormat(props.row.date_from, 'YYYY') == convertDateFormat(props.row.date_to, 'YYYY') ? 3 : 1">
                                                    {{ convertDateFormat(props.row.date_from, 'YYYY') }}
                                                </td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 1 && (convertDateFormat(props.row.date_from, 'YYYY') != convertDateFormat(props.row.date_to, 'YYYY'))">&nbsp;</td>
                                                <td v-if="getDateDiff(props.row.date_from, props.row.date_to) > 0 && (convertDateFormat(props.row.date_from, 'YYYY') != convertDateFormat(props.row.date_to, 'YYYY'))">
                                                    {{ convertDateFormat(props.row.date_to, 'YYYY') }}
                                                </td>
                                            </tr>
                                        </table> -->
                                        <span v-if="props.row.date_from == props.row.date_to" class="">{{ convertDateFormat(props.row.date_from, 'MMM DD, YYYY') }}</span>
                                        <span v-else>
                                            <span class="">{{ convertDateFormat(props.row.date_from, 'MMM DD, YYYY') }}</span>
                                            &nbsp; to &nbsp;
                                            <span class="">{{ convertDateFormat(props.row.date_to, 'MMM DD, YYYY') }}</span>
                                        </span>
                                    </div>
                                </q-td>

                                <q-td key="description" :props="props" class="text-center cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <span class="text-weight-bold text-uppercase">{{ props.row.employee_name }}</span>
                                    &nbsp; - &nbsp;
                                    <span class="text-weight-bold text-uppercase">{{ props.row.request_type }}</span>
                                    <br />
                                    <span class="q-pr-sm q-mr-xs q-py-xs rounded-borders text-weight-bold text-uppercase text-primary" v-if="props.row.attachment">
                                        <q-icon style="font-size: 24px;" name="las la-paperclip" />
                                    </span>
                                    <i v-if="props.row.request_description" style="">{{ props.row.request_description }}</i>
                                    <i v-else>No description.</i>
                                </q-td>

                                <q-td key="date_filed" :props="props" class="text-center cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <span class="text-weight-bold text-uppercase">{{ convertDateFormat(props.row.date_filed, 'MMM DD, YYYY HH:mm A') }}</span>
                                </q-td>

                                <q-td key="request_type" :props="props" class="text-center">
                                    <span class="text-weight-bold text-uppercase">{{ props.row.request_type }}</span>
                                </q-td>

                                <q-td key="actions" :props="props">
                                    <q-btn flat size="sm" icon="las la-thumbs-up" color="blue-7" class="text-uppercase q-py-xs" @click="approveRequest(props.row)" />
                                    <q-btn flat size="sm" icon="las la-thumbs-down" color="red-7" class="text-uppercase q-py-xs" @click="rejectRequest(props.row)" />
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>

                <q-dialog persistent v-model="dialog.request" class="q-px-xl">
                    <q-card style="width: 60vw; max-width: 800px;">
                        <q-card-section class="q-mx-md">
                            <div class="text-h6 q-pt-md q-px-xs text-uppercase">&nbsp; Request Approval Form</div>
                        </q-card-section>

                        <q-separator class="q-mx-xl" />

                        <q-card-section>
                            <div class="row q-px-md q-mb-sm">
                                <div class="col q-mx-md">
                                    <span class="block q-mb-lg text-weight-bold text-uppercase text-blue-grey-9">
                                        You are about to <span :class="{ 'text-blue-6': this.action.action == 'approve', 'text-red-6': this.action.action == 'reject' }">{{ this.action.action }}</span> the Request Information below:
                                    </span>

                                    <q-card flat bordered class="bg-grey-3 my-card">
                                        <q-card-section class="">
                                            <span class="block q-mb-sm text-weight-bold text-uppercase">{{ this.request_info.requestor }}</span>

                                            <span class="block q-mb-sm text-weight-bold text-uppercase">
                                                {{ this.request_info.type }}<span v-if="this.request_info.desc"> - {{ this.request_info.desc }}</span>
                                            </span>

                                            <span class="block"><i><i class="las la-quote-left"></i> &nbsp; {{ this.request_info.reason }} &nbsp; <i class="las la-quote-right"></i></i></span>

                                            <q-btn flat class="q-mt-sm" color="primary" icon="las la-download" label="Download Attachment" v-if="this.request_info.attachment" />
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>

                            <div v-if="can('clinic-concerns')" class="row justify-content-end q-px-md">
                                <div class="col-6 q-px-md">
                                    <span class="block q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Date</span>
                                    <q-input outlined v-model="date_placeholder" color="secondary" @click="$refs.qDateProxy.show()">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="date" today-btn mask="YYYY-MM-DD" color="secondary" @input="populateDateRange()" />
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>
                            </div>

                            <div class="row q-mt-md q-px-md">
                                <div class="col q-px-md">
                                    <span class="block q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Approver Remarks <span class="text-grey-5 text-uppercase text-weight-light">(Optional)</span></span>
                                    <q-input v-model="reason" outlined autogrow color="secondary" counter maxlength="300" />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions class="q-pb-lg q-px-md" align="right">
                            <div class="row q-px-md q-pb-md">
                                <div class="col q-px-md">
                                    <q-btn label="Submit" color="secondary" class="text-uppercase q-px-xl q-py-xs q-mr-lg" :loading="diaLoading" @click="submit()" />
                                    <q-btn flat label="Cancel" class="text-uppercase q-px-sm q-py-xs" @click="clearDialog()" v-close-popup />
                                </div>
                            </div>
                        </q-card-actions>
                    </q-card>
                </q-dialog>

                <q-dialog persistent v-model="dialog.details" class="q-px-xl">
                    <q-card style="width: 80vw; max-width: 1600px;">
                        <q-card-section class="q-mx-md">
                            <div class="text-h6 q-pt-md q-px-xs text-uppercase">&nbsp; Filed Request Information</div>
                        </q-card-section>

                        <q-separator class="q-mx-xl" />

                        <q-card-section>
                            <div class="row q-px-md q-mb-sm">
                                <div class="col q-mx-md">
                                    <q-card flat bordered class="bg-grey-3 my-card">
                                        <q-card-section class="">
                                            <span class="block q-mb-sm text-weight-bold text-uppercase">{{ this.request_info.requestor }}</span>

                                            <span class="block q-mb-sm text-weight-bold text-uppercase">
                                                {{ this.request_info.type }}<span v-if="this.request_info.desc"> - {{ this.request_info.desc }}</span>
                                            </span>

                                            <span class="block"><i><i class="las la-quote-left"></i> &nbsp; {{ this.request_info.reason }} &nbsp; <i class="las la-quote-right"></i></i></span>

                                            <q-btn flat class="q-mt-sm" color="primary" icon="las la-download" label="Download Attachment" v-if="this.request_info.attachment" />
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-section class="q-mx-xl">
                            <q-timeline color="primary" layout="comfortable" side="right">
                                <q-timeline-entry v-for="entry in this.timeline" :key="entry.title"
                                    :title="entry.title"
                                    :subtitle="convertDateFormat(entry.subtitle, 'MMM DD, YYYY HH:mm A')"
                                    :body="entry.body"
                                    :color="timelineColor(entry.subtitle)"
                                    side="left"
                                    class="text-uppercase"
                                />
                            </q-timeline>
                        </q-card-section>

                        <q-card-actions class="q-pb-lg q-px-md" align="right">
                            <div class="row q-px-md q-pb-md">
                                <div class="col q-px-md">
                                    <q-btn flat label="Close" class="text-uppercase q-px-sm q-py-xs" v-close-popup />
                                </div>
                            </div>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </div>
        </div>
    </q-page>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'
    import moment from 'moment'
    import { Notify } from 'quasar'

    export default {
        data() {
            return {
                action: {
                    id: 0,
                    abbr: '',
                    source: '',
                    action: '',
                },
                columns: [
                    {
                        name: 'employee_name',
                        align: 'right',
                        required: true,
                        label: 'coverage',
                        sortable: false,
                        headerStyle: {
                            'width': '17.5% !important'
                        },
                    },
                    {
                        name: 'description',
                        align: 'left',
                        required: true,
                        label: 'request information',
                        sortable: false,
                        headerStyle: {
                            'width': '50% !important',
                            'align': 'center !important',
                        },
                    },
                    {
                        name: 'date_filed',
                        align: 'right',
                        required: true,
                        label: 'date filed',
                        sortable: false,
                        headerStyle: {
                            'align': 'center !important',
                        },
                    },
                    {
                        name: 'request_type',
                        align: 'left',
                        label: 'type',
                        sortable: false,
                    },
                    {
                        name: 'actions',
                        align: 'right',
                        required: true,
                        label: '',
                        sortable: false,
                        headerStyle: {
                            'width': '15% !important',
                            'text-align': 'center',
                        },
                    },
                ],
                date_placeholder: "",
                date: "",
                diaLoading: false,
                dialog: {
                    details: false,
                    request: false,
                },
                filterSources: {
                    leave: false,
                    ob: false,
                    change_rd: false,
                    change_shift: false,
                    payroll_complaint: false,
                },
                loading: false,
                pagination: {
                    page: 1,
                    rowsPerPage: 10,
                    rowsNumber: 10
                },
                reason: "",
                request_info: {
                    requestor: "",
                    type: "",
                    desc: "",
                    reason: "",
                    coverage: {},
                    attachment: "",
                },
                rows: [],
                rowsOptions: [5, 10, 15, 20, 50, 0],
                search: "",
                sources: {},
                timeline: [],
                visibleColumns: ['employee_name', 'description', 'date_filed', 'actions'],
                visibleSources: [],
            }
        },
        methods: {
            getRequestForApproval (_sources, _filter) {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                let params = { sources: _sources, pagination: _filter }
                
                this.loading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/approval`, params, { headers })
                    .then(response => {
                        let _sfid = JSON.parse(Cookies.get('sfid'))

                        this.pagination.page = params.pagination.page
                        this.pagination.rowsPerPage = params.pagination.rowsPerPage
                
                        this.rows = response.data.data
                        this.pagination.rowsNumber = response.data.count
                        this.loading = false
                    })
                    .catch((error) => {
                        console.error(error)
                        this.loading = false
                    });
            },
            filterSource (value) {
                let sources = this.visibleSources

                if (!sources.includes(value) && this.filterSources[value]) {
                    sources.push(value)
                } else {
                    sources.splice(sources.indexOf(value), 1)
                }

                this.getRequestForApproval(sources, {
                    page: 1, // return to page 1 on select of source
                    rowsPerPage: this.pagination.rowsPerPage,
                    filter: this.search,
                })
            },
            getApprovalSources () {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.loading = true

                axios.get(`${ process.env.VUE_APP_API_URL }/user/request/sources`, { headers })
                    .then(response => {
                        let sources = {}
                        response.data.forEach(function (value) {
                            sources[value.source.toLowerCase()] = value.count
                        });

                        this.loading = false
                        this.sources = sources
                    })
                    .catch((error) => {
                        console.error(error)
                        this.loading = false
                    });
            },
            submit () {
                this.diaLoading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/approval/action`, {
                    id: this.action.id,
                    abbr: this.action.abbr,
                    source: this.action.source,
                    action: this.action.action,
                    reason: this.reason,
                    date_to: this.date,
                }, {
                    headers: {
                        'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    }
                })
                .then(response => {
                    this.dialog.request = false
                    this.diaLoading = false

                    this.getApprovalSources()
                    this.onRequest({
                        pagination: this.pagination,
                        filter: this.search,
                    })

                    Notify.create({
                        type: 'positive',
                        message: `Request Submitted Successfully!`,
                        closeBtn: false,
                    })
                })
                .catch(error => {
                    this.errorMessage = error.message
                    this.diaLoading = false
                    console.error(error)
                })
            },
            clearDialog () {
                this.clearDate()
                this.reason = ''
            },
            clearDate () {
                this.date = ''
                this.date_placeholder = ''
            },
            viewRequestDetails (row) {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.dialog.details = true
                this.getRequestInformation(row)
                this.timeline = []

                axios.get(`${ process.env.VUE_APP_API_URL }/user/request/approval/${ row.request_id }`, { headers })
                    .then(response => {
                        let _arr = []
                        response.data.forEach(function (value, key) {
                            _arr.push(value)
                        });

                        this.timeline = _arr
                    })
                    .catch((error) => {
                        console.error(error)
                        this.loading = false
                    });
            },
            getRequestInformation (row) {
                let _data = this.rows[this.rows.indexOf(row)]

                this.request_info.requestor = _data.employee_name
                this.request_info.type = _data.request_type
                this.request_info.desc = _data.request_description
                this.request_info.reason = _data.reason
                this.request_info.attachment = _data.attachment
                this.date = _data.date_to
                this.date_placeholder = moment(_data.date_to).format("MMM DD, YYYY")
            },
            populateDateRange () {
                let _format = "MMM DD, YYYY"

                if (this.date) {
                    this.date_placeholder = `${ moment(this.date_range).format(_format) }`
                }

                this.$refs.qDateProxy.hide()
            },
            approveRequest (row) {
                this.action.id = row.request_id
                this.action.abbr = row.request_abbr
                this.action.source = row.source
                this.action.action = "approve"
                this.dialog.request = true
                this.getRequestInformation(row)
            },
            rejectRequest (row) {
                this.action.id = row.request_id
                this.action.abbr = row.request_abbr
                this.action.source = row.source
                this.action.action = "reject"
                this.dialog.request = true
                this.getRequestInformation(row)
            },
            timelineColor (value) {
                if (value == null) {
                    return 'grey-4'
                } else {
                    return 'primary'
                }
            },
            convertDateFormat (date, format) {
                if (!moment(date).isValid()) {
                    return ""
                }

                return moment(date).format(format)
            },
            getDateDiff (from, to) {
                let _from = moment(from)
                let _to = moment(to)

                return _to.diff(_from, 'days')
            },
            onRequest (props) {
                const { page, rowsPerPage } = props.pagination
                const filter = props.filter

                let params = {
                    page,
                    rowsPerPage,
                    filter,
                }

                this.getRequestForApproval(this.visibleSources, params)
            },
        },
        mounted () {
            this.getApprovalSources()
            this.onRequest({
                pagination: this.pagination,
                filter: this.search,
            })
        },
        computed: {}
    }
</script>

<style lang="scss">
    .Request-Approval {
        .approval-container {
            border-radius: 2rem;
            box-shadow: 0px 20px 20px -5px rgba(0, 0, 0, 0.2);
        }

        .q-table--horizontal-separator tbody tr td,
        .q-table--cell-separator tbody tr td {
            border-bottom-width: 0 !important;
        }

        .q-table__bottom {
            padding-top: 1rem;

            border: none !important;
        }

        .q-table {
            tr {
                th {
                    font-weight: bold;
                    text-transform: uppercase;
                }

                td {
                    white-space: break-spaces !important;
                }
            }
        }

        .q-table__card {
            background: transparent;
        }

        .badge {
            padding: 0.15rem 0.5rem;

            border-radius: 0.25rem;
            font-weight: bold;
            text-transform: uppercase;

            &.badge-primary {
                background: rgba(0, 117, 184, 0.075);
                color: var(--q-color-primary);
            }

            &.badge-danger {
                background: rgba(193, 0, 21, 0.075);
                color: var(--q-color-negative);
            }

            &.badge-green {
                background: rgba(37, 197, 157, 0.075);
                color: rgba(37, 197, 157, 1);
            }
        }

        .customEllipsis {
            display: inline-block;
            vertical-align: top;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .--date-coverage {
            margin: 0;
            padding: 0;

            border-radius: 0.25rem;
            border-spacing: 0;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
            font-weight: bold;

            .--header td,
            .--body td,
            .--footer td {
                width: 50px;
                height: 15px;
                padding: 0;

                font-size: 0.65rem;
                text-align: center;
                vertical-align: middle;
            }

            .--header td {
                background: $red-7;
                color: #FFFFFF;
                text-transform: uppercase;
            }

            .--body td {
                height: 30px !important;

                font-size: 1rem !important;
            }

            .--footer td {

            }
        }

        .new-request {
            position: absolute;
            bottom: 2rem;
            right: 2rem;

            border-radius: 2rem;
            box-shadow: 0px 15px 10px -5px rgba(0, 0, 0, 0.2);
            text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        }
    }

    .q-dialog {
        .q-dialog__inner > div {
            border-radius: 2rem !important;
        }

        .--required::after {
            position: absolute;
            margin-left: 0.25rem;

            content: "*";
            color: $red-8;
            font-size: 1rem;
            font-weight: bold;
        }
    }

    .q-field__native,
    .q-field__input {
        font-weight: 500 !important;
    }
</style>