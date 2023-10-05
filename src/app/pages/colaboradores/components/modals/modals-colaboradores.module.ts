import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalCargaFamiliarColaboradorComponent } from "./modal-carga-familiar-colaborador/modal-carga-familiar-colaborador.component";
import { ModalContactoColaboradorComponent } from "./modal-contacto-colaborador/modal-contacto-colaborador.component";
import { ModalDirecccionColaboradorComponent } from "./modal-direcccion-colaborador/modal-direcccion-colaborador.component";
import { ModalFormacionAcademicaComponent } from "./modal-formacion-academica/modal-formacion-academica.component";
import { ModalReferenciaBancariaColaboradorComponent } from "./modal-referencia-bancaria-colaborador/modal-referencia-bancaria-colaborador.component";
import { ModalReferenciaPersonalColaboradorComponent } from "./modal-referencia-personal-colaborador/modal-referencia-personal-colaborador.component";
import { ModalTransporteColaboradorComponent } from "./modal-transporte-colaborador/modal-transporte-colaborador.component";
import { ArchivosColaboradorModule } from "../archivos-colaborador/archivos-colaborador.module";
import { AngularMaterialModule } from "src/app/pages/angular-material.module";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  declarations: [
    ModalFormacionAcademicaComponent,
    ModalContactoColaboradorComponent,
    ModalCargaFamiliarColaboradorComponent,
    ModalDirecccionColaboradorComponent,
    ModalReferenciaBancariaColaboradorComponent,
    ModalReferenciaPersonalColaboradorComponent,
    ModalTransporteColaboradorComponent,
  ],
  exports: [
    ModalFormacionAcademicaComponent,
    ModalContactoColaboradorComponent,
    ModalCargaFamiliarColaboradorComponent,
    ModalDirecccionColaboradorComponent,
    ModalReferenciaBancariaColaboradorComponent,
    ModalReferenciaPersonalColaboradorComponent,
    ModalTransporteColaboradorComponent,
  ],
  imports: [
    CommonModule,

    ArchivosColaboradorModule,
    AngularMaterialModule,

    ComponentsModule,
  ],
})
export class ModalsColaboradoresModule {}
