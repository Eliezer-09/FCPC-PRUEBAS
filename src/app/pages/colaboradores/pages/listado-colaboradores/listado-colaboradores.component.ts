import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";

import {
  OperationResultParticipe,
  OperationResultPrestamo,
} from "src/app/model/models";
import { iconify } from "src/static-data/icons";
import { ApiResponse } from "../../models/colaboradores";

import { ColaboradorService } from "../../services/colaborador.service";
import { UtilsService } from "../../utils/utils.service";
import { TTHHColaboradorService } from "../../services/tthh-colaborador.service";
import { TThhService } from "../../services/tthh.service";
const ELEMENT_DATA: any[] = [{ result: "" }];

@Component({
  selector: "vex-listado-colaboradores",
  templateUrl: "./listado-colaboradores.component.html",
  styleUrls: ["./listado-colaboradores.component.scss"],
})
export class ListadoColaboradoresComponent implements OnInit {
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

  infoMessage = "No se ha encontrado honorarios";

  colaboradores: ApiResponse;
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

    {
      label: "acciones",
      property: "acciones",
      type: "button",
      cssClasses: ["text-secondary", "w-20"],
    },
  ];

  menuOption = [
    {
      name: "Ver honorario",
      icon: "manage_search",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar honorario",
      icon: "edit",
      type: "function",
      accion: "edit",
    },
    {
      name: "Detalle de la Nómina",
      icon: "manage_search",
      type: "function",
      accion: "view-detalle",
    },
  ];

  //iconos

  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;

  colaboradoresResult: OperationResultParticipe;

  constructor(
    private tthhService: TThhService,
    private router: Router,
    private utilsService: UtilsService,
    private tthhColaboradorService: TTHHColaboradorService
  ) {}

  ngOnInit(): void {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
    this.cargarColaboradores(1, this.pageSize);
  }

  cargarColaboradores(page, size, term = "", idTipoColaborador = 2) {
    this.isLoading = true;
  
      this.isLoading = true;
      this.tthhColaboradorService.getListadoNomina(page,size,idTipoColaborador,term).subscribe((empelados) => {
        this.isLoading = false;
        this.colaboradoresResult = empelados; 
        this.dataFondoSource.data =
          empelados["result"].length > 0 ? empelados["result"] : [];},
        (error) => {
          console.log(error)
          this.dataFondoSource.data = [];
          this.utilsService.alerta("error", "Error al cargar los honorarios");
          this.isLoading = false;
        
      })

/* 
    this.tthhColaboradorService.loadColaboradores(idTipoColaborador,page, size, term).subscribe((colaboradores) => {
          const colaboradoresList=colaboradores["result"];
          let colaboradoresIds=[];
         
          if(term!='' && term != undefined){
          
              colaboradoresIds.push({
                "identificacion": term
              });
          
        }else{
          colaboradoresList.forEach(element => {
            colaboradoresIds.push({
              "idEntidad": element["idEntidad"]
            });
        });
        }
        this.tthhColaboradorService.loadColaboradoresData(colaboradoresIds,page, size ) .subscribe(
        (colaboradores:OperationResultParticipe) => { 
          this.colaboradoresResult = colaboradores; 
        this.isLoading = false;
        this.dataFondoSource.data =
          colaboradores["result"].length > 0 ? colaboradores["result"] : [];},
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
    //navegar a agregar con id
    let tipo = "honorarios";
    this.router.navigate([`${tipo}/agregar`]);
  }
  descargaColaboradores() {
    //console.log("descarga colaboradores");
  }

  actionMenu(event) {
    //*aqui llegan todos los eventos de los botones de acciones

    if (event.action == "view") {
      this.router.navigate(["honorarios/ver/" + event.data.identificacion]);
    }

    if (event.action == "view-detalle") {
      this.router.navigate(["honorarios/detalle/ver/" + event.data.identificacion]);
    }
    
    if (event.action == "edit") {
      this.router.navigate(["honorarios/editar/" + event.data.identificacion]);
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
