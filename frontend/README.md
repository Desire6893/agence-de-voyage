# Adjoba Travel – Front-end

Interface de l'application de gestion d'Adjoba Travel (sprint 3), fidèle à la maquette Figma, avec des données simulées.

## Lancer le projet

```bash
cd frontend
npm install
npm start
```

L'application s'ouvre sur http://localhost:4200.

## Comptes de test

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Directrice | `directrice` | `adjoba2026` |
| Agent | `agent.1` | `adjoba2026` |
| Comptable | `comptable` | `adjoba2026` |

Le compte `agent.2` est désactivé : la connexion est refusée tant que la directrice ne l'a pas réactivé.

## Données simulées

Les données (clients, dossiers, paiements, pièces, échéances, comptes) sont enregistrées dans le navigateur (localStorage).
Pour revenir aux données de départ : outils de développement du navigateur (F12) > Application > Local Storage > supprimer `adjoba-travel-donnees`, puis recharger la page.

## Écrans

- Connexion par identifiant et mot de passe, menu et droits selon le rôle
- Tableau de bord par rôle (qui doit payer, papiers manquants, départs proches, relances)
- Clients : recherche, filtres, pagination, nouveau client
- Dossiers : liste, nouveau dossier (numéro automatique, pièces selon le service et le pays), fiche dossier (étapes, paiements, réservations, pièces, échéances, historique)
- Réservations
- Paiements : avertissement sans blocage (acompte < 50 %, montant supérieur au reste), reçu numéroté imprimable en 2 exemplaires, décharge de visa pour un versement en espèces
- Pièces et échéances : pièces manquantes, dates limites, alertes, relances
- Statistiques et utilisateurs (directrice)
- Profil et changement de mot de passe
- Affichage adapté au téléphone (barre de navigation en bas)
