import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DonneesService } from '../../core/donnees.service';
import { SERVICES } from '../../core/models';
import { aujourdhui, fcfa } from '../../core/outils';

interface Barre {
  libelle: string;
  valeur: number;
  texte: string;
  part: number;
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

@Component({
  selector: 'app-statistiques',
  imports: [FormsModule],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.css'
})
export class StatistiquesComponent {
  periode = aujourdhui().substring(0, 7);
  fcfa = fcfa;

  constructor(private donnees: DonneesService) {}

  get periodes(): { valeur: string; libelle: string }[] {
    const liste: { valeur: string; libelle: string }[] = [{ valeur: '', libelle: 'Toute la période' }];
    const d = new Date();
    for (let i = 0; i < 12; i++) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const valeur = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
      liste.push({ valeur, libelle: `${MOIS[m.getMonth()]} ${m.getFullYear()}` });
    }
    return liste;
  }

  private get dossiers() {
    return this.donnees.d.dossiers.filter((x) => !this.periode || x.dateCreation.startsWith(this.periode));
  }

  private get paiements() {
    return this.donnees.d.paiements.filter((p) => !this.periode || p.date.startsWith(this.periode));
  }

  private barres(valeurs: { libelle: string; valeur: number }[], argent: boolean): Barre[] {
    const max = Math.max(1, ...valeurs.map((v) => v.valeur));
    return valeurs.map((v) => ({
      ...v,
      texte: argent ? fcfa(v.valeur) : `${v.valeur} dossier${v.valeur > 1 ? 's' : ''}`,
      part: Math.round((v.valeur / max) * 100)
    }));
  }

  get nbDossiers(): number {
    return this.dossiers.length;
  }

  get encaisse(): number {
    return this.paiements.reduce((s, p) => s + p.montant, 0);
  }

  get restes(): number {
    return this.donnees.d.dossiers.reduce((s, x) => s + this.donnees.resteAPayer(x.id), 0);
  }

  get chiffreAffaires(): number {
    return this.dossiers.reduce((s, x) => s + x.montantTotal, 0);
  }

  get parService(): Barre[] {
    return this.barres(
      SERVICES.map((s) => ({ libelle: s, valeur: this.dossiers.filter((x) => x.service === s).length })),
      false
    );
  }

  get parDestination(): Barre[] {
    const compte = new Map<string, number>();
    for (const x of this.dossiers) {
      const cle = `${x.pays} · ${x.ville}`;
      compte.set(cle, (compte.get(cle) ?? 0) + 1);
    }
    return this.barres(
      [...compte.entries()].map(([libelle, valeur]) => ({ libelle, valeur })).sort((a, b) => b.valeur - a.valeur),
      false
    );
  }

  get encaissementsParService(): Barre[] {
    return this.barres(
      SERVICES.map((s) => ({
        libelle: s,
        valeur: this.paiements
          .filter((p) => this.donnees.dossier(p.dossierId)?.service === s)
          .reduce((t, p) => t + p.montant, 0)
      })),
      true
    );
  }

  get paiementsParMois(): Barre[] {
    const d = new Date();
    const valeurs: { libelle: string; valeur: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const cle = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
      valeurs.push({
        libelle: MOIS[m.getMonth()].substring(0, 4) + '.',
        valeur: this.donnees.d.paiements.filter((p) => p.date.startsWith(cle)).reduce((s, p) => s + p.montant, 0)
      });
    }
    return this.barres(valeurs, true);
  }
}
