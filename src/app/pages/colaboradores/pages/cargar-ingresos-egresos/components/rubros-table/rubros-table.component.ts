import { Component, Inject, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "vex-rubros-table",
  templateUrl: "./rubros-table.component.html",
  styleUrls: ["./rubros-table.component.scss"],
})
export class RubrosTableComponent<T>  implements OnInit {
  @Input() data: T[];
  @Input() total: any;
  @Input() showTotal: boolean=true;
  @Input() nameTotal: string='';
  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = ['rubro', 'monto'];
  visibleColumns: Array<keyof T | string>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor( ) { }
  ngOnInit(): void {
    
    this.dataSource.data = this.data;
    if((this.total==undefined || this.total==null) && this.showTotal ){
  /*     let total = this.data.reduce((total, item) => total + item["monto"], 0); */
      this.total={formato:"", monto:""}
    }
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data) {
      this.dataSource.data = this.data;
    }

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

 
  
}
