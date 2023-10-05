import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "vex-modal-edit-datos-bancarios",
  templateUrl: "./modal-edit-datos-bancarios.component.html",
  styleUrls: ["./modal-edit-datos-bancarios.component.scss"],
})
export class ModalEditDatosBancariosComponent implements OnInit {
  bancarioForm: FormGroup;
  //selects
  tiposParentesco;
  institucionesFinancierasData: any = [];
  filteredInstituciones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  institucionesFinancierasDataFilterCtrl: FormControl = new FormControl();
  tiposCuentas: any = [];

  protected _onDestroy = new Subject<void>();

  constructor(
    private _formBuilder: FormBuilder,
    public utils: UtilsService,
    public dataService: DataService,
    public dialogRef: MatDialogRef<ModalEditDatosBancariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarSelects();

    this.bancarioForm = this._formBuilder.group({
      idReferenciaBancaria: new FormControl(this.data.idReferenciaBancaria),
      idEntidadFinanciera: new FormControl(this.data.idEntidadFinanciera, [
        Validators.required,
      ]),

      idTipoCuenta: new FormControl(this.data.idTipoCuenta, [
        Validators.required,
      ]),

      numeroCuenta: new FormControl(this.data.numeroCuenta, [
        Validators.required,
      ]),
    });

  }

  cargarSelects() {
    // TRAER LAS INSTITUCIONES FINANCIERAS

    this.dataService.getInstitucionesFinancieras().subscribe((nacio) => {
      this.institucionesFinancierasData = nacio;
      this.filteredInstituciones.next(
        this.institucionesFinancierasData.slice()
      );
      this.institucionesFinancierasDataFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterInstituciones();
        });
    });

    // TRAER LOS TIPOS DE CUENTAS
    this.dataService.getTipsoCuentas().subscribe(
      (data) => {
        this.tiposCuentas = data;
        this.tiposCuentas.forEach((element) => {
          element.idTipoCuenta = Number(element.idTipoCuenta);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  protected filterInstituciones() {
    if (!this.institucionesFinancierasData) {
      return;
    }
    let search = this.institucionesFinancierasDataFilterCtrl.value;
    if (!search) {
      this.filteredInstituciones.next(
        this.institucionesFinancierasData.slice()
      );
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredInstituciones.next(
      this.institucionesFinancierasData.filter(
        (instituciones) =>
          instituciones.descripcion.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarFormulario(datos) {
    if (!this.bancarioForm.dirty) {
      this.dialogRef.close();
      return;
    }

    if (datos.idEntidadFinanciera) {
      this.utils
        .confirmar(
          "Actualizar datos bancarios",
          "¿Está seguro de guardar los cambios?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close(datos);
          }
        });
    } else {
      this.dialogRef.close(datos);
    }
  }
}
