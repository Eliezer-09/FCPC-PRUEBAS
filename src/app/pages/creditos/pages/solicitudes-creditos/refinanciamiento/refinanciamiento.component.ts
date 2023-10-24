import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Inject,
  AfterViewChecked,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  PerfilEconomico,
  PutSolicitud,
  ReferenciaBancaria,
  Direccion,
  PrestamosEstados,
} from "../../../../../model/models";

//LIBRERIAS
import Swal from "sweetalert2";
import * as Chart from "chart.js";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MatStepper } from "@angular/material/stepper";

//ICONOS
import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icDescription from "@iconify/icons-ic/twotone-description";
import icSearch from "@iconify/icons-ic/twotone-search";
import icDelete from "@iconify/icons-ic/twotone-delete";
import { fadeInRight400ms } from "../../../../../../@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "../../../../../../@vex/animations/scale-in.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "../../../../../../@vex/animations/stagger.animation";
import {
  FormGroup,
  FormBuilder,
    Validators,
  FormControl,
} from "@angular/forms";
import {
  Solicitud,
  Participe,
  Identificacion,
  Parroquia,
} from "../../../../../model/models";
import { DataService } from "../../../../../services/data.service";
import { Observable,  ReplaySubject } from "rxjs";
import moment from "moment";
import { ComponentesService } from "../../../../../services/componentes.service";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NGXLogger } from "ngx-logger";
import { CreditosService } from "../../../creditos.service";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import { AdjuntosService } from "src/app/services/adjuntos.service";
import { ActualizarDatosParticipeComponent } from "../actualizar-datos-participe/actualizar-datos-participe.component";
import { CalculadoraComponent } from "../../../pages/simulador/calculadora/calculadora.component";
import { Garante, GaranteCreditos, SolicitudCredito, ValidacionSimulacion } from "../../../model/models-creditos";

@Component({
  selector: "vex-refinanciamiento",
  templateUrl: "./refinanciamiento.component.html",
  styleUrls: ["./refinanciamiento.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  providers: [NgbModalConfig, NgbModal],
})
export class RefinanciamientoComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  @Output() changeVerificarDatos = new EventEmitter<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subjectPrestamo: ReplaySubject<PrestamosEstados[]> = new ReplaySubject<any[]>(
    1
  );
  dataPrestamo: Observable<PrestamosEstados[]> =
    this.subjectPrestamo.asObservable();

  subject2$: ReplaySubject<PrestamosEstados[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<PrestamosEstados[]> = this.subject2$.asObservable();

  columnasPrestamo = [
    "checkbox",
    "identificacion",
    "nombre",
    "montoSolicitado",
    "capitalOtorgado",
    "tipoPrestamo",
    "diasVencido",
    "fecha",
    "calificacion",
  ];

  // ICONOS
  icPdf = icPdf;
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icSearch = icSearch;
  icDelete = icDelete;

  // FORMGROUPS
  horizontalrolOtrosIngresos: FormGroup;
  horizontaldatosContacto: FormGroup;
  horizontaldatosEconomicos: FormGroup;
  horizontaldatosBancarios: FormGroup;
  horizontalSolicitar: FormGroup;
  horizontalrolPago: FormGroup;
  horizontalcalculadora: FormGroup;
  horizontalgarente: FormGroup;
  horizontalvideo: FormGroup;
  horizontalPrestamos: FormGroup;
  horizontalDatosBancario: FormGroup;
  otroIngresos: FormGroup;
  //Hipoteario
  horizontaladjuntosHipotecarios: FormGroup;
  //PRENDARIO
  horizontaladjuntosPrendarios: FormGroup;
  datosContacto: FormGroup;
  datosEconomicos: FormGroup;
  datosBancarios: FormGroup;
  rolPago: FormGroup;
  calculadora: FormGroup;
  garente: FormGroup;
  prestamosForm: FormGroup;
  //Hipoteario
  adjuntosHipotecarios: FormGroup;
  //PRENDARIO
  adjuntosPrendarios: FormGroup;
  bancarioForm: FormGroup;
  datosBancario: FormGroup;
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
  base64;
  date = moment().format();
  pagoMensual = 0;
  tasa = 0;
  totalPagar = 0;
  totalCapital = 0;
  totalInsteres = 0;
  interesDescuento = 0;
  descuento = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10];
  mostrarVideo = false;
  pasarStep = false;
  actualizarDatos = true;
  sinInformacion: any = "N/A";
  datoNulo = null;
  dataSimulacion: any;
  valorMora;
  rolPagoAdjunto;
  showGarante: any = false;
  showHipotecario = false;
  showPrendario = false;
  prestamoNovacion = false;
  guardoRoldePago = false;
  guardoSolicitud = false;
  estadoParticipe;
  uniformadoActivo;

  buroCredito;

  // Hipotecario
  cedulaPosteriorConyuge;
  cedulaFrontalConyuge;
  proformaHipotecar;
  certificadoInmueble;
  croquisInmueble;

  // Prendario
  proformaVehiculo;

  // ARREGLOS CATALOGO
  provincias: any = [];
  ciudades: any = [];

  institucionesFinancieras: any = [];
  institucionesFinancierasData: any = [];
  tiposCuentas: any = [];

  direccionTemp: any = [];
  bancarioTemp: any = [];
  bancarioTempData: any = [];

  productoFinanciero={idProducto:1};
  @Input() productosFinancieros=[];

  estadosCivil;
  generos;
  grados = [];
  profesiones;
  niveles;
  dataGarantes;
  identificacion;
  identificacionGarante;
  valorPrestamo = 0;
  valorInteresMora = 0;
  esCasado = false;
  hasVencidos = true;
  esParticipe = true;
  comentarioActividad: string = "";

  //cuentas bancarios
  dataCuentasBancarias: MatTableDataSource<any> | null;

  garanteTabla: any = [];

  infoBancariosTabla: any = [];
  infoBancariosMapa: any = [];
  customers2: any[];

  dataFondoSource;
  displayedColumns = ["nombre", "monto", "accion"];
  displayedColumnsBanco = ["nombreCuenta", "tipoCuenta", "numeroCuenta"];
  displayedColumns2 = ["institucion", "tipocuenta", "numerocuenta", "adjunto"];

  participes: { idParticipe: number; razonSocial: string }[];

  // VARIABLES CON MODELOS
  participe: Identificacion = {};
  solicitud: Solicitud = {};
  solicitudNueva: PutSolicitud = {};
  parroquias: Parroquia;

  referenciaBancaria: ReferenciaBancaria = {};
  direccion: Direccion = {};

  mediaRecorder: MediaRecorder;

  // INTERFACEZ

  infoBancarios: any = {
    institucion: "",
    tipoCuenta: "",
    numeroCuenta: 0,
  };

  simulacionPrestamo = {
    idParticipe: 0,
    fechaInicio: "",
    plazo: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    idProducto: 0,
    intereses: 0,
/*     valorMora: 0, */
    prestamos: [],
    idPrestamo:"",
   /*  valorCuota:0, */
   /*  moraCalculada:0, */
    garantes:[],
    garantias:[],
    descuentoMora:0
  };

  garante: any = {
    nombre: "",
    identificacion: "",
  }
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
  /*   valorCuota: 0, */
    intereses: 0,
   /*  valorMora: 0, */
    motivoPrestamo: "",
    comentarios: "",
    garantias: [],
    garantes: [],
    prestamos: [],
    fechaActualizacion: "",
    idPrestamo:"",
   /*  moraCalculada:0, */
  };

  PostPrestamoSolicitud = {
    idParticipe: 0,
    fecha: "",
    plazo: 0,
    idProducto: 1,
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
  valorGarantia = 0;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  eliminarPosicion: any = {};
  eliminarPosicion2: any = {};
  observacionesPrestamo;
  identificacionRouter: any =
    this.route.snapshot.paramMap.get("identificacion");
  dataFondoPrestamos: MatTableDataSource<any> | null;
  selection = new SelectionModel<PrestamosEstados>(true, []);

  prestamosParticipe: PrestamosEstados[] = [];
  existeCedula = false;
  idPrestamos: any[] = [];
  montos: any[] = [];
  nombreLiquidacion: string;
  nombreAutorizacion: string;
  nombreOtrosIngresos: string;
  nombreFirmaSolicitud: string;
  nombreRolPago: string;
  nombreAutorizacionBuro: string;
  guardoAutorizacion = false;
  nombreCedulaGarante: string;
  nombreCedulaPosteriorGarante: string;
  nombreRolGarante: string;

  nombreArchivoRol: string;
  nombreArchivoProforma: string;
  nombreCedulaFrontalConyuge: string;
  nombreCedulaPosteriorConyuge: string;
  nombreBienHipotecar: string;
  nombreCertificadoInmueble: string;
  nombreCroquisInmueble: string;
  nombreBuroCredito: string;

  //variables para guardar la cédula
  nombreCedulaFrontal: String;
  nombreCedulaPosterior: String;

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

  adjuntoSolicitudRefinanciamiento = {
    adjunto: "",
    name: "",
    mimeType: "",
  };

  adjuntoAutorizacion = {
    tipoAdjunto: "Autorizacion",
    adjunto: "",
    name: "",
    mimeType: "",
  };

  showProforma: boolean = false;
  proveedores: Participe[] = [];

  fechaRolPagoAdjunto;
  minDate;
  maxDate;
  input_date;
  linkCedulaFrontal: any;
  linkCedulaPosterior: any;
  solicitudCreditoRequest: SolicitudCredito;
  existeCedulaGarante = false;
  mostrarNombreGarante = false;

  hasGarante:boolean=false;
  validaciones:ValidacionSimulacion[]=[]
  verificarDatos:boolean=false;
  isSimulacion:boolean=false;
  textAdjuntoSolicitud = this.fb.group({
    motivocredito: ["",[Validators.required]],
    observaciones: ["",[Validators.required]],
    comentario: ["",[Validators.required]],
    fechaActualizacion:["",[Validators.required]]
  });
  @ViewChild(CalculadoraComponent) calculadoraComponent:CalculadoraComponent;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private dataComponente: ComponentesService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private creditoService: CreditosService,
    private adjuntosCreditosService: AdjuntosService,
    private componentService: ComponentesService,
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


    // INICIALIZACION
    this.institucionesFinancieras = [];
    this.solicitudNueva.lugarNacimiento = "N/A";

    this.dataCuentasBancarias = new MatTableDataSource();
    this.infoBancariosMapa = [];
    this.infoBancariosTabla = [];

  
    this.formsGroups();

    this.garente = this.fb.group({
      monto: [],
    });
    this.limitDays();
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

    this.solicitudPrestamo.fechaActualizacion = this.maxDate;
    this.fechaRolPagoAdjunto = moment().subtract(day, "d").format("MMMM YYYY");
    this.input_date = moment().subtract(moment()["_d"].getDate(), "d");
  }


  ngAfterViewInit() {
    this.calculadoraComponent.hasPrestamos=true;
    this.calculadoraComponent.hasFechaInicio=true; 
    this.calculadoraComponent.hasOnePrestamo=true;
    this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Refinanciamiento")
    this.calculadoraComponent.cambiarPrestamo("Refinanciamiento")
  }

  detectarCambios() {
    this.changeDetectorRefs.detectChanges();
  }

  // ADJUNTOS
  async handleFileInput(files: FileList, item?) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }
    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.archivoDatosBancario = res;
        this.existeArchivoBancario = true;
        this.adjuntoCertificadoBan.adjunto = res;
        this.dataService
          .postReferenciaBancaria(
            item.idReferenciaBancaria,
            this.adjuntoCertificadoBan
          )
          .subscribe(
            (res) => {
              this.spinner.hide();
            },
            (error) => {
              this.spinner.hide();
            }
          );

        const data = this.bancarioTemp.findIndex(
          (rest) => rest.numeroCuenta == item.numeroCuenta
        );
        const dataGuardar = this.bancarioTempData.findIndex(
          (rest) => rest.numeroCuenta == item.numeroCuenta
        );

        this.bancarioTemp[data] = this.referenciaBancaria;

        const infoGuardar: any = {
          idEntidadFinanciera: item.idEntidadFinanciera,
          idTipoCuenta: item.idTipoCuenta,
          numeroCuenta: item.numeroCuenta,
        };
        this.bancarioTempData[dataGuardar] = infoGuardar;
        /*       this.solicitudNueva.referenciasBancarias = this.bancarioTempData; */
      },
      (error) => {
        this.existeArchivoBancario = false;
      }
    );
  }

  adjuntoCedulafrontalConyuge(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.cedulaFrontalConyuge = res;
      },
      (error) => {}
    );
  }

  adjuntoCedulaPosteriorConyuge(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.cedulaPosteriorConyuge = res;
      },
      (error) => {}
    );
  }

  adjuntoBuroCredito(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.buroCredito = res;
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
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.proformaHipotecar = res;
      },
      (error) => {}
    );
  }

  adjuntoCertificadoInmueble(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.certificadoInmueble = res;
      },
      (error) => {}
    );
  }

  adjuntoCroquisInmueble(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.croquisInmueble = res;
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
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.proformaVehiculo = res;
      },
      (error) => {}
    );
  }




  // INICIALIZACION DE LOS FORMS GROUPS CON SUS CAMPOS
  formsGroups() {
    // DATOS DE CONTACTO
    this.datosContacto = this.fb.group({
      identificacion: ["", [Validators.required]],
      direccion: ["", Validators.required],
      referencia: ["", Validators.required],
      correo1: ["", Validators.required],
      telefono1: ["", Validators.required],
      telefono2: [""],
      fechanacimiento: [""],
      celular: ["", Validators.required],
      nombre: [""],
      titulo: [""],
      identificacionConyuge: [""],
      conyuge: [""],
      cedulaFrontal: [""],
      cedulaPosterior: [""],
    });

   

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

    
  }



  open(content) {
    this.modalService.open(content);
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
    this.calculadoraComponent.changeParticipe(this.participe)
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

  clickSolicitud() {
    this.spinner.show();
    //REVISAR PARA QUE SEA DINAMICO LA SELECCION DEL PRODUCTO FINANCIERO
    if (this.guardoSolicitud) {
      this.dataComponente.alerta(
        "success",
        "Adjunto firma de solicitud exitosamente"
      );
      this.spinner.hide();

    } else {
      this.spinner.hide();
      this.dataComponente.alerta(
        "error",
        "Por favor adjunte la solicitud firmada"
      );
    }
  }


 

  clickAutorizacion(stepper: MatStepper) {
    this.spinner.show();
    if (this.guardoAutorizacion) {
      this.dataComponente.alerta(
        "success",
        "Adjunto autorización exitosamente"
      );
      this.spinner.hide();
      stepper.next();
    } else {
      this.spinner.hide();
      this.dataComponente
        .alertaButtons("¿Desea continuar sin adjuntar autorización?")
        .then((result) => {
          if (result.isConfirmed) {
            this.spinner.hide();
            stepper.next();
          }
        });
    }
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

  handleFileInputAutorizacion(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreAutorizacionBuro = files.item(0).name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.adjuntoAutorizacion.adjunto = res;
        this.adjuntoAutorizacion.name = this.nombreAutorizacion;
        this.adjuntoAutorizacion.mimeType = files[0].type;
        this.guardoAutorizacion = true;
      },
      (error) => {}
    );
  }

  cargarCedulaGarante(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreCedulaGarante = files[0].name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.adjuntoCedulaGarante.adjunto = res;
        this.adjuntoCedulaGarante.name = this.nombreCedulaGarante;
        this.adjuntoCedulaGarante.mimeType = files[0].type;
      },
      (error) => {
        this.dataComponente.errorHandler(error);
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
        this.adjuntoCedulaGarante.mimeType = files[0].type;
      },
      (error) => {
        this.dataComponente.errorHandler(error);
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
        this.adjuntoCedulaGarante.mimeType = files[0].type;
      },
      (error) => {
        this.dataComponente.errorHandler(error);
      }
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
          this.spinner.hide();
        } else {
          this.guardoRoldePago = false;
          this.spinner.hide();
          this.dataComponente.alerta(
            "info",
            "Ingrese correctamente el adjunto"
          );
        }
      },
      (error) => {}
    );
  }

  handleFileInputSolicitud(files: FileList) {
    if (!this.creditoService.validarPesoArchivo(files[0])) {
      return;
    }

    this.fileToUpload = files.item(0);
    this.nombreFirmaSolicitud = files.item(0).name;
    this.dataService.getBase64(this.fileToUpload).then(
      (res: any) => {
        this.rolPagoAdjunto = res;
        this.adjuntoSolicitudRefinanciamiento.adjunto = res;
        this.adjuntoSolicitudRefinanciamiento.name = this.nombreArchivoRol;
        this.adjuntoSolicitudRefinanciamiento.mimeType = files[0].type;
        this.guardoSolicitud = true;
        this.  clickSolicitud()
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
    this.creditoService
      .postPrestamoRefinanciamiento(this.solicitudCreditoRequest)
      .subscribe(
        async (res) => {
          let producto = {
            cedulaFrontalConyuge: this.cedulaFrontalConyuge,
            cedulaPosteriorConyuge: this.cedulaPosteriorConyuge,
            proformaHipotecar: this.proformaHipotecar,
            certificadoInmueble: this.certificadoInmueble,
            croquisInmueble: this.croquisInmueble,
            buroCredito: this.adjuntoAutorizacion,
            proformaVehiculo: this.proformaVehiculo,
            proformaExpress: null,
          };

          let data = {
            base64Liquidacion: this.base64Liquidacion,
            base64Autorizacion: this.base64Autorizacion,
            base64Prestamo: this.base64Prestamo,
            comentarioActividad: this.comentarioActividad,
            adjuntoRolPago: this.adjuntoRolPago,
            fechaRolPagoAdjunto: this.fechaRolPagoAdjunto,
            productoFinanciero: this.productoFinanciero,
            Solicitud: this.adjuntoSolicitudRefinanciamiento,
            buroCredito: this.adjuntoAutorizacion,
            /*           producto: producto */
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
          this.dataComponente
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
          this.dataComponente.alerta("error", `${error["error"]["message"]}`);
        }
      );
  }

 

  clickOtrosIngresos(stepper: MatStepper) {
    this.spinner.show();
    if (this.base64Prestamo.adjunto ) {
      this.dataComponente.alerta(
        "success",
        "Adjunto otros ingresos agregado exitosamente"
      ) .then((result) => {
        if (result.isConfirmed) {
          this.spinner.hide();
          stepper.next();
        }
      });
     
    }else{
      this.spinner.hide();
      stepper.next();
    }
  
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
    
    }
}
