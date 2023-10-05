import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import icDescription from '@iconify/icons-ic/description';
import icSearch from '@iconify/icons-ic/twotone-search';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icFolder from '@iconify/icons-ic/folder';
import icExcel from '@iconify/icons-fa-solid/file-excel';
import icCheck from '@iconify/icons-fa-solid/check-circle';
import icError from '@iconify/icons-ic/highlight-off';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ComponentesService } from 'src/app/services/componentes.service';
import { CreditosService } from '../../creditos/creditos.service';
import { saveAs } from 'file-saver';
import { iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { FilesUploadComponent } from 'src/app/components/files-upload/files-upload.component';
import moment from 'moment';
import { MatDatepickerMonthYearComponent } from 'src/app/components/Mat-date-formats/mat-datepicker-month-year/mat-datepicker-month-year.component';
import { DataService } from 'src/app/services/data.service';
import { IDPARAMETRO } from '../constant/aporteAdicional';
import * as _moment                           from 'moment';
import {default as _rollupMoment}     from 'moment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}     from '@angular/material/core';
import { MY_FORMATS } from '../../colaboradores/utils/my-date-form';

@UntilDestroy()
@Component({
  selector: 'vex-cargar-aportes',
  templateUrl: './cargar-aportes.component.html',
  styleUrls: ['./cargar-aportes.component.scss'],
  animations:[
    stagger80ms
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class CargarAportesComponent implements OnInit {

  date = new FormControl();
  today=new Date
  mes:   number
  anio:  number
  infoMessage = "No se ha encontrado aportes";
  showNoDataAportes:boolean=false;
  allowCargaAportes: boolean = true;
  habilitarGuardar: boolean = false;
  isLoading:boolean = false;
  fileBase64;
  aportes:           any[] = []
  layoutCtrl = new FormControl('fullwidth');
  //ICONOS
  icroundUploadFile=iconify.icroundUploadFile;
  icroundFileUpload= iconify.icroundFileUpload;
  icroundRequestPage=iconify.icroundRequestPage;
  DocumentoFormGroup: FormGroup;
  totales = {
    totalPersonal: 0,
    totalAdicional: 0,
    total:0
  };

  selection = new SelectionModel<any>(true, []);
  searchCtrlAprobados = new FormControl();
/*   @ViewChild(  MatDatepickerMonthYearComponent)   matDatepickerMonthYearComponent; */
  @ViewChild(FilesUploadComponent) filesUploadComponent;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
    private componentesService: ComponentesService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.reset();
  }

  setMonthAndYear(event): void {
    if (event) {
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
  this.aportes=[];
  this.date.setValue(moment());
  this.mes = this.date.value.month() + 1;
  this.anio = this.date.value.year(); 
}


generar() {
  this.aportes=[]
  this.allowCargaAportes=false;
    this.spinner.show();
      this.confirmFile().then(result => {
          if(result){
            this.totales.totalPersonal = 0;
            this.totales.totalAdicional = 0;
              this.creditoService.postCargarExcelAportes(
                  this.fileBase64,this.anio, this.mes
              ).subscribe((res : any) => {
                this.showNoDataAportes=false;
                const aportesResult = res.result;
                const aportesListResult =aportesResult["aportesInfo"];
                  if (aportesListResult.length>0) {
                      this.habilitarGuardar = true
                      this.totales.totalPersonal += aportesResult.totalAportePersonal;
                      this.totales.totalAdicional += aportesResult.totalAporteAdicional;
                      this.totales.total = this.totales.totalPersonal + this.totales.totalAdicional;
                      this.aportes=aportesListResult;
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
                      "Debes cargar el documentos de aportes"
                  );
              } finally {
                  this.spinner.hide();
                  this.allowCargaAportes=true;
              }
          }
      
      });
}


guardarAportes(dataFondoSource) {
  this.spinner.show();
  this.dataService.getParametroAporteAdicional(IDPARAMETRO).subscribe((res: any) => {
    if (res.success) {
     
      if(res["result"]["valor"]=='1'){
        this.componentesService.alerta(
          "info", "No puedes volver a enviar la solicitud, espere que sea procesada"
        )
        
        this.spinner.hide();
        return;
      }
      this.solicitarCargaAportes(dataFondoSource)
      
    }
  }, error => {
    try{new ToastAlertComponent("error",  error.error.message);}finally{  this.spinner.hide();}
  }) 
}

solicitarCargaAportes(dataFondoSource){
  this.spinner.show();
  const fecha=this.date.value._d
  this.creditoService.postGuardarAportes(dataFondoSource,fecha).subscribe((res: any) => {
    this.componentesService.alerta(
      "success", "La carga de aporte ha sido guarda con éxito."
    ).then((result) => {
      this.reset();
    /*   this.matDatepickerMonthYearComponent.setMonthAndYear(moment()) */
      this.filesUploadComponent.uploadedFilesList=[];
      this.spinner.hide();
      });
 }, error => {
   try{new ToastAlertComponent("error",  error.error.message);}finally{ this.spinner.hide();}
 })  
} 
}

