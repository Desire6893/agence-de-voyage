import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Client, SERVICES } from '../../core/models';
import { fcfa } from '../../core/outils';

const PAR_PAGE = 8;

@Component({
  selector: 'app-clients',
  imports: [FormsModule, RouterLink],
  templateUrl: './clients.component.html'
})
export class ClientsComponent {
  @Input() message = '';
  recherche = '';
  service = '';
  statut = '';
  page = 1;
  services = SERVICES;
  fcfa = fcfa;

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get filtres(): Client[] {
    const r = this.recherche.trim().toLowerCase();
    return [...this.donnees.d.clients]
      .sort((a, b) => b.id - a.id)
      .filter((c) => {
        const dossiers = this.donnees.dossiersDuClient(c.id);
        const texte = `${c.nom} ${c.prenom} ${c.telephone} ${dossiers.map((x) => x.numero).join(' ')}`.toLowerCase();
        if (r && !texte.includes(r) && !texte.replace(/\s/g, '').includes(r.replace(/\s/g, ''))) {
          return false;
        }
        if (this.service && !dossiers.some((x) => x.service === this.service)) {
          return false;
        }
        const reste = this.donnees.resteClient(c.id);
        if (this.statut === 'apayer' && reste <= 0) {
          return false;
        }
        if (this.statut === 'solde' && (reste > 0 || !dossiers.length)) {
          return false;
        }
        return true;
      });
  }

  get pages(): number {
    return Math.max(1, Math.ceil(this.filtres.length / PAR_PAGE));
  }

  get affiches(): Client[] {
    const p = Math.min(this.page, this.pages);
    return this.filtres.slice((p - 1) * PAR_PAGE, p * PAR_PAGE);
  }

  get debut(): number {
    return this.filtres.length ? (Math.min(this.page, this.pages) - 1) * PAR_PAGE + 1 : 0;
  }

  get fin(): number {
    return Math.min(this.debut + PAR_PAGE - 1, this.filtres.length);
  }

  changerFiltre(): void {
    this.page = 1;
  }
}
