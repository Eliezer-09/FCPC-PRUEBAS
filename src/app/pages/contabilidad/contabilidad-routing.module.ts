import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContextMenuService } from "primeng/api";
import { CuentaContableComponent } from "./pages/cuenta-contable/cuenta-contable.component";
import { PermissionsGuard } from "src/app/guards/permissions.guard";
import { FormLibroDiarioComponent } from "./pages/libro-diario/registro/form-libro-diario/form-libro-diario.component";

import { TableLibroDiarioComponent } from "./pages/libro-diario/table-libro-diario/table-libro-diario.component";
import { ViewAsientoComponent } from "./pages/libro-diario/view-asiento/view-asiento.component";


const routes: Routes = [
  {
    path: "asiento-contable",
    component: TableLibroDiarioComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },

  {
    path: "agregar-diario-contable",
    component: FormLibroDiarioComponent,
  },
  {
    path: "editar-diario-contable",
    component: FormLibroDiarioComponent,
  },
  {
    path: "plan-contable",
    component: CuentaContableComponent,
  },
  {
    path: "ver-asiento-contable/:id",
    component: ViewAsientoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
   providers: [ContextMenuService],
})
export class ContabilidadRoutingModule {}
