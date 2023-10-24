import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";
import { ParticipeAprobadoComponent } from "./participe-aprobado/participe-aprobado.component";
import { ParticipePendienteComponent } from "./participe-pendiente/participe-pendiente.component";
import { ParticipeRechazadoComponent } from "./participe-rechazado/participe-rechazado.component";
import { DetallesComponent } from "./detalles/detalles.component";
import { ParticipeActivoComponent } from "./participe-activo/participe-activo.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CreditosService } from "../creditos/creditos.service";
import { ContratosRoutingModule } from "./contratos-routing.module";
import { ComponentsModule } from "../../components/components.module";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ScrollbarModule } from "../../../@vex/components/scrollbar/scrollbar.module";

@NgModule({
  declarations: [
    DetallesComponent,
    ParticipeActivoComponent,
    ParticipeAprobadoComponent,
    ParticipePendienteComponent,
    ParticipeRechazadoComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    ContratosRoutingModule,
    ComponentsModule,
    MatSidenavModule,
    ScrollbarModule,
  ],
  exports: [
    DetallesComponent,
    ParticipeActivoComponent,
    ParticipeAprobadoComponent,
    ParticipePendienteComponent,
    ParticipeRechazadoComponent,
  ],
  providers: [CreditosService],
})
export class ContratosModule {}
