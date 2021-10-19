<template>
  <q-page padding :class="$route.name">
    <div class="row reverse">
      <div class="col-xs-12 col-sm-6 q-px-md">
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
