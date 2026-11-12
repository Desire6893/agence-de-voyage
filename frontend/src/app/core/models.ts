export type Role = 'directrice' | 'agent' | 'comptable';
export type EtatCompte = 'actif' | 'inactif';
export type Service = 'Visa' | 'Billet' | 'Hôtel' | 'Circuit';
export type MoyenPaiement = 'Espèces' | 'Wave / Mobile Money' | 'Virement';
export type TypeVersement = 'Acompte' | 'Versement' | 'Solde';
export type EtatReservation = 'En attente' | 'Confirmée' | 'Annulée';
export type TypeEcheance = 'Limite de paiement' | 'Dépôt visa' | 'Départ' | 'Relance';

export interface Utilisateur {
  id: number;
  nom: string;
  identifiant: string;
  motDePasse: string;
  role: Role;
  etat: EtatCompte;
}

export interface Client {
  id: number;
  civilite: 'Mr' | 'Mme' | 'Mlle';
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  typePiece: string;
  numeroPiece: string;
}

export interface Dossier {
  id: number;
  numero: string;
  clientId: number;
  service: Service;
  pays: string;
  ville: string;
  dateVoyage: string;
  montantTotal: number;
  agentId: number;
  etape: number;
  dateCreation: string;
}

export interface Reservation {
  id: number;
  dossierId: number;
  type: Service | 'Autre';
  fournisseur: string;
  dateDebut: string;
  dateFin: string;
  montant: number;
  etat: EtatReservation;
}

export interface Paiement {
  id: number;
  dossierId: number;
  montant: number;
  date: string;
  moyen: MoyenPaiement;
  type: TypeVersement;
  numeroRecu: string;
  utilisateurId: number;
  dateHeureSaisie: string;
}

export interface DechargeVisa {
  id: number;
  paiementId: number;
  lieu: string;
  dateSignature: string;
  montantVerse: number;
  nomPayeur: string;
  pieceIdentite: string;
  nomCandidat: string;
  destinationVisa: string;
  nombreExemplaires: number;
}

export interface ModelePiece {
  id: number;
  nomPiece: string;
  service: Service;
  pays: string;
}

export interface Piece {
  id: number;
  dossierId: number;
  modeleId: number;
  nom: string;
  statut: 'reçue' | 'manquante';
  dateReception: string | null;
}

export interface Echeance {
  id: number;
  dossierId: number;
  type: TypeEcheance;
  date: string;
  action: string;
  responsableId: number;
  traitee: boolean;
}

export interface Historique {
  id: number;
  dossierId: number;
  utilisateurId: number;
  action: string;
  dateHeure: string;
}

export interface Donnees {
  utilisateurs: Utilisateur[];
  clients: Client[];
  dossiers: Dossier[];
  reservations: Reservation[];
  paiements: Paiement[];
  decharges: DechargeVisa[];
  modelesPieces: ModelePiece[];
  pieces: Piece[];
  echeances: Echeance[];
  historiques: Historique[];
}

export const ETAPES = [
  'Contact',
  'Besoin noté',
  'Devis',
  'Acompte',
  'Réservation',
  'Pièces',
  'Remise et départ'
];

export const SERVICES: Service[] = ['Visa', 'Billet', 'Hôtel', 'Circuit'];
export const MOYENS: MoyenPaiement[] = ['Espèces', 'Wave / Mobile Money', 'Virement'];
export const PAYS = ['Canada', 'France', 'Belgique', 'Russie', 'Émirats arabes unis', "Côte d'Ivoire", 'Autre'];

export const LIBELLES_ROLES: Record<Role, string> = {
  directrice: 'Directrice',
  agent: 'Agent',
  comptable: 'Comptable'
};
