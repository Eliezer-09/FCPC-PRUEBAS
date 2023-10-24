import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { AporteAdicionalComponent } from "./aporte-adicional/aporte-adicional.component";
import { CargarAportesComponent } from "./cargar-aportes/cargar-aportes.component";
import { CargarRolesComponent } from "./cargar-roles/cargar-roles.component";
import { LiquidarCesantiaComponent } from "./liquidar-cesantia/liquidar-cesantia.component";
import { LiquidarComponent } from "./liquidar-cesantia/liquidar/liquidar.component";
import { ListaCesantesComponent } from "./lista-cesantes/lista-cesantes.component";
import { ParticipeActualizarComponent } from "./participe-actualizar/participe-actualizar.component";
import { ParticipeAdherirComponent } from "./participe-adherir/participe-adherir.component";
import { ParticipeCorreoActualizarComponent } from "./participe-correo-actualizar/participe-correo-actualizar.component";
import { PosicionConsolidadaComponent } from "./posicion-consolidada/posicion-consolidada.component";
import { RegistroCesanteComponent } from "./registro-cesante/registro-cesante.component";

const routes: Routes = [
  {
    data: {
      Validate: true,
    },
    path: "adherir",
    component: ParticipeAdherirComponent,
  },
  {
    path: "consolidada",
    component: PosicionConsolidadaComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "consolidada/:idParticipe",
    component: PosicionConsolidadaComponent,
  },
  {
    path: "actualizar",
    component: ParticipeActualizarComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "actualizar/:identificacion",
    component: ParticipeActualizarComponent,
  },
  {
    path: "actualizarcorreo",
    component: ParticipeCorreoActualizarComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "cargar-aportes",
    component: CargarAportesComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "liquidar-cesantia",
    component: LiquidarCesantiaComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "cesantias-liquidadas",
    component: ListaCesantesComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "registrar-cesante",
    component: RegistroCesanteComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "cargar-roles",
    component: CargarRolesComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "aporte-adicional",
    component: AporteAdicionalComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParticipesRoutingModule {}
