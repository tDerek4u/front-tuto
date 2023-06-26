import { createRouter, createWebHistory } from 'vue-router'
import Login_ from '../views/Login_.vue'
import Register_ from "../views/Register_.vue"
import HomePage from "../views/HomePage.vue"



const routes = [
  {
    path: '/',
    name: 'login_',
    component: Login_,
  },
  {
    path: '/register',
    name: 'register_',
    component: Register_,
  },
  {
    path: '/home',
    name: 'home_',
    component: HomePage,
    
  },
 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router