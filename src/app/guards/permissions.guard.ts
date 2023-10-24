import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { DataService } from "../services/data.service";
import { LocalService } from "../services/local.service";

@Injectable({
  providedIn: "root",
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private router: Router,
    private dataService: DataService,
    private localServiceS: LocalService
  ) {}

  async canActivate(
    { data }: ActivatedRouteSnapshot,
    { url }: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const roles = (data.allowedRoles as string[]) || [];

    if (!roles.length) {
      return true;
    }

    const permisos = await this.getPermissions();

    const hasPermission = permisos.accesos.some(({ permisos }) => {
      return permisos.some(({ accion }) => accion === url);
    });

    if (hasPermission) {
      return true;
    }

    return this.router.parseUrl("/");
  }

  private async getPermissions() {
    const storedPermissionsCifrado = this.localServiceS.getItem(
      JSON.stringify("permisos")
    );

    if (storedPermissionsCifrado) {
      return JSON.parse(storedPermissionsCifrado);
    }

    const { result } = await this.dataService.authPermisos().toPromise();

    this.localServiceS.setItem("permisos", JSON.stringify(result));

    return result;
  }
}
