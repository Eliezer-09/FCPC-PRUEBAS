import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  ColaboradorPersona,
  AdjuntosColaborador,
  Direccion,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { ModalDirecccionColaboradorComponent } from "../../../../components/modals/modal-direcccion-colaborador/modal-direcccion-colaborador.component";
import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-direccion",
  templateUrl: "./direccion.component.html",
  styleUrls: ["./direccion.component.scss"],
})
export class DireccionComponent implements OnInit, OnChanges {
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() visualizationMode: boolean = false;

  @Input() tipoColaborador: any;
  dataDirecciones: Direccion[] = [];
  loading = false;
  //forms
  form: FormGroup;
  direccion: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  //tabla

  tableColumns: TableColumn<any>[] = [
    {
      label: "Tipo de dirección",
      property: "tipoDireccion",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Ciudad",
      property: "canton",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Parroquia",
      property: "parroquia",
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

  constructor(
    private colaboradorService: ColaboradorService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private ctrlContainer: FormGroupDirective,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.idColaborador && this.idColaborador != 0) {
      this.getDirecciones();
    } else {
      this.dataDirecciones = [];
    }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.direccion = this._formBuilder.group({
      idPais: [""],
      idTipoDireccion: [""],
      idProvincia: [""],
      idCanton: [""],
      idParroquia: [""],
      idDireccion: [""],
      nombreCanton: [""],
      nombrePais: [""],
      tipoDireccion: [""],
      nombreParroquia: [""],
      nombreTipoDireccion: [""],
      callePrincipal: [""],
      calleSecundaria: [""],
      referencia: [""],
      sector: [""],
      adjuntos: this._formBuilder.array([]),
    });

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

    this.form = this.ctrlContainer.form;
    this.form.addControl("direccion", this.direccion);
  }

  openDialog(element: any = null, visualizationMode: boolean = false) {
    if (element) {
      this.direccion.patchValue({
        idPais: element.idPais,
        idTipoDireccion: element.idTipoDireccion,
        idProvincia: element.idProvincia,
        idCanton: element.idCanton,
        idParroquia: element.idParroquia,
        callePrincipal: element.callePrincipal,
        calleSecundaria: element.calleSecundaria,
        referencia: element.referencia,
        idDireccion: element.idDireccion,
        nombreCanton: element.nombreCanton,
        nombrePais: element.nombrePais,
        sector: element.sector,
        nombreParroquia: element.nombreParroquia,
      });
    }

    const dialogRef = this.dialog.open(ModalDirecccionColaboradorComponent, {
      width: "600px",
      data: {
        idPais: this.direccion.get("idPais").value,
        idTipoDireccion: this.direccion.get("idTipoDireccion").value,
        idDireccion: this.direccion.get("idDireccion").value,
        idProvincia: this.direccion.get("idProvincia").value,
        idCanton: this.direccion.get("idCanton").value,
        idParroquia: this.direccion.get("idParroquia").value,
        callePrincipal: this.direccion.get("callePrincipal").value,
        calleSecundaria: this.direccion.get("calleSecundaria").value,
        referencia: this.direccion.get("referencia").value,
        nombreCanton: this.direccion.get("nombreCanton").value,
        nombrePais: this.direccion.get("nombrePais").value,
        nombreParroquia: this.direccion.get("nombreParroquia").value,
        sector: this.direccion.get("sector").value,
        visualizationMode: visualizationMode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }
      this.direccion.patchValue({
        idPais: "",
        idTipoDireccion: "",
        idProvincia: "",
        idCanton: "",
        idParroquia: "",
        callePrincipal: "",
        calleSecundaria: "",
        referencia: "",
        idDireccion: "",
        nombreCanton: "",
        nombrePais: "",
        nombreParroquia: "",
        sector: "",
      });

      if (result) {
        if (element) {
          if (
            //si ya existe la direccion con el mismo idTipoDireccion y no es la misma direccion
            this.dataDirecciones.find(
              (x) =>
                x.idTipoDireccion == result.idTipoDireccion &&
                x.idDireccion != result.idDireccion
            )
          ) {
            this.utilsService.alerta(
              "warning",
              "Ya existe una dirección con el mismo tipo"
            );
            return;
          }
          this.updateDireccion(result, element);
        } else {
          if (
            this.dataDirecciones.find(
              (x) => x.idTipoDireccion == result.idTipoDireccion
            )
          ) {
            this.utilsService.alerta(
              "warning",
              "Ya existe una dirección con el mismo tipo"
            );

            return;
          }
          this.tthhColaboradorService
            .postDireccion(result, this.idColaborador)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Dirección guardada correctamente"
                );

                this.getDirecciones();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al guardar la dirección"
                );
              }
            );
        }
      }
    });
  }

  private updateDireccion(result: any, element: any) {
    this.tthhColaboradorService
      .updateDireccion(result, this.idColaborador, element.idDireccion)
      .subscribe(
        (res) => {
          this.utilsService.alerta(
            "success",
            "Dirección actualizada correctamente"
          );

          this.getDirecciones();
        },
        (err) => {
          this.utilsService.alerta("error", "Error al actualizar la dirección");
        }
      );
  }

  deleteFormacion(element) {
    this.utilsService
      .confirmar("Eliminar dirección", "¿Está seguro de eliminar la dirección?")
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .deleteDireccion(this.idColaborador, element.idDireccion)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Dirección eliminada correctamente"
                );

                this.getDirecciones();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar la dirección"
                );
              }
            );
        }
      });
  }

  getDirecciones() {
    this.loading = true;
    this.tthhColaboradorService.getDireccionesById(this.idColaborador).subscribe(
      (res) => {
        if (res.result) {
          this.dataDirecciones = res.result;
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;

        this.utilsService.alerta("error", "Error al obtener las direcciones");
      }
    );
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
    return this.direccion.controls["adjuntos"] as FormArray;
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
