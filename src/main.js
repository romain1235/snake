import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//Router
import { createMemoryHistory, createRouter } from 'vue-router'
import Accueil from './components/Accueil.vue'
import Snake from './components/games/Snake.vue'
import Platformer from './components/games/platformer.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';


const routes = [
  { path: '/', component: Accueil },
  { path: '/snake', component: Snake },
  { path: '/platformer', component: Platformer },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


const app = createApp(App)
app.use(Antd)
app.use(router)
app.mount('#app')

