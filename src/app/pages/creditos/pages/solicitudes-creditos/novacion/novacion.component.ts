import {
  PutSolicitud,
  Direccion,
  PrestamosEstados,
  Participe,
} from "../../../../../model/models";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  AfterViewInit,
  ViewChild,
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
import { Solicitud, Identificacion, Parroquia } from "../../../../../model/models";
import { DataService } from "../../../../../services/data.service";
import { Observable, ReplaySubject, Subject} from "rxjs";
import moment from "moment";
import { ModalTablaAmortizacionComponent } from "../../../modal-tabla-amortizacion/modal-tabla-amortizacion.component";
import { ModalValidacionSolicitudComponent } from "../../../pages/simulador/modal-validacion-solicitud/modal-validacion-solicitud.component";
import { ComponentesService } from "../../../../../services/componentes.service";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { NGXLogger } from "ngx-logger";
import { CreditosService } from "../../../creditos.service";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import { AuthService } from "../../../../auth/auth.service";
import { ModalEditDatosBancariosComponent } from "../../../../../components/referencias-bancarias/modal-edit-datos-bancarios/modal-edit-datos-bancarios.component";
import icEdit from "@iconify/icons-ic/twotone-edit";
import { AdjuntosService } from "src/app/services/adjuntos.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CreditoServiceComponent } from "src/app/services/creditos.service";
import { CalculadoraComponent } from "../../../pages/simulador/calculadora/calculadora.component";
import { Garante, GaranteCreditos, SolicitudCredito, ValidacionSimulacion } from "../../../model/models-creditos";


@Component({
  selector: "vex-novacion",
  templateUrl: "./novacion.component.html",
  styleUrls: ["./novacion.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  providers: [NgbModalConfig, NgbModal],
})
export class NovacionComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  newataCuentasBancarias;
  subjectPrestamo: ReplaySubject<PrestamosEstados[]> = new ReplaySubject<any[]>(
    1
  );
  dataPrestamo: Observable<PrestamosEstados[]> =
    this.subjectPrestamo.asObservable();
    @Output() changeVerificarDatos = new EventEmitter<any>();

  subject2$: ReplaySubject<PrestamosEstados[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<PrestamosEstados[]> = this.subject2$.asObservable();
  // ICONOS
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icSearch = icSearch;
  icDelete = icDelete;
  icPdf = icPdf;
  icEdit = icEdit;
  loading: boolean = false;

  // FORMGROUPS
  horizontaldatosContacto: FormGroup;
  horizontaldatosEconomicos: FormGroup;
  horizontalrolOtrosIngresos: FormGroup;
  horizontalrolPago: FormGroup;
  horizontalcalculadora: FormGroup;
  horizontalgarente: FormGroup;
  horizontalvideo: FormGroup;
  prestamosForm: FormGroup;

  //Hipoteario
  horizontaladjuntosHipotecarios: FormGroup;
  //PRENDARIO
  horizontaladjuntosPrendarios: FormGroup;
  horizontalSolicitar: FormGroup;
  datosContacto: FormGroup;
  datosEconomicos: FormGroup;
  otroIngresos: FormGroup;
  rolPago: FormGroup;
  calculadora: FormGroup;
  garente: FormGroup;
  //Hipoteario
  adjuntosHipotecarios: FormGroup;
  //PRENDARIO
  adjuntosPrendarios: FormGroup;

  columnasPrestamo = [
    "checkbox",
    "identificacion",
    "nombre",
    "montoSolicitado",
    "capitalOtorgado",
    "tipoPrestamo",
    "fecha",
    "calificacion",
  ];

  // VARIABLES CATALOGO
  tipoDouble = 0.0;
  existeArchivoBancario = false;

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
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10];
  mostrarVideo = false;
  pasarStep = false;
  actualizarDatos = true;
  sinInformacion: any = "N/A";
  datoNulo = null;
  dataSimulacion: any;
  rolPagoAdjunto;
  showGarante: any = false;
  showHipotecario = false;
  showPrendario = false;
  prestamoNovacion = false;
  guardoRoldePago = false;


  tiposCuentas: any = [];

  productoFinanciero;
  @Input() productosFinancieros=[];

 
  dataGarantes;
  identificacion;
  identificacionGarante;
  valorPrestamo = 0.0;

  //Garantes
  garanteTabla: any = [];
  garante: any = {
    nombre: "",
    identificacion: "",
  };
  mostrarNombreGarante = false;
  showProforma: boolean = false;
  proveedores: Participe[] = [];

  customers2: any[];

  dataFondoSource;
  displayedColumns = ["nombre", "monto", "accion"];
  displayedColumns2 = [
    "fechaActualizacion",
    "institucion",
    "tipocuenta",
    "numerocuenta",
    "adjunto",
    "accion",
  ];

  participes: { idParticipe: number; razonSocial: string }[];

  // VARIABLES CON MODELOS
  participe: Identificacion = {};
  solicitud: Solicitud = {};
  solicitudNueva: PutSolicitud = {};


  direccion: Direccion = {};

  mediaRecorder: MediaRecorder;

  simulacionPrestamo = {
    idParticipe: 0,
    fechaInicio: "",
    plazo: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    idProducto: 1,
    prestamos: [],
    idPrestamo:"",
/*  valorCuota:0,
    valorMora:0, 
    moraCalculada:0,*/
    garantes:[],
    garantias:[],
  };

  adjuntoCertificadoBan = {
    observaciones: "",
    adjunto: "",
  };

  solicitudPrestamo = {
    idParticipe: 0,
    fecha: "",
    plazo: 0,
    idProducto: 1,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    valorCuota: 0,
    motivoPrestamo: "",
    comentarios: "",
    garantias: [],
    garantes: [],
    prestamos: [],
    observaciones: "",
    fechaActualizacion: "",
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

  selection = new SelectionModel<PrestamosEstados>(true, []);

  prestamosParticipe: PrestamosEstados[] = [];
  existeCedula = false;
  existeCedulaGarante = false;

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
  comentarioActividad: string;
  observacionesPrestamo;
  parroquias: Parroquia;

  identificacionRouter: any =
    this.route.snapshot.paramMap.get("identificacion");

  dataFondoPrestamos: MatTableDataSource<any> | null;

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

  showfecha = true;
  fechaRolPagoAdjunto;

  minDate;
  maxDate;
  input_date;

  institucionesFinancierasDataFilterCtrl: FormControl = new FormControl();
  searching: boolean;
  filteredInstituciones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _Destroy = new Subject<void>();
  newRefReady: boolean = false;
  fechaActual: any;
  linkCedulaFrontal: any;
  linkCedulaPosterior: any;
  direccionTemp: Direccion[];
  solicitudCreditoRequest: SolicitudCredito;

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
    private creditoService: CreditosService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private componentService: ComponentesService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private authService: AuthService,
    private adjuntosCreditosService: AdjuntosService,
    private sanitizer: DomSanitizer,
    private creditoServiceComponent: CreditoServiceComponent
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
    this.fechaActual = new Date().toISOString().split("T")[0];

    // INICIALIZACION
   
    this.solicitudNueva.lugarNacimiento = "N/A";


    this.formsGroups();
    this.cargarDatos();

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

    this.fechaRolPagoAdjunto = this.maxDate;
    this.solicitudPrestamo.fechaActualizacion = moment()
      .subtract(day, "d")
      .format("MMMM YYYY");
    this.input_date = moment().subtract(moment()["_d"].getDate(), "d");
  }

  cargarDatos() {
    // PRODUCTOS FINANCIEROS
    this.productosFinancieros = [];
    this.dataService.getProductosFinancieros().subscribe((res: any) => {
      this.spinner.hide();

      this.productosFinancieros = res;
      this.productosFinancieros.forEach((produc) => {
        if (produc.idProducto == 1) {
          this.productoFinanciero = produc;
        }
      });
    });

  }
  private _onDestroy(
    _onDestroy: any
  ): import("rxjs").OperatorFunction<any, any> {
    throw new Error("Method not implemented.");
  }

  cambioProductoFinanciero(event) {
    this.productoFinanciero = event.value;
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




  
  ngAfterViewInit() {
    this.calculadoraComponent.hasPrestamos=true;
    this.calculadoraComponent.simulacionFormGroup.controls["tipoPrestamo"].setValue("Novacion")
    this.calculadoraComponent.cambiarPrestamo("Novacion")
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

    // CALCULADORA
    this.calculadora = this.fb.group({
      montocredito: [""],
      tasa: [""],
      duracion: [""],
      motivocredito: [""],
      observaciones: [""],
      comentario: [""],
    });

    this.prestamosForm = this.fb.group({
      prestamos: new FormControl(
        "",
        [
          // validaciones síncronas
          Validators.required,
        ],
        [
          // validaciones asíncronas
        ]
      ),
    });
  }

  
cambiarDataGrafico(){
  //muestra simulaicon
  this.totalPagar = this.dataSimulacion.totalPrestamo;
  this.totalInsteres = this.dataSimulacion.totalInteres;
  this.totalCapital = this.dataSimulacion.totalCapital;
  this.pagoMensual = this.dataSimulacion.cuotas[0].total;
  this.tasaNominal = this.dataSimulacion.tasa.toFixed(2);
  this.tasaefectiva = this.dataSimulacion.tasaEfectiva.toFixed(2);
  this.ngAfterViewInit();
 }
 
 

  open(content) {
    this.modalService.open(content);
  }

  tablaAmortizacion() {
    if (this.dataSimulacion) {
      const dialogRef = this.dialog.open(ModalTablaAmortizacionComponent, {
        width: "100%",
        autoFocus: false,
        maxHeight: "90vh",
        data: { data: this.dataSimulacion },
      });

      dialogRef.afterClosed().subscribe((result) => {});

      this.solicitudPrestamo.fecha = this.date;
      this.solicitudPrestamo.idProducto = this.productoFinanciero.idProducto;
      this.solicitudPrestamo.idParticipe = this.participe.idParticipe;
    } else {
      this.componentService.alerta("info", "Genera la simulacion primero");
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



  getPrestamos() {
    this.creditoService
      .getPrestamoByIdParticipe(this.participe.idParticipe)
      .subscribe((res: any) => {
        this.prestamosParticipe = res["result"];
      });
  }

  generarData(data){
    this.solicitudCreditoRequest=null;
    this.participe=data
    this.garanteCreditos=[]
    this.garanteAdjuntos = [];
    this.validaciones=[];
    this.hasGarante=false;
    this.calculadoraComponent.hasSaldoNeto=true;
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



  
  clickPrestamos(stepper: MatStepper) {
    this.solicitudPrestamo.prestamos = this.idPrestamos;
    this.solicitudPrestamo.montoSolicitado = this.valorPrestamo;

    this.simulacionPrestamo.prestamos = this.idPrestamos;
    this.simulacionPrestamo.montoSolicitado = this.valorPrestamo;
    stepper.selected.completed = true;

    stepper.next();
  }

  adjuntarArchivoPrestamo(
    idPrestamo: number,
    tipoAdjunto: string,
    adjunto,
    observacion?,
    idEntidad?
  ) {
    if (adjunto) {
      const data = {
        tipoAdjunto: tipoAdjunto,
        adjunto: adjunto,
        idEntidad: idEntidad,
      };
      if (observacion) data["observaciones"] = observacion;
      this.creditoService.postPrestamoAdjuntos(idPrestamo, data).subscribe(
        (response) => {},
        (error) => {
          this.componentService.alerta(
            "error",
            "Ocurrió un error al adjuntar archivo " + tipoAdjunto
          );
        }
      );
    }
  }

  adjuntarComentarioActividad(idPrestamo: number, comentarioActividad: string) {
    if (comentarioActividad) {
      const data = {
        fecha: this.dataService.date,
        comentario: comentarioActividad,
        titulo: this.participe.titulo,
        funcionario: this.authService.getFuncionario(),
        idTipoTarea: 1,
        idEntidad: this.participe.idParticipe,
      };

      this.creditoService.postComentario(idPrestamo, data).subscribe();
    }
  }

  crearAdjuntos(idPrestamo: number) {
    this.adjuntarArchivoPrestamo(
      idPrestamo,
      "LiquidacionBIESS",
      this.base64Liquidacion,
      "",
      this.participe.idParticipe
    );
    this.adjuntarArchivoPrestamo(
      idPrestamo,
      "Autorizaciones",
      this.base64Autorizacion,
      "",
      this.participe.idParticipe
    );
    this.adjuntarArchivoPrestamo(
      idPrestamo,
      "OtrosIngresos",
      this.base64Prestamo,
      "",
      this.participe.idParticipe
    );
    this.adjuntarArchivoPrestamo(
      idPrestamo,
      "RolPagos",
      this.adjuntoRolPago.adjunto,
      this.fechaRolPagoAdjunto,
      this.participe.idParticipe
    );
    this.adjuntarComentarioActividad(idPrestamo, this.comentarioActividad);
    this.postAdjuntosByIdProducto(idPrestamo);
  }

  

  // POST PRODUCTO FINANCIERO
  postAdjuntosByIdProducto(idPrestamo) {
    switch (this.productoFinanciero.idProducto) {
      case 1:
        break;
      case 2:
        // HIPOTECARIO
        this.postAdjuntos(
          idPrestamo,
          this.cedulaFrontalConyuge,
          "CedulaConyugeFrontal"
        );
        this.postAdjuntos(
          idPrestamo,
          this.cedulaPosteriorConyuge,
          "CedulaConyugePosterior"
        );
        this.postAdjuntos(
          idPrestamo,
          this.proformaHipotecar,
          "RegistroPropiedad"
        );
        this.postAdjuntos(
          idPrestamo,
          this.certificadoInmueble,
          "CertificadoPredio"
        );
        this.postAdjuntos(idPrestamo, this.croquisInmueble, "Croquis");
        this.postAdjuntos(idPrestamo, this.buroCredito, "Autorizacion");
        break;
      case 3:
        // PRENDARIO
        this.postAdjuntos(
          idPrestamo,
          this.cedulaFrontalConyuge,
          "CedulaConyugeFrontal"
        );
        this.postAdjuntos(
          idPrestamo,
          this.cedulaPosteriorConyuge,
          "CedulaConyugePosterior"
        );
        this.postAdjuntos(idPrestamo, this.proformaVehiculo, "Proforma");
        this.postAdjuntos(idPrestamo, this.buroCredito, "Autorizacion");
        break;
      case 4:
        break;
    }
  }

  novacion(event) {
    this.prestamoNovacion = event;
    this.dataSimulacion = {};
  }

 
  //DESCARGAR
  descargarCertificado(item) {
    if (item.url) {
      window.open(item.url);
    } else {
      this.spinner.show();
      this.dataService
        .getReferenciaBancaria(item.idReferenciaBancaria)
        .subscribe(
          (res) => {
            window.open(res["changingThisBreaksApplicationSecurity"]);
            this.spinner.hide();
          },
          (error) => {
            //si el error es 404
            if (error.status == 404) {
              //se muestra el mensaje de Se ha producido un error, por favor ingrese un adjunto nuevo
              this.componentService.alerta(
                "error",
                "Se ha producido un error, por favor ingrese un adjunto nuevo"
              );
            } else {
              //si no es 404 se muestra el mensaje de Se ha producido un error, por favor intente nuevamente
              this.componentService.alerta(
                "error",
                "Se ha producido un error, por favor intente nuevamente"
              );
            }
            this.spinner.hide();
          }
        );
    }
  }

  descargarRolPagos() {
    this.spinner.show();
    let rol = URL.createObjectURL(this.rolPagoAdjunto);
    window.open(rol);
    this.spinner.hide();
  }
  idPrestamos: any[] = [];

  seleccionado($event, row) {
    if (!$event) return;
    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      var data = this.idPrestamos.find((id) => id == row.idPrestamo);

      if (data != row.idPrestamo) {
        this.valorPrestamo += row.saldoCapital;
        this.idPrestamos.push(row.idPrestamo);
      }
    } else {
      var index = this.idPrestamos.indexOf(row.idPrestamo);
      this.simulacionPrestamo.prestamos = this.idPrestamos;
      if (index > -1) {
        this.valorPrestamo -= row.saldoCapital;

        this.idPrestamos.splice(index, 1);
      }
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.idPrestamos = [];
      this.valorPrestamo = 0;
      return;
    }
    this.idPrestamos = [];
    this.valorPrestamo = 0;
    this.prestamosParticipe.forEach((row) => {
      this.selection.select(row);
      this.idPrestamos.push(row.idPrestamo);
      this.valorPrestamo += row.saldoCapital;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.prestamosParticipe.length;
    return numSelected === numRows;
  }

 

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


  openDialog(element: any = null) {

    const dialogRef = this.dialog.open(ModalEditDatosBancariosComponent, {
      width: "600px",
      data: {
        idReferenciaBancaria: element ? element.idReferenciaBancaria : null,
        idEntidadFinanciera: element ? element.idEntidadFinanciera : null,
        idTipoCuenta: element ? element.idTipoCuenta : null,
        numeroCuenta: element ? element.numeroCuenta : null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (element) {
          this.dataService
            .updateReferenciaBancaria(
              result,
              this.participe.idParticipe,
              result.idReferenciaBancaria
            )
            .subscribe(
              (res) => {
                this.componentService.alerta(
                  "success",
                  "Se actualizó correctamente los datos bancarios"
                );
              },
              (err) => {
                this.componentService.alerta(
                  "error",
                  "Error al actualizar los datos bancarios"
                );
              }
            );
        }
      }
    });
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
        this.adjuntoCedulaGarante.mimeType = files[0].type;
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
        this.adjuntoCedulaGarante.mimeType = files[0].type;
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
    this.creditoService.postPrestamoNovacion(this.solicitudCreditoRequest).subscribe(
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
