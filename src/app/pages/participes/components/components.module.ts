import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { AgregarDireccionesComponent, DireccionesComponent } from "./direcciones/direcciones.component";
import { AngularMaterialModule } from "../../angular-material.module";
import { ScrollbarModule } from "src/@vex/components/scrollbar/scrollbar.module";
import { MatSpinnerComponent } from "src/app/components/mat-spinner/mat-spinner.component";
import { ComponentsModule } from "src/app/components/components.module";
import { AgregarContactosComponent, ContactosComponent } from "./contactos/contactos.component";


@NgModule({
  declarations: [
    DireccionesComponent,
    AgregarDireccionesComponent,
    ContactosComponent,
    AgregarContactosComponent
  ],
  exports: [
    DireccionesComponent,
    AgregarDireccionesComponent,
    ContactosComponent,
    AgregarContactosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    MatRippleModule,
    ScrollbarModule,
    ComponentsModule
  ],
  entryComponents: [MatSpinnerComponent],
})
export class ComponentsParticipeModule {}
