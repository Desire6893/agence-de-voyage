import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DonneesService } from '../../core/donnees.service';
import { DechargeVisa, Dossier, Paiement } from '../../core/models';
import { dateFr, fcfa, montantEnLettres } from '../../core/outils';
import { VAGUES } from '../recu/vagues';

@Component({
  selector: 'app-decharge',
  imports: [RouterLink],
  templateUrl: './decharge.component.html'
})
export class DechargeComponent {
  @Input() id = '';
  copies = [1, 2];
  fcfa = fcfa;
  dateFr = dateFr;
  montantEnLettres = montantEnLettres;
  vagues: SafeHtml;

  constructor(public donnees: DonneesService, sanitizer: DomSanitizer) {
    this.vagues = sanitizer.bypassSecurityTrustHtml(VAGUES);
  }

  get paiement(): Paiement | undefined {
    return this.donnees.paiement(Number(this.id));
  }

  get decharge(): DechargeVisa | undefined {
    const p = this.paiement;
    return p ? this.donnees.dechargeDu(p.id) : undefined;
  }

  get dossier(): Dossier | undefined {
    const p = this.paiement;
    return p ? this.donnees.dossier(p.dossierId) : undefined;
  }

  get resteApres(): number {
    const p = this.paiement;
    const x = this.dossier;
    if (!p || !x) {
      return 0;
    }
    const paye = this.donnees.d.paiements
      .filter((q) => q.dossierId === x.id && q.id <= p.id)
      .reduce((s, q) => s + q.montant, 0);
    return Math.max(0, x.montantTotal - paye);
  }

  imprimer(): void {
    window.print();
  }
}
