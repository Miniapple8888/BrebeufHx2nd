import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
import Home from '../views/Home.vue';

Vue.use(VueHead);
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/profile/:user',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
  },
  {
    path: '/verify/:token',
    name: 'Verify',
    component: () => import('../views/Verify.vue'),
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/Forgot.vue'),
  },
  {
    path: '/reset/:token',
    name: 'Reset',
    component: () => import('../views/Reset.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
