import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const roleGuard = (role: string) : CanActivateFn => {
  return () =>{
    const tokenService = inject(TokenService);
    return tokenService.getRole() === role;
  }
  
};
