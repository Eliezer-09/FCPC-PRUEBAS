import { ChangeDetectorRef, Component, OnInit, ViewChild,AfterViewChecked } from '@angular/core';
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
import { TableColumn }                              from '../../../../@vex/interfaces/table-column.interface';
import { OperationResultPrestamo}                   from '../../../model/models';
import { fadeInRight400ms }                         from 'src/@vex/animations/fade-in-right.animation';
import { InversionesService }                       from '../inversiones.service';
import { NgxSpinnerService }                        from 'ngx-spinner';
import { DatePipe }                                 from '@angular/common';
import Swal                                         from 'sweetalert2';
import { Router }                                   from '@angular/router';
import { ToastAlertComponent }                      from '../../../components/alerts/toast-alert/toast-alert.component';
import { InversionConfigure }                       from 'src/static-data/configure-table/configure-table-inversion';
 

const ELEMENT_DATA: any[] = [{result: ''},]

@UntilDestroy()
@Component({
  selector: 'vex-inversiones-activas',
  templateUrl: './inversiones-activas.component.html',
  styleUrls: ['./inversiones-activas.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],
})
export class InversionesActivasComponent implements OnInit, AfterViewChecked {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado inversiones";
  term = '';
  status="";

  pageSizeOptions: number[] = [5,10,25,100];
  routers :any[]=[];

  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(ELEMENT_DATA);
  searchCtrl = new FormControl();
  layoutCtrl = new FormControl('boxed');

  inversiones: OperationResultPrestamo = {};
  pageEvent: PageEvent;
  filterValue: string = null;


  icroundSearch       = iconify.icroundSearch;
  icroundDiamond      = iconify.icroundDiamond ;
  icroundFileDownload = iconify.icroundFileDownload;
  icroundAdd          =iconify.icroundAdd;
  descargarinversion  =false;
  idAdministrador     = 1;
  esAdministrador     = false;
  fechaCorte;
  idInversionSelect:number;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  tableColumns:   TableColumn<Participe>[] = InversionConfigure;
  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink"},
    {name:'Anular Detalle', icon:'delete', type:"function", accion:"delete"}
  ];

  constructor(
    private inversionesService: InversionesService, 
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private router:             Router,
     ) { }

  ngOnInit() {
    this.servicesInversionesByTerm(1,this.pageSize);
  }
 
  generateRouter(event){
    this.routers=[];
    this.routers.push('/inversiones/detalle');
    this.routers.push(event.data["idInversion"]);
  }

  servicesInversionesByTerm(page,pageSize){
    this.inversionesService.getInversiones(page,pageSize,this.term).pipe(
      map((inversiones:OperationResultParticipe) => {
        this.isLoading = false
        this.inversiones = inversiones
        this.dataFondoSource.data = inversiones["result"];
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
    this.servicesInversionesByTerm(1,this.pageSize);
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesInversionesByTerm(page,size);
  }

  actionMenu(event){
    let data=event.data;
    if(event.action==="edit"){
      window.open( '/inversiones/editar-inversion/'+data.idInversion, '_blank');
    }else if(event.action==="delete"){
      this.anularInversiones(data.idInversion,data.numeroCertificado,data.tipoInversion,data.valorNominal);
    }
  }
  

  add_investments(){
    window.open('/inversiones/registro', '_blank');
  }


  actionAlertAnular(){
     this.spinner.show(); 
          this.inversionesService.deleteInversion(this.idInversionSelect).subscribe(res=>{
            if (res["success"] == true) {
              try{new ToastAlertComponent("success", "Anulado exitosamente la inversión")
            }finally{location.reload();
              this.spinner.hide();
            this.router.navigateByUrl('/inversiones/consultas');
          }
            } 
          }, error => {
            try{new ToastAlertComponent("error", error.error.message)
          }finally{ this.spinner.hide(); }
            
        }) 

  }

  anularInversiones(idInversion,numeroCertificado,tipoInversion:string,valorNominal){
    this.idInversionSelect=idInversion;
    tipoInversion=tipoInversion.toLowerCase();
    const title= `¿Estás seguro que deseas anular la inversión?`;
    const html = `<p>Perderás los datos relacionados</p>
                  <br/>
                  <div style="text-align: initial">
                  <p style="margin: 0rem 1rem 0.5rem 8%"><b>Nº Certificado:&emsp;&emsp;&nbsp;</b>${numeroCertificado} </p>
                  <p style="margin: 0rem 1rem 0.5rem 8%"><b>Tipo de inversión:&emsp;</b>${tipoInversion}</p>
                  <p style="margin: 0rem 1rem 0.5rem 8%"><b>Valor Nominal: &emsp;&emsp;&nbsp;</b>$ ${valorNominal}</p>
                  </div>`;
    this.dialogAlert(title,html);
  }
  
  dialogAlert(title:string,html:any){
    Swal.fire({
      icon: "warning",
      title: title,
      html: html,
      showCancelButton:true,
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Confirmar',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (result) => {
        if(result){
          this.actionAlertAnular();   
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

}

