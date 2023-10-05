import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import icDescription from '@iconify/icons-ic/description';
import icSearch from '@iconify/icons-ic/twotone-search';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icFolder from '@iconify/icons-ic/folder';
import icExcel from '@iconify/icons-fa-solid/file-excel';
import icDownload from '@iconify/icons-fa-solid/download';
import icSave from '@iconify/icons-fa-solid/save';
import icCheck from '@iconify/icons-fa-solid/check-circle';
import icError from '@iconify/icons-ic/highlight-off';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ComponentesService } from 'src/app/services/componentes.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import { CreditosService } from '../creditos.service';
import * as XLSX from 'xlsx';
@UntilDestroy()
@Component({
  selector: 'vex-cargar-descuentos',
  templateUrl: './cargar-descuentos.component.html',
  styleUrls: ['./cargar-descuentos.component.scss'],
  animations: [
    stagger80ms
  ]
})
export class CargarDescuentosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //ICONOS
  icDescription = icDescription;
  icSearch = icSearch;
  icDelete = icDelete;
  icFolder = icFolder;
  icExcel = icExcel;
  icDownload = icDownload;
  icSave = icSave;
  icCheck = icCheck;
  icError = icError;

  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 40, 100];

  pageSize2 = 10;
  pageSizeOptions2: number[] = [5, 10, 20];

  layoutCtrl = new FormControl('fullwidth');
  selection = new SelectionModel<any>(true, []);
  searchCtrlAprobados = new FormControl();

  // APROBADOS
  subject2$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data2$: Observable<any[]> = this.subject2$.asObservable();
  customers2: any[];
  dataFondoSource: any | null;

  displayedColumns = ["identificacion", "nombre", "valor", "noAplicado", "total", "observaciones"];

  // VARIABLES
  isLoading = false;
  nombreArchivo;
  descuentos: any[];
  dataLoaded = false;
  excel;


  constructor(
    private data: DataService,
    private creditoService: CreditosService,
    private componentService: ComponentesService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {

  }

  ngOnInit(): void {

    this.dataFondoSource = new MatTableDataSource();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    this.dataFondoSource.paginator = this.paginator;
    this.dataFondoSource.sort = this.sort;
  }

  onFilterChangeAprobado(value: string) {
    if (!this.dataFondoSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataFondoSource.filter = value;
  }

  onFilterChange(value: string) {
    if (!this.dataFondoSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataFondoSource.filter = value;
  }

  upload(event) {
    this.excel = event.target.files.item(0);
    const mesActual = this.data.getFechaActual("MM");
    const anioActual = this.data.getFechaActual("yyyy");
    if (event.target.files.length > 0) {
      this.isLoading = true;
      this.nombreArchivo = event.target.files[0].name
      this.changeDetectorRefs.detectChanges()
    }

    this.creditoService.postCargarExcelDescuentos(this.excel).subscribe(res => {

      if (res["success"] == true) {
        this.descuentos = [];
        this.descuentos = res["result"];
        this.subject2$.next(this.descuentos);
        this.dataLoaded = true;
        this.isLoading = false;

        this.data2$.pipe(
          filter<any[]>(Boolean)
        ).subscribe(result => {
          this.customers2 = result;
          this.dataFondoSource.data = result;
        });

        this.searchCtrlAprobados.valueChanges.pipe(
          untilDestroyed(this)
        ).subscribe(value => this.onFilterChange(value));
      } else {
        this.isLoading = false;
      }
    }, error => {
      this.componentService.alerta("error", error.error.message);
      this.spinner.hide();
    })
  }

  guardarDecuentos() {
    if (this.descuentos == undefined) {
      this.componentService.alerta("error", "No se ha cargado ningun archivo");
    } else {
      var data = {
        abonos: this.descuentos
      };

      this.spinner.show();
      this.creditoService.postGuardarDescuentos(data).subscribe(response => {
        if (response["success"] == true) {
          this.isLoading = false;
          this.componentService.alerta("success", "Descuentos Guardados!");
          this.spinner.hide();
        } else {
          this.isLoading = false;
          this.componentService.alerta("error", response["message"]);
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
        this.componentService.alerta("error", error.error.message);
      });
    }
  }

  // exportarExcel(exporter){
  //   if(this.descuentos == undefined){
  //     this.componentService.alerta("error", "No se ha cargado ningun archivo");
  //   }else{
  //     exporter.exportTable('xls', {fileName:'Autorizados Cargados'});
  //   }
  // }

  exportarExcel() {
    if (this.descuentos != undefined) {
      const array = [];
      this.descuentos.forEach(res => {
        res.detalles.forEach((detalle: any) => {
          const objeto = {
            identificacion: res.identificacion,
            nombre: res.nombre,
            valor: res.valor,
            observaciones: res.observaciones,
            saldo: res.saldo,
            total: res.total,
            cuota: detalle.cuota,
            capital: detalle.capital,
            interes: detalle.interes,
            desgravamen: detalle.desgravamen,
            mora: detalle.mora,
            totalDetalle: detalle.total,
            saldoDetalle: detalle.saldo,
          }
          array.push(objeto)
        })
      })
      const workSheet = XLSX.utils.json_to_sheet(array);
      const workBook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
      XLSX.writeFile(workBook, 'Autorizados Cargados.xlsx');
    } else {
      this.componentService.alerta("error", "No se ha cargado ningun archivo");
    }

  }

}
