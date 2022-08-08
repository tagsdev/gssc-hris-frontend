<template>
    <q-layout>
        <q-page-container :style="{ 'background-color': '#e0e0e0' }">
            <q-page padding class="full-height column wrap justify-center items-center q-pa-xl auth">
                <div class="col-6 text-center">
                    <!-- <img :src="require('../assets/images/amkor_logo.png')" alt="Amkor Logo" class="logo" /> -->
                    <img :src="require('../assets/images/main.png')" alt="Amkor Logo" class="logo" />
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
            width: 250px;
            margin-top: -5rem;
            margin-bottom: 0px;
        }
    }

    @media screen and (max-width: 481px) {
        .auth {
            padding: 16px;
        }
    }
</style>