import { Donnees } from './models';
import { aujourdhui, decalerJours } from './outils';

export function donneesInitiales(): Donnees {
  const j = aujourdhui();
  const d = (n: number) => decalerJours(j, n);
  return {
    utilisateurs: [
      { id: 1, nom: 'Directrice', identifiant: 'directrice', motDePasse: 'adjoba2026', role: 'directrice', etat: 'actif' },
      { id: 2, nom: 'Agent 1', identifiant: 'agent.1', motDePasse: 'adjoba2026', role: 'agent', etat: 'actif' },
      { id: 3, nom: 'Agent 2', identifiant: 'agent.2', motDePasse: 'adjoba2026', role: 'agent', etat: 'inactif' },
      { id: 4, nom: 'Comptable', identifiant: 'comptable', motDePasse: 'adjoba2026', role: 'comptable', etat: 'actif' }
    ],
    clients: [
      { id: 1, civilite: 'Mr', nom: 'Client exemple', prenom: '1', telephone: '07 00 00 00 01', email: 'client.exemple1@exemple.ci', typePiece: 'Passeport', numeroPiece: 'EX-PASS-0001' },
      { id: 2, civilite: 'Mme', nom: 'Client exemple', prenom: '2', telephone: '07 00 00 00 02', email: 'client.exemple2@exemple.ci', typePiece: 'CNI', numeroPiece: 'EX-CNI-0002' },
      { id: 3, civilite: 'Mlle', nom: 'Client exemple', prenom: '3', telephone: '07 00 00 00 03', email: 'client.exemple3@exemple.ci', typePiece: 'Passeport', numeroPiece: 'EX-PASS-0003' }
    ],
    dossiers: [
      { id: 1, numero: '0001', clientId: 1, service: 'Visa', pays: 'Canada', ville: 'Montréal', dateVoyage: d(14), montantTotal: 800000, agentId: 2, etape: 6, dateCreation: d(-12) },
      { id: 2, numero: '0002', clientId: 2, service: 'Billet', pays: 'France', ville: 'Paris', dateVoyage: d(3), montantTotal: 500000, agentId: 2, etape: 5, dateCreation: d(-20) },
      { id: 3, numero: '0003', clientId: 3, service: 'Visa', pays: 'France', ville: 'Paris', dateVoyage: d(30), montantTotal: 650000, agentId: 3, etape: 6, dateCreation: d(-25) }
    ],
    reservations: [
      { id: 1, dossierId: 1, type: 'Hôtel', fournisseur: 'Hôtel Montréal', dateDebut: d(14), dateFin: d(21), montant: 180000, etat: 'Confirmée' },
      { id: 2, dossierId: 2, type: 'Billet', fournisseur: 'Air France', dateDebut: d(3), dateFin: d(17), montant: 420000, etat: 'Confirmée' }
    ],
    paiements: [
      { id: 1, dossierId: 3, montant: 325000, date: d(-24), moyen: 'Virement', type: 'Acompte', numeroRecu: 'R-000121', utilisateurId: 4, dateHeureSaisie: d(-24) + 'T09:40' },
      { id: 2, dossierId: 3, montant: 325000, date: d(-6), moyen: 'Wave / Mobile Money', type: 'Solde', numeroRecu: 'R-000122', utilisateurId: 4, dateHeureSaisie: d(-6) + 'T15:10' },
      { id: 3, dossierId: 2, montant: 250000, date: d(-19), moyen: 'Wave / Mobile Money', type: 'Acompte', numeroRecu: 'R-000123', utilisateurId: 2, dateHeureSaisie: d(-19) + 'T11:05' },
      { id: 4, dossierId: 1, montant: 300000, date: d(-10), moyen: 'Espèces', type: 'Acompte', numeroRecu: 'R-000124', utilisateurId: 4, dateHeureSaisie: d(-10) + 'T10:30' }
    ],
    decharges: [
      { id: 1, paiementId: 4, lieu: 'Abidjan', dateSignature: d(-10), montantVerse: 300000, nomPayeur: 'Mr Client exemple 1', pieceIdentite: 'Passeport n° EX-PASS-0001', nomCandidat: 'Client exemple 1', destinationVisa: 'Canada · Montréal', nombreExemplaires: 2 }
    ],
    modelesPieces: [
      { id: 1, nomPiece: 'Passeport', service: 'Visa', pays: 'Canada' },
      { id: 2, nomPiece: "Photo d'identité", service: 'Visa', pays: 'Canada' },
      { id: 3, nomPiece: 'Attestation de travail', service: 'Visa', pays: 'Canada' },
      { id: 4, nomPiece: 'Relevés bancaires', service: 'Visa', pays: 'Canada' },
      { id: 5, nomPiece: 'Passeport', service: 'Visa', pays: 'France' },
      { id: 6, nomPiece: "Photo d'identité", service: 'Visa', pays: 'France' },
      { id: 7, nomPiece: 'Relevés bancaires', service: 'Visa', pays: 'France' },
      { id: 8, nomPiece: 'Assurance voyage', service: 'Visa', pays: 'France' },
      { id: 9, nomPiece: 'Passeport', service: 'Visa', pays: '*' },
      { id: 10, nomPiece: "Photo d'identité", service: 'Visa', pays: '*' },
      { id: 11, nomPiece: 'Passeport', service: 'Billet', pays: '*' },
      { id: 12, nomPiece: "Pièce d'identité", service: 'Hôtel', pays: '*' },
      { id: 13, nomPiece: "Pièce d'identité", service: 'Circuit', pays: '*' },
      { id: 14, nomPiece: 'Carnet de vaccination', service: 'Circuit', pays: '*' }
    ],
    pieces: [
      { id: 1, dossierId: 1, modeleId: 1, nom: 'Passeport', statut: 'reçue', dateReception: d(-12) },
      { id: 2, dossierId: 1, modeleId: 2, nom: "Photo d'identité", statut: 'reçue', dateReception: d(-12) },
      { id: 3, dossierId: 1, modeleId: 3, nom: 'Attestation de travail', statut: 'manquante', dateReception: null },
      { id: 4, dossierId: 1, modeleId: 4, nom: 'Relevés bancaires', statut: 'reçue', dateReception: d(-9) },
      { id: 5, dossierId: 2, modeleId: 11, nom: 'Passeport', statut: 'reçue', dateReception: d(-20) },
      { id: 6, dossierId: 3, modeleId: 5, nom: 'Passeport', statut: 'reçue', dateReception: d(-25) },
      { id: 7, dossierId: 3, modeleId: 6, nom: "Photo d'identité", statut: 'reçue', dateReception: d(-25) },
      { id: 8, dossierId: 3, modeleId: 7, nom: 'Relevés bancaires', statut: 'manquante', dateReception: null },
      { id: 9, dossierId: 3, modeleId: 8, nom: 'Assurance voyage', statut: 'reçue', dateReception: d(-8) }
    ],
    echeances: [
      { id: 1, dossierId: 1, type: 'Dépôt visa', date: d(2), action: 'Déposer le dossier de visa', responsableId: 2, traitee: false },
      { id: 2, dossierId: 1, type: 'Limite de paiement', date: d(7), action: 'Solde de 500 000 FCFA à payer', responsableId: 4, traitee: false },
      { id: 3, dossierId: 1, type: 'Départ', date: d(14), action: 'Départ du client', responsableId: 2, traitee: false },
      { id: 4, dossierId: 2, type: 'Limite de paiement', date: d(1), action: 'Solde de 250 000 FCFA à payer', responsableId: 4, traitee: false },
      { id: 5, dossierId: 2, type: 'Départ', date: d(3), action: 'Départ du client', responsableId: 2, traitee: false },
      { id: 6, dossierId: 3, type: 'Dépôt visa', date: d(10), action: 'Déposer le dossier de visa', responsableId: 3, traitee: false },
      { id: 7, dossierId: 3, type: 'Départ', date: d(30), action: 'Départ du client', responsableId: 3, traitee: false },
      { id: 8, dossierId: 1, type: 'Relance', date: j, action: "Demander l'attestation de travail", responsableId: 2, traitee: false },
      { id: 9, dossierId: 3, type: 'Relance', date: d(1), action: 'Demander les relevés bancaires', responsableId: 3, traitee: false },
      { id: 10, dossierId: 2, type: 'Relance', date: d(-1), action: 'Confirmer le départ', responsableId: 2, traitee: true }
    ],
    historiques: [
      { id: 1, dossierId: 1, utilisateurId: 1, action: 'Dossier créé', dateHeure: d(-12) + 'T09:15' },
      { id: 2, dossierId: 1, utilisateurId: 4, action: 'Acompte enregistré · R-000124', dateHeure: d(-10) + 'T10:30' },
      { id: 3, dossierId: 1, utilisateurId: 2, action: 'Réservation ajoutée · Hôtel Montréal', dateHeure: d(-10) + 'T11:00' },
      { id: 4, dossierId: 2, utilisateurId: 2, action: 'Dossier créé', dateHeure: d(-20) + 'T10:00' },
      { id: 5, dossierId: 2, utilisateurId: 2, action: 'Acompte enregistré · R-000123', dateHeure: d(-19) + 'T11:05' },
      { id: 6, dossierId: 3, utilisateurId: 3, action: 'Dossier créé', dateHeure: d(-25) + 'T08:45' },
      { id: 7, dossierId: 3, utilisateurId: 4, action: 'Acompte enregistré · R-000121', dateHeure: d(-24) + 'T09:40' },
      { id: 8, dossierId: 3, utilisateurId: 4, action: 'Solde enregistré · R-000122', dateHeure: d(-6) + 'T15:10' }
    ]
  };
}
