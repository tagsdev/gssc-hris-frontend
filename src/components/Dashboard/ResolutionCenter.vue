<template>
    <div class="row q-col-gutter-lg q-mr-md">
        <div class="col">
            <q-card dark class="bg-white text-black q-pa-md resolution-icons">
                <div class="row">
                    <div class="col self-center">
                        <div class="float-left">
                            <div class="card-icon text-white bg-yellow-8">
                                <q-icon style="display: inline;" class="text-yellow-2" name="las la-tools" />
                            </div>
                        </div>

                        <div class="q-pt-lg">
                            <span class="q-pl-md title">Resolution Center</span>
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
                                <q-td key="date" width="10%" :props="props">
                                    {{ props.row.date }}
                                </q-td>

                                <q-td key="remarks" :props="props">
                                    <span class="text-weight-bold">{{ props.row.remarks }}</span>
                                </q-td>

                                <q-td key="action" class="text-right" :props="props">
                                    <q-btn flat round color="standard" text-color="grey-6" icon="las la-edit" size="md" padding="xs">
                                        <q-tooltip transition-show="scale" :delay="500" transition-hide="scale" content-class="bg-grey-12 text-black">File Request</q-tooltip>
                                    </q-btn>
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
        name: 'ResolutionCenter',
        data () {
            return {
                columns: [
                    { name: 'date', required: true, label: 'Date', align: 'right', field: row => row.name, format: val => `${val}`, sortable: false },
                    { name: 'remarks', label: 'Remarks', align: 'left', field: 'calories', sortable: false },
                    { name: 'action', label: ' ', field: 'fat', sortable: false },
                ],
                rows: [],
            }
        },
        mounted() {
            this.getUserResolution()
        },
        methods: {
            getUserResolution() {
                let headers = {
                    'Authorization': `Bearer ${ Cookies.get('accessToken') }`
                }

                axios.get(`${ process.env.VUE_APP_API_URL }/user/widgets/resolution-center`, { headers })
                    .then(response => {
                        console.log(response.data)
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
    .resolution-icons {
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

            color: #444444;
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

        .timestamp {
            margin-bottom: 0;

            color: #BBBBBB;
            font-size: 85%;
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
    }
</style>