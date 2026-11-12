import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session.service';
import { Role } from './models';

export const connecteGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  return session.utilisateur ? true : inject(Router).parseUrl('/connexion');
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const session = inject(SessionService);
  const roles = (route.data['roles'] ?? []) as Role[];
  if (!roles.length || session.aUnRole(...roles)) {
    return true;
  }
  return inject(Router).createUrlTree(['/acces-refuse']);
};
