import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { VectorComponent } from './vector.component';
import { VectoresComponent } from './vectores/vectores.component';
import { ScrollbarModule } from '../../../../@vex/components/scrollbar/scrollbar.module';
import { AngularMaterialModule } from '../../angular-material.module';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [VectorComponent,VectoresComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ScrollbarModule,
    AngularMaterialModule,
    BrowserModule
  ]
})
export class VectorModule { }
