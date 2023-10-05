import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import {
  OperationResultPrestamo,
  OperationResultParticipe,
} from "src/app/model/models";
import { iconify } from "src/static-data/icons";
import { ApiResponse } from "../../models/colaboradores";
import { ColaboradorService } from "../../services/colaborador.service";
import { UtilsService } from "../../utils/utils.service";
import { TTHHColaboradorService } from "../../services/tthh-colaborador.service";
const ELEMENT_DATA: any[] = [{ result: "" }];

@Component({
  selector: "app-listado-pasantes",
  templateUrl: "./listado-pasantes.component.html",
  styleUrls: ["./listado-pasantes.component.scss"],
})
export class ListadoPasantesComponent implements OnInit {
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(
    ELEMENT_DATA
  );
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  layoutCtrl = new FormControl("boxed");

  filterValue: string;
  pageSize = 10;
  pageEvent: PageEvent;
  isLoading = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  infoMessage = "No se ha encontrado pasantes";

  empleados: ApiResponse;
  //variables de la tabla
  routers: any[] = [];
  tableColumns: TableColumn<any>[] = [
    {
      label: "Identificación",
      property: "identificacion",
      type: "text",
      cssClasses: ["font-medium", "number"],
    },
    {
      label: "Nombres",
      property: "nombres",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Apellidos",
      property: "apellidos",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },

    /*    {
      label: "Tipo de pasantes",
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
      name: "Ver pasante",
      icon: "manage_search",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar pasante",
      icon: "edit",
      type: "function",
      accion: "edit",
    },
  ];

  //iconos

  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;
  empleadosResult: OperationResultParticipe;

  constructor(
    private colaboradorService: ColaboradorService,
    private router: Router,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService
  ) {}

  ngOnInit(): void {
    this.cargarColaboradores(1, this.pageSize);
  }

  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
  }

  cargarColaboradores(page, pageSize, term = "", idTipoColaborador = 3) {
    this.isLoading = true;

    this.tthhColaboradorService.getListadoNomina(page,pageSize,idTipoColaborador,term).subscribe((empelados) => {
      this.isLoading = false;
      this.dataFondoSource.data =
        empelados["result"].length > 0 ? empelados["result"] : [];},
      (error) => {
        console.log(error)
        this.dataFondoSource.data = [];
        this.utilsService.alerta("error", "Error al cargar los honorarios");
        this.isLoading = false;
      
    })
   
  /*   this.tthhColaboradorService.loadColaboradores(idTipoColaborador,page, pageSize, term).subscribe((empelados) => {
          const empeladosList=empelados["result"];
          let empeladosIds=[];
          this.empleadosResult = empelados; 
          empeladosList.forEach(element => {
              empeladosIds.push({
                "idEntidad": element["idEntidad"]
              });
          });
        this.tthhColaboradorService.loadColaboradoresData(empeladosIds,page, pageSize) .subscribe(
        (empelados) => { 
        this.isLoading = false;
        this.dataFondoSource.data =
          empelados["result"].length > 0 ? empelados["result"] : [];},
        (error) => {
          console.log(error)
          this.dataFondoSource.data = [];
          this.utilsService.alerta("error", "Error al cargar los honorarios");
          this.isLoading = false;
        }
        ); }) */

  }

  searchTerm(term: string) {
    this.cargarColaboradores(1, this.pageSize, term);
  }

  agregarColaborador() {
    let tipo = "pasantes";
    this.router.navigate([`${tipo}/agregar`]);
  }
  descargaColaboradores() {
    //console.log("descarga empleado");
  }

  actionMenu(event) {
    //*aqui llegan todos los eventos de los botones de acciones

    if (event.action == "view") {
      this.router.navigate(["pasantes/ver/" + event.data.identificacion]);
    }

    if (event.action == "edit") {
      this.router.navigate(["pasantes/editar/" + event.data.identificacion]);
    }
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarColaboradores(page, size);
  }

  generateRouter(event) {
    this.routers = [];
    this.routers.push("/personas/ver/" + 1);
  }
}
