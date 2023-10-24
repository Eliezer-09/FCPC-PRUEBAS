import { ChangeDetectorRef, Component, OnInit, ViewChild,AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup }                              from '@angular/forms';
import { MatPaginator, PageEvent }                  from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy }                             from '@ngneat/until-destroy';
import { map }                                      from 'rxjs/operators';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify}                                   from 'src/static-data/icons';
import { OperationResultParticipe, OperationResultPrestamo, Participe }      from 'src/app/model/models';


import { fadeInRight400ms }                         from 'src/@vex/animations/fade-in-right.animation';

import { NgxSpinnerService }                        from 'ngx-spinner';
import { DatePipe, formatDate }                                 from '@angular/common';
import Swal                                         from 'sweetalert2';
import { ActivatedRoute, Router }                                   from '@angular/router';

import { InversionConfigure }                       from 'src/static-data/configure-table/configure-table-inversion';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { InversionesService } from 'src/app/pages/inversiones/inversiones.service';
import { AsientoConfigure } from 'src/static-data/configure-table/contabilidad/configure-table-contabilidad';
import { ContabilidadService } from '../../../../services/contabilidad.service';
 

const ELEMENT_DATA: any[] = [{result: ''},]

@UntilDestroy()
@Component({
  selector: 'vex-table-libro-diario-borrador',
  templateUrl: './table-libro-diario-borrador.component.html',
  styleUrls: ['./table-libro-diario-borrador.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],
})
export class TableLibroDiarioBorradorComponent implements OnInit, AfterViewChecked {
  icroundDelete       =iconify. icroundDelete ;
  icroundSearch       = iconify.icroundSearch;
  icroundAutoStories  = iconify.icroundAutoStories ;
  icroundAdd          =iconify.icroundAdd;

  searchCtrl = new FormControl();
  layoutCtrl = new FormControl('boxed');
  pageEvent: PageEvent;
  pageSize = 10;
  pageSizeOptions: number[] = [5,10,25,100];
  isLoading = true;
  infoMessage = "No se ha encontrado Asientos";
  term = '';
  routers :any[]=[];
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(ELEMENT_DATA);
  asientos= [];
  filterValue: string = null;
  busquedaAvanzada: boolean = false;
  idInversionSelect:number;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  filters={
    desde:null,
    hasta:null
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  tableColumns:   TableColumn<Participe>[] = AsientoConfigure;
  menuOption=[
    {name:'Ver Detalle',icon:'manage_search', type:"routerLink",accion:"view"},
    {name:'Editar Detalle',icon:'edit', type:"function",accion:"edit"},
    {name:'Anular Detalle', icon:'delete', type:"function", accion:"delete"}
  ];

  constructor(
    private contabilidadService: ContabilidadService, 
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private router: Router,
    private routerActive: ActivatedRoute,
     ) { }

  ngOnInit() {
    this.servicesInversionesByTerm(1,this.pageSize);
  }
 

  generateRouter(event){
    this.routers=[];
      if(event.action==="view"){
        this.routers.push('/contabilidad/ver-asiento-contable');
        this.routers.push(event.data["idAsientoContable"]);
     }
  }

  servicesInversionesByTerm(page,pageSize,filters?){
    this.contabilidadService.getAsientosContablesByTerm("Borrador",page,pageSize,this.term,filters).pipe(
      map((asientos:any) => {
        this.isLoading = false
        this.asientos = asientos
        this.dataFondoSource.data = asientos["result"];
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

  searchTerm(term: string,filters?) {
    this.isLoading = true;
    this.term=term || ''
    this.servicesInversionesByTerm(1,this.pageSize,filters);
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
    this.router.navigate(['/contabilidad/editar-diario-contable'], { relativeTo: this.routerActive, queryParams:  { asiento:event.data["idAsientoContable"]} });
      }else if(event.action==="delete"){

        this.anularAsientoContable(data.idAsientoContable,data.numeroSerie,data.numeroControl);
      }
  }
  

  add_investments(){
    window.open('/inversiones/registro', '_blank');
  }


  actionAlertAnular(){
     this.spinner.show(); 
          this.contabilidadService.deleteAsientosContable(this.idInversionSelect).subscribe(res=>{
            if (res["success"] == true) {
              try{new ToastAlertComponent("success", "Anulado exitosamente el Asiento Contable")
            }finally{setTimeout(() => {
              location.reload();
              this.spinner.hide();
            }, 500); 
          }
            } 
          }, error => {
            try{new ToastAlertComponent("error", error.error.message)
          }finally{ this.spinner.hide(); }
            
        }) 

  }

  anularAsientoContable(idAsientoContable,numeroSerie,numeroControl){
    this.idInversionSelect=idAsientoContable;
    const title= `¿Estás seguro que deseas anular el Asiento Contable?`;
    const html = `<p>Perderás los datos relacionados</p>
                  <br/>
                  <div style="text-align: initial">
                  <p style="margin: 0rem 1rem 0.5rem 8%"><b>Nº Serie:&emsp;&emsp;&nbsp;</b>${numeroSerie} </p>
                  <p style="margin: 0rem 1rem 0.5rem 8%"><b>Nº Control:&emsp;</b>${numeroControl}</p>
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


  cambiarAvanzado(event) {
    this.busquedaAvanzada = event;
  }

  cleanFilters(){
    this.filters={
      desde:null,
      hasta:null
    }
    this.range.reset();
    this.servicesInversionesByTerm(1, 10)
  }

  async searchRangeDate(desde?, hasta?){
    const range = await this. promiseRange(desde, hasta);
    this.filters.desde=range?.fechaDesde || null;
    this.filters.hasta=range?.fechaHasta || null;
    this.searchTerm(this.filterValue,this.filters);
  }

  promiseRange = async(desde, hasta):  Promise<Record<string, number | string>> => {
    const response = await this.formatDate(desde, hasta);
    return response
  }

  formatDate(desde?, hasta?) {
    let range;
    if (desde && hasta) {
      const fechaDesde = formatDate(desde, "yyyy-MM-dd", "en-US");
      const fechaHasta = formatDate(hasta, "yyyy-MM-dd", "en-US");
      range={"fechaDesde": fechaDesde,"fechaHasta":  fechaHasta}
    }
    return range;
  }

}

