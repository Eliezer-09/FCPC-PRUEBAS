import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { iconify } from 'src/static-data/icons';

@Component({
  selector: 'vex-modal-table-amortizacion',
  templateUrl: './modal-table-amortizacion.component.html',
  styleUrls: ['./modal-table-amortizacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ModalTableAmortizacionComponent implements OnInit {
  tableColumns;
  displayedColumns = ["#", "Fecha", "Interes", "Mora", "Capital", "Cuota", "desgravamen" , "Total", "Saldo"];
  customers2: any[];
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  dataFondoSource: MatTableDataSource<any> | null;
  icroundClose = iconify.icroundClose;
  Totals:any={
    totalCapital:0,
    totalDesgravamen:0,
    totalInteres:0,
    totalMora:0,
    totalPrestamo:0,
    totalCuota:0,
    totalCD:0,
    totalSadaldo:0,
    totalInteresReprogramado:0,
    totalInteresVencido:0
  }
  constructor(
    public dialogRef: MatDialogRef<ModalTableAmortizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.tableColumns=data.tableColumns

  }

  ngOnInit(): void {
    this.dataFondoSource = this.data["data"]["cuotas"];
    this.calculateTotals(this.data["data"]);
  }

  calculateTotals(data){
    let totalCapital=data.totalCapital;
    let totalDesgravamen=data.totalDesgravamen;
    let totalInteres=data.totalInteres;
    let totalMora=data.totalMora;
    let totalPrestamo=data.totalPrestamo;
    let totalCuota=data.totalCuota;
    let totalCD=totalCuota+totalDesgravamen;
    let totalInteresReprogramado=data.valorDiferido;
    let totalInteresVencido=data.totalInteresVencido
    this.Totals={
      totalCapital:totalCapital,
      totalDesgravamen:totalDesgravamen,
      totalInteres:totalInteres,
      totalMora:totalMora,
      totalPrestamo:totalPrestamo,
      totalCD:totalCD,
      totalCuota:totalCuota,
      totalInteresReprogramado:totalInteresReprogramado,
      totalInteresVencido:totalInteresVencido
    }
    
  }

  cancel(): void {
    this.dialogRef.close();
  }


}
