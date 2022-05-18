<template>
    <q-page padding :class="$route.name" class="q-pa-lg bg-grey-4">
        <div class="row justify-evenly">
            <div class="col-xs-12 col-md-8 q-mb-xl">
                <leaves></leaves>
            </div>

            <div class="col-xs-12 col-md-4 q-mb-xl">
                <time-clock></time-clock>
            </div>

            <div class="col-xs-12 col-md-6 q-mb-xl">
                <resolution-center></resolution-center>
            </div>

            <div class="col-xs-12 col-md-6 q-mb-xl">
                <team-leave-tracker></team-leave-tracker>
            </div>

            <div class="col-xs-12 q-mb-xl">
                <filed-requests></filed-requests>
            </div>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: 'Dashboard',
        components: {
            TimeClock: () => import('../components/Dashboard/TimeClock'),
            Leaves: () => import('../components/Dashboard/Leaves'),
            ResolutionCenter: () => import('../components/Dashboard/ResolutionCenter'),
            TeamLeaveTracker: () => import('../components/Dashboard/TeamLeaveTracker'),
            FiledRequests: () => import('../components/Dashboard/FiledRequests'),
        }
    }
</script>