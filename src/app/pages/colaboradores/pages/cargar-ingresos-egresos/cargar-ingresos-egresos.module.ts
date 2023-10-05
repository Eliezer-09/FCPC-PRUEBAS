import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ComponentsModule } from "../../../../components/components.module";
import { ScrollbarModule } from "../../../../../@vex/components/scrollbar/scrollbar.module";
import { IngresosEgresosComponentComponent } from './ingresos-egresos/ingresos-egresos.component';
import { CargarIngresosEgresosComponent } from './cargar-ingresos-egresos.component';
import { SeccionCargarIngresosEgresosComponent } from './seccion-cargar-ingresos-egresos/seccion-cargar-ingresos-egresos.component';
import { SeccionBuscarIngresosEgresosComponent } from './seccion-buscar-ingresos-egresos/seccion-buscar-ingresos-egresos.component';




@NgModule({
    declarations: [
        CargarIngresosEgresosComponent,
        IngresosEgresosComponentComponent,
        SeccionCargarIngresosEgresosComponent,
        SeccionBuscarIngresosEgresosComponent
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
