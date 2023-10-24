import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ComponentsModule } from "../../../../components/components.module";
import { ScrollbarModule } from "../../../../../@vex/components/scrollbar/scrollbar.module";
import { IngresosEgresosComponent } from './ingresos-egresos/ingresos-egresos.component';
import { CargarIngresosEgresosComponent } from './cargar-ingresos-egresos.component';
import { SeccionCargarIngresosEgresosComponent } from './seccion-cargar-ingresos-egresos/seccion-cargar-ingresos-egresos.component';
import { SeccionBuscarIngresosEgresosComponent } from './seccion-buscar-ingresos-egresos/seccion-buscar-ingresos-egresos.component';
import { DialogCopyTextComponent } from './components/dialog-copy-text/dialog-copy-text.component';
import { ListadoNominaComponent } from './listado-nomina/listado-nomina.component';
import { RubrosTableComponent } from './components/rubros-table/rubros-table.component';
import { ListadoNominaColaboradorComponent } from './components/listado-nomina-colaborador/listado-nomina-colaborador.component';
import { HistoryIngresosEgresosComponent } from './history-ingresos-egresos/history-ingresos-egresos.component';
import { PagoNominaComponent } from './pagos-nomina/pagos-nomina.component';



@NgModule({
    declarations: [
        CargarIngresosEgresosComponent,
        IngresosEgresosComponent,
        SeccionCargarIngresosEgresosComponent,
        SeccionBuscarIngresosEgresosComponent,
        DialogCopyTextComponent,
        ListadoNominaComponent,
        RubrosTableComponent,
        ListadoNominaColaboradorComponent,
        HistoryIngresosEgresosComponent,
        PagoNominaComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        CommonModule,
        ComponentsModule,
        ScrollbarModule
    ]
})
export class CargarIngresosEgresosModule { }
