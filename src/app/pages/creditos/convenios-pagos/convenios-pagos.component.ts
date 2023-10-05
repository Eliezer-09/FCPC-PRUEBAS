import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
//ICONOS
import icVerticalSplit from "@iconify/icons-ic/twotone-vertical-split";
import icVisiblity from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import icMoreVert from "@iconify/icons-ic/twotone-more-vert";
import icDescription from "@iconify/icons-ic/twotone-description";
import icSearch from "@iconify/icons-ic/twotone-search";
import icDelete from "@iconify/icons-ic/twotone-delete";
import icPdf from "@iconify/icons-ic/picture-as-pdf";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Direccion,
  Participe,
  PerfilEconomico,
  ProductosFinancieros,
  PutSolicitud,
  ReferenciaBancaria,
  SimulacionPrestamo,
} from "src/app/model/models";
import { ComponentesService } from "src/app/services/componentes.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CreditosService } from "../creditos.service";
import { DataService } from "src/app/services/data.service";
import moment from "moment";
import * as Chart from "chart.js";
import { ModalTablaAmortizacionComponent } from "../modal-tabla-amortizacion/modal-tabla-amortizacion.component";
import { MatDialog } from "@angular/material/dialog";
import { stagger80ms } from "src/@vex/animations/stagger.animation";

@Component({
  selector: "vex-convenios-pagos",
  templateUrl: "./convenios-pagos.component.html",
  styleUrls: ["./convenios-pagos.component.scss"],
  animations: [stagger80ms],
})
export class ConveniosPagosComponent implements OnInit, AfterViewChecked {
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

  sinInformacion: any = "N/A";
  datoNulo = null;
  ctx: any;
  totalCapital = 0;
  totalInsteres = 0;
  dataSimulacion: any;
  date = moment().format();
  pagoMensual = 0;
  tasaNominal = 0;
  tasaefectiva = 0;
  totalPagar = 0;

  formContacto: FormGroup;
  formEconomicos: FormGroup;
  formCalculadora: FormGroup;
  formParticipe: FormGroup;

  formStepContacto: FormGroup;
  formStepEconomico: FormGroup;

  perfilEconomico: PerfilEconomico = {};
  referenciaBancaria: ReferenciaBancaria = {};
  productoFinanciero: ProductosFinancieros = {};
  solicitudPrestamo: any = {};
  participe: Participe = {};
  identificacion: number;
  existeCedula = false;
  solicitudNueva: PutSolicitud = {};
  direccion: Direccion = {};
  contactos: any = {};
  referenciasPersonales: any = {};

  simulacionPrestamo: SimulacionPrestamo = {};

  // ARREGLOS
  estadosCivil: any[] = [];
  generos: any[] = [];
  grados: any[] = [];
  provincias: any = [];
  productosFinancieros: any[] = [];
  ciudades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private componentService: ComponentesService,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.formsGroups();
    this.cargarDatos();
  }

  cargarDatos() {
    this.listaProductosFinancieros();
    this.listaProvincias();
  }

  listaProductosFinancieros() {
    // PRODUCTOS FINANCIEROS
    this.productosFinancieros = [];
    this.dataService.getProductosFinancieros().subscribe((res: any) => {
      this.spinner.hide();
      this.productosFinancieros = res;
      this.productosFinancieros.forEach((produc) => {
        if (produc.idProducto == 1) {
          this.productoFinanciero = produc;
          this.changeDetector.detectChanges();
        }
      });
    });
  }

  // INICIALIZACION DE LOS FORMS GROUPS CON SUS CAMPOS
  formsGroups() {
    this.formParticipe = this.fb.group({
      nombres: [""],
      apellidos: [""],
      fechaNacimiento: [""],
      identificacion: ["", [Validators.required]],
      lugarNacimiento: [""],
      idNacionalidad: [""],
      idGenero: [""],
      idEstadoCivil: [""],
      // idNivelEstudios: [''],
      // fechaExpedicionCedula: [''],
      correo1: ["", Validators.required],
      telefono1: ["", Validators.required],
      telefono2: [""],
      celular: ["", Validators.required],
      // idNivelIngresos: [''],
      // idActividadEconomica: [''],
      // profesion: [''],
      idGrado: [""],
      identificacionConyuge: [""],
      conyuge: [""],
      // idTipoVivienda: [''],
      // tiempoResidencia: [''],
      // foto: [''],
      // aporteAdicional: [''],
      // fechaIngreso: [''],
      // codigoUniformado: [''],
      perfilEconomico: this.fb.group({
        salarioFijo: [""],
        salarioVariable: [""],
        otrosIngresos: [""],
        totalIngresos: [""],
        gastosMensuales: [""],
        totalBienes: [""],
        totalVehiculos: [""],
        totalOtrosActivos: [""],
        totalActivos: [""],
        totalDeudas: [""],
        patrimonioNeto: [""],
        salarioNeto: [""],
      }),
      direcciones: this.fb.array([this.fb.control("")]),
      // referenciasBancarias: this.fb.array([
      //   this.fb.control('')
      // ]),
      referenciasPersonales: this.fb.array([this.fb.control("")]),
      contactos: this.fb.array([this.fb.control("")]),
      idProfesion: [""],
    });

    // CALCULADORA
    this.formCalculadora = this.fb.group({
      montoCredito: [""],
      tasa: [""],
      duracion: [""],
      motivoCredito: [""],
      observaciones: [""],
    });
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  asignarDatosEconomicos() {
    this.formParticipe.patchValue({
      perfilEconomico: this.perfilEconomico,
      direcciones: [this.direccion],
      // referenciasBancarias: this.participe.referenciasBancarias,
      contactos: [this.contactos],
      referenciasPersonales: [this.referenciasPersonales],
    });

    this.actualizarParticipe();
  }

  // IDENTIFICACION INGRESA, TRAER DATOS DEL USUARIO
  change(event) {
    if (event) {
      if (event.length == 10) {
        this.spinner.show();
        this.dataService.getParticipeByIdentificacion(event).subscribe(
          (res: any) => {
            this.referenciaBancaria = {};
            this.solicitudNueva = {};
            // this.identificacion = event;
            this.existeCedula = true;
            this.participe = res.result;
            this.direccion = this.participe.direcciones[0];
            this.contactos = this.participe.contactos[0];
            this.referenciasPersonales =
              this.participe.referenciasPersonales[0];
            if (this.participe.perfilEconomico) {
              this.formParticipe.patchValue({
                idProfesion: this.participe.idProfesion,
                perfilEconomico: {
                  // TOTAL INGRESOS
                  salarioFijo: this.participe.perfilEconomico.salarioFijo,
                  salarioVariable:
                    this.participe.perfilEconomico.salarioVariable,
                  otrosIngresos: this.participe.perfilEconomico.otrosIngresos,
                  totalIngresos: this.participe.perfilEconomico.totalIngresos,

                  // TOTAL ACTIVOS
                  totalBienes: this.participe.perfilEconomico.totalBienes,
                  totalVehiculos: this.participe.perfilEconomico.totalVehiculos,
                  totalOtrosActivos:
                    this.participe.perfilEconomico.totalOtrosActivos,
                  totalActivos: this.participe.perfilEconomico.totalActivos,

                  // PATRIMONIO NETO
                  totalDeudas: this.participe.perfilEconomico.totalBienes,
                  patrimonioNeto: this.participe.perfilEconomico.totalVehiculos,

                  // SALARIO NETO
                  gastosMensuales:
                    this.participe.perfilEconomico.gastosMensuales,
                },
              });
            }

            const FORMATO_ENTRADA = "YYYY-MM-DD";
            const fecha = moment(
              this.participe.fechaNacimiento,
              FORMATO_ENTRADA
            );

            this.formParticipe.patchValue({
              idNacionalidad: this.participe.idNacionalidad,
              celular: this.participe.celular,
              correo1: this.participe.correo1,
              telefono1: this.participe.telefono1,
              telefono2: this.participe.telefono2,
              nombres: this.participe.nombres,
              apellidos: this.participe.apellidos,
              idEstado: this.participe.idEstadoCivil,
              idGenero: this.participe.idGenero,
              idGrado: this.participe.idGrado,
              idEstadoCivil: this.participe.idEstadoCivil,
              fechaNacimiento: fecha.format(FORMATO_ENTRADA),
              identificacionConyuge: this.participe.identificacionConyuge,
              conyuge: this.participe.conyuge,
            });

            this.seleccionarProvincia(this.direccion.idProvincia);
            this.listaEstadoCivil();
            this.listaTipoGeneros();
            this.listaGrados();
          },
          async (error) => {
            this.spinner.hide();
            this.componentService.alerta("warning", "Participe no existe!");
          }
        );
      } else {
        this.direccion = {};
        this.solicitudNueva = {
          direcciones: [],
          referenciasBancarias: [],
        };
        this.participe = {};
      }
    }
  }

  listaProvincias() {
    // TRAER LAS PROVINCIAS DEL ECUADOR
    this.dataService.getProvincias(1).subscribe((provincias) => {
      this.provincias = provincias;
    });
  }

  listaEstadoCivil() {
    this.dataService.getEstadosCivil().subscribe((res: any) => {
      this.estadosCivil = res;
    });
  }

  listaTipoGeneros() {
    this.dataService.getTiposGenero().subscribe((res: any) => {
      this.generos = res;
      this.spinner.hide();
    });
  }

  listaGrados() {
    this.dataService.getGrado().subscribe((res: any) => {
      this.grados = res;
      this.solicitudNueva.idGrado = this.participe.idGrado;
      if (this.participe.idGrado) {
        const ex = {
          idGrado: this.participe.idGrado,
          descripcion: this.participe.grado,
        };
        this.grados.push(ex);
      }
      this.spinner.hide();
    });
  }

  // TRAE LAS ciudades SEGUN LA PROVINCIA
  seleccionarProvincia(event) {
    // ciudades
    this.dataService.getCiudades(event).subscribe((cuidad: any) => {
      this.ciudades = cuidad;
    });
  }

  // CALCULO DATOS ECONOMICOS
  datosEconomicosCalculo(event: any, tipo?: string, decimal?) {
    // TotalIngresos = SalarioFijo+SalarioVariable+OtrosIngresos
    // TotalActivos = TotalBienes+TotalVehiculos+TotalOtrosActivos
    // PatrimonioNeto = TotalActivos-TotalDeudas
    // Salario neto (VALOR NETO A RECIBIR DEL ROL DE PAGO) = Salario fijo + Salario variable - Gastos mensuales

    switch (tipo) {
      // TOTAL INGRESOS
      case "salariofijo":
        this.perfilEconomico.salarioFijo = event;
        this.perfilEconomico.totalIngresos = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto =
          this.perfilEconomico.salarioNeto -
          this.perfilEconomico.gastosMensuales;
        parseFloat(this.perfilEconomico.salarioNeto).toFixed(2);
        break;
      case "salarioVariable":
        this.perfilEconomico.salarioVariable = event;
        this.perfilEconomico.totalIngresos = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto =
          this.perfilEconomico.salarioNeto -
          this.perfilEconomico.gastosMensuales;
        parseFloat(this.perfilEconomico.salarioNeto).toFixed(2);
        break;
      case "otrosIngresos":
        this.perfilEconomico.otrosIngresos = event;
        this.perfilEconomico.totalIngresos = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto =
          this.perfilEconomico.salarioNeto -
          this.perfilEconomico.gastosMensuales;
        parseFloat(this.perfilEconomico.salarioNeto).toFixed(2);
        break;

      // TOTAL ACTIVOS
      case "totalBienes":
        this.perfilEconomico.totalBienes = event;
        this.perfilEconomico.totalActivos = parseFloat(
          this.perfilEconomico.totalBienes +
            this.perfilEconomico.totalVehiculos +
            this.perfilEconomico.totalOtrosActivos
        ).toFixed(2);
        this.perfilEconomico.patrimonioNeto =
          this.perfilEconomico.totalActivos - this.perfilEconomico.totalDeudas;
        parseFloat(this.perfilEconomico.patrimonioNeto).toFixed(2);
        break;
      case "totalVehiculos":
        this.perfilEconomico.totalVehiculos = event;
        this.perfilEconomico.totalActivos = parseFloat(
          this.perfilEconomico.totalBienes +
            this.perfilEconomico.totalVehiculos +
            this.perfilEconomico.totalOtrosActivos
        ).toFixed(2);
        this.perfilEconomico.patrimonioNeto =
          this.perfilEconomico.totalActivos - this.perfilEconomico.totalDeudas;
        parseFloat(this.perfilEconomico.patrimonioNeto).toFixed(2);
        break;
      case "totalOtrosActivos":
        this.perfilEconomico.totalOtrosActivos = event;
        this.perfilEconomico.totalActivos = parseFloat(
          this.perfilEconomico.totalBienes +
            this.perfilEconomico.totalVehiculos +
            this.perfilEconomico.totalOtrosActivos
        ).toFixed(2);
        this.perfilEconomico.patrimonioNeto =
          this.perfilEconomico.totalActivos - this.perfilEconomico.totalDeudas;
        parseFloat(this.perfilEconomico.patrimonioNeto).toFixed(2);
        break;

      // PATRIMONIO NETO
      case "totalDeudas":
        this.perfilEconomico.totalDeudas = event;
        this.perfilEconomico.patrimonioNeto = parseFloat(
          this.perfilEconomico.totalDeudas
        ).toFixed(2);
        this.perfilEconomico.patrimonioNeto =
          this.perfilEconomico.totalActivos - this.perfilEconomico.totalDeudas;
        parseFloat(this.perfilEconomico.patrimonioNeto).toFixed(2);
        this.perfilEconomico.patrimonioNeto = this.componentService.trunc(
          this.perfilEconomico.patrimonioNeto,
          2
        );
        break;

      // SALARIO NETO
      case "gastosMensuales":
        this.perfilEconomico.gastosMensuales = event;
        this.perfilEconomico.salarioNeto = parseFloat(
          this.perfilEconomico.salarioFijo +
            this.perfilEconomico.salarioVariable +
            this.perfilEconomico.otrosIngresos
        ).toFixed(2);
        this.perfilEconomico.salarioNeto =
          this.perfilEconomico.salarioNeto -
          this.perfilEconomico.gastosMensuales;
        this.perfilEconomico.salarioNeto = this.componentService.trunc(
          this.perfilEconomico.salarioNeto,
          2
        );
        break;
    }
  }

  // CREAR
  createLineChart() {
    this.ctx = document.getElementById("myChart");
    // this.ctx = this.canvas.getContext('2d')
    new Chart(this.ctx, {
      type: "doughnut",
      data: {
        labels: ["Total capital", "Total interes"],
        datasets: [
          {
            label: "# of Votes",
            data: [this.totalCapital, this.totalInsteres],
            backgroundColor: ["rgba(3, 25, 68, 0.9)", "#FFCB00"],
            borderColor: ["rgba(3, 25, 68, 0.9)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  actualizarParticipe() {
    this.spinner.show();
    this.dataService
      .actualizarParticipeDatos(
        this.participe.idParticipe,
        this.formParticipe.value
      )
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          this.componentService.alerta(
            "success",
            "Se actualizaron los datos correctamente."
          );
        },
        (error) => {
          this.spinner.hide();
          this.componentService.alerta(
            "error",
            "Ocurrió un error al actualizar los datos del partícipe"
          );
        }
      );
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

  simular() {
    if (this.formCalculadora.get("duracion").value == 0) {
      this.componentService.alerta("info", "El plazo debe ser mayor a 0");
      return;
    }
    // PAGO MENSUAL = TOTAL, LA PRIMERA CUOTA
    // GRAFICO ES TOTAL DE INTERES Y TOTAL DE CAPITAL
    // TOTAL A PAGAR = TOTAL PRESTAMO
    // EN LA TABLA DE AMORTIZACION VA EL ARRAY DE CUOTAS
    this.dataService.getToken();
    this.simulacionPrestamo.tipoAmortizacion =
      this.solicitudPrestamo.tipoAmortizacion;
    this.simulacionPrestamo.idParticipe = this.participe.idParticipe;
    this.simulacionPrestamo.fechaInicio = this.date;
    this.simulacionPrestamo.idProducto = this.productoFinanciero.idProducto;
    // Cuando el prestamo es quirografario no puede pasarse de 84 meses
    if (
      this.simulacionPrestamo.idProducto == 1 &&
      this.simulacionPrestamo.plazo > 84
    ) {
      this.componentService.alerta(
        "info",
        "El plazo no puedo ser mayor a 84 meses"
      );
    } else {
      this.creditoService.postSimulacion(this.simulacionPrestamo).subscribe(
        (res: any) => {
          this.dataSimulacion = res.result;
          this.totalPagar = this.dataSimulacion.totalPrestamo;
          this.totalInsteres = this.dataSimulacion.totalInteres;
          this.totalCapital = this.dataSimulacion.totalCapital;
          this.pagoMensual = this.dataSimulacion.cuotas[0].total;
          this.tasaNominal = this.dataSimulacion.tasa.toFixed(2);
          this.tasaefectiva = this.dataSimulacion.tasaEfectiva.toFixed(2);
          this.createLineChart();
        },
        (error) => {
          this.componentService.alerta("error", error["error"]["message"]);
        }
      );
    }
  }

  crearSolicitud() {
    try {
      this.spinner.show();
      // this.componentService.alerta("info", "Debes agregar un archivo y una observación")
      this.solicitudPrestamo.fecha = this.date;
      this.solicitudPrestamo.comentarios = "N/A";
      (this.solicitudPrestamo.idParticipe = this.participe.idParticipe),
        (this.solicitudPrestamo.idProducto =
          this.productoFinanciero.idProducto);
      this.solicitudPrestamo.montoSolicitado =
        this.simulacionPrestamo.montoSolicitado;
      this.solicitudPrestamo.plazo = this.simulacionPrestamo.plazo;
      this.solicitudPrestamo.valorCuota = this.pagoMensual;
      if (this.dataSimulacion.cuotas) {
        this.spinner.show();
        this.creditoService.postPrestamo(this.solicitudPrestamo).subscribe(
          (res) => {},
          (error) => {
            this.spinner.hide();
            this.componentService.alerta(
              "error",
              `${error["error"]["message"]}`
            );
          }
        );

        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.componentService.alerta("info", "Debe generar la simulacion");
      }
    } catch (e) {
      this.spinner.hide();
      this.componentService.alerta("error", "Ocurrió un error en su solicitud");
    }
  }
}
