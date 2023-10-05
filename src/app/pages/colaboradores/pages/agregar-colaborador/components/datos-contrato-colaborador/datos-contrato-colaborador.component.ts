import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormGroupDirective,
  FormArray,
} from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { createMask } from "@ngneat/input-mask";
import moment from "moment";

import {
  ColaboradorPersona,
  AdjuntosColaborador,
} from "src/app/pages/colaboradores/models/colaboradores";
import { MY_FORMATS } from "src/app/pages/colaboradores/utils/my-date-form";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { FormsService } from "src/app/services/forms.service";

import { ColaboradorService } from "../../../../services/colaborador.service";
import { TThhService } from "src/app/pages/colaboradores/services/tthh.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "app-datos-contrato-colaborador",
  templateUrl: "./datos-contrato-colaborador.component.html",
  styleUrls: ["./datos-contrato-colaborador.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatosContratoColaboradorComponent implements OnInit {
  edicion = false;

  //inputs
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() visualizationMode: boolean = false;
  @Input() tipoColaborador: any;
  @Input() idEntidad:any;

  DecimalInputMask = createMask({
    alias: "numeric",
    groupSeparator: ",",
    digits: 2,
    digitsOptional: false,
    min: 0.0,
    numericInput: true,
    allowMinus: false,

    placeholder: "0",
    //hasta 6 digitos
    max: 999999,
  });

  //form
  form: FormGroup;
  datosContrato: FormGroup = this._formBuilder.group({
    idTipoColaborador: [null],

    fechaInicioContrato: [null, Validators.required],
    fechaTerminacion: [null, Validators.required],
    fechaVencimiento: [null, Validators.required],
    sueldoNominal: [
      null,
      [
        Validators.required,

        Validators.max(999999),
        Validators.min(0),

        Validators.pattern("^[0-9]+(.[0-9]{1,2})?$"),
        Validators.pattern(this.formsService.expNotZero),
        Validators.pattern(this.formsService.expDecimales),
      ],
    ],
    impuestos: [0, Validators.min(0)],
    codigoSectorialIess: [null],
    idTipoContrato: [null, Validators.required],
    idTipoJornada: [null, Validators.required],
    idModalidad: [null, Validators.required],
    anticipo: [null, Validators.required],
    valorAnticipo: [0],

    porcentajeAnticipo: [null],
    //idClaseContribuyente: [null],
    horasLaborales: [
      null,
      [
        Validators.required,
        Validators.max(168),
        Validators.min(0),
        //solo numeros enteros
        Validators.pattern("^[0-9]*$"),
      ],
    ],

    //archivos
    adjuntosContrato: this._formBuilder.array([]),
    /*  razonSocial: [
      null,
      [Validators.required, Validators.pattern("^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]*$")],
    ], */
  });

  //selects
  unidades: any[] = [];
  tiposContrato: any[] = [];
  tiposJornada: any[] = [];
  modalidadesTrabajo: any[] = [];
  areasTrabajo: any[] = [];
  listadoSupervisor;
  listadoJefes;
  listadoCargos;
  edicionActivada: boolean = false;

  clasesContribuyentes;

  constructor(
    private colaboradorService: ColaboradorService,
    private _formBuilder: FormBuilder,
    private formsService: FormsService,
    private ctrlContainer: FormGroupDirective,
    public utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tipoColaborador) {
      this.cambiarCamposRequeridos(changes.tipoColaborador.currentValue);
    }

    if (changes.idColaborador?.currentValue) {
      this.obtenerDatosContrato();
    }
    

    if (this.idColaborador == 0) {
      this.datosContrato.reset();
    }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.form = this.ctrlContainer.form;
    this.form.addControl("datosContrato", this.datosContrato);

    this.cargarSelects();
  }

  calcularAnticipo($event, tipo) {
    let valor = $event.target.value;

    let remuneracion = this.datosContrato.get("sueldoNominal").value;
    if (tipo) {
      this.calcularPorcentajeAnticipo(remuneracion, valor);
    } else {
      this.calcularValorAnticipo(remuneracion, valor);
    }
  }

  setTwoNumberDecimal(value) {
    value = parseFloat(value.replace(/,/g, ""));

    //si tiene mas de dos decimales dejar solo dos
    if (value.toString().split(".")[1]?.length > 2) {
      value = parseFloat(
        value.toString().split(".")[0] +
          "." +
          value.toString().split(".")[1].substring(0, 2)
      );
    }
    this.datosContrato.get("sueldoNominal").setValue(value);
  }

  validarFechaVencimiento() {
    this.validarFechaPeriodoPrueba();
    let fechaInicio = moment(
      this.datosContrato.get("fechaInicioContrato").value
    );
    let fechaVencimiento = moment(
      this.datosContrato.get("fechaVencimiento").value
    );

    //fecha de vencimiento debe ser mayor a la fecha de inicio
    if (fechaInicio > fechaVencimiento) {
      this.datosContrato.get("fechaVencimiento").setErrors({ incorrect: true });
    } else {
      this.datosContrato.get("fechaVencimiento").updateValueAndValidity();
    }
  }

  onChangeMontoBase() {
    let value = this.datosContrato.get("sueldoNominal").value;
    let valor = this.datosContrato.get("valorAnticipo").value;
    if (!value || value <= 0) {
      this.datosContrato.controls["sueldoNominal"].setErrors({
        especificError: "El valor no debe ser 0 o menor.",
      });
    }
    if (
      typeof this.datosContrato.get("sueldoNominal").value == "string" &&
      this.datosContrato.get("sueldoNominal").value != ""
    ) {
      this.setTwoNumberDecimal(this.datosContrato.get("sueldoNominal").value);
    }

    let remuneracion = this.datosContrato.get("sueldoNominal").value;

    if (this.tipoColaborador == 2) {
      this.calcularValorIVA();
    }
    //Si ya tiene un porcetaje de anticipo calculado calcular el valor del anticipo
    if (this.datosContrato.get("porcentajeAnticipo").value == null) {
      this.calcularPorcentajeAnticipo(remuneracion, valor);
    } else {
      this.calcularValorAnticipo(
        remuneracion,
        this.datosContrato.get("porcentajeAnticipo").value
      );
    }
  }

  getErrorMessage(element, add_error_messaje?) {
    return this.formsService.getErrorMessage(element, add_error_messaje);
  }

  obtenerDatosContrato() {
    this.tthhColaboradorService.getDatosContrato(this.idColaborador).subscribe(
      (data) => {
        if (data.result) {
          if (
            this.tipoColaborador == 1 &&
            data.result?.idTipoContrato != null
          ) {
            this.datosContrato
              .get("idTipoContrato")
              .setValue(data.result.idTipoContrato);
          }

          if (
            data.result?.fechaInicioContrato == "0001-01-01T00:00:00" ||
            data.result?.fechaTerminacion == "0001-01-01T00:00:00" ||
            data.result?.fechaVencimiento == "0001-01-01T00:00:00" 
          ) {
            data.result.fechaInicioContrato = null;
            data.result.fechaTerminacion = null;
            data.result.fechaVencimiento == null; 
          }

          this.datosContrato.patchValue({
            fechaInicioContrato: data.result.fechaInicioContrato,
            fechaVencimiento: data.result.fechaVencimiento,
            fechaTerminacion: data.result.fechaTerminacion, 
            sueldoNominal: data.result.sueldoNominal,
            impuestos: data.result.impuestos ? data.result.impuestos : 0,
            codigoSectorialIess: data.result.codigoSectorialIess,
            idTipoJornada: data.result.idTipoJornada,
            idModalidad: data.result.idModalidad,
            anticipo: data.result.anticipo,

            valorAnticipo: data.result.valorAnticipo,
            porcentajeAnticipo: data.result.porcentajeAnticipo,
            //idClaseContribuyente: data.result.idClaseContribuyente,

            horasLaborales: data.result.horasLaborales,
          });

          if (data.result.idTipoJornada) {
            this.cambiarValidacionHoras(
              data.result.idTipoJornada,
              data.result.horasLaborales
            );
          }

          this.ocultarFecha(data.result.idTipoContrato);
          this.onAnticipoChange(data.result.anticipo);

          this.datosContrato
            .get("valorAnticipo")
            .setValue(data.result.valorAnticipo);
          this.datosContrato
            .get("porcentajeAnticipo")
            .setValue(data.result.porcentajeAnticipo);

          this.validarFechaPeriodoPrueba();
        } else {
          this.datosContrato.reset();
          this.cambiarCamposRequeridos(this.tipoColaborador);
          this.datosContrato.get("impuestos").setValue(0);
        }
      },

      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al obtener datos del contrato"
        );
      }
    );
  }

  ocultarFecha(value) {
    if (value == 2) {
      this.datosContrato.get("fechaVencimiento").setValue(null);
      this.datosContrato.get("fechaVencimiento").disable();
    } else {
      this.datosContrato.get("fechaVencimiento").enable();
    }
  }
  calcularPorcentajeAnticipo(monto, anticipo) {
    let porcentaje = 0.0;
    if (monto > 0 && anticipo > 0) {
      porcentaje = (anticipo / monto) * 100;
      //redondear a dos decimales
      porcentaje = parseFloat(porcentaje.toFixed(2));
    }

    //si el porcentaje pasa de 100, se pone en 100
    if (porcentaje > 100) {
      porcentaje = 100;
    }

    this.datosContrato.patchValue({
      porcentajeAnticipo: porcentaje,
    });

    //si anticipo es string convertir a float
    if (typeof anticipo == "string") {
      //convertir a numerico
      anticipo = this.convertirnUMERO(anticipo);
    }
    //si monto es string convertir a number
    if (typeof monto == "string") {
      monto = this.convertirnUMERO(monto);
    }

    if (anticipo > monto) {
      this.datosContrato.get("valorAnticipo").setErrors({ incorrect: true });
    }
    if (anticipo == 0) {
      this.datosContrato.get("valorAnticipo").setErrors(null);
    }
  }

  convertirnUMERO(value) {
    //si es string

    value = parseFloat(value.replace(/,/g, ""));

    //si tiene mas de dos decimales dejar solo dos
    if (value.toString().split(".")[1]?.length > 2) {
      value = parseFloat(
        value.toString().split(".")[0] +
          "." +
          value.toString().split(".")[1].substring(0, 2)
      );
    }
    return value;
  }

  calcularValorAnticipo(monto, porcentaje) {
    let anticipo = 0.0;
    if (monto > 0 && porcentaje > 0) {
      anticipo = (monto * porcentaje) / 100;
    }

    //redondear a dos decimales con toFixed y parsear a float
    anticipo = parseFloat(anticipo.toFixed(2));

    this.datosContrato.patchValue({
      valorAnticipo: anticipo,
    });
  }

  cargarSelects() {
    this.colaboradorService.getTiposContrato().subscribe(
      (data) => {
        this.tiposContrato = data.result;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al obtener tipos de contrato");
      }
    );

    this.tthhColaboradorService.getTipoJornada().subscribe(
      (data) => {
        this.tiposJornada = data.result;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al obtener tipos de jornada");
      }
    );

    this.tthhColaboradorService.getModalidad().subscribe(
      (data) => {
        this.modalidadesTrabajo = data.result;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al obtener modalidades de trabajo"
        );
      }
    );

    this.tthhColaboradorService.getClasesContribuyentes().subscribe((data) => {
      this.clasesContribuyentes = data.result;
    });
  }

  calcularValorIVA() {
    const valorFacturacion = this.datosContrato.get("sueldoNominal").value;

    const iva = this.datosContrato.get("impuestos");
    if (valorFacturacion) {
      let valor = valorFacturacion * 0.12;
      //si tiene mas de dos decimales dejar solo dos
      if (valor.toString().split(".")[1]?.length > 2) {
        valor = parseFloat(
          valor.toString().split(".")[0] +
            "." +
            valor.toString().split(".")[1].substring(0, 2)
        );
      }

      iva.setValue(valor);
    } else {
      iva.setValue(0);
    }
  }

  cambiarCamposRequeridos(tipoColaborador: number) {
    if (tipoColaborador == 2) {
      this.datosContrato.get("idModalidad").disable();
      this.datosContrato.get("idTipoJornada").disable();
      this.datosContrato.get("horasLaborales").disable();

      this.datosContrato.get("idTipoContrato").setValue(9);
      this.datosContrato.get("idTipoContrato").disable();

      this.datosContrato.get("codigoSectorialIess").disable();
    }
    if (tipoColaborador == 1) {
      this.datosContrato.get("idModalidad").enable();
      this.datosContrato.get("idTipoJornada").enable();

      this.datosContrato.get("codigoSectorialIess").enable();
      this.datosContrato.get("idTipoContrato").enable();
    }
    if (tipoColaborador == 3) {
      this.datosContrato.get("idModalidad").enable();
      this.datosContrato.get("idTipoJornada").enable();
      this.datosContrato.get("codigoSectorialIess").disable();

      this.datosContrato.get("idTipoContrato").setValue(10);
      this.datosContrato.get("idTipoContrato").disable();
    }
  }

  validarFechaPeriodoPrueba() {
    let fechaInicio = moment(
      this.datosContrato.get("fechaInicioContrato").value
    );

    let fechaFin = moment(this.datosContrato.get("fechaVencimiento").value);

    let fechaPrueba = moment(
      this.datosContrato.get("fechaTerminacion").value
    );

    if (fechaInicio && fechaFin && fechaPrueba) {
      if (fechaPrueba < fechaInicio || fechaPrueba > fechaFin) {
        this.datosContrato.get("fechaTerminacion").updateValueAndValidity();

        this.datosContrato
          .get("fechaTerminacion")
          .setErrors({ incorrect: true });
      } else {
        this.datosContrato.get("fechaTerminacion").updateValueAndValidity();
      }
    } else {
      this.datosContrato.get("fechaTerminacion").updateValueAndValidity();
    }
  }

  onAnticipoChange($event) {
    if ($event) {
      this.datosContrato.controls.porcentajeAnticipo.setValidators([
        Validators.required,
        Validators.min(0),

        Validators.max(100),
        Validators.pattern("^[0-9]+(.[0-9]{1,2})?$"),
      ]);

      this.datosContrato.controls.valorAnticipo.setValidators([
        Validators.required,

        Validators.min(0),
        Validators.max(999999),
        Validators.pattern("^[0-9]+(.[0-9]{1,2})?$"),
      ]);

      this.datosContrato.patchValue({
        porcentajeAnticipo: 0,
        valorAnticipo: 0,
      });
    } else {
      this.datosContrato.controls.porcentajeAnticipo.clearValidators();
      this.datosContrato.controls.porcentajeAnticipo.updateValueAndValidity();
      this.datosContrato.controls.valorAnticipo.clearValidators();
      this.datosContrato.patchValue({
        porcentajeAnticipo: 0,
        valorAnticipo: 0,
      });
    }
  }

  get adjuntosContrato() {
    return this.datosContrato.controls["adjuntosContrato"] as FormArray;
  }

  obtenerAdjuntos() {
    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos.length > 0 ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntosContrato.push(adjunto);
      }
    });
  }

  cambiarValidacionHoras(value, horas = "") {
    if (this.tipoColaborador == 2) {
      this.datosContrato.get("horasLaborales").disable();
      return;
    }

    if (value == 1) {
      this.datosContrato.get("horasLaborales").disable();
    } else if (value == 2) {
      this.datosContrato.get("horasLaborales").enable();

      this.datosContrato.get("horasLaborales").setValidators([
        Validators.required,
        Validators.max(168),
        Validators.min(0),
        //solo numeros enteros
        Validators.pattern("^[0-9]*$"),
      ]);
      this.datosContrato.patchValue({
        horasLaborales: horas,
      });

      this.datosContrato.get("horasLaborales").updateValueAndValidity();
    }
  }
}
