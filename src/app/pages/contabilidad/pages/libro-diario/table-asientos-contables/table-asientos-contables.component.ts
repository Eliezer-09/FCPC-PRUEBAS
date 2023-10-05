import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { createMask } from '@ngneat/input-mask';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { ToastAlertComponent } from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { FormsService } from 'src/app/services/forms.service';
import { iconfa, iconify } from 'src/static-data/icons';
import { ContabilidadService } from '../../../services/contabilidad.service';
import { ModalAsientoContableComponent } from '../registro/modal-asiento-contable/modal-asiento-contable.component';



@Component({
  selector: 'vex-table-asientos-contables',
  templateUrl: './table-asientos-contables.component.html',
  styleUrls: ['./table-asientos-contables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],

})


export class TableAsientosContablesComponent implements OnInit, AfterViewChecked {
  detalles: any[]=[];

  formAsisentostable: FormGroup;

  icroundDelete       =iconify. icroundDelete ;
  icroundEditNote=iconify.icroundEditNote

  @Input() asientos=[]
  @Output() ResultEmitter =new EventEmitter()
  pageSize = 10;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5,10,25,100];
  form: FormGroup;
  layoutCtrl = new FormControl('fullwidth');
  asientosColumns: any[]= [
    { field: "codigoCuenta", header: "Codigo cuenta" },
    { field: "cuentaContable", header: "Cuenta" },
    { field: "codigoReferencia", header: "Referencia" },
    { field: "debe", header: "Debe" },
    { field: "haber", header: "Haber" },
    { field: "acciones", header: "Acciones" },
  ];

  @Input() idAsientoContable:number;
  totalDebe:number=0;
  totalHaber:number=0;
  showAdd:boolean=true;

  DecimalInputMask = createMask({
    alias: 'numeric',
    groupSeparator: '.',
    digits: 2,
    digitsOptional: true,
    numericInput: true,
    placeholder: "0.00"
  });
  

  dataFondoSource = new MatTableDataSource<any>();
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private formsService: FormsService,
    private dialog : MatDialog,
    private contabilidadService: ContabilidadService,
    private spinner: NgxSpinnerService,
    ) {
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges()
  }

  ngOnInit() {
    this.dataFondoSource.data=this.asientos
  }

  creatFormRows(detalleAsientos?){
    this.formAsisentostable=this.fb.group({})
    if(detalleAsientos) this.detalles.push(detalleAsientos)
    this.detalles.forEach(asientoDetail => {
      let debe="debe"+asientoDetail.idDetalleAsiento;
      let haber="haber"+asientoDetail.idDetalleAsiento;
      this.formAsisentostable.addControl(debe, new FormControl(asientoDetail.debe, [Validators.required,Validators.min(0)]));
      this.formAsisentostable.addControl(haber, new FormControl(asientoDetail.haber, [Validators.required, Validators.min(0)]));
    
    });
    this.recalculartotal()
  }

  resetDetalles(){
    this.detalles=[]
    this.totalDebe=0;
    this.totalHaber=0;
  }

  verifyAsientoForm(formAsiento: FormGroup){
    if(formAsiento.valid){
      this.showAdd=false;
    }else{
      this.showAdd=true;
    }
  }
 
  
  getErrorMessage(element,add_error_messaje?){
    return this.formsService.getErrorMessage(element,add_error_messaje);
  }
 

  getElementErrors() {
    this.formAsisentostable.markAllAsTouched();
    for (let value of Object.keys(this.formAsisentostable.controls)) {
      let  key=value;
      const controlErrors: ValidationErrors = this.formAsisentostable.get(key).errors;
      if (controlErrors != null) {
         let element=document.getElementById(key);
        if(element) element.scrollIntoView({  block: 'center',behavior: 'smooth'  }); 
        try{ new ToastAlertComponent("info", "Verifica los campos");}finally{ /*  */ }
        return true;
      }
    }
    return false;
  }


  recalculartotal(index?, event?, tipo?,field?) {
    this.totalDebe = 0;
    this.totalHaber = 0;
    this.detalles.forEach(res=>{
      this.totalDebe = this.totalDebe + this.setTwoNumberDecimalResult(res.debe)
      this.totalHaber = this.totalHaber+ this.setTwoNumberDecimalResult(res.haber)
    }) 
  }

  setTwoNumberDecimalResult(value) {
      if(value){
        let parseValue=value.toString().replaceAll(',', '')
        return parseFloat(this.formsService.setNumberDecimal(parseValue+'',2));
      }  
      return 0;
  }

  getDetalleAsiento(idAsientoContable:number,page=1,size=10){
    this.contabilidadService.getDetalleAsiento(idAsientoContable,page,size).subscribe(res=>{
      this.detalles=res["result"]
      this.creatFormRows();
      this.spinner.hide();
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    }) 
  }

  deleteDetailAsiento(detalleAsiento:any){
    this.spinner.show();
    let idDetalleAsiento=detalleAsiento.idDetalleAsiento;
    this.contabilidadService.deleteDetalleAsientosContable(idDetalleAsiento).subscribe((res:any)=>{
    this.getDetalleAsiento(this.idAsientoContable)
      this.spinner.hide(); 
    }, error => {
      try{new ToastAlertComponent("error", error.error.message)
    }finally{ this.spinner.hide(); }
    })  
  }


  verifyTotals(){
    return this.totalDebe==this.totalHaber
  }
  verifystatusTotals(){
    if(this.totalDebe!=this.totalHaber) return "badge-danger"
    return ''
  }


  openView(data? ) {
    let action=false;
    if(data) action=true;
    let detalle={
      titulo:"Asiento",
      data: data,
      edit: action
    }
     const dialogRef = this.dialog.open(ModalAsientoContableComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      data: detalle || null
    })
    
    dialogRef
        .afterClosed()
        .subscribe(result => {
        if(result){
          this.ResultEmitter.emit(result)
        }  
    }); 
  }


  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.getDetalleAsiento(this.idAsientoContable,page,size);
  }
}
