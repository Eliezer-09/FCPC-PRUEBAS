import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute }                           from '@angular/router';
import { FormBuilder, FormControl }                 from '@angular/forms';
import { MatSelect }                                from '@angular/material/select';
import icDescription                                from "@iconify/icons-ic/twotone-description";
import { InversionesService }                       from '../../inversiones.service';
import { fadeInRight400ms }                         from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms }                             from 'src/@vex/animations/scale-in.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { Calificadora, Emisor, Inversion }          from 'src/app/model/models';
import { iconify}                                   from 'src/static-data/icons';
import { NgxSpinnerService }                        from 'ngx-spinner';
import { ReplaySubject, Subject }                   from 'rxjs';
import moment                                       from 'moment';
import { FormsService } from 'src/app/services/forms.service';
import { TiposTituloInversiones } from 'src/@vex/interfaces/enums';

@Component({
  selector: 'vex-detalles-inversion',
  templateUrl: './detalles-inversion.component.html',
  styleUrls: ['./detalles-inversion.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
	animations: [ stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms ]
})

export class DetallesInversionComponent implements OnInit {
  layoutCtrl                = new FormControl('boxed');
  icroundMonetizationOn     = iconify.icroundMonetizationOn;
  icroundTableChart         = iconify.icroundTableChart;
  icroundAttachFile         =iconify.icroundAttachFile;
  icroundFormatAlignJustify =iconify.icroundFormatAlignJustify;
  icroundPriceChange        =iconify.icroundPriceChange;
  icroundAttachMoney        =iconify.icroundAttachMoney;
  icroundEvent              =iconify.icroundEvent;
  icroundPercent            =iconify.icroundPercent;
  icroundNumbers            =iconify.icroundNumbers
  icDescription = icDescription;
  idHasAmortization         =true;
  simboloMoneda: string     ='$';
  currentDate               = moment();
  totalesDetalleInversion:any =[];
  detalleInversion: Inversion;

  id: any = this.route.snapshot.paramMap.get("id");
  tipo: any = this.route.snapshot.paramMap.get("tipo");
  
  editar = false;
  tiposRentas = ["Fijo", "Variable"];
  dataCalificadora;
  accionCalificadora:boolean = false;
  calificadoras: any[] = [];
  emisores: any[] = [];

  esAccion: boolean = false;
  esBono: boolean = false;
  idAdministrador:number = 1;
  esAdministrador:boolean = false;

  public filteredEmisores: ReplaySubject<Emisor[]> = new ReplaySubject<Emisor[]>(1);
  public filteredCalificadoras: ReplaySubject<Calificadora[]> = new ReplaySubject<Calificadora[]>(1);

  protected _onDestroy = new Subject<void>();
  
  public emisorFilterCtrl: FormControl = new FormControl();
  public calificadoraFilterCtrl: FormControl = new FormControl();

  calificaciones = [];

  // Banderas
  mostrarDetalle = false;

  formGenerales = this.fb.group({
    //valor
    tipoRentaTitle:           [''],
    tipoRenta:                [''],
    idTipoInversion:          [''],
    tipoInversion:            [''],
    numeroCertificado:        [''],
    codigo:                   [''],
    descripcion:              [''],
    serieTransaccion:         [''],
    idSectorFinanciero:       [''],
    fechaRegistro:            [''],
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
    fechaCompra:              [''],
    //plazo
    fechaEmision:             [''],
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
  loadGraphic: boolean;

  @ViewChild('singleSelect') singleSelect: MatSelect;

  constructor(
    private route: ActivatedRoute,
    private dataService: InversionesService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private formsService:       FormsService,
  ) { }

  detectarCambios() {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.spinner.show();
    this.cargarDetalle();
  }


  asignTotalsDetails(){
    this.totalesDetalleInversion={"totalCapital": this.detalleInversion.totalCapital,
    "totalCobrar": this.detalleInversion.totalCobrar,
    "totalInteres":this.detalleInversion.totalInteres,
    "diasPlazo":this.detalleInversion.diasPlazo}
  }


  Remplace365Calculate(detalleInversion){
    if(detalleInversion.idTipoInversion==TiposTituloInversiones.Bonos){
    const numero =this.formsService.calculateDays360(detalleInversion.fechaEmision,detalleInversion.fechaVencimiento) 
    const cuota=detalleInversion.dividendo.length;
    const day365=numero/cuota
    detalleInversion.dividendo.forEach(cuota => {
      cuota.dias=day365
    });
    }
  }

  cargarDetalle() {
    this.dataService.getInversionesById(this.id).subscribe( res => {
      this.detalleInversion = res["result"];
      this.Remplace365Calculate(this.detalleInversion)
      this.formGenerales.patchValue( res["result"]); 
      this.asignTotalsDetails();
      this.cambioTipoRenta();
      const tipoInversion = this.formGenerales.value.tipoInversion.toLowerCase();
      switch (tipoInversion) {
        case "acciones":
          this.esAccion = true;
          this.esBono = false;
          this.idHasAmortization=false;
          this.formGenerales.controls["desdeAccion"].setValue(this.detalleInversion["detalleTitulo"]["desde"])
          this.formGenerales.controls["hastaAccion"].setValue(this.detalleInversion["detalleTitulo"]["hasta"])
          this.formGenerales.controls["numeroAcciones"].setValue(this.detalleInversion["detalleTitulo"]["cantidad"])
          this.formGenerales.controls["precioPorAccion"].setValue(this.detalleInversion["detalleTitulo"]["precioPorAccion"])
          this.formGenerales.controls["valorMercado"].setValue(this.detalleInversion["detalleTitulo"]["valorMercado"])
          
          if(this.detalleInversion.fechaCompra){
            const FORMATO_ENTRADA = 'YYYY-MM-DD';
            const fechaCompra = moment(this.detalleInversion.fechaCompra,FORMATO_ENTRADA);
            this.detalleInversion.fechaCompra = fechaCompra.format(FORMATO_ENTRADA) ; 
            this.formGenerales.controls["fechaCompra"].setValue(fechaCompra.format(FORMATO_ENTRADA))
          }
          break;
        case "bonos":
          this.esBono = true;
          this.esAccion = false;
          this.idHasAmortization=true;
          break;
        case "certificado de deposito a plazo fijo":
          this.idHasAmortization=true;
          break;
      }
      
      this.mostrarDetalle = true;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    })
  }
  
  onTabClick(event){
    if (event.tab.textLabel == "historialPrecios") {
      this.loadGraphic = true;
    }
  }

  cambioTipoRenta() {
    if(this.formGenerales.value.tipoRenta=='V'){
      this.formGenerales.controls["tipoRentaTitle"].setValue('Variable')
      
    }else{
      this.formGenerales.controls["tipoRentaTitle"].setValue('Fijo')
    }
  }

}
