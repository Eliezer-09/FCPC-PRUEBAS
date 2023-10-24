import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { InputMaskModule } from '@ngneat/input-mask';
import { ScrollbarModule } from "../../../@vex/components/scrollbar/scrollbar.module";
import { FormLibroDiarioComponent } from './pages/libro-diario/registro/form-libro-diario/form-libro-diario.component';
import { ModalAsientoContableComponent } from './pages/libro-diario/registro/modal-asiento-contable/modal-asiento-contable.component';
import { CdkDetailRowDirective } from './directive/cdk-detail-row.directive';
import { TableAsientosContablesComponent } from './pages/libro-diario/table-asientos-contables/table-asientos-contables.component';

import {TableModule} from 'primeng/table';
import {SliderModule} from 'primeng/slider';
import {ButtonModule} from 'primeng/button';
import { ViewAsientoComponent } from './pages/libro-diario/view-asiento/view-asiento.component';
import { TableLibroDiarioCerradoComponent } from './pages/libro-diario/table-libro-diario/table-libro-diario-Cerrado/table-libro-diario-cerrado.component';
import { TableLibroDiarioBorradorComponent } from './pages/libro-diario/table-libro-diario/table-libro-diario-borrador/table-libro-diario-borrador.component';
import { TableLibroDiarioComponent } from './pages/libro-diario/table-libro-diario/table-libro-diario.component';
import { CuentaContableComponent } from './pages/cuenta-contable/cuenta-contable.component';
import { ContextMenuModule } from "primeng/contextmenu";
import { TreeModule } from "primeng/tree";
import { ContextMenuService } from 'primeng/api';
import { ModalAgregarCuentaComponent } from './pages/cuenta-contable/agregar-cuenta/agregar-cuenta.component';
@NgModule({
    declarations: [
        CdkDetailRowDirective,
        FormLibroDiarioComponent,
        ModalAsientoContableComponent,
        TableAsientosContablesComponent,
        ViewAsientoComponent,
        TableLibroDiarioCerradoComponent,
        TableLibroDiarioBorradorComponent,
        TableLibroDiarioComponent,
        CuentaContableComponent,
        ModalAgregarCuentaComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        ContabilidadRoutingModule,
        ComponentsModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        InputMaskModule,
        ScrollbarModule,
        TableModule,
        SliderModule,
        ButtonModule,
        TreeModule,
        ContextMenuModule
    ],
     providers: [ContextMenuService],
})
export class ContabilidadModule { }
