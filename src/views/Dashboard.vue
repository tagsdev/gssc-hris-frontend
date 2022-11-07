<template>
    <q-page padding :class="$route.name" class="q-pa-lg bg-grey-4">
        <div class="row justify-evenly">
            <!-- <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-xs-12 q-mb-lg"> -->
            <div class="col q-mb-lg">
                <leaves></leaves>
            <!-- </div> -->

            <!-- <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12 q-mb-lg"> -->
                <!-- <time-clock></time-clock> -->
            </div>
        </div>

        <div class="row justify-evenly">
            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 q-mb-lg">
                <resolution-center></resolution-center>
            </div>

            <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 q-mb-lg">
                <team-leave-tracker></team-leave-tracker>
            </div>
        </div>

        <div class="row justify-evenly">
            <div class="col-12 q-mb-xl">
                <filed-requests></filed-requests>
            </div>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: 'Dashboard',
        components: {
            // TimeClock: () => import('../components/Dashboard/TimeClock'),
            Leaves: () => import('../components/Dashboard/Leaves'),
            ResolutionCenter: () => import('../components/Dashboard/ResolutionCenter'),
            TeamLeaveTracker: () => import('../components/Dashboard/TeamLeaveTracker'),
            FiledRequests: () => import('../components/Dashboard/FiledRequests'),
        }
    }
</script>