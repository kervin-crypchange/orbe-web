import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ITEM_PER_PAGE } from '@core/constants';
import { IAdvisor, IResponse } from '@core/interfaces';

@Component({
  selector: 'app-home-client',
  imports: [CommonModule],
  templateUrl: './home-client.html',
  styleUrl: './home-client.css',
})
export class HomeClient {
  availHeight = screen.availHeight-(screen.availHeight*0.3);
  private readonly url = `${API_URL}/v1/users/app/advisors`;
  protected limit = signal(ITEM_PER_PAGE);
  protected page = signal(1);
  protected search = signal<string>('');

  protected resource = httpResource<IResponse<IAdvisor>>(() => ({
    url: this.url,
    params: {
      limit: this.limit(),
      page: this.page(),
      search: this.search() ?? '',
    },
  }));
}
