import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParticipeCorreoActualizarComponent } from "./participe-correo-actualizar/participe-correo-actualizar.component";
import { ParticipeAdherirComponent } from "./participe-adherir/participe-adherir.component";
import { PosicionConsolidadaComponent } from "./posicion-consolidada/posicion-consolidada.component";
import { ParticipeActualizarComponent } from "./participe-actualizar/participe-actualizar.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "src/app/app-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InfoParticipeComponent } from "./posicion-consolidada/info-participe/info-participe.component";
import { CreditosParticipeComponent } from "./posicion-consolidada/creditos-participe/creditos-participe.component";
import { PosicionConsolidadaParticipeComponent } from "./posicion-consolidada/posicion-consolidada-participe/posicion-consolidada-participe.component";
import { MatTabsModule } from "@angular/material/tabs";
import { ValoresComponent } from "./posicion-consolidada/posicion-consolidada-participe/valores/valores.component";

import { ChartModule } from "../../../@vex/components/chart/chart.module";
import { ParticipesService } from "./participes.service";
import { ModalComentarComponent } from "./posicion-consolidada/info-participe/modal-comentar/modal-comentar.component";
import { ActividadesComponent } from "./posicion-consolidada/info-participe/actividades/actividades.component";
import { ModalCorreoComponent } from "./posicion-consolidada/info-participe/modal-correo/modal-correo.component";
import { ParticipesRoutingModule } from "./participes-routing.module";
import { CesantesService } from "./cesantes.service";
import { LiquidarComponent } from "./liquidar-cesantia/liquidar/liquidar.component";
import { RegistroComponent } from "../inversiones/registro/registro.component";
import { RegistroCesanteComponent } from "./registro-cesante/registro-cesante.component";
import { ActualizarDatosComponent } from "./registro-cesante/actualizar-datos/actualizar-datos.component";
import { DatosCesanteComponent } from "./registro-cesante/datos-cesante/datos-cesante.component";
import { ListaCesantesComponent } from "./lista-cesantes/lista-cesantes.component";
import { MatStepperModule } from "@angular/material/stepper";
import { InfoCesanteComponent } from "./liquidar-cesantia/info-cesante/info-cesante.component";
import { LiquidarCesantiaComponent } from "./liquidar-cesantia/liquidar-cesantia.component";
import { ComponentsModule } from "../../components/components.module";
import { ScrollbarModule } from "../../../@vex/components/scrollbar/scrollbar.module";
import { CargarRolesModule } from "./cargar-roles/cargar-roles.module";
import { AporteAdicionalComponent } from "./aporte-adicional/aporte-adicional.component";
import { ModalDatosBancariosModule } from "../../components/referencias-bancarias/modal-edit-datos-bancarios/modal-datos-bancarios.module";
import { DatosParticipeComponent } from './participe-actualizar/datos-participe/datos-participe.component';
import { ComponentsParticipeModule } from "./components/components.module";
import { PerfilEconomicoComponent } from "./participe-actualizar/perfil-economico/perfil-economico.component";
import { InputMaskModule } from "@ngneat/input-mask";
import { CargarAportesModule } from "./cargar-aportes/cargar-aportes.module";


@NgModule({
  declarations: [
    DashboardComponent,
    ParticipeCorreoActualizarComponent,
    ParticipeAdherirComponent,
    PosicionConsolidadaComponent,
    ParticipeActualizarComponent,
    InfoParticipeComponent,
    CreditosParticipeComponent,
    PosicionConsolidadaParticipeComponent,
    ValoresComponent,
    ModalComentarComponent,
    ActividadesComponent,
    ModalCorreoComponent,
    LiquidarComponent,
    RegistroCesanteComponent,
    ActualizarDatosComponent,
    DatosCesanteComponent,
    ListaCesantesComponent,
    InfoCesanteComponent,
    LiquidarCesantiaComponent,
    AporteAdicionalComponent,
    DatosParticipeComponent,
    PerfilEconomicoComponent,
  ],
  exports: [
    DashboardComponent,
    ParticipeCorreoActualizarComponent,
    ParticipeAdherirComponent,
    PosicionConsolidadaComponent,
    ParticipeActualizarComponent,
    InfoParticipeComponent,
    CreditosParticipeComponent,
    PosicionConsolidadaParticipeComponent,
    ValoresComponent,
    ModalComentarComponent,
    ActividadesComponent,
    ModalCorreoComponent,
    AngularMaterialModule,
    LiquidarComponent,
    RegistroCesanteComponent,
    ActualizarDatosComponent,
    DatosCesanteComponent,
    ListaCesantesComponent,
    LiquidarCesantiaComponent,
    InfoCesanteComponent,
    DatosParticipeComponent,
    PerfilEconomicoComponent,
  ],
  entryComponents: [ModalComentarComponent, ModalCorreoComponent],
  providers: [ParticipesService, CesantesService],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatTabsModule,
    ModalDatosBancariosModule,
    CommonModule,
    ChartModule,
    ParticipesRoutingModule,
    MatStepperModule,
    ComponentsModule,
    ScrollbarModule,
    CargarRolesModule,
    ComponentsParticipeModule,
    InputMaskModule,
    CargarAportesModule
  ],
})
export class ParticipesModule {}
