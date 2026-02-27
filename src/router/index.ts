import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/pages/auth/stores';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  /* 👇 AQUI entra o beforeEach */
  Router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    // rota precisa de login
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return next('/login');
    }

    // rota só para visitantes (ex: login)
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return next('/');
    }

    next();
  });

  return Router;
});
