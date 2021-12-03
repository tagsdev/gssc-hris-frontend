import Vue from 'vue'

import './styles/quasar.scss'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar, Notify, Dialog } from 'quasar'

Vue.use(Quasar, {
    plugins: {
        Notify,
        Dialog
    },
    config: {
        notify: {
            closeBtn: true,
            timeout: 5000,
            position: 'bottom-right',
        }
    },
})