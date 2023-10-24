import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource }         from '@angular/material/table';
import { MatPaginator }               from '@angular/material/paginator';
import { MatSort }                    from '@angular/material/sort';
import { iconify }                    from 'src/static-data/icons';
import { ReporteDTO }                 from '../../../model/models';
import { TableColumn }                from '../../../../@vex/interfaces/table-column.interface';
import { stagger20ms }                from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms }              from '../../../../@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms }           from '../../../../@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-table-reports',
  templateUrl: './table-reports.component.html',
  styleUrls: ['./table-reports.component.scss'],
  animations: [
    stagger20ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class TableReportsComponent<T> implements OnInit {

  @Input() data: T[];
  @Input() columns: TableColumn<T>[];

  @Output() OpenViewFilterReport = new EventEmitter<ReporteDTO >();
  @Output() generateReport= new EventEmitter();

  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  icbaselineFindInPage =iconify.ictwotoneDownloading;

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.visibleColumns = this.columns.map(column => column.property);
    }

    if (changes.data) {
      this.dataSource.data = this.data;
    }

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
