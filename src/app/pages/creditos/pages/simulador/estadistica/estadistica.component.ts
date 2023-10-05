import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as Chart from "chart.js";
import { IconCard } from 'src/app/components/models/models-component';
import { iconify } from 'src/static-data/icons';

@Component({
  selector: 'vex-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss']
})
export class EstadisticaComponent implements OnInit {
  @Output() tablaAmortizacionEmit = new EventEmitter();
  canvas: any;
  canvasElement: any;
  estadisticasCredito={
    totalPrestamo:0,
    totalInteres:0,
    totalCapital:0,
    pagoMensual:0,
    tasaNominal:0,
    tasaefectiva:0,
    totalDesgravamen:0,
    valorDiferido:0
  }
  @Input() showPagoMensual:boolean=false;
  @Input() showTotalMora:boolean=false;
  @Input() showValorDiferido:boolean=false;
  simulacionData:IconCard[]=[]
  icbaselineAttachMoney = iconify.icbaselineAttachMoney;
  icroundPercent =iconify.icroundPercent;
  @ViewChild('myCanvas', { static: true }) myCanvas: ElementRef;
  constructor(  private changeDetectorRefs: ChangeDetectorRef,
    private elementRef: ElementRef
            ) { 

  }

  ngOnInit(): void {
    this.resizeCanvas();
    
  }
  detectarCambios() {
    this.changeDetectorRefs.detectChanges(); 
  }

  loadGraphic(estadisticasCredito){
    this.estadisticasCredito=estadisticasCredito;
    const data=estadisticasCredito
    this.simulacionData=[{label:"Total Capital",value:data.totalCapital,icon:this.icbaselineAttachMoney},
                              {label:"Tasa Nominal",value:data.tasaNominal,icon:this.icroundPercent},
                              {label:"Tasa Efectiva",value:data.tasaefectiva,icon:this.icroundPercent},
                              {label:"Total Interés",value:data.totalInteres,icon:this.icbaselineAttachMoney},
                              
                              {label:"Total Desgravamen",value:data.totalDesgravamen,icon:this.icbaselineAttachMoney},
                              {label:"Total a Pagar",value:data.totalPrestamo,icon:this.icbaselineAttachMoney}]
    if(this.showPagoMensual) this.simulacionData.push({label:"Pago Mensual",value:data.pagoMensual,icon:this.icbaselineAttachMoney})
    if(this.showTotalMora) this.simulacionData.push({label:"Interés con descuento",value:data.valorDiferido,icon:this.icbaselineAttachMoney})
    if(this.showValorDiferido) this.simulacionData.push({label:"Descuento al interés",value:data.descuentoInteres,icon:this.icroundPercent})
/*     this.simulacionData.push({label:"Descuento al interés",subLabel:"50% aplicado",value:data.valorDiferido,icon:this.icroundPercent}) */
    this.createLineChart()
  }

   // CREAR
   createLineChart() {

    var myChart = new Chart(this.canvasElement, {
      type: "doughnut",
      data: {
        labels: ["Total capital", "Total interés"],
        datasets: [
          {
            data: [this.estadisticasCredito.totalCapital, this.estadisticasCredito.totalInteres],
            backgroundColor: ["rgba(3, 25, 68, 0.9)", "#FFCB00"],
            borderColor: ["rgba(3, 25, 68, 0.9)"],
            borderWidth: 1,
          },
        ],
      },
    });
    this.detectarCambios();
  }
  
  @HostListener('window:resize')
  onWindowResize() {
    this.resizeCanvas();
  }

resizeCanvas() {
  this.canvasElement =  this.elementRef.nativeElement.querySelector('#myCanvas');
  const canvasContainer = this.canvasElement.parentElement;
  this.canvasElement.width = canvasContainer.offsetWidth;
  this.canvasElement.height = canvasContainer.offsetHeight;
}

  
}
