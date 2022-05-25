import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login'),
    },
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/Dashboard'),
        meta: { auth: true }
    },
    {
        path: '/attendance/raw',
        name: 'Raw',
        component: () => import('../views/Attendance'),
        meta: { auth: true }
    },
    {
        path: '/attendance/processed',
        name: 'Processed',
        component: () => import('../views/Attendance-Processed'),
        meta: { auth: true }
    },
    {
        path: '/report-generator',
        name: 'Report-Generator',
        component: () => import('../views/Report-Generator'),
        meta: { auth: true }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

import Cookies from 'js-cookie'

router.beforeEach((to, from, next) => {
    const allowedRoutes = ['/login']
    const accessToken = Cookies.get('accessToken')

    if((accessToken) && (accessToken != "undefined")) {
        if(allowedRoutes.includes(to.path)) {
            next('/')
        } else {
            next()
        }
    } else {
        if(allowedRoutes.includes(to.path)) {
            next()
        } else {
            next('/login')
        }
    }
})

export default router
