import { createApp } from 'vue'
import router from '../../router.js'
import './normalize.css'
import './style.css'
import App from './App.vue'

createApp(App).use(router).mount('#app')
