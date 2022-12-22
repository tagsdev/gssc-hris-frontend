<template>
    <q-page padding :class="$route.name" class="bg-grey-4">
        <div class="row justify-center">
            <div class="col-xs-12 bg-white q-px-xl q-py-xl ob-container">
                <div class="page-header">
                    <h4 class="text-uppercase" style="margin-top: 0; margin-bottom: 0;">Official Business Requests</h4>
                    <span class="text-grey-6">
                        User-Requested Official Business
                    </span>
                </div>

                <div class="q-pa-xs" style="margin-top: -60px;">
                    <q-table 
                        flat
                        :data="rows"
                        :loading="loading"
                        :columns="columns"
                        :rows-per-page-options="rowsOptions"
                        :pagination.sync="pagination"
                        class="col my-sticky-column-table"
                        no-data-label="No data found"
                        :filter="search"
                        @request="onRequest"
                    >
                        <template v-slot:loading>
                            <q-inner-loading showing color="primary" />
                        </template>

                        <template v-slot:top-right>
                            <q-input borderless dense debounce="500" v-model="search" placeholder="Search">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </template>

                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="date" :props="props">
                                    <span v-if="props.row.date.from == props.row.date.to" class="">{{ props.row.date.from }}</span>
                                    <span v-else>
                                        <span class="">{{ props.row.date.from }}</span>
                                        &nbsp; to &nbsp;
                                        <span class="">{{ props.row.date.to }}</span>
                                    </span>

                                    <br />

                                    <span v-if="props.row.time.from == props.row.time.to" class="">{{ props.row.time.from }}</span>
                                    <span v-else>
                                        <span class="">{{ props.row.time.from }}</span>
                                        &nbsp; - &nbsp;
                                        <span class="">{{ props.row.time.to }}</span>
                                    </span>
                                </q-td>

                                <q-td key="status" :props="props" class="text-center">
                                    <span class="q-px-sm q-py-xs rounded-borders text-weight-bold text-uppercase"
                                        :class="{
                                            'bg-blue-1 text-blue-8': ['pending', 'reviewing'].includes(props.row.status),
                                            'bg-red-1 text-red-8': ['rejected', 'cancelled'].includes(props.row.status),
                                            'bg-teal-1 text-teal-14': props.row.status == 'approved',
                                            'bg-grey-3 text-grey-6': props.row.status == 'expired',
                                        }">{{ props.row.status }}</span>
                                </q-td>

                                <q-td key="reason" :props="props">
                                    <div style="width: 45vw;" class="customEllipsis">
                                        {{ props.row.reason }}
                                        <q-tooltip v-if="props.row.reason.length > 50" content-style="font-size: 12px" transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-grey-12 text-black">{{ props.row.reason }}</q-tooltip>
                                    </div>
                                </q-td>

                                <q-td key="actions" :props="props" class="text-center">
                                    <q-btn v-if="!['cancelled', 'expired', 'transacted'].includes(props.row.status.toLowerCase())" flat size="sm" icon="las la-trash" color="red-4" class="text-uppercase q-px-sm q-py-xs" @click="cancelDialog(props.row)" />
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>

                <q-btn class="new-request q-pa-md bg-primary text-white text-weight-bold" @click="request_dialog = true" color="secondary" icon="las la-plus" label="New Request" />

                <q-dialog persistent v-model="request_dialog" class="q-px-xl">
                    <q-card style="width: 50vw; max-width: 80vw;">
                        <q-card-section class="q-mx-md">
                            <div class="text-h6 q-pt-md q-px-xs text-uppercase">&nbsp; Employee Official Business Request Form</div>
                        </q-card-section>

                        <q-separator class="q-mx-xl" />

                        <q-card-section>
                            <div class="row q-px-md q-mt-sm q-mb-lg">
                                <div class="col q-mx-md">
                                    <q-banner rounded class="bg-grey-12">
                                        All fields with asterisks (<code class="text-red-8"><strong>*</strong></code>) are required.
                                    </q-banner>
                                </div>
                            </div>

                            <div class="row q-px-md">
                                <div class="col-6 q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Date Coverage</span>
                                    <q-input outlined v-model="date_placeholder" color="secondary" @click="$refs.qDateProxy.show()" :rules="[val => !!val || 'This field is required']">
                                        <template v-slot:append>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="date_range" range today-btn mask="YYYY-MM-DD" color="secondary" @input="populateDateRange()" />
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-3 q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Time From</span>
                                    <q-input v-model="time.from" mask="##:## AM" type="time" fill-mask outlined align="right" color="secondary" :rules="[val => !!val || 'This field is required']" />
                                </div>

                                <div class="col-3 q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Time To</span>
                                    <q-input v-model="time.to" mask="##:## AM" type="time" fill-mask outlined color="secondary" :rules="[val => !!val || 'This field is required']" />
                                </div>
                            </div>

                            <div class="row q-px-md">
                                <div class="col-6 q-px-md">
                                    <span class="block --required q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">Location</span>
                                    <q-input v-model="location" outlined color="secondary" :rules="[val => !!val || 'This field is required']" />
                                </div>

                                <div class="col-6 q-px-md">
                                    <span class="block q-mb-xs text-uppercase text-weight-bold text-blue-grey-9">File Attachment(s)</span>

                                    <q-file v-model="files" color="secondary" class="text-weight-bold attachment" outlined clearable counter :reactive-rules="true">
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
                                    <q-btn label="Submit" color="secondary" class="text-uppercase q-px-xl q-py-xs" :disabled="!isComplete" :loading="diaLoading" @click="submit()" />
                                    &nbsp;
                                    <q-btn flat label="Cancel" class="text-uppercase q-px-sm q-py-xs" @click="clearDialog()" v-close-popup />
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
                columns: [
                    {
                        name: 'date',
                        align: 'right',
                        required: true,
                        label: 'coverage',
                        field: 'date',
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
                cancel_dialog: false,
                dateNow: new Date(),
                date_placeholder: "",
                date_range: {
                    from: '',
                    to: ''
                },
                time: {
                    from: '',
                    to: ''
                },
                location: "",
                diaLoading: false,
                loading: false,
                reason: "",
                rows: [],
                rowsOptions: [5, 10, 15, 20, 50, 0],
                pagination: {
                    page: 1,
                    rowsPerPage: 10,
                    rowsNumber: 10,
                },
                search: "",
                request_dialog: false,
            }
        },
        methods: {
            getTeamLeaveTracker(params) {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                this.loading = true

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/ob`, params, { headers })
                    .then(response => {
                        this.pagination.page = params.page
                        this.pagination.rowsPerPage = params.rowsPerPage

                        this.rows = response.data.data
                        this.pagination.rowsNumber = response.data.count
                        this.loading = false
                    })
                    .catch((error) => {
                        console.error(error.response.data.message)
                        this.loading = false
                    });
            },
            onRequest (props) {
                const { page, rowsPerPage } = props.pagination
                const filter = props.filter

                let params = {
                    page,
                    rowsPerPage,
                    filter,
                }

                this.getTeamLeaveTracker(params)
            },
            submit() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`,
                    'Content-Type': 'multipart/form-data'
                }

                let data = {
                    date: {
                        from: moment(this.date_range.from).format("MMM d, YYYY"),
                        to: moment(this.date_range.to).format("MMM d, YYYY")
                    },
                    time: {
                        from: moment(this.time.from, "HH:mm A").format("hh:mm A"),
                        to: moment(this.time.to, "HH:mm A").format("hh:mm A"),
                    },
                    status: 'pending',
                    abbr: 'ob',
                    location: this.location,
                    reason: this.reason,
                };

                if (typeof this.date_range != "object") {
                    data.date = {
                        from: this.date_range,
                        to: this.date_range
                    }
                }

                this.diaLoading = true

                let formData = new FormData()
                formData.append('file', this.files)
                formData.append('data', JSON.stringify(data))
                formData.append('_method', 'PUT')

                axios.post(`${ process.env.VUE_APP_API_URL }/user/request/ob/submit`, formData, { headers })
                    .then(response => {
                        this.diaLoading = false
                        this.request_dialog = false
                        this.clearDialog()

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
            populateDateRange() {
                let _format = "MMM DD, YYYY"

                if (this.date_range.from) {
                    this.date_placeholder = `${ moment(this.date_range.from).format(_format) } to ${ moment(this.date_range.to).format(_format) }`
                } else {
                    this.date_placeholder = `${ moment(this.date_range).format(_format) }`
                }

                this.$refs.qDateProxy.hide()
            },
            dateRange() {
                this.date_range = { from: '', to: '' }
                this.date_placeholder = ''
            },
            clearDialog() {
                this.clearDate()
                this.time = {
                    from: '',
                    to: ''
                }
                this.location = ''
                this.reason = ''
            },
            clearDate() {
                this.date_range = ''
                this.date_placeholder = ''
            },
            getRequestInformation (row) {
                let _data = this.rows[this.rows.indexOf(row)]

                this.request_info.time = _data.time
                this.request_info.type = _data.type
                this.request_info.status = _data.status
                this.request_info.reason = _data.reason
                this.date = _data.date_to
                this.date_placeholder = moment(_data.date_to).format("MMM DD, YYYY")
            },
            cancelDialog (row) {
                this.cancel_dialog = true
                // this.getRequestInformation(row)
                this.cancel_id = row.request_id
            },
        },
        mounted() {
            this.onRequest({
                pagination: this.pagination,
                filter: this.search,
            })
        },
        computed: {
            isComplete () {
                return ((this.date_range.from && this.date_range.to) || (this.date_range)) && this.time.from && this.time.to && this.location && this.reason
            },
        }
    }
</script>

<style lang="scss">
    .OB {
        .ob-container {
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

        .q-table__card {
            background: transparent;
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
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);

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