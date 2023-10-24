import { Component, OnInit } from '@angular/core';
import icSearch from '@iconify/icons-ic/search';

@Component({
  selector: 'vex-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {
  icSearch = icSearch
  constructor() { }

  ngOnInit(): void {
  }

}
