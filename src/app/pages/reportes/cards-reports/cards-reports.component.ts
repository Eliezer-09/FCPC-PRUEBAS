import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReporteDTO }                             from '../../../model/models';
import { iconfa }                                 from 'src/static-data/icons'
@Component({
  selector: 'vex-cards-reports',
  templateUrl: './cards-reports.component.html',
  styleUrls: ['./cards-reports.component.scss']
})
export class CardsReportsComponent  {

  reports: ReporteDTO[] = [];
  report = '';
  @Output() OpenViewFilterReport = new EventEmitter<ReporteDTO>();
  @Input('data')set changeAcctionCard(infoReports : ReporteDTO[]) {
      this.reports = infoReports;
  }
  
  constructor() {}

  transformSimpleCard(report) {
      return {idCard: report['idReporte'], 
              name: report['titulo'], 
              description: report['descripcion'], 
              innerHTML: report['codigo'] ?`<span *ngIf="${report['codigo']}" class="color-accent font-bold">${report['codigo']}</span>` : 
              `<i class="mat-icon color-primary-contrast fa fa-file-invoice"></i>`,
              data:report['idReporte']}
  }

}
