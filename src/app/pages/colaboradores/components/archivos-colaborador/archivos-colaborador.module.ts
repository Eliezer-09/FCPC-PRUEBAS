import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ArchivosColaboradorComponent } from "./archivos-colaborador.component";
import { ArchivoColaboradorComponent } from "./archivo-colaborador/archivo-colaborador.component";
import { AngularMaterialModule } from "src/app/pages/angular-material.module";

@NgModule({
  declarations: [ArchivosColaboradorComponent, ArchivoColaboradorComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [ArchivosColaboradorComponent, ArchivoColaboradorComponent],
})
export class ArchivosColaboradorModule {}
