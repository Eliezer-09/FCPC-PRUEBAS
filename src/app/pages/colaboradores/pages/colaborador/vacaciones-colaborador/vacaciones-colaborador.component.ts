import { Component, OnInit, ViewChild  } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { iconify } from 'src/static-data/icons';
import { MatDialog } from '@angular/material/dialog';
import { AgregarVacacionesComponent } from 'src/app/pages/colaboradores/pages/colaborador/vacaciones-colaborador/agregar-vacaciones/agregar-vacaciones.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { vacacionesConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'vex-vacaciones-colaborador',
  templateUrl: './vacaciones-colaborador.component.html',
  styleUrls: ['./vacaciones-colaborador.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms,
  ],
})
export class VacacionesColaboradorComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

    // Métodos adicionales para manejar las acciones de la tabla
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
  infoMessage = 'No se ha encontrado vacacioness';
  cols: any[];
  tableData: any[];

  dataFondoSource = new MatTableDataSource<any>([
    { no: '1', fechaInicio: '08/03/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''},
    { no: '2', fechaInicio: '01/05/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''},
    { no: '3', fechaInicio: '08/05/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''},
    { no: '4', fechaInicio: '08/05/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''},
    { no: '5', fechaInicio: '08/05/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''},
    { no: '6', fechaInicio: '08/05/2023', fechaFinal: '08/05/2023', periodo: '', observacionesVacaciones:''}
  ]);
  tableColumns: TableColumn<any>[] = vacacionesConfigure

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

  constructor(public dialog: MatDialog,
    public utilsService: UtilsService
    ) { }
  ngOnInit(): void {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
    this.cargaVacaciones(1, this.pageSize); 
  }
  
  searchTerm(term: string) {
     this.cargaVacaciones(1, this.pageSize, term); 
  }


  actionMenu(event) {
    if (event.action === 'view') {

    }
    if (event.action === 'Editar') {
      this.openDialog(event);
    }
    if (event.action === 'delete') {
      this.eliminarVacaciones(event);
    }
  }
  
  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargaVacaciones(page, size);
  }

  eliminarVacaciones(element: any) {
    this.utilsService
      .confirmar(
        "Eliminar vacacion",
        "¿Está seguro de eliminar esta vacacion?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.utilsService.alerta('success', 'Vacacion eliminada correctamente.');
        }
      });
  }
  

  cargaVacaciones(page, size, term = '') {
    this.isLoading = true;
    // Lógica para cargar los datos
    // ...
    this.isLoading = false;
  }
  

  openDialog(item: any): void {
    const dialogRef = this.dialog.open(AgregarVacacionesComponent, {
      data:  item 
    });
  }

}
