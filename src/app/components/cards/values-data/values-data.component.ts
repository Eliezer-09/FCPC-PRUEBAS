import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@visurel/iconify-angular';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger80ms } from 'src/@vex/animations/stagger.animation';
import faCaretUp from '@iconify/icons-fa-solid/caret-up';
import faCaretDown from '@iconify/icons-fa-solid/caret-down';
@Component({
  selector: 'vex-values-data',
  templateUrl: './values-data.component.html',
  styleUrls: ['./values-data.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger80ms
  ]
})
export class ValuesDataComponent implements OnInit {

  @Input() icon: Icon;
  @Input() value: string;
  @Input() label: string;
  @Input() change: number;
  @Input() helpText: string;
  @Input() iconClass: string;
  @Input() detalles: any[];
  @Input() segmento: any;
  @Input() spinner: boolean=true;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  showButton: boolean;
  showFrontCard = false;

  constructor(
  ) { }

  ngOnInit() {

  }
}