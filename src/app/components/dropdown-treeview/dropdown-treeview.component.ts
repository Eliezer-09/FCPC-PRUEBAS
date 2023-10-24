import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, OnInit } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select';

@Component({
  selector: 'ngx-dropdown-treeview-select',
  templateUrl: './dropdown-treeview.component.html',
  styleUrls: [
    './dropdown-treeview.component.scss'
  ],
  providers: [
    { provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }
  ]
})
export class DropdownTreeviewSComponent implements OnInit,OnChanges {
  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Input() title: string;
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  filterText: string;
  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  constructor(
    public i18n: TreeviewI18n
  ) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasCollapseExpand: false,
      hasFilter: true,
      maxHeight: 500
    });
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
 
  }

  ngOnInit(): void {
    this.dropdownTreeviewSelectI18n.textDeafult=this.title;
  }

  ngOnChanges(): void {
  
    this.updateSelectedItem();
  }

  select(item: TreeviewItem): void {
    if (!item.children) {
      this.selectItem(item);
    }
  }

  private updateSelectedItem(): void {
    if (!isNil(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
      console.log( this.value)
      console.log(selectedItem)
/*       this.dropdownTreeviewSelectI18n.selectedItem=selectedItem */
      this.selectItem(selectedItem);
    }
  }

  private selectItem(item: TreeviewItem): void {
    console.log(item)
    console.log(this.dropdownTreeviewSelectI18n.selectedItem)
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      console.log(this.dropdownTreeviewComponent)
      if (this.dropdownTreeviewComponent) {
        console.log("esta update")
        this.dropdownTreeviewComponent.onSelectedChange([item]);
      }

      if (item) {
        if (this.value !== item.value) {
          this.value = item.value;
          this.valueChange.emit(item);
        }else{
          console.log(this.value)
          console.log(item)
          this.valueChange.emit(item);
        }
      }
    }
  }
}