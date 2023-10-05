import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import {
  stagger60ms,
  stagger80ms,
} from "src/@vex/animations/stagger.animation";

import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icDescription from "@iconify/icons-ic/twotone-description";
import icComent from "@iconify/icons-ic/comment";

import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Participe,
  Identificacion,
  Prestamo,
  OperationResult,
  Pagos,
  Garantes,
} from "src/app/model/models";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from "ngx-spinner";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { AppComponent } from "../../../app.component";
import { ReplaySubject, Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { filter, map } from "rxjs/operators";
import { ModalTablaAmortizacionComponent } from "../modal-tabla-amortizacion/modal-tabla-amortizacion.component";
// import { MatDialog } from '@angular/material/dialog';
import data from "@iconify/icons-ic/twotone-visibility";
import { MatStepper } from "@angular/material/stepper";
import { NGXLogger } from "ngx-logger";
import { AuthService } from "../../auth/auth.service";
import { CreditosService } from "../creditos.service";
import * as FileSaver from "file-saver";
import Swal from "sweetalert2";
import { iconify } from "src/static-data/icons";
import { TiposAdjunto } from "src/@vex/interfaces/enums";
import { Garante } from "../model/models-creditos";
import { LocalService } from "src/app/services/local.service";

@Component({
  selector: "vex-detalles-creditos",
  templateUrl: "./detalles-creditos.component.html",
  styleUrls: ["./detalles-creditos.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger60ms,
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class DetallesCreditosComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  icbaselineAttachMoney = iconify.icbaselineAttachMoney;
  // PARAMETROS RECIBIDOS
  id: any = this.route.snapshot.paramMap.get("id");
  idPrestamo: any = this.route.snapshot.paramMap.get("idprestamo");
  estado: any = this.route.snapshot.paramMap.get("estado");

  // ICONOS
  icDoneAll = icDoneAll;
  icDescription = icDescription;
  icVerticalSplit = icVerticalSplit;
  icVisibility = icVisiblity;
  icVisibilityOff = icVisibilityOff;
  icMoreVert = icMoreVert;
  icComent = icComent;

  // VARIABLES
  passwordInputType = "password";
  firma;
  cedulaFrontal;
  cedulaPosterior;
  rolPago;
  Aprobado = "PARTICIPE ACTIVO";
  Rechazado = "SOLICITUD RECHAZADA";
  Anulado = "ANULADO";
  Censado = "CENSADO";
  Completado = "COMPLETADO";
  Pendiente = "PENDIENTE DE APROBACION";
  NoDisponible = "NO ADHERIDO";
  estadoParticipe;
  color;
  respuesta;
  pageSize = 5;
  datosprestamoParticipe: any;
  var;
  nota: string;
  tieneCuentasbancarias = true;
  nombreBanco;
  tipoCuenta;
  show = true;
  isLoading = false;
  sinInformacion = "N/A";
  showAgregarCuenta = false;
  showAcreditacion = false;
  banderaRespuesta;
  hipotecario = false;
  prendario = false;
  cedulaConyugeFrontal;
  cedulaConyugePosterior;
  validaciones;
  fileToUpload: File = null;
  observaciones = "";
  prestamo: Prestamo;
  fotoParticipe;

  // BANDERA
  cargandoSpinner = true;

  // ARREGLOS
  customers2: any[];
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  dataFondoSource: MatTableDataSource<any> | null;
  prestamos: any = [];
  displayedColumns = [
    "#",
    "Interes",
    "Capital",
    "Cuota",
    "desgravamen",
    "Saldo",
  ];
  tablaAmortizacion: any[] = [];
  tablaAmortizacionSimulacion = [];
  pageSizeOptions: number[] = [5, 10, 20];
  garantesMostrar = [];
  referenciaBancaria;
  filesForDownload = [];

  actividadPrestamo = [];
  totalsSaldo = [
    { label: "Saldo Capital", saldo: "saldoCapital" },
    { label: "Saldo Interés", saldo: "saldoInteres" },
    { label: "Saldo Otros", saldo: "saldoOtros" },
    { label: "Saldo por Vencer", saldo: "saldoPorVencer" },
    { label: "Saldo Total", saldo: "saldoTotal" },
    { label: "Saldo Vencido", saldo: "saldoVencido" },
    { label: "Saldo Mora Calculada", saldo: "moraCalculada" },
  ];
  totalsInteres = [
    { label: "Interés Nominal", saldo: "interesNominal" },
    { label: "Interés Vencido", saldo: "interesVencido" },
  ];
  // INTERFACES
  participe: Participe;

  simulacionPrestamo = {
    idParticipe: 0,
    fechaInicio: "",
    plazo: 0,
    tipoAmortizacion: "Francesa",
    montoSolicitado: 0,
    idProducto: 0,
    totalMora: 0,
    totalMoraCalculada: 0,
    idPrestamo: null,
    valorCuota:0,
    valorMora:0,
    garantes:[],
    garantias:[],
    prestamos:[],
    moraCalculada: 0
  };

  comentarios = [
    {
      respuestas: "",
    },
  ];

  postTransferir = {
    comentarios: "",
    funcionario: this.authService.getFuncionario(),
    fecha: this.dataService.date,
    idReferenciaBancaria: null,
    monto: 0,
    cheque: "",
    idCuentaBancaria: 0,
  };

  //VARIABLES CABECERA
  montoSolicitado: number;
  plazo: number;
  tipoInteres;
  estadoPrestamo;
  interesNominal;
  creditoExpress = false;
  razonSocialProveedor: string;
  pagos: Pagos;
  tablaPagos = false;
  cuentasBancarias: any[] = [];

  totalCapital = 0;
  totalInteres = 0;
  totalCuota = 0;
  totalSaldo = 0;
  totalDesgravamen = 0;
  total = 0;
  totalMora = 0;
  totalMoraCalculada = 0;
  totales;
  hasDetalles = false;
  valorDescontado = 0;
  descuentoString;
  canAprobar:boolean=false;
  reestructurado: boolean = false;
  refinanciado: boolean = false;
  novacion:boolean=false
  garantes: Garante[] = [];
  prestamosRelacionados=[];
  cabecera: any;
  referenciasBancarias;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    // public dialog: MatDialog,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private creditoService: CreditosService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private changeDetectorRefs: ChangeDetectorRef,
    private componentService: ComponentesService,
    private authService: AuthService,
    private localServiceS: LocalService
  ) {
    this.estado = this.estado.toLowerCase();
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  ngAfterViewInit() {
    this.dataFondoSource.paginator = this.paginator;
    this.dataFondoSource.sort = this.sort;
  }

  ngOnInit() {
    const storedPermissionsCifrado = JSON.parse(this.localServiceS.getItem("permisos"));
    const idRol=storedPermissionsCifrado.idRol;
    this.canAprobar=idRol==12?false:true;
    this.cargarEstadoPrestamo();
    this.getAjuntoParticipe();
/*     this.cargarComentarios(); */
    this.obtenerGarantes();
  }

  cargarEstadoPrestamo() {
    if (this.estado) {
      this.showAcreditacion = true;
    }
    this.spinner.show();

    this.filesForDownload = [];
    this.dataFondoSource = new MatTableDataSource();
    this.creditoService
      .getPrestamoByIdPrestamo(this.idPrestamo)
      .subscribe(async (res: any) => {
        this.cabecera = res.result;
        this.tablaAmortizacion = res.result.detalles;
        res.result.detalles.length == 0
          ? (this.hasDetalles = false)
          : (this.hasDetalles = true);
        this.totalesTablaAmortizacion(this.tablaAmortizacion);
        this.prestamo = res.result;
        this.estadoPrestamo=res.result.estado;
        this.proveedorById(this.prestamo.idProveedor);
        this.prestamo = res.result;
        this.reestructurado = res.result.restructurado;
        this.novacion = res.result.esNovacion;
        this.refinanciado = res.result.refinanciado;
        this.cargarPrestamosRelacionados()
     /*    if(this.estadoPrestamo=="Pendiente"){ */
          this.getValidacionesCredito();
         /*  } */
      }),
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrio un error al traer los datos del prestamo"
        );
      };
    this.creditoService
      .getNewPagosIndividualesByPrestamo(this.idPrestamo)
      .subscribe(
        (res) => {
          this.pagos = res.result;

          this.tablaPagos = true;

          this.spinner.hide();
        },
        (error) => {
          this.componentService.alerta("error", error["error"]["message"]);
          this.spinner.hide();
        }
      );

    this.dataService.getParticipeById(this.id, this.idPrestamo).subscribe(
      (res: any) => {
        this.participe = res.result;

        this.getNewReferenciasBancarias();
        switch (this.participe?.estado) {
          case "Aprobado":
            this.estadoParticipe = this.Aprobado;
            break;
          case "Rechazado":
            this.estadoParticipe = this.Rechazado;
            break;
          case "Anulado":
            this.estadoParticipe = this.Anulado;
            break;
          case "Censado":
            this.estadoParticipe = this.Censado;
            break;
          case "Pendiente":
            this.estadoParticipe = this.Pendiente;
            break;
          case "NoDisponible":
            this.estadoParticipe = this.NoDisponible;
            break;
          case "Completado":
            this.estadoParticipe = this.Completado;
            break;
        }
        this.spinner.hide();
        this.datosCedula();

        this.getNewReferenciasBancarias();
        // this.garantes();
      },
      (error) => {
        this.spinner.hide();
        this.componentService.alerta(
          "error",
          "Ocurrio un error al traer los datos del partícipe"
        );
      }
    );

    this.creditoService
      .getCuentasBancarias()
      .subscribe((res: OperationResult) => {
        this.cuentasBancarias = res.result;
      });
  }
  obtenerGarantes() {
    this.spinner.show();
    //TODO ?
    this.creditoService.newGarantesByPrestamo(this.idPrestamo).subscribe(
      (res) => {
        this.garantes = res.result;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.componentService.alerta("error", error["error"]["message"]);
      }
    );
  }

  getNewReferenciasBancarias() {
    /*  this.loading = true; */
    this.dataService
      .getNewReferenciaBancaria(this.participe.idParticipe)
      .subscribe(
        (res) => {
          this.referenciasBancarias = res.result;
          this.referenciaBancaria = res.result;
        },
        (error) => {
          this.componentService.alerta(
            "error",
            "Error al cargar las referencias bancarias"
          );
          /*        this.loading = false; */
        }
      );
  }

  totalesTablaAmortizacion(tablaAmortizacion) {
    tablaAmortizacion.forEach((res: any) => {
      this.totalCapital = this.totalCapital + res.capital;
      this.totalInteres = this.totalInteres + res.interes;
      this.totalCuota = this.totalCuota + res.cuota;
      this.totalSaldo = this.totalSaldo + res.saldo;
      this.totalDesgravamen = this.totalDesgravamen + res.desgravamen;
      this.totalMora = this.totalMora + res.mora;
      this.totalMoraCalculada = this.totalMoraCalculada + res.moraCalculada;
      this.total = this.total + res.total;
    });
    this.totales = {
      capital: this.totalCapital,
      interes: this.totalInteres,
      cuota: this.totalCuota,
      saldo: this.totalSaldo,
      desgravamen: this.totalDesgravamen,
      mora: this.totalMora,
      moraCalculada: this.totalMoraCalculada,
      total: this.total,
    };
  }

  proveedorById(idProveedor) {
    if (idProveedor > 0)
      this.creditoService
        .getProveedorById(idProveedor)
        .subscribe((res: any) => {
          this.razonSocialProveedor = res.result.razonSocial;
        });
  }

  getAjuntoParticipe() {
    this.dataService.newGetAdjuntoById(this.id, TiposAdjunto.Foto).subscribe(
      (res: any) => {
        if (res["result"].length > 0) {
          this.fotoParticipe = res["result"][0].url;
        } else {
          this.componentService.alerta("info", "El participe no tiene firma");
        }
      },
      (error) => {}
    );
  }

  prestamosSimulacion=[]
  cargarPrestamosRelacionados() {
    this.creditoService.getPrestamosRelacionados(this.idPrestamo).subscribe(
      (data) => {
        this.prestamosRelacionados = data["result"];
        
        this.prestamosRelacionados.forEach(prestamos => {
          this.prestamosSimulacion.push(prestamos.idPrestamo)
        });
      },
      (error) => {}
    );
  }

  cargarComentarios() {
    this.dataService.getComentarios(this.idPrestamo).subscribe(
      (actividad) => {
        this.actividadPrestamo = actividad["result"];
        this.authService.getFotoFuncionario();
      },
      (error) => {
        this.componentService.alerta(
          "error",
          "Ocurrió un error al cargar los comentarios"
        );
      }
    );
  }

  colorCalificacionPrestamo(calificacion) {
    var color = "grey";
    if (calificacion) {
      var categoria = calificacion.substring(0, 1);

      if (categoria == "A") {
        color = "green";
      } else if (categoria == "B") {
        color = "lightskyblue";
      } else if (categoria == "C") {
        color = "orange";
      } else if (categoria == "D") {
        color = "pink";
      } else if (categoria == "E") {
        color = "red";
      }
    }
    return color;
  }

  datosCedula() {
    // CEDULA POSTERIOR
    this.spinner.show("Cargando cédula posterior...");
    this.dataService
      .newGetAdjuntoById(this.id, TiposAdjunto.cedulaPosterior)
      .subscribe(
        (res: any) => {
          if (res.result.length > 0) {
            const cedulas = res["result"];

            //filtrar cedulas que tengan idPrestamo == null
            const cedulasFiltradas = cedulas.filter(
              (cedula) => cedula.idPrestamo == null
            );

            this.cedulaPosterior = cedulasFiltradas[0].url;
            this.filesForDownload.push(this.cedulaPosterior);
          } else {
            this.componentService.alerta(
              "info",
              "El participe no tiene cedula posterior"
            );
          }

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "El participe no tiene cedula posterior"
          );
        }
      );

    // CEDULA FRONTAL
    this.spinner.show("Cargando cédula frontal...");
    this.dataService
      .newGetAdjuntoById(this.id, TiposAdjunto.cedulaFrontal)
      .subscribe(
        (res: any) => {
          if (res.result.length > 0) {
            const cedulas = res["result"];

            //filtrar cedulas que tengan idPrestamo == null
            const cedulasFiltradas = cedulas.filter(
              (cedula) => cedula.idPrestamo == null
            );

            this.cedulaFrontal = cedulasFiltradas[0].url;
            this.filesForDownload.push(this.cedulaFrontal);
          } else {
            this.componentService.alerta(
              "info",
              "El participe no tiene cedula frontal"
            );
          }

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "El participe no tiene cedula frontal"
          );
        }
      );
  }

  agregarCuentaBancaria() {
    this.showAgregarCuenta = true;
  }

  getRolPagoParticipe() {
    this.dataService
      .newGetAdjuntoById(this.id, TiposAdjunto.RolPagos)
      .subscribe(
        (res: any) => {
          if (res["result"].length > 0) {
            this.rolPago = res["result"][0].url;
            this.setInnerHtmlRol(this.rolPago);
            this.filesForDownload.push(this.rolPago);
          } else {
            this.componentService.alerta("info", "El participe no tiene firma");
          }

          this.spinner.hide();
        },

        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "El participe no tiene rol de pago"
          );
        }
      );
  }

  public innerHtmlRol: SafeHtml;
  public setInnerHtmlRol(pdfurl: string) {
    this.innerHtmlRol = this.sanitizer.bypassSecurityTrustHtml(
      "<object data='" +
        pdfurl +
        "' type='application/pdf' class='embed-responsive-item' style='width: 100%; height: 100% !important;'>" +
        "Object " +
        pdfurl +
        " failed" +
        "</object>"
    );
  }

  goReferenciaBancaria(stepper: MatStepper) {
    stepper.next();
    this.getNewReferenciasBancarias();
  }

  onTabChanged(event) {
    switch (event) {
      case 1:
        this.spinnerTiempo();
        break;

      default:
        break;
    }
  }

  spinnerTiempo() {
    setTimeout(() => {
      this.cargandoSpinner = false;
    }, 2000);
  }


  postSimulacion(res){
      /*   if (!this.hasDetalles) { */
      if(this.estadoPrestamo=="Pendiente"){ 
          this.totales = {
            capital: res.result.totalCapital,
            interes: res.result.totalInteres,
            cuota: res.result.totalCuota,
            saldo: res.result.totalSaldo,
            desgravamen: res.result.totalDesgravamen,
            mora: res.result.valorDiferido,
            moraCalculada: res.result.moraCalculada,
            total:  res.result.totalCapital,
          };
          this.cabecera = res.result;
      /*   } */
        this.tablaAmortizacionSimulacion = res.result.cuotas;
        this.prestamo.tasaEfectiva = res.result.tasaEfectiva;
      
        this.subject2$.next(this.tablaAmortizacion);
      this.tablaAmortizacion=res.result.cuotas
        }
        this.validaciones = res.result.validaciones;
        this.spinner.hide();
      }

  


  getValidacionesCredito() {
    this.spinner.show();
    this.simulacionPrestamo.idParticipe = this.prestamo.idParticipe;
    this.simulacionPrestamo.fechaInicio = String(this.prestamo.fecha);
    this.simulacionPrestamo.idProducto = this.prestamo.idProducto;
    this.simulacionPrestamo.montoSolicitado = this.prestamo.montoSolicitado;
    this.simulacionPrestamo.plazo = this.prestamo.plazo;
    this.simulacionPrestamo.tipoAmortizacion = this.prestamo.tipoAmortizacion;
    this.simulacionPrestamo.idPrestamo = this.prestamo.idPrestamo;
    this.simulacionPrestamo.valorCuota = this.prestamo.valorCuota;
    this.simulacionPrestamo.valorMora = this.prestamo.totalMora;
    this.simulacionPrestamo.moraCalculada = this.prestamo.moraCalculada;
    this.simulacionPrestamo.garantes = this.prestamo.garantes;
    this.simulacionPrestamo.garantias = this.prestamo.garantias;
    this.simulacionPrestamo.prestamos = this.prestamosSimulacion;
    
    if (this.novacion) {
      this.creditoService.postSimulacionNovacion(this.simulacionPrestamo).subscribe(
        (res: any) => {
          this.postSimulacion(res)
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "Ocurrio un error al generar la tabla de amortizacion"
          );
        }
      );
    }else if(this.reestructurado){
      this.creditoService.postSimulacionRestructuracion(this.simulacionPrestamo).subscribe(
        (res: any) => {
          this.postSimulacion(res)
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "Ocurrio un error al generar la tabla de amortizacion"
          );
        }
      );
    }else if(this.refinanciado){
      this.creditoService.postSimulacionRefinanciamiento(this.simulacionPrestamo).subscribe(
        (res: any) => {
          this.postSimulacion(res)
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "Ocurrio un error al generar la tabla de amortizacion"
          );
        }
      );
    }else {
/*       this.valorDescontado =
        this.prestamo.moraAnterior * (this.prestamo.descuentoMora / 100);
      this.descuentoString =
        this.valorDescontado.toString() +
        "(" +
        this.prestamo.descuentoMora +
        "%)";
 */
      this.creditoService.postSimulacion(this.simulacionPrestamo).subscribe(
        (res: any) => {
          this.postSimulacion(res)
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "Ocurrio un error al generar la tabla de amortizacion"
          );
        }
      );
    }
  }

  rechazar() {
    Swal.fire({
      title: `¿Deseas rechazar el préstamo?`,
      html: `<br> <strong>COMENTARIO OBLIGATORIO</strong>`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#169116",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        if (texto != "") {
          this.nota = texto;
          try {
            this.creditoService
              .postRechazarPrestamo(
                this.idPrestamo,
                this.nota,
                this.authService.getFuncionario()
              )
              .subscribe(
                (res: any) => {
                  if (res["success"] == true) {
                    this.spinner.hide();
                    this.router.navigateByUrl("/creditos/aprobados");
                    this.componentService.alerta(
                      "success",
                      "Solicitud de préstamo rechazado exitosamente!"
                    );
                  } else {
                    this.nota = "";
                    this.spinner.hide();
                    this.componentService.alerta(
                      "error",
                      "Error al rechazar su solicitud de crédito!"
                    );
                    throw new Error(res.message);
                  }
                },
                (error) => {
                  this.spinner.hide();
                  this.componentService.alerta(
                    "error",
                    "Error al rechazar su solicitud!"
                  );
                }
              );
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        } else {
          this.componentService.alerta("info", "COMENTARIO OBLIGATORIO");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  aprobar() {
    Swal.fire({
      title: `¿Deseas aprobar el préstamo?`,
      html: `<br> <strong>COMENTARIO OBLIGATORIO</strong>`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#169116",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        if (texto != "") {
          this.nota = texto;
          try {
            this.creditoService
              .postAprobarPrestamo(
                this.idPrestamo,
                this.nota,
                this.authService.getFuncionario()
              )
              .subscribe(
                (res: any) => {
                  if (res["success"] == true) {
                    this.spinner.hide();
                    this.router.navigateByUrl("/creditos/aprobados");
                    this.componentService.alerta(
                      "success",
                      "Solicitud de crédito aprobado exitosamente!"
                    );
                  } else {
                    this.nota = "";
                    this.spinner.hide();
                    this.componentService.alerta(
                      "error",
                      "Error al aprobar su solicitud de crédito!"
                    );
                    throw new Error(res.message);
                  }
                },
                (error) => {
                  this.spinner.hide();
                  this.componentService.alerta("error", error.error.message);
                }
              );
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        } else {
          this.componentService.alerta("info", "COMENTARIO OBLIGATORIO");
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  descargarTablaComparativa() {
    this.spinner.show();
    if (
      this.tablaAmortizacion.length != 0 ||
      this.tablaAmortizacionSimulacion.length != 0
    ) {
      this.creditoService.getTablaAmortizacion(this.idPrestamo).subscribe(
        (res) => {
          var link = document.createElement("a");
          link.setAttribute("download", "TablaAmortizacion");
          link.style.display = "none";
          document.body.appendChild(link);
          window.open(res["changingThisBreaksApplicationSecurity"]);
          document.body.removeChild(link);

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.hide();
      this.componentService.alerta(
        "info",
        "Debe haber datos en la tabla de amortización."
      );
    }
  }
}
