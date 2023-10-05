import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';

@Component({
  selector: 'vex-table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  animations: [
    stagger80ms,
    fadeInRight400ms
  ],
})
export class TableMenuComponent implements OnInit {

  @Input() activeCategory;
  @Output() filterChange = new EventEmitter();
  @Input() items= [];
  constructor() { }

  ngOnInit() {
  }
  setFilter(category) {
    this.activeCategory = category;
    return this.filterChange.emit(category);
    
  }

  isActive(category) {
    return this.activeCategory === category;
  }

}
