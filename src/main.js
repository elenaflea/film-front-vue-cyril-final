import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'

import { createVuetify } from 'vuetify'
//import 'vuetify/styles'
import * as components from 'vuetify/components'
const vuetify = createVuetify({
  components
})

const app = createApp(App)

app.use(router).use(vuetify).use(PrimeVue)

app.mount('#app')
