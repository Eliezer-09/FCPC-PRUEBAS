import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  AdjuntosColaborador,
  CargaFamiliar,
  ColaboradorPersona,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { ModalCargaFamiliarColaboradorComponent } from "../../../../components/modals/modal-carga-familiar-colaborador/modal-carga-familiar-colaborador.component";
import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-cargas-familiares-colaborador",
  templateUrl: "./datos-cargas-familiares-colaborador.component.html",
  styleUrls: ["./datos-cargas-familiares-colaborador.component.scss"],
})
export class DatosCargasFamiliaresColaboradorComponent
  implements OnInit, OnChanges
{
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;

  //forms
  form: FormGroup;
  cargaFamiliar: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;
  //TABLA
  tableColumns: TableColumn<any>[] = [
    {
      label: "Cédula",
      property: "cedula",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Nombres",
      property: "nombresCompletos",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Parentezco",
      property: "nombreParentezco",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },

    {
      label: "acciones",
      property: "acciones",
      type: "button",
      cssClasses: ["text-secondary", "w-20"],
    },
  ];

  menuOption = [
    {
      name: "Ver",
      icon: "visibility",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar",
      icon: "edit",
      type: "function",
      accion: "edit",
    },
    {
      name: "Eliminar",
      icon: "delete",
      type: "function",
      accion: "delete",
    },
  ];

  dataCargaFamiliar: CargaFamiliar[] = [];
  loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private colaboradorService: ColaboradorService,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.idColaborador && this.idColaborador != 0) {
      this.getCargasFamiliares();
    } else {
      this.dataCargaFamiliar = [];
    }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.cargaFamiliar = this._formBuilder.group({
      idColaborador: [""],
      idDependiente: [""],
      aplicaCarga: [""],
      discapacidad: [""],
      nombreParentezco: [""],

      idParentezco: [""],
      cedula: [""],
      fechaNacimiento: [""],
      nombresCompletos: [""],
      adjuntos: this._formBuilder.array([]),
    });

    this.form = this.ctrlContainer.form;
    this.form.addControl("cargaFamiliar", this.cargaFamiliar);
    if (this.visualizationMode) {
      this.menuOption = [
        {
          name: "Ver",
          icon: "visibility",
          type: "function",
          accion: "view",
        },
      ];
    }
  }
  openDialog(element: any = "", visualizationMode: boolean = false) {
    if (element) {
      this.cargaFamiliar.patchValue(element);
    }

    const dialogRef = this.dialog.open(ModalCargaFamiliarColaboradorComponent, {
      width: "600px",
      data: {
        idColaborador: this.idColaborador,
        nombreParentezco: this.cargaFamiliar.get("nombreParentezco").value,
        idDependiente: this.cargaFamiliar.get("idDependiente").value,
        aplicaCarga: this.cargaFamiliar.get("aplicaCarga").value,
        discapacidad: this.cargaFamiliar.get("discapacidad").value,
        idParentezco: this.cargaFamiliar.get("idParentezco").value,
        cedula: this.cargaFamiliar.get("cedula").value,

        fechaNacimiento: this.cargaFamiliar.get("fechaNacimiento").value,
        nombresCompletos: this.cargaFamiliar.get("nombresCompletos").value,
        visualizationMode: visualizationMode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }

      this.cargaFamiliar.patchValue({
        idColaborador: "",
        idDependiente: "",
        aplicaCarga: "",
        discapacidad: "",
        nombreParentezco: "",
        idParentezco: "",
        cedula: "",
        fechaNacimiento: "",
        nombresCompletos: "",
      });

      if (result) {
        if (element) {
          this.tthhColaboradorService
            .updateCargaFamiliar(
              result,
              this.idColaborador,
              result.idDependiente
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Carga familiar actualizada correctamente"
                );

                this.getCargasFamiliares();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al actualizar la carga familiar"
                );
              }
            );
        } else {
          this.guardarCargaFamiliar(result);
        }
      }
    });
  }

  guardarCargaFamiliar(result) {
    //si ya hay una carga familiar con la misma cedula no se guarda
    let existeCargaFamiliar = this.dataCargaFamiliar.find(
      (carga) => carga.cedula == result.cedula
    );
    if (existeCargaFamiliar) {
      this.utilsService.alerta(
        "warning",
        "Ya existe una carga familiar con la misma cédula"
      );
      return;
    }

    this.tthhColaboradorService
      .postCargaFamiliar(result, this.idColaborador)
      .subscribe(
        (res) => {
          this.utilsService.alerta(
            "success",
            "Carga familiar creada correctamente"
          );

          this.getCargasFamiliares();
        },
        (err) => {
          this.utilsService.alerta("error", "Error al crear la carga familiar");
        }
      );
  }

  getCargasFamiliares() {
    this.loading = true;
    this.tthhColaboradorService.getCargasFamiliares(this.idColaborador).subscribe(
      (res) => {
        if (res.result) {
          this.dataCargaFamiliar = res.result;
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
        this.utilsService.alerta(
          "error",
          "Error al cargar las cargas familiares"
        );
      }
    );
  }

  deleteFormacion(element: CargaFamiliar) {
    this.utilsService
      .confirmar(
        "Eliminar carga familiar",
        "¿Está seguro de eliminar la carga familiar?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .deleteCargaFamiliar(this.idColaborador, element.idDependiente)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Carga familiar eliminada correctamente"
                );

                this.getCargasFamiliares();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar la carga familiar"
                );
              }
            );
        }
      });
  }

  actionMenu(event) {
    if (event.action == "delete") {
      this.deleteFormacion(event.data);
    } else if (event.action == "edit") {
      this.openDialog(event.data);
    } else if (event.action == "view") {
      this.openDialog(event.data, true);
    }
  }

  get adjuntos() {
    return this.cargaFamiliar.controls["adjuntos"] as FormArray;
  }

  obtenerAdjuntos() {
    this.adjuntos.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos.length > 0 ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }
}
