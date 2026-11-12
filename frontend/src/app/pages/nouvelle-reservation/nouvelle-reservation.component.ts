import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Dossier, EtatReservation, Reservation } from '../../core/models';
import { fcfa } from '../../core/outils';

@Component({
  selector: 'app-nouvelle-reservation',
  imports: [FormsModule, RouterLink],
  templateUrl: './nouvelle-reservation.component.html'
})
export class NouvelleReservationComponent implements OnInit {
  @Input() id = '';
  types: Reservation['type'][] = ['Billet', 'Hôtel', 'Visa', 'Circuit', 'Autre'];
  etats: EtatReservation[] = ['En attente', 'Confirmée', 'Annulée'];
  type: Reservation['type'] = 'Billet';
  fournisseur = '';
  dateDebut = '';
  dateFin = '';
  montant: number | null = null;
  etat: EtatReservation = 'En attente';
  fcfa = fcfa;

  constructor(public donnees: DonneesService, private session: SessionService, private router: Router) {}

  ngOnInit(): void {
    const x = this.dossier;
    if (x) {
      this.type = x.service;
      this.dateDebut = x.dateVoyage;
    }
  }

  get dossier(): Dossier | undefined {
    return this.donnees.dossier(Number(this.id));
  }

  get datesIncoherentes(): boolean {
    return !!this.dateDebut && !!this.dateFin && this.dateFin < this.dateDebut;
  }

  enregistrer(form: NgForm): void {
    const x = this.dossier;
    if (!x || form.invalid || this.datesIncoherentes || this.montant === null || this.montant < 0) {
      form.control.markAllAsTouched();
      return;
    }
    this.donnees.ajouterReservation(
      {
        dossierId: x.id,
        type: this.type,
        fournisseur: this.fournisseur.trim(),
        dateDebut: this.dateDebut,
        dateFin: this.dateFin || this.dateDebut,
        montant: Number(this.montant),
        etat: this.etat
      },
      this.session.id
    );
    this.router.navigate(['/dossiers', x.id], { queryParams: { message: 'Réservation ajoutée' } });
  }
}
