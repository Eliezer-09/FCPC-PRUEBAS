import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParticipesService } from 'src/app/pages/participes/participes.service';
import { DataService } from '../../../../services/data.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { Aportes } from '../../models/cesante-catalogo.interface';
import { CreditosService } from 'src/app/pages/creditos/creditos.service';
import { Prestamo } from 'src/app/model/models';
import { Router } from '@angular/router';
import { CesantesService } from '../../cesantes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cesante } from '../../models/cesante.interface';
import { Cesantia, SimulacionCesantia } from '../../models/cesantia.interface';
import { RegistroCesantia } from '../../models/registro-cesantia.interface';
import { RegistroLiquidar } from '../../models/liquidar.interface';
import { FormControl } from '@angular/forms';
import icDescription from '@iconify/icons-ic/twotone-description';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-liquidar',
  templateUrl: './liquidar.component.html',
  styleUrls: ['./liquidar.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class LiquidarComponent implements OnInit {
  icDescription = icDescription
  aportes: Aportes[] = [];
  creditos: Prestamo[] = [];

  saldoTotalAportes: number = 0;
  saldoTotalCreditos: number = 0;

  valorPagar = false;

  totalValor: number = 0;
  buscar: string

  @Input() simulacionCesantia: SimulacionCesantia;
  @Input() idCesantia: number;

  registroCesantia: RegistroCesantia;

  searchCtrl = new FormControl();

  idTipoCesantia: number;
  fechaLiquidacion;

  constructor(
    private cesanteService: CesantesService,
    private componentService: ComponentesService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
  }

  guardar() {
    
    const registro: RegistroLiquidar = {
      totalIngresos: this.simulacionCesantia.totalIngresos,
      totalEgresos: this.simulacionCesantia.totalEgresos,
      saldoPagar: this.simulacionCesantia.saldoPagar,
      saldoCobrar: this.simulacionCesantia.saldoCobrar,
      detalles: this.simulacionCesantia.detalles,
      fechaLiquidacion: this.fechaLiquidacion
    }
    if(this.fechaLiquidacion){
      this.spinner.show();
      this.cesanteService.postLiquidarCesantia(this.idCesantia, registro).subscribe(res => {
        this.spinner.hide();
        this.componentService.alerta("success", "Se ha liquidado su cuenta individual").then(res => {
          if (res.isConfirmed) {
            location.reload()
          }
        })
      }, response => {
        this.spinner.hide();
        this.componentService.alerta("error", response.error.message)
      })
    }else{
      this.componentService.alerta("error", "Debes elegir una fecha para la Liquidación")
    }
    
  }
}
