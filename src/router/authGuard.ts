/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from 'src/pages/auth/stores';

const authGuard = async (to: any, from: any, next: any) => {
  const auth = useAuthStore();

  // ✅ Define título da página
  document.title = to.meta.title
    ? `${to.meta.title} - Xitique`
    : 'Xitique';

  // ✅ Se página é só para convidados (login, register etc)
  if (to.meta.guestOnly) {
    if (auth.isAuthenticated) {
      return next({ name: 'home' });
    }
    return next();
  }

  // ✅ Se rota precisa autenticação
  if (!auth.isAuthenticated) {
    try {
      await auth.ActionCheckToken();
      return next();
    } catch (error) {
      return next({ name: 'login' });
    }
  }

  next();
};

export default authGuard;
