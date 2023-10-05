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
  selector: 'vex-participe-aprobado',
  templateUrl: './participe-aprobado.component.html',
  styleUrls: ['./participe-aprobado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInRight400ms,
    stagger80ms
  ]
})
export class ParticipeAprobadoComponent implements OnInit, AfterViewInit {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado participes aprobados";
  term = '';
  status = "Aprobado";
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultParticipe>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  pendienteCompleto:any[];
  aprobados: OperationResultParticipe = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];
 
  icroundHowToReg     = iconify.icroundHowToReg;
  icroundSearch       = iconify.icroundSearch;
  icroundFileDownload = iconify.icroundFileDownload


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
      property: 'fechaInicio',
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
    this.routers.push('aprobado')
  }

  servicesParticipe(status,page,pageSize){
    this.contratoService.getParticipeByEstado(status, page, pageSize).pipe(
      map((aprobados:OperationResultParticipe) => {
        this.isLoading = false
        this.aprobados = aprobados;
        this.dataFondoSource.data = aprobados.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  servicesParticipeBystatus(status,page,pageSize){
    this.contratoService.getTermParticipeByEstado(status, this.term,page,pageSize).pipe(
      map((aprobados:OperationResultParticipe) => {
        this.isLoading = false
        this.aprobados = aprobados
        this.dataFondoSource.data = aprobados["result"];
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

  generarExcel(){
      this.creditoService.getExcelConvenios().subscribe(res=>{
        var link = document.createElement('a');
        link.setAttribute('download', "convenios");
        link.style.display = 'none';
        document.body.appendChild(link);
        window.open(res["changingThisBreaksApplicationSecurity"]);
        document.body.removeChild(link);      }, error=>{
        this.componentService.alerta("error", "Ocurrió un error al descargar el excel")
      })
  }

}
