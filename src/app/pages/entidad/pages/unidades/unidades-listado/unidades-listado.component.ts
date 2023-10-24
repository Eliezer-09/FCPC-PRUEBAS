import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { ApiResponse, OperationResultParticipe } from "src/app/model/models";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
import { iconify } from "src/static-data/icons";
import { EntidadService } from "../../../services/entidad.service";
const ELEMENT_DATA: any[] = [{ result: "" }];

@Component({
  selector: "app-unidades-listado",
  templateUrl: "./unidades-listado.component.html",
  styleUrls: ["./unidades-listado.component.scss"],
})
export class UnidadesListadoComponent implements OnInit {
  dataFondoSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  layoutCtrl = new FormControl("boxed");

  filterValue: string;
  pageSize = 10;
  pageEvent: PageEvent;
  isLoading = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  infoMessage = "No se han encontrado unidades";

  empleados: ApiResponse;
  //variables de la tabla
  routers: any[] = [];
  tableColumns: TableColumn<any>[] = [
    {
      label: "Nombre",
      property: "descripcion",
      type: "text",
      cssClasses: ["font-medium", "number"],
    },

    /*    {
      label: "Tipo de unidades",
      property: "nombreTipoColaborador",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    }, */

    {
      label: "acciones",
      property: "acciones",
      type: "button",
      cssClasses: ["text-secondary", "w-20"],
    },
  ];

  menuOption = [
    {
      name: "Ver ",
      icon: "manage_search",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar ",
      icon: "edit",
      type: "function",
      accion: "edit",
    },
    {
      name: "Eliminar ",
      icon: "delete",
      type: "function",
      accion: "delete",
    },
  ];

  //iconos

  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;
  empleadosResult: OperationResultParticipe;

  constructor(
    public entidadService: EntidadService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.cargarUnidadesAdm();
  }

  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
  }

  cargarUnidadesAdm(term = "") {
    this.entidadService.getUnidades(term).subscribe(
      (res) => {
        this.isLoading = false;
        this.dataFondoSource.data = res.result.reverse();

        this.dataFondoSource.data.forEach((element) => {
          if (element.idCargo! == null) {
            element.nombreCargo = "N/A";
          }
        });
      },
      (error) => {
        this.isLoading = false;
        this.utilsService.alerta("error", "Error al cargar las unidades");
        this.dataFondoSource.data = [];
      }
    );
  }

  searchTerm(term: string) {
    this.cargarUnidadesAdm(term);
  }

  agregarUnidad() {
    let tipo = "entidad/departamentos";
    this.router.navigate([`${tipo}/agregar`]);
  }
  descargaColaboradores() {
    //console.log("descarga empleado");
  }

  actionMenu(event) {
    this.entidadService.unidad = null;

    //*aqui llegan todos los eventos de los botones de acciones

    if (event.action == "view") {
      this.entidadService.unidad = event.data;
      this.router.navigate([
        "entidad/departamentos/ver/" + event.data.idDepartamento,
      ]);
    }

    if (event.action == "edit") {
      this.entidadService.unidad = event.data;
      this.router.navigate([
        "entidad/departamentos/editar/" + event.data.idDepartamento,
      ]);
    }

    if (event.action == "delete") {
      this.utilsService
        .confirmar(
          "Eliminar departamento",
          "¿Está seguro de eliminar el departamento?"
        )
        .then((result) => {
          if (result.isConfirmed) {
            this.entidadService.unidad = event.data;
            this.eliminarUnidad(event.data.idDepartamento);
          }
        });
    }
  }
  eliminarUnidad(id: number) {
    this.entidadService.eliminarUnidad(id).subscribe(
      (res) => {
        this.utilsService.alerta("success", "Unidad eliminada");
        this.cargarUnidadesAdm();
      },
      (error) => {
        this.utilsService.alerta("error", "Error al eliminar la unidad");
      }
    );
  }

  /*  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarUnidadesAdm(page, size);
  } */
}
