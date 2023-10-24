import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DataService } from "src/app/services/data.service";
import { Direccion } from "../../../models/colaboradores";
import { UtilsService } from "../../../utils/utils.service";

@Component({
  selector: "vex-modal-direcccion-colaborador",
  templateUrl: "./modal-direcccion-colaborador.component.html",
  styleUrls: ["./modal-direcccion-colaborador.component.scss"],
})
export class ModalDirecccionColaboradorComponent implements OnInit {
  envioEnProgreso = false;
  parroquias: any = [];
  provincias: any = [];
  ciudades: any = [];
  formDireccion: FormGroup;
  sectores = [
    "Norte",
    "Sur",
    "Este",
    "Oeste",
    "Centro",
    "Noreste",
    "Noroeste",
    "Sureste",
    "Suroeste",
  ];
  filteredOptions: Observable<any[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private dataService: DataService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<ModalDirecccionColaboradorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Direccion
  ) {}

  tiposDireccion = [];

  ngOnInit(): void {
    this.cargarProvincias();
    this.cargarTipoDireccion();

    this.formDireccion = this._formBuilder.group({
      idPais: new FormControl(1),
      idTipoDireccion: new FormControl(
        this.data.idTipoDireccion,
        Validators.required
      ),
      idProvincia: new FormControl(this.data.idProvincia, Validators.required),
      idCanton: new FormControl(this.data.idCanton, Validators.required),
      idParroquia: new FormControl(this.data.idParroquia, Validators.required),
      callePrincipal: new FormControl(
        this.data.callePrincipal,
        Validators.required
      ),
      idDireccion: new FormControl(this.data.idDireccion),

      calleSecundaria: new FormControl(this.data.calleSecundaria),

      referencia: new FormControl(this.data.referencia),
      sector: new FormControl(this.data.sector ? this.data.sector : ""),
    });

    if (this.data && this.data.idDireccion) {
      this.seleccionarProvincia(this.data.idProvincia);

      this.seleccionarCuidad(this.data.idCanton);
    }

    this.filteredOptions = this.formDireccion.controls.sector.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }

  private _filter(value: any): any[] {
    const filterValue = value?.toLowerCase();

    return this.sectores.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cargarTipoDireccion() {
    this.dataService.getTipoDireccion().subscribe(
      (tipos: any) => {
        this.tiposDireccion = tipos.result;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar los tipos de direccion"
        );
      }
    );
  }

  cargarProvincias() {
    this.dataService.getProvincias(1).subscribe(
      (prov) => {
        this.provincias = prov;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las provincias");
      }
    );
  }
  seleccionarProvincia(event) {
    this.dataService.getCiudades(event).subscribe(
      (ciudades: any) => {
        this.ciudades = ciudades;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las ciudades");
      }
    );
  }

  seleccionarCuidad(event) {
    this.dataService.getParroquias(event).subscribe(
      (parroquias: any) => {
        this.parroquias = parroquias;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar las parroquias");
      }
    );
  }

  enviarFormulario(datos: Direccion) {
    if (!this.envioEnProgreso && this.formDireccion.dirty) {
      this.envioEnProgreso = true;
      if (datos.idDireccion) {
        this.utilsService
          .confirmar(
            "Actualizar dirección",
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
