import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acces-refuse',
  imports: [RouterLink],
  template: `
    <section class="carte">
      <h1>Accès réservé</h1>
      <p class="sous-titre">Votre rôle ne permet pas d'ouvrir cette page.</p>
      <div class="actions pied">
        <a routerLink="/tableau-de-bord" class="bouton principal">Retour au tableau de bord</a>
      </div>
    </section>
  `
})
export class AccesRefuseComponent {}
