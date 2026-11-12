import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Dossier, ETAPES, SERVICES } from '../../core/models';
import { dateFr, fcfa } from '../../core/outils';

@Component({
  selector: 'app-dossiers',
  imports: [FormsModule, RouterLink],
  templateUrl: './dossiers.component.html'
})
export class DossiersComponent {
  @Input() set client(valeur: string | undefined) {
    this.clientId = valeur ? Number(valeur) : 0;
  }
  clientId = 0;
  recherche = '';
  service = '';
  etape = 0;
  mesDossiers = false;
  services = SERVICES;
  etapes = ETAPES;
  fcfa = fcfa;
  dateFr = dateFr;

  constructor(public donnees: DonneesService, public session: SessionService) {}

  get filtres(): Dossier[] {
    const r = this.recherche.trim().toLowerCase();
    return [...this.donnees.d.dossiers]
      .sort((a, b) => b.numero.localeCompare(a.numero))
      .filter((x) => {
        if (this.clientId && x.clientId !== this.clientId) {
          return false;
        }
        if (this.mesDossiers && x.agentId !== this.session.id) {
          return false;
        }
        if (this.service && x.service !== this.service) {
          return false;
        }
        if (this.etape && x.etape !== Number(this.etape)) {
          return false;
        }
        const c = this.donnees.client(x.clientId);
        const texte = `${x.numero} ${x.pays} ${x.ville} ${c?.nom} ${c?.prenom} ${c?.telephone}`.toLowerCase();
        return !r || texte.includes(r);
      });
  }

  get nomClientFiltre(): string {
    return this.clientId ? this.donnees.nomClient(this.clientId) : '';
  }
}
