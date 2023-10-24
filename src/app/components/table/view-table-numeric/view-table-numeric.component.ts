
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource }         from '@angular/material/table';
import { MatPaginator }               from '@angular/material/paginator';
import { MatSort }                    from '@angular/material/sort';
import { iconify }                    from 'src/static-data/icons';
import { TableColumn }                from '../../../../@vex/interfaces/table-column.interface';
import { stagger20ms }                from '../../../../@vex/animations/stagger.animation';
import { fadeInUp400ms }              from '../../../../@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms }           from '../../../../@vex/animations/scale-fade-in.animation';
import { DOCUMENT }                   from '@angular/common';

@Component({
  selector: 'vex-view-table-numeric',
  templateUrl: './view-table-numeric.component.html',
  styleUrls: ['./view-table-numeric.component.scss'],
  animations: [
    stagger20ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})

export class ViewTableNumericComponent<T> implements OnInit {

  
  @Input() data: T[];
  @Input() footerdata: T[];
  @Input() columns: TableColumn<T>[];
  @Input() menubutton: boolean=false;
  @Input() actions: any[]=[];
  @Output() actionMenu= new EventEmitter();
  @Output() generateRouter= new EventEmitter();
  visibleColumns: Array<keyof T | string>;
  dataSource = new MatTableDataSource<T>();
  @Input() routers: any[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  icroundSearch =iconify.icroundManageSearch;
  icroundMoreVert =iconify.icroundMoreVert;

  constructor(  @Inject(DOCUMENT) private document: Document,) { }

  ngOnInit() {
  }

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
