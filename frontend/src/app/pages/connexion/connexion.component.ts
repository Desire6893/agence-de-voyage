import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../core/session.service';
import { IconeComponent } from '../../layout/icone.component';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, IconeComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  identifiant = '';
  motDePasse = '';
  seSouvenir = false;
  voirMotDePasse = false;
  erreur = '';
  aideOubli = false;

  constructor(private session: SessionService, private router: Router) {
    if (this.session.utilisateur) {
      this.router.navigateByUrl('/tableau-de-bord');
    }
  }

  connecter(): void {
    this.erreur = '';
    if (!this.identifiant.trim() || !this.motDePasse) {
      this.erreur = 'Saisissez votre identifiant et votre mot de passe.';
      return;
    }
    const resultat = this.session.connecter(this.identifiant, this.motDePasse, this.seSouvenir);
    if (resultat === 'inconnu') {
      this.erreur = 'Identifiant ou mot de passe incorrect.';
      return;
    }
    if (resultat === 'inactif') {
      this.erreur = 'Ce compte est désactivé. Contactez la directrice.';
      return;
    }
    this.router.navigateByUrl('/tableau-de-bord');
  }
}
