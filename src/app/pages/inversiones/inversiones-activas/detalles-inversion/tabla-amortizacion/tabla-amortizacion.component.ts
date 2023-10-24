import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'vex-tabla-amortizacion',
  templateUrl: './tabla-amortizacion.component.html',
  styleUrls: ['./tabla-amortizacion.component.scss']
})
export class TablaAmortizacionComponent {

  constructor() { }

  @Input() idInversion: any;
  @Input() detalleInversion: any[] = [];
  @Input() totalesDetalleInversion: any = {};
  amortizacionColumns = ["numCuota", "fechaVencimiento","tiempoDias", "interes", "capital","total"];

  layoutCtrl = new FormControl('fullwidth');

  displayedColumns = ["cuota", "vencimientoInteres", "interes", "capital", "cobrar"];
  
  paginaIndex = 1;
  paginaSize = 20;
  pageSizeOptions: number[] = [5, 10, 20];


}
