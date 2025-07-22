import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent {
  article = {
    title: '',
    content: '',
    category: '',
    cover: '',
  };

  categories = [
    'Développement Web',
    'JavaScript',
    'Angular',
    'Backend',
    'UI/UX',
    'Cybersécurité',
  ];

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.article.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('Article soumis :', this.article);
    // TODO : Envoi vers l'API
  }
}
