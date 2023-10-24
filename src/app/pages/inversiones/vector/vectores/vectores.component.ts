import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { FormControl }                              from '@angular/forms';
import { MatPaginator }                             from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy, untilDestroyed }             from '@ngneat/until-destroy';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify,iconfa}                            from 'src/static-data/icons';
import { ComponentesService }                       from 'src/app/services/componentes.service';
import { TableColumn }                              from '../../../../../@vex/interfaces/table-column.interface';
import { fadeInRight400ms }                         from 'src/@vex/animations/fade-in-right.animation';
import { InversionesService }                       from '../../inversiones.service';
import { Vector }                                   from 'src/app/model/models';
import { ToastAlertComponent }                      from 'src/app/components/alerts/toast-alert/toast-alert.component';
import { Observable, ReplaySubject }                from 'rxjs';
import { filter }                                   from 'rxjs/operators';
import { I } from '@angular/cdk/keycodes';
import { VectoresFijoConfigure, VectoresVariableConfigure } from 'src/static-data/configure-table/configure-table-vector';

@UntilDestroy()
@Component({
  selector: 'vex-vectores',
  templateUrl: './vectores.component.html',
  styleUrls: ['./vectores.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VectoresComponent implements OnInit,AfterViewInit{
  @Input() dataFondoSource: Vector[] = [];
  @Input() isLoading: boolean;
  @Input() habilitarGuardar: boolean;
  @Input() tipoRenta: string;
  subject$: ReplaySubject<Vector[]> = new ReplaySubject<Vector[]>(1);
  data$: Observable<any> = this.subject$.asObservable();
  searchCtrl = new FormControl();
  layoutCtrl = new FormControl('boxed');
  dataSource: MatTableDataSource<Vector> | null;
  pageSize = 10;
  infoMessage = "No se ha encontrado Vectores relacionados";
  term: string = '';
  filterValue: string = null;
  icroundSearch       = iconify.icroundSearch;
  faSave              = iconfa.faSave;
  icroundLineAxis     = iconify.icroundLineAxis;
  visibleColumns;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 

  tableColumnsFijo:     TableColumn<any>[] = VectoresFijoConfigure;  
  tableColumnsVariable: TableColumn<any>[] = VectoresVariableConfigure;
  tableColumns:         TableColumn<any>[]=this.tableColumnsFijo;
  constructor( private inversionesService: InversionesService, private componentService: ComponentesService, 
    private changeDetector: ChangeDetectorRef) 
  { }


  ngOnInit() {
    if(this.tipoRenta=="V"){
      this.tableColumns=this.tableColumnsVariable;
    }
    this.visibleColumns = this.tableColumns.map(column => column.property);
    this.dataSource = new MatTableDataSource(this.dataFondoSource);
    this.subject$.next(this.dataFondoSource);
    this.data$.pipe(
      filter<Vector[]>(Boolean)
    ).subscribe(customers => {
      this.dataSource.data = customers;
    });
    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.searchTerm(value));
    this.changeDetector.detectChanges();
  }

   searchTerm(term: string) {
    this.isLoading = true;
     if (!this.dataSource) {
      return;
    }
    term = term.trim();
    term = term.toLowerCase();
    this.dataSource.filter = term;
    this.isLoading = false;
  } 

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  guardarVector() {
    this.inversionesService.postVector(this.dataFondoSource).subscribe((res: any) => {
      if (res.success) {
        try{new ToastAlertComponent("success", "Se ha guardado el vector de forma exitosa");}finally{
           location.reload();
        }      
      } else {
        try{new ToastAlertComponent("error", "Ocurrió un problema al guardar vector");}finally{ /*  */}
      }
    }, error => {
      try{new ToastAlertComponent("error",  "Ocurrió un error interno al guardar vector");}finally{ /*  */}
    })
  }

}


