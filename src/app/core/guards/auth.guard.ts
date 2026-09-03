import { inject, Signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToastService } from '@core/services';
import { AuthSelectors } from '../../pages/auth/store/auth.selectors';
import { EMessage, ERoutes } from '@core/enums';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const allowedRoles = route.data['roles'] as string[];
  const userRole = store.selectSnapshot(AuthSelectors.userRole);
  // const user = store.selectSnapshot(AuthSelectors.userLogged);

  const isAuth: Signal<boolean> = store.selectSignal(AuthSelectors.isAuthenticated);

  
  if (!isAuth()) {
    router.navigate([ERoutes.Landing]);
    return false;
  }

  if (!allowedRoles.includes(userRole)) {
    toastService.show(EMessage.UnAuthorized, 'error');
    return false;
  }

  return true;
};