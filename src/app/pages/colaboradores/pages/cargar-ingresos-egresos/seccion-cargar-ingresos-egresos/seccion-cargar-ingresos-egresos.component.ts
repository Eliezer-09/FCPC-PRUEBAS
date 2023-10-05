import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { FilesUploadComponent } from 'src/app/components/files-upload/files-upload.component';
import moment from 'moment';
import { MatDatepickerMonthYearComponent } from 'src/app/components/Mat-date-formats/mat-datepicker-month-year/mat-datepicker-month-year.component';
import { DataService } from 'src/app/services/data.service';
import { CreditosService } from 'src/app/pages/creditos/creditos.service';
import { TTHHColaboradorService } from '../../../services/tthh-colaborador.service';
import { CargaIngresosEgresos } from '../../../models/class-colaboradores';


@UntilDestroy()
@Component({
  selector: 'vex-seccion-cargar-ingresos-egresos',
  templateUrl: './seccion-cargar-ingresos-egresos.component.html',
  styleUrls: ['./seccion-cargar-ingresos-egresos.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class SeccionCargarIngresosEgresosComponent implements OnInit {

  date = new FormControl();
  mes:   number
  anio:  number
  infoMessage = "No se ha encontrado ingresos/egresos";
  showNoDataAportes:boolean=false;
  allowCargaAportes: boolean = true;
  habilitarGuardar: boolean = false;
  isLoading:boolean = false;
  fileBase64;
  ingresos_egresos:           any[] = []
  layoutCtrl = new FormControl('fullwidth');
  //ICONOS
  @Output() changeController= new EventEmitter();
  icroundUploadFile=iconify.icroundUploadFile;
  icroundFileUpload= iconify.icroundFileUpload;
  icroundRequestPage=iconify.icroundRequestPage;
  icroundSearch=iconify.icroundSearch;
  DocumentoFormGroup: FormGroup;
  totales = {
    totalPersonal: 0,
    totalAdicional: 0,
    total:0
  };

  selection = new SelectionModel<any>(true, []);
  searchCtrlAprobados = new FormControl();
  @ViewChild(  MatDatepickerMonthYearComponent)   matDatepickerMonthYearComponent;
  @ViewChild(FilesUploadComponent) filesUploadComponent;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private componentesService: ComponentesService,
    private dataService: DataService,
    private fb: FormBuilder,
    private tthhColaboradorService: TTHHColaboradorService
  ) { }

  ngOnInit(): void {
    this.reset();
  }

  setMonthAndYear(event): void {
    if (event) {
        this.date.setValue(event)
        this.mes = event.month() + 1;
        this.anio = event.year();
    } else {
        this.mes = null;
        this.anio = null;
    }
}

confirmFile() {
  const adjuntos = new Promise<string>((resolve, reject) => {
    let fileResultList: Array<File> = this.filesUploadComponent.uploadedFilesList
    if (fileResultList.length == 0) {
        try { new ToastAlertComponent("info", "Debe cargar el archivo")} finally {/*  */};
        resolve("false");
    } else {
        this.DocumentoFormGroup.controls["ctrl"] .setValue(fileResultList);
        this.fileBase64 = this.DocumentoFormGroup.value .ctrl[0];
        resolve("true");
    }
  });
  return  adjuntos.then(value => {return value=="true"});
}

reset(){
  this.DocumentoFormGroup = this.fb.group({
    ctrl: ['', Validators.required]
  });
  this.ingresos_egresos=[];
  this.date.setValue(moment());
  this.mes = this.date.value.month() + 1;
  this.anio = this.date.value.year();
}


generar() {
  this.ingresos_egresos=[]
  this.allowCargaAportes=false;
    this.spinner.show();
      this.confirmFile().then(result => {
          if(result){
            this.totales.totalPersonal = 0;
            this.totales.totalAdicional = 0;
              this.tthhColaboradorService.postCargaBatchIngresoEgreso(
                  this.fileBase64
              ).subscribe((res : any) => {
                this.showNoDataAportes=false;
                const ingresos_egresos_ListResult = res.result;
                  if (ingresos_egresos_ListResult.length>0) {
                      this.habilitarGuardar = true
                      this.ingresos_egresos=ingresos_egresos_ListResult;
                      this.allowCargaAportes=true;
                      this.isLoading = false;
                  }
                  this.spinner.hide();
              }, error => {
                  try {
                      new ToastAlertComponent("error", error.error.message);
                  } finally {
                      this.spinner.hide();
                      this.allowCargaAportes=true;
                  }
              });

          }else {
              try {
                  new ToastAlertComponent(
                      "info",
                      "Debes cargar el documentos de ingresos_egresos"
                  );
              } finally {
                  this.spinner.hide();
                  this.allowCargaAportes=true;
              }
          }
      
      });
}


guardarAportes(dataFondoSource) {
 /*  this.spinner.show();
  this.dataService.getParametroAporteAdicional(IDPARAMETRO).subscribe((res: any) => {
    if (res.success) {
     
      if(res["result"]["valor"]=='1'){
        this.componentesService.alerta(
          "info", "No puedes volver a enviar la solicitud, espere que sea procesada"
        )
        
        this.spinner.hide();
        return;
      } */
      this.solicitarCargaAportes(dataFondoSource)
      
   /*  }
  }, error => {
    try{new ToastAlertComponent("error",  error.error.message);}finally{  this.spinner.hide();}
  }) */ 
}

solicitarCargaAportes(dataFondoSource){
  this.spinner.show();
  let hasError:boolean=false;
  dataFondoSource  = dataFondoSource.map(ingresosEgresos =>{
   if(!ingresosEgresos.isValid) hasError=true;  
  return new CargaIngresosEgresos(ingresosEgresos)});
  
  if(hasError){
    this.spinner.hide();
    return this.componentesService.alerta("error", "No se pueden guardar los datos con errores!")
  } 
  this.tthhColaboradorService.postGuardarCargaBatchIngresoEgreso(dataFondoSource).subscribe((res: any) => {
    this.componentesService.alerta(
      "success", "La solicitud ha sido enviada, usted será notificado cuando haya sido procesada."
    ).then((result) => {
      this.reset();
    /*   this.matDatepickerMonthYearComponent.setMonthAndYear(moment()) */
     /*  this.filesUploadComponent.uploadedFilesList=[]; */
      this.spinner.hide();
      });
 }, error => {
   try{new ToastAlertComponent("error",  error.error.message);}finally{ this.spinner.hide();}
 }) 
} 

}

