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
import { ComponentesService }                       from '../../../services/componentes.service';
import { OperationResultPrestamo} from '../../../model/models';
import Swal                                         from 'sweetalert2';
import { CreditosService }                          from '../creditos.service';
import { AuthService }                              from '../../auth/auth.service';
import { LocalService } from 'src/app/services/local.service';

const ELEMENT_DATA: any[] = [
  {
    result: ''
  },

]
@UntilDestroy()
@Component({
  selector: 'vex-prestamos-pendientes',
  templateUrl: './prestamos-pendientes.component.html',
  styleUrls: ['./prestamos-pendientes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class PrestamosPendientesComponent implements OnInit {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado créditos pendientes";
  term = '';
  status="Pendiente";
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  prestamosPendientes: OperationResultPrestamo = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];

  icroundSearch        = iconify.icroundSearch;
  icroundAddCard       = iconify.icroundAddCard ;
  
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
   {
      label: 'estado',
      property: 'estado',
      type: 'text',
      cssClasses: ['font-medium']
    }, 
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];
  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink"},
    {name:'Anular Detalle', icon:'delete', type:"function", accion:"delete"}
  ];

  constructor(
    private data: DataService,
    private creditoService: CreditosService,
    private dataComponentes: ComponentesService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private localServiceS: LocalService,
    private componentesService: ComponentesService,
  ) { }


  ngOnInit() {
    this.servicesPrestamo(this.status,null,1,this.pageSize);
    const storedPermissionsCifrado = JSON.parse(this.localServiceS.getItem("permisos"));
    const idRol=storedPermissionsCifrado.idRol;
    if(idRol==12){
      this.menuOption=[
        {name:'Ver Detalle',icon:'manage_search', type:"routerLink"},
      ];
    }
  }
 
  generateRouter(event){
    this.routers=[];
    this.routers.push('/creditos/detalle');
    this.routers.push(event.data["idParticipe"]);
     this.routers.push(event.data["idPrestamo"]);
    this.routers.push('pendiente')
  }

  servicesPrestamo(status,id,page,pageSize){
    this.creditoService.getPrestamosByEstado(status, id,page, pageSize).pipe(
      map((prestamosPendientes:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosPendientes = prestamosPendientes;
        this.dataFondoSource.data = prestamosPendientes.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe( (res) => {}, (error) => {
      this.componentesService.alerta("error", error["error"]["message"]);
      this.isLoading = false
    });
  }
 
  servicesPrestamoBystatus(status,page,pageSize){
    this.creditoService.getTermPrestamoByEstado(status, this.term,page,pageSize).pipe(
      map((prestamosPendientes:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosPendientes = prestamosPendientes
        this.dataFondoSource.data = prestamosPendientes["result"];
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
    if(event.action==="delete"){
      this.anularPrestamo(data.idPrestamo,data.nombre,data.identificacion, data.montoSolicitado)
    }
  }

  anularPrestamo(idPrestamo, nombre, cedula, monto){
    
    Swal.fire({
      title: `¿Deseas anular el préstamo ${idPrestamo} ?`,
      html:
      `<label>Nombre: ${nombre} </label> <br> <label>Cédula: ${cedula} </label> <br> <label>Monto: ${monto} </label> <br> <strong>COMENTARIO OBLIGATORIO</strong>`
      ,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: "#169116",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#911616",
      showLoaderOnConfirm: true,
      preConfirm: (texto) => {
        var elemento = document.getElementById("check");        
        this.creditoService.postAnularPrestamo(idPrestamo, texto, this.authService.getFuncionario()).subscribe(res=>{
          if (res["success"] == true) {
          this.dataComponentes.alerta("success", "Anulado exitosamente").then(()=>{
            location.reload()
          });
          } else {
            this.dataComponentes.alerta("error", "Ocurrió un error al rechazar la solicitud");
          }
        }, error => {
          this.dataComponentes.alerta("error", "Ocurrió un error al rechazar");
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

}
