import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import icCheck from '@iconify/icons-ic/check-circle';
import icMoney from '@iconify/icons-ic/round-money';

@Component({
  selector: 'vex-tabla-amortizacion',
  templateUrl: './tabla-amortizacion.component.html',
  styleUrls: ['./tabla-amortizacion.component.scss']
})
export class TablaAmortizacionComponent implements OnInit {

  @Input() dataTabla: any[] = [];
  @Input() dataTablaSimulacion: any[] = [];
  @Input() totales: any;
  @Input() reestructurado: any;
  displayedColumns = ["#", "Fecha", "Capital", "Interes", "Mora","MoraCalculada", "Cuota", "desgravamen" , "Total", "Pendiente", "Estado"];
  displayedColumnsMora = ["#", "Fecha", "Capital", "Interes", "Mora", "Cuota", "desgravamen" , "Total", "Pendiente", "Estado"];
  displayedColumnsSimulacion = ["#", "Fecha", "Capital", "Interes", "Mora", "Cuota", "desgravamen" , "Total", "Saldo"];
  displayedColumnsMoraSimulacion = ["#", "Fecha", "Capital", "Interes", "Mora", "Cuota", "desgravamen" , "Total", "Saldo"];

  // ICONS
  icCheck = icCheck;
  icMoney = icMoney
 
  constructor(

  ) { 

  }

  ngOnInit(): void {
  }



}
