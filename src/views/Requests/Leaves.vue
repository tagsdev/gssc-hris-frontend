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
                    no-data-label="No data found">
                        <template v-slot:loading>
                            <q-inner-loading showing color="primary" />
                        </template>

                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="date" auto-width :props="props">
                                    <span v-if="props.row.date.from == props.row.date.to" class="text-weight-bold">{{ props.row.date.from }}</span>
                                    <span v-else>
                                        <span class="text-weight-bold">{{ props.row.date.from }}</span>
                                        &nbsp; - &nbsp;
                                        <span class="text-weight-bold">{{ props.row.date.to }}</span>
                                    </span>
                                </q-td>

                                <q-td key="type" :props="props" auto-width class="text-center">
                                    <span class="text-weight-bold text-uppercase">{{ props.row.type }}</span>
                                </q-td>

                                <q-td key="status" :props="props" auto-width class="text-center">
                                    <span class="q-px-sm q-py-xs rounded-borders text-weight-bold text-uppercase"
                                        :class="{
                                            'bg-blue-1 text-blue-8': props.row.status == 'pending',
                                            'bg-red-1 text-red-8': props.row.status == 'rejected',
                                            'bg-teal-1 text-teal-14': props.row.status == 'approved',
                                            'bg-grey-3 text-grey-6': props.row.status == 'expired',
                                    }">
                                        {{ props.row.status }}
                                    </span>
                                </q-td>

                                <q-td key="reason" :props="props">
                                    <div style="width: 45vw;" class="customEllipsis">
                                        {{ props.row.reason }}
                                        <q-tooltip v-if="props.row.reason.length > 50" content-style="font-size: 12px" transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-grey-12 text-black">{{ props.row.reason }}</q-tooltip>
                                    </div>
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
                    <q-card style="width: 60vw; max-width: 80vw;">
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

                            <div class="row q-px-md q-mt-xl q-mb-lg">
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
                                        <q-radio v-model="isHalf" selected checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="wd" label="Whole Day" color="secondary" @input="dateRange()" :disable="disableDayType" class="q-mx-md text-weight-bold text-uppercase" />
                                        <q-radio v-model="isHalf" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="hd" label="Half Day" color="secondary" @input="dateRange()" :disable="disableDayType" class="q-mx-md text-weight-bold text-uppercase" />
                                        <q-checkbox v-model="isLate" @input="clearDate()" val="lf" label="Late Filing" color="red-8" class="q-mx-md text-weight-bold text-uppercase" />
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
                                    <q-file v-model="attachments" :required="requireAttachment" color="secondary" class="text-weight-bold" outlined clearable counter multiple :rules="requireAttachment ? [ val => !!val || 'This field is required' ] : []">
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
                attachments: null,
                columns: [
                    {
                        name: 'date',
                        align: 'right',
                        required: true,
                        label: 'date coverage',
                        field: 'date',
                        sortable: false
                    },
                    {
                        name: 'type',
                        align: 'left',
                        label: 'leave type',
                        field: 'type',
                        sortable: false
                    },
                    {
                        name: 'status',
                        align: 'center',
                        label: 'status',
                        field: 'status',
                        sortable: false
                    },
                    {
                        name: 'reason',
                        align: 'left',
                        label: 'reason',
                        field: 'reason',
                        sortable: false
                    },
                ],
                date_placeholder: "",
                date_range: {
                    from: '',
                    to: ''
                },
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
                        abbr: 'prl',
                        inactive: false,
                    },
                ],
                diaLoading: false,
                loading: false,
                requireAttachment: false,
                reason: "",
                rows: [],
                rowsOptions: [5, 10, 15, 20, 50, 0],
                pagination: {
                    rowsPerPage: 10,
                    page: 1
                },
                request_dialog: false,
            }
        },
        methods: {
            dateOptions(dateNow) {
                if (this.isLate) {
                    return dateNow < moment().format("YYYY/MM/DD")
                } else {
                    return dateNow >= moment().format("YYYY/MM/DD")
                }
            },
            getTeamLeaveTracker() {
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
                        console.error(error.response.data.message)
                        this.loading = false
                    });
            },
            submit() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

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

                if (!this.isDateRange) {
                    data.date = {
                        from: this.date_range,
                        to: this.date_range
                    }
                }

                this.diaLoading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/leave/submit`, data, { headers })
                    .then(response => {
                        this.diaLoading = false
                        this.request_dialog = false
                        this.clearDialog()

                        this.rows.unshift(data)

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
            populateDateRange() {
                let _format = "MMM DD, YYYY"

                if (this.date_range.from) {
                    this.date_placeholder = `${ moment(this.date_range.from).format(_format) } to ${ moment(this.date_range.to).format(_format) }`
                    this.$refs.qDateProxy.hide()
                } else {
                    this.date_placeholder = `${ moment(this.date_range).format(_format) }`
                    this.$refs.qDateProxy.hide()
                }
            },
            dateRange() {
                this.clearDate()
                this.isDateRange = this.isHalf == "hd" ? false : true
            },
            leaveType() {
                let _withDayType = ['vacation_leave', 'sick_leave']
                let _isDateRange = ['emergency_leave', 'gynecological_leave', 'maternity_leave']
                    _isDateRange = _isDateRange.concat(_withDayType)
                let _withAttachment = ['vacation_leave']

                this.clearDate()
                this.isDateRange = _isDateRange.includes(this.leave_type.value) && (this.isHalf == false) ? true : false
                this.disableDayType = _withDayType.includes(this.leave_type.value) ? false : true
                this.requireAttachment = _withAttachment.includes(this.leave_type.value) ? false : true
            },
            clearDialog() {
                this.clearDate()
                this.leave_type = ''
                this.attachments = null
                this.reason = ''
                this.isHalf = "wd"
                this.isLate = false
            },
            clearDate() {
                this.date_range = ''
                this.date_placeholder = ''
            },
        },
        mounted() {
            this.leaves = JSON.parse(Cookies.get('leaves'))
            this.getTeamLeaveTracker()
        },
        computed: {
            isComplete () {
                if (this.requireAttachment) {
                    return this.leave_type && this.isHalf && this.attachments && ((this.date_range.from && this.date_range.to) || (this.date_range)) && this.reason
                } else {
                    return this.leave_type && this.isHalf && ((this.date_range.from && this.date_range.to) || (this.date_range)) && this.reason
                }
            },
            pagesNumber () {
                return Math.ceil(this.rows.length / this.pagination.rowsPerPage)
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

        .customEllipsis {
            display: inline-block;
            vertical-align: top;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
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