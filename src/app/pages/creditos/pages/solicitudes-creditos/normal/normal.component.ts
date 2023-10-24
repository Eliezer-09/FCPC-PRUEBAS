import {
  PerfilEconomico,
  PutSolicitud,
  ReferenciaBancaria,
  Direccion,
  ProductosFinancieros,
  Identificacion,
  Participe,
  Solicitud,
  Garantes,
} from "../../../../../model/models";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";

//LIBRERIAS
import Swal from "sweetalert2";
import * as Chart from "chart.js";
import { MatDialog } from "@angular/material/dialog";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MatStepper } from "@angular/material/stepper";

//ICONOS
import icDescription from "@iconify/icons-ic/twotone-description";
import icDelete from "@iconify/icons-ic/twotone-delete";

import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icPdf from "@iconify/icons-ic/picture-as-pdf";

import { fadeInRight400ms } from "../../../../../../@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "../../../../../../@vex/animations/scale-in.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "../../../../../../@vex/animations/stagger.animation";
import {FormGroup,FormBuilder,Validators,FormControl} from "@angular/forms";
import { DataService } from "../../../../../services/data.service";
import { Observable, ReplaySubject } from "rxjs";
import moment from "moment";
import "moment/locale/es";
import { ComponentesService } from "../../../../../services/componentes.service";
import { ActivatedRoute } from "@angular/router";
import { CreditosService } from "../../../creditos.service";
import { NGXLogger } from "ngx-logger";
import { AdjuntosService } from "src/app/services/adjuntos.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CalculadoraComponent } from "../../../pages/simulador/calculadora/calculadora.component";
import { Garante, GaranteCreditos, SolicitudCredito, ValidacionSimulacion } from "../../../model/models-creditos";
import { GaranteComponent } from "../garante/garante.component";


@Component({
  selector: "vex-normal",
  templateUrl: "./normal.component.html",
  styleUrls: ["./normal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  providers: [NgbModalConfig, NgbModal],
})
export class NormalComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{

  @Output() changeVerificarDatos = new EventEmitter<any>();
  participe: Identificacion = {};
  isSimulacion:boolean=false;
  @ViewChild("video") captureElement: ElementRef;
  newRefReady: boolean = false;
  // ICONOS
  icDoneAll = icDoneAll;
  icPdf = icPdf;
  icDelete = icDelete;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icDescription = icDescription;

  // FORMGROUPS
  horizontalrolOtrosIngresos: FormGroup;
  horizontalrolPago: FormGroup;
  horizontalcalculadora: FormGroup;
  horizontalgarente: FormGroup;
  horizontalvideo: FormGroup;
  horizontalSolicitar: FormGroup;
  // EXPRESS
  horizontaladjuntosExpress: FormGroup;
  //Hipoteario
  horizontaladjuntosHipotecarios: FormGroup;
  //PRENDARIO
  horizontaladjuntosPrendarios: FormGroup;

  otroIngresos: FormGroup;
  rolPago: FormGroup;
  calculadora: FormGroup;
  garente: FormGroup;
  video: FormGroup;
  //Hipoteario
  adjuntosHipotecarios: FormGroup;
  // EXPRESS
  adjuntosExpress: FormGroup;
  //PRENDARIO
  adjuntosPrendarios: FormGroup;

  // VARIABLES CATALOGO
  tipoDouble = 0.0;
  existeArchivoBancario = false;
  archivoDatosBancario;
  archivoRoldePago;
  canvas: any;
  ctx: any;
  chartData = ["Sales q1", "Sales 2", "Sales 3", "Sales 4"];
  chartLabels = [120, 150.18, 90];
  chartType = "doughnut";
  tasaNominal = 0;
  tasaefectiva = 0;
  duracionProducFinanciero = 0;
  isRecording = false;
  base64;
  videos;
  date = moment().format();
  animal = "perro";
  pagoMensual = 0;
  tasa = 0;
  totalPagar = 0;
  totalCapital = 0;
  totalInsteres = 0;

  pageSizeOptions: number[] = [5, 10];
  mostrarVideo = false;
  pasarStep = false;
  actualizarDatos = true;
  sinInformacion: any = "N/A";
  datoNulo = null;
  dataSimulacion: any;
  rolPagoAdjunto;
  fechaRolPagoAdjunto;
  showHipotecario = false;
  showPrendario = false;
  prestamoNovacion = false;
  guardoRoldePago = false;

  // ARREGLOS CATALOGO
  provincias: any = [];
  ciudades: any = [];
  parroquias: any = [];

  institucionesFinancieras: any = [];

  direccionTemp: any = [];
  bancarioTemp: any = [];
  bancarioTempData: any = [];

  productoFinanciero: ProductosFinancieros = {};
  @Input() productosFinancieros;

  dataGarantes;
  identificacion;
  identificacionGarante;

  //cuentas bancarios

  garanteTabla: any = [];

  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  customers2: any[];

  dataFondoSource;
  displayedColumns = ["nombre", "monto", "accion"];
  displayedColumnsBanco = ["nombreCuenta", "tipoCuenta", "numeroCuenta"];

  participes: { idParticipe: number; razonSocial: string }[];

  // VARIABLES CON MODELOS
 
  solicitud: Solicitud = {};
  solicitudNueva: PutSolicitud = {};

 
  referenciaBancaria: ReferenciaBancaria = {};
  direccion: Direccion = {};

  mediaRecorder: MediaRecorder;

  // INTERFACEZ

  simulacionPrestamo = {
    idParticipe: 0,
    fechaInicio: "",
    plazo: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    idProducto: 0,
    idPrestamo:"",
/*     valorCuota:0,
    valorMora:0,
    moraCalculada:0, */
    garantes:[],
    garantias:[],
    prestamos:[]
  };

  adjuntoCertificadoBan = {
    observaciones: "",
    adjunto: "",
  };

  solicitudPrestamo = {
    idParticipe: 0,
    fecha: "",
    plazo: 0,
    idProducto: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    valorCuota: 0,
    idProveedor: 0,
    motivoPrestamo: "",
    comentarios: "",
    garantias: [],
    garantes: [],
    observaciones: "",
    idRefActualizada: 0,
    pathReferencia: "",
    fechaActualizacion: "",
  };

  PostPrestamoSolicitud = {
    idParticipe: 0,
    fecha: "",
    plazo: 0,
    idProducto: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    valorCuota: 0,
    motivoPrestamo: "",
  };

  result: Observable<{ idParticipe: number; razonSocial: string }[]>;
  keyword = "razonSocial";
  keyword2 = "identificacion";

  garanteCreditos:GaranteCreditos[] = [];
  garanteAdjuntos: Garante[] = [];
 
 
  // EJEMPLOS
  fileToUpload: File = null;
  afuConfig = {
    uploadAPI: {
      url: "https://example-file-upload-api",
    },
  };
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  eliminarPosicion: any = {};
  eliminarPosicion2: any = {};
  observacionesPrestamo: string;
  comentarioActividad: string;
  existeCedula = false;
  existeCedulaGarante = false;
  identificacionRouter: any =
    this.route.snapshot.paramMap.get("identificacion");
  showProforma: boolean = false;
  idProveedor: number;
  proveedores: Participe[] = [];
  nombreArchivoRol: string;
  nombreArchivoProforma: string;
  nombreCedulaFrontalConyuge: string;
  nombreCedulaPosteriorConyuge: string;
  nombreBienHipotecar: string;
  nombreCertificadoInmueble: string;
  nombreCroquisInmueble: string;
  nombreBuroCredito: string;
  nombreOtrosIngresos: string;
  nombreLiquidacion: string;
  nombreAutorizacion: string;

  //variables para guardar la cédula
  nombreCedulaFrontal: string;
  nombreCedulaPosterior: string;
  nombreCedulaGarante: string;
  nombreCedulaPosteriorGarante: string;
  nombreRolGarante: string;

  adjuntoCedulaFrontal;

  adjuntoCedulaPosterior;
  base64Prestamo = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  base64Liquidacion = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  base64Autorizacion = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  adjuntoRolPago = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  buroCredito = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  // Hipotecario
  cedulaPosteriorConyuge = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  cedulaFrontalConyuge = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  proformaHipotecar = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  proformaExpress = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  certificadoInmueble = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  croquisInmueble = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  // Prendario
  proformaVehiculo = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  adjuntoCedulaGarante = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  adjuntoCedulaPosteriorGarante = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  adjuntoRolGarante = {
    adjunto: "",
    name: "",
    mimeType: "",
  };
  minDate;
  maxDate;
  input_date;

  searching: boolean;
  loading: boolean = false;

  textAdjuntoSolicitud = this.fb.group({
    motivocredito: ["",[Validators.required]],
    observaciones: ["",[Validators.required]],
    comentario: ["",[Validators.required]],
    fechaActualizacion:["",[Validators.required]]
  });

  linkCedulaFrontal: any;
  linkCedulaPosterior: any;
  solicitudCreditoRequest: SolicitudCredito;
  hasGarante:boolean=false;
  validaciones:ValidacionSimulacion[]=[]
  verificarDatos:boolean=false;
  @ViewChild(CalculadoraComponent) calculadoraComponent:CalculadoraComponent;
  @ViewChild(GaranteComponent) garanteComponent:GaranteComponent;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private componentService: ComponentesService,
    private route: ActivatedRoute,
    private creditoService: CreditosService,
    private logger: NGXLogger,
    private adjuntosCreditosService: AdjuntosService,
    private sanitizer: DomSanitizer,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = "static";
    config.keyboard = false;
    this.solicitudPrestamo.tipoAmortizacion = "Francesa";
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  ngOnInit() {
    //solo fecha actual, no hora

    this.productoFinanciero.idProducto = 1;
    this.identificacion = this.identificacionRouter;
    // INICIALIZACION
    this.institucionesFinancieras = [];
    this.solicitudNueva.lugarNacimiento = "N/A";

   
    this.formsGroups();
    this.cargarDatos();
    this.garente = this.fb.group({
      monto: [],
    });

    this.limitDays();
  }

  ngAfterViewInit() {
    this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Normal")
  }

  limitDays() {
    let limitDay = moment().endOf("month").format("yyyy-MM-DD");
    let now = moment().format("yyyy-MM-DD");
    let day = moment()["_d"].getDate();
    if (limitDay == now) {
      this.maxDate = moment();
      this.minDate = moment()
        .subtract(day - 1, "d")
        .subtract(1, "M")
        .format();
    } else {
      this.maxDate = moment().subtract(day, "d").format();
      this.minDate = moment()
        .subtract(day - 1, "d")
        .subtract(2, "M")
        .format();
    }

    this.fechaRolPagoAdjunto = moment().subtract(day, "d").format("MMMM YYYY");
    this.input_date = moment().subtract(moment()["_d"].getDate(), "d");
  }

  cargarDatos() {
    // PRODUCTOS FINANCIEROS
    this.productosFinancieros = [];
    this.dataService.getProductosFinancieros().subscribe((res: any) => {
   /*    this.spinner.hide(); */
      this.productosFinancieros = res;
      this.productosFinancieros.forEach((produc) => {
        if (produc.idProducto == 1) {
          this.productoFinanciero = produc;
        }
      });
    });

    // TRAER LAS INSTITUCIONES FINANCIERAS

    this.pasarStep = true;
  }

  cambioProductoFinanciero(event) {
    this.productoFinanciero = event.value;
    this.calculadoraComponent.changeTipoProducto(this.productoFinanciero.idProducto)
    switch (this.productoFinanciero.idProducto) {
      case 1:
        this.showHipotecario = false;
        this.showPrendario = false;

        break;
      case 2: //DESA
        this.showHipotecario = true;
        this.showPrendario = false;
      case 9: //PROD
        this.showHipotecario = true;
        this.showPrendario = false;

        break;
      case 3:
        this.showHipotecario = false;
        this.showPrendario = true;

        break;
      case 4:
        break;
      case 7:
        this.showHipotecario = false;
        this.showPrendario = false;
        this.showProforma = true;
        this.listaProveedores();
        break;
    }
  }

  listaProveedores() {
    this.dataService.getProveedores().subscribe((res: any) => {
      this.proveedores = res["result"];
    });
  }


  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  
 
  // POST ADJUNTOS
  postAdjuntos(id, adjunto, tipoAdjunto) {
    const data = {
      tipoAdjunto: tipoAdjunto,
      adjunto: adjunto,
      observaciones: "N/A",
    };
    this.creditoService.postPrestamoAdjuntos(id, data).subscribe(
      (res) => {},
      (error) => {}
    );
  }


  // INICIALIZACION DE LOS FORMS GROUPS CON SUS CAMPOS
  formsGroups() {

    // ROL DE PAGO
    this.rolPago = this.fb.group({
      identificacion: [""],
      nombre: [""],
      adjunto: ["", Validators.required],
    });

    //ADJUNTOS HIPOTECARIOS
    this.adjuntosHipotecarios = this.fb.group({});

    //ADJUNTOS PRENDARIOS
    this.adjuntosPrendarios = this.fb.group({});

    //ADJUNTOS PRENDARIOS
    this.adjuntosExpress = this.fb.group({
      proveedor: [""],
    });

    // VIDEO
    this.video = this.fb.group({});
  }


generarData(data){
this.solicitudCreditoRequest=null;
this.participe=data
this.garanteCreditos=[]
this.garanteAdjuntos = [];
this.validaciones=[];
this.hasGarante=false;
this.calculadoraComponent.simulacionFormGroup.controls["idParticipe"].setValue(data.idParticipe)
this.calculadoraComponent.clearSimulator()
}


datosSimulacion(dataSimulacion) {
  this.solicitudCreditoRequest=dataSimulacion.solicitud;
  this.validaciones=dataSimulacion.data.validaciones
  this.solicitudCreditoRequest.idParticipe= this.participe.idParticipe;
}


AccionValidation(accion){
  if(accion=="garante"){
    this.hasGarante=true;
  }else{
    this.hasGarante=false;
  }
}


  generarAdjunto(adjunto) {
    let adjuntoSeguro = this.sanitizer.bypassSecurityTrustUrl(adjunto.url);
    return {
      nombreTipoAdjunto: adjunto.nombreTipoAdjunto,
      tipoAdjunto: adjunto.tipoAdjunto,
      nombre: "",
      idAdjunto: adjunto.idAdjunto,
      innerHtml: adjuntoSeguro["changingThisBreaksApplicationSecurity"],
    };
  }




  clickRolPago() {
    this.spinner.show();
    if (this.guardoRoldePago) {
      this.componentService.alerta(
        "success",
        "Adjunto rol de pago agregado exitosamente"
      );
      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.componentService.alerta("info", "Ingrese correctamente el adjunto");
    }
  }


  
  SolicitudCredito() {
    if (!this.textAdjuntoSolicitud.valid ) {
      this.componentService.alerta("info", "Debes ingresar todos los campos.");
      return;
    }

    if(!this.solicitudCreditoRequest){
      this.componentService.alerta("info", "Debes Realizar la simulación del crédito.");
      return;
    }
    
    this.solicitudCreditoRequest.comentarios=this.textAdjuntoSolicitud.value.comentario; 
    this.solicitudCreditoRequest.observaciones=this.textAdjuntoSolicitud.value.observaciones;
    this.solicitudCreditoRequest.motivoPrestamo= this.textAdjuntoSolicitud.value.motivocredito;
    this.solicitudCreditoRequest.fechaActualizacion=this.textAdjuntoSolicitud.value.fechaActualizacion;
    this.solicitudCreditoRequest.idProveedor = this.idProveedor;

    if (this.hasGarante ) {
      if( this.garanteCreditos.length != 0){
        this.solicitudCreditoRequest.garantes = this.garanteCreditos;
      } else {
        this.componentService.alerta("info", "Debe agregar almenos un garante");
        return;
    } 
  }
    
   this.crearSolicitudCredito(); 
         
  }

  

  descargarRolPagos() {
    this.spinner.show();
    let rol = URL.createObjectURL(this.rolPagoAdjunto);
    window.open(rol);
    this.spinner.hide();
  }


  showfecha = true;
  setMonthAndYear(event) {
    if (event) {
      this.fechaRolPagoAdjunto = moment(event).locale("es").format("YYYY-MM");
      
      const fechaActualizacion = moment(event)
        .endOf("month")
        .format("YYYY-MM-DD");
        this.textAdjuntoSolicitud.controls["fechaActualizacion"].setValue(fechaActualizacion)
      this.showfecha = true;
    } else {
      this.showfecha = false;
    }
  }

  cargarArchivoPrestamo(files: FileList, item?) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }
    this.fileToUpload = files.item(0);

    this.nombreOtrosIngresos = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.base64Prestamo.adjunto = res;
        this.base64Prestamo.name = this.nombreOtrosIngresos;
        this.base64Prestamo.mimeType = files[0].type;
        this.componentService.alerta(
          "success",
          "Adjunto otros ingresos agregado exitosamente"
        )
      },
      (error) => {
        this.existeArchivoBancario = false;
      }
    );
  }

  cargarArchivoLiquidacion(files: FileList, item?) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreLiquidacion = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then((res: any) => {
      this.base64Liquidacion.adjunto = res;
      this.base64Liquidacion.name = this.nombreLiquidacion;
      this.base64Liquidacion.mimeType = files[0].type;
    });
  }

  cargarArchivoAutorizacion(files: FileList, item?) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreAutorizacion = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then((res: any) => {
      this.base64Autorizacion.adjunto = res;
      this.base64Autorizacion.name = this.nombreAutorizacion;
      this.base64Autorizacion.mimeType = files[0].type;
    });
  }

  cargarCedulaGarante(files: FileList) {
    this.fileToUpload = files.item(0);

    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.nombreCedulaGarante = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.adjuntoCedulaGarante.adjunto = res;
        this.adjuntoCedulaGarante.name = this.nombreCedulaGarante;
        this.adjuntoCedulaGarante.mimeType = files[0].type;
      },
      (error) => {
        this.componentService.errorHandler(error);
      }
    );
  }

  cargarCedulaPosteriorGarante(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCedulaPosteriorGarante = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.adjuntoCedulaPosteriorGarante.adjunto = res;
        this.adjuntoCedulaPosteriorGarante.name =
          this.nombreCedulaPosteriorGarante;
        this.adjuntoCedulaPosteriorGarante.mimeType = files[0].type;
      },
      (error) => {
        this.componentService.errorHandler(error);
      }
    );
  }

  cargarRolGarante(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreRolGarante = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.adjuntoRolGarante.adjunto = res;
        this.adjuntoRolGarante.name = this.nombreRolGarante;
        this.adjuntoRolGarante.mimeType = files[0].type;
      },
      (error) => {
        this.componentService.errorHandler(error);
      }
    );
  }

  adjuntoCedulafrontalConyuge(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCedulaFrontalConyuge = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.cedulaFrontalConyuge.adjunto = res;
        this.cedulaFrontalConyuge.name = this.nombreCedulaFrontalConyuge;
        this.cedulaFrontalConyuge.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  adjuntoCedulaPosteriorConyuge(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCedulaPosteriorConyuge = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.cedulaPosteriorConyuge.adjunto = res;
        this.cedulaPosteriorConyuge.name = this.nombreCedulaPosteriorConyuge;
        this.cedulaPosteriorConyuge.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  adjuntoBuroCredito(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreBuroCredito = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.buroCredito.adjunto = res;
        this.buroCredito.name = this.nombreBuroCredito;
        this.buroCredito.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  //ADJUNTOS HIPOTECARIOS
  adjuntoProformaHipotecar(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreBienHipotecar = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.proformaHipotecar.adjunto = res;
        this.proformaHipotecar.name = this.nombreBienHipotecar;
        this.proformaHipotecar.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  //ADJUNTOS EXPRESS
  adjuntoExpress(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreArchivoProforma = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.proformaExpress.adjunto = res;
        this.proformaExpress.name = this.nombreArchivoProforma;
        this.proformaExpress.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  adjuntoCertificadoInmueble(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCertificadoInmueble = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.certificadoInmueble.adjunto = res;
        this.certificadoInmueble.name = this.nombreCertificadoInmueble;
        this.certificadoInmueble.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  adjuntoCroquisInmueble(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCroquisInmueble = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.croquisInmueble.adjunto = res;
        this.croquisInmueble.name = this.nombreCroquisInmueble;
        this.croquisInmueble.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  //ADJUNTOS PRENDARIOS
  AdjuntoProformaVehicular(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreArchivoProforma = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.proformaVehiculo.adjunto = res;
        this.proformaVehiculo.name = this.nombreArchivoProforma;
        this.proformaVehiculo.mimeType = files[0].type;
      },
      (error) => {}
    );
  }

  handleFileInputRol(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreArchivoRol = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.rolPagoAdjunto = this.fileToUpload;
        this.adjuntoRolPago.adjunto = res;
        this.adjuntoRolPago.name = this.nombreArchivoRol;
        this.adjuntoRolPago.mimeType = files[0].type;
    
        if (this.adjuntoRolPago.adjunto) {
          this.guardoRoldePago = true;
          this. clickRolPago()
          this.spinner.hide();
        } else {
          this.guardoRoldePago = false;
          this.spinner.hide();
          this.componentService.alerta(
            "info",
            "Ingrese correctamente el adjunto"
          );
        }
      },
      (error) => {}
    );
  }

  canSolicitar:boolean=true;

  changeCanSimularSolicitar(){
    this.spinner.hide();
    this.canSolicitar=true; 
  }


  crearSolicitudCredito() {
    this.spinner.show();
    this.canSolicitar=false; 
    this.creditoService.postPrestamo(this.solicitudCreditoRequest).subscribe(
      async (res) => {
        let producto = {
          cedulaFrontalConyuge: this.cedulaFrontalConyuge,
          cedulaPosteriorConyuge: this.cedulaPosteriorConyuge,
          proformaHipotecar: this.proformaHipotecar,
          certificadoInmueble: this.certificadoInmueble,
          croquisInmueble: this.croquisInmueble,
          buroCredito: this.buroCredito,
          proformaExpress: this.proformaExpress,
          proformaVehiculo: this.proformaVehiculo,
        };

        let data = {
          base64Liquidacion: this.base64Liquidacion,
          base64Autorizacion: this.base64Autorizacion,
          base64Prestamo: this.base64Prestamo,
          comentarioActividad: this.comentarioActividad,
          adjuntoRolPago: this.adjuntoRolPago,
          fechaRolPagoAdjunto: this.fechaRolPagoAdjunto,
          productoFinanciero: this.productoFinanciero,
          producto: this.productoFinanciero.idProducto != 1 ? producto : null,
        };
        this.adjuntosCreditosService.crearAdjuntosCredito(
          this.participe.idParticipe,
          res["result"]["idPrestamo"],
          data
        );

        if (this.garanteAdjuntos.length != 0) {
          this.adjuntosCreditosService.adjuntarDocumentosGarante(
            res["result"]["idPrestamo"],
            this.garanteAdjuntos
          );
        }
        this.componentService
          .alerta("success", "Solicitud de prestamo creado exitosamente!")
          .then(() => {
            this.spinner.hide();
            this.changeCanSimularSolicitar()
            location.reload();
          });
      },
      (error) => {
        this.spinner.hide();
        this.changeCanSimularSolicitar()
        this.componentService.alerta("error", `${error["error"]["message"]}`);
      }
    );
  }



  alertActualizarDatos(stepper){
    if(!this.verificarDatos){
    this.spinner.hide();
      this.componentService
        .alertaButtons("¿Estás seguro que el partícipe tiene los datos actualizados?")
        .then((result) => {
          if (result.isConfirmed) {
            this.spinner.hide();
            stepper.next();
            this.changeVerificarDatos.emit()
          }
        });
  }else{
    stepper.next();
  }
}
getGarante(garantes){
  this.garanteAdjuntos=garantes;
  this.garanteCreditos=[]
  garantes.forEach(garanteSelecccionado => {
    const garante: GaranteCreditos={
      idPersona:garanteSelecccionado.idPersona,
      montoGarantia:garanteSelecccionado.montoGarantia,
      observaciones: garanteSelecccionado.observaciones
    }
    this.garanteCreditos.push(garante)
  });
  console.log(this.garanteAdjuntos)

}

}
