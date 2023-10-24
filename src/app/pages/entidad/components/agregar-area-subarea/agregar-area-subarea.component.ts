import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { DataService } from "src/app/services/data.service";
import { EntidadService } from "../../services/entidad.service";

@Component({
  selector: "app-agregar-area-subarea",
  templateUrl: "./agregar-area-subarea.component.html",
  styleUrls: ["./agregar-area-subarea.component.scss"],
})
export class AgregarAreaSubareaComponent implements OnInit {
  public bankFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  //selects
  nombresBanco: any = [];
  formAddAreaSubArea: FormGroup;
  tipoModificacion: any;
  listaCargos;
  listadoTemporal: any;
  constructor(
    private dataService: DataService,
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public entidadService: EntidadService,
    public dialogRef: MatDialogRef<AgregarAreaSubareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cargarSelects();
    this.formAddAreaSubArea = this._formBuilder.group({
      idArea: this.data.idArea ? this.data.idArea : "",
      idAreaPadre: this.data.idAreaPadre ? this.data.idAreaPadre : "",
      descripcion: new FormControl(this.data.descripcion, [
        Validators.required,
      ]),
      idCargo: new FormControl(this.data.idCargo),
      tipoModificacion: this.data.tipoModificacion,
      idDepartamento: this.data.idDepartamento,
    });

    this.tipoModificacion = this.data.tipoModificacion;

    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy), distinctUntilChanged())
      .subscribe((filteredBanks) => {
        this.filtroCargos(filteredBanks);
      });
  }

  cargarSelects() {
    this.dataService.getInstitucionesFinancieras().subscribe(
      (data) => {
        this.nombresBanco = data;
      },
      (error) => {
        this.utilsService.alerta(
          "error",
          "Error al cargar las instituciones financieras"
        );
      }
    );

    this.entidadService.getCargosBuscador().subscribe(
      (res) => {
        this.listaCargos = res.result;

        this.listaCargos = this.listaCargos.filter(
          (cargo) => cargo.idTipoCargo != 1
        );

        this.listadoTemporal = this.listaCargos;
      },
      (error) => {
        this.utilsService.alerta("error", "Error al cargar los cargos");
      }
    );
  }

  protected filtroCargos(value) {
    //si filtro es vacio dejar el listado original, sino filtrar
    if (!value) {
      this.listadoTemporal = this.listaCargos;
      return;
    }

    this.listadoTemporal = this.listaCargos.filter((cargo) => {
      return cargo.descripcion.toLowerCase().includes(value.toLowerCase());
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveAreaSubArea(data) {
    //si tipoModificacion empieza con Editar
    if (this.tipoModificacion.startsWith("Editar")) {
      this.utilsService
        .confirmar(
          this.tipoModificacion,
          "¿Está seguro de guardar los cambios?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close(data);
          }
        });
    } else {
      this.dialogRef.close(data);
    }
  }
}
