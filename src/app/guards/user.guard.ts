import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  if (accountService.isAuthenticated()) {
    if(accountService.isUser())
       return true;
    else
    {
      router.navigate(['/forbidden']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }

};
