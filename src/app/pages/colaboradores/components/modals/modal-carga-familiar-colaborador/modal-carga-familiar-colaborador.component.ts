import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
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
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Parentesco } from "src/app/pages/participes/models/cesante-catalogo.interface";
import { CargaFamiliar } from "../../../models/colaboradores";
import { ColaboradorService } from "../../../services/colaborador.service";
import { MY_FORMATS } from "../../../utils/my-date-form";
import { UtilsService } from "../../../utils/utils.service";
import { ModalContactoColaboradorComponent } from "../modal-contacto-colaborador/modal-contacto-colaborador.component";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";

@Component({
  selector: "vex-modal-carga-familiar-colaborador",
  templateUrl: "./modal-carga-familiar-colaborador.component.html",
  styleUrls: ["./modal-carga-familiar-colaborador.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ModalCargaFamiliarColaboradorComponent implements OnInit {
  //selects
  tiposParentesco: Parentesco[] = [];
  formCargaFamiliar: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    public utils: UtilsService,
    private colaboradorService: ColaboradorService,
    public dialogRef: MatDialogRef<ModalContactoColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CargaFamiliar,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnInit(): void {
    this.cargarSelects();
    this.formCargaFamiliar = this._formBuilder.group({
      idColaborador: [this.data.idColaborador],
      aplicaCarga: new FormControl(this.data.aplicaCarga, Validators.required),
      discapacidad: new FormControl(
        this.data.discapacidad,
        Validators.required
      ),
      idParentezco: new FormControl(
        this.data.idParentezco,
        Validators.required
      ),
      cedula: new FormControl(this.data.cedula, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
      ]),

      fechaNacimiento: new FormControl(
        this.data.fechaNacimiento,
        Validators.required
      ),
      nombresCompletos: new FormControl(
        this.utils.capitalize(this.data.nombresCompletos),
        [Validators.required, Validators.pattern("^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]*$")]
      ),
      idDependiente: new FormControl(this.data.idDependiente),
    });
  }

  cargarSelects() {
    this.tthhColaboradorService.getTiposParentesco().subscribe(
      (data) => {
        this.tiposParentesco = data;
      },
      (error) => {
        this.utils.alerta("error", "Error al cargar los tipos de parentesco");
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarFormulario(datos: CargaFamiliar) {
    if (!this.formCargaFamiliar.dirty) {
      this.dialogRef.close();
      return;
    }

    if (datos.idDependiente) {
      this.utils
        .confirmar(
          "Actualizar carga familiar",
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
