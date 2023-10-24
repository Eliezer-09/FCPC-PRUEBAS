import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { AuthGuard } from "./guards/auth.guard";
import { NoLoginGuard } from "./guards/no-login.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { AtencionUsuarioComponent } from "./pages/atencion-usuario/atencion-usuario.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { ParticipeComponent } from "./pages/participe/participe.component";
import { DashboardComponent } from "./pages/participes/dashboard/dashboard.component";
import { ReportesAnexoComponent } from "./pages/reportes/reportes-anexo/reportes-anexo.component";
import { ReportesEstructuraComponent } from "./pages/reportes/reportes-estructura/reportes-estructura.component";
import { ReportesReporteComponent } from "./pages/reportes/reportes-reporte/reportes-reporte.component";
import { SolicitarTicketComponent } from "./pages/tickets/solicitar-ticket/solicitar-ticket.component";
import { TurnosComponent } from "./pages/turnos/turnos.component";
import { AuthRoutingModule } from "./pages/auth/auth-routing.module";

const routes: Routes = [
  {
    path: "",
    component: CustomLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: DashboardComponent,
      },
      {
        path: "tickets",
        loadChildren: () =>
          import("./pages/tickets/tickets-routing.module").then(
            (m) => m.TicketsRoutingModule
          ),
      },
      {
        path: "contratos",
        loadChildren: () =>
          import("./pages/contratos/contratos-routing.module").then(
            (m) => m.ContratosRoutingModule
          ),
      },
      {
        path: "participes",
        loadChildren: () =>
          import("./pages/participes/participes-routing.module").then(
            (m) => m.ParticipesRoutingModule
          ),
      },
      {
        path: "creditos",
        loadChildren: () =>
          import("./pages/creditos/creditos-routing.module").then(
            (m) => m.CreditosRoutingModule
          ),
      },
      {
        path: "inversiones",
        loadChildren: () =>
          import("./pages/inversiones/inversion-routing.module").then(
            (m) => m.InversionRoutingModule
          ),
      },
      {
        path: "reportes",
        children: [
          {
            path: "reporte",
            component: ReportesReporteComponent,
            canActivate: [PermissionsGuard],
            data: { allowedRoles: ["Administrador"] },
          },
          {
            path: "estructura",
            component: ReportesEstructuraComponent,
            canActivate: [PermissionsGuard],
            data: { allowedRoles: ["Administrador"] },
          },
          {
            path: "anexo",
            component: ReportesAnexoComponent,
            canActivate: [PermissionsGuard],
            data: { allowedRoles: ["Administrador"] },
          },
        ],
      },
      {
        path: "nomina",
        loadChildren: () =>
          import("./pages/nomina/nomina-routing.module").then(
            (m) => m.NominaRoutingModule
          ),
      },
      {
        path: "",
        loadChildren: () =>
          import("./pages/colaboradores/colaboradores-routing.module").then(
            (m) => m.ColaboradoresRoutingModule
          ),
      },
      {
        path: "entidad",
        loadChildren: () =>
          import("./pages/entidad/entidad-routing.module").then(
            (m) => m.EntidadRoutingModule
          ),
      },
      {
        path: "contabilidad",
        loadChildren: () =>
          import("./pages/contabilidad/contabilidad-routing.module").then(
            (m) => m.ContabilidadRoutingModule
          ),
      },
      {
        path: "comprobantes",
        loadChildren: () =>
          import("./pages/comprobantes/comprobantes-routing.module").then(
            (m) => m.ComprobantesRoutingModule
          ),
      },
      {
        path: "auth",
        loadChildren: () =>
          import("./pages/auth/auth-routing.module").then(
            (m) => m.AuthRoutingModule
          ),
      },
    ],
  },
  {
    path: "login", //canActivate: [NoLoginGuard],
    component: LoginComponent,
  },
  {
    path: "atencion-usuario",
    canActivate: [NoLoginGuard],
    component: AtencionUsuarioComponent,
  },
  {
    path: "solicitar-ticket/:servicio",
    canActivate: [NoLoginGuard],
    component: SolicitarTicketComponent,
  },
  {
    path: "participe/:token",
    component: ParticipeComponent,
  },
  {
    path: "turnos",
    component: TurnosComponent,
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
