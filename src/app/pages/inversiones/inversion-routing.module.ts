import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InversionesActivasComponent } from "./inversiones-activas/inversiones-activas.component";
import { CatalogoInversionComponent } from "./catalogo-inversion/catalogo-inversion.component";
import { RegistroComponent } from "./registro/registro.component";
import { VectorComponent } from "./vector/vector.component";
import { DetallesInversionComponent } from "./inversiones-activas/detalles-inversion/detalles-inversion.component";
import { ControllerCalificadoraComponent } from "./catalogo-inversion/calificadora-riesgos/controller-calificadora/controller-calificadora.component";
import { ViewCalificadoraRiesgosComponent } from "./catalogo-inversion/calificadora-riesgos/view-calificadora-riesgos/view-calificadora-riesgos.component";
import { ControllerEmisorComponent } from "./catalogo-inversion/emisores-valores/controller-emisor/controller-emisor.component";
import { ViewEmisorComponent } from "./catalogo-inversion/emisores-valores/view-emisor/view-emisor.component";
import { ViewCasaValorComponent } from "./catalogo-inversion/casa-valores/view-casa-valor/view-casa-valor.component";
import { ControllerCasaValorComponent } from "./catalogo-inversion/casa-valores/controller-casa-valor/controller-casa-valor.component";
import { PermissionsGuard } from "src/app/guards/permissions.guard";

const routes: Routes = [
  {
    path: "registro",
    component: RegistroComponent,
  },
  {
    path: "catalogos",
    component: CatalogoInversionComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "consultas",
    component: InversionesActivasComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "cargar-vectores",
    component: VectorComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "detalle/:id",
    component: DetallesInversionComponent,
  },
  {
    path: "detalle-calificadora/:id",
    component: ViewCalificadoraRiesgosComponent,
  },
  {
    path: "agregar-calificadora-riesgo",
    component: ControllerCalificadoraComponent,
  },
  {
    path: "editar-calificadora-riesgo/:id",
    component: ControllerCalificadoraComponent,
    data: { allowEdit: true, title: "Editar Calificadora de Riesgo" },
  },
  {
    path: "agregar-emisor",
    component: ControllerEmisorComponent,
  },
  {
    path: "editar-emisor/:id",
    component: ControllerEmisorComponent,
    data: { allowEdit: true, title: "Editar Emisor" },
  },
  {
    path: "detalle-emisor/:id",
    component: ViewEmisorComponent,
  },
  {
    path: "agregar-casa-valor",
    component: ControllerCasaValorComponent,
  },
  {
    path: "editar-casa-valor/:id",
    component: ControllerCasaValorComponent,
    data: { allowEdit: true, title: "Editar Casa de Valor" },
  },
  {
    path: "detalle-casa-valor/:id",
    component: ViewCasaValorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InversionRoutingModule {}
