import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';
import { CargarRolesComponent } from './cargar-roles.component';
import { RolesComponent } from './roles/roles.component';
import { ComponentsModule } from "../../../components/components.module";
import { ScrollbarModule } from "../../../../@vex/components/scrollbar/scrollbar.module";



@NgModule({
    declarations: [
        CargarRolesComponent,
        RolesComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        CommonModule,
        ComponentsModule,
        ScrollbarModule
    ]
})
export class CargarRolesModule { }
