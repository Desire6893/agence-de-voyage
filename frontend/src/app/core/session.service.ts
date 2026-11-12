import { Injectable } from '@angular/core';
import { DonneesService } from './donnees.service';
import { LIBELLES_ROLES, Role, TypeVersement, Utilisateur } from './models';

const CLE = 'adjoba-travel-session';

export type ResultatConnexion = 'ok' | 'inconnu' | 'inactif';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private idConnecte: number | null = null;

  constructor(private donnees: DonneesService) {
    const brut = this.lire();
    this.idConnecte = brut ? Number(brut) : null;
  }

  private lire(): string | null {
    try {
      return localStorage.getItem(CLE) ?? sessionStorage.getItem(CLE);
    } catch {
      return null;
    }
  }

  get utilisateur(): Utilisateur | null {
    if (this.idConnecte === null) {
      return null;
    }
    const u = this.donnees.utilisateur(this.idConnecte);
    return u && u.etat === 'actif' ? u : null;
  }

  get role(): Role | null {
    return this.utilisateur?.role ?? null;
  }

  get libelleRole(): string {
    const r = this.role;
    return r ? LIBELLES_ROLES[r] : '';
  }

  get id(): number {
    return this.utilisateur?.id ?? 0;
  }

  connecter(identifiant: string, motDePasse: string, seSouvenir: boolean): ResultatConnexion {
    const u = this.donnees.d.utilisateurs.find(
      (x) => x.identifiant.toLowerCase() === identifiant.trim().toLowerCase() && x.motDePasse === motDePasse
    );
    if (!u) {
      return 'inconnu';
    }
    if (u.etat !== 'actif') {
      return 'inactif';
    }
    this.idConnecte = u.id;
    try {
      localStorage.removeItem(CLE);
      sessionStorage.removeItem(CLE);
      (seSouvenir ? localStorage : sessionStorage).setItem(CLE, String(u.id));
    } catch {
      return 'ok';
    }
    return 'ok';
  }

  deconnecter(): void {
    this.idConnecte = null;
    try {
      localStorage.removeItem(CLE);
      sessionStorage.removeItem(CLE);
    } catch {
      return;
    }
  }

  aUnRole(...roles: Role[]): boolean {
    const r = this.role;
    return r !== null && roles.includes(r);
  }

  get peutCreer(): boolean {
    return this.aUnRole('directrice', 'agent');
  }

  get peutGererPieces(): boolean {
    return this.aUnRole('directrice', 'agent');
  }

  get typesAutorises(): TypeVersement[] {
    return this.role === 'agent' ? ['Acompte'] : ['Acompte', 'Versement', 'Solde'];
  }
}
