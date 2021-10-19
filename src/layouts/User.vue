<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          Amkor HRIS
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      content-class="bg-white text-grey-8"
      elevated
    >
      <q-list padding>
        <q-item clickable v-ripple>
          <q-item-section avatar class="q-pa-none">
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          expand-separator
          icon="card_giftcard"
          label="Compensation & Benefits"
        >
          <q-item clickable v-ripple :inset-level="1">
            <q-item-section>
              <q-item-label>iLAP</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :inset-level="1">
            <q-item-section>
              <q-item-label>Tulong Aral</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple>
          <q-item-section avatar class="q-pa-none">
            <q-icon name="account_balance" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Payroll</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item clickable v-ripple>
          <q-item-section avatar class="q-pa-none">
            <q-icon name="hail" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Recruitment</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <slot></slot>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'UserLayout',

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>