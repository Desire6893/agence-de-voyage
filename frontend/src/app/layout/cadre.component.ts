import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SessionService } from '../core/session.service';
import { DonneesService } from '../core/donnees.service';
import { Role } from '../core/models';
import { IconeComponent } from './icone.component';
import { aujourdhui, dateFr, joursRestants } from '../core/outils';

interface LienMenu {
  libelle: string;
  lien: string;
  icone: string;
  roles: Role[];
  court: string;
}

const MENU: LienMenu[] = [
  { libelle: 'Tableau de bord', court: 'Accueil', lien: '/tableau-de-bord', icone: 'tableau', roles: ['directrice', 'agent', 'comptable'] },
  { libelle: 'Clients', court: 'Clients', lien: '/clients', icone: 'clients', roles: ['directrice', 'agent', 'comptable'] },
  { libelle: 'Dossiers', court: 'Dossiers', lien: '/dossiers', icone: 'dossiers', roles: ['directrice', 'agent', 'comptable'] },
  { libelle: 'Paiements', court: 'Paiements', lien: '/paiements', icone: 'paiements', roles: ['directrice', 'agent', 'comptable'] },
  { libelle: 'Pièces et échéances', court: 'Pièces', lien: '/pieces-echeances', icone: 'pieces', roles: ['directrice', 'agent'] },
  { libelle: 'Statistiques', court: 'Stats', lien: '/statistiques', icone: 'statistiques', roles: ['directrice'] },
  { libelle: 'Utilisateurs', court: 'Comptes', lien: '/utilisateurs', icone: 'utilisateurs', roles: ['directrice'] }
];

@Component({
  selector: 'app-cadre',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconeComponent],
  templateUrl: './cadre.component.html',
  styleUrl: './cadre.component.css'
})
export class CadreComponent {
  titre = '';
  date = dateFr(aujourdhui());

  constructor(
    public session: SessionService,
    private donnees: DonneesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.majTitre();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.majTitre());
  }

  private majTitre(): void {
    let r = this.route;
    while (r.firstChild) {
      r = r.firstChild;
    }
    this.titre = (r.snapshot?.data['titre'] as string | undefined) ?? '';
  }

  get menu(): LienMenu[] {
    const role = this.session.role;
    return MENU.filter((m) => role !== null && m.roles.includes(role)).map((m) =>
      m.lien === '/paiements' && role === 'agent' ? { ...m, libelle: 'Acomptes', court: 'Acomptes' } : m
    );
  }

  get menuMobile(): LienMenu[] {
    const liens = this.menu.filter((m) => ['/tableau-de-bord', '/clients', '/dossiers', '/paiements'].includes(m.lien));
    return [...liens, { libelle: 'Profil', court: 'Profil', lien: '/profil', icone: 'profil', roles: [] }];
  }

  get nbAlertes(): number {
    return this.donnees.d.echeances.filter((e) => !e.traitee && joursRestants(e.date) <= 3).length;
  }

  get initiales(): string {
    const nom = this.session.utilisateur?.nom ?? '';
    return nom
      .split(' ')
      .map((m) => m.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  deconnecter(): void {
    this.session.deconnecter();
    this.router.navigateByUrl('/connexion');
  }
}
