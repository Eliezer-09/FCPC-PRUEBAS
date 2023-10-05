import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { FormControl }                              from '@angular/forms';
import { MatPaginator, PageEvent }                  from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy }                             from '@ngneat/until-destroy';
import { map }                                      from 'rxjs/operators';
import { DataService }                              from 'src/app/services/data.service';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify}                                   from 'src/static-data/icons';
import { OperationResultParticipe, Participe }      from 'src/app/model/models';
import { ComponentesService }                       from 'src/app/services/componentes.service';
import { CreditosService }                          from '../../creditos/creditos.service';
import { ContratosService }                         from '../contratos.service';
import { TableColumn }                              from '../../../../@vex/interfaces/table-column.interface';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';


const ELEMENT_DATA: any[] = [
  {
    result: ''
  },

]
@UntilDestroy()
@Component({
  selector: 'vex-participe-rechazado',
  templateUrl: './participe-rechazado.component.html',
  styleUrls: ['./participe-rechazado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class ParticipeRechazadoComponent implements OnInit, AfterViewInit {

  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado participes rechazados";
  displayedColumns = ["nombres", "apellidos", "identificacion", "fechaRegistro", "Estado", "IdParticipe", "Acciones"];
  status="Rechazado";
  term = '';
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultParticipe>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  pendienteCompleto:any[];
  rechazados: OperationResultParticipe = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];

  icroundSearch               = iconify.icroundSearch;
  icroundPersonAddDisabled    = iconify.icroundPersonAddDisabled ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  
  tableColumns:       TableColumn<Participe>[] = [
    {
      label: 'nombres',
      property: 'nombres',
      type: 'text',
      cssClasses: ['font-medium','texto']
    },
    {
      label: 'apellidos',
      property: 'apellidos',
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
      property: 'fechaRegistro',
      type: 'text',
      cssClasses: ['font-medium','fecha']
    },
/*     {
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
  ];

  constructor(    
    private data: DataService, private componentService: ComponentesService, private contratoService: ContratosService, 
    private changeDetector: ChangeDetectorRef, private creditoService: CreditosService) 
  { }

  ngOnInit() {
    this.servicesParticipe(this.status,1,this.pageSize);
  }

  generateRouter(event){
    this.routers=[];
    this.routers.push('/contratos/detalle');
    this.routers.push(event.data["idParticipe"]);
    this.routers.push('rechazado')
  }

  servicesParticipe(status,page,pageSize){
    this.contratoService.getParticipeByEstado(status, page, pageSize).pipe(
      map((rechazados:OperationResultParticipe) => {
        this.isLoading = false
        this.rechazados = rechazados;
        this.dataFondoSource.data = rechazados.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  servicesParticipeBystatus(status,page,pageSize){
    this.contratoService.getTermParticipeByEstado(status, this.term,page,pageSize).pipe(
      map((rechazados:OperationResultParticipe) => {
        this.isLoading = false
        this.rechazados = rechazados
        this.dataFondoSource.data = rechazados["result"];
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }


  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term=term || ''
    if (this.term.length > 0) {
      this.servicesParticipeBystatus(this.status,1,this.pageSize);
    }else {
      this.servicesParticipe(this.status,1,this.pageSize);
    }
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesParticipeBystatus(this.status,page,size);
  }


}
