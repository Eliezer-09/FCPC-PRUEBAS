import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  /*   {
    path: "colaboradores",
    loadChildren: () =>
      import("./colaboradores/colaboradores-routing.module").then(
        (m) => m.ColaboradoresRoutingModule
      ),
  },
  {
    path: "**",
    redirectTo: "colaboradores",
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NominaRoutingModule {}
