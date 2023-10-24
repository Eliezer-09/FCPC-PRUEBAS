import { Component, OnInit, ViewChild  } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { iconify } from 'src/static-data/icons';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import {VacacionesTTHHConfigure} from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'vex-vacaciones-tthh',
  templateUrl: './vacaciones-tthh.component.html',
  styleUrls: ['./vacaciones-tthh.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class VacacionesTthhComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundAdd = iconify.icroundAdd;
  roundFreeCancellation  = iconify.roundFreeCancellation;
  filterValue: string;
  layoutCtrl = new FormControl('boxed');
  pageSize = 10;
  pageEvent: PageEvent;
  isLoading = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  infoMessage = 'No se ha encontrado Descuentos';
  cols: any[];
  tableData: any[];
  dataFondoSource = new MatTableDataSource<any>([
    { no: '1', nombre:'Enfermedad', estado: 'Pendiente' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '09/05/2023', total: '1', },
    { no: '2', nombre:'Vacaciones', estado: 'Aprobado' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '12/08/2023', total: '1', },
    { no: '3', nombre:'Maternidad', estado: 'Rechazado' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '09/02/2023', total: '1', },
    { no: '4', nombre:'Vacaciones', estado: 'Aprobado' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '08/08/2023', total: '1', },
    { no: '5', nombre:'Maternidad', estado: 'Aprobado' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '11/06/2023', total: '1', },
    { no: '6', nombre:'maternidad', estado: 'Aprobado' , solicitud: '08/05/2023' ,start: '08/05/2023', end: '08/11/2023', total: '1', },
  ]);
  tableColumns: TableColumn<any>[] = VacacionesTTHHConfigure
  
  menuOption = [
    {
      name: "Ver",
      icon: "manage_search",
      type: "function",
      accion: "view",
    },
    {
      name: "Editar",
      icon: "edit",
      type: "function",
      accion: "Editar",
    },
    {
      name: "Eliminar",
      icon: "delete",
      type: "function",
      accion: "delete",
    },
  ];
  data: any;
  form: any;
  constructor(public dialog: MatDialog,
    public utilsService: UtilsService
    ) { }
  ngOnInit(): void {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
    this.cargarVacaciones(1, this.pageSize); 
  }
  
  searchTerm(term: string) {
     this.cargarVacaciones(1, this.pageSize, term); 
  }
  actionMenu(event) {
    if (event.action === 'view') {

    }
    if (event.action === 'Editar') {

   }   
    if (event.action === 'delete') {
      this.eliminarVacaciones(event.data);
    }
  }
  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarVacaciones(page, size);
  }
  eliminarVacaciones(element: any) {
    this.utilsService
      .confirmar(
        "Eliminar vacaciones",
        "¿Está seguro de eliminar estas vacaciones?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.utilsService.alerta('success', 'Vacaciones eliminada correctamente.');
        }
      });
  }
  cargarVacaciones(page, size, term = '') {
    this.isLoading = true;


    this.isLoading = false;
  } 
}
