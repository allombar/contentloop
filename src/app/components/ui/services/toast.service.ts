import { Injectable, Signal, signal } from '@angular/core';
import { Toast } from '../models/toast.model';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private limit = 1;

  /**
   * Génère un UUID v4 compatible avec tous les navigateurs.
   *
   * Note: Utilise Math.random() au lieu de crypto.randomUUID() car ce dernier
   * ne fonctionne pas sur certains navigateurs mobiles (bug découvert lors
   * d'un débogage USB sur la console Chrome).
   *
   * @returns {string} UUID v4 au format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Affiche un nouveau toast à l'utilisateur.
   *
   * Utilise Omit<Toast, 'id'> pour créer un nouveau type en retirant la propriété 'id'.
   * L'id est généré automatiquement par le service, l'utilisateur n'a qu'à fournir
   * le contenu du toast (title, type, description), pas l'identifiant.
   *
   * Le nouveau toast est ajouté en tête de liste et la liste est limitée selon
   * la propriété 'limit' pour éviter l'accumulation de toasts.
   *
   * @param toast - Objet toast sans l'id (généré automatiquement)
   * @param toast.title - Titre du toast
   * @param toast.type - Type du toast (success, error, warning, info)
   * @param toast.description - Tableau de messages à afficher
   */
  show(toast: Omit<Toast, 'id'> & { description: string[] }): void {
    const id = this.generateUUID();

    const newToast = {
      ...toast,
      id,
      description: toast.description,
    };

    this.toasts.set([newToast, ...this.toasts()].slice(0, this.limit));
  }

  dismiss(id: string): void {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
  }

  getToasts(): Signal<Toast[]> {
    return this.toasts.asReadonly();
  }
}
