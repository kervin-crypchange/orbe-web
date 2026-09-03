import { CurrencyPipe } from '@angular/common';
import { Component, computed, DOCUMENT, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SIDE_MENU_ADMIN, SIDE_MENU_ADVISOR, SIDE_MENU_USER } from '@core/constants';
import { AuthActions } from '../auth/store/auth.actions';
import { Store } from '@ngxs/store';
import { EMessage, ERole } from '@core/enums';
import { ToastService } from '@core/services';
import { form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { httpResource } from '@angular/common/http';
import { IRateExchange } from '@core/interfaces';
import { DashboardService } from '@core/services/dashboard';
import { AuthSelectors } from '../auth/store/auth.selectors';
import { Title } from '@angular/platform-browser';
import { ISideMenu } from '@core/constants/side-menu';

interface RateFormData {
  rate: number;
}
const rateFormModel = signal<RateFormData>({
  rate: 0,
});

const enum ETarget {
  USERS = 'Usuarios',
  ADVISORS = 'Asesores',
  ALL = 'Todos'
}

const INITIAL_DATA = {
  title: '',
  body: '',
  target: ETarget.ALL
};
interface FormData {
  title: string;
  body: string;
  target: ETarget
}

const formModel = signal<FormData>(INITIAL_DATA);


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLinkActive, RouterLink, FormField, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  pageTitle = inject(Title);
  isRateModalOpen = signal<boolean>(false);
  isAuthModalOpen = signal<boolean>(false);
  isFcmModalOpen = signal<boolean>(false);

  erole =  ERole;

  private readonly url = `${API_URL}/v1`;
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly service = inject(DashboardService);
  private document = inject(DOCUMENT);

  protected rate = signal<number>(0);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly rateResource = httpResource<IRateExchange>(() => `${this.url}/rate-exchange`, {
    parse: (raw: any) => {
      this.rate.set(raw[0].currentRate);
      rateFormModel.set({
        rate: this.rate(),
      })
      return raw[0];
    },
  });

  protected target = [ETarget.ALL, ETarget.USERS, ETarget.ADVISORS];
  protected formFcm = form(formModel, () => { }, {
    submission: {
      action: async (f) => console.log(f().value()),
    },
  });

  protected form = form(
    rateFormModel,
    (validator) => {
      min(validator.rate, 1, { message: 'El valor no puede ser cero' });
      required(validator.rate, { message: 'El campo es obligatorio' });
    },
  );

  protected isSidebarOpen = signal(false);
  protected isSubBarOpen = signal(false);
  protected userLogged = this.store.selectSnapshot(AuthSelectors.userLogged);

  protected menu = computed(() => {
    const menuMap: Record<string, ISideMenu[]> = {
      [ERole.Admin]: SIDE_MENU_ADMIN,
      [ERole.Advisor]: SIDE_MENU_ADVISOR,
      [ERole.User]: SIDE_MENU_USER,
    }

    return menuMap[this.userLogged?.role] || [];
  });


  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.isSidebarOpen()) {
        this.isSidebarOpen.set(false);
      }
      if (event instanceof NavigationEnd && this.isSubBarOpen()) {
        this.isSubBarOpen.set(false);
      }
    });
  }


  toggleSidebar() {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  toggleSubBar() {
    this.isSubBarOpen.update((isOpen) => !isOpen);
  }

  logout(): void {
    this.store.dispatch(new AuthActions.Logout()).subscribe(() => {
      this.toast.show(EMessage.GoodBye);
      this.router.navigate(['']);
    });
  }

  logoutModal(): void {
    this.logout();
  }

  updateRate(): void {
    this.service.updateRate(this.rateResource.value()!._id, this.form().value().rate).subscribe((res) => {
      this.rate.set(res.currentRate);
      rateFormModel.set({
        rate: this.rate(),
      });
    });
  }
}
