import { NgModule } from "@angular/core";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ColaboradoresRoutingModule } from "./colaboradores-routing.module";
import { AgregarColaboradorComponent } from "./pages/agregar-colaborador/agregar-colaborador.component";
import { ColaboradorComponent } from "./pages/colaborador/colaborador.component";
import { HomeColaboradoresComponent } from "./pages/home-colaboradores/home-colaboradores.component";
import { ListadoColaboradoresComponent } from "./pages/listado-colaboradores/listado-colaboradores.component";
import { ComponentsModule } from "src/app/components/components.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "../angular-material.module";
import { ArchivosColaboradorModule } from "./components/archivos-colaborador/archivos-colaborador.module";
import { ModalsColaboradoresModule } from "./components/modals/modals-colaboradores.module";
import { DatosCargasFamiliaresColaboradorComponent } from "./pages/agregar-colaborador/components/datos-cargas-familiares-colaborador/datos-cargas-familiares-colaborador.component";
import { DatosContactosColaboradorComponent } from "./pages/agregar-colaborador/components/datos-contactos-colaborador/datos-contactos-colaborador.component";
import { DatosContratoColaboradorComponent } from "./pages/agregar-colaborador/components/datos-contrato-colaborador/datos-contrato-colaborador.component";
import { DatosInformacionLaboralColaboradorComponent } from "./pages/agregar-colaborador/components/datos-informacion-laboral-colaborador/datos-informacion-laboral-colaborador.component";
import { DatosPersonalesColaboradorComponent } from "./pages/agregar-colaborador/components/datos-personales-colaborador/datos-personales-colaborador.component";
import { DatosReferenciaBancariaColaboradorComponent } from "./pages/agregar-colaborador/components/datos-referencia-bancaria-colaborador/datos-referencia-bancaria-colaborador.component";
import { DatosReferenciaPersonalColaboradorComponent } from "./pages/agregar-colaborador/components/datos-referencia-personal-colaborador/datos-referencia-personal-colaborador.component";
import { DatosTransporteColaboradorComponent } from "./pages/agregar-colaborador/components/datos-transporte-colaborador/datos-transporte-colaborador.component";
import { DireccionComponent } from "./pages/agregar-colaborador/components/direccion/direccion.component";
import { DocumentosLegalesColaboradorComponent } from "./pages/agregar-colaborador/components/documentos-legales-colaborador/documentos-legales-colaborador.component";
import { FormacionAcademicaColaboradorComponent } from "./pages/agregar-colaborador/components/formacion-academica-colaborador/formacion-academica-colaborador.component";
import { HistorialInternoColaboradorComponent } from "./pages/agregar-colaborador/components/historial-interno-colaborador/historial-interno-colaborador.component";
import { ListadoEmpleadosComponent } from "./pages/listado-empleados/listado-empleados.component";
import { BrowserModule } from "@angular/platform-browser";
import { InputMaskModule } from "@ngneat/input-mask";
import { ListadoPasantesComponent } from "./pages/listado-pasantes/listado-pasantes.component";
import { CommonModule } from "@angular/common";
import { MatNativeDateModule } from "@angular/material/core";
import { SidebarModule } from "primeng/sidebar";
import { DocumentosIngresoComponent } from "./pages/agregar-colaborador/components/documentos-ingreso/documentos-ingreso.component";
import { DetalleColaboradorComponent } from "./pages/colaborador/detalle-colaborador/detalle-colaborador.component";
import { CargarIngresosEgresosModule } from "./pages/cargar-ingresos-egresos/cargar-ingresos-egresos.module";
import { DescuentosColaboradorComponent } from "./pages/colaborador/descuentos-colaborador/descuentos-colaborador.component";
import { UtilsService } from "./utils/utils.service";
import { VacacionesColaboradorComponent } from './pages/colaborador/vacaciones-colaborador/vacaciones-colaborador.component';
import { AgregarDescuentoComponent } from './pages/colaborador/descuentos-colaborador/agregar-descuento/agregar-descuento.component';
import { AgregarVacacionesComponent } from './pages/colaborador/vacaciones-colaborador/agregar-vacaciones/agregar-vacaciones.component';
import { DatosColaboradorComponent } from "./pages/colaborador/detalle-colaborador/datos-colaborador/datos-colaborador.component";
import { DiasNoLaborablesComponent } from './pages/dias-no-laborables/dias-no-laborables.component';
import { AgregarDiaNoLaboralComponent } from './pages/dias-no-laborables/agregar-dia-no-laboral/agregar-dia-no-laboral.component';
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { PeticionVacacionesComponent } from './pages/vacaciones/peticion-vacaciones/peticion-vacaciones.component';
import { IngresosColaboradorComponent } from "./pages/colaborador/detalle-colaborador/ingresos-colaborador/ingresos-colaborador.component";
import { DetalleVacacionesComponent } from './pages/vacaciones/peticion-vacaciones/detalle-vacaciones/detalle-vacaciones.component';
import { VacacionesTthhComponent } from './pages/vacaciones/vacaciones-tthh/vacaciones-tthh.component';

@NgModule({
  providers: [UtilsService],
  declarations: [
    
    HomeColaboradoresComponent,
    ColaboradorComponent,
    AgregarColaboradorComponent,
    ListadoColaboradoresComponent,
    DatosPersonalesColaboradorComponent,
    FormacionAcademicaColaboradorComponent,

    DatosContratoColaboradorComponent,
    DocumentosLegalesColaboradorComponent,
    ListadoPasantesComponent,
    HistorialInternoColaboradorComponent,
    DireccionComponent,
    DatosTransporteColaboradorComponent,
    DatosCargasFamiliaresColaboradorComponent,
    ListadoEmpleadosComponent,
    DatosContactosColaboradorComponent,
    DatosReferenciaPersonalColaboradorComponent,
    DatosInformacionLaboralColaboradorComponent,
    DatosReferenciaBancariaColaboradorComponent,
    DocumentosIngresoComponent,
    DetalleColaboradorComponent,
    DescuentosColaboradorComponent,
    VacacionesColaboradorComponent,
    AgregarDescuentoComponent,
    AgregarVacacionesComponent,
    IngresosColaboradorComponent,
    DatosColaboradorComponent,
    DiasNoLaborablesComponent,
    AgregarDiaNoLaboralComponent,
    VacacionesComponent,
    PeticionVacacionesComponent,
    DetalleVacacionesComponent,
    VacacionesTthhComponent
  ],
  imports: [
    ColaboradoresRoutingModule,
    ArchivosColaboradorModule,
    CommonModule,
    BrowserModule,
    MatNativeDateModule,
    SidebarModule,
    MatProgressBarModule,
    InputMaskModule,
    ModalsColaboradoresModule,

    ComponentsModule,

    BrowserAnimationsModule,

    AngularMaterialModule,
    InputMaskModule,
    ComponentsModule,
    CargarIngresosEgresosModule
  ],
  exports: [],
})
export class ColaboradoresModule {}
