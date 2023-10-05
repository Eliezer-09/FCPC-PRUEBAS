import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { DetallesComponent } from "./detalles/detalles.component";
import { ParticipeActivoComponent } from "./participe-activo/participe-activo.component";
import { ParticipeAprobadoComponent } from "./participe-aprobado/participe-aprobado.component";
import { ParticipePendienteComponent } from "./participe-pendiente/participe-pendiente.component";
import { ParticipeRechazadoComponent } from "./participe-rechazado/participe-rechazado.component";

const routes: Routes = [
  {
    path: "consulta",
    component: ParticipeActivoComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "pendientes",
    component: ParticipePendienteComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "rechazados",
    component: ParticipeRechazadoComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "aprobados",
    component: ParticipeAprobadoComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "detalle/:cedula/:estado",
    component: DetallesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratosRoutingModule {}
