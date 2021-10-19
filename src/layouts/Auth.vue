<template>
  <q-layout>
    <q-page-container :style="{ 'background-color': '#ecf3ff' }">
      <q-page padding class="full-height column wrap justify-center items-center q-pa-xl auth">
        <div class="col-6 text-center">
          <img :src="require('../assets/images/amkor_logo.png')" alt="Amkor Logo" class="logo" />
        </div>
        <slot></slot>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.auth {
  font-family: 'Rajdhani', sans-serif;

  .logo {
    height: 80px;
    width: 220px;
    margin-bottom: 74px;
  }
}

@media screen and (max-width: 481px) {
  .auth {
    padding: 16px;
  }
}

@media screen and (max-width: 600px) {
  .auth {
    .logo {
      height: 55px;
      width: 150px;
    }
  }
}
</style>