import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, DOCUMENT, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { COUNTRIES, ITEM_PER_PAGE } from '@core/constants';
import { IAdvisor, IResponse } from '@core/interfaces';
import { FileUpload } from '../file-upload/file-upload';
import { EConnectStatus, EMessage, ERole, EStatus } from '@core/enums';
import 'flyonui/flyonui';
import { ToastService, User } from '@core/services';
import { disabled, form, FormField, FormRoot, required, min, email } from '@angular/forms/signals';
import { Paginator } from '../paginator/paginator';
import { TableFilter } from '../table-filter/table-filter';

interface ICountry {
  name: string;
  code: string;
  iso: string;
}

const INITIAL_FORM_DATA: FormAdvisor = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'Venezuela',
  dob: new Date(),
  alias: '',
  dni: '',
  languages: '',
  category: '',
  description: '',
  experience: '',
  avatar: null,
  dniImage: null,
  videoIntro: null,
  chatPrice: 0,
  callPrice: 0,
  enabledCall: false,
};
interface FormAdvisor {
  _id?: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dni: string;
  dob: Date;
  languages: string;
  alias: string;
  category: string;
  description: string;
  experience: string;
  avatar: File | null;
  dniImage: File | null;
  videoIntro: File | null;
  chatPrice: number;
  callPrice: number;
  enabledCall: boolean;
}

const formModel = signal<FormAdvisor>(INITIAL_FORM_DATA);
const aliasFormModel = signal<{ id: string; alias: string }>({ id: '', alias: '' });

@Component({
  selector: 'app-advisor-list',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    FileUpload,
    FormRoot,
    FormField,
    Paginator,
    TableFilter,
  ],
  templateUrl: './advisor-list.html',
  styleUrl: './advisor-list.css',
})

export class AdvisorList {
  aliasForm = form(
    aliasFormModel,
    (v) => {
      required(v.alias, { message: 'Alias is required' });
    },
    {
      submission: {
        action: async (f) => await this.onUpdateAlias(f().value()),
      },
    },
  );

  form = form(
    formModel,
    (v) => {
      required(v.name, { message: 'Name is required' });
      required(v.lastName, { message: 'Last name is required' });
      required(v.email, { message: 'Email is required' });
      email(v.email, { message: 'Formato de email inválido' });
      required(v.phone, { message: 'Phone is required' });
      required(v.country, { message: 'Country is required' });
      required(v.dob, { message: 'Date of birth is required' });
      required(v.alias, { message: 'Alias is required' });
      required(v.dni, { message: 'DNI is required' });
      required(v.chatPrice, { message: 'Chat price is required' });
      required(v.languages, { message: 'Chat price is required' });
      min(v.chatPrice, 0.25, { message: 'Chat price must be at least 0.25' });
      v.callPrice,
        /*  required(v.callPrice, { message: 'Call price is required' }); */
        disabled(v.callPrice, ({ valueOf }) => !valueOf(v.enabledCall));
      required(v.category, { message: 'Category is required' });
      required(v.description, { message: 'Description is required' });
      required(v.experience, { message: 'Experience is required' });
      required(v.avatar, { message: 'DNI image is required' });
      required(v.dniImage, { message: 'DNI image is required' });
      required(v.videoIntro, { message: 'Video intro is required' });
    },
    {
      submission: {
        action: async (f) => {
          console.log(f().value());
          await this.createAdvisor(f().value());
        },
      },
    },
  );

  protected readonly connectStatus = EConnectStatus;
  protected countriesPhoneCodes: ICountry[] = COUNTRIES;
  protected statusEnum = EStatus;
  protected roleEnum = ERole;
  protected readonly status = [
    { val: EStatus.APPROVED, title: 'Aprobado' },
    { val: EStatus.PENDING, title: 'Pendiente de aprobación' },
    { val: EStatus.REJECT, title: 'Rechazado' },
    { val: EStatus.UNDER_REVIEW, title: 'En revisión' },
    { val: EStatus.SUSPENDED, title: 'Suspendida' },
    { val: EStatus.BANNED, title: 'Bloqueado' },
  ];

  protected user = signal<IAdvisor | null>(null);

  protected headers: string[] = [
    '#',
    'Usuario',
    'Email / Phone',
    'Status',
    'Estado',
    'Rate',
    'Registrado',
    'Últ. conexión',
    '',
  ];

  private readonly url = `${API_URL}/v1`;
  private readonly document = inject(DOCUMENT);
  private readonly service = inject(User);
  private readonly toast = inject(ToastService);

  private formData = new FormData();

  protected readonly itemsPerPage = [5, 10, 15, 20];
  protected selected = 20;

  protected limit = signal(ITEM_PER_PAGE);
  protected page = signal(1);
  protected search = signal<string>('');

  protected resource = httpResource<IResponse<IAdvisor>>(() => ({
    url: `${this.url}/users`,
    params: {
      role: ERole.Advisor,
      limit: this.limit(),
      page: this.page(),
      search: this.search(),
    },
  }));

  protected catResource = httpResource<IResponse<IAdvisor>>(() => ({
    url: `${this.url}/categories`,
    params: {
      limit: this.limit(),
    },
  }));

  onSearch(query: string): void {
    this.search.set(query);
  }

  pageChange(value: number): void {
    this.selected = value;
    this.limit.set(value);
    this.page.set(1);
  }

  goTopage(page: number): void {
    this.page.set(page);
  }

  openModal(isEdit: boolean, user: IAdvisor | null): void {
    const body: FormAdvisor = {
      name: user?.name ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      country: user?.country ?? '',
      dob: new Date(user?.dob ?? ''),
      alias: user?.advisor?.alias ?? '',
      dni: user?.advisor?.dni ?? '',
      languages: '',
      category: user?.advisor?.category ?? '',
      description: user?.advisor?.description ?? '',
      experience: user?.advisor?.experience ?? '',
      dniImage: null,
      videoIntro: null,
      avatar: null,
      chatPrice: user?.advisor?.chatPrice || 0,
      callPrice: user?.advisor?.callPrice || 0,
      enabledCall: !!user?.advisor?.enabledCall,
    };

    if (isEdit) {
      body._id = user!._id;
    }

    formModel.set(body);

  }

  closeModal(): void {
    this.form().reset(INITIAL_FORM_DATA);
  }

  uploadFile(file: File | null, type: string) {
    if (!file) return;
    formModel.set({ ...formModel(), [type]: file.name });

    this.formData.set(type, file, file.name);

  }

  private async createAdvisor(data: FormAdvisor): Promise<void> {
    console.log('Create Advisor', data);
    const {avatar,dniImage,videoIntro, ...body} = data;

    /*  const payload = {
       ...body,
       role: ERole.Advisor,
     }; 
      this.service.create(payload).subscribe(() => {
      this.toast.show(EMessage.Successful);
      this.closeModal();
      this.resource.reload();
    }); */
  }

  openNotificationModal(user: IAdvisor): void {
    const modal = new window.HSOverlay(this.document.querySelector('#notification-modal')!);
    modal.open();
  }

  closeNotificationModal(): void {
    const modal = new window.HSOverlay(this.document.querySelector('#notification-modal')!);
    modal.close();
  }

  async onUpdateAlias(data: { id: string; alias: string }): Promise<void> {
    const { id, alias } = data;
    this.service.updateAdvisor(id, { alias }).subscribe((_) => {
      window.location.reload();
    });
  }


  onChangeStatus(event: Event, id: string): void {
    const { value } = event.target as HTMLSelectElement;
    const isActive = value === EStatus.APPROVED;
    const body = { status: value as EStatus, isActive };
    this.service.updateStatus(id, body).subscribe((_) => window.location.reload());
  }

  openAliasModal(item: IAdvisor) {
    const { advisor: { _id: id, alias } } = item;

    aliasFormModel.set({ alias, id });

    const modal = new window.HSOverlay(this.document.querySelector('#alias-modal')!);
    modal.open();
  }

  closeAliasModal() {
    const modal = new window.HSOverlay(this.document.querySelector('#alias-modal')!);
    modal.close();
  }
}
