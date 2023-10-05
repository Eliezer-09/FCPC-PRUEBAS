import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgregarAreaSubareaComponent } from "./agregar-area-subarea.component";
import { ComponentsModule } from "src/app/components/components.module";
import { AngularMaterialModule } from "src/app/pages/angular-material.module";
import { ArchivosColaboradorModule } from "src/app/pages/colaboradores/components/archivos-colaborador/archivos-colaborador.module";

@NgModule({
  imports: [
    CommonModule,

    ArchivosColaboradorModule,
    AngularMaterialModule,

    ComponentsModule,
  ],
  declarations: [AgregarAreaSubareaComponent],
  exports: [AgregarAreaSubareaComponent],
})
export class AddAreaSubModule {}
