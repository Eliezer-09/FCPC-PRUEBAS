import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS}       from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}           from '@angular/material/core';
import { InversionesService }         from '../../../inversiones.service';
import { DataService }                from 'src/app/services/data.service';
import { ReplaySubject }              from 'rxjs';
import { BolsaValores }               from 'src/app/model/models';
import { FormBuilder}                 from '@angular/forms';
import {default as _rollupMoment}     from 'moment';
import * as _moment                   from 'moment';
import moment                         from 'moment';
import { createMask } from '@ngneat/input-mask';

export const MY_FORMATS = {
  parse: {
      dateInput: 'YYYY-MM-DD'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM-YYYY'
  }
};
@Component({
  selector: 'vex-data-inversion',
  templateUrl: './data-inversion.component.html',
  styleUrls: ['./data-inversion.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ], 
})

export class DataInversionComponent implements OnInit {
  currentDate               = moment();
  simboloMoneda: string     ='$';
  selectSectorInversion :any= [];
  selectCustodioTitulo  :any= [];
  selecCasaValor        :any= [];
  periodos              :any[]= [];
  selectBolsaValores: BolsaValores[] = [];   
  filteredTipoPeriodo:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  filteredTipoCapital:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
  });

  @Input() formGenerales = this.fb.group({
    //valor
    tipoRenta:                [''],
    idTipoInversion:          [''],
    tipoInversion:            [''],
    numeroCertificado:        [''],
    codigo:                   [''],
    descripcion:              [''],
    serieTransaccion:         [''],
    idSectorFinanciero:       [''],
    //emisor
    idEmisor:                 [''],
    emisor:                   [''],
    idCalificadoraRiesgo:     [''],
    razonsocialCalificadoraRiesgo:  [''],
    calificacionEmisor:       [''],
    fechaCalificacionEmisor:  [''],
    razonsocialEmisor:        [''],
    //monetizacion
    valorEnLibro:             [''],
    valorNominal:             [''],
    valorCompra:              [''],
    valorMercado:             [''],
    tasa:                     [''],
    fechaCompra:              [this.currentDate],
    //plazo
    fechaEmision:             [this.currentDate],
    fechaVencimiento:         [''],
    totalPlazo:               [''],
    periodoPagoInteres:       [''],
    periodoPagoCapital:       [''],
    periodoGracia:            [true],
    //transaccion
    desmaterializado:         [false],
    idCasaValor:              [''],
    impuestos:                [0.00],
    costoCasaValores:         [0.00],
    costoBolsaValores:        [0.00],
    costoCompra:              [0.00],
    //periodo interes
    tipoPlazo:                [''],
    tipoCapital:              [''],
    idCustodioTitulo:         [''],
   //acciones
    numeroAcciones:           [''],
    plazoGracia:              [''],
    precioPorAccion:          [''],
    desdeAccion:              [''],
    hastaAccion:              [''],
    //intermediario de valores
    rucCasa:                  [''],
    idBolsaValores:           [''],
  });

  constructor( private fb: FormBuilder,
    private changeDetector:  ChangeDetectorRef, 
    private inversionesService: InversionesService, 
    private dataService: DataService) { }

  ngOnInit(): void {
    this.asingDataToForm();
    this.loadEmisor(this.formGenerales.value.idEmisor); 
    this.loadSectordeInversion()
    this.loadCustodioTitulo()
    this.loadCasaValores()
    this. loadPeriodos()
    this.loadBolsaValores();

  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

 
  asingDataToForm(){
    this.loadCalificadora(this.formGenerales.value.idCalificadoraRiesgo);
  }


  loadEmisor(idEmisor): void {
    this.inversionesService.getEntidadFinancieraById(idEmisor).subscribe((response: any) => {
      this.formGenerales.controls["emisor"].setValue(response.result.razonSocial)
      this.loadCalificacionActual(idEmisor);
    })
  }

  loadCalificadora(idCalificadora): void {
    this.inversionesService.getEntidadFinancieraById(idCalificadora).subscribe((response: any) => {
      this.formGenerales.controls["razonsocialCalificadoraRiesgo"].setValue(response.result.razonSocial)   
    })
  }

  loadSectordeInversion() {
    this.dataService.getSectorFinanciero().subscribe((response: any) => {
      this.selectSectorInversion = response["result"];
    })
  }

  loadCustodioTitulo() {
    this.inversionesService.getEntidadFinancieraLite("custodio").subscribe((response: any) => {
      this.selectCustodioTitulo = response.result;
    })
  }


  loadCasaValores() {
    this.inversionesService.getEntidadFinanciera("casa").subscribe((response: any) => {
      this.selecCasaValor = response.result;
      let casasSelect = this.selecCasaValor.filter(
        (casa) => casa.entidadFinanciera.idEntidad == this.formGenerales.value.idCasaValor
      );
      if(casasSelect.length>0){
        this.formGenerales.controls["rucCasa"].setValue(casasSelect[0].identificacion);
      }
     
    })
  }

  loadPeriodos() {
    this.dataService.getPeriodos().subscribe((response: any) => {
      this.periodos= response.result
    })
  }

  loadBolsaValores() {
    this.inversionesService.getEntidadFinancieraLite("Bolsa").subscribe((response: BolsaValores) => {
      this.selectBolsaValores = response["result"];
    })
  }

  loadCalificacionActual(idEmisorValor){
    this.inversionesService.getCalificacionEmisorActual(idEmisorValor).subscribe((res: any) => {
      this.formGenerales.controls['calificacionEmisor'].setValue(res.result.calificacion);
    })
  }
}
