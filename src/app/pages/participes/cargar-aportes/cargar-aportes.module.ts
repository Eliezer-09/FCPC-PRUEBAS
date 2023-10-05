import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { ComponentsModule } from "../../../components/components.module";
import { ScrollbarModule } from "../../../../@vex/components/scrollbar/scrollbar.module";
import { CargarAportesComponent } from './cargar-aportes.component';
import { AportesComponent } from './aportes/aportes.component';



@NgModule({
    declarations: [
        CargarAportesComponent,
        AportesComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        CommonModule,
        ComponentsModule,
        ScrollbarModule
    ]
})
export class CargarAportesModule { }
