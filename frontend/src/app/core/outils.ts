const UNITES = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
  'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const DIZAINES = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

function moinsDeCent(n: number): string {
  if (n < 20) {
    return UNITES[n];
  }
  const d = Math.floor(n / 10);
  let u = n % 10;
  if (d === 7 || d === 9) {
    u += 10;
  }
  let mot = DIZAINES[d];
  if (u === 0) {
    return d === 8 ? mot + 's' : mot;
  }
  if ((u === 1 || u === 11) && d !== 8 && d !== 9) {
    return mot + ' et ' + UNITES[u];
  }
  return mot + '-' + UNITES[u];
}

function moinsDeMille(n: number): string {
  const c = Math.floor(n / 100);
  const reste = n % 100;
  let mot = '';
  if (c === 1) {
    mot = 'cent';
  } else if (c > 1) {
    mot = UNITES[c] + ' cent' + (reste === 0 ? 's' : '');
  }
  if (reste > 0) {
    mot += (mot ? ' ' : '') + moinsDeCent(reste);
  }
  return mot;
}

export function montantEnLettres(montant: number): string {
  let n = Math.round(Math.abs(montant));
  if (n === 0) {
    return 'zéro franc CFA';
  }
  const parties: string[] = [];
  const milliards = Math.floor(n / 1_000_000_000);
  n %= 1_000_000_000;
  const millions = Math.floor(n / 1_000_000);
  n %= 1_000_000;
  const milliers = Math.floor(n / 1000);
  const reste = n % 1000;
  if (milliards) {
    parties.push(moinsDeMille(milliards) + ' milliard' + (milliards > 1 ? 's' : ''));
  }
  if (millions) {
    parties.push(moinsDeMille(millions) + ' million' + (millions > 1 ? 's' : ''));
  }
  if (milliers) {
    parties.push(milliers === 1 ? 'mille' : moinsDeMille(milliers).replace(/s$/, '') + ' mille');
  }
  if (reste) {
    parties.push(moinsDeMille(reste));
  }
  return parties.join(' ') + ' francs CFA';
}

export function fcfa(montant: number): string {
  const entier = Math.round(montant).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return entier + ' FCFA';
}

export function aujourdhui(): string {
  return versIso(new Date());
}

export function versIso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${j}`;
}

export function decalerJours(iso: string, jours: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + jours);
  return versIso(d);
}

export function joursRestants(iso: string): number {
  const cible = new Date(iso + 'T00:00:00').getTime();
  const jour = new Date(aujourdhui() + 'T00:00:00').getTime();
  return Math.round((cible - jour) / 86_400_000);
}

export function dateFr(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }
  const [a, m, j] = iso.substring(0, 10).split('-');
  return `${j}/${m}/${a}`;
}

export function heureFr(iso: string): string {
  return iso.length > 10 ? iso.substring(11, 16) : '';
}

export function maintenantIso(): string {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${versIso(d)}T${h}:${mi}`;
}
