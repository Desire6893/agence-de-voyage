import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.component.html'
})
export class ProfilComponent {
  actuel = '';
  nouveau = '';
  confirmation = '';
  message = '';
  erreur = '';

  constructor(public session: SessionService, private donnees: DonneesService, private router: Router) {}

  changer(form: NgForm): void {
    this.message = '';
    this.erreur = '';
    const u = this.session.utilisateur;
    if (!u || form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (u.motDePasse !== this.actuel) {
      this.erreur = 'Le mot de passe actuel est incorrect.';
      return;
    }
    if (this.nouveau !== this.confirmation) {
      this.erreur = 'Les deux nouveaux mots de passe ne sont pas identiques.';
      return;
    }
    this.donnees.changerMotDePasse(u.id, this.nouveau);
    this.message = 'Mot de passe modifié.';
    form.resetForm();
  }

  deconnecter(): void {
    this.session.deconnecter();
    this.router.navigateByUrl('/connexion');
  }
}
