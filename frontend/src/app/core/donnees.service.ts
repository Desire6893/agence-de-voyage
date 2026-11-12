import { Injectable } from '@angular/core';
import {
  Client, DechargeVisa, Donnees, Dossier, ETAPES, Echeance, MoyenPaiement, Paiement, Piece,
  Reservation, Role, Service, TypeVersement, Utilisateur
} from './models';
import { donneesInitiales } from './donnees-initiales';
import { aujourdhui, decalerJours, fcfa, maintenantIso } from './outils';

const CLE = 'adjoba-travel-donnees';

@Injectable({ providedIn: 'root' })
export class DonneesService {
  d: Donnees;

  constructor() {
    this.d = this.charger();
  }

  private charger(): Donnees {
    try {
      const brut = localStorage.getItem(CLE);
      if (brut) {
        return JSON.parse(brut) as Donnees;
      }
    } catch {
      return donneesInitiales();
    }
    const initiales = donneesInitiales();
    this.enregistrer(initiales);
    return initiales;
  }

  private enregistrer(donnees: Donnees = this.d): void {
    try {
      localStorage.setItem(CLE, JSON.stringify(donnees));
    } catch {
      return;
    }
  }

  reinitialiser(): void {
    this.d = donneesInitiales();
    this.enregistrer();
  }

  private suivant(liste: { id: number }[]): number {
    return liste.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  }

  utilisateur(id: number): Utilisateur | undefined {
    return this.d.utilisateurs.find((u) => u.id === id);
  }

  nomUtilisateur(id: number): string {
    return this.utilisateur(id)?.nom ?? '—';
  }

  client(id: number): Client | undefined {
    return this.d.clients.find((c) => c.id === id);
  }

  nomClient(id: number): string {
    const c = this.client(id);
    return c ? `${c.nom} ${c.prenom}`.trim() : '—';
  }

  dossier(id: number): Dossier | undefined {
    return this.d.dossiers.find((x) => x.id === id);
  }

  libelleDossier(x: Dossier): string {
    return `${x.numero} – ${x.service} ${x.pays}`;
  }

  dossiersDuClient(clientId: number): Dossier[] {
    return this.d.dossiers.filter((x) => x.clientId === clientId);
  }

  agents(): Utilisateur[] {
    return this.d.utilisateurs.filter((u) => u.role === 'agent' && u.etat === 'actif');
  }

  paiementsDu(dossierId: number): Paiement[] {
    return this.d.paiements
      .filter((p) => p.dossierId === dossierId)
      .sort((a, b) => b.dateHeureSaisie.localeCompare(a.dateHeureSaisie));
  }

  paiement(id: number): Paiement | undefined {
    return this.d.paiements.find((p) => p.id === id);
  }

  dechargeDu(paiementId: number): DechargeVisa | undefined {
    return this.d.decharges.find((x) => x.paiementId === paiementId);
  }

  reservationsDu(dossierId: number): Reservation[] {
    return this.d.reservations.filter((r) => r.dossierId === dossierId);
  }

  piecesDu(dossierId: number): Piece[] {
    return this.d.pieces.filter((p) => p.dossierId === dossierId);
  }

  echeancesDu(dossierId: number): Echeance[] {
    return this.d.echeances
      .filter((e) => e.dossierId === dossierId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  historiqueDu(dossierId: number) {
    return this.d.historiques
      .filter((h) => h.dossierId === dossierId)
      .sort((a, b) => b.dateHeure.localeCompare(a.dateHeure));
  }

  totalPaye(dossierId: number): number {
    return this.paiementsDu(dossierId).reduce((s, p) => s + p.montant, 0);
  }

  resteAPayer(dossierId: number): number {
    const x = this.dossier(dossierId);
    return x ? Math.max(0, x.montantTotal - this.totalPaye(dossierId)) : 0;
  }

  tropPercu(dossierId: number): number {
    const x = this.dossier(dossierId);
    return x ? Math.max(0, this.totalPaye(dossierId) - x.montantTotal) : 0;
  }

  resteClient(clientId: number): number {
    return this.dossiersDuClient(clientId).reduce((s, x) => s + this.resteAPayer(x.id), 0);
  }

  piecesManquantes(dossierId: number): Piece[] {
    return this.piecesDu(dossierId).filter((p) => p.statut === 'manquante');
  }

  modelesPour(service: Service, pays: string) {
    const exacts = this.d.modelesPieces.filter((m) => m.service === service && m.pays === pays);
    return exacts.length ? exacts : this.d.modelesPieces.filter((m) => m.service === service && m.pays === '*');
  }

  tracer(dossierId: number, utilisateurId: number, action: string): void {
    this.d.historiques.push({
      id: this.suivant(this.d.historiques),
      dossierId,
      utilisateurId,
      action,
      dateHeure: maintenantIso()
    });
  }

  ajouterClient(donnees: Omit<Client, 'id'>): Client {
    const client: Client = { id: this.suivant(this.d.clients), ...donnees };
    this.d.clients.push(client);
    this.enregistrer();
    return client;
  }

  ajouterDossier(
    donnees: Pick<Dossier, 'clientId' | 'service' | 'pays' | 'ville' | 'dateVoyage' | 'montantTotal' | 'agentId'>,
    utilisateurId: number
  ): Dossier {
    const id = this.suivant(this.d.dossiers);
    const numero = String(this.d.dossiers.reduce((m, x) => Math.max(m, Number(x.numero)), 0) + 1).padStart(4, '0');
    const dossier: Dossier = { id, numero, etape: 2, dateCreation: aujourdhui(), ...donnees };
    this.d.dossiers.push(dossier);
    for (const m of this.modelesPour(dossier.service, dossier.pays)) {
      this.d.pieces.push({
        id: this.suivant(this.d.pieces),
        dossierId: id,
        modeleId: m.id,
        nom: m.nomPiece,
        statut: 'manquante',
        dateReception: null
      });
    }
    const echeance = (type: Echeance['type'], date: string, action: string, responsableId: number) =>
      this.d.echeances.push({
        id: this.suivant(this.d.echeances),
        dossierId: id,
        type,
        date,
        action,
        responsableId,
        traitee: false
      });
    echeance('Départ', dossier.dateVoyage, 'Départ du client', dossier.agentId);
    const comptable = this.d.utilisateurs.find((u) => u.role === 'comptable');
    echeance('Limite de paiement', decalerJours(dossier.dateVoyage, -7), 'Solde à payer avant le départ', comptable?.id ?? 1);
    if (dossier.service === 'Visa') {
      echeance('Dépôt visa', decalerJours(dossier.dateVoyage, -21), 'Déposer le dossier de visa', dossier.agentId);
    }
    this.tracer(id, utilisateurId, 'Dossier créé');
    this.enregistrer();
    return dossier;
  }

  ajouterReservation(donnees: Omit<Reservation, 'id'>, utilisateurId: number): Reservation {
    const reservation: Reservation = { id: this.suivant(this.d.reservations), ...donnees };
    this.d.reservations.push(reservation);
    const x = this.dossier(donnees.dossierId);
    if (x && x.etape < 5) {
      x.etape = 5;
    }
    this.tracer(donnees.dossierId, utilisateurId, `Réservation ajoutée · ${donnees.fournisseur}`);
    this.enregistrer();
    return reservation;
  }

  prochainNumeroRecu(): string {
    const max = this.d.paiements.reduce((m, p) => Math.max(m, Number(p.numeroRecu.replace('R-', ''))), 0);
    return 'R-' + String(max + 1).padStart(6, '0');
  }

  enregistrerPaiement(
    donnees: { dossierId: number; montant: number; date: string; moyen: MoyenPaiement; type: TypeVersement },
    utilisateurId: number
  ): Paiement {
    const paiement: Paiement = {
      id: this.suivant(this.d.paiements),
      numeroRecu: this.prochainNumeroRecu(),
      utilisateurId,
      dateHeureSaisie: maintenantIso(),
      ...donnees
    };
    this.d.paiements.push(paiement);
    const x = this.dossier(donnees.dossierId);
    if (x) {
      if (x.etape < 4) {
        x.etape = 4;
      }
      if (x.service === 'Visa' && donnees.moyen === 'Espèces') {
        const c = this.client(x.clientId);
        this.d.decharges.push({
          id: this.suivant(this.d.decharges),
          paiementId: paiement.id,
          lieu: 'Abidjan',
          dateSignature: donnees.date,
          montantVerse: donnees.montant,
          nomPayeur: c ? `${c.civilite} ${c.nom} ${c.prenom}` : '—',
          pieceIdentite: c ? `${c.typePiece} n° ${c.numeroPiece}` : '—',
          nomCandidat: c ? `${c.nom} ${c.prenom}` : '—',
          destinationVisa: `${x.pays} · ${x.ville}`,
          nombreExemplaires: 2
        });
      }
    }
    this.tracer(donnees.dossierId, utilisateurId, `${donnees.type} enregistré · ${paiement.numeroRecu} · ${fcfa(donnees.montant)}`);
    this.enregistrer();
    return paiement;
  }

  changerEtape(dossierId: number, etape: number, utilisateurId: number): void {
    const x = this.dossier(dossierId);
    if (!x) {
      return;
    }
    x.etape = etape;
    this.tracer(dossierId, utilisateurId, `Étape : ${etape}. ${ETAPES[etape - 1]}`);
    this.enregistrer();
  }

  basculerPiece(pieceId: number, utilisateurId: number): void {
    const p = this.d.pieces.find((x) => x.id === pieceId);
    if (!p) {
      return;
    }
    p.statut = p.statut === 'reçue' ? 'manquante' : 'reçue';
    p.dateReception = p.statut === 'reçue' ? aujourdhui() : null;
    this.tracer(p.dossierId, utilisateurId, `Pièce ${p.statut} · ${p.nom}`);
    this.enregistrer();
  }

  basculerEcheance(echeanceId: number, utilisateurId: number): void {
    const e = this.d.echeances.find((x) => x.id === echeanceId);
    if (!e) {
      return;
    }
    e.traitee = !e.traitee;
    this.tracer(e.dossierId, utilisateurId, `${e.type} ${e.traitee ? 'effectuée' : 'à refaire'} · ${e.action}`);
    this.enregistrer();
  }

  ajouterRelance(dossierId: number, date: string, action: string, responsableId: number, utilisateurId: number): void {
    this.d.echeances.push({
      id: this.suivant(this.d.echeances),
      dossierId,
      type: 'Relance',
      date,
      action,
      responsableId,
      traitee: false
    });
    this.tracer(dossierId, utilisateurId, `Relance prévue · ${action}`);
    this.enregistrer();
  }

  identifiantLibre(identifiant: string): boolean {
    return !this.d.utilisateurs.some((u) => u.identifiant.toLowerCase() === identifiant.toLowerCase());
  }

  ajouterUtilisateur(donnees: { nom: string; identifiant: string; motDePasse: string; role: Role }): Utilisateur {
    const u: Utilisateur = { id: this.suivant(this.d.utilisateurs), etat: 'actif', ...donnees };
    this.d.utilisateurs.push(u);
    this.enregistrer();
    return u;
  }

  basculerEtatUtilisateur(id: number): void {
    const u = this.utilisateur(id);
    if (!u) {
      return;
    }
    u.etat = u.etat === 'actif' ? 'inactif' : 'actif';
    this.enregistrer();
  }

  changerMotDePasse(id: number, motDePasse: string): void {
    const u = this.utilisateur(id);
    if (!u) {
      return;
    }
    u.motDePasse = motDePasse;
    this.enregistrer();
  }
}
