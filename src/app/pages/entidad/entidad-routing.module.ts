import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { EntidadComponent } from "./entidad.component";
import { HistorialCargoComponent } from "./pages/cargos/historial-cargo/historial-cargo.component";
import { ListadoCargoComponent } from "./pages/cargos/listado-cargo/listado-cargo.component";
import { AgregarUnidadComponent } from "./pages/unidades/agregar-unidad/agregar-unidad.component";
import { UnidadesListadoComponent } from "./pages/unidades/unidades-listado/unidades-listado.component";

const routes: Routes = [
  {
    path: "",
    component: EntidadComponent,

    children: [
      {
        path: "departamentos",
        component: UnidadesListadoComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },
      {
        path: "departamentos/agregar",
        component: AgregarUnidadComponent,
      },
      {
        path: "departamentos/editar/:id",
        component: AgregarUnidadComponent,
      },
      {
        path: "departamentos/ver/:id",
        component: AgregarUnidadComponent,
      },
      {
        path: "cargos",
        component: ListadoCargoComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },

      {
        path: "cargos/historial",
        component: HistorialCargoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntidadRoutingModule {}
