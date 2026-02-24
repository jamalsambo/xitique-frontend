/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from 'src/pages/auth/stores';

const authGuard = async (to: any, from: any, next: any) => {
  const auth = useAuthStore();

  const pageTitle = to.meta.title ? `${to.meta.title} - Xitique` : 'Xitique';
  document.title = pageTitle;

  if (to.name !== 'login' && !auth.isAuthenticated) {
    try {
      await auth.ActionCheckToken();
      next({ path: to.path });
    } catch (err) {
      next({ name: 'login' });
    }
  } else {
    if (to.name === 'login' && auth.isAuthenticated) {
      next({ name: 'home' });
    } else {
      next();
    }
  }
};


export default authGuard;
