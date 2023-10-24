import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Parentesco } from "src/app/pages/participes/models/cesante-catalogo.interface";
import { Contacto } from "../../../models/colaboradores";
import { ColaboradorService } from "../../../services/colaborador.service";
import { UtilsService } from "../../../utils/utils.service";
import { TTHHColaboradorService } from "../../../services/tthh-colaborador.service";

@Component({
  selector: "vex-modal-contacto-colaborador",
  templateUrl: "./modal-contacto-colaborador.component.html",
  styleUrls: ["./modal-contacto-colaborador.component.scss"],
})
export class ModalContactoColaboradorComponent implements OnInit {
  envioEnProgreso: boolean = false;
  formContacto: FormGroup;
  //selects
  tiposParentesco: Parentesco[] = [];
  constructor(
    private colaboradorService: ColaboradorService,
    private _formBuilder: FormBuilder,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<ModalContactoColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contacto,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnInit(): void {
    this.cargarSelects();

    this.formContacto = this._formBuilder.group({
      idContacto: new FormControl(this.data.idContacto),
      idEntidad: new FormControl(this.data.idEntidad),
      correo: new FormControl(this.data.correo, [Validators.email]),
      nombre: new FormControl(this.utils.capitalize(this.data.nombre), [
        Validators.required,
        //solo letras lespañol
        Validators.pattern("^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$"),
      ]),
      telefono: new FormControl(this.data.telefono, [
        Validators.pattern("^[0-9+]*$"),
      ]),
      celular: new FormControl(this.data.celular, [
        Validators.required,
        Validators.pattern("^[0-9+]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      emergencia: new FormControl(this.data.emergencia),
      idParentesco: new FormControl(this.data.idParentesco),
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

  enviarFormulario(datos: Contacto) {
    if (!this.envioEnProgreso && this.formContacto.dirty) {
      this.envioEnProgreso = true;
  
      if (datos.idContacto) {
        this.utils
          .confirmar(
            "Actualizar contacto",
            "¿Está seguro de guardar los cambios?"
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.dialogRef.close(datos);
            }
          })
          .finally(() => {
            this.envioEnProgreso = false;
          });
      } else {
        this.dialogRef.close(datos);
        this.envioEnProgreso = false; 
      }
    } else {
      this.dialogRef.close();
    }
  }

  
}
