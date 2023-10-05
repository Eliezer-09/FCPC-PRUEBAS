import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../pages/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class NoLoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.usuarioLogeado()) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
