import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { PAYS, SERVICES, Service } from '../../core/models';
import { aujourdhui } from '../../core/outils';

@Component({
  selector: 'app-nouveau-dossier',
  imports: [FormsModule, RouterLink],
  templateUrl: './nouveau-dossier.component.html'
})
export class NouveauDossierComponent implements OnInit {
  @Input() client = '';
  @Input() message = '';
  clientId = 0;
  service: Service = 'Visa';
  pays = 'Canada';
  ville = '';
  dateVoyage = '';
  montantTotal: number | null = null;
  agentId = 0;
  services = SERVICES;
  listePays = PAYS;
  minDate = aujourdhui();

  constructor(public donnees: DonneesService, private session: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.clientId = this.client ? Number(this.client) : 0;
    const agents = this.donnees.agents();
    this.agentId = this.session.role === 'agent' ? this.session.id : agents[0]?.id ?? 0;
  }

  get clients() {
    return [...this.donnees.d.clients].sort((a, b) => b.id - a.id);
  }

  get piecesPrevues(): string[] {
    return this.donnees.modelesPour(this.service, this.pays).map((m) => m.nomPiece);
  }

  creer(form: NgForm): void {
    if (form.invalid || !this.clientId || !this.montantTotal || this.montantTotal <= 0) {
      form.control.markAllAsTouched();
      return;
    }
    const x = this.donnees.ajouterDossier(
      {
        clientId: Number(this.clientId),
        service: this.service,
        pays: this.pays,
        ville: this.ville.trim(),
        dateVoyage: this.dateVoyage,
        montantTotal: Number(this.montantTotal),
        agentId: Number(this.agentId)
      },
      this.session.id
    );
    this.router.navigate(['/dossiers', x.id], { queryParams: { message: `Dossier n° ${x.numero} créé` } });
  }
}
