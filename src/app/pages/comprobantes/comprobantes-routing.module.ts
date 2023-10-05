import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { HomeComprobantesComponent } from "./pages/home-comprobantes/home-comprobantes.component";
import { ListadoComprobantesComponent } from "./pages/listado-comprobantes/listado-comprobantes.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComprobantesComponent,
    children: [
      {
        path: "",
        component: ListadoComprobantesComponent,
        canActivate: [PermissionsGuard],
        data: { allowedRoles: ["User"] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprobantesRoutingModule {}
