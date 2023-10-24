import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { InversionesService } from '../../../inversiones.service';
import { FormEmisorComponent } from '../form-emisor/form-emisor.component';

@Component({
  selector: 'vex-controller-emisor',
  templateUrl: './controller-emisor.component.html'
})
export class ControllerEmisorComponent implements OnInit {
  idEntidad;
  routerData;
  titleSectionDefault="Crear Emisor";
  @ViewChild(FormEmisorComponent) formEmisorComponent;
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
      this.agregarEmisor(dataForm,"actualizado")
    }else{
      this.agregarEmisor(dataForm,"agregado")
    }
  
  }

  
  agregarEmisor(data,message) {
    this.spinner.show()
    this.inversionesService.postEntidadFinanciera(data).subscribe(
        (res: any) => {
          if (res.result) {
            this.router.navigate([`/inversiones/catalogos`])
            new ToastAlertComponent("success", `Se ha ${message} el emisor exitosamente`);
          }
          this.formEmisorComponent.isSend=false;
          this.spinner.hide()
        },
        (error) => {
          this.spinner.hide()
          this.formEmisorComponent.isSend=true;
          new ToastAlertComponent("error",  `Ocurrió un error, no se ha ${message} el emisor`);
        }
      );
  }
  
}
