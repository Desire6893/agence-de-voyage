import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { LIBELLES_ROLES, Role } from '../../core/models';

@Component({
  selector: 'app-nouveau-compte',
  imports: [FormsModule, RouterLink],
  templateUrl: './nouveau-compte.component.html'
})
export class NouveauCompteComponent {
  nom = '';
  identifiant = '';
  motDePasse = '';
  role: Role = 'agent';
  roles: Role[] = ['directrice', 'agent', 'comptable'];
  libelles = LIBELLES_ROLES;
  erreur = '';

  constructor(private donnees: DonneesService, private router: Router) {}

  enregistrer(form: NgForm): void {
    this.erreur = '';
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (!this.donnees.identifiantLibre(this.identifiant.trim())) {
      this.erreur = 'Cet identifiant est déjà utilisé.';
      return;
    }
    const u = this.donnees.ajouterUtilisateur({
      nom: this.nom.trim(),
      identifiant: this.identifiant.trim(),
      motDePasse: this.motDePasse,
      role: this.role
    });
    this.router.navigate(['/utilisateurs'], { queryParams: { message: `Compte créé pour ${u.nom}` } });
  }
}
