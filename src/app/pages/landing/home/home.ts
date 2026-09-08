import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { IAdvisor } from '@core/interfaces';
import { AnswerPath, Discover, DownloadApp, Header, Wallet, WhatsIs } from '@core/landing/sections';

interface Steps {
  icon: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-home',
  imports: [Header, WhatsIs, AnswerPath, DownloadApp, Discover, Wallet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly url = `${API_URL}/v1/`;
  protected readonly top = httpResource<IAdvisor[]>(
    () => `${this.url}dashboard/top-rated-advisors`,
  );

  protected readonly steps: Steps[] = [
    {
      icon: 'verified',
      title: 'Regístrate',
      description: 'Descarga la app y registrate con nosotros de forma fácil y rápido.',
    },
    {
      icon: 'globe_book',
      title: 'Búsca',
      description: 'Busca entre nuestros asesores quien más se acerque a tus necesidades.',
    },
    {
      icon: 'conversation',
      title: 'Consulta',
      description: 'Solicita tus consultas por chat o por llamada, lo que más prefieras.',
    },
  ];
}
