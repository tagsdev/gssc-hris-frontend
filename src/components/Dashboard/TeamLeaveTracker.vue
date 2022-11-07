<template>
    <div class="row q-col-gutter-lg q-mr-md">
        <div class="col col-md-12">
            <q-card dark class="bg-white text-black q-pa-md leave-tracker-card">
                <div class="row">
                    <div class="col self-center">
                        <div class="float-left">
                            <div class="card-icon text-white bg-cyan-8">
                                <q-icon style="display: inline;" class="text-cyan-2" name="las la-users" />
                            </div>
                        </div>

                        <div class="q-pt-lg">
                            <span class="q-pl-md title">Team Leave Tracker</span>
                        </div>
                    </div>
                </div>

                <div class="q-pa-xs q-mt-md">
                    <div v-if="rows.length == 0" class="text-center text-grey-6">
                        <em>This section is still under careful development. Thank you for your patience.</em>
                    </div>

                    <q-table flat v-else style="height: 350px;" :data="rows" :columns="columns" :rows-per-page-options="[]" no-data-label="Widget feature is still under careful development..." row-key="date">
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

                                <q-td key="name" :props="props">
                                    <span class="badge q-mr-md" :class="{
                                        'badge-green': ['SL', 'HS', 'GL', 'ML', 'PL', 'HP', 'PR'].includes(props.row.abbr.toUpperCase()),
                                        'badge-danger': ['EL', 'HE'].includes(props.row.abbr.toUpperCase()),
                                        'badge-primary': ['VL', 'HV', 'CL', 'HC'].includes(props.row.abbr.toUpperCase()),
                                    }">
                                        <i class="las" :class="{
                                            'la-temperature-high': ['SL', 'HS', 'GL', 'ML', 'PL', 'HP', 'PR'].includes(props.row.abbr.toUpperCase()),
                                            'la-ambulance': ['EL', 'HE'].includes(props.row.abbr.toUpperCase()),
                                            'la-umbrella-beach': ['VL', 'HV', 'CL', 'HC'].includes(props.row.abbr.toUpperCase()),
                                        }"></i>
                                        {{ props.row.abbr }}
                                    </span>

                                    <span class="text-weight-bold">
                                        {{ props.row.reason }}
                                    </span>

                                    <q-tooltip :content-style="{ 'font-size': '14px', 'max-width': '350px' }" transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-grey-9 text-white">{{ props.row.reason }}</q-tooltip>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>
            </q-card>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie'

    export default {
        name: 'TeamLeaveTracker',
        data() {
            return {
                columns: [
                    {
                        name: 'date',
                        required: true,
                        label: 'date coverage',
                        align: 'right',
                        field: 'date',
                        sortable: false
                    },
                    {
                        name: 'name',
                        align: 'left',
                        label: 'information',
                        field: 'name',
                        sortable: false
                    },
                ],
                rows: [],
            }
        },
        mounted() {
            this.getTeamLeaveTracker()
        },
        methods: {
            getTeamLeaveTracker() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                axios.get(`${ process.env.VUE_APP_API_URL }/user/widgets/leave-tracker`, { headers })
                    .then(response => {
                        this.rows = response.data
                    })
                    .catch((error) => {
                        console.error(error.response.data.message)
                    });
            }
        }
    }
</script>

<style lang="scss">
    .leave-tracker-card {
        padding: 2rem;

        border-radius: 2rem;
        box-shadow: 0px 20px 20px -5px rgba(0, 0, 0, 0.2);

        .card-icon {
            display: inline-block;
            height: 70px;
            width: 70px;
            padding: 0.75rem;

            border-radius: 1rem !important;
            box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.5);
            font-size: 3rem;
            text-align: center;
        }

        .title {
            margin-left: 1rem;

            color: #555555;
            font-size: 150%;
            font-weight: 600;
            text-transform: uppercase;
        }

        .accent {
            position: absolute;
            width: 80%;
            height: 30px;
            top: 0;
            left: 10%;

            border-radius: 0 0 2rem 2rem !important;
            box-shadow: inset 0px -5px 5px 0px rgba(0, 0, 0, 0.25);

            &::before {
                content: "";
            }

            &.accent-primary {
                background: var(--q-color-primary);
            }
        }

        h3 {
            margin-bottom: 1rem !important;
            margin-top: 1rem !important;

            font-weight: 500;
        }

        > i {
            font-size: 3rem;
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

            border-radius: 0.5rem;
            font-weight: 500;
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
    }
</style>