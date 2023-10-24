import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-modal-tabla-amortizacion',
  templateUrl: './modal-tabla-amortizacion.component.html',
  styleUrls: ['./modal-tabla-amortizacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class ModalTablaAmortizacionComponent implements OnInit {
  
  displayedColumns = ["#", "Interes", "Mora", "Capital", "Cuota", "desgravamen" , "Total", "Saldo"];
  // pageSize = 10;
  // pageSizeOptions: number[] = [5, 10, 20];
  customers2: any[];
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  dataFondoSource: MatTableDataSource<any> | null;
  totalCapital=0;
  totalDesgravamen=0;
  totalInteres=0;
  totalMora=0;
  totalPrestamo=0;
  totalCuota=0;
  totalCD=0;
  totalSadaldo=0;

  constructor(
    public dialogRef: MatDialogRef<ModalTablaAmortizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 

  }

  ngOnInit(): void {
    this.dataFondoSource = this.data["data"]["cuotas"];
    this.calculateTotals(this.data["data"]);
  }

  calculateTotals(data){
    this.totalCapital=data.totalCapital;
    this.totalDesgravamen=data.totalDesgravamen;
    this.totalInteres=data.totalInteres;
    this.totalMora=data.totalMora;
    this.totalPrestamo=data.totalPrestamo;
    this.totalCuota=this.totalInteres+this.totalCapital;
    this.totalCD=this.totalCuota+this.totalDesgravamen;
  }

  cancel(): void {
    this.dialogRef.close();
  }


}
