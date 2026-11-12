import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Dossier, ETAPES, Echeance, Paiement, Piece } from '../../core/models';
import { aujourdhui, dateFr, fcfa, joursRestants } from '../../core/outils';

@Component({
  selector: 'app-tableau-de-bord',
  imports: [RouterLink],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css'
})
export class TableauDeBordComponent {
  fcfa = fcfa;
  dateFr = dateFr;
  joursRestants = joursRestants;

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get bonjour(): string {
    return `Bonjour, ${this.session.utilisateur?.nom ?? ''}`;
  }

  private get moisCourant(): string {
    return aujourdhui().substring(0, 7);
  }

  get dossiersDuMois(): Dossier[] {
    return this.donnees.d.dossiers.filter((x) => x.dateCreation.startsWith(this.moisCourant));
  }

  get encaissementsDuMois(): number {
    return this.donnees.d.paiements
      .filter((p) => p.date.startsWith(this.moisCourant))
      .reduce((s, p) => s + p.montant, 0);
  }

  get restesAEncaisser(): number {
    return this.donnees.d.dossiers.reduce((s, x) => s + this.donnees.resteAPayer(x.id), 0);
  }

  get mesDossiers(): Dossier[] {
    return this.donnees.d.dossiers.filter((x) => x.agentId === this.session.id);
  }

  get quiDoitPayer(): Dossier[] {
    return this.donnees.d.dossiers
      .filter((x) => this.donnees.resteAPayer(x.id) > 0)
      .sort((a, b) => a.dateVoyage.localeCompare(b.dateVoyage))
      .slice(0, 5);
  }

  get papiersManquants(): Piece[] {
    return this.donnees.d.pieces.filter((p) => p.statut === 'manquante').slice(0, 5);
  }

  get voyagesProches(): Dossier[] {
    return this.donnees.d.dossiers
      .filter((x) => {
        const j = joursRestants(x.dateVoyage);
        return j >= 0 && j <= 30;
      })
      .sort((a, b) => a.dateVoyage.localeCompare(b.dateVoyage))
      .slice(0, 5);
  }

  get relances(): Echeance[] {
    return this.donnees.d.echeances
      .filter((e) => e.type === 'Relance' && !e.traitee)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }

  get paiementsRecents(): Paiement[] {
    return [...this.donnees.d.paiements]
      .sort((a, b) => b.dateHeureSaisie.localeCompare(a.dateHeureSaisie))
      .slice(0, 6);
  }

  get repartitionEtapes(): { libelle: string; nombre: number; part: number }[] {
    const total = this.donnees.d.dossiers.length || 1;
    return ETAPES.map((libelle, i) => {
      const nombre = this.donnees.d.dossiers.filter((x) => x.etape === i + 1).length;
      return { libelle, nombre, part: Math.round((nombre / total) * 100) };
    });
  }

  libelleDossier(id: number): string {
    const x = this.donnees.dossier(id);
    return x ? this.donnees.libelleDossier(x) : '—';
  }

  nomClientDossier(id: number): string {
    const x = this.donnees.dossier(id);
    return x ? this.donnees.nomClient(x.clientId) : '—';
  }

  delai(iso: string): string {
    const j = joursRestants(iso);
    if (j === 0) {
      return "Aujourd'hui";
    }
    if (j < 0) {
      return `En retard de ${-j} j`;
    }
    return `Dans ${j} jour${j > 1 ? 's' : ''}`;
  }
}
