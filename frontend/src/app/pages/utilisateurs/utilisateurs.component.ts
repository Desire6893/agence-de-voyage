import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { LIBELLES_ROLES, Utilisateur } from '../../core/models';

@Component({
  selector: 'app-utilisateurs',
  imports: [RouterLink],
  templateUrl: './utilisateurs.component.html'
})
export class UtilisateursComponent {
  @Input() message = '';
  roles = LIBELLES_ROLES;
  info = '';

  droits = [
    { fonction: 'Consulter les clients et les dossiers', d: 'Oui', a: 'Oui', c: 'Consultation' },
    { fonction: 'Créer des clients, des dossiers et des réservations', d: 'Oui', a: 'Oui', c: 'Non' },
    { fonction: 'Pièces, échéances et relances', d: 'Oui', a: 'Oui', c: 'Non' },
    { fonction: 'Enregistrer des paiements', d: 'Tous', a: 'Acomptes', c: 'Tous' },
    { fonction: 'Reçus et décharges de visa', d: 'Oui', a: 'Reçus', c: 'Oui' },
    { fonction: 'Statistiques', d: 'Oui', a: 'Non', c: 'Non' },
    { fonction: 'Gérer les comptes', d: 'Oui', a: 'Non', c: 'Non' }
  ];

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get utilisateurs(): Utilisateur[] {
    return this.donnees.d.utilisateurs;
  }

  basculer(u: Utilisateur): void {
    if (u.id === this.session.id) {
      return;
    }
    this.donnees.basculerEtatUtilisateur(u.id);
    this.message = '';
    this.info = `Compte de ${u.nom} ${u.etat === 'actif' ? 'activé' : 'désactivé'}.`;
  }

  reinitialiser(u: Utilisateur): void {
    this.donnees.changerMotDePasse(u.id, 'adjoba2026');
    this.message = '';
    this.info = `Mot de passe de ${u.nom} réinitialisé : adjoba2026 (à changer à la première connexion).`;
  }
}
