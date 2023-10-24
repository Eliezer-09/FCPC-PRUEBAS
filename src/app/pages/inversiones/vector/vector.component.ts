import { ChangeDetectorRef, Component, OnInit, ViewChild }      from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators }                              from '@angular/forms';
import { MatDialog }                                            from '@angular/material/dialog';
import { UntilDestroy }                                         from '@ngneat/until-destroy';
import { InversionesService }                                   from '../inversiones.service';
import { fadeInRight400ms }                                     from 'src/@vex/animations/fade-in-right.animation';
import { fadeInUp400ms }                                        from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                                          from 'src/@vex/animations/stagger.animation';
import { iconify,iconfa}                                        from 'src/static-data/icons';
import { ToastAlertComponent }                                  from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { NgxSpinnerService }                                    from 'ngx-spinner';
import moment                                                   from 'moment';
import { BolsaValores, Vector } from 'src/app/model/models';
import { ReplaySubject } from 'rxjs';
import { FilesUploadComponent } from 'src/app/components/files-upload/files-upload.component';
import { DataService } from 'src/app/services/data.service';
@UntilDestroy()
@Component({
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],
  selector: 'vex-vector',
  templateUrl: './vector.component.html',
  styleUrls: ['./vector.component.scss'],
})
export class VectorComponent implements OnInit {
  icroundLineAxis  =iconify.icroundLineAxis
  icroundAutoGraph =iconify.icroundAutoGraph;
  faFileExcel      = iconfa.faFileExcel;
  infoMessage = "No se ha encontrado Vectores relacionados";
  showNoDataVector=false;
  layoutCtrl       = new FormControl('fullwidth');
  seleccionarBolsa = new FormControl('', Validators.required);
  seleccionarTipoRenta= new FormControl('', Validators.required);
  date = new FormControl();

  pageSizeOptions:    number[] = [5, 10, 20];
  selectBolsaValores: BolsaValores[] = [];   
  vectores:           Vector[] = []
  tiposRentas = [
    { id: "F", nombre: "Fija" },
    { id: "V", nombre: "Variable" },
  ];

  isLoading: boolean        = false;
  habilitarGuardar: boolean = false;
  disabled: boolean=false;

  nombreArchivo: string;
  mes:   number
  anio:  number
  excel: File
  filteredTipoRenta:   ReplaySubject<any[]>          = new ReplaySubject<any[]>(1);
  DocumentoFormGroup: FormGroup;
  fileBase64;
  @ViewChild(FilesUploadComponent) filesUploadComponent;
  @ViewChild('toastAlertComponent') toastAlertComponent: ToastAlertComponent;
  constructor(public dialog: MatDialog, private inversionService: InversionesService,
    private changeDetector: ChangeDetectorRef,private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dataService: DataService) { }

  ngAfterViewChecked(): void {
      this.changeDetector.detectChanges()
  }

  ngOnInit(): void {
    this.DocumentoFormGroup = this.fb.group({
        ctrl: ['', Validators.required]
      });
      this.filteredTipoRenta.next( this.tiposRentas.slice())
      this.date.setValue(moment())
      this.mes = this.date.value.month() + 1;
      this.anio = this.date.value.year();
      this.loadBolsaValores();
  }

  selectBolsa(){
    //id bolsa Guayaquil
    if( this.seleccionarBolsa.value==10286){
        this.filterTipoRenta(["F","V"]);
    }else{
        this.filterTipoRenta(["F"]);
    }
  }

  protected filterTipoRenta(codigos:string[]) {
    this.filteredTipoRenta.next(
      this.tiposRentas.filter(renta => codigos.indexOf(renta.id) > -1)
    );
  }

  loadBolsaValores() {
      this.inversionService.getEntidadFinanciera("Bolsa").subscribe((response : BolsaValores[]) => {
              this.selectBolsaValores = response["result"];
      })
  }

  isExcelFormat(file, filename) {
      const filename_body = filename.split(".");
      const extension = filename_body.at(-1);
      if (extension == "xls" || extension == "xlsx") {
          setTimeout(() => {
              this.disabled = false;
              this.nombreArchivo = filename;
              this.excel = file.files.item(0);
          }, 500);
      } else {
          try { 
              new ToastAlertComponent("error", "El formato de excel es incorrecto");
          } finally {
              this.clearFile();
              this.disabled = false;
          }
      }
  }

  confirmFile() {
    const adjuntos = new Promise<string>((resolve, reject) => {
      let fileResultList: Array<File> = this.filesUploadComponent.uploadedFilesList
      if (fileResultList.length == 0) {
          try { new ToastAlertComponent("info", "Debe cargar el archivo de la inversion")} finally {/*  */};
          resolve("false");
      } else {
          this.DocumentoFormGroup.controls["ctrl"] .setValue(fileResultList);
          this.fileBase64 = this.DocumentoFormGroup.value .ctrl[0];
          resolve("true");
      }
    });
    return  adjuntos.then(value => {return value=="true"});
  }

  clearFile() {
      this.nombreArchivo = "";
      this.excel = null;
  }

  upload(event) {
      this.disabled = true;
      if (event.target.files.length > 0) {
          const file = event.target;
          const filename = file.files[0].name;
          this.isExcelFormat(file, filename)
      } else {
          this.disabled = false;
          this.clearFile();
      }
  }

  generar() {
    this.vectores=[]
      this.spinner.show();
        this.confirmFile().then(result => {
            if(result){
                this.inversionService.postCargarVectoresExcel(
                    this.mes,
                    this.anio,
                    this.fileBase64,
                    this.seleccionarBolsa.value,
                    this.seleccionarTipoRenta.value
                ).subscribe((res : any) => {
                  this.showNoDataVector=false;
                    if (res.result.length>0) {
                        this.habilitarGuardar = true
                        this.vectores = res.result;
                        this.isLoading = false;
                    }else{
                      try {
                          this.showNoDataVector=true;
                          new ToastAlertComponent(
                              "info",
                              "No se ha encontrado vectores relacionados."
                          );
                      } finally {
                          this.spinner.hide();
                      }
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
                        "Debes cargar el documentos de vectores"
                    );
                } finally {
                    this.spinner.hide();
                }
            }
        
        });
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

  }