import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { TreeTable } from "primeng/treetable";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { EntidadService } from "../../../services/entidad.service";
import { AgregarCargoComponent } from "../agregar-cargo/agregar-cargo.component";
import * as _ from "lodash";
import { TTHHColaboradorService } from "src/app/pages/colaboradores/services/tthh-colaborador.service";

@Component({
  selector: "app-listado-cargo",
  templateUrl: "./listado-cargo.component.html",
  styleUrls: ["./listado-cargo.component.scss"],
})
export class ListadoCargoComponent implements OnInit {
  filterValue: string;
  visualizationMode: boolean = false;
  tableData: TreeNode[] = [];
  cols: any[] = [];

  infoMessage = "No se han encontrado cargos";

  //iconos

  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;

  formUnidadAdministrativa: FormGroup = this._formBuilder.group({
    descripcion: [null, [Validators.required]],
    idGerente: [null, [Validators.required]],
  });

  pageSize = 10;
  isLoading = false;

  idCargo: any;
  tipoModificacion: string;

  paginator = false;
  controlSreen: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public entidadService: EntidadService,
    public dialog: MatDialog,
    private tthhColaboradorService: TTHHColaboradorService,
  ) {}

  ngOnInit() {
    this.cols = [{ field: "descripcion", header: "Nombres" }];

    this.cargarCargos();
  }

  searchTerm(term: string) {
    this.cargarCargos(term);
  }

  cargarCargos(term = "") {
    this.isLoading = true;
    this.entidadService.getCargos(term).subscribe(
      (res) => {
        this.isLoading = false;
        this.tableData = res.result.reverse();
        if (res.result.length > 0) {
          this.paginator = true;
        }
        this.expandAll();
      },
      (error) => {
        this.isLoading = false;

        if (error.status == 404) {
          this.tableData = [];
          this.paginator = false;
          this.utilsService.alerta("warning", "No se han encontrado cargos");
        } else {
          this.utilsService.alerta("error", error.error.message);
        }
        this.expandAll();
      }
    );
  }

  openDialog(element: any = "", tipo, visualizationMode = false) {
    //si tipo es 'Agregar' y no hay idCargo, entonces es "Agregar cargo"
    let idCargo;
    let idCargoSuperior;
    if (tipo == "Agregar" && !element.idCargo) {
      this.tipoModificacion = "Agregar cargo";
      idCargo = "";
      idCargoSuperior = "";
    } else if (tipo == "Agregar" && element.idCargo) {
      this.tipoModificacion = "Agregar subcargo";
      idCargo = "";
      idCargoSuperior = element.idCargo;
    } else if (tipo == "Editar" && element.idCargo && element.idCargoSuperior) {
      this.tipoModificacion = "Editar subcargo";
      idCargoSuperior = element.idCargoSuperior;
      idCargo = element.idCargo;
    } else if (tipo == "Editar" && element.idCargo) {
      this.tipoModificacion = "Editar cargo";
      idCargo = element.idCargo;
      idCargoSuperior = "";
    }

    const dialogRef = this.dialog.open(AgregarCargoComponent, {
      width: "600px",
      data: {
        idCargo: idCargo,
        idCargoSuperior: idCargoSuperior,
        descripcion:
          this.tipoModificacion == "Agregar subcargo"
            ? ""
            : element.descripcion,
        idSupervisor:
          this.tipoModificacion == "Agregar subcargo"
            ? ""
            : element.idSupervisor,

        idTipoCargo:
          this.tipoModificacion == "Agregar subcargo"
            ? false
            : element.idTipoCargo,

        codigo:
          this.tipoModificacion == "Agregar subcargo" ? "" : element.codigo,
        visualizationMode: visualizationMode,
        tipoModificacion: this.tipoModificacion,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (visualizationMode) {
        return;
      }

      if (result) {
        this.redireccionar(result.tipoModificacion, result);
      }
    });
  }

  public expandAll(): void {
    const temp = _.cloneDeep(this.tableData);
    temp.forEach((node) => {
      this.expandCollapseRecursive(node, true);
    });
    this.tableData = temp;
  }

  public collapseAll(): void {
    const temp = _.cloneDeep(this.tableData);
    temp.forEach((node) => {
      this.expandCollapseRecursive(node, false);
    });
    this.tableData = temp;
  }

  private expandCollapseRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandCollapseRecursive(childNode, isExpand);
      });
    }
  }
  redireccionar(tipo, data) {
    //implementar un swtich para redireccionar a la vista correspondiente
    switch (tipo) {
      case "Agregar cargo":
        this.agregarCargoSubcargo(data, "Cargo guardada con éxito");
        break;
      case "Agregar subcargo":
        this.agregarCargoSubcargo(data, "Subcargo guardada con éxito");
        break;
      case "Editar cargo":
        this.editarCargoSubcargo(data, "Cargo actualizada con éxito");
        break;
      case "Editar subcargo":
        this.editarCargoSubcargo(data, "Subcargo actualizada con éxito");
        break;

      default:
        break;
    }
  }
  editarCargoSubcargo(data: any, message) {
    data = this.utilsService.deleteTrashData(data);

    this.isLoading = true;
    this.entidadService.actualizaCargoSubcargo(data.idCargo, data).subscribe(
      (res) => {
        this.isLoading = false;
        this.utilsService.alerta("success", message);
        this.cargarCargos();
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", error.error.message, 5000);
      }
    );
  }

  agregarCargoSubcargo(data: any, message) {
    delete data.tipoModificacion;
    this.isLoading = true;
    //eliminar los campos null de data o que esten vacios
    data = this.utilsService.deleteTrashData(data);

    this.entidadService.postCargoSubcargo(data).subscribe(
      (res) => {
        this.isLoading = false;
        this.utilsService.alerta("success", message);
        this.cargarCargos();
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", error.error.message, 5000);
      }
    );
  }

  eliminarCargoSubcargo(element: any) {
    let tipo = "cargo";
    if (element.idCargo && element.idCargoSuperior) {
      tipo = "subcargo";
    }

    this.utilsService
      .confirmar(
        "Eliminar " + tipo,
        "¿Está seguro de eliminar este " + tipo + "?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          let message = "Cargo eliminada con éxito";
          if (element.idCargo && element.idCargoSuperior) {
            message = "Subcargo eliminada con éxito";
          }
          if (element.idCargo) {
            this.entidadService
              .eliminarCargoSubcargo(element.idCargo)
              .subscribe(
                (res) => {
                  this.isLoading = false;
                  this.utilsService.alerta("success", message);
                  this.cargarCargos();
                },
                (error) => {
                  this.isLoading = false;
                  this.utilsService.alerta("error", error.error.message, 5000);
                }
              );
          }
        }
      });
  }
}
