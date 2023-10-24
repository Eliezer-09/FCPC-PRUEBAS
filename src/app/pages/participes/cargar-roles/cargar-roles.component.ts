import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { fadeInUp400ms }      from 'src/@vex/animations/fade-in-up.animation';
import { fadeInRight400ms }   from 'src/@vex/animations/fade-in-right.animation';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy} from '@ngneat/until-destroy';
import { iconify } from 'src/static-data/icons';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { FilesUploadComponent } from 'src/app/components/files-upload/files-upload.component';
import moment from 'moment';
import { ParticipesService } from '../participes.service';
import { MatDatepickerMonthYearComponent } from 'src/app/components/Mat-date-formats/mat-datepicker-month-year/mat-datepicker-month-year.component';

@UntilDestroy()
@Component({
  selector: 'vex-cargar-roles',
  templateUrl: './cargar-roles.component.html',
  styleUrls: ['./cargar-roles.component.scss'],
  animations:[
    stagger80ms,
    fadeInUp400ms,
    fadeInRight400ms
  ]
})
export class CargarRolesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  icroundRequestPage=iconify.icroundRequestPage;
  icroundFileUpload=iconify.icroundFileUpload;

  isLoading = false;
  isLoading2 = false;
  aprobados:any[];

  layoutCtrl = new FormControl('fullwidth');
  date = new FormControl();
  mes:   number
  anio:  number
  showNoDataRoles=false;
  habilitarGuardar: boolean = false;
  fileBase64;
  roles:           any[] = []
  DocumentoFormGroup: FormGroup;
  infoMessage = "No se ha encontrado roles";

  @ViewChild(  MatDatepickerMonthYearComponent)   matDatepickerMonthYearComponent;
  @ViewChild(FilesUploadComponent) filesUploadComponent;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private participesService: ParticipesService,
    private fb: FormBuilder,
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

generar() {
  this.roles=[]
    this.spinner.show();
      this.confirmFile().then(result => {
          if(result){
              this.participesService.postCargarExcelRoles(
                  this.fileBase64,
              ).subscribe((res : any) => {
                this.showNoDataRoles=false;
                  if (res.result.length>0) {
                      this.habilitarGuardar = true
                      this.roles = res.result;
                      this.isLoading = false;
                  }
                  this.spinner.hide();
              }, error => {
                  try {
                      new ToastAlertComponent("error", error.error.message);
                  } finally {
                      this.spinner.hide();
                  }
              });

          }else {
              try {
                  new ToastAlertComponent(
                      "info",
                      "Debes cargar el documentos de roles"
                  );
              } finally {
                  this.spinner.hide();
              }
          }
      
      });
}

reset(){
  this.DocumentoFormGroup = this.fb.group({
    ctrl: ['', Validators.required]
  });
  this.roles=[];
  this.date.setValue(moment());
  this.mes = this.date.value.month() + 1;
  this.anio = this.date.value.year();
}

guardarRoles(dataFondoSource) {
  this.spinner.show();
  this.participesService.postGuardarRoles(this.date.value._d,dataFondoSource).subscribe((res: any) => {
   if (res.success) {
     try{new ToastAlertComponent("success", "Se ha cargado los roles de forma exitosa");}finally{
      this.reset();
      this.matDatepickerMonthYearComponent.setMonthAndYear(moment())
      this.filesUploadComponent.uploadedFilesList=[];
      this.spinner.hide();
     }      
   } else {
     try{new ToastAlertComponent("error", res.message);}finally{ this.spinner.hide();}
   }
 }, error => {
   try{new ToastAlertComponent("error",  error.error.message);}finally{ this.spinner.hide();}
 }) 
} 

}
