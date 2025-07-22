import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  imports: [FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
})
export class ExploreComponent {
  search = '';
  selectedCategory = '';
  currentPage = 1;
  pageSize = 6;

  articles = [
    {
      title: 'Sécuriser une API REST',
      summary:
        'Explorez les méthodes modernes de sécurisation d’API avec JWT, CORS et rate limiting.',
      category: 'Backend',
    },
    {
      title: 'Les Promesses JavaScript',
      summary:
        'Une promesse est un objet représentant l’achèvement ou l’échec éventuel d’une opération asynchrone.',
      category: 'JavaScript',
    },
    {
      title: 'Introduction à Angular Signals',
      summary:
        'Angular Signals introduit un modèle réactif plus précis que les Observables.',
      category: 'Angular',
    },
    {
      title: 'CSS Grid vs Flexbox',
      summary:
        'Deux approches puissantes de mise en page, mais avec des cas d’usage bien distincts.',
      category: 'CSS',
    },
    {
      title: 'Async/Await expliqué simplement',
      summary:
        'Simplifiez vos callbacks et gérez les erreurs plus proprement avec async/await.',
      category: 'JavaScript',
    },
    {
      title: 'Créer un design system avec Tailwind',
      summary:
        'Construire une base de composants cohérente et réutilisable pour tous vos projets.',
      category: 'Frontend',
    },
    {
      title: 'Démarrer avec NestJS',
      summary:
        'Un framework Node.js progressif construit sur Express avec une architecture modulaire.',
      category: 'Backend',
    },
    {
      title: 'Responsive design en 2025',
      summary:
        'Les écrans pliables et ultra-larges imposent de nouvelles contraintes aux devs web.',
      category: 'UX/UI',
    },
    {
      title: 'Git : les commandes essentielles',
      summary: 'Init, commit, push, pull… et quelques pièges à éviter.',
      category: 'Outils',
    },
    {
      title: 'Créer une API GraphQL',
      summary:
        'Pourquoi choisir GraphQL et comment l’intégrer à un backend Node ou Python.',
      category: 'Backend',
    },
    {
      title: 'Squelettes de chargement (skeleton UI)',
      summary:
        'Une technique moderne pour améliorer l’attente perçue sur les apps SPA.',
      category: 'UX/UI',
    },
    {
      title: 'Tests unitaires avec Jest',
      summary:
        'Comment écrire, organiser et maintenir vos tests unitaires avec Jest.',
      category: 'Testing',
    },
  ];

  get categories(): string[] {
    return [...new Set(this.articles.map((a) => a.category))];
  }

  filteredArticles() {
    return this.articles.filter((article) => {
      const searchMatch = this.search
        ? article.title.toLowerCase().includes(this.search.toLowerCase()) ||
          article.summary.toLowerCase().includes(this.search.toLowerCase())
        : true;

      const categoryMatch = this.selectedCategory
        ? article.category === this.selectedCategory
        : true;

      return searchMatch && categoryMatch;
    });
  }

  get paginatedArticles() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredArticles().slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredArticles().length / this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
