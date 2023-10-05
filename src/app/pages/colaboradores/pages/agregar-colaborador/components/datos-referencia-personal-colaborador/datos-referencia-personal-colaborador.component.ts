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
import { Subscription } from "rxjs";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  AdjuntosColaborador,
  ColaboradorPersona,
  ReferenciaPersonal,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { ModalReferenciaPersonalColaboradorComponent } from "../../../../components/modals/modal-referencia-personal-colaborador/modal-referencia-personal-colaborador.component";
import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-referencia-personal-colaborador",
  templateUrl: "./datos-referencia-personal-colaborador.component.html",
  styleUrls: ["./datos-referencia-personal-colaborador.component.scss"],
})
export class DatosReferenciaPersonalColaboradorComponent
  implements OnInit, OnChanges
{
  @Input() idColaborador: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;
  loading: boolean = false;
  @Input() idEntidad: any;
  //forms
  form: FormGroup;
  referenciaPersonal: FormGroup;

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  //tabla

  tableColumns: TableColumn<any>[] = [
    {
      label: "Nombres",
      property: "nombres",
      type: "text",
      cssClasses: ["font-medium", "texto", "mat-column-width-30"],
    },
    {
      label: "Celular",
      property: "telefono",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Relacion",
      property: "observaciones",
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
  dataRerenciasPersonales: ReferenciaPersonal[] = [];

  private subsReloadDatos: Subscription = null;

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
      this.getReferenciasPersonales();
    } else {
      this.dataRerenciasPersonales = [];
    }

    if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    }
  }

  ngOnInit(): void {
    this.referenciaPersonal = this._formBuilder.group({
      idReferenciaPersonal: [""],
      nombres: [""],
      telefono: [""],
      correo: [""],
      observaciones: [""],
      idEntidad: [""],
      adjuntos: this._formBuilder.array([]),
    });

    this.form = this.ctrlContainer.form;
    this.form.addControl("referenciaPersonal", this.referenciaPersonal);

    this.subsReloadDatos = this.colaboradorService.currentMessage$.subscribe(
      (message) =>
        message === "getReferenciaPersonal"
          ? this.getReferenciasPersonales()
          : null
    );

    if (this.visualizationMode) {
      /*  this.tableColumns.pop();
      //menuOption quitar todos y dejar Ver */
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
  openDialog(element: any = null, visualizationMode: boolean = false) {
    if (element) {
      this.referenciaPersonal.patchValue(element);
    }

    const dialogRef = this.dialog.open(
      ModalReferenciaPersonalColaboradorComponent,
      {
        width: "800px",
        data: {
          idReferenciaPersonal: this.referenciaPersonal.get(
            "idReferenciaPersonal"
          ).value,
          nombres: this.referenciaPersonal.get("nombres").value,
          telefono: this.referenciaPersonal.get("telefono").value,
          correo: this.referenciaPersonal.get("correo").value,
          observaciones: this.referenciaPersonal.get("observaciones").value,
          idEntidad: this.referenciaPersonal.get("idEntidad").value,
          idColaborador: this.idColaborador,
          tipoColaborador: this.tipoColaborador,
          visualizationMode: visualizationMode,
          idEntidadPersona: this.idEntidad,
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }
      this.referenciaPersonal.patchValue({
        idReferenciaPersonal: "",
        nombres: "",
        telefono: "",
        correo: "",
        observaciones: "",
        idEntidad: "",
      });

      //todo verificar si se usa
      if (result) {
        if (element) {
          this.getReferenciasPersonales();
        }
      }
    });
  }

  deleteFormacion(element: ReferenciaPersonal) {
    this.utilsService
      .confirmar("Eliminar Referencia Personal", "¿Está seguro de eliminar?")
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .deleteReferenciaPersonal(
              this.idEntidad,
              element.idReferenciaPersonal
            )
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Referencia Personal eliminada correctamente"
                );

                this.getReferenciasPersonales();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar la referencia personal"
                );
              }
            );
        }
      });
  }
  getReferenciasPersonales() {
    this.loading = true;
    this.tthhColaboradorService.getReferenciaPersonal(this.idEntidad).subscribe(
      (res) => {
        this.dataRerenciasPersonales = res.result;
        this.loading = false;
      },
      (err) => {
        this.loading = false;

        this.utilsService.alerta(
          "error",
          "Error al obtener las referencias personales"
        );
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
    return this.referenciaPersonal.controls["adjuntos"] as FormArray;
  }

  obtenerAdjuntos() {
    this.adjuntos.clear();

    this.adjuntosColaborador.forEach((element: AdjuntosColaborador) => {
      if (element.nombreSeccion == this.controlView) {
        let adjunto = this._formBuilder.group({
          nombre: [element.nombreAdjunto],
          archivos: [
            element.archivos ? element.archivos : null,
            element.esRequerido ? Validators.required : null,
          ],
        });

        this.adjuntos.push(adjunto);
      }
    });
  }

  ngOnDestroy() {
    this.colaboradorService.changeMessage("default message");
    this.subsReloadDatos.unsubscribe();
  }
}
