import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiredRoles = route.data['roles'];
    const userRole = this.authService.getTokenData().role;
    if (
      this.authService.getToken() &&
      requiredRoles.includes(userRole) &&
      requiredRoles
    ) {
      return true;
    }
    this.route.navigateByUrl('/auth/login');
    return false;
  }
}
