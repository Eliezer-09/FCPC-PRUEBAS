import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ScrollbarModule } from '../../../@vex/components/scrollbar/scrollbar.module';
import { MatRippleModule } from '@angular/material/core';
import { AngularMaterialModule } from '../angular-material.module';
import { ComponentsModule } from '../../components/components.module';

import { ReportesReporteComponent } from './reportes-reporte/reportes-reporte.component';
import { ReportesAnexoComponent } from './reportes-anexo/reportes-anexo.component';
import { ReportesEstructuraComponent } from './reportes-estructura/reportes-estructura.component';
import { ModalFiltroReportesComponent } from './modal-filtro-reportes/modal-filtro-reportes.component';
import { TableReportsComponent } from './table-reports/table-reports.component';
import { CardsReportsComponent } from './cards-reports/cards-reports.component';



@NgModule({
  declarations: [
    ReportesReporteComponent,
    ReportesAnexoComponent,
    ReportesEstructuraComponent,
    ModalFiltroReportesComponent,
    TableReportsComponent,
    CardsReportsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollbarModule,
    MatRippleModule,
  ]
})
export class ReportesModule { }
