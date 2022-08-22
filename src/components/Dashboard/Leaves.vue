<template>
    <div class="row q-col-gutter-md q-mr-md">
        <div class="col">
            <q-card class="bg-white text-black q-pa-md leaves-panels">
                <div class="row">
                    <div class="col q-mb-xl">
                        <div class="leave-icon bg-blue-8">
                            <q-icon class="text-blue-2" name="las la-glass-cheers" />
                        </div>
                    </div>

                    <div class="col leave-type">
                        <span>Vacation<br />Leaves</span>
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col q-mt-xl">
                        <h3 class="text-weight-medium">{{ this.leaves.vl }}</h3>
                        <span class="text-grey-6 text-uppercase q-ml-sm leave-label">avl</span>
                    </div>

                    <div class="col self-end q-mt-sm">
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">used</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">year</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">month</span>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>

        <div class="col">
            <q-card class="bg-white text-black q-pa-md leaves-panels">
                <div class="row">
                    <div class="col q-mb-xl">
                        <div class="leave-icon bg-orange-8">
                            <q-icon class="text-orange-2" name="las la-hospital" />
                        </div>
                    </div>

                    <div class="col leave-type">
                        <span>Sick<br />Leaves</span>
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col q-mt-xl">
                        <h3 class="text-weight-medium">{{ this.leaves.sl }}</h3>
                        <span class="text-grey-6 text-uppercase q-ml-sm leave-label">avl</span>
                    </div>

                    <div class="col self-end q-mt-sm">
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">used</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">year</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">month</span>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>

        <div class="col">
            <q-card class="bg-white text-black q-pa-md leaves-panels">
                <div class="row">
                    <div class="col q-mb-xl">
                        <div class="leave-icon bg-red-8">
                            <q-icon class="text-red-2" name="las la-ambulance" />
                        </div>
                    </div>

                    <div class="col leave-type">
                        <span>Emergency<br />Leaves</span>
                    </div>
                </div>

                <div class="row q-mt-xl">
                    <div class="col q-mt-xl">
                        <h3 class="text-weight-medium">{{ this.leaves.el }}</h3>
                        <span class="text-grey-6 text-uppercase q-ml-sm leave-label">avl</span>
                    </div>

                    <div class="col self-end q-mt-sm">
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">used</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">year</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col" align="right">
                                <span class="text-weight-medium">0</span>
                                <span class="text-grey-6 text-uppercase q-ml-xs leave-label">month</span>
                            </div>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'

    export default {
        name: 'Leaves',
        data() {
            return {
                leaves: [],
            }
        },
        mounted() {
            this.leaves = JSON.parse(Cookies.get('leaves'))
        }
    }
</script>

<style lang="scss">
    .leaves-panels {
        max-height: 245px;
        padding: 2rem;

        border-radius: 2rem;
        box-shadow: 0px 20px 20px -5px rgba(0, 0, 0, 0.2);
        font-size: 1rem;

        .leave-icon {
            float: left;
            width: 70px;
            height: 70px;
            padding: 0.75rem;
            position: absolute;
            margin-top: -10px;
            margin-left: -10px;
            border-radius: 1rem;

            box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.5);

            i {
                font-size: 3rem;
            }
        }

        .leave-type {
            color: #555555;
            font-weight: 500;
            text-align: right;
            text-transform: uppercase;
        }

        h3 {
            display: inline;
        }

        .leave-label {
            font-size: 80%;
        }

        .timestamp {
            margin-bottom: 0;

            font-size: 85%;
        }
    }
</style>