import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  recentArticles = [
    {
      id: 1,
      title: 'Pourquoi Angular Signals change la donne',
      summary:
        'Découvre comment Angular adopte une nouvelle approche réactive avec Signals.',
    },
    {
      id: 2,
      title: 'Sécuriser ton API en 2025',
      summary:
        'Entre tokens, rate-limiting et surveillance : les essentiels à connaître.',
    },
    {
      id: 3,
      title: 'DaisyUI : le duo gagnant avec Tailwind',
      summary:
        'Créer des interfaces cohérentes et rapides sans se fatiguer sur le design.',
    },
  ];
}
