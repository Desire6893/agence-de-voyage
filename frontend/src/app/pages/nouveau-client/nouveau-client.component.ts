import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DonneesService } from '../../core/donnees.service';
import { Client } from '../../core/models';

@Component({
  selector: 'app-nouveau-client',
  imports: [FormsModule, RouterLink],
  templateUrl: './nouveau-client.component.html'
})
export class NouveauClientComponent {
  client: Omit<Client, 'id'> = {
    civilite: 'Mr',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    typePiece: 'Passeport',
    numeroPiece: ''
  };
  civilites: Client['civilite'][] = ['Mr', 'Mme', 'Mlle'];
  typesPiece = ['Passeport', 'CNI', 'Attestation d’identité', 'Permis de conduire'];
  doublon = false;

  constructor(private donnees: DonneesService, private router: Router) {}

  verifierDoublon(): void {
    const tel = this.client.telephone.replace(/\s/g, '');
    this.doublon = !!tel && this.donnees.d.clients.some((c) => c.telephone.replace(/\s/g, '') === tel);
  }

  enregistrer(form: NgForm, creerDossier: boolean): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    const c = this.donnees.ajouterClient({
      ...this.client,
      nom: this.client.nom.trim(),
      prenom: this.client.prenom.trim(),
      telephone: this.client.telephone.trim(),
      email: this.client.email.trim(),
      numeroPiece: this.client.numeroPiece.trim()
    });
    if (creerDossier) {
      this.router.navigate(['/dossiers/nouveau'], { queryParams: { client: c.id, message: 'Client enregistré' } });
    } else {
      this.router.navigate(['/clients'], { queryParams: { message: 'Client enregistré' } });
    }
  }
}
