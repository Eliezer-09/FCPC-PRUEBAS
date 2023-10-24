import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetallesCreditosComponent } from "./detalles-creditos/detalles-creditos.component";
import { PrestamosAprobadosComponent } from "./prestamos-aprobados/prestamos-aprobados.component";
import { PrestamosFirmadosComponent } from "./prestamos-firmados/prestamos-firmados.component";
import { PrestamosPendientesComponent } from "./prestamos-pendientes/prestamos-pendientes.component";
import { PrestamosRechazadosComponent } from "./prestamos-rechazados/prestamos-rechazados.component";
import { PrestamosTransferidosComponent } from "./prestamos-transferidos/prestamos-transferidos.component";
import { SimuladorComponent } from "./pages/simulador/simulador.component";
import { ModalPagareFirmadoComponent } from "./modal-pagare-firmado/modal-pagare-firmado.component";
import { ModalTablaAmortizacionComponent } from "./modal-tabla-amortizacion/modal-tabla-amortizacion.component";
import { ModalValidacionSolicitudComponent } from "./pages/simulador/modal-validacion-solicitud/modal-validacion-solicitud.component";
import { ModalAcreditacionComponent } from "./prestamos-aprobados/componentes/modal-acreditacion/modal-acreditacion.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "src/app/app-routing.module";
import { GenerarDescuentosComponent } from "./generar-descuentos/generar-descuentos.component";
import { CargarDescuentosComponent } from "./cargar-descuentos/cargar-descuentos.component";
import { PrestamosAnuladosComponent } from "./prestamos-anulados/prestamos-anulados.component";
import { PrestamosPagadosComponent } from "./prestamos-pagados/prestamos-pagados.component";
import { TablaAmortizacionComponent } from "./detalles-creditos/tabla-amortizacion/tabla-amortizacion.component";
import { CreditosService } from "./creditos.service";
import { PagosComponent } from "./detalles-creditos/pagos/pagos.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConveniosPagosComponent } from "./convenios-pagos/convenios-pagos.component";
import { LegalizarComponent } from "./detalles-creditos/legalizar/legalizar.component";
import { AdjuntosComponent } from "./detalles-creditos/adjuntos/adjuntos.component";
import { InfoCreditoComponent } from "./detalles-creditos/info-credito/info-credito.component";
import { InfoParticipeComponent } from "./detalles-creditos/info-participe/info-participe.component";
import { AcreditacionUniformadoComponent } from "./detalles-creditos/acreditacion-uniformado/acreditacion-uniformado.component";
import { AcreditacionComponent } from "./detalles-creditos/acreditacion/acreditacion.component";
import { ActividadCreditoComponent } from "./detalles-creditos/actividad-credito/actividad-credito.component";
import { AdjuntosParticipeComponent } from "./detalles-creditos/adjuntos-participe/adjuntos-participe.component";
import { CreditosRoutingModule } from "./creditos-routing.module";
import { PagosIndividualesComponent } from "./pagos-individuales/pagos-individuales.component";
import { ComponentsModule } from "../../components/components.module";
import { ScrollbarModule } from "src/@vex/components/scrollbar/scrollbar.module";
import { ModalDatosBancariosModule } from "../../components/referencias-bancarias/modal-edit-datos-bancarios/modal-datos-bancarios.module";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ActualizarDatosParticipeComponent } from './pages/solicitudes-creditos/actualizar-datos-participe/actualizar-datos-participe.component';
import { ParticipesModule } from "../participes/participes.module";
import { CalculadoraComponent } from './pages/simulador/calculadora/calculadora.component';
import { EstadisticaComponent } from './pages/simulador/estadistica/estadistica.component';
import { InputMaskModule } from "@ngneat/input-mask";
import { ModalTableAmortizacionComponent } from "./components/modal-table-amortizacion/modal-table-amortizacion.component";
import { PrestamosComponent } from "./pages/simulador/prestamos/prestamos.component";
import { SolicitudesCreditosComponent } from "./pages/solicitudes-creditos/solicitudes-creditos.component";
import { RefinanciamientoComponent } from "./pages/solicitudes-creditos/refinanciamiento/refinanciamiento.component";
import { NovacionComponent } from "./pages/solicitudes-creditos/novacion/novacion.component";
import { NormalComponent } from "./pages/solicitudes-creditos/normal/normal.component";
import { RestructuracionComponent } from "./pages/solicitudes-creditos/restructuracion/restructuracion.component";
import { GaranteComponent } from "./pages/solicitudes-creditos/garante/garante.component";
import { FilesGaranteComponent } from "./pages/solicitudes-creditos/garante/files-garante/files-garante.component";
import { TablaGarantesComponent } from "./pages/solicitudes-creditos/garante/tabla-garantes/tabla-garantes.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { GarantesCreditoComponent } from "./detalles-creditos/garantes-creditos/garantes-creditos.component";
@NgModule({
  declarations: [
    DetallesCreditosComponent,
    ModalPagareFirmadoComponent,
    ModalTablaAmortizacionComponent,
    ModalAcreditacionComponent,
    ModalValidacionSolicitudComponent,
    PrestamosAprobadosComponent,
    PrestamosFirmadosComponent,
    PrestamosPendientesComponent,
    PrestamosRechazadosComponent,
    PrestamosTransferidosComponent,
    SimuladorComponent,
    GenerarDescuentosComponent,
    CargarDescuentosComponent,
    PrestamosAnuladosComponent,
    PrestamosPagadosComponent,
    SolicitudesCreditosComponent,
    NovacionComponent,
    NormalComponent,
    RestructuracionComponent,
    RefinanciamientoComponent,
    TablaAmortizacionComponent,
    PagosComponent,
    ConveniosPagosComponent,
    LegalizarComponent,
    InfoCreditoComponent,
    InfoParticipeComponent,
    AcreditacionUniformadoComponent,
    AcreditacionComponent,
    ActividadCreditoComponent,
    AdjuntosParticipeComponent,
    PagosIndividualesComponent,
    AdjuntosComponent,
    ActualizarDatosParticipeComponent,
    CalculadoraComponent,
    EstadisticaComponent,
    PrestamosComponent,
    ModalTableAmortizacionComponent,
    GaranteComponent,
    FilesGaranteComponent,
    TablaGarantesComponent,
    GarantesCreditoComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatSortModule,
    MatTableModule,
    CreditosRoutingModule,
    ScrollbarModule,
    ModalDatosBancariosModule,
    ComponentsModule,
    ParticipesModule,
    InputMaskModule,
    MatAutocompleteModule,
    MatFormFieldModule 
  ],
  exports: [
    DetallesCreditosComponent,
    ModalPagareFirmadoComponent,
    ModalAcreditacionComponent,
    ModalTablaAmortizacionComponent,
    ModalValidacionSolicitudComponent,
    NormalComponent,
    PrestamosAprobadosComponent,
    PrestamosFirmadosComponent,
    PrestamosPendientesComponent,
    PrestamosRechazadosComponent,
    PrestamosAnuladosComponent,
    PrestamosTransferidosComponent,
    PrestamosPagadosComponent,
    SimuladorComponent,
    NovacionComponent,
    RestructuracionComponent,
    RefinanciamientoComponent,
    TablaAmortizacionComponent,
    PagosComponent,
    ConveniosPagosComponent,
    InfoCreditoComponent,
    InfoParticipeComponent,
    AcreditacionUniformadoComponent,
    AcreditacionComponent,
    ActividadCreditoComponent,
    AdjuntosParticipeComponent,
    AdjuntosComponent,
    CalculadoraComponent
  ],
  providers: [CreditosService],
})
export class CreditosModule {}
