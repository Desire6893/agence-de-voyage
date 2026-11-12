import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DonneesService } from '../../core/donnees.service';
import { Client, Dossier, Paiement } from '../../core/models';
import { dateFr, fcfa, heureFr, montantEnLettres } from '../../core/outils';
import { VAGUES } from './vagues';

@Component({
  selector: 'app-recu',
  imports: [RouterLink],
  templateUrl: './recu.component.html'
})
export class RecuComponent {
  @Input() id = '';
  @Input() message = '';
  copies = [1, 2];
  fcfa = fcfa;
  dateFr = dateFr;
  heureFr = heureFr;
  montantEnLettres = montantEnLettres;
  vagues: SafeHtml;

  constructor(public donnees: DonneesService, sanitizer: DomSanitizer) {
    this.vagues = sanitizer.bypassSecurityTrustHtml(VAGUES);
  }

  get paiement(): Paiement | undefined {
    return this.donnees.paiement(Number(this.id));
  }

  get dossier(): Dossier | undefined {
    const p = this.paiement;
    return p ? this.donnees.dossier(p.dossierId) : undefined;
  }

  get client(): Client | undefined {
    const x = this.dossier;
    return x ? this.donnees.client(x.clientId) : undefined;
  }

  get resteApres(): number {
    const p = this.paiement;
    const x = this.dossier;
    if (!p || !x) {
      return 0;
    }
    const paye = this.donnees.d.paiements
      .filter((q) => q.dossierId === x.id && q.dateHeureSaisie <= p.dateHeureSaisie && q.id <= p.id)
      .reduce((s, q) => s + q.montant, 0);
    return Math.max(0, x.montantTotal - paye);
  }

  get aDecharge(): boolean {
    const p = this.paiement;
    return !!p && !!this.donnees.dechargeDu(p.id);
  }

  imprimer(): void {
    window.print();
  }
}
