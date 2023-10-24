import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EntidadComponent } from "./entidad.component";
import { MatNativeDateModule } from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputMaskModule } from "@ngneat/input-mask";
import { SidebarModule } from "primeng/sidebar";
import { ComponentsModule } from "src/app/components/components.module";
import { AngularMaterialModule } from "../angular-material.module";
import { ArchivosColaboradorModule } from "../colaboradores/components/archivos-colaborador/archivos-colaborador.module";
import { ModalsColaboradoresModule } from "../colaboradores/components/modals/modals-colaboradores.module";
import { EntidadRoutingModule } from "./entidad-routing.module";
import { EntidadHeaderComponent } from "./components/entidad-header/entidad-header.component";
import { UnidadesListadoComponent } from "./pages/unidades/unidades-listado/unidades-listado.component";
import { AgregarUnidadComponent } from "./pages/unidades/agregar-unidad/agregar-unidad.component";
import { AddAreaSubModule } from "./components/agregar-area-subarea/add-area-sub.module";
import { AgregarCargoComponent } from "./pages/cargos/agregar-cargo/agregar-cargo.component";
import { ListadoCargoComponent } from "./pages/cargos/listado-cargo/listado-cargo.component";
import { HistorialCargoComponent } from "./pages/cargos/historial-cargo/historial-cargo.component";

@NgModule({
  imports: [
    EntidadRoutingModule,
    ArchivosColaboradorModule,
    CommonModule,
    BrowserModule,
    MatNativeDateModule,
    SidebarModule,

    InputMaskModule,
    ModalsColaboradoresModule,

    ComponentsModule,

    BrowserAnimationsModule,
    AddAreaSubModule,
    AngularMaterialModule,
  ],

  declarations: [
    AgregarCargoComponent,
    ListadoCargoComponent,
    HistorialCargoComponent,
    EntidadComponent,
    EntidadHeaderComponent,
    UnidadesListadoComponent,

    AgregarUnidadComponent,
  ],
})
export class EntidadModule {}
