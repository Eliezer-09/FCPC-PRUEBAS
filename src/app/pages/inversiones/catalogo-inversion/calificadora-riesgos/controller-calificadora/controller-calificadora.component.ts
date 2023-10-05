import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { InversionesService } from '../../../inversiones.service';
import { FormCalificadoraRiesgosComponent } from '../form-calificadora-riesgos/form-calificadora-riesgos.component';

@Component({
  selector: 'vex-controller-calificadora',
  templateUrl: './controller-calificadora.component.html'
})
export class ControllerCalificadoraComponent implements OnInit {
  idEntidad;
  routerData;
  titleSectionDefault="Crear Calificadora de Riesgo";

  @ViewChild(FormCalificadoraRiesgosComponent) formCalificadoraRiesgosComponent;
  constructor(      private route: ActivatedRoute,
    private router: Router,    
    private inversionesService: InversionesService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getRouterData();
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
      this.agregarCalificadora(dataForm,"actualizado")
    }else{
      this.agregarCalificadora(dataForm,"agregado")
    }
  
  }

  
  agregarCalificadora(data,message) {
    this.spinner.show()
    this.inversionesService.postEntidadFinanciera(data).subscribe(
        (res: any) => {
          if (res.result) {
            this.router.navigate([`/inversiones/catalogos`])
            new ToastAlertComponent("success", `Se ha ${message} la calificadora exitosamente`);
          }
          this.formCalificadoraRiesgosComponent.isSend=false;
          this.spinner.hide()
        },
        (error) => {
          this.spinner.hide()
          this.formCalificadoraRiesgosComponent.isSend=true;
          new ToastAlertComponent("error",  `Ocurrió un error, no se ha ${message} la calificadora`);
        }
      );
  }

}
