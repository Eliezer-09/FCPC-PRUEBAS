import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TreeNode } from "primeng/api";
import { OperationResultParticipe } from "src/app/model/models";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { AgregarAreaSubareaComponent } from "../../../components/agregar-area-subarea/agregar-area-subarea.component";
import { EntidadService } from "../../../services/entidad.service";

import * as _ from "lodash";

@Component({
  selector: "app-agregar-unidad",
  templateUrl: "./agregar-unidad.component.html",
  styleUrls: ["./agregar-unidad.component.scss"],
})
export class AgregarUnidadComponent implements OnInit {
  filterValue: string;
  @Input() visualizationMode: boolean = false;
  tableData: TreeNode[] = [];
  cols: any[] = [];

  infoMessage = "No se han encontrado áreas";

  //iconos

  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;
  empleadosResult: OperationResultParticipe;

  formUnidadAdministrativa: FormGroup = this._formBuilder.group({
    descripcion: [null, [Validators.required]],
    idCargo: [null, [Validators.required]],
  });

  pageSize = 10;
  isLoading = false;

  idArea: any;
  tipoModificacion: string;
  listaCargos;
  idDepartamento: any;
  paginator = false;
  controlSreen: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public entidadService: EntidadService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cols = [
      /*       { field: "codigo", header: "Código" },
       */ { field: "descripcion", header: "Nombre" },
      { field: "nombreCargo", header: "Cargo Supervisor" },
    ];

    //obtener id de la ruta para editar
    this.activatedRoute.params.subscribe((params) => {
      this.idDepartamento = params["id"];
      if (this.idDepartamento && this.entidadService.unidad) {
        this.controlSreen = true;
        this.formUnidadAdministrativa.patchValue({
          descripcion: this.entidadService.unidad.descripcion,
          idCargo: this.entidadService.unidad.idCargo,
        });
        this.cargarAreas(this.idDepartamento);
      }
    });

    this.cargarCargos();

    if (this.router.url.includes("ver")) {
      this.visualizationMode = true;
    } else {
      this.visualizationMode = false;
    }
  }

  searchTerm(term: string) {
    this.cargarAreas(this.idDepartamento, term);
  }

  cargarCargos() {
    this.entidadService.getCargosBuscador().subscribe(
      (res) => {
        this.listaCargos = res.result;
        //filtrar listaCargos idTipoCargo = 1
        this.listaCargos = this.listaCargos.filter(
          (cargo) => cargo.idTipoCargo == 1
        );
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", "Error al cargar los cargos");
      }
    );
  }

  guardarEditarUnidad() {
    if (this.formUnidadAdministrativa.invalid) {
      this.utilsService.alerta(
        "error",
        "Debe completar todos los campos obligatorios"
      );
      return;
    }

    if (!this.idDepartamento) {
      this.isLoading = true;
      this.guardarUnidad();
    } else {
      this.utilsService
        .confirmar(
          "Actualizar departamento",
          "¿Está seguro de actualizar el departamento?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.isLoading = true;
            this.actualizarUnidad();
          }
        });
    }
  }

  guardarUnidad() {
    this.entidadService
      .guardarUnidad(this.formUnidadAdministrativa.value)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.utilsService.alerta("success", "Unidad guardada con éxito");
          this.idDepartamento = res.result.idDepartamento;
          this.controlSreen = true;

          this.cargarAreas(this.idDepartamento);
        },
        (error) => {
          this.isLoading = false;
          this.utilsService.alerta("error", error.error.message);
        }
      );
  }

  actualizarUnidad() {
    this.entidadService
      .actualizarUnidad(
        this.idDepartamento,
        this.formUnidadAdministrativa.value
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.utilsService.alerta("success", "Unidad actualizada con éxito");
          this.cargarAreas(this.idDepartamento);
        },
        (error) => {
          this.isLoading = false;
          this.utilsService.alerta("error", error.error.message);
        }
      );
  }

  cargarAreas(idDepartamento, term = "") {
    this.isLoading = true;
    this.entidadService.getAreas(idDepartamento, term).subscribe(
      (res) => {
        this.isLoading = false;

        if (res.result.length > 0 && res.result[0].children.length > 0) {
          this.tableData = res.result;
          this.paginator = true;
        }

        this.expandAll();
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", "Error al cargar las unidades");
        this.expandAll();
      }
    );
  }

  back() {
    this.router.navigate(["entidad/departamentos"]);
  }

  openDialog(element: any = "", tipo, visualizationMode = false) {
    //si tipo es 'Agregar' y no hay idArea, entonces es "Agregar área"
    let idArea;
    let idAreaPadre;
    if (tipo == "Agregar" && !element.idArea) {
      this.tipoModificacion = "Agregar área";
      idArea = "";
      idAreaPadre = "";
    } else if (tipo == "Agregar" && element.idArea) {
      this.tipoModificacion = "Agregar subárea";
      idArea = "";
      idAreaPadre = element.idArea;
    } else if (tipo == "Editar" && element.idArea && element.idSubArea) {
      this.tipoModificacion = "Editar subárea";
      //todo verificar
      idAreaPadre = element.idSubArea;
      idArea = element.idArea;
    } else if (tipo == "Editar" && element.idArea) {
      this.tipoModificacion = "Editar área";
      idArea = element.idArea;
      idAreaPadre = "";
    }

    const dialogRef = this.dialog.open(AgregarAreaSubareaComponent, {
      width: "600px",
      data: {
        idArea: idArea,
        idAreaPadre: idAreaPadre,
        descripcion:
          this.tipoModificacion == "Agregar subárea" ? "" : element.descripcion,
        idCargo:
          this.tipoModificacion == "Agregar subárea" ? "" : element.idCargo,
        idDepartamento: this.idDepartamento,

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
      case "Agregar área":
        this.agregarAreaSubarea(data, "Área guardada con éxito");
        break;
      case "Agregar subárea":
        this.agregarAreaSubarea(data, "Subárea guardada con éxito");
        break;
      case "Editar área":
        this.editarAreaSubarea(data, "Área actualizada con éxito");
        break;
      case "Editar subárea":
        this.editarAreaSubarea(data, "Subárea actualizada con éxito");
        break;

      default:
        break;
    }
  }
  editarAreaSubarea(data: any, message) {
    this.isLoading = true;
    this.entidadService.actualizarAreaSubarea(data.idArea, data).subscribe(
      (res) => {
        this.isLoading = false;
        this.utilsService.alerta("success", message);
        this.cargarAreas(this.idDepartamento);
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", error.error.message);
      }
    );
  }

  agregarAreaSubarea(data: any, message) {
    data = this.utilsService.deleteTrashData(data);
    this.isLoading = true;
    this.entidadService.guardarArea(data).subscribe(
      (res) => {
        this.isLoading = false;
        this.utilsService.alerta("success", message);
        this.cargarAreas(this.idDepartamento);
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", error.error.message);
      }
    );
  }

  eliminarAreaSubarea(element: any) {
    let message = "Área eliminada con éxito";
    let tipo = "área";
    if (element.idArea && element.idSubArea) {
      message = "Subárea eliminada con éxito";

      tipo = "subárea";
    }
    if (element.idArea) {
      this.utilsService
        .confirmar(
          "Eliminar " + tipo,
          "¿Está seguro de eliminar este " + tipo + "?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.isLoading = true;
            this.entidadService.eliminarArea(element.idArea).subscribe(
              (res) => {
                this.isLoading = false;
                this.utilsService.alerta("success", message);
                this.cargarAreas(this.idDepartamento);
              },
              (error) => {
                this.isLoading = false;
                this.utilsService.alerta("error", error.error.message);
              }
            );
          }
        });
    }
  }
}
