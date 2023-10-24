import { Component, Inject, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MAT_DIALOG_DATA }                                        from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators }                   from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE}           from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS}       from '@angular/material-moment-adapter';
import moment                                                     from 'moment';
import { CalificacionEmisor }                                     from 'src/app/model/models';
import { FormsService }                                           from 'src/app/services/forms.service';
import { ToastAlertComponent }                                    from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { InversionesService }                                     from '../../inversiones.service';
import { ReplaySubject, Subject }                                 from 'rxjs';
import { takeUntil }                                              from 'rxjs/operators';
import { NgxSpinnerService }                                      from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';

export const MY_FORMATS = {
  parse: {
      dateInput: 'yyyy-MM-ddTHH:mm:ssZ'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM-YYYY'
  }
};

@Component({
  selector: 'vex-calificacion-emisor',
  templateUrl: './calificacion-emisor.component.html',
  styleUrls: ['./calificacion-emisor.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class CalificacionEmisorComponent implements OnInit, AfterViewChecked {

  calificacionEmisorFilterCtrl: FormControl = new FormControl();
  calificadoraFilterCtrl: FormControl = new FormControl();
  filteredCalificaciones: ReplaySubject<CalificacionEmisor[]> = new ReplaySubject<CalificacionEmisor[]>(1);
  filteredCalificadoras: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();

  calificaciones = [];
  calificadoras = [];
  dataEmisor;
  fechaMinima = moment().subtract(5, "years").format("YYYY-MM-DD");
  currentDate =  moment();
  today = new Date(); 

  RequeredRule:  any[]=[Validators.required];

  formCalificarEmisor = this.fb.group({
    idEmisor :                ['', this.RequeredRule],
    idCalificadora:           ['', this.RequeredRule],
    idCalificacionFinanciera: ['', this.RequeredRule],
    fechaCalificacion:        [this.currentDate, this.RequeredRule],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
    private inversionServices: InversionesService,
    private formsService: FormsService,    
    private fb: FormBuilder,
    private dataServices: DataService,
    private spinner: NgxSpinnerService,
    ) { }

  ngAfterViewChecked() {
    this.changeDetectorRefs.detectChanges();
  }
  
  ngOnInit() {
    this.formCalificarEmisor.controls["idEmisor"].setValue(this.data["idEntidad"])
    this.getCalificadoras();
    this.getCalificaciones();
    this.getCalificacionEmisorById(this.data["idEntidad"])
  }

  protected filterCalificaciones() {
    if (!this.calificaciones) {
      return;
    }
    let search = this.calificacionEmisorFilterCtrl.value;
    if (!search) {
      this.filteredCalificaciones.next(this.calificaciones.slice());
      return;
    } else {
      search = search.toLowerCase(); 
    }
    this.filteredCalificaciones.next(
      this.calificaciones.filter(calificacion => calificacion.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCalificadoras() {
    if (!this.calificadoras) {
      return;
    }
    let search = this.calificadoraFilterCtrl.value;
    if (!search) {
      this.filteredCalificadoras.next(this.calificadoras.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCalificadoras.next(
      this.calificadoras.filter(calificadora => calificadora.razonSocial.toLowerCase().indexOf(search) > -1)
    );

  }

  getCalificadoras(){
    this.inversionServices.getEntidadFinancieraLite("calificadora").subscribe((res: any) => {
      this.calificadoras = res.result;
      this.filteredCalificadoras.next(this.calificadoras.slice());
      this.calificadoraFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCalificadoras();
      });
    })
  }

  getCalificaciones(){
    this.dataServices.getCalificacionesFinancieras().subscribe((res: any) => {
      this.calificaciones = res.result;
      this.filteredCalificaciones.next(this.calificaciones.slice());
      this.calificacionEmisorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCalificaciones();
      });
    })
  }

  getCalificacionEmisorById(idEmisor){
    this.spinner.show();
    this.inversionServices.getCalificacionEmisorActual(idEmisor).subscribe((res: any) => {
      this.dataEmisor = res.result;
      this.formCalificarEmisor.controls["idCalificadora"].setValue(this.dataEmisor["idCalificadora"])
      this.formCalificarEmisor.controls["idCalificacionFinanciera"].setValue(this.dataEmisor["idCalificacionFinanciera"])
      this.formCalificarEmisor.controls["fechaCalificacion"].setValue(this.dataEmisor["fechaCalificacion"])
      
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }

  AsignarCalificacionEmisor() {
    if(this.formCalificarEmisor.valid){
      this.spinner.show();

      const idEmisor=this.formCalificarEmisor.value.idEmisor;

      this.inversionServices.postCalificacionEmisor(idEmisor, this.formCalificarEmisor.value).subscribe(res => {
        this.spinner.hide();
        try{
          new ToastAlertComponent("success", "Asignación de calificación");       
        }finally{
          this.spinner.hide();
        }
        setTimeout(function(){
          location.reload(); 
        }, 1500);
      }, error => {
          try{
            new ToastAlertComponent("error", error.error.message);      
          }finally{
            this.spinner.hide();
          }
          
      }); 
    }else{
      try{ new ToastAlertComponent("info", "Ingrese todos los campos.");      }finally{ /* */}  
      }
    }
}
