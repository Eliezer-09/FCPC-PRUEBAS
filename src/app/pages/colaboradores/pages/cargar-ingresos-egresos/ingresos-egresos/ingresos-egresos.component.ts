import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl }                              from '@angular/forms';
import { MatPaginator }                             from '@angular/material/paginator';
import { MatSort }                                  from '@angular/material/sort';
import { MatTableDataSource }                       from '@angular/material/table';
import { UntilDestroy, untilDestroyed }             from '@ngneat/until-destroy';
import { fadeInUp400ms }                            from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms }                              from 'src/@vex/animations/stagger.animation';
import { iconify,iconfa}                            from 'src/static-data/icons';
import { TableColumn }                              from '../../../../../../@vex/interfaces/table-column.interface';
import { fadeInRight400ms }                         from 'src/@vex/animations/fade-in-right.animation';
import { Vector }                                   from 'src/app/model/models';
import { Observable, ReplaySubject }                from 'rxjs';
import { filter }                                   from 'rxjs/operators';
import icCheck from '@iconify/icons-fa-solid/check-circle';
import icError from '@iconify/icons-ic/highlight-off';
import { IngresosEgresosConfigure } from 'src/static-data/configure-table/colaboradores/configure-table-ingresos-egresos';

@UntilDestroy()
@Component({
  selector: 'vex-ingresos-egresos',
  templateUrl: './ingresos-egresos.component.html',
  styleUrls: ['./ingresos-egresos.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms,
    fadeInRight400ms
  ],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngresosEgresosComponent implements OnInit,AfterViewInit{
  @Input() dataFondoSource: Vector[] = [];
  @Input() title:string='';
  @Input() isLoading: boolean;
  @Input() habilitarGuardar: boolean;
  @Output() guardar= new EventEmitter();
  @Input() footerdata: any[];
  icError = icError;
  icCheck = icCheck;
  subject$: ReplaySubject<Vector[]> = new ReplaySubject<Vector[]>(1);
  data$: Observable<any> = this.subject$.asObservable();
  searchCtrl = new FormControl();
  layoutCtrl = new FormControl('boxed');
  dataSource: MatTableDataSource<Vector> | null;
  pageSize = 10;
  infoMessage = "No se ha encontrado Ingresos/Egresos";
  term: string = '';
  filterValue: string = null;
  icroundSearch       = iconify.icroundSearch;
  faSave              = iconfa.faSave;
  icroundRequestPage     = iconify.icroundRequestPage;
  visibleColumns;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
 

  tableColumns: TableColumn<any>[]=IngresosEgresosConfigure;
  constructor(
    private changeDetector: ChangeDetectorRef) 
  { }


  ngOnInit() {
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



}


