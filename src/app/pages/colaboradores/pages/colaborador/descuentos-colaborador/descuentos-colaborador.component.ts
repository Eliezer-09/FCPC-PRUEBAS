import { Component, OnInit, ViewChild  } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { iconify } from 'src/static-data/icons';
import { MatDialog } from '@angular/material/dialog';
import { AgregarDescuentoComponent } from 'src/app/pages/colaboradores/pages/colaborador/descuentos-colaborador/agregar-descuento/agregar-descuento.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { DescuentosConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { UtilsService } from '../../../utils/utils.service';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  selector: 'vex-descuentos-colaborador',
  templateUrl: './descuentos-colaborador.component.html',
  styleUrls: ['./descuentos-colaborador.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})

export class DescuentosColaboradorComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  icroundSearch = iconify.icroundSearch;
  icroundDiamond = iconify.icroundDiamond;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd = iconify.icroundAdd;
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
    { no: '1', tipo: 'Salario', valor: 100, fechaRegistro: '08/05/2023', observacio:'PRUEBAS'},
    { no: '2', tipo: 'Salario', valor: 200, fechaRegistro: '08/05/2023', observacio:''},
    { no: '3', tipo: 'Salario', valor: 100, fechaRegistro: '08/05/2023', observacio:''},
    { no: '4', tipo: 'Salario', valor: 90, fechaRegistro: '08/05/2023', observacio:''},
    { no: '5', tipo: 'Prestación', valor: 100, fechaRegistro: '08/05/2023', observacio:''},
    { no: '6', tipo: 'Prestación', valor: 100, fechaRegistro: '08/05/2023', observacio:''},
  ]);
  tableColumns: TableColumn<any>[] = DescuentosConfigure

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
    this.cargarDescuento(1, this.pageSize); 
  }
  
  searchTerm(term: string) {
     this.cargarDescuento(1, this.pageSize, term); 
  }


  actionMenu(event) {
    if (event.action === 'view') {
    }
    if (event.action === 'Editar') {
      console.log(event)
      this.openDialog( event);
   }   
    if (event.action === 'delete') {
      this.eliminarDescuento(event.data);
    }
  }
  
  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarDescuento(page, size);
  }

  eliminarDescuento(element: any) {
    this.utilsService
      .confirmar(
        "Eliminar descuento",
        "¿Está seguro de eliminar este descuento?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.utilsService.alerta('success', 'Descuento eliminado correctamente.');
        }
      });
  }
  
  cargarDescuento(page, size, term = '') {
    this.isLoading = true;


    this.isLoading = false;
  }
  

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(AgregarDescuentoComponent, {
      data:  item 
    });
  }
  
  
}
