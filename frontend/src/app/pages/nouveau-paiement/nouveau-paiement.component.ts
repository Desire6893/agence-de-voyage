import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { SessionService } from '../../core/session.service';
import { Dossier, MOYENS, MoyenPaiement, TypeVersement } from '../../core/models';
import { aujourdhui, fcfa, montantEnLettres } from '../../core/outils';

@Component({
  selector: 'app-nouveau-paiement',
  imports: [FormsModule, RouterLink],
  templateUrl: './nouveau-paiement.component.html',
  styleUrl: './nouveau-paiement.component.css'
})
export class NouveauPaiementComponent implements OnInit {
  @Input() id = '';
  dossierId = 0;
  montant: number | null = null;
  date = aujourdhui();
  moyen: MoyenPaiement = 'Espèces';
  type: TypeVersement = 'Acompte';
  moyens = MOYENS;
  confirmation = false;
  fcfa = fcfa;
  montantEnLettres = montantEnLettres;

  constructor(public donnees: DonneesService, public session: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.dossierId = this.id ? Number(this.id) : 0;
    this.choisirTypeParDefaut();
  }

  get types(): TypeVersement[] {
    return this.session.typesAutorises;
  }

  get dossiers(): Dossier[] {
    return [...this.donnees.d.dossiers].sort(
      (a, b) => this.donnees.resteAPayer(b.id) - this.donnees.resteAPayer(a.id) || b.numero.localeCompare(a.numero)
    );
  }

  get dossier(): Dossier | undefined {
    return this.donnees.dossier(Number(this.dossierId));
  }

  get reste(): number {
    return this.dossier ? this.donnees.resteAPayer(this.dossier.id) : 0;
  }

  get resteApres(): number {
    return Math.max(0, this.reste - (Number(this.montant) || 0));
  }

  get enTrop(): number {
    return Math.max(0, (Number(this.montant) || 0) - this.reste);
  }

  get acompteFaible(): boolean {
    const x = this.dossier;
    return !!x && this.type === 'Acompte' && !!this.montant && Number(this.montant) < x.montantTotal / 2;
  }

  get avertissements(): string[] {
    const liste: string[] = [];
    const x = this.dossier;
    if (!x || !this.montant) {
      return liste;
    }
    if (this.acompteFaible) {
      liste.push(`L'acompte est inférieur à 50 % du montant total (${fcfa(x.montantTotal / 2)}).`);
    }
    if (this.enTrop > 0) {
      liste.push(`Le montant dépasse le reste à payer. Montant payé en trop : ${fcfa(this.enTrop)}.`);
    }
    return liste;
  }

  get decharge(): boolean {
    return this.dossier?.service === 'Visa' && this.moyen === 'Espèces';
  }

  choisirDossier(): void {
    this.confirmation = false;
    this.choisirTypeParDefaut();
  }

  private choisirTypeParDefaut(): void {
    const x = this.dossier;
    if (!x || this.session.role === 'agent') {
      this.type = 'Acompte';
      return;
    }
    const paye = this.donnees.totalPaye(x.id);
    this.type = paye === 0 ? 'Acompte' : 'Solde';
  }

  modifier(): void {
    this.confirmation = false;
  }

  enregistrer(form: NgForm): void {
    const x = this.dossier;
    if (!x || form.invalid || !this.montant || Number(this.montant) <= 0) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.avertissements.length && !this.confirmation) {
      this.confirmation = true;
      return;
    }
    const p = this.donnees.enregistrerPaiement(
      { dossierId: x.id, montant: Number(this.montant), date: this.date, moyen: this.moyen, type: this.type },
      this.session.id
    );
    this.router.navigate(['/recus', p.id], { queryParams: { message: `Paiement enregistré – reçu ${p.numeroRecu}` } });
  }
}
