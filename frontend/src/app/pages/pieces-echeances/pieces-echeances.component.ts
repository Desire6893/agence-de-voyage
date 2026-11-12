import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Echeance, Piece } from '../../core/models';
import { aujourdhui, dateFr, joursRestants } from '../../core/outils';

@Component({
  selector: 'app-pieces-echeances',
  imports: [FormsModule, RouterLink],
  templateUrl: './pieces-echeances.component.html'
})
export class PiecesEcheancesComponent {
  dateFr = dateFr;
  joursRestants = joursRestants;
  voirTraitees = false;
  nouvelle = { dossierId: 0, date: aujourdhui(), action: '', responsableId: 0 };
  messageRelance = '';

  constructor(public donnees: DonneesService, public session: SessionService) {
    this.nouvelle.responsableId = this.session.id;
  }

  get piecesManquantes(): Piece[] {
    return this.donnees.d.pieces
      .filter((p) => p.statut === 'manquante')
      .sort((a, b) => {
        const da = this.donnees.dossier(a.dossierId)?.dateVoyage ?? '';
        const db = this.donnees.dossier(b.dossierId)?.dateVoyage ?? '';
        return da.localeCompare(db);
      });
  }

  get datesLimites(): Echeance[] {
    return this.donnees.d.echeances
      .filter((e) => e.type !== 'Relance' && (this.voirTraitees || !e.traitee))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get relances(): Echeance[] {
    return this.donnees.d.echeances
      .filter((e) => e.type === 'Relance' && (this.voirTraitees || !e.traitee))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  get alertes(): Echeance[] {
    return this.donnees.d.echeances.filter((e) => !e.traitee && joursRestants(e.date) <= 3);
  }

  get modelesParService(): { service: string; pays: string; pieces: string[] }[] {
    const groupes = new Map<string, { service: string; pays: string; pieces: string[] }>();
    for (const m of this.donnees.d.modelesPieces) {
      const cle = `${m.service}|${m.pays}`;
      if (!groupes.has(cle)) {
        groupes.set(cle, { service: m.service, pays: m.pays === '*' ? 'Tous les pays' : m.pays, pieces: [] });
      }
      groupes.get(cle)?.pieces.push(m.nomPiece);
    }
    return [...groupes.values()];
  }

  dossierLibelle(id: number): string {
    const x = this.donnees.dossier(id);
    return x ? `${x.numero} · ${this.donnees.nomClient(x.clientId)}` : '—';
  }

  serviceDossier(id: number): string {
    const x = this.donnees.dossier(id);
    return x ? `${x.service} ${x.pays}` : '';
  }

  etat(e: Echeance): { libelle: string; classe: string } {
    if (e.traitee) {
      return { libelle: 'Effectuée', classe: 'vert' };
    }
    const j = joursRestants(e.date);
    if (j < 0) {
      return { libelle: 'En retard', classe: 'rouge' };
    }
    if (j === 0) {
      return { libelle: "Aujourd'hui", classe: 'orange' };
    }
    return { libelle: `J-${j}`, classe: j <= 3 ? 'orange' : 'gris' };
  }

  marquerRecue(id: number): void {
    this.donnees.basculerPiece(id, this.session.id);
  }

  basculer(id: number): void {
    this.donnees.basculerEcheance(id, this.session.id);
  }

  ajouterRelance(form: NgForm): void {
    if (form.invalid || !this.nouvelle.dossierId) {
      form.control.markAllAsTouched();
      return;
    }
    this.donnees.ajouterRelance(
      Number(this.nouvelle.dossierId),
      this.nouvelle.date,
      this.nouvelle.action.trim(),
      Number(this.nouvelle.responsableId),
      this.session.id
    );
    this.messageRelance = 'Relance ajoutée';
    this.nouvelle = { dossierId: 0, date: aujourdhui(), action: '', responsableId: this.session.id };
    form.resetForm(this.nouvelle);
  }

  get responsables() {
    return this.donnees.d.utilisateurs.filter((u) => u.etat === 'actif' && u.role !== 'comptable');
  }
}
