import { AfterViewInit,ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                            from '@angular/material/dialog';
import { MatPaginator, PageEvent }              from '@angular/material/paginator';
import { MatSort }                              from '@angular/material/sort';
import { MatTableDataSource }                   from '@angular/material/table';
import { FormControl }                          from '@angular/forms';
import { InversionesService }                   from '../../inversiones.service';
import { TableColumn }                          from '../../../../../@vex/interfaces/table-column.interface';
import { OperationResultCatalogo }              from 'src/app/model/models';
import { iconify}                               from 'src/static-data/icons';
import { map }                                  from 'rxjs/operators';
import { fadeInUp400ms }                        from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms }                         from 'src/@vex/animations/scale-in.animation';
import { fadeInRight400ms }                     from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms }                          from 'src/@vex/animations/stagger.animation';
import { cutodioTituloConfigure }               from 'src/static-data/configure-table/inversiones/configure-table-catalogo';

const ELEMENT_DATA: any[] = [{result: ''},]

  @Component({
    selector: 'vex-custidio-titulo',
    templateUrl: './custidio-titulo.component.html',
    styleUrls: ['./custidio-titulo.component.scss'],
    animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class CustidioTituloComponent implements OnInit, AfterViewInit {
 // ICONOS
 icroundSearch        = iconify.icroundSearch;
 icroundBook          = iconify.icroundBook ;
 icroundFileDownload  = iconify.icroundFileDownload;
 icroundAdd           =iconify.icroundAdd;

 // DATA SOURCE
 pageSize = 10;
 isLoading = true;
 infoMessage = "No se ha encontrado Custodio de Título";
 term = '';
 layoutCtrl = new FormControl('boxed');
 pageSizeOptions: number[] = [5,10,25,100];
 dataFondoSource = new MatTableDataSource<OperationResultCatalogo>(ELEMENT_DATA);
 searchCtrl = new FormControl();
 custodio: OperationResultCatalogo = {};
 pageEvent: PageEvent;
 filterValue: string = null;
 routers :any[]=[];
 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 @ViewChild(MatSort, { static: true }) sort: MatSort;
 tableColumns: TableColumn<any>[] = cutodioTituloConfigure;

  constructor(
    public dialog: MatDialog,
    private inversionesService: InversionesService,
    private changeDetector: ChangeDetectorRef,
  ) { }



  ngOnInit() {
    this.servicesCustodioaByTerm(1,this.pageSize);
  }
 
  servicesCustodioaByTerm(page,pageSize){
    this.inversionesService.getEntidadFinanciera("custodio",page,pageSize,this.term).pipe(
      map((custodio:OperationResultCatalogo) => {
        this.isLoading = false
        this.custodio = custodio
        this.dataFondoSource.data = custodio["result"];
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }


  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
  }

  
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term=term || ''
    this.servicesCustodioaByTerm(1,this.pageSize);
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesCustodioaByTerm(page,size);
  }

}
