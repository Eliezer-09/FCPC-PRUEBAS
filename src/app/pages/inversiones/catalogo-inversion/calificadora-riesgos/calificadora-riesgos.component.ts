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
import { CalificadorasConfigure }               from 'src/static-data/configure-table/inversiones/configure-table-catalogo';

const ELEMENT_DATA: any[] = [{result: ''},]
@Component({
  selector: 'vex-calificadora-riesgos',
  templateUrl: './calificadora-riesgos.component.html',
  styleUrls: ['./calificadora-riesgos.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class CalificadaRiesgosComponent implements OnInit, AfterViewInit {
 // ICONOS
 icroundSearch        = iconify.icroundSearch;
 icroundBook          = iconify.icroundBook ;
 icroundFileDownload  = iconify.icroundFileDownload;
 icroundAdd           =iconify.icroundAdd;

 // DATA SOURCE
 pageSize = 10;
 isLoading = true;
 infoMessage = "No se ha encontrado Calificadoras";
 term = '';
 layoutCtrl = new FormControl('boxed');
 pageSizeOptions: number[] = [5,10,25,100];
 dataFondoSource = new MatTableDataSource<OperationResultCatalogo>(ELEMENT_DATA);
 searchCtrl = new FormControl();
 calificadoras: OperationResultCatalogo = {};
 pageEvent: PageEvent;
 filterValue: string = null;
 routers :any[]=[];
 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 @ViewChild(MatSort, { static: true }) sort: MatSort;
 tableColumns: TableColumn<any>[] = CalificadorasConfigure;

 menuOption=[
  {name:'Ver Detalle',icon:'manage_search', type:"routerLink",accion:"view"},
  {name:'Editar Detalle', icon:'edit', type:"routerLink",target:"_parent",accion:"edit"},
 ];


  constructor(
    public dialog: MatDialog,
    private inversionesService: InversionesService,
    private changeDetector: ChangeDetectorRef,
  ) { }



  ngOnInit() {
    this.servicesCalificadoraByTerm(1,this.pageSize);
  }
 
  servicesCalificadoraByTerm(page,pageSize){
    this.inversionesService.getEntidadFinanciera("calificadora",page,pageSize,this.term).pipe(
      map((calificadoras:OperationResultCatalogo) => {
        this.isLoading = false
        this.calificadoras = calificadoras
        this.dataFondoSource.data = calificadoras["result"];
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
    this.servicesCalificadoraByTerm(1,this.pageSize);
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesCalificadoraByTerm(page,size);
  }

  generateRouter(event){
    this.routers=[];
    const data=event.data;
    if(event.action==="view"){
      this.routers.push('/inversiones/detalle-calificadora/');
      this.routers.push(data["entidadFinanciera"]["idEntidad"]);
    }else if(event.action==="edit"){
      this.routers.push('/inversiones/editar-calificadora-riesgo/');
      this.routers.push(data["entidadFinanciera"]["idEntidad"]);
    }
  }

}
