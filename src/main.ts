
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
// Plugins
import { registerPlugins } from '@/plugins'
const app = createApp(App)
registerPlugins(app)
app.mount('#app')
