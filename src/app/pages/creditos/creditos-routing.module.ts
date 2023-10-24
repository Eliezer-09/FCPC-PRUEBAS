import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CargarDescuentosComponent } from "./cargar-descuentos/cargar-descuentos.component";
import { ConveniosPagosComponent } from "./convenios-pagos/convenios-pagos.component";
import { DetallesCreditosComponent } from "./detalles-creditos/detalles-creditos.component";
import { LegalizarComponent } from "./detalles-creditos/legalizar/legalizar.component";
import { GenerarDescuentosComponent } from "./generar-descuentos/generar-descuentos.component";
import { PrestamosAnuladosComponent } from "./prestamos-anulados/prestamos-anulados.component";
import { PrestamosAprobadosComponent } from "./prestamos-aprobados/prestamos-aprobados.component";
import { PrestamosFirmadosComponent } from "./prestamos-firmados/prestamos-firmados.component";
import { PrestamosPagadosComponent } from "./prestamos-pagados/prestamos-pagados.component";
import { PrestamosPendientesComponent } from "./prestamos-pendientes/prestamos-pendientes.component";
import { PrestamosRechazadosComponent } from "./prestamos-rechazados/prestamos-rechazados.component";
import { PrestamosTransferidosComponent } from "./prestamos-transferidos/prestamos-transferidos.component";
import { SimuladorComponent } from "./pages/simulador/simulador.component";
import { PagosIndividualesComponent } from "./pagos-individuales/pagos-individuales.component";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { SolicitudesCreditosComponent } from "./pages/solicitudes-creditos/solicitudes-creditos.component";

const routes: Routes = [
  {
    path: "quirografario/:identificacion",
    component: SolicitudesCreditosComponent,
    data: { allowedRoles: ["User"],credito:true,simular:false },
  },
  {
    path: "quirografario",
    component: SolicitudesCreditosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"],credito:true,simular:false },
  },
  {
    path: "detalle/:id/:idprestamo/:estado",
    component: DetallesCreditosComponent,
  },
  {
    path: "pendientes",
    component: PrestamosPendientesComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "rechazados",
    component: PrestamosRechazadosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "anulados",
    component: PrestamosAnuladosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "pagados",
    component: PrestamosPagadosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "simulacion",
    component: SimuladorComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "novacion",
    component: SolicitudesCreditosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"],novacion:true,simular:false },
  },
  {
    path: "restructuracion",
    component: SolicitudesCreditosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"], restructuracion:true,simular:false  },
  },
  {
    path: "refinanciamiento",
    component: SolicitudesCreditosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"],  refinanciamiento:true,simular:false},
  },
  {
    path: "aprobados",
    component: PrestamosAprobadosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "acreditacion",
    component: PrestamosTransferidosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "legalizacion",
    component: PrestamosFirmadosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "generar-descuentos",
    component: GenerarDescuentosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "cargar-descuentos",
    component: CargarDescuentosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "convenios-pagos",
    component: ConveniosPagosComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "legalizar/:idPrestamo",
    component: LegalizarComponent,
  },
  {
    path: "pagos-individuales",
    component: PagosIndividualesComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditosRoutingModule {}
