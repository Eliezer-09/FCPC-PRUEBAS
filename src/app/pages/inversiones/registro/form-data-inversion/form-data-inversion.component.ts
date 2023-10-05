import {AfterViewChecked,ChangeDetectionStrategy,ChangeDetectorRef,Component,EventEmitter,Input,OnInit,Output,ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog }                                              from '@angular/material/dialog';
import { MatSelect }                                              from '@angular/material/select';
import { Router }                                                 from '@angular/router';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS}       from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}           from '@angular/material/core';
import { ReplaySubject, Subject }                                 from 'rxjs';
import { takeUntil }                                              from 'rxjs/operators';
import { NgxSpinnerService }                                      from 'ngx-spinner';
import { fadeInRight400ms }                                       from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms }                                          from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms }                                           from 'src/@vex/animations/scale-in.animation';
import { stagger80ms }                                            from 'src/@vex/animations/stagger.animation';
import { BolsaValores, Calificadora, Casa, Emisor }               from 'src/app/model/models';
import { DataService }                                            from 'src/app/services/data.service';
import { FormsService }                                           from 'src/app/services/forms.service';
import { iconify }                                                from 'src/static-data/icons';
import { EstadoInversionEnum, InversionesService }                from '../../inversiones.service';
import { ToastAlertComponent }                                    from '../../../../components/alerts/toast-alert/toast-alert.component';
import * as _moment                                               from 'moment';
import {default as _rollupMoment }                                from 'moment';
import { createMask } from '@ngneat/input-mask';
import { TiposTituloInversiones } from 'src/@vex/interfaces/enums';



const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
      dateInput: 'yyyy-MM-ddTHH:mm:ssZ'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM-YYYY'
  }
};

@Component({
	selector: 'vex-form-data-inversion',
	templateUrl: './form-data-inversion.component.html',
	styleUrls: [ './form-data-inversion.component.scss' ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	 animations: [ stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ], 
})


export class FormDataInversionComponent implements OnInit, AfterViewChecked {

  @Output() tablaSimulacionEmitter   = new EventEmitter<any>();
  @Output() formGeneralEmitter       = new EventEmitter<any>();
  @Output() tablaAmortizacionEmitter = new EventEmitter<any>();
  @Output() fileEmitter              = new EventEmitter<any>();
  @Output() acciones                 = new EventEmitter<any>();

  @Input() stepper;
 
  icroundAdd          = iconify.icroundAdd ;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundSettings     = iconify.icroundSettings;
  icroundCached       = iconify.icroundCached;

  tiposRentas = [
    { id: "F", nombre: "Fija" },
    { id: "V", nombre: "Variable" },
  ];
  tiposInversion       = [];
  selectSectorInversion= [];
  selectBolsaValores: BolsaValores[]   = [];   
  emisores:       any[]= [];
  calificadoras:  any[]= [];
  calificaciones: any[]= [];
  custodiosTitulo:any[]= [];
  periodos:       any[]= [];
  monedas:        any[]= [];
  casas:          any[]= [];

  configurationForm=       false;
  enableSection={
    sectionAmortizacion:   false,
  }
  enableForms={
    codigo:                false,
    descripcion:           false,
    plazoGracia:           false,
    tasa:                  false,
    totalPlazo:            false,
    tipoPlazo:             false,
    tipoCapital:           false,
    bolsaValores:          false,
    valorMercado:          false,
    desmaterializado:      false,
    idCustodioTitulo:      false,
    fechaVencimiento:      false,
    fechaCompra:           false,
    periodoPagoCapital:    false,
    periodoPagoInteres:    false,
    idBolsaValores:        false,
    idCalificadoraRiesgo:  false,
    calificacionEmisor:    false,
    fechaCalificacionEmisor: false,
    idCasaValor:             false,
    rucCasa:               false,
    impuestos:             false,
    costoCasaValores:      false,
    costoBolsaValores:     false,
    costoCompra:           false,
  }
  enableTiposTitulo={
    certificadoDeposito:   false,
    bonos:                 false,
    acciones:              false,
    certificadoInversion: false,
    papelComercial:       false,
    obligacion:           false,
    titulacionInmobilaria:false,
    facturaComercial:     false
  }
  activarInputs =          false;
  adjunto =                false;
  accionEmisor =           false;

  limitVencimientoDate=new Date();
  today=               new Date();
  currentDate =        moment();
  
  simboloMoneda: string='$';
  nombreArchivo: string;
  fileBase64:    string;
  dataEmisor:    any;
  selectedTituloValor;

  layoutCtrl:             FormControl = new FormControl('fullwidth');
  emisorFilterCtrl:       FormControl = new FormControl();
  casaFilterCtrl:         FormControl = new FormControl();
  calificadoraFilterCtrl: FormControl = new FormControl();
  @Output() isAllowedAmortizationEmit= new EventEmitter<any>();
  protected _onDestroy = new Subject<void>();

  filteredEmisores:      ReplaySubject<Emisor[]>       = new ReplaySubject<Emisor[]>(1);
  filteredCasas:         ReplaySubject<Casa[]>         = new ReplaySubject<Casa[]>(1);
  filteredCalificadoras: ReplaySubject<Calificadora[]> = new ReplaySubject<Calificadora[]>(1);
  filteredTipoPeriodo:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  filteredTipoCapital:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  filteredTituloValor:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);

  calificacionEmisorDic = {
    "idEmisor": 0,
    "descripcion": "",
    "fechaCalificacion": "",
  }

  RequeredRule:               any[]=[Validators.required];
  NumberZeroNoNegativeRule: any[]=[Validators.required, Validators.min(0),Validators.pattern(this.formsService.expDecimales)];
  NumberNoZeroNoNegativeRule: any[]=[Validators.required, Validators.min(0),Validators.pattern(this.formsService.expNotZero),Validators.pattern(this.formsService.expDecimales)];
  NumberNoZeroNoNegativeNoRequieredRule: any[]=[Validators.min(0),Validators.pattern(this.formsService.expNotZero),Validators.pattern(this.formsService.expDecimales)];
  PorcentRule:                any[]=[Validators.required,Validators.min(0),Validators.max(100),Validators.pattern(this.formsService.expNotZero)];
  form: FormGroup;
  formGenerales = this.fb.group({
    //valor
    tipoRenta:                ['', this.RequeredRule],
    idTipoInversion:          ['', this.RequeredRule],
    tipoInversion:            [''],
    numeroCertificado:        ['', this.RequeredRule],
    descripcion:              [''],
    codigo:                   ['',Validators.pattern(this.formsService.expAlfanumeric)],
    idSectorFinanciero:       ['',this.RequeredRule],
    //emisor
    idEmisor:                 ['', this.RequeredRule],
    idEmisorDefault:          [''],
    idCalificadoraRiesgo:     ['', this.RequeredRule],
    calificacionEmisor:       ['', this.RequeredRule],
    fechaCalificacionEmisor:  ['', this.RequeredRule],
    razonsocialEmisor:        [''],
    //monetizacion
    valorEnLibro:             ['', this.NumberNoZeroNoNegativeRule],
    valorNominal:             ['', this.NumberNoZeroNoNegativeRule],
    valorCompra:              ['', this.NumberNoZeroNoNegativeRule],
    valorMercado:             ['', this.NumberNoZeroNoNegativeRule],
    tasa:                     ['', this.PorcentRule],
    fechaCompra:              [this.currentDate, this.RequeredRule],
    //plazo
    fechaEmision:             [this.currentDate, this.RequeredRule],
    fechaVencimiento:         ['', this.RequeredRule],
    totalPlazo:               ['',this.NumberNoZeroNoNegativeRule],
    periodoPagoCapital:       [''],
    periodoPagoInteres:       [''],
    periodoGracia:            [true],
    //transaccion
    desmaterializado:         [false],
    idCasaValor:              ['',this.RequeredRule],
    impuestos:                [0,this.NumberZeroNoNegativeRule],
    costoCasaValores:         [0,this.NumberZeroNoNegativeRule],
    costoBolsaValores:        [0,this.NumberZeroNoNegativeRule],
    costoCompra:              [0,this.NumberZeroNoNegativeRule],
    //periodo interes
    tipoPlazo:                ['', this.RequeredRule],
    tipoCapital:              ['', this.RequeredRule],
    idCustodioTitulo:         ['',this.RequeredRule],
   //acciones
    numeroAcciones:           ['', this.NumberNoZeroNoNegativeRule],
    plazoGracia:              [0,this.NumberZeroNoNegativeRule],
    precioPorAccion:          ['',this.NumberNoZeroNoNegativeRule],
    desdeAccion:              ['', this.NumberNoZeroNoNegativeNoRequieredRule],
    hastaAccion:              ['',this.NumberNoZeroNoNegativeNoRequieredRule],
    //intermediario de valores
    rucCasa:                  [''],
    idBolsaValores:           ['', this.RequeredRule],
    estado: EstadoInversionEnum.Registrado
  });

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    allowMinus: false,
    min: 0.00,
    numericInput: true,
    placeholder: "0.00"
  });


  PorcentInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    allowMinus: false,
    min: 0.00,
    max:100,
    numericInput: true
  });
  
  

  @ViewChild('singleSelect') singleSelect: MatSelect;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  

  constructor(
    public  dialog:             MatDialog,
    private fb:                 FormBuilder,
    private changeDetector:     ChangeDetectorRef,
    private inversionesService: InversionesService,
    private dataService:        DataService,
    private spinner:            NgxSpinnerService,
    private formsService:       FormsService,
    private ctrlContainer: FormGroupDirective,
  ) { }


  ngOnInit() {
    this.form = this.ctrlContainer.form;
    this.form.addControl("formInversion", this.formGenerales);
    this.spinner.show();
    this.initialFormEnable();
    this.changeLimitVencimientoDate(this.limitVencimientoDate);
    this.loadTipoInversion();
    this.loadSectordeInversion();
    this.loadCasas();
    this.loadEmisores();
    this.loadCalificadora();
    this.loadCalificaciones();
    this.loadCustodioTitulo();
    this.loadPeriodos();
    this.loadBolsaValores();
    this.loadMonedas();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }


  initialFormEnable(){
    this.formGenerales.disable();
    this.disableMapControls(this.enableForms);
    this.disableMapControls(this.enableTiposTitulo);
    this.disableMapControls(this.enableSection);
    this.formGenerales.controls['tipoRenta'].enable();
    this.formGenerales.controls['tipoInversion'].enable();
    this.formGenerales.controls['idTipoInversion'].enable();
    this.formGenerales.controls['numeroCertificado'].enable();
    this.formGenerales.controls['idEmisorDefault'].enable();
  }


  disableMapControls(dictionary){
    Object.entries(dictionary).forEach(e => {
      const [key, value] = e;
      dictionary[key] = false;
    });
  }


  enableControls(form:FormGroup,listcontrols:string[]){
    listcontrols.forEach(control => {
      form.controls[control].enable();
      this.enableForms[control]=true;
     
    });
    if(listcontrols.includes("desmaterializado")){
      this.enableDesmaterializado(this.formGenerales.value.desmaterializado)
    }
  }


  enableControlCertificadoDepesito(){
    const listcontrols=['idEmisor','calificacionEmisor','idCalificadoraRiesgo','fechaCalificacionEmisor','codigo','razonsocialEmisor','idSectorFinanciero','valorEnLibro','valorNominal','valorCompra','tasa','fechaEmision','fechaCompra',
    'fechaVencimiento','tipoPlazo','tipoCapital','totalPlazo','desmaterializado','idCasaValor','idBolsaValores','periodoPagoCapital','periodoPagoInteres','costoCasaValores','costoBolsaValores','impuestos','rucCasa','costoCompra','idCustodioTitulo'];
    this.enableControls(this.formGenerales,listcontrols);
  }


  enableControlBonos(){
    const listcontrols=['codigo','descripcion','calificacionEmisor','idCalificadoraRiesgo','fechaCalificacionEmisor','idSectorFinanciero','razonsocialEmisor','valorEnLibro','valorNominal','valorCompra','tasa','fechaEmision','fechaCompra',
    'fechaVencimiento','tipoPlazo','tipoCapital','totalPlazo','periodoGracia','plazoGracia','desmaterializado','idCasaValor','idBolsaValores','costoCasaValores','costoBolsaValores','impuestos','rucCasa','costoCompra','idCustodioTitulo'];
    this.enableControls(this.formGenerales,listcontrols);
  }


  enableControlAcciones(){
    const listcontrols=['idEmisor','calificacionEmisor','idCalificadoraRiesgo','fechaCalificacionEmisor','codigo','idSectorFinanciero','razonsocialEmisor','valorEnLibro','valorNominal','valorCompra','fechaEmision','fechaCompra',
   'idCasaValor','valorMercado','numeroAcciones','precioPorAccion','idBolsaValores','desmaterializado','desdeAccion','hastaAccion','costoCasaValores','costoBolsaValores','impuestos','rucCasa','costoCompra','idCustodioTitulo'];
    this.enableControls(this.formGenerales,listcontrols);
  }


  enableControlAccionesNoCotizadas(){
    const listcontrols=['idEmisor','idSectorFinanciero','razonsocialEmisor','valorEnLibro','valorNominal','valorCompra','fechaEmision','fechaCompra',
   ,'numeroAcciones','precioPorAccion','desmaterializado','desdeAccion','hastaAccion','idCustodioTitulo'];
    this.enableControls(this.formGenerales,listcontrols);
  }
  tipoInversionSelect(idTipoInversion){
    this.selectedTituloValor = this.tiposInversion.filter(
      (tipoInversion) => tipoInversion.idTipoInversion == idTipoInversion
    );
    this.selectedTituloValor= this.selectedTituloValor[0]
    let tipoInversion=this.selectedTituloValor.descripcion;
    this.formGenerales.controls['tipoInversion'].setValue(tipoInversion);
  }

  changeEmisorDefault(){
    let idEmisorValor=this.selectedTituloValor.idEmisorValor;
    this.formGenerales.controls["idEmisor"].setValue(idEmisorValor);
    this.formGenerales.controls["idEmisorDefault"].setValue(idEmisorValor);
    this.changeDataEmisor(idEmisorValor);
  }

  changeTipoInversion(event){
    this.initialFormEnable();
    let idTipoInversion=event.value;
    this.tipoInversionSelect(idTipoInversion)
    this.changeDetector.detectChanges();
    document.getElementById('valorNominal').removeAttribute('readonly');
    if(this.enableForms.costoCompra) document.getElementById('costoCompra').setAttribute('readonly', 'readonly');
    this.formGenerales.controls["idEmisor"].setValue("");
    this.formGenerales.controls["idCalificadoraRiesgo"].setValue("");
    this.formGenerales.controls["calificacionEmisor"].setValue("");
    this.formGenerales.controls["fechaCalificacionEmisor"].setValue("");
    this.enableSection.sectionAmortizacion=true;
    

    this.acciones.emit(false);
    switch (idTipoInversion) {
      case TiposTituloInversiones.CertificadoDeposito:
        //Certificado de deposito
        this.isAllowedAmortization(true);
        this.enableTiposTitulo.certificadoDeposito=true;
        this.enableControlCertificadoDepesito();
        this.filterPeriodo(this.filteredTipoPeriodo,['M','V']);
        this.filterPeriodo(this.filteredTipoCapital,['V']);
        break;
      case TiposTituloInversiones.Bonos:
        //Bonos
        this.isAllowedAmortization(true);
        this.enableTiposTitulo.bonos=true;
        this.enableControlBonos();
        this.filterPeriodo(this.filteredTipoPeriodo,['M','T','A','V','S']);
        this.filterPeriodo(this.filteredTipoCapital,['M','T','A','V','S']);
        this.enableForms.descripcion=true;
        this.changeEmisorDefault();
        this. ValidationDiasPlazo();
        break;
      case TiposTituloInversiones.AccionesCotizadas:
        //Acciones cotizadas en bolsa.
        this.isAllowedAmortization(false);
        this.enableTiposTitulo.acciones=true;
        this.enableSection.sectionAmortizacion=false;
        this.enableControlAcciones();
        document.getElementById('valorNominal').setAttribute('readonly', 'readonly');
        this.acciones.emit(true);
        break;

      case TiposTituloInversiones.AccionesNoCotizadas:
        //Acciones no cotizadas en bolsa.
        this.isAllowedAmortization(false);
        this.enableTiposTitulo.acciones=true;
        this.enableSection.sectionAmortizacion=false;
        this.enableControlAccionesNoCotizadas();
        document.getElementById('valorNominal').setAttribute('readonly', 'readonly');
        this.acciones.emit(true);
        
        break;
    
      default:
        break;
    }
    
  }


  enableConfigurationForm(){
    this.configurationForm=!this.configurationForm;
  }


  loadMonedas(){
    this.dataService.getMonedas().subscribe((res: any) => {
      this.monedas = res.result;
    });
  }


  loadTipoInversion() {
    this.dataService.getTipoInversion().subscribe((response: any) => {
      this.tiposInversion = response["result"];
    })
    this.spinner.hide();
  }

  loadSectordeInversion() {
    this.dataService.getSectorFinanciero().subscribe((response: any) => {
      this.selectSectorInversion = response["result"];
    })
  }


  loadEmisores(): void {
    this.inversionesService.getEntidadFinanciera("emisor").subscribe((response: any) => {
      this.emisores = response.result;
      this.filteredEmisores.next(this.emisores.slice());
      this.emisorFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterEmisores();
        });
      if(this.formGenerales.value.idEmisor) this.changeDataEmisor(this.formGenerales.value.idEmisor)
    })
  }


  loadCasas(): void {
    this.inversionesService.getEntidadFinanciera("casa").subscribe((response: any) => {
      this.casas = response.result;
      this.filteredCasas.next(this.casas.slice());
      this.casaFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCasas();
        });
    })
  }


  loadCalificadora(): void {
    this.inversionesService.getEntidadFinancieraLite("calificadora").subscribe((response: any) => {
      this.calificadoras = response.result;
      this.filteredCalificadoras.next(this.calificadoras.slice());
      this.calificadoraFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCalificadora();
        });
    })
  }


  loadPeriodos() {
    this.dataService.getPeriodos().subscribe((response: any) => {
      this.periodos= response.result;
      this.filteredTipoPeriodo.next( this.periodos.slice());
      this.filteredTipoCapital.next( this.periodos.slice());
    })
  }


  loadCalificaciones() {
    this.dataService.getCalificacionesFinancieras().subscribe((response: any) => {
      this.calificaciones = response.result;
    })
  }


  loadCustodioTitulo() {
    this.inversionesService.getEntidadFinancieraLite("custodio").subscribe((response: any) => {
      this.custodiosTitulo = response.result;
    })
  }

  loadBolsaValores() {
    this.inversionesService.getEntidadFinancieraLite("Bolsa").subscribe((response: BolsaValores) => {
      this.selectBolsaValores = response["result"];
    })
  }

  changeTipoRenta(event: any) {
    this.formGenerales.controls["tipoRenta"].setValue(event.value);
    let selectTituloValor=this.tiposInversion.filter(
      (tipoInversion) => tipoInversion.tipoRenta == event.value
    );
    this.filteredTituloValor.next( selectTituloValor.slice());
  }

  seleccionarCasa(Casa) {
    if (Casa.entidadFinanciera.idEntidad) {
      this.formGenerales.controls["rucCasa"].setValue( Casa.identificacion);
    }
  }


  changeLimitVencimientoDate(date){
    this.limitVencimientoDate=this.formsService.AddDaysToDates(date,1);
  }


  changeEmisionDate(){
    let fechaEmision = this.formGenerales.value.fechaEmision;
    let fechaVencimiento = this.formGenerales.value.fechaVencimiento;
    this.changeLimitVencimientoDate(fechaEmision);
    if(fechaVencimiento) this.calculeDaysEmisionVensiomiento(fechaEmision,fechaVencimiento);
  }


  changeVencimientoDate(){
    let fechaEmision = this.formGenerales.value.fechaEmision;
    let fechaVencimiento = this.formGenerales.value.fechaVencimiento;
    this.calculeDaysEmisionVensiomiento(fechaEmision,fechaVencimiento);
  }


  calculeDaysEmisionVensiomiento(fechaEmision,fechaVencimiento) {
    if(fechaVencimiento != ''){
      if (fechaEmision > fechaVencimiento) {
        this.formGenerales.value.totalPlazo = "0";
      } else {
        const numero = parseFloat(this.formsService.calculateDays365(fechaEmision._d,fechaVencimiento._d)); 
        this.formGenerales.controls['totalPlazo'].setValue(numero.toString());
        if(this.enableTiposTitulo.bonos && numero<30){
          try{new ToastAlertComponent("warning", "Los Días de Plazo no cumplen los Días necesarios.");}finally{/* */ }
        }
        this.ValidationDiasPlazo();
      }
    }
    this.calculatePeriodoPago()
  }

  calculatePeriodoPago(){
    if(this.enableTiposTitulo.certificadoDeposito){
    if(this.formGenerales.value.tipoPlazo=="Mensual") this.formGenerales.controls['periodoPagoInteres'].setValue("30")
    if(this.formGenerales.value.tipoPlazo=="Vencimiento") this.formGenerales.controls['periodoPagoInteres'].setValue(this.formGenerales.value['totalPlazo'])
    if(this.formGenerales.value.tipoCapital=="Vencimiento")  this.formGenerales.controls['periodoPagoCapital'].setValue(this.formGenerales.value['totalPlazo'])
    }
  }

  changePeriodo(){
    const priorityFrequency=this.formGenerales.value.tipoPlazo;
    if(this.enableTiposTitulo.bonos){
    switch(priorityFrequency) { 
      case 'Mensual': { 
        this.filterPeriodo(this.filteredTipoCapital,['M','T','S','A','V']);
        break; 
      } 
      case  'Trimestral': { 
        this.filterPeriodo(this.filteredTipoCapital,['T','S','A','V']);
        break; 
      } 
      case  'Semestral': { 
        this.filterPeriodo(this.filteredTipoCapital,['S','A','V']);
        break; 
      } 
      case 'Anual':
        this.filterPeriodo(this.filteredTipoCapital,['A','V']);
        break;
      default:
       this.filterPeriodo(this.filteredTipoCapital,['V']);
      break; 
    }

   }else{
     this.calculatePeriodoPago();
  }
    
  }


  calculateCostoCompra(){
    const casaValores=parseFloat(this.formGenerales.value.costoCasaValores.toString());
    const costoBolsaValores=parseFloat(this.formGenerales.value.costoBolsaValores.toString());
    const impuestoValue=parseFloat(this.formGenerales.value.impuestos.toString());
    const valorNominal=parseFloat(this.formGenerales.value.valorNominal);
    if(valorNominal && casaValores && costoBolsaValores && impuestoValue){
      const costoCompra=casaValores+costoBolsaValores+(valorNominal*(impuestoValue/100));
      this.formGenerales.controls["costoCompra"].setValue(costoCompra);
    }else{
      this.formGenerales.controls["costoCompra"].setValue(0);
    }
  }

  
  enableDesmaterializado(event) {
    if (event["checked"]  ||  event==true) {
      this.activarInputs = true;
      this.formGenerales.controls['idCustodioTitulo'].enable();
      if(this.formGenerales.value.idTipoInversion.toString() != TiposTituloInversiones.AccionesNoCotizadas.toString()){
        this.formGenerales.controls['impuestos'].enable();
        this.formGenerales.controls['costoCasaValores'].enable();
        this.formGenerales.controls['costoBolsaValores'].enable();
        this.formGenerales.controls['costoCompra'].enable();
      }

      
    } else {
      this.activarInputs = false;
      this.formGenerales.controls['idCustodioTitulo'].disable();
      if(this.formGenerales.value.idTipoInversion.toString() != TiposTituloInversiones.AccionesNoCotizadas.toString()){
        this.formGenerales.controls['impuestos'].disable();
        this.formGenerales.controls['costoCasaValores'].disable();
        this.formGenerales.controls['costoBolsaValores'].disable();
        this.formGenerales.controls['costoCompra'].disable();
      }

    }
    setTimeout(() => { this.formGenerales.controls['impuestos'].setValue(0); }, 0);
    
    this.formGenerales.controls['costoCasaValores'].setValue(0);
    this.formGenerales.controls['costoBolsaValores'].setValue(0);
    this.formGenerales.controls['idCustodioTitulo'].setValue("0");
    this.formGenerales.controls['costoCompra'].setValue(0);
  }


  calculateValorNominal(){
    const nAcciones=parseInt(this.formGenerales.value.numeroAcciones+'');
    const precioAccion=parseFloat(this.formGenerales.value.precioPorAccion+'');
    if(nAcciones && precioAccion){
      let valorNominal=nAcciones*precioAccion;
      this.formGenerales.controls['valorNominal'].setValue(valorNominal.toString());
      this.calculateCostoCompra();
    }else{
      this.formGenerales.controls['valorNominal'].setValue('');
    }
  }


  calculateNumeroAcciones(){
    const ndesde=parseInt(this.formGenerales.value.desdeAccion+'');
    const nhasta=parseInt(this.formGenerales.value.hastaAccion+'');
    if(ndesde && nhasta){
      let nAciones=(nhasta-ndesde)+1;
      this.formGenerales.controls['numeroAcciones'].setValue(nAciones.toString());
      this.calculateValorNominal();
    }else{
      this.formGenerales.controls['numeroAcciones'].setValue('');
    }
  }

  calculoAcciones(){
    const { desdeAccion, hastaAccion } = this.formGenerales.value;
    if (hastaAccion > desdeAccion) {
      this.formGenerales.get('numeroAcciones').setValue((parseInt(hastaAccion)  - parseInt(desdeAccion)).toString());
    }
  }


  protected filterEmisores() {
    if (!this.emisores) {
      return;
    }
    let search = this.emisorFilterCtrl.value;
    if (!search) {
      this.filteredEmisores.next(this.emisores.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.formGenerales.value.idEmisor = search;
    }

    this.filteredEmisores.next(
      this.emisores.filter(emisor => emisor.razonSocial.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterCasas() {
    if (!this.casas) {
      return;
    }

    let search = this.casaFilterCtrl.value;
    if (!search) {
      this.filteredCasas.next(this.casas.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.formGenerales.value.idCasaValor = search;
    }
    this.filteredCasas.next(
      this.casas.filter(casa => casa.entidadFinanciera.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterCalificadora() {
    if (!this.calificadoras) {
      return;
    }

    let search = this.calificadoraFilterCtrl.value;
    if (!search) {
      this.filteredCalificadoras.next(this.calificadoras.slice());
      return;
    } else {
      search = search.toLowerCase();
      this.formGenerales.value.idCalificadoraRiesgo = search;
    }

    this.filteredCalificadoras.next(
      this.calificadoras.filter(calificadora => calificadora.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterPeriodo(tipo,codigos:string[]) {
    tipo.next(
      this.periodos.filter(periodo => codigos.indexOf(periodo.codigo) > -1)
    );
  }

  
  
  setTwoNumberDecimal(parameter) {
      let value=this.formGenerales.value[parameter]
      if( !value || value<=0 ){
        this.formGenerales.controls[parameter].setErrors({'especificError': "El valor no debe ser 0 o menor."});
      }else{
        if(value){
          let parseValue=parseFloat(value.replaceAll(',', ''))
          this.formGenerales.value[parameter] = parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
        }  
      }
    }

    setTwoNumberDecimalAllowZero(parameter) {
      let value=this.formGenerales.value[parameter]
      if( !value || value<0 ){
        this.formGenerales.controls[parameter].setErrors({'especificError': "El valor no debe ser menor a 0."});
      }else{
        if(value){
          let parseValue=parseFloat(value.replaceAll(',', ''))
          this.formGenerales.value[parameter] = parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
        }  
      }
    }


  setNoNumberDecimal(parameter) {
    if(this.formGenerales.value[parameter]) this.formGenerales.value[parameter] = parseFloat(this.formsService.setNumberDecimal(this.formGenerales.value[parameter],0));
  }


  ValidationDiasPlazo(){
    let plazoDias = this.formGenerales.value['totalPlazo'];
    let periodoGracia =this.formGenerales.value["plazoGracia"];
    if(parseFloat(plazoDias) <  periodoGracia){
      this.formGenerales.controls['plazoGracia'].setValue(null)
      this.formGenerales.controls['plazoGracia'].setErrors({'especificError': "El periodo de gracia no debe ser mayor al plazo en días."});
    }else{
      this.setNoNumberDecimal("plazoGracia");
    }
  }


  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }

  getElementErrors() {
    this.formGenerales.markAllAsTouched();
    this.verifyInputNumber()
    for (let value of Object.keys(this.formGenerales.controls)) {
      let  key=value;
      const controlErrors: ValidationErrors = this.formGenerales.get(key).errors;
      if (controlErrors != null) {
         let element=document.getElementById(key);
        if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
        return true;
      }
    }
    return false;
  }

  verifyInputNumber(){
    let controlsNumber=["valorEnLibro","valorNominal","valorCompra","valorMercado","tasa","precioPorAccion"]
    if(this.formGenerales.value.idTipoInversion.toString() == TiposTituloInversiones.AccionesNoCotizadas.toString())  controlsNumber=["valorEnLibro","valorNominal","valorCompra","valorMercado","tasa","precioPorAccion"]
    controlsNumber.forEach(control => {
      let value=this.formGenerales.value[control]
      if((!value || value<=0 ) && this.formGenerales.controls[control].status!="DISABLED"){
        this.formGenerales.controls[control].setErrors({'especificError': "El valor no debe ser 0 o menor."});
      }
    });
  }


  changeDataEmisor(idEmisorValor){
    this.spinner.show();
    if(!this.formGenerales.value.idEmisor){ 
      this.inversionesService.getEntidadFinancieraById(idEmisorValor).subscribe((res: any) => {
      this.formGenerales.controls['razonsocialEmisor'].setValue(res.result.razonSocial);
    });}
    this.inversionesService.getCalificacionEmisorActual(idEmisorValor).subscribe((res: any) => {
      this.formGenerales.controls['calificacionEmisor'].setValue(res.result.calificacion);
      this.formGenerales.controls['idCalificadoraRiesgo'].setValue(res.result.idCalificadora);
      this.formGenerales.controls['fechaCalificacionEmisor'].setValue(res.result.fechaCalificacion);
      this.calificacionEmisorDic = res.result;
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error","El Emisor no tiene una calificación asignada.")}finally{/*  */};      
      this.formGenerales.controls['calificacionEmisor'].setValue("");
      this.formGenerales.controls['idCalificadoraRiesgo'].setValue("");
      this.formGenerales.controls['fechaCalificacionEmisor'].setValue("");
      this.calificacionEmisorDic = {
        "idEmisor": 0,
        "descripcion": "",
        "fechaCalificacion": "",
      }
      this.spinner.hide();
    });
  }


  seleccionarEmisor(Emisor) {
    if (Emisor.idEntidad) {
      this.dataEmisor = Emisor;
      this.accionEmisor = true;
      this.formGenerales.controls['razonsocialEmisor'].setValue(Emisor.descripcion);
      if(this.formGenerales.value.idTipoInversion.toString() != TiposTituloInversiones.AccionesNoCotizadas.toString()) this.changeDataEmisor(Emisor.idEntidad);
    }
  }

  isAllowedAmortization(event){
    this.isAllowedAmortizationEmit.emit(event);
  }


  guardarGenerales() {
      return this.formGenerales;
  }

    getDetalleTitulo(formData){
      return {
        desde: formData.desdeAccion,
        hasta: formData.hastaAccion,
        cantidad: formData.numeroAcciones,
        precioPorAccion:formData.precioPorAccion,
        total: formData.valorNominal,
        valorContable: formData.valorEnLibro,
        valorMercado: formData.valorMercado,
      }
    }

}
