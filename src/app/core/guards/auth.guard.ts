import { inject, Signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToastService } from '@core/services';
import { AuthSelectors } from '../../pages/auth/store/auth.selectors';
import { EMessage, ERole, ERoutes } from '@core/enums';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const isAuth: Signal<boolean> = store.selectSignal(
    AuthSelectors.isAuthenticated
  );

  const user = store.selectSnapshot(AuthSelectors.userLogged);

  //if ( isAuth() && user?.role === ERole.Admin ) return true;

  if (isAuth() && user?.isActive) return true;

  toastService.show(EMessage.UnAuthorized, 'error');

  router.navigate([ERoutes.Landing]);
  return false;
};