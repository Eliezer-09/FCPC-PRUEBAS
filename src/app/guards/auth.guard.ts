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
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.usuarioLogeado()) {
      return true;
    }

    if (state.url != "/") {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      });
    } else {
      this.router.navigate(["/login"]);
    }

    return false;
  }
}
