<template>
    <q-page padding :class="$route.name" class="q-pa-lg">
        <div class="row reverse">
            <div class="col-xs-12 col-sm-8 col-md-6 col-xl-4 q-px-md inoutclockCol">
                <time-clock></time-clock>
            </div>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: 'Dashboard',
        components: {
            TimeClock: () => import('../components/Dashboard/TimeClock')
        }
    }
</script>

<style lang="scss">
    @media screen and (max-width: 480px) {
        .Dashboard {
            padding: 24px 0;
        }

        .inoutclockCol {
            padding: 0 12px;
        }
    }
</style>
