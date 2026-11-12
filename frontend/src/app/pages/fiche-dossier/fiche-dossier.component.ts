import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Client, Dossier, ETAPES } from '../../core/models';
import { dateFr, fcfa, heureFr, joursRestants } from '../../core/outils';

@Component({
  selector: 'app-fiche-dossier',
  imports: [RouterLink],
  templateUrl: './fiche-dossier.component.html',
  styleUrl: './fiche-dossier.component.css'
})
export class FicheDossierComponent {
  @Input() id = '';
  @Input() message = '';
  etapes = ETAPES;
  fcfa = fcfa;
  dateFr = dateFr;
  heureFr = heureFr;
  joursRestants = joursRestants;

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get dossier(): Dossier | undefined {
    return this.donnees.dossier(Number(this.id));
  }

  get client(): Client | undefined {
    const x = this.dossier;
    return x ? this.donnees.client(x.clientId) : undefined;
  }

  get pourcentagePaye(): number {
    const x = this.dossier;
    if (!x || !x.montantTotal) {
      return 0;
    }
    return Math.min(100, Math.round((this.donnees.totalPaye(x.id) / x.montantTotal) * 100));
  }

  get piecesRecues(): number {
    const x = this.dossier;
    return x ? this.donnees.piecesDu(x.id).filter((p) => p.statut === 'reçue').length : 0;
  }

  changerEtape(etape: number): void {
    const x = this.dossier;
    if (x && this.session.peutCreer) {
      this.donnees.changerEtape(x.id, etape, this.session.id);
    }
  }

  basculerPiece(id: number): void {
    if (this.session.peutGererPieces) {
      this.donnees.basculerPiece(id, this.session.id);
    }
  }

  basculerEcheance(id: number): void {
    if (this.session.peutGererPieces) {
      this.donnees.basculerEcheance(id, this.session.id);
    }
  }

  aDecharge(paiementId: number): boolean {
    return !!this.donnees.dechargeDu(paiementId);
  }
}
