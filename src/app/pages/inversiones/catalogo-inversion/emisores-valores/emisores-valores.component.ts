import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                          from '@angular/material/dialog';
import { MatPaginator, PageEvent }            from '@angular/material/paginator';
import { MatSort }                            from '@angular/material/sort';
import { MatTableDataSource }                 from '@angular/material/table';
import { FormControl }                        from '@angular/forms';
import {  OperationResultCatalogo }           from 'src/app/model/models';
import { fadeInRight400ms }                   from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms }                      from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms }                       from 'src/@vex/animations/scale-in.animation';
import { stagger80ms }                        from 'src/@vex/animations/stagger.animation';
import { iconify}                             from 'src/static-data/icons';
import { InversionesService }                 from '../../inversiones.service';
import { TableColumn }                        from '../../../../../@vex/interfaces/table-column.interface';
import { CalificacionEmisorComponent }        from '../calificacion-emisor/calificacion-emisor.component';
import { map }                                from 'rxjs/operators';
import { EmisoresConfigure }                  from 'src/static-data/configure-table/inversiones/configure-table-catalogo';

const ELEMENT_DATA: any[] = [ {
  pageNumber: 1,
  pageSize: 10,
  length: 0,
  totalPages: 1,
  hasPrevious: 0,
  hasNext: 2,
  result: [],
  error: null,
  message: "",
  statusCode: 200,
  success: true,
}]
@Component({
  selector: 'vex-emisores-valores',
  templateUrl: './emisores-valores.component.html',
  styleUrls: ['./emisores-valores.component.scss'],
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
})
export class EmisoresValoresComponent implements OnInit, AfterViewInit, AfterViewChecked {
  // ICONOS
  icroundSearch        = iconify.icroundSearch;
  icroundBook          = iconify.icroundBook ;
  icroundFileDownload  = iconify.icroundFileDownload;
  icroundAdd           =iconify.icroundAdd;

  // DATA SOURCE
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado Emisores";
  term = '';
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultCatalogo>();
  searchCtrl = new FormControl();
  emisores: OperationResultCatalogo = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableColumns: TableColumn<any>[] =EmisoresConfigure;

  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink",accion:"view"},
    {name:'Asignar Calificación', icon:'add', type:"function", accion:"asignar"},
    {name:'Editar Detalle', icon:'edit', type:"routerLink",target:"_parent",accion:"edit"},
   ];
  
  constructor(public dialog: MatDialog,
    private inversionesService: InversionesService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.servicesEmisioresbyTerm(1,this.pageSize);
  }

  
  generateRouter(event){
    this.routers=[];
    const data=event.data;
    if(event.action==="view"){
      this.routers.push('/inversiones/detalle-emisor');
      this.routers.push(data["entidadFinanciera"]["idEntidad"]);
    }else if(event.action==="edit"){
      this.routers.push('/inversiones/editar-emisor');
      this.routers.push(data["entidadFinanciera"]["idEntidad"]);
    }
  }
 
  servicesEmisioresbyTerm(page,pageSize){
    this.inversionesService.getEntidadFinanciera("emisor",page,pageSize,this.term).pipe(
      map((emisores:OperationResultCatalogo) => {
        this.isLoading = false
        this.emisores = emisores
        this.dataFondoSource.data = emisores["result"];
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
    this.servicesEmisioresbyTerm(1,this.pageSize);
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesEmisioresbyTerm(page,size);
  }

  actionMenu(event){
    let data=event.data;
    if(event.action==="asignar"){
      this.modalCalificacionEmisor(data);
    }
  }



  modalCalificacionEmisor(data) {
        const dialogRef = this.dialog.open(CalificacionEmisorComponent, {
          width: '40%',
          autoFocus: false,
          data: {idEntidad:data.entidadFinanciera.idEntidad,
                razonSocial:data.entidadFinanciera.descripcion}
          
        });
        
        dialogRef.afterClosed().subscribe(result => {
          if(result=="cancelado"){
            dialogRef.close
          }
        });
      
    } 
}