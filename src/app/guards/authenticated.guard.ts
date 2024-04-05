import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  if (accountService.isAuthenticated())
      return true;
  else {
    router.navigate(['/login']);
    return false;
  }
};
