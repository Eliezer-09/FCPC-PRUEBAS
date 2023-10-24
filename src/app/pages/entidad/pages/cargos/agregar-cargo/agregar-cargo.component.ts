import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { AgregarAreaSubareaComponent } from "../../../components/agregar-area-subarea/agregar-area-subarea.component";
import { EntidadService } from "../../../services/entidad.service";

@Component({
  selector: "app-agregar-cargo",
  templateUrl: "./agregar-cargo.component.html",
  styleUrls: ["./agregar-cargo.component.scss"],
})
export class AgregarCargoComponent implements OnInit {
  //selects

  tiposCargo = [
    { descripcion: "C1. DIRECCIONES", idTipoCargo: 1 },
    { descripcion: "C2. GERENCIAS", idTipoCargo: 2 },
    { descripcion: "C3. JEFATURAS", idTipoCargo: 3 },
    { descripcion: "C4. COORDINACIONES", idTipoCargo: 4 },
    { descripcion: "C5. ANALISTAS / ESPECIALISTAS", idTipoCargo: 5 },
    { descripcion: "C6. ASISTENCIAS", idTipoCargo: 6 },
    { descripcion: "C7. AXILIARES Y OPERATIVOS", idTipoCargo: 7 },
  ];

  formAddCargo: FormGroup;
  tipoModificacion: any;
  idCargo: any;

  constructor(
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public entidadService: EntidadService,
    public dialogRef: MatDialogRef<AgregarAreaSubareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formAddCargo = this._formBuilder.group({
      idCargo: this.data.idCargo ? this.data.idCargo : "",
      idCargoSuperior: this.data.idCargoSuperior
        ? this.data.idCargoSuperior
        : "",

      codigo: new FormControl(this.data.codigo),
      descripcion: new FormControl(this.data.descripcion, [
        Validators.required,
      ]),

      idTipoCargo: new FormControl(
        this.data.idTipoCargo ? this.data.idTipoCargo : false,
        []
      ),

      tipoModificacion: this.data.tipoModificacion,
    });

    this.tipoModificacion = this.data.tipoModificacion;
  }

  /*  comprobar(tipoCambiando) {
    console.log(tipoCambiando);
    if (tipoCambiando == "asesor") {
      if (this.formAddCargo.controls["asistente"].value) {
        this.formAddCargo.controls["asistente"].setValue(false);
      }
    }
    if (tipoCambiando == "asistente") {
      if (this.formAddCargo.controls["asesor"].value) {
        this.formAddCargo.controls["asesor"].setValue(false);
      }
    }
  } */

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarFormulario() {
    if (!this.formAddCargo.dirty) {
      this.onNoClick();
      return;
    }
    if (this.tipoModificacion.startsWith("Editar")) {
      this.utilsService
        .confirmar(
          this.tipoModificacion,
          "¿Está seguro de guardar los cambios?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close(this.formAddCargo.value);
          }
        });
    } else {
      this.dialogRef.close(this.formAddCargo.value);
    }
  }
}
