import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { InversionesService } from '../../../inversiones.service';
import { FormCasaValorComponent } from '../form-casa-valor/form-casa-valor.component';

@Component({
  selector: 'vex-controller-casa-valor',
  templateUrl: './controller-casa-valor.component.html'
})
export class ControllerCasaValorComponent implements OnInit,AfterViewChecked  {
  idEntidad;
  routerData;
  titleSectionDefault="Crear Casa de Valor";
  @ViewChild(FormCasaValorComponent) formCasaValorComponent;
  constructor( private route: ActivatedRoute,
    private router: Router,    
    private inversionesService: InversionesService,
    private spinner: NgxSpinnerService,
    private changeDetectorRefs:  ChangeDetectorRef, ) { }

  ngOnInit(): void {
    this.getRouterData();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  getRouterData(){
    this.route.paramMap.subscribe(params => {
      this.idEntidad=params.get("id")
    })
    this.route.data.subscribe(data => {
      this.routerData=data
    })
    this.titleSectionDefault=this.routerData.title || this.titleSectionDefault
  }

  
  actionMode(dataForm){
    if(this.routerData.allowEdit==true){
      this.agregarCasa(dataForm,"actualizado")
    }else{
      this.agregarCasa(dataForm,"agregado")
    }
  
  }

  
  agregarCasa(data,message) {
    this.spinner.show()
    this.inversionesService.postEntidadFinanciera(data).subscribe(
        (res: any) => {
          if (res.result) {
            this.router.navigate([`/inversiones/catalogos`])
            new ToastAlertComponent("success", `Se ha ${message} la casa de valor exitosamente`);
          }
          this.formCasaValorComponent.isSend=false;
          this.spinner.hide()
        },
        (error) => {
          this.spinner.hide()
          this.formCasaValorComponent.isSend=true;
          new ToastAlertComponent("error",  `Ocurrió un error, no se ha ${message} la casa de valor`);
        }
      );
  }

}
