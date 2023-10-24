import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { estadoAsientoContable } from 'src/@vex/interfaces/enums';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { iconify } from 'src/static-data/icons';
import { ContabilidadService } from '../../../services/contabilidad.service';

@Component({
  selector: 'vex-view-asiento',
  templateUrl: './view-asiento.component.html',
  styleUrls: ['./view-asiento.component.scss']
})
export class ViewAsientoComponent implements OnInit {
  layoutCtrl                = new FormControl('boxed');
  icroundAutoStories     = iconify.icroundAutoStories;
  detalleAsientos=[]
  dataAsiento;
  idAsientoContable;
  totalDebe:number=0;
  totalHaber:number=0;
  icroundAttachMoney=iconify.icroundAttachMoney
  pageSize = 20;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [10,20,50,100];
  asientosColumns: any[]= [
    { field: "codigoCuenta", header: "Codigo cuenta" },
    { field: "cuentaContable", header: "Cuenta" },
    { field: "codigoReferencia", header: "Referencia" },
    { field: "debe", header: "Debe" },
    { field: "haber", header: "Haber" },
  ];

  constructor(   private route: ActivatedRoute,
     private contabilidadService: ContabilidadService,
    private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idAsientoContable=params.get("id")
      this.getAsientoContable(this.idAsientoContable)
     
    })
    
  }
  getClassStatus(estado:number){
    let estadoResult="badge-neutro"
    switch (estado) {
      case estadoAsientoContable.Borrador:
        estadoResult= "badge-info"
        break;
      case estadoAsientoContable.Validado:
          estadoResult= "badge-warning"
        break;
      case estadoAsientoContable.Conciliado:
          estadoResult= "badge-success"
        break;
    }
    return estadoResult;
  }

  getStatus(estado:number){
    let estadoResult="Cerrado"
    switch (estado) {
      case estadoAsientoContable.Borrador:
        estadoResult= "Borrador"
        break;
      case estadoAsientoContable.Validado:
          estadoResult= "Validado"
        break;
      case estadoAsientoContable.Conciliado:
          estadoResult= "Conciliado"
        break;
    }
    return estadoResult;
  }

  getAsientoContable(idAsientoContable){
    this.spinner.show()
    this.contabilidadService.getAsientosContableById(idAsientoContable).subscribe(res=>{
      this.dataAsiento=res["result"]
      this.getDetalleAsiento(this.idAsientoContable,1,20)
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }


  getDetalleAsiento(idAsientoContable:number,page=1,size=10){
    this.spinner.show()
    this.contabilidadService.getDetalleAsiento(idAsientoContable,page,size).subscribe(res=>{
      this.detalleAsientos=res["result"]
      this.recalculartotal()
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }

  recalculartotal() {
    this.totalDebe = 0;
    this.totalHaber = 0;
    this.detalleAsientos.forEach(res=>{
      this.totalDebe = this.totalDebe + res.debe
      this.totalHaber = this.totalHaber+ res.haber
    }) 
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.getDetalleAsiento(this.idAsientoContable,page,size);
  }

  verifystatusTotals(){
    if(this.totalDebe!=this.totalHaber) return "badge-danger"
    return ''
  }

}
