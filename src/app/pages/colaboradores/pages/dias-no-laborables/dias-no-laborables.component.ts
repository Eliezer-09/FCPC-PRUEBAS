import { Component, OnInit, ViewChild  } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { iconify } from 'src/static-data/icons';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { DiasNoLaborablesConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-descuentos-vacaciones';
import { UtilsService } from '../../utils/utils.service';
import { AgregarDiaNoLaboralComponent } from './agregar-dia-no-laboral/agregar-dia-no-laboral.component';
import { HttpClient } from '@angular/common/http';
import { TThhService } from '../../services/tthh.service';
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
  dataFondoSource: MatTableDataSource<any>;
  tableColumns: TableColumn<any>[] = DiasNoLaborablesConfigure
  menuOption = [
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
  constructor(private datePipe: DatePipe, public dialog: MatDialog,
    public utilsService: UtilsService,
    private http: HttpClient,
    private tthhservice: TThhService,
    ) { }
  ngOnInit(): void {
    this.dataFondoSource = new MatTableDataSource<any>([]); 
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
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.cargarFeriado(page, size, this.filterValue);
  }
  
  eliminarFeriado(element: any) {
    this.utilsService
      .confirmar(
        "Eliminar dia no laboral",
        "¿Está seguro de eliminar este dia no laborable?"
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.tthhservice.eliminarFestivo(element.idFestivo).subscribe(
            response => {
              if (response.success) {
                this.utilsService.alerta('success', 'Dia no laboral eliminado correctamente.');
                this.cargarFeriado(1, this.pageSize);
              } else {
                this.utilsService.alerta('error', 'Hubo un error al eliminar el día no laborable.');
              }
            },
            error => {
              this.utilsService.alerta('error', 'Hubo un error al eliminar el día no laborable.');
            }
          );
        }
      });
  }
  cargarFeriado(page, size, term = '') {
    this.isLoading = true;
    this.tthhservice.getFestivos(page,size, term).subscribe(
      (data) => {
        this.paginator = data.result.length; 
        data.result.forEach(item => {
          item.fechaDesde = this.datePipe.transform(item.fechaDesde, 'dd/MM/yyyy');
          item.fechaHasta = this.datePipe.transform(item.fechaHasta, 'dd/MM/yyyy');
        });
        this.dataFondoSource = new MatTableDataSource<any>(data.result);         
        console.log(this.dataFondoSource.data.length)
        this.isLoading = false;
      },
      (error) => {
        this.utilsService.alerta('error', 'Hubo un error al cargar los días no laborables.');
        console.error('Hubo un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }
  openDialog(item: any): void {
    const dialogRef = this.dialog.open(AgregarDiaNoLaboralComponent, {
      data: item 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        if (result && result.idFestivo) {  
          this.tthhservice.updateFestivo(result.idFestivo, result).subscribe(response => {
            this.utilsService.alerta('success', 'Dia no laboral editado correctamente.');
            this.cargarFeriado(1, this.pageSize);
          });
        } else { 
          this.tthhservice.addFestivo(result).subscribe(response => {
            this.utilsService.alerta('success', 'Dia no laboral agregado correctamente.');
            this.cargarFeriado(1, this.pageSize);
          });
        }
      }
    });
}
}
