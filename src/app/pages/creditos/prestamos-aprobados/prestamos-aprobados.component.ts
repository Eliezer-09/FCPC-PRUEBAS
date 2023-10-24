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
import { OperationResultPrestamo } from '../../../model/models';
import Swal                                         from 'sweetalert2';
import { CreditosService }                          from '../creditos.service';
import { AuthService }                              from '../../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ModalPagareFirmadoComponent } from '../modal-pagare-firmado/modal-pagare-firmado.component';
import { ModalAcreditacionComponent } from './componentes/modal-acreditacion/modal-acreditacion.component';
import { Router } from '@angular/router';


const ELEMENT_DATA: any[] = [
  {
    result: ''
  },

]
@UntilDestroy()
@Component({
  selector: 'vex-prestamos-aprobados',
  templateUrl: './prestamos-aprobados.component.html',
  styleUrls: ['./prestamos-aprobados.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class PrestamosAprobadosComponent implements OnInit {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado créditos aprobados";
  term = '';
  status="Aprobado";
  layoutCtrl = new FormControl('boxed');
  pageSizeOptions: number[] = [5,10,25,100];
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  prestamosAprobados: OperationResultPrestamo = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  routers :any[]=[];

  icroundSearch        = iconify.icroundSearch;
  icroundGavel       = iconify.icroundGavel ;
  
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
    {name:'Firmar Documento',icon:'edit_note', type:"routerLink", accion:"firmar"},
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink", accion:"ver"},
    {name:'Anular Detalle', icon:'delete', type:"function", accion:"delete"}
  ];

  constructor(
    private data: DataService,
    private creditoService: CreditosService,
    private dataComponentes: ComponentesService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private router: Router,
    private componentesService: ComponentesService,
  ) { }


  ngOnInit() {
    this.servicesPrestamo(this.status,null,1,this.pageSize);
  }
 

  generateRouter(event){
    this.routers=[];
    const data=event.data;
    if(event.action==="firmar"){
      this.routers.push('/creditos/legalizar');
      this.routers.push(data["idPrestamo"]);
    }else if(event.action==="ver"){
      this.routers.push('/creditos/detalle');
      this.routers.push(data["idParticipe"]);
      this.routers.push(data["idPrestamo"]);
      this.routers.push('aprobado')
    }
  }

  servicesPrestamo(status,id,page,pageSize){
    this.creditoService.getPrestamosByEstado(status, id,page, pageSize).pipe(
      map((prestamosAprobados:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosAprobados = prestamosAprobados;
        this.dataFondoSource.data = prestamosAprobados.result;
        this.changeDetector.detectChanges()
      })
    ).subscribe();
  }

  servicesPrestamoBystatus(status,page,pageSize){
    this.creditoService.getTermPrestamoByEstado(status, this.term,page,pageSize).pipe(
      map((prestamosAprobados:OperationResultParticipe) => {
        this.isLoading = false
        this.prestamosAprobados = prestamosAprobados
        this.dataFondoSource.data = prestamosAprobados["result"];
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

  getPagare(id) {
    this.spinner.show();
    this.creditoService.getPrestamosPagareById(id).subscribe( res => {
      this.spinner.hide();
      var link = document.createElement('a');
      link.setAttribute('download', "pagare");
      link.style.display = 'none';
      document.body.appendChild(link);
      window.open(res["changingThisBreaksApplicationSecurity"]);
      document.body.removeChild(link);
    }, error => {
    });
  }

  getDebito(id) {
    this.spinner.show();
    this.creditoService.getPrestamoAutorizacionDebitoById(id).subscribe( res => {
      this.spinner.hide();
      var link = document.createElement('a');
      link.setAttribute('download', "debitos");
      link.style.display = 'none';
      document.body.appendChild(link);
      // link.setAttribute('href',res["changingThisBreaksApplicationSecurity"]);
      // link.click();
      window.open(res["changingThisBreaksApplicationSecurity"]);
      document.body.removeChild(link);
    }, error => {
    });
  }

  firmarPagare(id) {
    const dialogRef = this.dialog.open(ModalPagareFirmadoComponent, {
      width: '50%',
      autoFocus: false,
      height: '75%',
      // maxHeight: '80vh',
      data: {data: id}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  transferir() {
    const dialogRef = this.dialog.open(ModalAcreditacionComponent, {
      width: '40%',
      autoFocus: false,
      height: '20%',
      // maxHeight: '80vh',
      data: {data: "transferir"}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  tab(tab) {
    switch(tab["index"]) {
      case 0: {
        break;
      };
      case 1: {
        break;
      };
      case 2: {
        break;
      };
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
        this.creditoService.postRechazarPrestamo(idPrestamo, texto, this.authService.getFuncionario()).subscribe(res=>{
          if (res["success"] == true) {
          this.router.navigateByUrl('/creditos/pendientes');
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