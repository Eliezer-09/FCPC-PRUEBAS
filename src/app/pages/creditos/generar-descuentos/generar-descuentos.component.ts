import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import icDescription from '@iconify/icons-ic/description';
import icSearch from '@iconify/icons-ic/twotone-search';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icFolder from '@iconify/icons-ic/folder';
import icExcel from '@iconify/icons-fa-solid/file-excel';
import icAssignment from '@iconify/icons-ic/assignment';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { filter, map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { saveAs } from 'file-saver';
import icCheck from '@iconify/icons-fa-solid/check-circle';
import icWarning from '@iconify/icons-ic/warning';
import { CreditosService } from '../creditos.service';
import { LoggerConfig } from 'ngx-logger';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'vex-generar-descuentos',
  templateUrl: './generar-descuentos.component.html',
  styleUrls: ['./generar-descuentos.component.scss'],
  animations:[
    stagger80ms
  ]
})
export class GenerarDescuentosComponent implements OnInit, AfterViewInit, AfterViewChecked {

  //ICONOS
  icDescription = icDescription;
  icSearch = icSearch;
  icDelete = icDelete;
  icFolder = icFolder;
  icExcel = icExcel;
  icAssignment = icAssignment;
  icCheck = icCheck;
  icWarning= icWarning;
  icDoneAll = icDoneAll;
  archivo;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 40, 100];
  pageSizeOptions2: number[] = [10, 20, 40, 100];

  layoutCtrl = new FormControl('fullwidth');
  selection = new SelectionModel<any>(true, []);
  searchCtrlAprobados = new FormControl();
  searchCtrlPrestamos = new FormControl();
  // APROBADOS
  customers2: any[]; 
  dataFondoSource: MatTableDataSource<any> | null;
  prestamosSource: MatTableDataSource<any> | null;
  displayedColumns = ["numeroRegistro","identificacion", "nombre", "codigoUniformado","observaciones"];
  prestamoColumns = ["numeroRegistro","identificacion", "nombre", "detalle", "valor" ];

  // VARIABLES
  isLoading = false;
  isLoading2 = false;
  nombreArchivo;
  dataLoaded = false;
  guardoAutorizados = false;
  aprobados:any[];
  prestamos:any[];
  prestamos2:any[];

  horizontalCargarArchivo: FormGroup;
  horizontalGenerarArchivo: FormGroup;

  @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;

  @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;

  constructor(
    private data: DataService,
    private dataComponentes: ComponentesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private router: Router,
    private spinner: NgxSpinnerService,
    private creditoService: CreditosService,
  ) {

  }

  ngOnInit(): void {
    this.dataFondoSource = new MatTableDataSource();
    this.prestamosSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataFondoSource.paginator = this.tableOnePaginator;
    this.dataFondoSource.sort = this.tableOneSort;
    this.prestamosSource.paginator = this.tableTwoPaginator;
    this.prestamosSource.sort = this.tableTwoSort;
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }

  onFilterChangePrestamo(value: string) {
    if (!this.prestamosSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.prestamosSource.filter = value;
  }

  async cargarExcel(event) {
    const excel = event.target.files.item(0);
    this.archivo = excel;
    const mesActual = this.data.getFechaActual("MM");
    const anioActual = this.data.getFechaActual("yyyy");
    if(event.target.files.length > 0){
      this.spinner.show()
      this.nombreArchivo = event.target.files[0].name
    }

    try {
      await this.creditoService.postCargarExcelAutorizados(excel, anioActual, mesActual).pipe(
        map((res: any) =>{
          if(res["success"] == true){
            this.aprobados = [];
            this.aprobados = res["result"];
            this.dataLoaded = true;
            this.isLoading = false;
            this.dataFondoSource.data = res["result"]
            this.spinner.hide()
          }else{
            this.isLoading = false;
            this.dataComponentes.alerta("error", "El formato del archivo excel es incorrecto para este proceso")
            this.spinner.hide()
          }
        })
      ).subscribe();
  
      this.searchCtrlAprobados.valueChanges.pipe(
        untilDestroyed(this)
      ).subscribe(value => this.onFilterChange(value));
    } catch (error) {
      this.dataComponentes.alerta("error", "El formato del archivo excel es incorrecto u ocurrió un problema interno")
      this.spinner.hide()
    }
    

  }

  onFilterChange(value: string) {
    if (!this.dataFondoSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataFondoSource.filter = value;
  }

  generarTxt(){
    const mesActual = this.data.getFechaActual("MM");
    const anioActual = this.data.getFechaActual("yyyy");
    if(this.aprobados != undefined){
      this.spinner.show();
      this.creditoService.getInfoAutorizados(anioActual, mesActual).subscribe(response =>{
        saveAs(response, "Descuentos Autorizados " + mesActual + "-" + anioActual + ".txt")
        this.spinner.hide()
      }, error =>{
        this.dataComponentes.alerta("error", error["statusCode"]);
        this.spinner.hide()
      })
    }else{
      this.dataComponentes.alerta("error", "Debe cargar un excel para generar");
      this.spinner.hide()
    }
  }

  guardar(){
    const mesActual = this.data.getFechaActual("MM");
    const anioActual = this.data.getFechaActual("yyyy");
    if(this.aprobados != undefined){
      this.spinner.show()
      var request={
        "anio": anioActual,
        "mes": mesActual,
        "autorizados":this.aprobados,
      };

      try {
        this.creditoService.postGuardarAutorizados(request).pipe(
          map((res: any) =>{
            if(res["success"] == true){
              this.prestamos = res["result"]
              this.prestamosSource.data = res["result"];
              this.snackbar.open('Se ha generado correctamente información de autorizados', null, {
                horizontalPosition: "right",
                duration: 5000
              });    
              this.guardoAutorizados = true;
              this.spinner.hide()
            }else{
              this.prestamos = [];
              this.dataComponentes.alerta("error", res["message"])
              this.spinner.hide()
            }
          })
        ).subscribe();
        this.searchCtrlPrestamos.valueChanges.pipe(
          untilDestroyed(this)
        ).subscribe(value => {
          this.onFilterChangePrestamo(value)
        });
      } catch (error) {
        this.dataComponentes.alerta("error", error["message"]);
        this.spinner.hide()
      }
      
    }else{
      this.dataComponentes.alerta("error", "Debe cargar un excel para guardar");
      this.spinner.hide()
    }
  }

}
