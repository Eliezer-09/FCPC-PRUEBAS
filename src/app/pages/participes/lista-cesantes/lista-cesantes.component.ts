import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild,AfterViewChecked } from '@angular/core';
import { FormControl }                              from '@angular/forms';
import { MatPaginator, PageEvent }                  from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy }                             from '@ngneat/until-destroy';
import { map }                                      from 'rxjs/operators';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify}                                   from 'src/static-data/icons';
import { OperationResultParticipe, Participe }      from 'src/app/model/models';
import { CesantesService }                          from '../cesantes.service';
import { TableColumn }                              from '../../../../@vex/interfaces/table-column.interface';

const ELEMENT_DATA: any[] = [
  {
    result: ''
  },

]
@UntilDestroy()
@Component({
  selector: 'vex-lista-cesantes',
  templateUrl: './lista-cesantes.component.html',
  styleUrls: ['./lista-cesantes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ListaCesantesComponent implements OnInit, AfterViewChecked {
  pageSize = 10;
  isLoading = true;
  status= "Liquidado";
  infoMessage = "No se ha encontrado cesantes liquidados";
  term = '';
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultParticipe>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  cesantes: OperationResultParticipe = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];

  icroundSearch         = iconify.icroundSearch;
  icroundPriceCheck     = iconify.icroundPriceCheck;
 
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableColumns:       TableColumn<any>[] = [
    {
      label: 'nombres',
      property: 'nombre',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'apellidos',
      property: 'apellido',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'cédula',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'fecha',
      property: 'fechaLiquidacion',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
  /*   {
      label: 'estado',
      property: 'estado',
      type: 'text',
      cssClasses: ['font-medium']
    }, */
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink"}
  ]
  constructor(
    private cesanteService: CesantesService, 
    private changeDetector: ChangeDetectorRef
  ) { }

  generateRouter(event){
    this.routers=[];
    this.routers.push('/contratos/detalle');
    this.routers.push(event.data["idEntidad"]);
    this.routers.push('cesado')
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {
    this.dataFondoSource.sort = this.sort;
  }


  ngOnInit() {
    this.servicesCesatia(this.status,1,this.pageSize);
  }

  servicesCesatia(status,page,pageSize){
    this.cesanteService.getCesantiasLiquidadas(status, page, pageSize).pipe(
      map((cesantes:OperationResultParticipe) => {
        this.isLoading = false
        this.cesantes = cesantes;
        this.dataFondoSource.data = cesantes.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  servicesCesantiasLiquidadasBystatus(page,pageSize){
    this.cesanteService.getTermCesantiaByEstado(this.term,page,pageSize).pipe(
      map((cesantes:OperationResultParticipe) => {
        this.isLoading = false
        this.cesantes = cesantes
        this.dataFondoSource.data = cesantes["result"];
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term=term || ''
    if (this.term.length > 0) {
      this.servicesCesantiasLiquidadasBystatus(1,this.pageSize);
    }else {
      this.servicesCesatia(this.status,1,this.pageSize);
    }
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesCesantiasLiquidadasBystatus(page,size);
  }

}
