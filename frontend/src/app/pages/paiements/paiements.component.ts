import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { MOYENS, Paiement } from '../../core/models';
import { dateFr, fcfa } from '../../core/outils';

@Component({
  selector: 'app-paiements',
  imports: [FormsModule, RouterLink],
  templateUrl: './paiements.component.html'
})
export class PaiementsComponent {
  recherche = '';
  moyen = '';
  type = '';
  moyens = MOYENS;
  fcfa = fcfa;
  dateFr = dateFr;

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get filtres(): Paiement[] {
    const r = this.recherche.trim().toLowerCase();
    return [...this.donnees.d.paiements]
      .sort((a, b) => b.dateHeureSaisie.localeCompare(a.dateHeureSaisie))
      .filter((p) => {
        if (this.moyen && p.moyen !== this.moyen) {
          return false;
        }
        if (this.type && p.type !== this.type) {
          return false;
        }
        const x = this.donnees.dossier(p.dossierId);
        const texte = `${p.numeroRecu} ${x?.numero} ${x ? this.donnees.nomClient(x.clientId) : ''}`.toLowerCase();
        return !r || texte.includes(r);
      });
  }

  get total(): number {
    return this.filtres.reduce((s, p) => s + p.montant, 0);
  }

  libelle(dossierId: number): string {
    const x = this.donnees.dossier(dossierId);
    return x ? `${x.numero} · ${this.donnees.nomClient(x.clientId)}` : '—';
  }
}
