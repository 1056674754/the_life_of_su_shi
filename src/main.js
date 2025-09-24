import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'

const app = createApp(App)

app.mount('#app')

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden')
  }, 1000)
})