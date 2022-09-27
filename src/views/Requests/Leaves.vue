<template>
    <q-page padding :class="$route.name" class="bg-grey-4">
        <div class="row justify-center">
            <div class="col-xs-12 bg-white q-px-xl q-py-xl leaves-container">
                <h4 class="text-uppercase" style="margin-top: 0; margin-bottom: 0;">Leave Requests</h4>
                <span class="text-grey-6">
                    User-Requested Leaves
                </span>

                <div class="q-pa-xs q-mt-md">
                    <q-table flat hide-pagination :data="rows"
                    :loading="loading"
                    :columns="columns"
                    :rows-per-page-options="rowsOptions"
                    :pagination.sync="pagination"
                    class="col my-sticky-column-table"
                    no-data-label="No data found"
                    :filter="filter"
                    :filter-method="customFilter">
                        <template v-slot:loading>
                            <q-inner-loading showing color="primary" />
                        </template>

                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="search" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="date" :props="props" class="cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <div align="right">
                                        <table class="--date-coverage">
                                            <tr class="--header">
                                                <td :colspan="convertDateFormat(props.row.date.from, 'MMM') != convertDateFormat(props.row.date.to, 'MMM') ? 1 : 3">{{ convertDateFormat(props.row.date.from, 'MMM') }}</td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 1 && (convertDateFormat(props.row.date.from, 'MMM') != convertDateFormat(props.row.date.to, 'MMM'))">&nbsp;</td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 0 && (convertDateFormat(props.row.date.from, 'MMM') != convertDateFormat(props.row.date.to, 'MMM'))">
                                                    {{ convertDateFormat(props.row.date.to, 'MMM') }}
                                                </td>
                                            </tr>
                                            <tr class="--body">
                                                <td>{{ convertDateFormat(props.row.date.from, 'DD') }}</td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 1 && (convertDateFormat(props.row.date.from, 'DD') != convertDateFormat(props.row.date.to, 'DD'))">
                                                    <q-icon style="font-size: 18px;" name="las la-ellipsis-h" />
                                                </td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 0">{{ convertDateFormat(props.row.date.to, 'DD') }}</td>
                                            </tr>
                                            <tr class="--footer">
                                                <td :colspan="convertDateFormat(props.row.date.from, 'YYYY') == convertDateFormat(props.row.date.to, 'YYYY') ? 3 : 1">
                                                    {{ convertDateFormat(props.row.date.from, 'YYYY') }}
                                                </td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 1 && (convertDateFormat(props.row.date.from, 'YYYY') != convertDateFormat(props.row.date.to, 'YYYY'))">&nbsp;</td>
                                                <td v-if="getDateDiff(props.row.date.from, props.row.date.to) > 0 && (convertDateFormat(props.row.date.from, 'YYYY') != convertDateFormat(props.row.date.to, 'YYYY'))">
                                                    {{ convertDateFormat(props.row.date.to, 'YYYY') }}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </q-td>

                                <q-td key="reason" :props="props" class="cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <span class="text-weight-bold text-uppercase">{{ props.row.type }}</span>
                                    <br />
                                    <div style="width: 35vw;" class="customEllipsis">
                                        <span class="q-px-sm q-mr-xs q-py-xs rounded-borders text-weight-bold text-uppercase text-primary" v-if="props.row.attachment">
                                            <q-icon style="font-size: 24px;" name="las la-paperclip" />
                                        </span>
                                        {{ props.row.reason }}

                                        <q-tooltip v-if="props.row.reason.length > 50" content-style="font-size: 12px" transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-grey-12 text-black">{{ props.row.reason }}</q-tooltip>
                                    </div>
                                </q-td>

                                <q-td key="status" :props="props" class="text-center cursor-pointer" @click="viewRequestDetails(props.row)">
                                    <span class="q-px-sm q-py-xs rounded-borders text-weight-bold text-uppercase"
                                        :class="{
                                            'bg-blue-1 text-blue-8': ['pending', 'reviewing'].includes(props.row.status),
                                            'bg-red-1 text-red-8': ['rejected', 'cancelled'].includes(props.row.status),
                                            'bg-teal-1 text-teal-14': props.row.status == 'approved',
                                            'bg-grey-3 text-grey-6': props.row.status == 'expired',
                                        }"
                                    >
                                        {{ props.row.status }}
                                    </span>
                                </q-td>

                                <q-td key="actions" :props="props" class="text-center">
                                    <q-btn v-if="!['cancelled', 'expired', 'transacted'].includes(props.row.status.toLowerCase())" flat size="md" icon="las la-trash" color="red-4" class="text-uppercase q-px-sm q-py-xs" @click="cancelDialog(props.row)" />
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>

                <div v-if="pagesNumber > 1" class="row justify-center q-mt-md">
                    <q-pagination direction-links
                        push
                        ellipses
                        v-model="pagination.page"
                        color="secondary"
                        :max="pagesNumber" />
                </div>

                <q-btn class="new-request q-pa-md bg-primary text-white text-weight-bold" @click="request_dialog = true" color="secondary" icon="las la-plus" label="New Request" />

                <q-dialog persistent v-model="request_dialog" class="q-px-xl">
                    <q-card style="width: 60vw; max-width: 1200px;">
                        <q-card-section class="q-mx-md">
                            <div class="text-h6 q-pt-md q-px-xs text-uppercase">&nbsp; Employee Leave Request Form</div>
                        </q-card-section>

                        <q-separator class="q-mx-xl" />

                        <q-card-section>
                            <div class="row q-px-md q-mb-sm">
                                <div class="col q-mx-md">
                                    <span class="block q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Leave Balances</span>
                                </div>
                            </div>

                            <div class="row q-px-md">
                                <div class="col q-mx-md bordered">
                                    <q-list class="shadow-8" style="border-radius: 0.5rem;">
                                        <q-item>
                                            <q-item-section class="q-py-md" center>
                                                <q-item-label class="text-weight-bold text-uppercase">Vacation<br />Leave</q-item-label>
                                            </q-item-section>

                                            <q-item-section side center>
                                                <q-badge :label="this.leaves.vl" transparent color="blue-8" class="q-pa-sm" style="font-size: 1rem;" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>

                                <div class="col q-mx-md bordered">
                                    <q-list class="shadow-8" style="border-radius: 0.5rem;">
                                        <q-item>
                                            <q-item-section class="q-py-md" center>
                                                <q-item-label class="text-weight-bold text-uppercase">Sick<br />Leave</q-item-label>
                                            </q-item-section>

                                            <q-item-section side center>
                                                <q-badge :label="this.leaves.sl" transparent color="orange-8" class="q-pa-sm" style="font-size: 1rem;" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>

                                <div class="col q-mx-md bordered">
                                    <q-list class="shadow-8" style="border-radius: 0.5rem;">
                                        <q-item>
                                            <q-item-section class="q-py-md" center>
                                                <q-item-label class="text-weight-bold text-uppercase">Emergency<br />Leave</q-item-label>
                                            </q-item-section>

                                            <q-item-section side center>
                                                <q-badge :label="this.leaves.el" transparent color="red-8" class="q-pa-sm" style="font-size: 1rem;" />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </div>

                            <div class="row q-px-md q-mt-lg q-mb-md">
                                <div class="col q-mx-md">
                                    <q-banner rounded class="bg-grey-12">
                                        All fields with asterisks (<code class="text-red-8"><strong>*</strong></code>) are required.
                                    </q-banner>
                                </div>
                            </div>

                            <div class="row q-px-md" style="padding-top: 1rem;">
                                <div class="col q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Leave Type</span>
                                    <q-select outlined v-model="leave_type" @input="leaveType()" :options="leave_types" option-disable="inactive" color="secondary" :rules="[val => !!val || 'This field is required']">
                                        <template v-slot:selected>
                                            <strong v-if="leave_type.value">{{ leave_type.label }}</strong>
                                        </template>
                                    </q-select>
                                </div>

                                <div class="col q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Day Type</span>
                                    <div class="q-py-sm">
                                        <q-radio v-model="isHalf" selected checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="wd" label="Whole Day" color="secondary" @input="dateRange()" :disable="disableDayType" class="q-mx-xs text-weight-bold text-uppercase" />
                                        <q-radio v-model="isHalf" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="hd" label="Half Day" color="secondary" @input="dateRange()" :disable="disableDayType" class="q-mx-xs text-weight-bold text-uppercase" />
                                        <q-checkbox v-model="isLate" @input="clearDate()" val="lf" label="Late Filing" color="red-8" class="q-mx-xs text-weight-bold text-uppercase" />
                                    </div>
                                </div>
                            </div>

                            <div class="row q-px-md">
                                <div class="col-6 q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Date</span>
                                    <q-input outlined v-model="date_placeholder" color="secondary" @click="$refs.qDateProxy.show()" :rules="[val => !!val || 'This field is required']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="date_range" :range="isDateRange" today-btn mask="YYYY-MM-DD" :options="dateOptions" color="secondary" @input="populateDateRange()" />
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-6 q-px-md">
                                    <span class="block q-mb-xs text-uppercase text-weight-bold text-blue-grey-9" :class="{'--required': requireAttachment }">File Attachment(s)</span>
                                    <q-file v-model="files" :required="requireAttachment" color="secondary" class="text-weight-bold attachment" outlined clearable counter :rules="requireAttachment ? [ val => !!val || 'This field is required' ] : []">
                                        <template v-slot:prepend>
                                            <q-icon name="las la-paperclip" />
                                        </template>
                                    </q-file>
                                </div>
                            </div>

                            <div class="row q-px-md">
                                <div class="col q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Reason</span>
                                    <q-input v-model="reason" outlined autogrow color="secondary" counter maxlength="300" :rules="[val => !!val || 'This field is required']" />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions class="q-pb-lg q-px-md" align="right">
                            <div class="row q-px-md q-pb-md">
                                <div class="col q-px-md">
                                    <q-btn label="Submit" color="secondary" class="text-uppercase q-px-xl q-py-xs q-mr-lg" :disabled="!isComplete" :loading="diaLoading" @click="submit()" />
                                    <q-btn flat label="Cancel" class="text-uppercase q-px-sm q-py-xs" @click="clearDialog()" v-close-popup />
                                </div>
                            </div>
                        </q-card-actions>
                    </q-card>
                </q-dialog>

                <q-dialog persistent v-model="details_dialog" class="q-px-xl">
                    <q-card style="width: 60vw; max-width: 800px;">
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

                <q-dialog persistent v-model="cancel_dialog" class="q-px-xl">
                    <q-card style="width: 60vw; max-width: 500px;">
                        <q-card-section class="q-mx-md">
                            <div class="text-h6 q-pt-md q-px-xs text-uppercase">&nbsp; Cancel Request</div>
                        </q-card-section>

                        <q-separator class="q-mx-xl" />

                        <q-card-section class="q-mx-md">
                            <p class="q-px-md">
                                Are you sure you want to Cancel this request?
                            </p>
                        </q-card-section>

                        <q-card-actions class="q-pb-lg q-px-md" align="right">
                            <div class="row q-px-md q-pb-md">
                                <div class="col q-px-md">
                                    <q-btn label="Yes" color="primary" class="text-uppercase q-px-sm q-py-xs q-mr-sm" @click="cancel(cancel_id)" :loading="diaLoading" v-close-popup />
                                    <q-btn flat label="No" class="text-uppercase q-px-sm q-py-xs" v-close-popup />
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
                files: null,
                cancel_dialog: false,
                cancel_id: 0,
                columns: [
                    {
                        name: 'date',
                        align: 'right',
                        required: true,
                        label: 'coverage',
                        field: 'date',
                        sortable: false,
                        headerStyle: {
                            'width': '12.5% !important'
                        },
                    },
                    {
                        name: 'reason',
                        align: 'left',
                        label: 'request information',
                        field: 'reason',
                        sortable: false,
                    },
                    {
                        name: 'status',
                        align: 'center',
                        label: 'status',
                        field: 'status',
                        sortable: false,
                    },
                    {
                        name: 'actions',
                        align: 'right',
                        label: '',
                        sortable: false,
                        headerStyle: {
                            'width': '5% !important',
                            'text-align': 'center',
                        },
                    },
                ],
                date_placeholder: "",
                date_range: {
                    from: '',
                    to: ''
                },
                details_dialog: false,
                isDateRange: true,
                isHalf: "wd",
                isLate: false,
                disableDayType: false,
                leaves: [],
                leave_type: "",
                leave_types: [
                    {
                        label: 'Vacation Leave',
                        value: 'vacation_leave',
                        abbr: 'vl',
                        inactive: false,
                    }, {
                        label: 'Company Leave',
                        value: 'company_leave',
                        abbr: 'cl',
                        inactive: false,
                    }, {
                        label: 'Sick Leave',
                        value: 'sick_leave',
                        abbr: 'sl',
                        inactive: false,
                    }, {
                        label: 'Emergency Leave',
                        value: 'emergency_leave',
                        abbr: 'el',
                        inactive: false,
                    }, {
                        label: 'Maternity Leave',
                        value: 'maternity_leave',
                        abbr: 'ml',
                        inactive: false,
                    }, {
                        label: 'Paternity Leave',
                        value: 'paternity_leave',
                        abbr: 'pl',
                        inactive: false,
                    }, {
                        label: 'Gynecological Leave',
                        value: 'gynecological_leave',
                        abbr: 'gl',
                        inactive: false,
                    }, {
                        label: 'Parental Leave (Solo Parent)',
                        value: 'parental_leave',
                        abbr: 'pr',
                        inactive: false,
                    },
                ],
                diaLoading: false,
                loading: false,
                requireAttachment: false,
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
                pagination: {
                    rowsPerPage: 5,
                    page: 1
                },
                request_dialog: false,
                search: '',
                timeline: [],
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

                        for (let val = 0; val < s1_lower.length; val++) {
                            if (
                                typeof s1_lower[val] !== 'undefined'
                                && s1_lower[val].includes(lowerSearch)
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
            dateOptions (dateNow) {
                if (this.isLate) {
                    return dateNow < moment().format("YYYY/MM/DD")
                } else {
                    return dateNow >= moment().format("YYYY/MM/DD")
                }
            },
            getTeamLeaveTracker () {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.loading = true

                axios.get(`${ process.env.VUE_APP_API_URL }/user/request/leaves`, { headers })
                    .then(response => {
                        this.rows = response.data
                        this.loading = false
                    })
                    .catch((error) => {
                        console.error(error)
                        this.loading = false
                    });
            },
            submit () {
                let data = {
                    type: this.leave_type.value,
                    date: {
                        from: this.date_range.from,
                        to: this.date_range.to
                    },
                    reason: this.reason,
                    day_type: this.isHalf,
                    late_filing: this.isLate,
                    abbr: this.leave_type.abbr,
                    status: 'pending',
                };

                if (typeof(this.date_range) == "string") {
                    data.date = {
                        from: this.date_range,
                        to: this.date_range
                    }
                }

                // this.diaLoading = true

                let formData = new FormData()
                formData.append('file', this.files)
                formData.append('data', JSON.stringify(data))
                formData.append('_method', 'PUT')

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/leaves/submit`, formData, {
                    headers: {
                        'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    // this.diaLoading = false
                    // this.request_dialog = false
                    // this.clearDialog()

                    // this.rows.unshift(data)

                    console.log(response)

                    Notify.create({
                        type: 'positive',
                        message: `Request Submitted Successfully!`,
                        closeBtn: false,
                    })
                })
                .catch(error => {
                    this.errorMessage = error.message
                    console.error(error)
                })
            },
            cancel (id) {
                this.diaLoading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/leaves/cancel`, { id: id }, {
                    headers: {
                        'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    }
                })
                .then(response => {
                    this.diaLoading = false
                    this.cancel_dialog = false

                    this.rows.map((value, key) => {
                        if (value.request_id == id) {
                            value.status = 'cancelled'
                        }
                    })

                    Notify.create({
                        type: 'positive',
                        message: `Request Cancelled Successfully!`,
                        closeBtn: false,
                    })
                })
                .catch(error => {
                    this.diaLoading = false
                    this.errorMessage = error.message
                    console.error(error)
                })
            },
            populateDateRange () {
                let _format = "MMM DD, YYYY"

                if (this.date_range.from) {
                    this.date_placeholder = `${ moment(this.date_range.from).format(_format) } to ${ moment(this.date_range.to).format(_format) }`
                } else {
                    this.date_placeholder = `${ moment(this.date_range).format(_format) }`
                }

                this.$refs.qDateProxy.hide()
            },
            dateRange () {
                this.clearDate()
                this.isDateRange = this.isHalf == "hd" ? false : true
            },
            leaveType () {
                let _withHalfDay = ['vacation_leave', 'company_leave', 'sick_leave', 'paternity_leave', 'emergency_leave']
                let _isDateRange = ['emergency_leave', 'gynecological_leave', 'maternity_leave']
                    _isDateRange = _isDateRange.concat(_withHalfDay)
                let _requireAttachment = ['sick_leave', 'maternity_leave', 'gynecological_leave', 'emergency_leave', 'paternity_leave', 'parental_leave']

                this.clearDate()
                this.isHalf = "wd"
                this.isDateRange = _isDateRange.includes(this.leave_type.value) && (this.isHalf == "wd") ? true : false
                this.disableDayType = _withHalfDay.includes(this.leave_type.value) ? false : true
                this.requireAttachment = _requireAttachment.includes(this.leave_type.value) ? true : false
            },
            clearDialog () {
                this.clearDate()
                this.leave_type = ''
                this.files = null
                this.reason = ''
                this.isHalf = "wd"
                this.isLate = false
            },
            clearDate () {
                this.date_range = ''
                this.date_placeholder = ''
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
            cancelDialog (row) {
                this.cancel_dialog = true
                this.getRequestInformation(row)
                this.cancel_id = row.request_id
            },
            viewRequestDetails (row) {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.details_dialog = true
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
        },
        mounted () {
            this.leaves = JSON.parse(Cookies.get('leaves'))
            this.getTeamLeaveTracker()
        },
        computed: {
            isComplete () {
                if (this.requireAttachment) {
                    return this.leave_type.value.length && this.isHalf && this.files && ((this.date_range.from.length && this.date_range.to.length) || (this.date_range.length)) && this.reason.length
                } else {
                    return this.leave_type && this.isHalf && ((this.date_range.from && this.date_range.to) || (this.date_range)) && this.reason
                }
            },
            pagesNumber () {
                return Math.ceil(this.rows.length / this.pagination.rowsPerPage)
            },
            filter () {
                return {
                    search: this.search
                }
            }
        }
    }
</script>

<style lang="scss">
    .Leaves {
        .leaves-container {
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
            }
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