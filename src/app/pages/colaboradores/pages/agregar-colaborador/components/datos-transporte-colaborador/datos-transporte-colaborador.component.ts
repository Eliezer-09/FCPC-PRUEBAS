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
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  AdjuntosColaborador,
  ColaboradorPersona,
  Transporte,
} from "src/app/pages/colaboradores/models/colaboradores";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";

import { ModalTransporteColaboradorComponent } from "../../../../components/modals/modal-transporte-colaborador/modal-transporte-colaborador.component";
import { ColaboradorService } from "../../../../services/colaborador.service";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "vex-datos-transporte-colaborador",
  templateUrl: "./datos-transporte-colaborador.component.html",
  styleUrls: ["./datos-transporte-colaborador.component.scss"],
})
export class DatosTransporteColaboradorComponent implements OnInit, OnChanges {
  @Input() idColaborador: any;
  @Input() idEntidad: any;
  @Input() colaborador: ColaboradorPersona;
  @Input() adjuntosColaborador: AdjuntosColaborador[];
  @Input() controlView: any;
  @Input() tipoColaborador: any;
  @Input() visualizationMode: boolean = false;

  loading = false;
  private subsReloadDatos: Subscription = null;

  //tabla
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

  tableColumns: TableColumn<any>[] = [
    {
      label: "Marca",
      property: "marca",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Modelo",
      property: "modelo",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Año",
      property: "anio",
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

  //forms
  form: FormGroup;
  transporte: FormGroup = this._formBuilder.group({
    idTipoVehiculo: [""],
    idVehiculo: [""],
    placa: [""],
    marca: [""],
    modelo: [""],
    clase: [""],
    color: [""],
    anio: [""],
    propietario: [""],
    adjuntos: this._formBuilder.array([]),
  });

  //iconos

  icroundAdd = iconify.icroundAdd;
  icroundEdit = iconify.icroundEditNote;
  icroundDelete = iconify.icroundDelete;

  dataTransportes: Transporte[] = [];

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
      if (changes.idColaborador?.currentValue) {
        this.getTransportes();
      }
    } else {
      this.dataTransportes = [];
    }

    /* if (changes.adjuntosColaborador?.currentValue) {
      this.obtenerAdjuntos();
    } */
  }

  ngOnInit(): void {
    this.form = this.ctrlContainer.form;
    this.form.addControl("transporte", this.transporte);

    this.subsReloadDatos = this.colaboradorService.currentMessage$.subscribe(
      (message) => (message === "getTransportes" ? this.getTransportes() : null)
    );

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
  openDialog(element: any = null, visualizationMode: boolean = false) {
    if (element) {
      this.transporte.patchValue(element);
    }

    const dialogRef = this.dialog.open(ModalTransporteColaboradorComponent, {
      width: "800px",
      data: {
        idVehiculo: this.transporte.get("idVehiculo").value,
        idTipoVehiculo: this.transporte.get("idTipoVehiculo").value,
        placa: this.transporte.get("placa").value,
        marca: this.transporte.get("marca").value,
        modelo: this.transporte.get("modelo").value,
        //clase: this.transporte.get("clase").value,

        color: this.transporte.get("color").value,
        anio: this.transporte.get("anio").value,
        propietario: this.transporte.get("propietario").value,
        idColaborador: this.idColaborador,
        idEntidad: this.idEntidad,
        tipoColaborador: this.tipoColaborador,
        visualizationMode: visualizationMode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }

      this.transporte.patchValue({
        idTipoVehiculo: "",
        idVehiculo: "",
        placa: "",
        marca: "",
        modelo: "",
        //clase: "",
        color: "",
        anio: "",
        propietario: "",
      });

      if (result) {
        if (element) {
          this.getTransportes();
        }
      }
    });
  }

  deleteFormacion(element) {
    this.utilsService
      .confirmar("Eliminar vehículo", "¿Está seguro de eliminar el vehículo?")
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhColaboradorService
            .deleteTransporte(this.idColaborador, element.idVehiculo)
            .subscribe(
              (res) => {
                this.utilsService.alerta(
                  "success",
                  "Vehículo eliminado correctamente"
                );

                this.getTransportes();
              },
              (err) => {
                this.utilsService.alerta(
                  "error",
                  "Error al eliminar el vehículo"
                );
              }
            );
        }
      });
  }

  getTransportes() {
    this.loading = true;
    if (this.idColaborador == 0 || !this.idColaborador) {
      return;
    }

    this.tthhColaboradorService.getTransportes(this.idColaborador).subscribe(
      (res) => {
        if (res.result) {
          this.dataTransportes = res.result;
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
        this.utilsService.alerta("error", "Error al obtener los vehículos");
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
    return this.transporte.controls["adjuntos"] as FormArray;
  }
}
