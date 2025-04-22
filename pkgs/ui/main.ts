import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import { useAppStore } from './stores/app'

// Create an instance of our Vue app
const app = createApp(App)

// Add the store
app.use(createPinia())
app.use(router)

// A global error handler
app.config.errorHandler = (err, instance, info) => {
    const store = useAppStore()
    store.errorText = err instanceof Error ? err.message : 'Unknown error'
    console.error('GLOBAL ERROR HANDLER!   ', err, instance, info)
}

// Mount it
app.mount('#app')
