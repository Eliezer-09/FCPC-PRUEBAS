import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { environment } from "src/environments/environment";
import { AgregarColaboradorComponent } from "./pages/agregar-colaborador/agregar-colaborador.component";
import { HomeColaboradoresComponent } from "./pages/home-colaboradores/home-colaboradores.component";
import { ListadoColaboradoresComponent } from "./pages/listado-colaboradores/listado-colaboradores.component";
import { ListadoEmpleadosComponent } from "./pages/listado-empleados/listado-empleados.component";
import { ListadoPasantesComponent } from "./pages/listado-pasantes/listado-pasantes.component";
import { DetalleColaboradorComponent } from "./pages/colaborador/detalle-colaborador/detalle-colaborador.component";
import { CargarIngresosEgresosComponent } from "./pages/cargar-ingresos-egresos/cargar-ingresos-egresos.component";
import { DiasNoLaborablesComponent } from "./pages/dias-no-laborables/dias-no-laborables.component";
import { VacacionesComponent } from "./pages/vacaciones/vacaciones.component";
import { PeticionVacacionesComponent } from "./pages/vacaciones/peticion-vacaciones/peticion-vacaciones.component";
import { VacacionesTthhComponent } from "./pages/vacaciones/vacaciones-tthh/vacaciones-tthh.component";

const routes: Routes = [
  {
    path: "",
    component: HomeColaboradoresComponent,

    children: [
      {
        path: "redep",
        component: ListadoEmpleadosComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },
      {
        path: "honorarios",
        component: ListadoColaboradoresComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },
      {
        path: "pasantes",
        component: ListadoPasantesComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },

      {
        path: ":tipo/agregar",
        component: AgregarColaboradorComponent,
      },

      {
        path: ":tipo/editar/:id",
        component: AgregarColaboradorComponent,
      },

      {
        path: ":tipo/ver/:id",
        component: AgregarColaboradorComponent,
      },
      {
        path: ":tipo/detalle/ver/:id",
        component: DetalleColaboradorComponent,
      },
    ],
  },
  {
    path:"cargar-nomina",
    component: CargarIngresosEgresosComponent
  },
  {
    path: "dias-no-laborables",
    component: DiasNoLaborablesComponent,
    data: { allowedRoles: ["User"] },
  },
  {
    path: "vacaciones",
    component: VacacionesComponent,
    data: { allowedRoles: ["User"] },
  },

  {
    path: "solicitud-vacaciones",
    component: PeticionVacacionesComponent,
    data: { allowedRoles: ["User"] },
  },

  {
    path: "vacaciones-aprobar",
    component: VacacionesTthhComponent,
    data: { allowedRoles: ["User"] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColaboradoresRoutingModule {}
