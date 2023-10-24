import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { VacacionesDetalleConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { iconify } from 'src/static-data/icons';

@Component({
  selector: 'vex-detalle-vacaciones',
  templateUrl: './detalle-vacaciones.component.html',
  styleUrls: ['./detalle-vacaciones.component.scss']
})

export class DetalleVacacionesComponent implements OnInit {
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
    { periodo: '2014', vacaciones: '7', disfrutados: '7', balance:'0'},
    { periodo: '2015', vacaciones: '15', disfrutados: '12', balance:'3'},
    { periodo: '2016', vacaciones: '15', disfrutados: '0', balance:'15'},
    { periodo: '2017', vacaciones: '15', disfrutados: '0', balance:'15'},
    { periodo: '2018', vacaciones: '15', disfrutados: '0', balance:'15'},
    { periodo: '2019', vacaciones: '15', disfrutados: '0', balance:'15'},
  ]);
  tableColumns: TableColumn<any>[] = VacacionesDetalleConfigure
  
  constructor(public dialogRef: MatDialogRef<DetalleVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
  }
  ngOnInit(): void {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
    this.cargarFeriado(1, this.pageSize); 
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarFeriado(page, size);
  }

  cargarFeriado(page, size, term = '') {
    this.isLoading = true;


    this.isLoading = false;
  }
  
}
