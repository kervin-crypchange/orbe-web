import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, effect, signal } from '@angular/core';
import { debounce, form, FormField, FormRoot } from '@angular/forms/signals';
import { ITEM_PER_PAGE } from '@core/constants';
import { IAdvisor, IResponse } from '@core/interfaces';
interface SearchData {
  query: string;
}
const searchModel = signal<SearchData>({
  query: '',
});
@Component({
  selector: 'app-home-client',
  imports: [CommonModule, FormRoot, FormField],
  templateUrl: './home-client.html',
  styleUrl: './home-client.css',
})
export class HomeClient {
  availHeight = screen.availHeight - (screen.availHeight * 0.3);
  private readonly url = `${API_URL}/v1/users/app/advisors`;
  protected limit = signal(ITEM_PER_PAGE);
  protected page = signal(1);
  protected search = signal<string>('');
  protected asesor = signal<IAdvisor | null>(null);
  protected readonly wompiPublicKey = WOMPI_PUBLIC_KEY;
  protected readonly wompiIntegrity = WOMPI_INTEGRITY;
  protected readonly paymentAmount = signal(5000);
  protected readonly paymentReference = signal(`ORBE-${Date.now()}`);
  protected readonly paymentSignature = signal('');
  protected readonly paymentRedirectUrl = `${window.location.origin}/dashboard/home`;

  protected resource = httpResource<IResponse<IAdvisor>>(() => ({
    url: this.url,
    params: {
      limit: this.limit(),
      page: this.page(),
      search: this.search() ?? '',
    },
  }));

  protected readonly searchForm = form(searchModel, (schemaPath) => {
    debounce(schemaPath.query, 500);
  });

  constructor() {
    effect(() => {
      const currentQuery = this.searchForm().value().query;
      this.search.set(currentQuery);
    });

    effect(() => {
      const amountInCents = this.paymentAmount() * 100;
      this.createPaymentSignature(amountInCents, this.paymentReference());
    });
  }

  protected updatePaymentAmount(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.paymentAmount.set(Number.isFinite(value) && value >= 5000 ? Math.floor(value) : 5000);
  }

  private async createPaymentSignature(amountInCents: number, reference: string): Promise<void> {
    const data = new TextEncoder().encode(`${reference}${amountInCents}COP${WOMPI_INTEGRITY}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    this.paymentSignature.set(hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join(''));
  }
  
}
