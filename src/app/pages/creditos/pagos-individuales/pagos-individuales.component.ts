import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
} from "@angular/core";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

//ICONOS
import icDescription from "@iconify/icons-ic/twotone-description";
import icDoneAll from "@iconify/icons-ic/twotone-done-all";
import { Observable, ReplaySubject } from "rxjs";

//ANIMACIONES
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";

import { DataService } from "../../../services/data.service";
import { CreditosService } from "../creditos.service";
import { MatStepper } from "@angular/material/stepper";
import { ComponentesService } from "../../../services/componentes.service";
import _moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { default as _rollupMoment } from "moment";
import { Participe } from "../../participes/models/models-participes";
import { iconify } from "src/static-data/icons";
import { SelectionModel } from "@angular/cdk/collections";
import { OperationResultPrestamo } from "src/app/model/models";
import { PagoIndividualPagosAplicarConfigure, TablaAmortizacionActualizadaConfigure } from "src/static-data/configure-table/creditos/configure-table-amortizacion";
import { createMask } from "@ngneat/input-mask";
import { FormsService } from "src/app/services/forms.service";
import { map, startWith } from "rxjs/operators";

const moment = _rollupMoment || _moment;

@Component({
  selector: "vex-pagos-individuales",
  templateUrl: "./pagos-individuales.component.html",
  styleUrls: ["./pagos-individuales.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
})
export class PagosIndividualesComponent implements OnInit, AfterViewInit {
  tablePagosAplicarColumns=PagoIndividualPagosAplicarConfigure
  TotalsPagosAplicar:any={
    total:0,
    totalCapital:0,
    totalDesgravamen:0,
    totalInteres:0,
    totalMora:0,
    totalSadaldo:0,
  }
  tableAmortizacionActualizadaColumns=TablaAmortizacionActualizadaConfigure
  TotalsAmortizacionActualizada:any={
    total:0,
    totalCapital:0,
    totalCuota:0,
    totalDesgravamen:0,
    totalInteres:0,
    totalMora:0,
    totalSadaldo:0,
  }
  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: false,
    placeholder: '0',
    allowMinus: false,
  });
  simboloMoneda: string     ='$';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectMultiple: boolean = false;
  mostrarGuardar: boolean;
  saltoTotalMostrar: any;
  pagoReadonly: boolean;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.prestamosDataSource.sort) {
      this.prestamosDataSource.sort = sort;
    }
  }
  @ViewChild("fff", { static: false }) nameField: ElementRef;

  @ViewChild(MatSort, { static: true }) pagosSort: MatSort;
  @ViewChild(MatSort, { static: true }) amortizacionSort: MatSort;
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  selectedOption: string;

  selection = new SelectionModel<any>(true, []);
  layoutCtrl = new FormControl("boxed");
  // Iconos
  icDescription = icDescription;
  icDoneAll = icDoneAll;
  icroundSearch = iconify.icroundSearch;
  icroundPayment = iconify.icbaselineAttachMoney;
  icCedula = iconify.roundCreditCard;
  icName = iconify.roundAccountCircle;
  icEmail = iconify.roundEmail;
  icPhone = iconify.roundPhone;
  icCellphone = iconify.roundPhoneIphone;

  // Variables
  participe: Participe;
  filterValue: string;
  prestamos = [];
  pagos = [];

  prestamosDataSource = new MatTableDataSource<OperationResultPrestamo>();
  pagosDataSource: MatTableDataSource<any[]> = new MatTableDataSource();
  amortizacionDataSource = new MatTableDataSource([]);

  capitalTotal = 0;
  interesTotal = 0;
  moraTotal = 0;
  desgravamenTotal = 0;
  saldoTotal = 0;
  idPrestamos = [];
  metodosPagos = [];
  tiposPagos = [];
  institucionesFinancieras = [];
  cuotaMinima = 0;
  valorPagar = 0;

  displayedColumns = [
    "select",
    "idPrestamo",
    "fecha",
    "saldoCapital",
    "saldoInteres",
    "totalMora",
    "saldoOtros",
    "saldoTotal",
    "saldoVencido",
    "calificacion"
  ];
  pagosColumns = [
    "NumPrestamo",
    "Cuota",
    "FechaVencimiento",
    "Capital",
    "Interes",
    "Mora",
    "Desgravamen",
    "Total",
  ];
  amortizacionColumns = [
    "Cuota",
    "FechaVencimiento",
    "Capital",
    "Interes",
    "Mora",
    "Desgravamen",
    "Total",
  ];
  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<any[]> = this.subject$.asObservable();

  // Banderas
  mostrarBanco = false;

  // Step
  //nuevo formControl
  stepPrestamoForm: FormGroup = new FormGroup({
    idTipoPago: new FormControl("", Validators.required),
    idPrestamos: new FormControl([], Validators.required),
  });

  stepDatosForm: FormGroup = new FormGroup({
    fecha: new FormControl("", Validators.required),
    idMetodoPago: new FormControl("", Validators.required),
    valor: new FormControl("", Validators.required),
    idTipoFinanciera: new FormControl(""),
    numeroReferencia: new FormControl(""),
  });

  horizontalperfileconomicoFormGroup: FormGroup;
  horizontalperfileconomicoFormGroup2: FormGroup;

  formPrestamos: FormGroup;
  formTotales: FormGroup;
  prestamosTotal = {
    capital: 0.0,
    interes: 0.0,
    mora: 0.0,
    desgravamen: 0.0,
    total: 0.0,
    vencido: 0.0,
  };

  amortizacionTotal = {
    capital: 0.0,
    interes: 0.0,
    mora: 0.0,
    desgravamen: 0.0,
    total: 0.0,
  };

  pagosTotal = {
    capital: 0.0,
    interes: 0.0,
    mora: 0.0,
    desgravamen: 0.0,
    total: 0.0,
  };

  identificacion: string;

  tipoPago: string;

  constructor(
    private dataService: DataService,
    private dataPrestamo: CreditosService,
    private componentes: ComponentesService,
    private spinner: NgxSpinnerService,
    private formsService: FormsService
  ) {}

  filteredInstituciones:  Observable<any[]>;
  filtroBanco = new FormControl();


  private _filter(value: any): any[] {
    if(value){
      let filterValue = value.descripcion || value;
      filterValue = filterValue.toLowerCase();
      return this.institucionesFinancieras.filter(institucion => institucion.descripcion.toLowerCase().includes(filterValue));
    }
    return this.institucionesFinancieras
  }

  ngAfterViewInit() {
    this.pagosDataSource.sort = this.pagosSort;
    this.amortizacionDataSource.sort = this.amortizacionSort;

    this.prestamosDataSource.paginator = this.paginator;
    this.prestamosDataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataPrestamo.getTiposPago().subscribe((res: any) => {
      this.tiposPagos = res;
    });

    this.dataPrestamo.getMetodosPagos().subscribe((res: any) => {
      this.metodosPagos = res;
    });

    this.dataService.getInstitucionesFinancieras().subscribe((res: any) => {
      this.institucionesFinancieras = res;
      this.filteredInstituciones = this.filtroBanco.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  onSelectInstitucion(event: any) {
    const selectedId = event.source.value;
    this.stepDatosForm.controls.idTipoFinanciera.setValue( selectedId.idTipoFinanciera );
    this.filtroBanco.setValue(selectedId.descripcion)
  }

  handleClick() {
    if (!this.stepPrestamoForm.value.idTipoPago?.idTipoPago) {
      this.componentes.alerta("error", "Debe seleccionar un tipo de pago");
    }
  }

  isLoading = false;

  clearData() {
    //limpiar forms

    this.stepPrestamoForm.reset();
    this.stepDatosForm.reset();

    //limpiar selection
    this.selection.clear();

    this.capitalTotal = 0;
    this.interesTotal = 0;
    this.moraTotal = 0;
    this.desgravamenTotal = 0;
    this.cuotaMinima = 0.0;
    this.valorPagar = 0.0;
    this.saldoTotal = 0;
    this.prestamosDataSource.data = [];
    this.prestamos = [];
    this.participe = {};
    this.pagos = [];
    this.pagosDataSource.data = [];

    this.amortizacionDataSource.data = [];
  }

  traerAlParticipe(cedula: string) {
    if (!cedula || cedula == "" || cedula.length < 4) {
      this.componentes.alerta(
        "error",
        "Debe ingresar una identificación valida"
      );
      return;
    }

    this.spinner.show();
    this.clearData();

    this.isLoading = true;

    this.dataService.getParticipeByIdentificacion(cedula).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.participe = res.result;

        this.dataPrestamo
          .getPrestamoByIdParticipe(this.participe.idParticipe)
          .subscribe(
            (res: any) => {
              this.prestamos = res.result;

              const pres = [];

              this.prestamosTotal = {
                capital: 0.0,
                interes: 0.0,
                mora: 0.0,
                desgravamen: 0.0,
                total: 0.0,
                vencido: 0.0,
              };

              //Sumar el total de los prestamos
              this.prestamos.forEach((element) => {
                this.prestamosTotal.capital += element.saldoCapital;
                this.prestamosTotal.interes += element.saldoInteres;
                this.prestamosTotal.mora += element.totalMora;
                this.prestamosTotal.desgravamen = element.saldoOtros;
                this.prestamosTotal.total += element.saldoTotal;
                this.prestamosTotal.vencido += element.saldoVencido;
                //redondear saldoTotal a 2 decimales

                this.saldoTotal += element.saldoTotal;
                this.saltoTotalMostrar = this.saldoTotal;

                this.saldoTotal = Math.round(this.saldoTotal * 100) / 100;

                /*     this.cuotaMinima += element.saldoVencido; */
                this.valorPagar += element.saldoVencido;

                pres.push(element);
              });

              this.stepDatosForm.get("valor").setValue(this.valorPagar);
              this.prestamosDataSource.data = pres;

              this.stepDatosForm.patchValue({
                fecha: new Date(),
              });

              this.isLoading = false;
              this.spinner.hide();
            },
            (error) => {
              this.isLoading = false;
              this.componentes.alerta(
                "error",
                error["error"]["message"] || error["message"]
              );
              this.spinner.hide();
            }
          );
      },
      (error) => {
        this.isLoading = false;
        this.componentes.alerta(
          "error",
          error["error"]["message"] || error["message"]
        );
        this.spinner.hide();
      }
    );
  }

  onPrestamo() {
    if (this.stepPrestamoForm.invalid) {
      this.stepPrestamoForm.markAllAsTouched();
      this.componentes.alerta("error", "Debe seleccionar al menos un préstamo");
      return;
    }

    this.cuotaMinima = this.selection.selected.reduce(
      (total, element) => total + element.saldoVencido,
      0
    );
    this.cuotaMinima = Math.round(this.cuotaMinima * 100) / 100;

    if (this.stepPrestamoForm.value.idTipoPago.idTipoPago === 1) {
      this.stepDatosForm
        .get("valor")
        .setValidators([Validators.required, Validators.max(this.cuotaMinima)]);
    } else {
      this.stepDatosForm.get("valor").setValidators([Validators.required]);
    }

    this.stepDatosForm.get("valor").updateValueAndValidity();

    if (
      this.stepPrestamoForm.value.idTipoPago.idTipoPago === 4 ||
      this.stepPrestamoForm.value.idTipoPago.idTipoPago === 5
    ) {
      this.saltoTotalMostrar = this.selection.selected[0].totalSaldoCancelacion;
      this.stepDatosForm.get("valor").setValue(this.saltoTotalMostrar);
      this.cuotaMinima = 0;
      this.pagoReadonly = true;
    } else {
      this.pagoReadonly = false;
      //poner vacio el valor a pagar
      this.stepDatosForm.get("valor").setValue("");
      this.saltoTotalMostrar = this.saldoTotal;
    }

    this.stepper.next();
  }

  seleccionarFormaPago(event) {
    if (event == 1) {
      this.mostrarBanco = false;

      this.stepDatosForm.get("idTipoFinanciera").clearValidators();
      this.stepDatosForm.get("idTipoFinanciera").updateValueAndValidity();
    } else {
      this.mostrarBanco = true;
      this.stepDatosForm
        .get("idTipoFinanciera")
        .setValidators([Validators.required]);
      this.stepDatosForm.get("idTipoFinanciera").updateValueAndValidity();
    }
  }

  crearSimulacion(stepper: MatStepper) {
    if (!this.stepDatosForm.valid) {
      this.componentes.alerta("error", "Debe llenar todos los campos");
      return;
    }

    let data = {
      idEntidad: this.participe.idParticipe,
      idTipoPago: this.stepPrestamoForm.value.idTipoPago.idTipoPago,
      idMetodoPago: this.stepDatosForm.value.idMetodoPago,

      idTipoCuenta: this.stepDatosForm.value.idTipoFinanciera,
      numeroCuenta: this.stepDatosForm.value.numeroReferencia,
      valor: this.stepDatosForm.value.valor,
      fecha: moment(this.stepDatosForm.value.fecha).format(),

      prestamos: this.stepPrestamoForm.value.idPrestamos,
    };

    this.dataPrestamo.postSimularAbono(data).subscribe(
      (res: any) => {
        this.isLoading = false;

        this.pagosDataSource.data = this.pagos = res["result"]["detalles"];
        this.TotalsPagosAplicar= res["result"]["abonoSumarry"]
        if (res["result"]["amortizacion"].length > 0) {
          this.amortizacionDataSource.data = res["result"]["amortizacion"];
          this.TotalsAmortizacionActualizada= res["result"]["amortizacionSumarry"]
          
        }

        this.validacionPago();
        stepper.next();
      },
      (error) => {
        this.isLoading = false;
        const msg =
          error?.error?.message || "Ocurrió un error al cargar los abonos";

        this.componentes.alerta("error", msg);
      }
    );
  }
  validacionPago() {
    const tieneAmortizacion = this.amortizacionDataSource.data.length > 0;
    const tieneValorPagar = this.stepDatosForm.value.valor > 0;
    const tieneTipoPago = !!this.tipoPago;
    const tienePagos = !!this.pagos;
    const esTipoPago6 = this.stepPrestamoForm.value.idTipoPago.idTipoPago === 6;

    this.mostrarGuardar =
      (tieneAmortizacion && tieneValorPagar && tieneTipoPago && tienePagos) ||
      (esTipoPago6 && tieneTipoPago && tienePagos && tieneAmortizacion);
  }

  guardarPagos() {
    const fecha = moment(this.stepDatosForm.value.fecha).format();

    if (
      this.stepDatosForm.value.valor > 0 &&
      this.tipoPago &&
      this.pagos.length > 0
    ) {
      this.componentes
        .alertaButtons("¿Esta seguro que desea guardar este pago?")
        .then((result) => {
          if (result.isConfirmed) {
            this.isLoading = true;
            this.spinner.show();
            const data = {
              idEntidad: this.participe.idParticipe,
              idTipoPago: this.stepPrestamoForm.value.idTipoPago.idTipoPago,
              idMetodoPago: this.stepDatosForm.value.idMetodoPago,
              valor: this.stepDatosForm.value.valor,
              fecha: moment(this.stepDatosForm.value.fecha).format(),
              prestamos: this.stepPrestamoForm.value.idPrestamos
            };

            this.dataPrestamo.postGuardarAbono(data).subscribe(
              (res) => {
                this.isLoading = false;
                this.spinner.hide();

                if (!res["success"]) {
                  this.componentes.alerta(
                    "error",
                    `Ocurrió un error al guardar el pago. ${res["message"]}`
                  );
                  return;
                }

                this.componentes
                  .alerta("success", "El abono se ha guardado exitosamente")
                  .then((res) => {
                  
                      location.reload();
                    
                  });
              },
              (error) => {
                this.isLoading = false;
                this.spinner.hide();
                this.componentes.alerta(
                  "error",
                  error["error"]["message"] || error["message"]
                );
              }
            );
          }
        });
    } else {
      this.isLoading = false;
      this.spinner.hide();
      this.componentes.alerta(
        "error",
        "No se puede guardar el abono, verifique los datos"
      );
    }
  }

  tipoPagoChange(pago) {
    //si es abono a capital

    if (pago.idTipoPago == 1) {
      this.selectMultiple = true;
      //agregar validacion valor de stepDatosForm para que no sea mayor a cuotaMinima
    } else {
      this.selectMultiple = false;
    }
    this.tipoPago = pago.descripcion;

    this.selection.clear();
    this.stepPrestamoForm.patchValue({
      idPrestamos: [],
    });
  }

  toggleAllRows() {
    //si selectMultiple es false no permitir seleccionar mas de un row
    if (!this.selectMultiple) {
      this.selection.clear();
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
      this.stepPrestamoForm.patchValue({
        idPrestamos: [],
      });
      return;
    }

    this.selection.select(...this.prestamosDataSource.data);
    this.stepPrestamoForm.patchValue({
      //guardar todas las id de los prestamos

      idPrestamos: this.selection.selected.map((item) => item.idPrestamo),
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.prestamosDataSource.data.length;
    return numSelected === numRows;
  }

  onRowClicked(row) {
    if (this.selectMultiple) {
      this.selection.toggle(row);
    } else {
      if (this.selection.isSelected(row)) {
        //desmarcar
        this.selection.clear();
      } else {
        //marcar
        this.selection.clear();
        this.selection.toggle(row);
      }
    }

    this.stepPrestamoForm.patchValue({
      idPrestamos: this.selection.selected.map((item) => item.idPrestamo),
    });
  }
  showAlert() {
    this.componentes.alerta("info", "Debe seleccionar un tipo de pago");
  }


  setTwoNumberDecimal(parameter) {
    let value=this.stepDatosForm.value[parameter]
    if( !value || value<=0 ){
      this.stepDatosForm.controls[parameter].setErrors({'especificError': "El valor no debe ser 0 o menor."});
    }else{
      if(value){
        let parseValue =value
        if (typeof value!="number") {
          parseValue = value.replaceAll(',', '')
        }
         this.stepDatosForm.controls[parameter].setValue( parseFloat(this.formsService.setNumberDecimal(parseValue+'',2)));
         return  this.stepDatosForm.value[parameter] 
      }  
    }
  }
}
