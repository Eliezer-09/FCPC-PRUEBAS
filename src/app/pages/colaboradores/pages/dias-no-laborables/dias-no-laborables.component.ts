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
import { DiasNoLaborablesConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { UtilsService } from '../../utils/utils.service';
import { AgregarDiaNoLaboralComponent } from './agregar-dia-no-laboral/agregar-dia-no-laboral.component';


@Component({
  selector: 'vex-dias-no-laborables',
  templateUrl: './dias-no-laborables.component.html',
  styleUrls: ['./dias-no-laborables.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class DiasNoLaborablesComponent implements OnInit {
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
    { idFestivo: '1', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
    { idFestivo: '2', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
    { idFestivo: '3', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
    { idFestivo: '4', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
    { idFestivo: '5', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
    { idFestivo: '6', fechaDesde: '08/05/2023', fechaHasta: '08/05/2023', descripcion:'FIESTAS PATRONALES'},
  ]);
  tableColumns: TableColumn<any>[] = DiasNoLaborablesConfigure
  
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
    this.cargarFeriado(1, this.pageSize); 
  }
  
  searchTerm(term: string) {
     this.cargarFeriado(1, this.pageSize, term); 
  }
  actionMenu(event) {
    if (event.action === 'view') {
      this.openDialog(event);
    }
    if (event.action === 'Editar') {

      this.openDialog( event);
   }   
    if (event.action === 'delete') {
      this.eliminarFeriado(event.data);
    }
  }
  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarFeriado(page, size);
  }

  eliminarFeriado(element: any) {
    this.utilsService
      .confirmar(
        "Eliminar dia no laboral",
        "¿Está seguro de eliminar este dia no laboral?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.utilsService.alerta('success', 'Dia no laboral eliminado correctamente.');
        }
      });
  }
  
  cargarFeriado(page, size, term = '') {
    this.isLoading = true;


    this.isLoading = false;
  }
  

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(AgregarDiaNoLaboralComponent, {
      data:  item 
    });
  }
}
