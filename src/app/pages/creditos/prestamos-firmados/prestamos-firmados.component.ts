import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl }                              from '@angular/forms';
import { MatPaginator, PageEvent }                  from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy }                             from '@ngneat/until-destroy';
import { map }                                      from 'rxjs/operators';
import { DataService }                              from 'src/app/services/data.service';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify}                                   from 'src/static-data/icons';
import { OperationResultParticipe, Participe }      from 'src/app/model/models';
import { TableColumn }                              from '../../../../@vex/interfaces/table-column.interface';
import { OperationResultPrestamo}                   from '../../../model/models';
import { CreditosService }                          from '../creditos.service';
import { ModalAcreditacionComponent }               from '../prestamos-aprobados/componentes/modal-acreditacion/modal-acreditacion.component';
import { MatDialog }                                from '@angular/material/dialog';
import { NgbModal, NgbModalConfig }                 from '@ng-bootstrap/ng-bootstrap';
import { ComponentesService } from 'src/app/services/componentes.service';

const ELEMENT_DATA: any[] = [
  {
    result: ''
  },

]

@UntilDestroy()
@Component({
  selector: 'vex-prestamos-firmados',
  templateUrl: './prestamos-firmados.component.html',
  styleUrls: ['./prestamos-firmados.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ],
  providers: [NgbModalConfig, NgbModal]
})
export class PrestamosFirmadosComponent implements OnInit {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado créditos legalizados";
  term = '';
  status="Legalizado";
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  prestamosfirmados: OperationResultPrestamo = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];

  icroundSearch        = iconify.icroundSearch;
  icroundReceiptLong       = iconify.icroundReceiptLong ;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  tableColumns:       TableColumn<Participe>[] = [
    {
      label: 'no. operacion',
      property: 'idPrestamo',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
  {
      label: 'cedula',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium',"texto"]
    },
      {
      label: 'razon social',
      property: 'nombre',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto"]
    },
    {
      label: 'monto',
      property: 'montoSolicitado',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal']
    },
    {
      label: 'tipo prestamo',
      property: 'tipoPrestamo',
      type: 'text',
      cssClasses: ['font-medium','colortext']
    },
        
   {
      label: 'fecha',
      property: 'fecha',
      type: 'text',
      cssClasses: ['font-medium','colortext','fecha']
    }, 
/*    {
      label: 'estado',
      property: 'estado',
      type: 'text',
      cssClasses: ['font-medium']
    },  */
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];
  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink"},
    {name:'Tabla amortización', icon:'table_view', type:"function", accion:"donwload"}
  ];
 
  constructor(
    private data: DataService,
    private creditoService: CreditosService,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog,
    private componentesService: ComponentesService,
  ) { }


  ngOnInit() {
    this.servicesPrestamo(this.status,null,1,this.pageSize);
  }
 
  generateRouter(event){
    this.routers=[];
    this.routers.push('/creditos/detalle');
    this.routers.push(event.data["idParticipe"]);
     this.routers.push(event.data["idPrestamo"]);
    this.routers.push('firmado')
  }

  servicesPrestamo(status,id,page,pageSize){
    this.creditoService.getPrestamosByEstado(status, id,page, pageSize).pipe(
      map((prestamosfirmados:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosfirmados = prestamosfirmados;
        this.dataFondoSource.data = prestamosfirmados.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  servicesPrestamoBystatus(status,page,pageSize){
    this.creditoService.getTermPrestamoByEstado(status, this.term,page,pageSize).pipe(
      map((prestamosfirmados:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosfirmados = prestamosfirmados
        this.dataFondoSource.data = prestamosfirmados["result"];
        this.changeDetector.detectChanges()
      })
    ).subscribe((res) => {}, (error) => {
      this.componentesService.alerta("error", error["error"]["message"]);
      this.isLoading = false
    });
  }

  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term=term || ''
    if (this.term.length > 0) {
      this.servicesPrestamoBystatus(this.status,1,this.pageSize);
    }else {
      this.servicesPrestamo(this.status,null,1,this.pageSize);
    }
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesPrestamoBystatus(this.status,page,size);
  }

  actionMenu(event){
    let data=event.data;
    if(event.action==="donwload"){
      this.descargarTablaAmor(data.idPrestamo)
    }
  }

  firmarPagare(data) {
    const dialogRef = this.dialog.open(ModalAcreditacionComponent, {
      width: '45%',
      autoFocus: false,
      height: '35%',
      // maxHeight: '80vh',
      data: {data: data}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  descargarTablaAmor(idPrestamo) {
    this.creditoService.getTablaAmortizacion(idPrestamo).subscribe( res => {
    var link = document.createElement('a');
    link.setAttribute('download', "TablaAmortizacion");
    link.style.display = 'none';
    document.body.appendChild(link);
    window.open(res["changingThisBreaksApplicationSecurity"]);
    document.body.removeChild(link);
    });
  }
}