import { Routes } from '@angular/router';
import { connecteGuard, roleGuard } from './core/gardes';
import { CadreComponent } from './layout/cadre.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { NouveauClientComponent } from './pages/nouveau-client/nouveau-client.component';
import { DossiersComponent } from './pages/dossiers/dossiers.component';
import { NouveauDossierComponent } from './pages/nouveau-dossier/nouveau-dossier.component';
import { FicheDossierComponent } from './pages/fiche-dossier/fiche-dossier.component';
import { NouvelleReservationComponent } from './pages/nouvelle-reservation/nouvelle-reservation.component';
import { PaiementsComponent } from './pages/paiements/paiements.component';
import { NouveauPaiementComponent } from './pages/nouveau-paiement/nouveau-paiement.component';
import { RecuComponent } from './pages/recu/recu.component';
import { DechargeComponent } from './pages/decharge/decharge.component';
import { PiecesEcheancesComponent } from './pages/pieces-echeances/pieces-echeances.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { NouveauCompteComponent } from './pages/nouveau-compte/nouveau-compte.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { AccesRefuseComponent } from './pages/acces-refuse/acces-refuse.component';

const tous = ['directrice', 'agent', 'comptable'];
const creation = ['directrice', 'agent'];
const directrice = ['directrice'];

export const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent, title: 'Connexion – Adjoba Travel' },
  {
    path: '',
    component: CadreComponent,
    canActivate: [connecteGuard],
    canActivateChild: [roleGuard],
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordComponent, data: { titre: 'Tableau de bord', roles: tous } },
      { path: 'clients', component: ClientsComponent, data: { titre: 'Clients', roles: tous } },
      { path: 'clients/nouveau', component: NouveauClientComponent, data: { titre: 'Nouveau client', roles: creation } },
      { path: 'dossiers', component: DossiersComponent, data: { titre: 'Dossiers', roles: tous } },
      { path: 'dossiers/nouveau', component: NouveauDossierComponent, data: { titre: 'Nouveau dossier', roles: creation } },
      { path: 'dossiers/:id', component: FicheDossierComponent, data: { titre: 'Fiche dossier', roles: tous } },
      { path: 'dossiers/:id/reservation', component: NouvelleReservationComponent, data: { titre: 'Ajouter une réservation', roles: creation } },
      { path: 'dossiers/:id/paiement', component: NouveauPaiementComponent, data: { titre: 'Enregistrer un paiement', roles: tous } },
      { path: 'paiements', component: PaiementsComponent, data: { titre: 'Paiements', roles: tous } },
      { path: 'paiements/nouveau', component: NouveauPaiementComponent, data: { titre: 'Enregistrer un paiement', roles: tous } },
      { path: 'recus/:id', component: RecuComponent, data: { titre: 'Reçu de paiement', roles: tous } },
      { path: 'recus/:id/decharge', component: DechargeComponent, data: { titre: 'Décharge de visa', roles: tous } },
      { path: 'pieces-echeances', component: PiecesEcheancesComponent, data: { titre: 'Pièces et échéances', roles: creation } },
      { path: 'statistiques', component: StatistiquesComponent, data: { titre: 'Statistiques', roles: directrice } },
      { path: 'utilisateurs', component: UtilisateursComponent, data: { titre: 'Utilisateurs et droits', roles: directrice } },
      { path: 'utilisateurs/nouveau', component: NouveauCompteComponent, data: { titre: 'Nouveau compte', roles: directrice } },
      { path: 'profil', component: ProfilComponent, data: { titre: 'Profil', roles: tous } },
      { path: 'acces-refuse', component: AccesRefuseComponent, data: { titre: 'Accès refusé' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
