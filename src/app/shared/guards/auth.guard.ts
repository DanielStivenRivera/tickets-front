import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const isAuthenticated = this.localStorageService.itemExists('token');
    const isAuthRoute = state.url.includes('auth');
    const isHomeRoute = state.url.includes('home');

    if (isAuthenticated && isAuthRoute) {
      if (state.url !== '/home') {
        await this.router.navigateByUrl('/home');
      }
      return false;
    }

    if (!isAuthenticated && isHomeRoute) {
      if (state.url !== '/auth') {
        await this.router.navigateByUrl('/auth');
      }
      return false;
    }

    return true;
  }
}
